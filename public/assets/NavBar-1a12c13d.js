import{_ as u,e as l,r as p,o as t,c as s,F as i,z as m,x as d,w as f,b as a,B as h,t as v}from"./index-112d644b.js";const x={class:"content"},k={__name:"NavBar",props:{statusIdx:{type:Number,default:0}},setup(o){const r=o,n=l([{name:"票夾",routePath:"/user/userticket"},{name:"購物車",routePath:"/user/cart"},{name:"會員資料",routePath:"/user/profile"}]);return(B,b)=>{const c=p("router-link");return t(),s("div",x,[(t(!0),s(i,null,m(n.value,(e,_)=>(t(),d(c,{key:e.name,to:e.routePath},{default:f(()=>[a("div",null,[a("h3",{class:h({selected:_===r.statusIdx})},v(e.name),3)])]),_:2},1032,["to"]))),128))])}}},g=u(k,[["__scopeId","data-v-9c173eb2"]]);export{g as _};
