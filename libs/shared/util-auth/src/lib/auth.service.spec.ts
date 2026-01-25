import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { PlatformInformationService } from '@dog-rating/shared/util-platform-information';
import { lastValueFrom, of } from 'rxjs';
import { AuthService } from './auth.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let oidcSecurityService: OidcSecurityService;
  let platformInformationService: PlatformInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        MockProvider(OidcSecurityService),
        MockProvider(PlatformInformationService),
      ],
    });

    oidcSecurityService = TestBed.inject(OidcSecurityService);
    platformInformationService = TestBed.inject(PlatformInformationService);
    service = TestBed.inject(AuthService);
  });

  describe('login', () => {
    it('should call authorize with urlHandler when running in Electron', () => {
      // Arrange
      const mockWindow = { close: vi.fn() } as unknown as Window;
      vi.spyOn(window, 'open').mockReturnValue(mockWindow);
      vi.spyOn(platformInformationService, 'isElectron', 'get').mockReturnValue(
        true,
      );
      const authorizeSpy = vi.spyOn(oidcSecurityService, 'authorize');

      // Act
      service.login();

      // Assert
      expect(authorizeSpy).toHaveBeenCalledWith(undefined, {
        urlHandler: expect.any(Function),
      });
    });

    it('should open a new window with correct parameters when running in Electron', () => {
      // Arrange
      const mockWindow = { close: vi.fn() } as unknown as Window;
      const windowOpenSpy = vi
        .spyOn(window, 'open')
        .mockReturnValue(mockWindow);
      vi.spyOn(platformInformationService, 'isElectron', 'get').mockReturnValue(
        true,
      );
      const testAuthUrl = 'https://auth.example.com';

      vi.spyOn(oidcSecurityService, 'authorize').mockImplementation(
        (configId, options) => {
          if (options?.urlHandler) {
            options.urlHandler(testAuthUrl);
          }
        },
      );

      // Act
      service.login();

      // Assert
      expect(windowOpenSpy).toHaveBeenCalledWith(
        testAuthUrl,
        '_blank',
        'nodeIntegration=no',
      );
    });

    it('should call authorize without urlHandler when not running in Electron', () => {
      // Arrange
      vi.spyOn(platformInformationService, 'isElectron', 'get').mockReturnValue(
        false,
      );
      const authorizeSpy = vi.spyOn(oidcSecurityService, 'authorize');

      // Act
      service.login();

      // Assert
      expect(authorizeSpy).toHaveBeenCalledWith();
    });
  });

  describe('checkAuth', () => {
    it('should not throw error if modal window does not exist', () => {
      // Arrange
      const mockLoginResponse = { isAuthenticated: true } as any;
      vi.spyOn(oidcSecurityService, 'checkAuth').mockReturnValue(
        of(mockLoginResponse),
      );

      // Act & Assert
      expect(() => service.checkAuth('https://callback.url')).not.toThrow();
    });

    it('should call oidcSecurityService.checkAuth with provided url', () => {
      // Arrange
      const testUrl = 'https://callback.url?code=123';
      const mockLoginResponse = { isAuthenticated: true } as any;
      const checkAuthSpy = vi
        .spyOn(oidcSecurityService, 'checkAuth')
        .mockReturnValue(of(mockLoginResponse));

      // Act
      service.checkAuth(testUrl);

      // Assert
      expect(checkAuthSpy).toHaveBeenCalledWith(testUrl);
    });

    it('should call oidcSecurityService.checkAuth with undefined when url is null', () => {
      // Arrange
      const mockLoginResponse = { isAuthenticated: true } as any;
      const checkAuthSpy = vi
        .spyOn(oidcSecurityService, 'checkAuth')
        .mockReturnValue(of(mockLoginResponse));

      // Act
      service.checkAuth(null);

      // Assert
      expect(checkAuthSpy).toHaveBeenCalledWith(undefined);
    });

    it('should return observable from oidcSecurityService.checkAuth', async () => {
      // Arrange
      const mockLoginResponse = {
        isAuthenticated: true,
        userData: { name: 'Test' },
      } as any;
      vi.spyOn(oidcSecurityService, 'checkAuth').mockReturnValue(
        of(mockLoginResponse),
      );

      // Act
      const response = await lastValueFrom(
        service.checkAuth('https://callback.url'),
      );

      // Assert
      expect(response).toEqual(mockLoginResponse);
    });
  });

  describe('logout', () => {
    it('should call oidcSecurityService.logoff', () => {
      // Arrange
      const logoffSpy = vi
        .spyOn(oidcSecurityService, 'logoff')
        .mockReturnValue(of({}));

      // Act
      service.logout();

      // Assert
      expect(logoffSpy).toHaveBeenCalled();
    });

    it('should return observable from oidcSecurityService.logoff', async () => {
      // Arrange
      const mockResponse = { success: true };
      vi.spyOn(oidcSecurityService, 'logoff').mockReturnValue(of(mockResponse));

      // Act
      const response = await lastValueFrom(service.logout());

      // Assert
      expect(response).toEqual(mockResponse);
    });
  });
});
