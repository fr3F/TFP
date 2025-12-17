import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup } from '@angular/forms';
import { FpStore } from '../../services/fp.store';
import { FichePaieInput, Avantage } from '../../models/fp.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html'
})
export class FormComponent {
  private store = inject(FpStore);
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);

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
    autresAvantages: this.fb.array([]),
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
    // Ajouter un avantage vide quand on active la section
    if (this.showAutresAvantages && this.autresAvantages.length === 0) {
      this.addAvantage();
    }
  }

  get autresAvantages(): FormArray {
    return this.form.get('autresAvantages') as FormArray;
  }

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
    this.autresAvantages.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      const data = this.form.getRawValue() as FichePaieInput;

      const joursOuvrables = data.joursOuvrablesParMois ?? 22;
      const congesPris = data.congesPris ?? 0;

      if (congesPris > joursOuvrables) {
        alert(
          `Le nombre de congés pris (${congesPris}) ne peut pas dépasser les jours ouvrables (${joursOuvrables}).`
        );
        return;
      }

      // Filtrer les avantages vides et transformer en nombres
      const avantagesValides = (data.autresAvantages ?? [])
        .filter((v: any) => v.nom && v.nom.trim() !== '' && Number(v.montant) > 0)
        .map((v: any) => ({
          nom: v.nom.trim(),
          montant: Number(v.montant) || 0
        }));

      // Ne passer autresAvantages que s'il y a des éléments valides
      const inputData: FichePaieInput = {
        ...data,
        autresAvantages: avantagesValides.length > 0 ? avantagesValides : undefined
      };

      this.store.setInput(inputData);
      this.notify.success('Fiche de paie avec succès !');
    } else {
      this.form.markAllAsTouched();
      this.notify.error('Veuillez remplir correctement tous les champs requis.');
    }
  }
}