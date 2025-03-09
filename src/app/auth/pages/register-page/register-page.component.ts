import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent {
  
  public userForm: FormGroup;
  
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
    
    this.authService.addUser(this.userForm.value)
    .subscribe( user => {
      this.authService.login(user.username, user.email)
      .subscribe( user => {
        this.router.navigate(['/']);
      })
    })

    this.userForm.reset();

  }
}
