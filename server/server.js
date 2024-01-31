const express = require('express')
const app = express()
const port = 5000

app.get('/api', (req, res) => {
    res.json({"users": ["BackEndTest1", "BackEndTest2", "BackEndTest3"]})
  })

app.listen(port, () => {
console.log(`Server Started On: ${port}`)
})