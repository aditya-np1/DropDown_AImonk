import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TagService } from '../services/tag.service';
import { Node } from '../types/dropdown';
import { TNode } from '../tnode/tnode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-canvas',
  standalone: true,
  imports: [CommonModule, TNode],
  templateUrl: './main-canvas.html',
  styleUrl: './main-canvas.css',
})
export class MainCanvas implements OnInit {
  tree: Node | null = null;
  isLoading = true;
  exportedJson: string | null = null;

  constructor(
    private tagService: TagService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.fetchTree();
  }

  fetchTree() {
    this.isLoading = true;
    this.tagService.getTree().subscribe({
      next: (data: any) => {
        if (!data || (Array.isArray(data) && data.length === 0)) {
          this.tree = null;
        } else {
          this.tree = Array.isArray(data) ? { id: 0, name: 'Root', children: data, isopen: true } : data;
          if (this.tree && !this.tree.children) this.tree.children = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.tree = null;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createInitialTree() {
    const rootName = 'Root Node';
    const rootData = 'Initial Content';

    this.tagService.postTreeView({
      TreeID: 1,
      TagName: rootName,
      TagData: rootData,
      TagID: null
    }).subscribe({
      next: (res: any) => {
        this.tree = {
          id: res.TagID || Date.now(),
          name: rootName,
          data: rootData,
          children: [],
          isopen: true
        };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to create root', err)
    });
  }

  onAddTopLevelSibling(index: number) {
    if (!this.tree) {
      this.createInitialTree();
      return;
    }

    const newNodeName = 'New Child';
    const newNodeData = 'Data';

    this.tagService.postTreeView({
      TreeID: 1,
      TagName: newNodeName,
      TagData: newNodeData,
      TagID: null
    }).subscribe({
      next: (res: any) => {
        const newNode: Node = {
          id: res.TagID || Date.now(),
          name: newNodeName,
          data: newNodeData,
          children: [],
          isopen: true
        };
        if (!this.tree!.children) this.tree!.children = [];
        this.tree!.children.splice(index + 1, 0, newNode);
        this.cdr.detectChanges();
      }
    });
  }

  exportTree() {
    if (!this.tree) return;

    // Requirement: Extract only "name", "children", and "data" recursively
    const extractData = (node: Node): any => {
      const result: any = { name: node.name };

      if (node.children && node.children.length > 0) {
        result.children = node.children.map(child => extractData(child));
      } else {
        result.data = node.data || '';
      }

      return result;
    };

    // If we wrapped flat data in a virtual root, we export its children
    let exportedObject;
    if (this.tree.id === 0 && this.tree.name === 'Root') {
        exportedObject = this.tree.children?.map(child => extractData(child));
    } else {
        exportedObject = extractData(this.tree);
    }

    this.exportedJson = JSON.stringify(exportedObject, null, 2);

    // Requirement: Call REST API and save tree hierarchy
    this.tagService.saveTree(exportedObject).subscribe({
      next: () => alert('Tree exported and saved to database successfully!'),
      error: (err) => console.error('Error saving exported tree:', err)
    });
  }
}
