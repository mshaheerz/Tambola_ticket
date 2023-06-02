# Tambola_ticket
<h1> Tambola ticket genaration Api </h1>


# Usage

#  routes

POST /login 
body:{username:'johndoe' , password}
response:{message:'login success',token}

POST /signup
body:{username:'johndoe' , password}
response:{message:'signup success', token}

POST /ticket
header:{'usertoken':token}
body:{numberOfTickets:2}   //integer
response:{ticketId:543253425}

GET /ticket 
header:{'usertoken':token}
query:{page:1,limit:3}        //  /ticket?page=1&limit=3
response:[
    {
        "ticketId": "1685711859495210",
        "ticketData":[
[
[0,18,23,40,48,0,0,73,0],
[5,0,0,0,42,52,0,80,83],
[0,20,0,0,49,58,65,0,85]
],
[
[10,0,21,34,0,0,65,0,83],
[0,11,0,36,41,0,62,0,85],
[0,19,26,37,43,0,67,0,0]
]
]
    }
]
