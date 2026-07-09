import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth.store';
import { AuthService } from '../auth.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginResponse } from 'angular-auth-oidc-client';

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;
  let authService: AuthService;
  let router: Router;

  let authServiceMock: {
    login: any;
    logout: any;
    checkAuth: any;
  };

  const mockUserProfile = { email: 'test@dog.com', sub: '123' };

  beforeEach(() => {
    authServiceMock = {
      login: vi.fn(),
      logout: vi.fn().mockReturnValue(of({})),
      checkAuth: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([]),
      ],
    });

    store = TestBed.inject(AuthStore);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should have initial state', () => {
    expect(store.isLoggedIn()).toBe(false);
    expect(store.userProfile()).toBeNull();
    expect(store.userEmail()).toBe('');
    expect(store.userSub()).toBe('');
  });

  it('should call authService.login on login()', () => {
    // Act
    store.login();

    // Assert
    expect(authService.login).toHaveBeenCalled();
  });

  it('should reset state and navigate on logout()', () => {
    // Arrange
    const routerSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    // Act
    store.logout();

    // Assert
    expect(authService.logout).toHaveBeenCalled();
    expect(store.isLoggedIn()).toBe(false);
    expect(routerSpy).toHaveBeenCalledWith(['/dogs']);
  });

  it('should log error on logout failure', () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error');
    vi.spyOn(authService, 'logout').mockReturnValue(
      throwError(() => 'Logout Error'),
    );

    // Act
    store.logout();

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Logout Error');
  });

  describe('checkAuth', () => {
    it('should update state on successful authentication', () => {
      // Arrange
      const response: LoginResponse = {
        isAuthenticated: true,
        userData: mockUserProfile,
        accessToken: 'token',
        idToken: 'id',
        configId: 'cfg',
        errorMessage: '',
      };
      vi.spyOn(authService, 'checkAuth').mockReturnValue(of(response));

      // Act
      store.checkAuth('http://localhost');

      // Assert
      expect(store.isLoggedIn()).toBe(true);
      expect(store.userProfile()).toEqual(mockUserProfile);
      expect(store.userEmail()).toBe('test@dog.com');
      expect(store.userSub()).toBe('123');
    });

    it('should handle authentication failure', () => {
      // Arrange
      const response: LoginResponse = {
        isAuthenticated: false,
        userData: null,
        accessToken: '',
        idToken: '',
        configId: 'cfg',
        errorMessage: 'Error',
      };
      vi.spyOn(authService, 'checkAuth').mockReturnValue(of(response));

      // Act
      store.checkAuth(null);

      // Assert
      expect(store.isLoggedIn()).toBe(false);
      expect(store.userProfile()).toBeNull();
    });

    it('should log error on service failure', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      vi.spyOn(authService, 'checkAuth').mockReturnValue(
        throwError(() => 'API Error'),
      );

      store.checkAuth('url');

      expect(consoleSpy).toHaveBeenCalledWith('API Error');
    });
  });
});
