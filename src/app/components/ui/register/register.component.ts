import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../../core/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userForm: FormGroup;
  formErrors: FormErrors = {
    'email': '',
    'password': '',
  };
  validationMessages = {
    'email': {
      'required': 'Email obrigatório.',
      'email': 'Insira um email válido.',
    },
    'password': {
      'required': 'Senha obrigatória.',
      'pattern': 'A senha deve possuir letras e números.',
      'minlength': 'A senha deve ter no mínimo 4 caracteres.',
      'maxlength': 'A senha não pode ser maior que 40 caracteres.',
    },
  };

  error: any;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  signup() {
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password']);
  }

  buildForm() {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email,
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
      ]],
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'email' || field === 'password')) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key) ) {
                this.formErrors[field] += `${(messages as {[key: string]: string})[key]} `;
              }
            }
          }
        }
      }
    }
  }

}
