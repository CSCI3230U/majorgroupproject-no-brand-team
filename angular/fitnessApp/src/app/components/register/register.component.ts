import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    first_name: null,
    last_name: null,
    height: null,
    phone_number: null,
    address: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthenticateService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { first_name, last_name, height, phone_number, address, email, password } = this.form;

    this.authService.register(first_name, last_name, height, phone_number, address, email, password).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}