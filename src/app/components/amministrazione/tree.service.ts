import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
}

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}
