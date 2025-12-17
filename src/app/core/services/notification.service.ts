import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  notify(message: string, icon: SweetAlertIcon = 'success') {
    Swal.fire({
      toast: true,
      position: 'top',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }

  success(msg: string) { this.notify(msg, 'success'); }
  error(msg: string) { this.notify(msg, 'error'); }
  warning(msg: string) { this.notify(msg, 'warning'); }
  info(msg: string) { this.notify(msg, 'info'); }
}
