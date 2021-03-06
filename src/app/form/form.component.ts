import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
  subscriptions: Subscription = new Subscription();

  formGroup = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get fromGroupControl(): { [key: string]: AbstractControl; } {
    return this.formGroup.controls;
  }

  constructor(
    private authService: AuthService, 
    private router: Router,
    readonly snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.registrationForm ? this.handleRegistration() : this.handleLogin();
  }

  handleLogin(): void {
    this.subscriptions.add(
      this.authService.login(this.fromGroupControl.userEmail.value, this.fromGroupControl.password.value).subscribe({
        next: () => {
          this.router.navigate(['dashboard'])
          this.registrationForm = false;
        }
      })
    );
  }

  handleRegistration(): void {
    this.subscriptions.add(
      this.authService.register(this.fromGroupControl.userEmail.value, this.fromGroupControl.password.value).subscribe({
        next: () => {
          this.openSnackBar('Rejestracja powiodła się. Jesteś zalogowany.', 'Zamknij')
          this.router.navigate(['dashboard'])
          this.registrationForm = false;
        }
      })
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  formControlError(formControlName: string): boolean {
    return this.formGroup.controls[`${formControlName}`].invalid;
  }

  getErrorMessage(formControlName: string) {
    if (this.formGroup.controls[`${formControlName}`].hasError('required')) {
      return 'Pole nie może być puste';
    }
    if (this.formGroup.controls[`${formControlName}`].hasError('mismatchedPasswords')) {
      return this.formGroup.controls[`${formControlName}`]?.errors?.mismatchedPasswords;
    }
    if (this.formGroup.controls[`${formControlName}`].hasError('pattern')) {
      return 'Hasło musi zawierać min. 8 znaków, dużą i małą literę oraz znak specjalny';
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
      this.formGroup.addControl('rePassword', new FormControl('', [Validators.required, this.checkIfPasswordsAreTheSame(), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]));
      this.fromGroupControl.password.setValidators([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])
    } else {
      this.formGroup.removeControl('rePassword');
      this.formElements = this.formElements.filter((element: FormElement) => element.registrationForm == false);
      this.fromGroupControl.password.setValidators([Validators.required])
    }
  }

  passwordPattern(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      control.value.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)? { wrongPassword: 'Hasło musi zawierać min. 8 znaków, dużą i małą literę oraz znak specjalny' } : null;
  }

  checkIfPasswordsAreTheSame(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      control.value === this.fromGroupControl.password.value ? null : { mismatchedPasswords: 'Powtórzone hasło różni się od podanego hasła' };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.formGroup.reset();
  }

}
interface FormElement {
  inputType: string;
  inputPlaceholder: string;
  formControlName: string;
  registrationForm: boolean;
}