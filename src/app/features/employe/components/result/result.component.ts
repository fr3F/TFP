import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FpStore } from '../../services/fp.store';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html'
})
export class ResultComponent {
  store = inject(FpStore);

  // Signal computed pour réagir aux changements
  result = computed(() => this.store.result());
}
