import { describe, expect, it } from 'vitest';
import { environment } from './environment';

describe('environment', () => {
  it('should be the non-production configuration', () => {
    // Act & Assert
    expect(environment).toEqual({
      production: false,
      server: 'https://ratemydoggo.azurewebsites.net/',
    });
  });
});
