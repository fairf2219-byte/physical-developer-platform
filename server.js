const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-this-password";
const DATA = path.join(__dirname, "data.json");
app.use(express.json({limit:"2mb"}));
app.use(express.static(path.join(__dirname,"public")));
function load(){try{return JSON.parse(fs.readFileSync(DATA,"utf8"))}catch{return {apps:[]}}}
function save(db){fs.writeFileSync(DATA,JSON.stringify(db,null,2))}
function admin(req,res,next){const token=req.headers.authorization||"";if(token!== "Bearer "+ADMIN_PASSWORD)return res.status(401).json({error:"Unauthorized"});next()}
app.get("/api/health",(req,res)=>res.json({ok:true}));
app.get("/api/apps",(req,res)=>res.json(load().apps.map(({id,name,developer,description,status,createdAt,reviewNote,publishedAt})=>({id,name,developer,description,status,createdAt,reviewNote,publishedAt}))));
app.get("/api/store",(req,res)=>res.json(load().apps.filter(a=>a.status==="Published").map(({id,name,developer,description,buildUrl,publishedAt})=>({id,name,developer,description,buildUrl,publishedAt}))));
app.post("/api/apps",(req,res)=>{const {name,developer,description,buildUrl}=req.body||{};if(!name||!developer||!description)return res.status(400).json({error:"Complete all required fields."});const db=load();const item={id:crypto.randomUUID(),name:String(name).slice(0,80),developer:String(developer).slice(0,80),description:String(description).slice(0,1000),buildUrl:String(buildUrl||"").slice(0,500),status:"Pending",createdAt:new Date().toISOString(),reviewNote:""};db.apps.unshift(item);save(db);res.status(201).json(item)});
app.get("/api/admin/apps",admin,(req,res)=>res.json(load().apps));
app.post("/api/admin/review/:id",admin,(req,res)=>{const {status,note=""}=req.body||{};if(!["Published","Rejected","Pending"].includes(status))return res.status(400).json({error:"Invalid status"});const db=load();const item=db.apps.find(a=>a.id===req.params.id);if(!item)return res.status(404).json({error:"App not found"});item.status=status;item.reviewNote=String(note).slice(0,500);item.reviewedAt=new Date().toISOString();if(status==="Published")item.publishedAt=new Date().toISOString();else delete item.publishedAt;save(db);res.json(item)});
app.listen(PORT,()=>console.log("PHYSICAL Developer Platform running on "+PORT));