import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup } from '@angular/forms';
import { FpStore } from '../../services/fp.store';
import { FichePaieInput, Avantage } from '../../models/fp.model';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html'
})
export class FormComponent {
  private store = inject(FpStore);
  private fb = inject(FormBuilder);
  showHeuresSup = false;
  showPrime = false;
  showIndemnite = false;
  showAutresAvantages = false;
  form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    poste: ['', Validators.required],
    salaireBase: [0, [Validators.required, Validators.min(0)]],
    prime: [0, Validators.min(0)],
    heureSup: [0, Validators.min(0)],
    salaireheureSup: [0, Validators.min(0)],
    indemnite: [0, Validators.min(0)],
    autresAvantages: this.fb.array([this.createAvantage()]),
    nbCharge: [0, Validators.min(0)],
    congesPris: [0, Validators.min(0)],
    joursOuvrablesParMois: [22, Validators.min(1)]
  });
  toggleHeuresSup() {
    this.showHeuresSup = !this.showHeuresSup;
  }
  togglePrime() {
    this.showPrime = !this.showPrime;
  }
  toggleIndemnite() {
    this.showIndemnite = !this.showIndemnite;
  }

  toggleAutresAvantages() {
    this.showAutresAvantages = !this.showAutresAvantages;
  }
  // Getter pratique pour le FormArray
  get autresAvantages(): FormArray {
    return this.form.get('autresAvantages') as FormArray;
  }

  // Création d'un avantage (FormGroup)
  createAvantage(): FormGroup {
    return this.fb.group({
      nom: [''],
      montant: [0, Validators.min(0)]
    });
  }

  addAvantage() {
    this.autresAvantages.push(this.createAvantage());
  }

  removeAvantage(index: number) {
    if (this.autresAvantages.length > 1) {
      this.autresAvantages.removeAt(index);
    }
  }

  submit() {
    if (this.form.valid) {
      const data = this.form.getRawValue() as FichePaieInput;

      // Transformer les montants pour s'assurer qu'ils sont bien des nombres
      data.autresAvantages = (data.autresAvantages ?? []).map((v: any) => ({
        nom: v.nom,
        montant: Number(v.montant) || 0
      }));

      this.store.setInput(data);
    } else {
      this.form.markAllAsTouched();
      alert('Veuillez remplir correctement tous les champs requis.');
    }
  }

}