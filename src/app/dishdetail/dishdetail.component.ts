import { Component, OnInit, ViewChild,Inject} from '@angular/core';
import {Params,ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service'; 
import {switchMap, switchMapTo} from 'rxjs/operators';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';
import {Reactive} from '../shared/reactive';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  reactiveForm:FormGroup;
  reactive:Reactive;
  dishIds:string[];
  prev:string;
  next:string;
  dish:Dish;
  errMess:string;
  @ViewChild('rform') reactiveFormDirective;

  formErrors={
    'author':'',
    'comment':''
  };

  validationMessages={
    'author':{
      'required':'Author is required.',
      'minlength':'Author must be at least 2 characters long.'
    },
    'comment':{
      'required':'Comment is required.'
    }
  }

  constructor(private dishService:DishService,
    private route:ActivatedRoute,
    private location:Location,
    private fb:FormBuilder,
    @Inject('BaseURL') private BaseURL) {}

  ngOnInit() {
    this.createForm();
    this.dishService.getDishIds()
    .subscribe((dishIds)=>this.dishIds=dishIds);
    this.route.params.pipe(switchMap((params:Params)=>this.dishService.getDish(params['id'])))
    .subscribe(dish=>{
      this.dish=dish;
      this.setPrevNext(dish.id);
    },
    errmess=>this.errMess=<any>errmess);
  }

  createForm(){
    this.reactiveForm=this.fb.group({
      author:['',[ Validators.required, Validators.minLength(2)]],
      rating:5,
      comment:['',Validators.required],
      date:''
    });
    this.reactiveForm.valueChanges
    .subscribe(data=>this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?:any){
    if (!this.reactiveForm) { return; }
    const form = this.reactiveForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.reactive=this.reactiveForm.value;
    
    (this.reactive.date)=new Date().toISOString();
    console.log(this.reactive);
    this.dish.comments.push(this.reactive);
    this.reactiveForm.reset({
      rating:5,
      comment:'',
      author:''
    });
    this.reactiveFormDirective.resetForm();
    
  }
  setPrevNext(dishId:string){
    const index=this.dishIds.indexOf(dishId);
    this.prev=this.dishIds[(this.dishIds.length + index-1)% (this.dishIds.length)];
    this.next=this.dishIds[(this.dishIds.length + index+1)% (this.dishIds.length)];
  }
  goBack():void{
    this.location.back();
  }
}
