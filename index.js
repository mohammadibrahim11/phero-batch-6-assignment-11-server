const express = require("express");
const cors = require("cors");
const jwt =require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.post('/jwt',(req,res)=>{
  const user = req.body;
  console.log(user);
  const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'7d'})
  res.send({token})
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gbplfqy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
 
  try {

    const serviceCollection = client.db("cleaningService").collection("services");
    const reviewsCollection = client.db('cleaningService').collection('reviews');

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/servicesHome", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });


    app.get('/services/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const serviceDetails = await serviceCollection.findOne(query);
      res.send(serviceDetails);
    });

    app.get('/reviews', async(req,res)=>{
      console.log(req.query.email);
      let query = {};
      if(req.query.email){
        query={
          email:req.query.email
        }
      }
      const cursor = reviewsCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    })

    app.get('/reviews/:id',async(req,res)=>{
      console.log(req.params.id);
      const cursor = reviewsCollection.find({service: req.params.id})
      const reviews = await cursor.toArray()
      res.json(reviews)
    })


    app.post('/reviews', async(req,res)=>{
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    })
  } 
  finally {
  }
}
run().catch((error) => console.log(error));

// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.get("/", (req, res) => {
  res.send("simple node server running");
});
app.listen(port, () => {
  console.log("node server is running on 5000");
});
