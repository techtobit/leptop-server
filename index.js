const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6wtoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const database = client.db("inventoryDb")
    const inventorysCollection = database.collection("inventorys");

    // inventorys get sight
    app.get('/inventorys', async (req, res) => {
      const cursor = inventorysCollection.find({});
      const inventory = await cursor.toArray();
      res.send(inventory);
    })
    app.post('/inventorys', async (req, res) => {
      const addItem = req.body;
      const result = await inventorysCollection.insertOne(addItem);
      console.log(result);
      res.send(result)

    });
    // get single inventorys sightfinshed
    app.get('/inventorys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventory = await inventorysCollection.findOne(query);
      res.json(inventory);
    })

    // Delete a product sight finished
    app.delete('/inventorys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await inventorysCollection.deleteOne(filter);
      res.send(result);
    });

    // deliverd sight
    // app.put('/inventorys/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updatedInventory = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   console.log(id, updatedInventory, filter)
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       quantity: updatedInventory.quantity,
    //     }
    //   };
    //   console.log(updateDoc)

    //   const result = await inventorysCollection.updateOne(filter, updateDoc, options);
    //   res.send(result);
    // })
    //  deliverd end





  } finally {
    //   await client.close();
  }
}
run().catch((console.dir));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`sever run success`, port)
})