import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
export class LoginFormComponent implements OnInit {

  formElements: FormElements[] = formElements;

  formGroup = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() { }

  ngOnInit(): void {
  }

  handleLogin(): void {
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

}

interface FormElements {
  inputType: string;
  inputPlaceholder: string;
  formControlName: string;
}