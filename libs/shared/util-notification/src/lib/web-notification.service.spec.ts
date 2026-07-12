import { TestBed } from '@angular/core/testing';
import { WebNotificationService } from './web-notification.service';
import { ToastrService } from 'ngx-toastr';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('WebNotificationService', () => {
  let service: WebNotificationService;
  let toastrSpy: {
    error: any;
    success: any;
  };

  beforeEach(() => {
    // Create a mock for ToastrService
    toastrSpy = {
      error: vi.fn(),
      success: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        WebNotificationService,
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });

    service = TestBed.inject(WebNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showError', () => {
    it('should call toastr.error with provided message and title', () => {
      const message = 'Custom Error Message';
      const title = 'Custom Title';

      service.showError(message, title);

      expect(toastrSpy.error).toHaveBeenCalledWith(message, title);
    });

    it('should call toastr.error with default values when none are provided', () => {
      service.showError();

      expect(toastrSpy.error).toHaveBeenCalledWith(
        'There was an error',
        'Error',
      );
    });
  });

  describe('showSuccess', () => {
    it('should call toastr.success with provided message and title', () => {
      const message = 'Operation successful';
      const title = 'Great!';

      service.showSuccess(message, title);

      expect(toastrSpy.success).toHaveBeenCalledWith(message, title);
    });

    it('should call toastr.success with default title and empty message when none are provided', () => {
      service.showSuccess();

      expect(toastrSpy.success).toHaveBeenCalledWith('', 'Success');
    });
  });
});
