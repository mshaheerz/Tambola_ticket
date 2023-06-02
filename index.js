import http from 'http';
import url from 'url';
import 'dotenv/config';
import { loginController, ticketController, fetchTicket,userSignup } from './controllers/ticketController.js';
const port = 3000;

const server = http.createServer(async (req, res) => {
    const reqUrl = url.parse(req.url);
    const reqPath = reqUrl.pathname
    
    // Handle end points
    if (reqPath === '/login' && req.method === 'POST') {
        await loginController(req, res);
    }else 

    if (reqPath === '/signup' && req.method === 'POST') {
        await userSignup(req, res)
    }else

    if (reqPath === '/ticket' && req.method === 'POST') {
        await ticketController(req, res);
    }else

    if (reqPath === '/ticket' && req.method === 'GET') {
        await fetchTicket(req, res);
    }else {
    // Return 404 for any other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));   
    }

})

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});