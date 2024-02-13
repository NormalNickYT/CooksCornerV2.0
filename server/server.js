import { PrismaClient } from '@prisma/client'
const express = require('express')
const app = express()
const prisma = new PrismaClient();

const port = 5000

var postRoute = require('./routes/post');

app.use('/post', postRoute)

app.listen(port, () => {
  console.log(`Server Started On: ${port}`)
})