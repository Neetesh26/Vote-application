const express =require('express')
const app =express()
// require('dotenv').config()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
const PORT = process.env.POST || 3000

app.listen(PORT , () =>{
    console.log("Server listening on port : ", PORT);
    
})