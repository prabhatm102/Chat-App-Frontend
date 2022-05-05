import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  avatarUrl: string;
  currentUser: any;
  public isMenuCollapsed = true;
  public showProfileMenu = false;

  constructor(
    public auth: AuthService // private socket: SocketService,
  ) {
    this.avatarUrl = environment.avatarUrl;
  }

  ngOnInit(): void {
    this.auth.cast.subscribe((v) => {
      this.currentUser = this.auth.getDecodedAccessToken(v);
    });

    // this.currentUser = this.auth.getLoggedInUser();
  }
  toggleProfileMenu() {
    this.showProfileMenu = this.showProfileMenu ? false : true;
  }
}
