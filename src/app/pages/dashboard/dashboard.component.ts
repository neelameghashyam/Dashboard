import { Component } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-theme/dark-mode.service';

@Component({
  selector: 'dashboard-component',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class Dashboard_Component {
    constructor(public darkModeService: DarkModeService) {}
}