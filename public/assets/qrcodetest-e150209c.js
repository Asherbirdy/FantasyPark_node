import{d as r,o as n,c as s,e as d,f as i,b as l,h as _}from"./index-cde09f8b.js";import{b as m}from"./browser-e933942f.js";const p=["src"],x={__name:"qrcodetest",setup(v){const e=r(""),t=r(""),c=async()=>{if(e.value.trim()==="")return;const a=await m.toDataURL(e.value);t.value=a};return(a,o)=>(n(),s("main",null,[d(l("input",{"onUpdate:modelValue":o[0]||(o[0]=u=>e.value=u),placeholder:"Enter QR Code Text"},null,512),[[i,e.value]]),l("button",{onClick:c},"Generate QR Code"),t.value?(n(),s("img",{key:0,src:t.value,alt:"QR Code"},null,8,p)):_("",!0)]))}};export{x as default};
