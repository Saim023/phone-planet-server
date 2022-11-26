const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const usersCollection = client.db('phonePlanet').collection('users')
        const bookingsCollection = client.db('phonePlanet').collection('bookings')


        // jwt
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);

            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '365d' });
                return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: '' })
        })

        // Users

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        app.get('/iphone', async (req, res) => {
            const query = {};
            const iphone = await iphoneCollection.find(query).toArray();
            res.send(iphone)
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;

            const query = {
                email: booking.email,
                item: booking.item,
            }

            const alreadyBooked = await bookingsCollection.find(query).toArray();

            if (alreadyBooked.length) {
                const message = `You already booked this item`
                return res.send({
                    acknowledged: false, message
                })
            }

            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
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