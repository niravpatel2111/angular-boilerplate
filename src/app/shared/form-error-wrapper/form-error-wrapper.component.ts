import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { ERROR_OBJECTS } from '@app/core/constants';
import { ErrorMessageService } from '@app/core/service/error-message.service';

@Component({
  selector: 'app-form-error-wrapper',
  templateUrl: './form-error-wrapper.component.html',
  styleUrls: ['./form-error-wrapper.component.scss']
})
export class FormErrorWrapperComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input()
  public control: any;
  @Input()
  public controlName: string;
  @Input()
  public apiErrorType?: string;

  @Input()
  public apiServiceUrl?: string;

  public errorObject: Object = ERROR_OBJECTS;
  public errorKeys: string[];
  public apiErrorMessage: string;

  constructor(private errorMessageService: ErrorMessageService) {
    errorMessageService.errors$.subscribe(
      (errors: any[]) => {
        if (errors && errors.length) {
          errors
            .filter(
              e => e.type === this.apiErrorType
              //  && e.serviceUrl == this.apiServiceUrl
            )
            .map(e => {
              this.apiErrorMessage = e.error;
            });
        } else {
          this.apiErrorMessage = "";
        }
      }
    );
  }

  ngOnInit() { }

  ngOnChanges() {
    this.errorKeys = Object.keys(this.errorObject);
  }

  ngAfterViewInit() {
    this.control.valueChanges.subscribe(() => {
      this.apiErrorMessage = '';
    });
  }

  formateError(errorMessage: string, errorObj: any): string {
    const types = ['min', 'max', 'requiredLength', 'onlyNumber'];

    types.forEach(type => {
      if (typeof errorObj[type] !== 'undefined') {
        errorMessage = errorMessage.replace(/{{value}}/g, errorObj[type]);
      }
    });
    return errorMessage.replace(/{{field}}/g, this.controlName);
  }

  hasError() {
    return (
      (this.control.errors && this.control.touched) || this.apiErrorMessage
    );
  }
}
