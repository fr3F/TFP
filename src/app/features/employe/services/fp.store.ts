import { Injectable, signal } from '@angular/core';
import { FichePaieInput, FichePaieResult } from '../models/fp.model';

@Injectable({ providedIn: 'root' })
export class FpStore {
    private inputSignal = signal<FichePaieInput | null>(null);
    private resultSignal = signal<FichePaieResult | null>(null);

    input = this.inputSignal.asReadonly();
    result = this.resultSignal.asReadonly();

    setInput(data: FichePaieInput) {
        this.inputSignal.set(data);
    }

    setResult(result: FichePaieResult) {
        this.resultSignal.set(result);
    }
}
