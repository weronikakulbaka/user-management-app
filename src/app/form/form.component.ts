import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';

const formElements: FormElement[] = [
  {
    inputType: 'email',
    inputPlaceholder: 'E-mail',
    formControlName: 'userEmail',
    registrationForm: false,
  },
  {
    inputType: 'password',
    inputPlaceholder: 'Hasło',
    formControlName: 'password',
    registrationForm: false,
  }
];

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  formElements: FormElement[] = formElements;
  registrationForm: boolean = false;
  loginSub: Subscription = Subscription.EMPTY;

  formGroup = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get fromGroupControl(): { [key: string]: AbstractControl; } {
    return this.formGroup.controls;
  }

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.registrationForm ? this.handleRegistration() : this.handleLogin();
  }

  handleLogin(): void {
    this.loginSub = this.loginService.login(this.fromGroupControl.userEmail.value, this.fromGroupControl.password.value).subscribe({
      next: () => {
        this.router.navigate(['dashboard'])
        this.formGroup.reset();
      }
    });
  }

  handleRegistration(): void {
    console.log('register')
  }

  formControlError(formControlName: string): boolean {
    return this.formGroup.controls[`${formControlName}`].invalid;
  }

  getErrorMessage(formControlName: string) {
    if (this.formGroup.controls[`${formControlName}`].hasError('required')) {
      return 'Pole nie może być puste';
    }
    if(this.formGroup.controls[`${formControlName}`].hasError('mismatchedPasswords')){
      return this.formGroup.controls[`${formControlName}`]?.errors?.mismatchedPasswords;
    }
    return this.formGroup.controls[`${formControlName}`].hasError('email') ? 'Zły adres email' : '';
  }

  registrationToggle(event: MouseEvent, changeToRegistation: any): void {
    this.registrationForm = changeToRegistation;
    this.formGroup.reset();
    if (changeToRegistation) {
      this.formElements.push(
        {
          inputType: 'password',
          inputPlaceholder: 'Powtórz hasło',
          formControlName: 'rePassword',
          registrationForm: true,
        }
      )
      this.formGroup.addControl('rePassword', new FormControl('', [Validators.required, this.checkIfPasswordsAreTheSame()]));
    } else {
      this.formElements = this.formElements.filter((element: FormElement) => element.registrationForm == false);
    }
  }

  checkIfPasswordsAreTheSame(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      control.value === this.fromGroupControl.password.value ? null : { mismatchedPasswords: 'Powtórzone hasło różni się od podanego hasła' };
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }

}

interface FormElement {
  inputType: string;
  inputPlaceholder: string;
  formControlName: string;
  registrationForm: boolean;
}