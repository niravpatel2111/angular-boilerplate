import { Component, OnInit } from '@angular/core';
import { UtilService } from '@app/core/service/util.service';

@Component({
  selector: 'app-missed-error',
  templateUrl: './missed-error.component.html',
  styleUrls: ['./missed-error.component.css']
})
export class MissedErrorComponent implements OnInit {

  constructor(
    public utilService: UtilService
  ) { }

  ngOnInit() {
  }

}
