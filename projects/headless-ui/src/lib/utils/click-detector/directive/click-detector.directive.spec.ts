import { ClickDetectorDirective, ClickDetectorService } from '@lib/utils';

describe('ClickDetectorDirective', () => {
  it('should create an instance', () => {
    const directive = new ClickDetectorDirective(new ClickDetectorService());
    expect(directive).toBeTruthy();
  });
});
