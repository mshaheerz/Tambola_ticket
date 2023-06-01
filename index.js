import http from 'http';
import url from 'url';
import queryString from 'querystring';
import { MongoClient } from 'mongodb'


//env
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'tambola';
const port = 3000;




//db

const client = new MongoClient(dbUrl,  {});
async function run() {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("users").command({ ping: 1 });
      const db = await client.db("tambola")
      const tickets = await db.collection('tickets').find({}).toArray()
      console.log(tickets)
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }


  run().catch(console.dir);















const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url);
    const reqPath = reqUrl.pathname
    // Handle login request
    if (reqPath === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
            console.log(body)
        });

        req.on('end', async (dd) => {
            const { username, password } = queryString.parse(body);

            // Validate the credentials against the database
            try {
                await client.connect();
                const db = client.db(dbName);
                const collection = db.collection('users');
                const user = await collection.findOne({ username, password})
                console.log(user)
                if (!user) {
                    return res.end(JSON.stringify({ error: 'Invalid username or password' }));
                }

                return res.end(JSON.stringify({ message: 'Login successful' }));
            } catch (error) {
                console.log(error.message)
                return res.end(JSON.stringify({ error: 'Internal server error' }));
                
            } finally {
                await client.close();
            }
          
                
                // const collection = db.collection('users');
                // collection.findOne({ username, password }, (err, user) => {
                //     if (err) {
                //         console.error('Error occurred while querying the database:', err);
                //         return res.end(JSON.stringify({ error: 'Internal server error' }));
                //     }
                //     console.log('hereeee222222')
                //     if (!user) {
                //         return res.end(JSON.stringify({ error: 'Invalid username or password' }));
                //     }

                //     // Successful login
                //     return res.end(JSON.stringify({ message: 'Login successful' }));
                // });
          
        });
    }

})






server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});