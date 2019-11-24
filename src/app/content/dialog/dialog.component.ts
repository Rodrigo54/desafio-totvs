import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from 'src/app/database/database.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  pokemon$: Observable<any>;
  constructor(
    private service: DatabaseService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.pokemon$ = this.service.find(this.data.id);
  }

  close(): void {
    this.dialogRef.close();
  }

}
