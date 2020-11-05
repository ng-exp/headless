import { ClickDetectorDirective, ClickDetectorService } from '..';

describe('ClickDetectorDirective', () => {
  it('should create an instance', () => {
    const directive = new ClickDetectorDirective(new ClickDetectorService());
    expect(directive).toBeTruthy();
  });
});
