import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Params, Router, RouterEvent } from '@angular/router';
import _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CONSTANT } from './../constants';

@Injectable()
export class AuthenticationService {
  private _credentials: any | null;
  credentials$: BehaviorSubject<any> = new BehaviorSubject(null);
  systemLoader: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public currentURLData = {
    url: null,
    params: null,
    data: null,
    userName: null
  }
  public changeRoutes$: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    const savedCredentials = localStorage.getItem(CONSTANT.credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
      this.setCredentials(this._credentials);
    }
    // if (this.isAuthenticated()) {
    //   this.refresh();
    // }
    this.router.events.pipe(filter((event: RouterEvent): boolean => {
      return (event instanceof NavigationEnd);
    })).subscribe(async (event: NavigationEnd) => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      route.params.subscribe(params => {
        this.currentURLData.params = params;
        this.currentURLData.url = this.router.url;
      })
      route.data.subscribe(data => {
        let snapshot = this.router.routerState.snapshot.root;
        let urlParams = this.collectParams(snapshot);
        this.currentURLData.data = data;
        this.currentURLData.url = event.url;
        this.currentURLData.params = urlParams;
        this.changeRoutes$.next(this.currentURLData);
      });
    });
  }

  generateSlug(value) {
    const val = value.trim().toLowerCase();
    let replaced = val.split(' ').join('-');
    replaced = replaced.split('/').join('-');
    return replaced;
  }

  collectParams(root: ActivatedRouteSnapshot): Params {
    var params: Params = {};
    (function mergeParamsFromSnapshot(snapshot: ActivatedRouteSnapshot) {
      Object.assign(params, snapshot.params);
      snapshot.children.forEach(mergeParamsFromSnapshot);
    })(root);
    return (params);
  }

  refresh() {
    setTimeout(() => {
      this.me().subscribe(
        (user: any) => {
          this._credentials.user = user;
          this.setCredentials(this._credentials);
        },
        (error: any) => {
          console.log(`refresh error: ${error}`);
        }
      );
    }, 1);
  }

  me(): Observable<any> {
    return this.httpClient.get('/me').pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  login(
    payload: any
  ): Observable<any> {
    return this.httpClient.post('/login', payload).pipe(
      map((body: any) => {
        this.setCredentials(body);
        this.router.navigate(['/home'], { replaceUrl: true });
        return body;
      })
    );
  }

  logout() {
    this.setCredentials();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  get credentials(): any | null {
    return this._credentials ? this._credentials.user : null;
  }

  get accessToken(): string | null {
    return this._credentials ? this._credentials.accessToken : null;
  }


  private setCredentials(credentials?: any) {
    this._credentials = credentials || null;
    if (credentials) {
      localStorage.setItem(
        CONSTANT.credentialsKey,
        JSON.stringify(credentials)
      );
      this.credentials$.next(this._credentials);
    } else {
      const local = _.cloneDeep(CONSTANT);
      for (const key in local) {
        if (local.hasOwnProperty(key)) {
          const element = local[key];
          localStorage.clearItem(element);
        }
      }
    }
  }

  apiCall(method, url, payload?, options?): Observable<any> {
    let apiData;
    if (method === 'put' || method === 'post') {
      apiData = this.httpClient[method](url, payload, options);
    } else {
      apiData = this.httpClient[method](url, options);
    }
    return apiData.pipe(
      map((body: any) => {
        return body;
      })
    );
  }
}