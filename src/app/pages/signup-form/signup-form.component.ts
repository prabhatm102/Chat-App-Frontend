import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
// import { EmailValidators } from './email.validators';
// import { UsernameValidators } from './username.validators';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/auth.service';
import { BadInput } from 'src/app/common/bad-input';

@Component({
  selector: 'signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css'],
})
export class SignupFormComponent implements OnInit {
  form: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper: boolean = false;
  constructor(
    private service: UserService,
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
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
      avatar: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', []),
    });
  }

  get name() {
    return this.form.get('name');
  }

  get password() {
    return this.form.get('password');
  }

  get email() {
    return this.form.get('email');
  }

  get avatar() {
    return this.form.get('avatar');
  }

  ngOnInit(): void {}

  onFileSelect(event: any) {
    let allowedExtensions = ['image/jpeg', 'image/png'];

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!allowedExtensions.includes(file.type)) {
        event.target.value = '';
        return this.form.controls['avatar'].setErrors({
          invalidFileExtension: true,
        });
      }
      this.form.patchValue({ fileSource: file });
    }
  }
  submit() {
    let formData = new FormData();

    formData.append('name', this.form.get('name').value);
    formData.append('email', this.form.get('email').value);
    formData.append('password', this.form.get('password').value);
    formData.append('avatar', this.form.get('fileSource').value);

    if (this.form.valid) {
      this.service.create(formData).subscribe(
        (response) => {
          this.auth.updateToken(response?.token);
          this.toastr.success(
            'Sign Up successfull! Login to continue',
            response?.status,
            {
              progressBar: true,
              closeButton: true,
              timeOut: 500,
            }
          );
          this.router.navigate(['/', 'users', 'login']);
        },
        (error) => {
          if (error instanceof BadInput) {
            this.form.controls['email'].setErrors({ emailAlreadyTaken: true });
          } else {
            this.toastr.error('Something went wrong!', '', {
              progressBar: true,
              closeButton: true,
              timeOut: 500,
            });
          }
        }
      );
    }
  }
}
