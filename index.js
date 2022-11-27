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


// verifyJWT

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader)

    if (!authHeader) {
        return res.status(401).send('unauthorized access')
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: 'forbidden access token' })
        }
        req.decoded = decoded;
        next();
    })
};

// verifySeller

const verifySeller = async (req, res, next) => {
    const decodedEmail = req.decoded.emil;
    const query = { email: decodedEmail };
    const user = await usersCollection.findOne(query);

    if (user?.role !== 'seller') {
        res.status(403).send({ message: 'forbidden access' })
    }

    next();
}

// verifyAdmin

const verifyAdmin = async (req, res, next) => {
    const decodedEmail = req.decoded.emil;
    const query = { email: decodedEmail };
    const user = await usersCollection.findOne(query);

    if (user?.role !== 'admin') {
        res.status(403).send({ message: 'forbidden access' })
    }

    next();
}


async function run() {
    try {
        const iphoneCollection = client.db('phonePlanet').collection('iphone')
        const xiaomiCollection = client.db('phonePlanet').collection('xiaomi')
        const oneplusCollection = client.db('phonePlanet').collection('oneplus')
        const usersCollection = client.db('phonePlanet').collection('users')
        const bookingsCollection = client.db('phonePlanet').collection('bookings')
        const sellerProductsCollection = client.db('phonePlanet').collection('sellerProducts')
        const sellerAdvertisedCollection = client.db('phonePlanet').collection('sellerAdvertised')


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

        // admin

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        // seller

        app.post('/users/seller', async (req, res) => {
            const addProducts = req.body;
            const result = await sellerProductsCollection.insertOne(addProducts);
            res.send(result)
        })

        app.get('/users/seller', async (req, res) => {
            const query = {};
            const myProducts = await sellerProductsCollection.find(query).toArray();
            res.send(myProducts)
        })

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        })

        app.delete('/users/seller/:id', verifyJWT, verifySeller, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await sellerProductsCollection.deleteOne(filter);
            res.send(result);
        })

        app.post('/users/seller/advertised', async (req, res) => {
            const addProducts = req.body;
            const result = await sellerAdvertisedCollection.insertOne(addProducts);
            res.send(result)
        })

        app.get('/advertised', async (req, res) => {
            const query = {};
            const advertisedItems = await sellerAdvertisedCollection.find(query).toArray();
            res.send(advertisedItems)
        })


        // iphone
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