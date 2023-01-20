const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8tifwil.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)


async function run(req, res){
    try {


        // connect collections with mongodb client 

        const MinionsCollection = client.db('ShunnoIT').collection('Minions');


        // add data on minions collections collection 

        app.post('/minions', async(req, res)=>{
            const newMinions = req.body;
            const query = {
                Name: newMinions.name,
                Age: newMinions.age,
                Color: newMinions.color
            }

            const result = await MinionsCollection.insertOne(query)
            res.send(result)
        })

        // get all data from server minions collection 

        app.get('/minions', async(req, res)=>{
            const query ={};
            const result = await MinionsCollection.find(query).toArray()
            res.send(result);
        })

        // get single data from server minions collection 

        app.get('/minions/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await MinionsCollection.findOne(query)
            res.send(result);
        })


        // update one data from server minions collection using id 

        app.put('/minions/:id', async(req, res)=>{
            const id = req.params.id;
            const color = req.body;
            const filter = {_id: ObjectId(id)}
            const options = {upsert: true}
            const updateDoc ={
                $set:{
                    Color: color
                }
            }
            const result = await MinionsCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })


        // delete on data from server minions collection using id 

        app.delete('/minions/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await MinionsCollection.deleteOne(query)
            res.send(result)
        })


    }
    finally{

    }
}

run().catch(console.log())

// midleware
app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Minions  app listening on port ${port}`)
})