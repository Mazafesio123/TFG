(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0d6ef2"],{7553:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card",{attrs:{"max-width":"800px",width:"100%"}},[a("v-sheet",{staticClass:"py-2",attrs:{color:"secondary"}},[a("v-card-title",{staticClass:"white--text"},[t._v("Nuevo ticket")])],1),a("v-form",{staticClass:"pa-4",on:{submit:function(e){return e.preventDefault(),t.submitHandler(e)}}},[a("v-text-field",{attrs:{color:"secondary",block:"",filled:"",label:"Título",rules:[t.rules.req]},model:{value:t.titulo,callback:function(e){t.titulo=e},expression:"titulo"}}),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{text:"",color:"secondary"},on:{click:function(e){return t.$emit("cancel")}}},[t._v("Cancelar")]),a("v-btn",{attrs:{type:"submit",text:"",color:"secondary"}},[t._v("Crear")])],1)],1)],1)},n=[],c=a("1da1"),o=(a("96cf"),a("5f37")),l={data:function(){return{titulo:"",rules:{req:o["b"]}}},methods:{submitHandler:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,axios({method:"POST",url:"".concat("http://localhost/api","/issue"),data:{title:t.titulo}});case 2:t.$emit("reload"),t.$emit("cancel");case 4:case"end":return e.stop()}}),e)})))()}}},s=l,i=a("2877"),u=a("6544"),d=a.n(u),f=a("8336"),p=a("b0af"),v=a("99d9"),m=a("4bd4"),b=a("8dd9"),h=a("2fa4"),w=a("8654"),x=Object(i["a"])(s,r,n,!1,null,null,null);e["default"]=x.exports;d()(x,{VBtn:f["a"],VCard:p["a"],VCardActions:v["a"],VCardTitle:v["d"],VForm:m["a"],VSheet:b["a"],VSpacer:h["a"],VTextField:w["a"]})}}]);
//# sourceMappingURL=chunk-2d0d6ef2.5fb992dd.js.map