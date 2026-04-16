from django.db import connection, transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TreeView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("EXEC sp_GetAllTrees")
                rows = cursor.fetchall()
                if not rows:
                    return Response([], status=status.HTTP_200_OK)

                columns = [col[0] for col in cursor.description]
                flat_data = [dict(zip(columns, row)) for row in rows]

            # Group by TreeID and build nested structure
            trees_map = {}
            for item in flat_data:
                tid = item['TreeID']
                if tid not in trees_map:
                    trees_map[tid] = []
                trees_map[tid].append(item)

            result = []
            for tid, tags in trees_map.items():
                tree_structure = self.build_tree_recursive(tags)
                if tree_structure:
                    result.append({
                        "id": tid,
                        "name": tree_structure.get('name', 'root'),
                        "tree": tree_structure
                    })

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def build_tree_recursive(self, tags):
        # Create a mapping of TagID -> Node
        nodes = {}
        for t in tags:
            node = {
                "id": t['TagID'],
                "name": t['TagName'] or 'root',
                "isopen": True
            }
            if t['TagData']:
                node['data'] = t['TagData']
            else:
                node['children'] = []
            nodes[t['TagID']] = node

        root = None
        for t in tags:
            node = nodes[t['TagID']]
            if t['ParentID'] is None:
                root = node
            else:
                parent = nodes.get(t['ParentID'])
                if parent:
                    if 'children' not in parent:
                        parent['children'] = []
                        if 'data' in parent: del parent['data']
                    parent['children'].append(node)
        return root

    def post(self, request):
        tree_data = request.data # The root node of the tree
        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    # 1. Create a new Tree entry
                    cursor.execute("INSERT INTO Trees (CreatedAt, UpdatedAt) VALUES (GETDATE(), GETDATE())")
                    cursor.execute("SELECT SCOPE_IDENTITY()")
                    row = cursor.fetchone()
                    if not row or row[0] is None:
                        raise Exception("Failed to get new TreeID")
                    tree_id = int(row[0])

                    # 2. Recursively save tags
                    self.save_node_recursive(cursor, tree_id, None, tree_data)

            return Response({"message": "Tree saved successfully", "id": tree_id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "ID required"}, status=status.HTTP_400_BAD_REQUEST)

        tree_data = request.data
        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    # Delete existing tags. Note: If no cascade, must delete in specific order or handle FK.
                    # Since we use ParentID, we delete children first.
                    # A simple way to handle this without knowing depth is multiple passes or temp disabling FK.
                    # However, if TreeID is the filter, we can try to delete all.
                    # In MSSQL, if there is a self-referencing FK without cascade,
                    # we must delete from leaves up.
                    self.delete_tags_recursive(cursor, pk)

                    # Update tree timestamp
                    cursor.execute("UPDATE Trees SET UpdatedAt = GETDATE() WHERE TreeID = %s", [pk])

                    # Recursively save tags
                    self.save_node_recursive(cursor, pk, None, tree_data)

            return Response({"message": "Tree updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete_tags_recursive(self, cursor, tree_id):
        # To handle self-referencing FK constraint in MSSQL without cascade:
        # We can delete all tags for the tree in a loop until none are left or use a CTE.
        # But the simplest is often to just try deleting several times if it's not too deep.
        # Or better: delete where ParentID is NOT in (select TagID from Tags) repeated.

        # A more robust way: Use a CTE to find leaf nodes and delete them iteratively
        while True:
            cursor.execute("""
                DELETE FROM Tags
                WHERE TreeID = %s
                AND TagID NOT IN (SELECT ParentID FROM Tags WHERE ParentID IS NOT NULL AND TreeID = %s)
            """, [tree_id, tree_id])
            if cursor.rowcount == 0:
                break

    def save_node_recursive(self, cursor, tree_id, parent_id, node):
        name = node.get('name', 'root')
        data = node.get('data')

        # Use the stored procedure to insert the node
        cursor.execute(
            "EXEC sp_UpdateTreeData @TreeID=%s, @TagName=%s, @TagData=%s, @TagID=NULL, @ParentID=%s",
            [tree_id, name, data, parent_id]
        )

        # The SP returns the NewID in its result set
        row = cursor.fetchone()
        if row:
            tag_id = int(row[0])
        else:
            # Fallback
            cursor.execute("SELECT SCOPE_IDENTITY()")
            tag_id = int(cursor.fetchone()[0])

        if 'children' in node and isinstance(node['children'], list) and len(node['children']) > 0:
            for child in node['children']:
                self.save_node_recursive(cursor, tree_id, tag_id, child)
