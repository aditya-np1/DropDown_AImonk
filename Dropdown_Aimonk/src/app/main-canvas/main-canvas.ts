import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TagService } from '../services/tag.service';
import { Node } from '../types/dropdown';
import { TNode } from '../tnode/tnode';
import { CommonModule } from '@angular/common';

interface TreeRecord {
  id?: number;
  name: string;
  tree: Node;
  exportedJson?: string | null;
}

@Component({
  selector: 'app-main-canvas',
  standalone: true,
  imports: [CommonModule, TNode],
  templateUrl: './main-canvas.html',
  styleUrl: './main-canvas.css',
})
export class MainCanvas implements OnInit {
  trees: TreeRecord[] = [];
  isLoading = true;

  constructor(private tagService: TagService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.fetchTrees();
  }

  fetchTrees() {
    debugger
    this.isLoading = true;
    this.tagService.getTrees().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          this.trees = data.map(item => ({
            id: item.id,
            name: item.name || 'Tree ' + item.id,
            tree: item.tree,
            exportedJson: null
          }));
        } else {
          this.trees = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch trees', err);
        // Default to a new tree if backend fails or is empty
        // this.addNewTree();
        this.isLoading = false;
      }
    });
  }

  addRoot() {
    const now = Date.now();
    const newTree: Node = {
      id: now,
      name: 'root',
      children: [
      ],
      data: 'DATA',
      isopen: false
    };
    this.trees.push({ name: 'root', tree: newTree, exportedJson: null });
    this.tagService.saveTree(newTree).subscribe({
      next: (res: any) => {
        this.trees[this.trees.length - 1].id = res.id;
        console.log('New tree created and saved to database!');
      },
      error: (err) => console.error('Error saving new tree:', err)
    });
  }

  exportTree(record: TreeRecord) {
    const extractData = (node: Node): any => {
      const result: any = { name: node.name };

      // Enforce the requirement: name + EITHER children OR data
      if (node.children && node.children.length > 0) {
        result.children = node.children.map(child => extractData(child));
      } else {
        result.data = node.data || '';
      }

      return result;
    };

    const exportedObject = extractData(record.tree);
    record.exportedJson = JSON.stringify(exportedObject, null, 2);

    if (record.id) {
      this.tagService.updateTree(record.id, exportedObject).subscribe({
        next: () => alert('Tree updated successfully!'),
        error: (err) => console.error('Error updating tree:', err)
      });
    } else {
      this.tagService.saveTree(exportedObject).subscribe({
        next: (res: any) => {
          record.id = res.id;
          alert('Tree saved to database!');
        },
        error: (err) => console.error('Error saving tree:', err)
      });
    }
  }
}
