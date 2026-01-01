import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class WebNotificationService implements NotificationService {
  readonly #toastr = inject(ToastrService);

  showError(message?: string, title?: string): void {
    message = message || 'There was an error';
    title = title || 'Error';

    this.#toastr.error(message, title);
  }

  showSuccess(message?: string, title?: string): void {
    message = message || '';
    title = title || 'Success';

    this.#toastr.success(message, title);
  }
}
