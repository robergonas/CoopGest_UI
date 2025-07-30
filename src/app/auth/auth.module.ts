import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ForgotPageComponent } from './pages/forgot-page/forgot-page.component';
import { ChangePasswordPageComponent } from './pages/change-password-page/change-password-page.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { UserComponent } from './pages/user/user/user.component';
import { UserDetailComponent } from './pages/user/user-detail/user-detail.component';
import { UserHeaderComponent } from './pages/user/user-header/user-header.component';
import { NewUserComponent } from './pages/user/new-user/new-user.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    ForgotPageComponent,
    ChangePasswordPageComponent,
    AuthLayoutComponent,
    UserComponent,
    UserDetailComponent,
    UserHeaderComponent,
    NewUserComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule],
})
export class AuthModule {}
