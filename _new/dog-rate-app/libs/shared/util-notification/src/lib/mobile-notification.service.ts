import { Injectable } from '@angular/core';
import { Toast } from '@capacitor/toast';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class MobileNotificationService implements NotificationService {
  showError(message?: string, title?: string): void {
    Toast.show({
      text: title || message || 'Error',
      position: 'bottom',
    }).then();
  }

  showSuccess(message?: string, title?: string): void {
    Toast.show({
      text: title || message || 'Success',
      position: 'bottom',
    }).then();
  }
}
