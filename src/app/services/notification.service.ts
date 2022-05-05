import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string) {
    this.toastr.success(title, message, {
      progressBar: true,
      closeButton: true,
    });
  }

  showError(message: string, title: string) {
    this.toastr.error(title, message, {
      progressBar: true,
      closeButton: true,
    });
  }

  showWarning(message: string, title: string) {
    this.toastr.warning(title, message, {
      progressBar: true,
      closeButton: true,
    });
  }

  showInfo(message: string, title: string) {
    this.toastr.info(title, message, {
      progressBar: true,
      closeButton: true,
    });
  }
}
