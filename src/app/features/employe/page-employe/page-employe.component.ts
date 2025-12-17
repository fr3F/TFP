import { Component, inject, computed, effect } from '@angular/core';
import { FormComponent } from '../components/form/form.component';
import { ResultComponent } from '../components/result/result.component';
import { FpService } from '../services/fp.service';
import { FpStore } from '../services/fp.store';

@Component({
  selector: 'app-page-employe',
  standalone: true,
  imports: [FormComponent, ResultComponent],
  templateUrl: './page-employe.component.html',
  styleUrls: ['./page-employe.component.css']
})
export class PageEmployeComponent {
  private fpService = inject(FpService);
  store = inject(FpStore);

  result = computed(() => {
    const data = this.store.input();
    return data ? this.fpService.calculer(data) : null;
  });

  constructor() {
    // Ajouter allowSignalWrites: true
    effect(() => {
      const calculatedResult = this.result();
      if (calculatedResult) {
        this.store.setResult(calculatedResult);
      }
    }, { allowSignalWrites: true });
  }
}