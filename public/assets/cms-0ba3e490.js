import{_ as g,d as y,D as C,E as S,n as x,o as c,c as r,b as s,g as u,u as F,l as w,p as H,k as M,r as $,a as d,F as I}from"./index-f70f97f4.js";import{_ as R,H as B,F as E}from"./Footer-51d7529c.js";const i=o=>(H("data-v-5c86e805"),o=o(),M(),o),N={class:"header-container"},P=i(()=>s("img",{src:R,class:"logo"},null,-1)),b=["onClick"],Q=i(()=>s("h1",null,"夢幻尼樂園",-1)),V=["onClick"],D=["onClick"],O=i(()=>s("nav",null,null,-1)),j={__name:"HeaderCMS",setup(o){let t=y(!0);const n=C(),p=S().path,h=a(p);function a(e){return e.split("/")[1]}n.beforeEach((e,l,k)=>{console.log("Navigating from",l.path,"to",e.path),a(e.path)==="auth"?t.value=!1:t.value=!0,k()}),x(()=>{h==="auth"&&(t.value=!1)});async function _(){try{await w.delete("/api/v1/auth/logout"),n.push("/QRlogin")}catch(e){console.log(e)}}async function m(){try{n.push("/index")}catch(e){console.log(e)}}async function v(){try{n.push("/QRlogin")}catch(e){console.log(e)}}return(e,l)=>(c(),r("div",N,[P,s("header",null,[s("a",{onClick:u(m,["prevent"])},"回首頁",8,b),Q,F(t)?(c(),r("a",{key:0,onClick:u(v,["prevent"])},"登入",8,V)):(c(),r("a",{key:1,onClick:u(_,["prevent"])}," 登出 ",8,D))]),O]))}},q=g(j,[["__scopeId","data-v-5c86e805"]]),z={components:{Header:B,Footer:E}};function A(o,t,n,f,p,h){const a=q,_=$("router-view");return c(),r(I,null,[d(a),d(_)],64)}const L=g(z,[["render",A]]);export{L as default};