const dbName = 'tambola';
import { client } from './../config/dbConfig.js'
import queryString from 'querystring';
import url from 'url';
import { generateTicketId, genarateTicket } from '../helpers/ticketHelper.js';
import {userAuth} from '../helpers/userAuthMidleware.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const jwtSecret = process.env.JWTSECRET
export function loginController(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
        console.log(body)
    });

    req.on('end', async () => {
        const { username, password } = JSON.parse(body);
        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection('users');
            const user = await collection.findOne({ username })
            console.log(user)
            if (!user) {
                return res.end(JSON.stringify({ error: 'User not exist' }));
            }

            const isAuth = bcrypt.compareSync(password, user.password)
            if(!isAuth) return res.end(JSON.stringify({ message: 'Invalid userName or password' }));
          
            const token  = jwt.sign({userId:user._id},jwtSecret,{expiresIn:'1d'})
            return res.end(JSON.stringify({ message: 'Login successful' , token}));
        } catch (error) {
            console.log(error.message)
            return res.end(JSON.stringify({ error: 'Internal server error' }));

        } finally {
            await client.close();
        }

    });
}

export function ticketController(req, res) {
  const isAuth = userAuth(req, res)
  if(!isAuth) return res.end(JSON.stringify({ error: 'invalid token or user not authenticated' }));
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const { numberOfTickets } = JSON.parse(body);
      // console.log(queryString.parse(body))

      try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('tickets');
        const ticketId = generateTicketId();
        const generatedTickets = genarateTicket(parseInt(numberOfTickets))
        const ticket = {
          userId:isAuth.userId,
          ticketId: ticketId,
          ticketData: generatedTickets,

        };

        const dat = await collection.insertOne(ticket)
        const savedTicket = await collection.findOne({_id: dat.insertedId})
        return res.end(JSON.stringify({ ticketId: savedTicket.ticketId }));
      } catch (error) {
        console.log(error.message)
        return res.end(JSON.stringify({ error: 'Internal server error' }));
      } finally {
        await client.close();
      }
  
  
    });
}

export async function fetchTicket(req, res){
    const isAuth = userAuth(req, res)
    if(!isAuth) return res.end(JSON.stringify({ error: 'invalid token or user not authenticated' }));
    const reqUrl = url.parse(req.url);
    const { ticketId, page, limit } = queryString.parse(reqUrl.query);
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 1,
    };
    console.log(options);


      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection('tickets');

      try {
      const tickets = await collection.aggregate([
        {
          $match: { userId: isAuth.userId }  
        },
        {
          $project: { _id: 0, userId: 0}  
        },
        {
          $skip: options.page-1 
        },
        {
          $limit: options.limit
        }
      ]).toArray()
      console.log(tickets)
      return res.end(JSON.stringify(tickets));
      } catch (error) {
        console.log(error.message)
        return res.end(JSON.stringify({ error: 'Internal server error' }));
      } finally {
        await client.close();
      }

      
   
}

export async function userSignup(req, res) {
  let body = '';
  req.on('data', (chunk) => {
      body += chunk.toString();
  });

  req.on('end', async () => {
    const { username, password } = JSON.parse(body);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('users');
        const user = await collection.findOne({ username })
        if (user) {
            return res.end(JSON.stringify({ error: 'username already exists' }));
        }
        const salt = bcrypt.genSaltSync(10)
        const hashedPass = bcrypt.hashSync(password,salt)
        await collection.insertOne({username,password:hashedPass}).then((result)=>{
            console.log(result.insertedId)
            const token  =  jwt.sign({userId:result.insertedId},jwtSecret,{expiresIn:'1d'})
            return res.end(JSON.stringify({ message: 'signup successful',token }));
        }) 
    } catch (error) {
        console.log(error.message)
        return res.end(JSON.stringify({ error: 'Internal server error' }));

    } finally {
        await client.close();
    }

});

}


