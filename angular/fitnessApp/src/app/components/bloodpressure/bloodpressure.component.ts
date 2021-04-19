import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-bloodpressure',
  templateUrl: './bloodpressure.component.html',
  styleUrls: ['./bloodpressure.component.css']
})
export class BloodpressureComponent implements OnInit {
  graphData = {}

  constructor(private authService: AuthenticateService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.authService.bloodpressureGet().subscribe(
      data => {
        this.graphData = data.result;
        console.log(data)
      }
    )
  }

}
