import express from "express";
import cors from "cors";
import connection from "./db/db.js";

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

const PORT=process.env.PORT;

connection()

app.listen(PORT,()=>{ 
  console.log(`Server running on ${PORT}`);
})