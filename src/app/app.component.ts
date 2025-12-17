import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageEmployeComponent } from './features/employe/page-employe/page-employe.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PageEmployeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TFP';
}
