import { Component } from '@angular/core';
import { constants } from '../../../constants/constants';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent {
  fullName: string = constants.current_User()!.fullName;

  constructor() {}
}
