const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { query } = require("express");
const port = process.env.PORT || 5000;

const app = express();

//middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bhd8f8k.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const mongodbConnect = () => {
  try {
    client.connect();
    console.log("mongodb connected");
  } catch (err) {
    console.log(err);
  }
};
mongodbConnect();

///////////Mongodb collection/////////////
const propertyCollection = client.db("realEstate").collection("allProperties");

app.get("/properties", async (req, res) => {
  const location = req.query.lo;
  const propertyType = req.query.pr;
  const time = req.query.wh;
  const price = req.query.pri;
  const price1 = parseInt(price.split("-")[0]);
  const price2 = parseInt(price.split("-")[1]);

  console.log(location, propertyType, time, price);

  if (location === "undefined") {
    const properties = await propertyCollection.find().toArray();
    return res.send(properties);
  }

  const query = {
    $and: [
      { location: { $regex: location } },
      { propertyType: { $regex: propertyType } },
      { date: { $regex: time } },
      { price: { $gt: price1, $lt: price2 } },
    ],
  };
  const properties = await propertyCollection.find(query).toArray();
  res.send(properties);
});

app.get("/", async (req, res) => {
  res.send("real estate server is running");
});

app.listen(port, () => console.log(`Server running on ${port}`));
