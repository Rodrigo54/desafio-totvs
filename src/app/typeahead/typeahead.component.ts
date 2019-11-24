import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, switchMap } from 'rxjs/operators';

import { DatabaseService } from '../database/database.service';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss']
})
export class TypeaheadComponent implements OnInit {

  searchCtrl = new FormControl('', { updateOn: 'change' });
  filteredStates$: Observable<any>;
  form: FormGroup;

  constructor(
    private service: DatabaseService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      searchCtrl: this.searchCtrl
    });
    this.filteredStates$ = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      filter(i => i  !== ''),
      filter((i: string) => i.length > 2),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(state => this.service.search(state))
    );
  }

  displayWith(item: any) {
    return item.name;
  }

  onSubmit() {
    const value = this.searchCtrl.value ? this.searchCtrl.value.name ? this.searchCtrl.value.name : this.searchCtrl.value : '';
    this.service.search(value, 30, true).subscribe();
  }

}
