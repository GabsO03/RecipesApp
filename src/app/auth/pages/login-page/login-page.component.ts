import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  public userForm: FormGroup;
  public fail = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.userForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])
    });
  }

  onLogin():void{
    if ( this.userForm.invalid ){
      this.userForm.markAllAsTouched();
      return;
    }

    
    this.authService.login(this.userForm.get('username')?.value, this.userForm.get('email')?.value)
    .subscribe( user => {
      if (!user) this.fail = true;
      else this.router.navigate(['/']);
    })

    this.userForm.reset();

  }

}
