import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './common/components/not-found/not-found.component';
import { ChatComponent } from './pages/chatPage/chat/chat.component';
import { LoginFormComponent } from './pages/login-form/login-form.component';
import { SignupFormComponent } from './pages/signup-form/signup-form.component';
import { UsersComponent } from './pages/users/users.component';
import { AdminGuard } from './shared/admin.guard';
import { AuthGuard } from './shared/auth.guard';
import { PreventLoggedInGuard } from './shared/prevent-logged-in.guard';

const routes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UsersComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'signup',
        component: SignupFormComponent,
        canActivate: [PreventLoggedInGuard],
      },
      {
        path: 'login',
        component: LoginFormComponent,
        canActivate: [PreventLoggedInGuard],
      },
    ],
  },
  {
    path: 'chats',
    component: ChatComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'chats',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
