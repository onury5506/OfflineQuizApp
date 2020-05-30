import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class Admob{

    admobId;
    test:boolean=true;
    private static intReady:number=0;//0 not read-1 loading-2 ready
    private static rewReady:number=0;//0 not read-1 loading-2 ready

    constructor(private platfrom:Platform
        ,public admobFree:AdMobFree
        ){
        if(this.platfrom.is("android")){
            this.admobId={
                banner: 'ca-app-pub-1015902786782911/2509005190',
                interstitial: 'ca-app-pub-1015902786782911/2317433500',
                rewarded: 'ca-app-pub-1015902786782911/1766575644'
            }
        }else if(this.platfrom.is("ios")){
            this.admobId={
                banner: 'test',
                interstitial: 'test'
            }
        }
        this.prepareInterstitial()
        this.prepareRewarded()
        this.admobFree.on(this.admobFree.events.REWARD_VIDEO_CLOSE)
        .subscribe(()=>{
            this.prepareRewarded()
        })
        this.admobFree.on(this.admobFree.events.INTERSTITIAL_CLOSE)
            .subscribe(this.prepareInterstitial)
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
                console.log("err")
                console.log(err)
            })
            //this.admobFree.on(this.admobFree.events.INTERSTITIAL_LOAD).subscribe((d)=>console.log("INTERSTITIAL_LOAD :",d))
            //this.admobFree.on(this.admobFree.events.INTERSTITIAL_LOAD_FAIL).subscribe((d)=>console.log("INTERSTITIAL_LOAD_FAIL :",d))
        }
    }

    showInterstitial(){
        if(this.interstitialReady()){
            Admob.intReady = 0;
            this.admobFree.interstitial.show()
        }
    }
    

    afterCloseInterstitial(func){
        if(this.admobId){
            var subs:Subscription = this.admobFree.on(this.admobFree.events.INTERSTITIAL_CLOSE)
            .subscribe(()=>{
                func()
                subs.unsubscribe()
            })
        }
    }

    interstitialReady():boolean{
        return Admob.intReady==2
    }

    prepareRewarded(){
        if(this.admobId && Admob.rewReady == 0){
            this.admobFree.rewardVideo.config({
                id:this.admobId.rewarded,
                isTesting:this.test,
                autoShow:false
            })
            //console.log("id : "+this.admobId.rewarded)
            Admob.rewReady = 1;
            console.log("rewarded hazirlaniyor")
            
            
            this.admobFree.rewardVideo.prepare().then(()=>{
                Admob.rewReady = 2;
                console.log("rewarded hazir")
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    showRewarded(){
        if(this.rewardedReady()){
            Admob.rewReady=0;
            this.admobFree.rewardVideo.show()
        }
    }

    setRewardedVideoReward(func){
        var subs:Subscription = this.admobFree.on(this.admobFree.events.REWARD_VIDEO_REWARD)
        .subscribe(()=>{
            func()
            subs.unsubscribe()
        })
    }

    afterCloseRewarded(func){
        var subs:Subscription = this.admobFree.on(this.admobFree.events.REWARD_VIDEO_CLOSE)
        .subscribe(()=>{
            func()
            subs.unsubscribe()
        })
    }

    rewardedReady():boolean{
        return Admob.rewReady==2
    }
}