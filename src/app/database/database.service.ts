import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, of, pipe, BehaviorSubject, Observable } from 'rxjs';
import { delay, filter, first, map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  pokemonsSubject = new BehaviorSubject(undefined);
  pokemons$: Observable<any[]>;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.pokemons$ = this.pokemonsSubject.asObservable();
  }

  search(search: string, limit = 10, save = false) {
    return this.httpClient.get('assets/pokedex.json').pipe(
      map((pokemons: any[]) => {
        const regExp = new RegExp(search, 'ig');
        const ret = [];
        from(pokemons).pipe(
          filter(pokemon => regExp.test(pokemon.name)),
          take(limit),
        ).subscribe(result => {
          ret.push(result);
        }).unsubscribe();
        console.log('ret', ret);
        if (save) {
          this.pokemonsSubject.next(ret);
        }
        return ret;
      })
    );
  }

  find(id: number) {
    return this.httpClient.get('assets/pokedex.json').pipe(
      map((pokemons: any[]) => pokemons.find(i => i.id === id)),
    );
  }
}
