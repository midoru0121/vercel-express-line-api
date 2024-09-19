const express = require('express');

const app = express()
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const PORT = 8000

app.get('/', (req, res) => {
  console.log("console.log(req.body)", req.body)
  res.send('Hello World')
})

app.get('/about', (req, res) => {
  res.send('About route 🎉 ')
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})