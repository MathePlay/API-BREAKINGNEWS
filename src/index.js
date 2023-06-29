import express from 'express'
import connectDatabase from "./database/database.js"
import dotenv from 'dotenv'

import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import newsRoute from './routes/news.route.js'
import swaggerRoute from './routes/swagger.route.cjs'

import cors from 'cors'


dotenv.config()

const port = process.env.PORT || 3000
const app = express()

app.use(cors()) // Use this after the variable declaration

connectDatabase()
app.use(express.json())
app.use("/user", userRoute)
app.use("/auth", authRoute)
app.use("/news", newsRoute)
app.use("/doc", swaggerRoute)

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))