import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TNode } from './tnode';

describe('TNode', () => {
  let component: TNode;
  let fixture: ComponentFixture<TNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TNode],
    }).compileComponents();

    fixture = TestBed.createComponent(TNode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
