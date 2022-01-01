import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private subjects = new Map<string, BehaviorSubject<any>>();

  constructor() { }

  set<T>(key: string, value: T) {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<T | undefined>(undefined));
    }
    this.subjects.get(key)!.next(value);
  }

  get<T>(key: string) {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<T | undefined>(undefined));
    }
    return this.subjects.get(key)!.asObservable().pipe(
      filter(x => x !== undefined),
      map(x => x as T)
    );
  }
}
