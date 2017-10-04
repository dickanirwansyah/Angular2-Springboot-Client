import {Injectable} from '@angular/core';
import {Http, Response, Headers, URLSearchParams, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {Article} from './article';

@Injectable()
export class ArticleService{

  _UriArticles = "http://localhost:8080/api/all-articles";
  _UriInsert = "http://localhost:8080/api/insertarticle";
  _UriFetchId = "http://localhost:8080/api/article/";
  _UriDelete = "http://localhost:8080/api/deletearticle/";
  _UriUpdate = "http://localhost:8080/api/updatearticle"

  constructor(private _http:Http){}

//method extract data json
private getDataJson(res: Response){
  let body = res.json();
  return body;
}

//method handling error
private  getHandlingError(error: Response | any){
  console.error(error.message || error);
  return Observable.throw(error.status);
}

//method create insert data serialize
getInsertArticle(article: Article):Observable<number>{
    let cpHeaders = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers:cpHeaders });
    return this._http.post(this._UriInsert, article, options)
    .map(success => success.status)
    .catch(this.getHandlingError);
}

//method update data serialize
getUpdateArticle(article: Article):Observable<number>{
  let cpHeaders = new Headers({'Content-Type': 'application/json'});
  let options = new RequestOptions({headers: cpHeaders});
  return this._http.put(this._UriUpdate, article, options)
  .map(success => success.status).catch(this.getHandlingError);
}

//method delete data
getDeleteArticle(idarticle:string):Observable<number>{
  let cpHeaders = new Headers({'Content-Type': 'application/json'});
  let cpParams = new URLSearchParams();
  cpParams.set('idarticle', idarticle);
  let options = new RequestOptions({headers: cpHeaders, params: cpParams});
  return this._http.delete(this._UriDelete + idarticle, options)
  .map(success => success.status).catch(this.getHandlingError);
}

//method menampilkan data berdasarkan kode dipilih
getArticlesById(idarticle: string):Observable<Article>{
  let cpHeaders = new Headers({'Content-Type': 'application/json'});
  let cpParams = new URLSearchParams();
  cpParams.set('idarticle', idarticle);
  let options = new RequestOptions({headers: cpHeaders, params: cpParams});
  return this._http.get(this._UriFetchId + idarticle, options)
  .map(this.getDataJson).catch(this.getHandlingError);
}

//method menampilkan semua data
getAllArticles():Observable<Article[]>{
  return this._http.get(this._UriArticles)
  .map(this.getDataJson);
}

}
