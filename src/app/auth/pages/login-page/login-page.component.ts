import { Component } from '@angular/core';
import { AuthService } from '../../services/auteh.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {
  constructor(
    private authService: AuthService,
    private router:Router
    ){

  }
  onLogin():void{
    this.authService.login('carlos@intelisis.com', '123')
    .subscribe(user=>{
      this.router.navigate(['/']);
    })
  }
}
