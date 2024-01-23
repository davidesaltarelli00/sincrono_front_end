import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  private treeData: TreeNode[] = [];

  getTree(): TreeNode[] {
    return this.treeData;
  }

  addNode(parent: TreeNode | null, newNode: TreeNode): void {
    if (!parent) {
      this.treeData.push(newNode);
    } else {
      parent.children.push(newNode);
    }
  }

  removeNode(parent: TreeNode | null, index: number): void {
    if (!parent) {
      this.treeData.splice(index, 1);
    } else {
      parent.children.splice(index, 1);
    }
  }

  createNewBranch(): TreeNode {
    return { name: 'Nuovo Nodo', children: [], showDetails: false };
  }
}

export interface TreeNode {
  name: string;
  children: TreeNode[];
  showDetails: boolean;
}
