import{_ as A}from"./NavBar-4366b7c7.js";import{_ as B}from"./Button-10dfdbdc.js";import{_ as N,d as p,n as U,l as T,z as $,o as v,c as _,u as s,b as t,t as l,a as f,w as b,h as P,e as M,f as z,i as O,F as w,q as j,g as E,A as q,j as g,p as J,k as L,m as R}from"./index-cde09f8b.js";import{g as Y}from"./index-71a875f6.js";const r=m=>(J("data-v-d70a5b96"),m=m(),L(),m),G={key:0,class:"modal-overlay"},H={class:"modal"},K={class:"m-wrapper"},Q=r(()=>t("h3",null,"一組帳號只能在同日期買五張票",-1)),W={class:"m-userTickets"},X=r(()=>t("p",null,"目前",-1)),Z=r(()=>t("p",null,"可再購買",-1)),tt=r(()=>t("p",{class:"m-title"},"購票須知",-1)),et=r(()=>t("div",{class:"m-ticketInfo"},[t("div",null,[t("p",null,"成人票 : 18歲以上"),t("p",null,"兒童票 :08~ 18歲")]),t("div",null,[t("p",null,"優待票 :需有殘障手冊證明"),t("p",null,"免費:08歲以下免費")])],-1)),at={class:"btn"},nt={class:"cart"},st={class:"timeInfoBar"},ot={class:"timepicker"},lt=r(()=>t("h2",null,"日期：",-1)),it=["min"],ct={key:1},dt={class:"ticketInfo"},ut={class:"counter"},rt=["onClick"],pt=["onClick"],vt=q('<section data-v-d70a5b96><div class="payment" data-v-d70a5b96><h3 class="payment-title" data-v-d70a5b96>信用卡支付</h3><div class="payment-content" data-v-d70a5b96><div data-v-d70a5b96><p data-v-d70a5b96>信用卡</p><input class="big-input" type="text" placeholder="4136815292895026" data-v-d70a5b96></div><div class="twoInputBox" data-v-d70a5b96><div data-v-d70a5b96><p data-v-d70a5b96>過期日</p><input class="small-input" type="text" placeholder="10/18" data-v-d70a5b96></div><div data-v-d70a5b96><p data-v-d70a5b96>CVC</p><input class="small-input" type="text" placeholder="212" data-v-d70a5b96></div></div><div data-v-d70a5b96><p data-v-d70a5b96>優惠碼</p><input class="big-input" type="text" data-v-d70a5b96></div></div></div></section>',1),_t=r(()=>t("hr",null,null,-1)),ht={class:"pricePaybox"},mt={__name:"CartView",setup(m){const k=p(!1),o=p(""),y=p(0),d=p({allTicketsInfo:[],count:0}),c=p({count:0,findTodayUnuseTicket:[]});p(),U(async()=>{var a;try{const e=await T.get("/api/v1/ticketCategory");d.value.allTicketsInfo=e.data.allTicketsInfo,d.value.allTicketsInfo.forEach(n=>{n.amount=0}),d.value.count=e.data.count;const i=(await T.get("/api/v1/userTickets/getTickets")).data;if(i.length>0){const n=(a=i[0])==null?void 0:a.ticketDate,x=Y(n);c.value.count=i.length,c.value.findTodayUnuseTicket=i,o.value=x}}catch(e){console.error(e);return}});const C=function(){k.value=!k.value},I=(a,e)=>{h.value+(e?1:-1)<=5?e?5-c.value.count-h.value>0?(a.amount=(a.amount||0)+1,S()):alert("一組帳號只能在同日期買五張票"):a.amount>0&&(a.amount--,S()):alert("一組帳號只能買五張票")},D=()=>{const a=new Date,e=a.getFullYear(),u=String(a.getMonth()+1).padStart(2,"0"),i=String(a.getDate()).padStart(2,"0");return`${e}-${u}-${i}`};function S(){y.value=d.value.allTicketsInfo.reduce((a,e)=>a+(e.amount||0)*e.price,0)}const h=$(()=>d.value.allTicketsInfo.reduce((a,e)=>a+(e.amount||0),0));async function V(){if(!o.value)return alert("請輸入日期");if(h.value===0)return alert("請加購票券");const a=d.value.allTicketsInfo.filter(e=>e.amount!==0).map(e=>({ticketDate:o.value,ticketId:e._id,amount:e.amount}));o.value&&h.value>0&&T.post("/api/v1/order",a).then(e=>{localStorage.setItem("order",JSON.stringify(e.data)),R.push("/user/order")}).catch(e=>{alert(e.response.data.msg)})}return(a,e)=>{const u=B,i=A;return v(),_(w,null,[s(k)?(v(),_("div",G,[t("div",H,[t("div",K,[Q,t("div",W,[t("div",null,[X,t("h4",null,l(s(o)?s(o):"無購買票")+" "+l(s(c).count!==0?`有${s(c).findTodayUnuseTicket.length}張`:""),1)]),t("div",null,[Z,t("h4",null,l(5-(s(c).findTodayUnuseTicket?s(c).findTodayUnuseTicket.length:0))+"張票 ",1)])]),tt,et,t("div",at,[f(u,{btnFontSize:"0.5",onClick:C},{default:b(()=>[g("返回")]),_:1})])])])])):P("",!0),f(i,{statusIdx:1,class:"navbar"}),t("main",null,[t("section",null,[t("div",nt,[t("div",st,[t("div",ot,[lt,s(c).count===0?M((v(),_("input",{key:0,type:"date","onUpdate:modelValue":e[0]||(e[0]=n=>O(o)?o.value=n:null),onChange:e[1]||(e[1]=(...n)=>a.handleDateChange&&a.handleDateChange(...n)),class:"date-input",min:D()},null,40,it)),[[z,s(o)]]):(v(),_("h2",ct,l(s(o)),1))]),f(u,{btnFontSize:"0.3rem",onClick:C,class:"btn"},{default:b(()=>[g("暸解票券資訊")]),_:1})]),(v(!0),_(w,null,j(s(d).allTicketsInfo,(n,x)=>(v(),_("div",{class:"ticketsOrder",key:n._id},[t("div",dt,[t("h4",null,l(n.ticketType)+" ("+l(n.fastTrack?"快速通關":"一般")+") ",1),t("p",null,l(n.price)+"元",1)]),t("div",ut,[t("div",{class:"box",onClick:F=>I(n,!1)}," - ",8,rt),t("p",null,l(n.amount||0),1),t("div",{class:"box",onClick:F=>I(n,!0)}," + ",8,pt)])]))),128))])]),vt]),_t,t("div",ht,[t("h3",null,"總價:"+l(s(y))+"元 ; 票數:"+l(s(h))+"張",1),f(u,{btnFontSize:"0.3rem",onClick:E(V,["prevent"]),btnColor:"#0694A7"},{default:b(()=>[g("支付")]),_:1},8,["onClick"])])],64)}}},gt=N(mt,[["__scopeId","data-v-d70a5b96"]]);export{gt as default};
