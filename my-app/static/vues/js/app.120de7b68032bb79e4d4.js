webpackJsonp([1],{NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n("7+uW"),r={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("img",{attrs:{src:"http://ticketimage.interpark.com/TicketImage/2015/20150429_main/img/footer/footer_logo.jpg"}}),this._v(" "),t("router-view")],1)},staticRenderFns:[]};var a=n("VU/8")({name:"App"},r,!1,function(e){n("UzjK")},null,null).exports,s=n("/ocq"),i=n("mvHQ"),c=n.n(i),l=n("mtWM"),p=n.n(l),u={name:"HelloWorld",data:function(){return{reqURL:"http://35.200.40.38:3000/api/scripts",myIP:"",msg:"Welcome!!",input:"",response:"",dataList:""}},mounted:function(){var e=this;p()({method:"GET",url:"https://httpbin.org/ip"}).then(function(t){e.myIP=t.data.origin},function(e){console.error(e)})},methods:{reqData:function(){var e=this;p()({method:"GET",url:this.reqURL,headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"}}).then(function(t){console.log("OK"+c()(t)),console.log("response = "+t.data.response),e.dataList=t.data.data,e.msg=t.data.msg,e.response=c()(t)},function(t){e.msg="error : "+t,console.error(t)})}}},m={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"hello"},[n("h1",[e._v(e._s(e.msg))]),e._v(" "),n("p",[e._v("Your IP is "+e._s(e.myIP))]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.reqURL,expression:"reqURL"}],attrs:{type:"text",placeholder:"v-model.reqURL"},domProps:{value:e.reqURL},on:{input:function(t){t.target.composing||(e.reqURL=t.target.value)}}}),e._v(" "),n("button",{on:{click:function(t){e.reqData()}}},[e._v("Request")]),e._v(" "),n("br"),e._v(" "),n("br"),e._v(" "),n("ol",e._l(e.dataList,function(t){return n("li",[e._v(" "+e._s(t.title)+" ")])})),e._v(" "),n("textarea",[e._v(e._s(e.response))])])},staticRenderFns:[]};var d=n("VU/8")(u,m,!1,function(e){n("h0jA")},"data-v-2e07c056",null).exports;o.a.use(s.a);var v=new s.a({routes:[{path:"/",name:"HelloWorld",component:d}]});o.a.config.productionTip=!1,new o.a({el:"#app",router:v,components:{App:a},template:"<App/>"})},UzjK:function(e,t){},h0jA:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.120de7b68032bb79e4d4.js.map