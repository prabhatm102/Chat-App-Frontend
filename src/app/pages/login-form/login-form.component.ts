import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotFoundError } from 'src/app/common/not-found-error';
import { UnAuthorisedError } from 'src/app/common/unAuthorised-error';
import { BadInput } from '../../common/bad-input';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  form: any;
  constructor(
    private service: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(40),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ]),
    });
  }

  ngOnInit(): void {}

  submit() {
    let formData = new FormData();

    formData.append('email', this.form.get('email').value);
    formData.append('password', this.form.get('password').value);

    if (this.form.valid) {
      this.service
        .create({
          email: this.form.get('email').value,
          password: this.form.get('password').value,
        })
        .subscribe(
          (response) => {
            this.auth.updateToken(response?.token);
            this.toastr.success('Login SuccessFull', '', {
              progressBar: true,
              closeButton: true,
              timeOut: 1000,
            });
            let returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigate([returnUrl]);
          },
          (error) => {
            if (
              error instanceof BadInput ||
              error instanceof NotFoundError ||
              error instanceof UnAuthorisedError
            )
              this.form.setErrors({
                loginErrros: error.originalError.error.message,
              });
            else {
              this.toastr.error('Something went wrong', '', {
                progressBar: true,
                closeButton: true,
                timeOut: 500,
              });
            }
          }
        );
    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
