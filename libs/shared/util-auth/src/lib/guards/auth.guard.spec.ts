import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideRouter, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { firstValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isAuthenticated } from './auth.guard';

describe('isAuthenticated', () => {
  let router: Router;

  function configureGuard(authenticated: boolean) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: OidcSecurityService,
          useValue: {
            isAuthenticated$: of({ isAuthenticated: authenticated }),
          },
        },
      ],
    });

    router = TestBed.inject(Router);
  }

  function runGuard(): Promise<boolean> {
    const result = TestBed.runInInjectionContext(() =>
      isAuthenticated({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    ) as Observable<boolean>;

    return firstValueFrom(result);
  }

  it('should allow activation when the user is authenticated', async () => {
    // Arrange
    configureGuard(true);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    // Act
    const canActivate = await runGuard();

    // Assert
    expect(canActivate).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should block activation and redirect to /dogs when the user is not authenticated', async () => {
    // Arrange
    configureGuard(false);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    // Act
    const canActivate = await runGuard();

    // Assert
    expect(canActivate).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/dogs']);
  });
});
