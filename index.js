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

async function run() {
    try {
        const iphoneCollection = client.db('phonePlanet').collection('iphone')
        const xiaomiCollection = client.db('phonePlanet').collection('xiaomi')
        const oneplusCollection = client.db('phonePlanet').collection('oneplus')

        app.get('/iphone', async (req, res) => {
            const query = {};
            const iphone = await iphoneCollection.find(query).toArray();
            res.send(iphone)
        })


        app.get('/xiaomi', async (req, res) => {
            const query = {};
            const xiaomi = await xiaomiCollection.find(query).toArray();
            res.send(xiaomi)
        })

        app.get('/oneplus', async (req, res) => {
            const query = {};
            const oneplus = await oneplusCollection.find(query).toArray();
            res.send(oneplus)
        })

    }
    finally {

    }
}
run().catch(() => console.log())




app.get('/', async (req, res) => {
    res.send('Phone Planet server is running...')
})

app.listen(port, () => {
    console.log(`Phone Planet server running on ${port}`)
})