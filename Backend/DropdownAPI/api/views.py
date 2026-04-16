from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TreeView(APIView):
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("EXEC sp_GetAllTrees")
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                data = [dict(zip(columns, row)) for row in rows]

                # If you need to build a nested tree structure from flat rows,
                # you can add a helper function here.
                return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        tree_id = request.data.get('TreeID')
        tag_name = request.data.get('TagName')
        tag_data = request.data.get('TagData')
        tag_id = request.data.get('TagID') # Can be null for insert

        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "EXEC sp_UpdateTreeData @TreeID=%s, @TagName=%s, @TagData=%s, @TagID=%s",
                    [tree_id, tag_name, tag_data, tag_id]
                )
                return Response({"message": "Success"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
