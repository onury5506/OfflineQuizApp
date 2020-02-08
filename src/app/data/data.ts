import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resolve } from 'url';
//import { jsonFile } from '../../assets/questions/'


@Injectable({
    providedIn: 'root'
  })
export class categoriesData{
    constructor(private httpClient:HttpClient){
    }

    read(){
        return new Promise((resolve)=>{
            var read = this.httpClient.get("/assets/questions/categories.json")
            read.subscribe((data:any) => {
                resolve(data.categories)
            } )
        })
        
    }
}

@Injectable({
    providedIn: 'root'
  })
export class questionsData{
    constructor(private httpClient:HttpClient){
    }

    read(jsonFile){
        return new Promise((resolve)=>{
            var read = this.httpClient.get(jsonFile)
            read.subscribe((data:any) => {
                resolve(data.questions)
            } )
        })
    }
}