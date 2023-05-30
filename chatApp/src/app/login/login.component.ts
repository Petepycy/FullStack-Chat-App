import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'cf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user = {
    name: null,
    password: null
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  onSubmit(user: any) {
    this.userService.userName = user.name;
    this.router.navigate(['/chat']);
    this.http.post("http://localhost:4000/auth/register", user).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
