import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClickDetectorService {
  clickEvent$ = new Subject<EventTarget>();

  constructor() {}
}
