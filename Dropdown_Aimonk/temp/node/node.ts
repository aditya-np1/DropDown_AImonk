import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Node } from '../types/dropdown';

@Component({
  selector: 'app-tag-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './node.html',
  styleUrl: './node.css',
})
export class TagViewComponent {
  @Input() tag!: Node;
  isOpen: boolean = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  addChild() {
    if (this.tag.data !== undefined) {
      delete this.tag.data;
    }
    if (!this.tag.children) {
      this.tag.children = [];
    }
    this.tag.children.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: 'New Tag',
      data: 'Data'
    });
    this.isOpen = true;
  }
}
