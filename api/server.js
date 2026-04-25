// Simple Express proxy for OpenAI
// Run: npm install express node-fetch dotenv
// Then: node api/server.js
require('dotenv').config();
const express=require('express');
const fetch=require('node-fetch');
const app=express();
app.use(express.json());

app.post('/api/assistant',async(req,res)=>{
 try{
  const message=req.body.message;
  const history=req.body.history||[];
  const response=await fetch('https://api.openai.com/v1/chat/completions',{
   method:'POST',
   headers:{
    'Content-Type':'application/json',
    'Authorization':'Bearer '+process.env.OPENAI_API_KEY
   },
   body:JSON.stringify({
    model:'gpt-4o-mini',
    messages:[
     {role:'system',content:'You are a concise, practical assistant for old iPads.'}
    ].concat(history.map(h=>({role:h.role,content:h.content}))).concat([{role:'user',content:message}])
   })
  });
  const data=await response.json();
  const text=(data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content)||'';
  res.json({text});
 }catch(e){res.json({error:e.message});}
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log('Assistant API running on '+PORT));
