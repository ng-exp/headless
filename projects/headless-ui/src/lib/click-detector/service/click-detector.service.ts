import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClickDetectorService {
  readonly clickEvent$ = new Subject<EventTarget>();

  constructor() {}
}
