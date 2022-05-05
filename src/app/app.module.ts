import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './pages/login-form/login-form.component';
import { SignupFormComponent } from './pages/signup-form/signup-form.component';
import { AppErrorHandler } from './common/app-error-handler';
import { NavbarComponent } from './common/components/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ChatComponent } from './pages/chatPage/chat/chat.component';
import { UserListComponent } from './pages/chatPage/user-list/user-list.component';
import { ChatCardComponent } from './pages/chatPage/chat-card/chat-card.component';
import { UsersComponent } from './pages/users/users.component';
import { NotFoundComponent } from './common/components/not-found/not-found.component';
import { ChatFormComponent } from './pages/chatPage/chat-card/chat-form/chat-form.component';
import { RecentChatsComponent } from './pages/chatPage/recent-chats/recent-chats.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
  url: environment.socketUrl, // socket server url;
  options: {
    transports: ['websocket'],
  },
};
@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    SignupFormComponent,
    NavbarComponent,
    ChatComponent,
    UserListComponent,
    ChatCardComponent,
    UsersComponent,
    NotFoundComponent,
    ChatFormComponent,
    RecentChatsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    ToastrModule.forRoot(),
    SocketIoModule.forRoot(config),
  ],
  providers: [{ provide: ErrorHandler, useClass: AppErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
