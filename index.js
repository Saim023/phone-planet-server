const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { query } = require('express');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 5000;


// middleware 

app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@aster.gyayqwe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




app.get('/', async (req, res) => {
    res.send('Phone Planet server is running...')
})

app.listen(port, () => {
    console.log(`Phone Planet server running on ${port}`)
})