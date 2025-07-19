import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-operation-layout',
  standalone: false,

  templateUrl: './operation-layout.component.html',
  styleUrl: './operation-layout.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('0.5s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class OperationLayoutComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof document !== 'undefined') {
      const listItems = document.querySelectorAll('#myList .list-group-item');
      listItems.forEach((item) => {
        item.addEventListener('click', () => {
          listItems.forEach((li) => li.classList.remove('active'));
          (item as HTMLElement).classList.add('active');
        });
      });
    }
  }

  toggleSection(sectionId: string) {
    if (typeof document !== 'undefined') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.toggle('active');
      }
    }
  }

  onLogout = () => {
    localStorage.setItem('currentUser', '');
    this.router.navigate(['']);
  };
}
