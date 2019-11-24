import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  itens$: Observable<any[]>;

  constructor(
    private service: DatabaseService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.itens$ = this.service.pokemons$;
  }

  openDialog(item: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'pokemon-dialog',
      width: '280px',
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
