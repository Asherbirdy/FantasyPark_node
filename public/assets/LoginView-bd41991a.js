import{_ as z}from"./Button-10dfdbdc.js";import{_ as S,d as n,r as C,o as h,c as w,b as e,e as c,v as x,u as l,f as b,i as g,a as v,w as f,g as B,h as I,j as k,p as N,k as T,l as E,m as L}from"./index-cde09f8b.js";const i=r=>(N("data-v-51e718a0"),r=r(),T(),r),F=i(()=>e("h1",null,"歡迎回來～",-1)),M=i(()=>e("p",{class:"sub-title"},"立即登入並預訂並進入冒險者的旅程吧！",-1)),P={class:"userPassword"},U={class:"input-box"},j={class:"emailpassword-box"},D=i(()=>e("p",null,"電子信箱",-1)),R={style:{color:"red","font-size":"10px"},"font-size":"2px"},q={class:"input-box"},A={class:"emailpassword-box"},G=i(()=>e("p",null,"密嗎",-1)),H={style:{color:"red","font-size":"10px"},"font-size":"2px"},J={class:"btn-box"},K={key:0,class:"loading-screen"},O=i(()=>e("p",null,"登入中...",-1)),Q=[O],W={__name:"LoginView",setup(r){let t=n(""),s=n("");const p=n(!1),d=n(!1),u=n(!1);async function y(){try{p.value=!1,d.value=!1,t.value||(p.value=!0),s.value||(d.value=!0),t.value&&s.value&&(u.value=!0,await E.post("api/v1/auth/login",{email:t.value,password:s.value}),await new Promise(o=>setTimeout(o,3e3)),u.value=!1,L.push("/user/userTicket"))}catch(o){if(u.value=!1,o.response&&o.response.status===401){s.value="",alert("錯誤帳號/密碼");return}return}}return(o,_)=>{const m=z,V=C("router-link");return h(),w("form",null,[e("main",null,[F,M,e("div",P,[e("div",U,[e("div",j,[D,c(e("p",R," 請輸入電子信箱 ",512),[[x,l(p)]])]),c(e("input",{"onUpdate:modelValue":_[0]||(_[0]=a=>g(t)?t.value=a:t=a),autocomplete:"username",type:"text"},null,512),[[b,l(t)]])]),e("div",q,[e("div",A,[G,c(e("p",H," 請輸入密碼 ",512),[[x,l(d)]])]),c(e("input",{"onUpdate:modelValue":_[1]||(_[1]=a=>g(s)?s.value=a:s=a),type:"password",autocomplete:"current-password"},null,512),[[b,l(s)]])])]),e("div",J,[v(V,{to:"/register"},{default:f(()=>[v(m,{btnFontSize:"10px"},{default:f(()=>[k("註冊")]),_:1})]),_:1}),v(m,{onClick:B(y,["prevent"]),btnFontSize:"10px"},{default:f(()=>[k("登入")]),_:1},8,["onClick"])]),l(u)?(h(),w("div",K,Q)):I("",!0)])])}}},Z=S(W,[["__scopeId","data-v-51e718a0"]]);export{Z as default};
