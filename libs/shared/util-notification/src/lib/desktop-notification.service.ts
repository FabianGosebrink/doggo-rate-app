import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class DesktopNotificationService implements NotificationService {
  showError(message?: string, title?: string): void {
    message = message || 'There was an error';
    title = title || 'Error';

    new Notification(title, { body: message });
  }

  showSuccess(message?: string, title?: string): void {
    message = message || '';
    title = title || 'Success';

    new Notification(title, { body: message });
  }
}
