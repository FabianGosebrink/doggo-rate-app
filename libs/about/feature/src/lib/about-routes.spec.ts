import { describe, expect, it } from 'vitest';
import { ABOUT_ROUTES } from './about-routes';
import { AboutComponent } from './about/about.component';

describe('ABOUT_ROUTES', () => {
  it('should show the about component on the root path', () => {
    // Assert
    expect(ABOUT_ROUTES).toEqual([{ path: '', component: AboutComponent }]);
  });
});
