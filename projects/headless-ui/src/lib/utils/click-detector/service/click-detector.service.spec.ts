import { TestBed } from '@angular/core/testing';
import { ClickDetectorService } from '@lib/utils';

describe('ClickDetectorService', () => {
  let service: ClickDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClickDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
