(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d5e07a7e"],{"615b":function(s,t,e){},b0af:function(s,t,e){"use strict";e("615b");var a=e("10d2"),r=e("297c"),o=e("1c87"),i=e("58df");t["a"]=Object(i["a"])(r["a"],o["a"],a["a"]).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes(){return{"v-card":!0,...o["a"].options.computed.classes.call(this),"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised,...a["a"].options.computed.classes.call(this)}},styles(){const s={...a["a"].options.computed.styles.call(this)};return this.img&&(s.background=`url("${this.img}") center center / cover no-repeat`),s}},methods:{genProgress(){const s=r["a"].options.methods.genProgress.call(this);return s?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[s]):null}},render(s){const{tag:t,data:e}=this.generateRouteLink();return e.style=this.styles,this.isClickable&&(e.attrs=e.attrs||{},e.attrs.tabindex=0),s(t,this.setBackgroundColor(this.color,e),[this.genProgress(),this.$slots.default])}})}}]);
//# sourceMappingURL=chunk-d5e07a7e.211a340e.js.map