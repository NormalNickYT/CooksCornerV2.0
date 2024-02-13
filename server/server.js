import { PrismaClient } from '@prisma/client'
const express = require('express')
const app = express()
const prisma = new PrismaClient();

const port = 5000

app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server Started On: ${port}`)
})

