import { TestBed } from '@angular/core/testing';
import { Toast } from '@capacitor/toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MobileNotificationService } from './mobile-notification.service';

vi.mock('@capacitor/toast', () => ({
  Toast: {
    show: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('MobileNotificationService', () => {
  let service: MobileNotificationService;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [MobileNotificationService],
    });

    service = TestBed.inject(MobileNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showError', () => {
    it('should show a toast with the provided title', () => {
      // Act
      service.showError('Custom Error Message', 'Custom Title');

      // Assert
      expect(Toast.show).toHaveBeenCalledWith({
        text: 'Custom Title',
        position: 'bottom',
      });
    });

    it('should show a toast with the message when no title is provided', () => {
      // Act
      service.showError('Custom Error Message');

      // Assert
      expect(Toast.show).toHaveBeenCalledWith({
        text: 'Custom Error Message',
        position: 'bottom',
      });
    });

    it('should show a default toast when nothing is provided', () => {
      // Act
      service.showError();

      // Assert
      expect(Toast.show).toHaveBeenCalledWith({
        text: 'Error',
        position: 'bottom',
      });
    });
  });

  describe('showSuccess', () => {
    it('should show a toast with the provided title', () => {
      // Act
      service.showSuccess('Operation successful', 'Great!');

      // Assert
      expect(Toast.show).toHaveBeenCalledWith({
        text: 'Great!',
        position: 'bottom',
      });
    });

    it('should show a default toast when nothing is provided', () => {
      // Act
      service.showSuccess();

      // Assert
      expect(Toast.show).toHaveBeenCalledWith({
        text: 'Success',
        position: 'bottom',
      });
    });
  });
});
