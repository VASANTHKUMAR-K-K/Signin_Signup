import express from 'express';
import dotenv from 'dotenv'
import connectDB from './database.js';



const app=express()
dotenv.config();

//MIDDLEWARE
app.use(express.json())

//STATIC FILES
app.use('/uploads', express.static("uploads"))

const port=process.env.PORT


//Import Routes
import userRoutes from './Routes/Users.js';
import productRoutes from './Routes/product.js'

//Using Routes
app.use("/api/", userRoutes)
app.use("/api/", productRoutes)



app.get('/', (req,res)=>{
    res.send('<h1>Home</h1>')
})

app.listen(port,()=>{
    console.log(`Server is running on the ${port}`)
    connectDB();
})






