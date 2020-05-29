import { Component, OnInit, ViewChild,Inject} from '@angular/core';
import {Params,ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service'; 
import {switchMap, switchMapTo} from 'rxjs/operators';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';
import {Comment} from '../shared/comment';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  commentForm:FormGroup;
  comment:Comment;
  dishIds:string[];
  prev:string;
  next:string;
  dish:Dish;
  errMess:string;
  dishcopy:Dish;
  @ViewChild('rform') commentFormDirective;

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
      this.dishcopy=dish;
      this.setPrevNext(dish.id);
    },
    errmess=>this.errMess=<any>errmess);
  }

  createForm(){
    this.commentForm=this.fb.group({
      author:['',[ Validators.required, Validators.minLength(2)]],
      rating:5,
      comment:['',Validators.required],
      date:''
    });
    this.commentForm.valueChanges
    .subscribe(data=>this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?:any){
    if (!this.commentForm) { return; }
    const form = this.commentForm;
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
    this.comment=this.commentForm.value;
    
    (this.comment.date)=new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish=>{
      this.dish=dish;
      this.dishcopy=dish;
    },
    errmess=>{this.dish=null;
      this.dishcopy=null;
      this.errMess=<any>errmess;});
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      rating:5,
      comment:'',
      author:''
    });
    
    
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
