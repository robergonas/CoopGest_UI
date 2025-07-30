import {
  Component,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { User } from '../../../interfaces/user.Interface';

@Component({
  selector: 'app-user-detail',
  standalone: false,

  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {
  dataLoaded: boolean = false;
  active: boolean = false;
  @Input() userList: User[] = [];
  @Output() onUserChangeStatus = new EventEmitter<{
    user: User;
    active: boolean;
  }>();

  ngOnInit() {
    this.dataLoaded = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userList']) {
      this.dataLoaded = true;
    }
  }

  onEnabledUser(user: User): void {
    this.active = true;
    this.onUserChangeStatus.emit({ user, active: this.active });
  }

  onDisabledUser(user: User): void {
    this.active = false;
    this.onUserChangeStatus.emit({ user, active: this.active });
  }
}
