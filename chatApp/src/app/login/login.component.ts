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

  private readonly apiUrl: string;
  user = {
    name: null,
    password: null
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {
    //this.apiUrl = `${window.location.protocol}//api`;
    this.apiUrl = 'http://localhost:17586';
  }

  onSubmit(user: any) {
    this.userService.userName = user.name;
    this.router.navigate(['/chat']);
    this.http.post(`${this.apiUrl}/auth/register`, user).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}