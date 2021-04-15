import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';

const formElements: FormElements[] = [
  {
    inputType: 'email',
    inputPlaceholder: 'E-mail',
    formControlName: 'userEmail'
  },
  {
    inputType: 'password',
    inputPlaceholder: 'Password',
    formControlName: 'password'
  }
];

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit, OnDestroy {

  formElements: FormElements[] = formElements;
  loginSub: Subscription = Subscription.EMPTY;

  formGroup = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get fromGroupControl():{ [key: string]: AbstractControl; } {
    return this.formGroup.controls;
  }

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  handleLogin(): void {
    this.loginSub = this.loginService.login(this.fromGroupControl.userEmail.value, this.fromGroupControl.password.value).subscribe({
      next: () => this.router.navigate(['dashboard'])
    });
  }

  formControlError(formControlName: string): boolean{
    return this.formGroup.controls[`${formControlName}`].invalid;
  }

  getErrorMessage(formControlName: string) {
    if (this.formGroup.controls[`${formControlName}`].hasError('required')) {
      return 'Pole nie może być puste';
    }
    return this.formGroup.controls[`${formControlName}`].hasError('email') ? 'Zły adres email' : '';
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }

}

interface FormElements {
  inputType: string;
  inputPlaceholder: string;
  formControlName: string;
}