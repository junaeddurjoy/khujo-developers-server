const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongo default


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.schfv1q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobCollection = client.db('khujodevelopers').collection('jobs');
    const applyCollection = client.db('khujodevelopers').collection('applications');

    // get all result
    app.get('/jobs', async (req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // get job details
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await jobCollection.findOne(query);
      res.send(result);
    })

    // submit applications
    app.post('/applications', async (req, res) => {
      const application = req.body;
      const result = await applyCollection.insertOne(application);
      res.send(result);
      console.log(result)
    })

    // get applied jobs
    app.get('/applications', async (req, res) => {
      const cursor = applyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // add jobs
    app.post('/jobs', async (req, res) => {
      const newJob = req.body;
      const result = await jobCollection.insertOne(newJob);
      res.send(result);
    })
    app.get('/jobs', async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // delete jobs
    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await jobCollection.deleteOne(query);
      res.send(result)
    });

    // update my jobs
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    })
    app.put('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedApply = req.body;
      const apply = {
        $set: {
          recruiter_mail: updatedApply.recruiter_mail,
          name: updatedApply.name,
          title: updatedApply.title,
          category: updatedApply.category,
          salary: updatedApply.salary,
          description: updatedApply.description,
          posting_date: updatedApply.posting_date,
          deadline: updatedApply.deadline,
          applicants: updatedApply.applicants
        }
      }
      const result = await jobCollection.updateOne(filter, apply, options);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('hehhe boiiiii')
})

app.listen(port, () => {
  console.log(`server running ${port}`)
})