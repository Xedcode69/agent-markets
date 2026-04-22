import express from 'express'
import cors from'cors'
import 'dotenv/config'

const app = express()
app.use(cors())


app.get('/', (req, res)=>{
    res.send("Welcome to Agent Markets");
})

const connection = app.listen(process.env.PORT || 3000, ()=> {
    try {
        if (connection){
            console.log("connected to server on http://localhost:3000");
        }
    } catch (error) {
        console.log("Couln't connect to server", error)
    }
});

