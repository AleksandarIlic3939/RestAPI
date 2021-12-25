import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public first: string = "";
  public prev: string = "";
  public next: string = "";
  public last: string = "";

  private REST_API_SERVER = "http://localhost:3000/products";

  constructor(private httpClient: HttpClient) { }

  parseLinkHeader(header) {
    if (header.length == 0) {
      return ;
    }

    let parts = header.split(',');
    var links = {};

    parts.forEach(p => {
      let section = p.split(',');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    });

    this.first = links["first"];
    this.prev = links["prev"];
    this.next = links["next"];
    this.last = links["last"];
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`; // klijent-strana errors.
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; // server-strana errors.
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendGetRequest() {
    let params = new HttpParams();
    params = params.append('_page', 1);
    params = params.append('_limit', 100);

    return this.httpClient.get<Product[]>(this.REST_API_SERVER, { params: params, observe: 'response' })
    .pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));
    }));
  }

  public sendGetRequestToUrl(url: string){
    return this.httpClient.get<Product[]>(url, { observe: 'response' })
    .pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));
    }));
  }

}
