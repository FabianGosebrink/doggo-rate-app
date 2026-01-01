import { TestBed } from '@angular/core/testing';
import { PlatformInformationService } from './platform-information.service';
import { Capacitor } from '@capacitor/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('PlatformInformationService', () => {
  let service: PlatformInformationService;

  beforeEach(() => {
    service = TestBed.inject(PlatformInformationService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isMobile', () => {
    it('should return true when Capacitor.isNativePlatform() is true', () => {
      // Arrange
      vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);

      // Act
      const result = service.isMobile;

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when Capacitor.isNativePlatform() is false', () => {
      // Arrange
      vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(false);

      // Act
      const result = service.isMobile;

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isElectron', () => {
    it('should return true when userAgent contains "electron/"', () => {
      // Arrange
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
        ' electron/',
      );

      // Act
      const result = service.isElectron;

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when userAgent does not contain "electron/"', () => {
      // Arrange
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('chrome');

      // Act
      const result = service.isElectron;

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('platform', () => {
    it('should return "Desktop" when isElectron is true', () => {
      // Arrange
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
        ' electron/',
      );

      // Act
      const result = service.platform;

      // Assert
      expect(result).toBe('Desktop');
    });

    it('should return "Mobile" when isMobile is true', () => {
      // Arrange
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('chrome');
      vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);

      // Act
      const result = service.platform;

      // Assert
      expect(result).toBe('Mobile');
    });

    it('should return "Web" when both are false', () => {
      // Arrange
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('chrome');
      vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(false);

      // Act
      const result = service.platform;

      // Assert
      expect(result).toBe('Web');
    });
  });
});
