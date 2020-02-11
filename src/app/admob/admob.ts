import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

@Injectable({
    providedIn: 'root'
  })
export class Admob{

    admobId;
    test:boolean=true;
    private static intReady:number=0;//0 not read-1 loading-2 ready

    constructor(private platfrom:Platform
        ,public admobFree:AdMobFree
        ){
        if(this.platfrom.is("android")){
            this.admobId={
                banner: 'ca-app-pub-3940256099942544/6300978111',
                interstitial: 'ca-app-pub-3940256099942544/1033173712'
            }
        }else if(this.platfrom.is("ios")){
            this.admobId={
                banner: 'test',
                interstitial: 'test'
            }
        }
    }

    showBanner(){
        if(this.admobId){
            this.admobFree.banner.config({
                id:this.admobId.banner,
                isTesting:this.test,
                overlap: false,
                autoShow:true
            })
            console.log("id : "+this.admobId.banner)
            this.admobFree.banner.prepare()
        }
    }

    prepareInterstitial(){
        if(this.admobId && Admob.intReady == 0){
            this.admobFree.interstitial.config({
                id:this.admobId.interstitial,
                isTesting:this.test,
                autoShow:false
            })
            //console.log("id : "+this.admobId.interstitial)
            Admob.intReady = 1;
            //console.log("hazirlaniyo")
            
            
            this.admobFree.interstitial.prepare().then(()=>{
                Admob.intReady = 2;
            }).catch((err)=>{
                console.log(err)
            })
            //this.admobFree.on(this.admobFree.events.INTERSTITIAL_LOAD).subscribe((d)=>console.log("INTERSTITIAL_LOAD :",d))
            //this.admobFree.on(this.admobFree.events.INTERSTITIAL_LOAD_FAIL).subscribe((d)=>console.log("INTERSTITIAL_LOAD_FAIL :",d))
        }
    }

    showInterstitial(){
        if(Admob.intReady == 2){
            Admob.intReady = 0;
            this.admobFree.interstitial.show()
            //console.log("gösterildi")
        }
    }

    interstitialReady():boolean{
        return Admob.intReady==2
    }
}