import { FormControl } from "@angular/forms";

export interface LoginForm {
  userName: FormControl;
  password: FormControl;
}

export interface ForgetPasswordForm {
  userName: FormControl;
}

export interface ResetPasswordForm {
  email: FormControl;
}
