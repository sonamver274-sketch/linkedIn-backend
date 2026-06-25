import dotenv from "dotenv"
import app from "./app.js"
import mongoose from "mongoose"
import mongoDb from "./src/db/db.js"

 dotenv.config()


mongoDb().then(()=>{
    app.listen(process.env.PORT, '0.0.0.0', ()=>{
        console.log("server is running ");
    })
})

 