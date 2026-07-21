import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DesktopNotificationService } from './desktop-notification.service';

describe('DesktopNotificationService', () => {
  let service: DesktopNotificationService;

  const notificationMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('Notification', notificationMock);

    TestBed.configureTestingModule({
      providers: [DesktopNotificationService],
    });

    service = TestBed.inject(DesktopNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showError', () => {
    it('should show a notification with provided message and title', () => {
      // Act
      service.showError('Custom Error Message', 'Custom Title');

      // Assert
      expect(notificationMock).toHaveBeenCalledWith('Custom Title', {
        body: 'Custom Error Message',
      });
    });

    it('should show a notification with default values when none are provided', () => {
      // Act
      service.showError();

      // Assert
      expect(notificationMock).toHaveBeenCalledWith('Error', {
        body: 'There was an error',
      });
    });
  });

  describe('showSuccess', () => {
    it('should show a notification with provided message and title', () => {
      // Act
      service.showSuccess('Operation successful', 'Great!');

      // Assert
      expect(notificationMock).toHaveBeenCalledWith('Great!', {
        body: 'Operation successful',
      });
    });

    it('should show a notification with default title and empty message when none are provided', () => {
      // Act
      service.showSuccess();

      // Assert
      expect(notificationMock).toHaveBeenCalledWith('Success', { body: '' });
    });
  });
});
