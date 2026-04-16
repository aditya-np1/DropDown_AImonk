import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Node } from '../types/dropdown';

@Component({
  selector: 'app-tnode',
  standalone: true,
  imports: [CommonModule, FormsModule, forwardRef(() => TNode)],
  templateUrl: './tnode.html',
  styleUrl: './tnode.css',
})
export class TNode {
  @Input() inputNode!: Node;

  isEditingName = false;

  toggleChildren() {
    this.inputNode.isopen = !this.inputNode.isopen;
  }

  addChild() {
    // 1. Requirement: If parent had "data", replace it with "children"
    if (this.inputNode.data !== undefined) {
      delete this.inputNode.data;
    }

    if (!this.inputNode.children) {
      this.inputNode.children = [];
    }

    // 2. Requirement: New child Tag must have name "New Child" and data "Data"
    const newNode: Node = {
      id: this.generateId(),
      name: 'New Child',
      data: 'Data',
      isopen: true
    };

    this.inputNode.children.push(newNode);
    this.inputNode.isopen = true;
  }

  enableEditName() {
    this.isEditingName = true;
  }

  saveName() {
    this.isEditingName = false;
  }

  generateId(): number {
    return Date.now() + Math.floor(Math.random() * 10000);
  }
}
