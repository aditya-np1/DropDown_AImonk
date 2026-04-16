import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagViewComponent } from '../node/node';
import { Node } from '../types/dropdown';

interface Star {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TagViewComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  

  stars: Star[] = [];

  ngOnInit() {
    this.generateStars();
  }

  generateStars() {
    for (let i = 0; i < 200; i++) {
      this.stars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5
      });
    }
  }

  // saveTree() {
  //   console.log('Tree data to save:', JSON.stringify(this.rootTag));
  //   alert('Hierarchy saved to console!');
  // }
}
