import { Injectable } from '@angular/core';
import {Dish} from '../shared/dish';
import {Observable,of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {baseURL} from '../shared/baseURL';
import {map,catchError} from 'rxjs/operators';
import {ProcessHTTPMsgService} from './process-httpmsg.service';
@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http:HttpClient,
    private processHTTPMsgService:ProcessHTTPMsgService) { }
  /*getDishes():Promise<Dish[]>{
    return new Promise(resolve=>{
      //simulate server latency with 2 second delay
      setTimeout(()=>resolve(DISHES),2000);
    });
  }*/
  /*getDishes():Promise<Dish[]>{
    return of(DISHES).pipe(delay(2000)).toPromise();
    
  }
  getDishes():Observable<Dish[]>{
    return of(DISHES).pipe(delay(2000));
    
  }*/
  getDishes():Observable<Dish[]>{
    return this.http.get<Dish[]>(baseURL+'dishes')
    .pipe(catchError(this.processHTTPMsgService.handleError));
    
  }

getDish(id:string):Observable<Dish>{
  return this.http.get<Dish>(baseURL+'dishes/'+id)
  .pipe(catchError(this.processHTTPMsgService.handleError));

}
  
getFeaturedDish(): Observable<Dish> {
  return this.http.get<Dish[]>(baseURL + 'dishes?featured=true').pipe(map(dishes => dishes[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));
}

getDishIds(): Observable<number[] | any> {
  return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)))
    .pipe(catchError(error => error));
}

}
