import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class ErrorMessageService {
  private _errors: any[] = [];
  public errors$ = new EventEmitter<any[]>();

  constructor() { }

  get errors(): any[] {
    return this._errors;
  }

  public set(error: string, type: string, serviceUrl: string) {
    this._errors.push({
      id: Date.now(),
      error: error,
      type: type,
      serviceUrl: serviceUrl
    });
    this.errors$.emit(this._errors);
  }

  public clear() {
    this._errors = [];
    this.errors$.emit(this._errors);
  }
}
