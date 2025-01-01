import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private toaster: ToastrService) {}

  success(message: string, title: string = 'Succès'): void {
    this.toaster.success(message, title);
  }

  error(message: string, title: string = 'Erreur'): void {
    this.toaster.error(message, title);
  }

  warning(message: string, title: string = 'Attention'): void {
    this.toaster.warning(message, title);
  }

  info(message: string, title: string = 'Info'): void {
    this.toaster.info(message, title);
  }

  cancel(message: string, title: string = 'Annulé'): void {
    this.toaster.info(message, title);
  }
}
