import{_ as l,e as u,o as a,c,G as _,s as p,u as b,k as f}from"./index-d4824696.js";const d={__name:"Button",props:{btnTextColor:{type:String,default:"white"},btnFontSize:{type:String,default:"12px"},btnColor:{type:String,default:"#30B0C9"},btnHoverColor:{type:String,default:"#0694A7"}},setup(e){const o=e,t=u({color:o.btnTextColor,fontSize:o.btnFontSize,backgroundColor:o.btnColor}),n=()=>{t.value.backgroundColor=o.btnHoverColor},r=()=>{t.value.backgroundColor=o.btnColor};return(s,i)=>(a(),c("button",{style:p(b(t)),onMouseover:n,onMouseout:r},[_(s.$slots,"default",{},()=>[f("預設")],!0)],36))}},S=l(d,[["__scopeId","data-v-35fecb2f"]]);export{S as _};