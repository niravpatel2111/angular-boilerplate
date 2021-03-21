import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


export function customMinMax(min: number, max: number, key: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value !== undefined && control.value !== null && (isNaN(control.value) || control.value.length < min || control.value.length > max)) {
      return { [key]: true };
    }
    return null;
  };
}

declare var $: any;

@Injectable()
export class UtilService {

  private _missedError: string = '';
  public missedErrors$ = new EventEmitter<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  notification: any = null;


  dollarToCents(dollar: string | number) {
    return parseInt((parseFloat(dollar.toString()) * 100).toString(), 10);
  }

  centsToDollar(cents: string | number) {
    return parseFloat(cents.toString()) / 100;
  }

  removeEmpty(obj: any): any {
    for (const propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === '' ||
        (Array.isArray(obj[propName]) && !obj[propName].length) ||
        (typeof obj[propName] === 'object' && this.isEmpty(obj[propName]))
      ) {
        delete obj[propName];
      }
    }
    return obj;
  }

  // bytesToSize(bytes) {
  //   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  //   if (bytes == 0) return '0 Byte';
  //   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  //   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  // }


  bytesToSize(x) {

    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    //include a decimal point and a tenths-place digit if presenting
    //less than ten of KB or greater units
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
  }

  isEmpty(obj: any): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  copyToClipboard(value: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  inArray(key, dataArray) {
    var length = dataArray.length;
    for (var i = 0; i < length; i++) {
      if (dataArray[i] == key) return true;
    }
    return false;
  }

  // check array with in arrar ex. ['client','caregiver'] into ['client','caregiver','admin']
  containsAll(needles, haystack) {
    for (var i = 0, len = needles.length; i < len; i++) {
      if ($.inArray(needles[i], haystack) == -1) return false;
    }
    return true;
  }

  stringKeywordReplacer(msg: string, object: any) {
    try {
      return msg.replace(/{([^}]+)}/g, (match, m1) => {
        const replaceString = this.get(object, m1)
        if (replaceString) {
          return replaceString;
        } else {
          return `{${m1}}`;
        }
      });
    } catch (e) {
      console.log(e);
    }
    return msg;
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  replaceAll(str, term, replacement) {
    return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
  }

  objectResolver(path: string, obj: any) {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj || self);
  }

  get(obj: any, key: any): any {
    return key.split('.').reduce((o: any, x: any) => {
      return o === undefined || o === null ? o : o[x];
    }, obj);
  }

  uploadDocFormatCheck(type) {
    if (
      type.includes('pdf') ||
      type.includes('PDF') ||
      type.includes('doc') ||
      type.includes('DOC') ||
      type.includes('xls') ||
      type.includes('XLS') ||
      type.includes('jpg') ||
      type.includes('JPG') ||
      type.includes('jpeg') ||
      type.includes('JPEG') ||
      type.includes('png') ||
      type.includes('PNG') ||
      type.includes('tif') ||
      type.includes('TIF')
    ) {
      return true;
    } else {
      return false;
    }
  }

  uploadPDFFormatCheck(type) {
    if (
      type.includes('pdf') ||
      type.includes('PDF')
    ) {
      return true;
    } else {
      return false;
    }
  }


  validatePassword(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    if (
      password === '' ||
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&])[A-Za-zd$@$!%*?&].{8,}/.test(
        password
      )
    ) {
      return null;
    } else {
      return { validPassword: true };
    }
  }

  numberValidationCheck(propArr: any[]) {
    let errors = 0;

    propArr.forEach(prop => {
      if (isNaN(prop)) {
        errors++;
      }
    })

    if (errors > 0) {
      // this.showNotification({
      //   error: 'Bad Request',
      //   message: 'Phone and Mobile should be of type Number.',
      //   type: 'warning',
      //   timer: 1000,
      // })
      return false
    }

    return true
  }

  // For missed API Errors
  get missedErrors(): string | null {
    return this._missedError;
  }

  public setMissedError(errMsg) {
    this._missedError = errMsg
    this.missedErrors$.emit(this._missedError);
  }

  public clearMissedError() {
    this._missedError = '';
    this.missedErrors$.emit(this._missedError);
  }

  checkBothPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      } else if (passwordConfirmationInput.value === '') {
        return passwordConfirmationInput.setErrors({ required: true })
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  // Use with (keydown) event 
  restrictAplhabets(event: any, numberRestriction?: number) {
    const x = event.which || event.keyCode;

    if (event.ctrlKey || event.shiftKey || x === 9) {
      return true;
    }

    if ((x >= 48 && x <= 57) || x === 8 ||
      (x >= 35 && x <= 40) || x === 46 || (x >= 96 && x <= 105) || x === 86) {
      return this.restrictInputLength(event, numberRestriction);
    } else {
      return false;
    }
  }

  // Use with (keydown) event 
  restrictInputLength(event: any, restrictionNumber: number) {
    const x = event.which || event.keyCode;
    const value = event.target.value;
    const hasSelection = event.target.selectionStart !== value.length;
    const hasNavigationKeys = (x >= 35 && x <= 40) || event.ctrlKey || event.shiftKey;
    if (restrictionNumber && ((value.length + 1) > restrictionNumber) && x !== 8 && !hasSelection && !hasNavigationKeys) {
      return false;
    }
    return true;
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }


  validFormSubmit(formGroup: FormGroup) {
    if (formGroup.invalid) {
      this.markFormGroupTouched(formGroup);
      return false;
    } else {
      return true;
    }
  }

  deleteKey(obj, path) {
    const _obj = obj;
    // const _obj = JSON.parse(JSON.stringify(obj));
    const keys = path.split('.');
    keys.reduce((acc, key, index) => {
      if (index === keys.length - 1) {
        delete acc[key];
        return true;
      }
      return acc[key];
    }, _obj);
    return _obj;
  }

  removeWhiteSpace(formGroup: FormGroup, exceptFormContrl?) {
    (<any>Object).keys(formGroup.controls).forEach((key: any) => {
      let control: any = formGroup.controls[key];
      if (control.validator && control.validator('') && control.validator('').required) {
        if (exceptFormContrl && exceptFormContrl.length) {
          if (!this.inArray(key, exceptFormContrl) && control.value) {
            control.setValue(control.value.trim());
          }
        } else {
          if (control.value) {
            control.setValue(control.value.trim());
          }
        }
      }
    });
    return formGroup.valid;
  }

  removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
  }

  handleCollapsedInChildRoutes() {
    setTimeout(() => {
      let hasClass = $('.child-main-menu').hasClass('collapsed');
      if (hasClass) {
        $('.child-sub-menu').removeClass('show');
      } else {
        $('.child-sub-menu').addClass('show');
      }
    }, 1);
  }

  handleLeftMenuScroll(elementId: any) {
    setTimeout(() => {
      var el = document.getElementById(elementId);
      el.scrollIntoView();
    }, 1);
  }

  patternValidator(regex: any, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const valid = new RegExp(regex).test(control.value);
      return valid ? null : error;
    };
  }

  minMaxValidation(error: ValidationErrors, min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      if ((isNaN(control.value) || control.value.length < min || control.value.length > max)) {
        return error;
      }
      // const valid = control.value.lenght;
      return null;
    };
  }

  onlyNumberValidation(error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      if (isNaN(control.value)) {
        return error;
      }
      return null;
    };
  }

  getPaginationCounts(totalPage, currentPage) {
    const calculatedPages = [];
    const pageCountLimit = 5;
    if (totalPage >= pageCountLimit) {
      const limit = pageCountLimit - 1;
      let startPage = currentPage - limit / 2;
      let endPage = currentPage + limit / 2;
      if (startPage <= 0) {
        endPage -= (startPage - 1);
        startPage = 1;
      }
      if (endPage > totalPage) {
        endPage = totalPage;
        startPage = totalPage - limit;      // added by last //
      }
      for (let i = startPage; i <= endPage; i++) {
        calculatedPages.push(i);
      }
    } else {
      for (let i = 1; i <= totalPage; i++) {
        calculatedPages.push(i);
      }
    }
    return calculatedPages;
  }

  // createFormData = (body) => {
  //   const data: any = new FormData();
  //   Object.keys(body).forEach(key => {
  //     data.append(key, body[key]);
  //   });
  //   return data;
  // };

  createFormData(object: any, form?: FormData, namespace?: string): FormData {
    const formData = form || new FormData();
    for (const property in object) {
      if (
        !object.hasOwnProperty(property) ||
        (object[property] === null || object[property] === undefined)
      ) {
        continue;
      }
      const formKey = namespace ? `${namespace}[${property}]` : property;
      if (object[property] instanceof Date) {
        formData.append(formKey, object[property].toISOString());
      } else if (
        typeof object[property] === 'object' &&
        !(object[property] instanceof File)
      ) {
        this.createFormData(object[property], formData, formKey);
      } else {
        formData.append(formKey, object[property]);
      }
    }
    return formData;
  }

  createNestedArrayFromPath(array, pathDivider, key) {
    // const parse = elm => elm.cat.split('|');
    // const array = [
    //   { cat: 'one|two|thre|boo' },
    //   { cat: 'one|two|boo|boo|ouch' },
    //   { cat: 'one|two|thre|boo|lee' },
    //   { cat: 'one|hey|something|other' },
    //   { cat: 'one|hey|keys|other' },
    //   { cat: 'this|blaj|something|other' },
    // ];
    const parse = elm => elm[key].split(pathDivider);
    const build = (keys, obj, acc) => {
      keys.reduce((a, b) => {
        if (!a[b]) a[b] = {};
        // if (!a[b]) a[b] = { flagForCheckJust: true };
        return a[b];
      }, obj);
      Object.assign(acc, obj);
      return acc;
    };

    const obj = {};

    return array
      .map(a => parse(a))
      .reduce((acc, keys) => build(keys, obj, {}), {});
  }


  generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getRealISODate(date) {
    const jsDate: any = new Date(date);
    return new Date(jsDate - (new Date()).getTimezoneOffset() * 60000).toISOString();
  }

  prepareTimeSlot() {
    const startTimeOptions = [];
    for (let index = 0; index <= 23; index++) {
      const prefix = index > 11 ? 'PM' : 'AM';
      startTimeOptions.push({
        value: index,
        fromValue: index,
        toValue: index + 0.5,
        textSecond: (index < 10) ? `0${index}:00` : `${index}:00`,
        text: (index < 10) ? `${index === 0 ? 12 : `0${index}`}:00 ${prefix}` : `${index > 12 ? index - 12 : index}:00 ${prefix}`,
      });
      startTimeOptions.push({
        value: index + .5,
        fromValue: index + .5,
        toValue: index + 0.5,
        textSecond: (index < 10) ? `0${index}:30` : `${index}:30`,
        text: (index < 10) ? `${index === 0 ? 12 : `0${index}`}:30 ${prefix}` : `${index > 12 ? index - 12 : index}:30 ${prefix}`,
      });
    }
    return startTimeOptions;
  }

  getDayInt(day) {
    const dataArr = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    }
    return dataArr[day];
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  async asyncForEach(array, callback) {
    console.log('asyncForEach: called');
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  convertBase64ToBlobData(base64Data: any, contentType: string = 'image/png', sliceSize = 512) {
    const byteCharacters = atob(base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  blobToFile(theBlob: Blob, fileName: string): File {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

  convertTbToGb(tb) {
    return tb * 1024;
  }

  convertTimeToValue(value) {
    const data = this.prepareTimeSlot();
    const time = data.filter(f => f.textSecond === value)[0];
    if (time) {
      return time.value;
    }
  }

  timeToDecimal(t) {
    var arr = t.split(':');
    var test: any = (arr[1] / 6) * 10
    var dec = parseInt(test, 10);

    return parseFloat(parseInt(arr[0], 10) + '.' + (dec < 10 ? '0' : '') + dec);
  }

  detectBrowser() {
    let sUsrAg = navigator.userAgent;
    let browserObject = {
      isChrome: false,
      isFireFox: false,
      isOpera: false,
      isSafari: false,
      isEI: false
    };

    if (sUsrAg.indexOf("Firefox") > -1) {
      browserObject.isFireFox = true;
    } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
      browserObject.isOpera = true;
    } else if (sUsrAg.indexOf("Chrome") > -1) {
      browserObject.isChrome = true;
    } else if (sUsrAg.indexOf("Safari") > -1) {
      browserObject.isSafari = true;
    } else if (navigator.userAgent.indexOf('MSIE') !== -1
      || navigator.appVersion.indexOf('Trident/') > -1) {
      browserObject.isEI = true;
    }
    return browserObject;
  }

}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});
