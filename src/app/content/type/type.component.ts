import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeComponent implements OnInit {

  @Input() type = 'Normal';
  css = '';
  constructor() { }

  ngOnInit() {
    this.css = this.type.toLowerCase();
  }

}
