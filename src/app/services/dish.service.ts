import { Injectable } from '@angular/core';
import {Dish} from '../shared/dish';
import {Observable,of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {baseURL} from '../shared/baseURL';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http:HttpClient) { }
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
    return this.http.get<Dish[]>(baseURL+'dishes');
    
  }

getDish(id:string):Observable<Dish>{
  return this.http.get<Dish>(baseURL+'dishes/'+id);

}
  
getFeaturedDish():Observable<Dish>{
  return this.http.get<Dish>(baseURL+'dishes?featured=true').pipe(map(dishes => dishes[0]));

}

getDishIds():Observable<string[] |any>{
  return this.getDishes().pipe(map(dishes=>dishes.map(dish=>dish.id)));
}

}
