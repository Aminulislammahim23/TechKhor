import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  it('should be defined', () => {
    const reflector = new Reflector();
    expect(new RolesGuard(reflector)).toBeDefined();
  });
});
