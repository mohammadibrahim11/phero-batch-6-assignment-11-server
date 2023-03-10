const express = require("express");
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gbplfqy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});





async function run() {
  try {
    const serviceCollection = client
      .db("cleaningService")
      .collection("services");
    const reviewsCollection = client
      .db("cleaningService")
      .collection("reviews");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).sort({ _id: -01 });
      const services = await cursor.toArray();
      res.send(services);
    });

    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    app.get("/servicesHome", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const serviceDetails = await serviceCollection.findOne(query);
      res.send(serviceDetails);
    });

    app.get("/reviews", async (req, res) => {
      let query = {};
      if(req.query.email){
        query={
          email: req.query.email
        }
      }
      const cursor = reviewsCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    app.get("/reviews/:id", async (req, res) => {
      console.log(req.params.id);
      const cursor = reviewsCollection.find({ service: req.params.id });
      const reviews = await cursor.toArray();
      res.json(reviews);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const reviews = req.body;
      const option = { upsert: true };
      const updateReview = {
        $set: {
          name: reviews.nmae,
          text: reviews.text,
          photoUrl: reviews.photoUrl,
        },
      };
      const result = await reviewsCollection.updateOne(
        filter,
        updateReview,
        option
      );
      console.log(result);
      res.send(result);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
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
