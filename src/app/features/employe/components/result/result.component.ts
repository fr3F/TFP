import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FpStore } from '../../services/fp.store';
import { PdfHelper } from '../../../../core/helpers/pdf.helper';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html'
})
export class ResultComponent {
  store = inject(FpStore);
  result = computed(() => this.store.result());
  private notify = inject(NotificationService);

  downloadPdf() {
    const success = PdfHelper.generatePayslipPdf(this.result());

    if (success) {
      this.notify.success('Téléchargement réussi');
    } else {
      this.notify.error('Impossible de générer le PDF');
    }
  }

}
