import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TreeNode } from '../tree.service';

@Component({
  selector: 'app-create-node-dialog',
  templateUrl: './create-node-dialog.component.html',
  styleUrls: ['./create-node-dialog.component.scss'],
})
export class CreateNodeDialogComponent {
  newNodeName: string = '';

  constructor(
    public dialogRef: MatDialogRef<CreateNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parentNode: TreeNode, currentNodes: TreeNode[] }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.dialogRef.close(this.newNodeName);
  }
}
