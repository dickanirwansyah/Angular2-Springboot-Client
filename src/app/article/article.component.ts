import { Component, OnInit } from '@angular/core';
import {ArticleService} from './article.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Article} from './article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  titleComponent = "Data Article";
  articles: Array<any>;
  statusCode: number;
  requestProcessing = false;
  IdarticleToUpdate = null;
  processValidation = false;

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void{
    this.getListArticle()
  }

  //component konfig forms angular forms
  articleForm = new FormGroup({
    title: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required)
  });

  //component konfig forms angular form validation
  preProcessConfigurations(){
    this.statusCode = null;
    this.requestProcessing = true;
  }

  //component konfig, reset setelah insert atau update
  backToCreateArticle(){
    this.IdarticleToUpdate = null;
    this.articleForm.reset();
    this.processValidation = false;
  }

  //component menampilkan list
  getListArticle(){
    this.articleService.getAllArticles()
    .subscribe(data => this.articles = data,
    errorCode => this.statusCode = errorCode);
  }

  //component handling create or update
  onArticleFormSubmit(){
    this.processValidation = true;
    if(this.articleForm.invalid){
      return;
    }
    this.preProcessConfigurations();
    let title = this.articleForm.get('title').value.trim();
    let category = this.articleForm.get('category').value.trim();
    if(this.IdarticleToUpdate === null){
      let article = new Article(null, title, category);
      this.articleService.getInsertArticle(article)
      .subscribe(successCode => {
          this.statusCode = successCode;
          this.getListArticle();
          this.backToCreateArticle();
      }, errorCode => this.statusCode = errorCode);
    }else{
      let article = new Article(this.IdarticleToUpdate, title, category);
      this.articleService.getUpdateArticle(article)
      .subscribe(successCode => {
        this.statusCode = successCode;
        this.getListArticle();
        this.backToCreateArticle();
      }, errorCode => this.statusCode = errorCode);
    }
  }


  //component proses onload edit
  getEditArticle(idarticle: string){
    this.preProcessConfigurations();
    this.articleService.getArticlesById(idarticle)
      .subscribe( article=> {
        this.IdarticleToUpdate = article.idarticle;
        this.articleForm.setValue({title: article.title, category: article.category});
        this.processValidation = true;
        this.requestProcessing = false;
      }, errorCode => this.statusCode=errorCode);
  }

  //component delete data
  getDropArticles(idarticle: string){
    if(confirm('yakin ingin hapus article '+idarticle+ ' ?')){
      this.articleService.getDeleteArticle(idarticle)
      .subscribe(successCode => {
        this.statusCode = successCode;
        this.getListArticle();
        this.backToCreateArticle();
      }, errorCode => this.statusCode = errorCode);
    }
  }

}
