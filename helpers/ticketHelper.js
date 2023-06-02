export function generateTicketId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const ticketId = `${timestamp}${random}`;
    return ticketId;
}

function generateTicket() {
    let cols
    let finalTicket
    let flag = true
    let colPlaceholder = [];

   while(flag) {
        cols = Array(9).fill(2);
        finalTicket = Array(3);
        finalTicket[0] = Array(9).fill(0);
        finalTicket[1] = Array(9).fill(0);
        finalTicket[2] = Array(9).fill(0);

        let r = getUniqueRandomNumber(0, 8, 3);
   
        for (let i = 0; i < r.length; i++) {
            cols[r[i]] = 1;
        }

        colPlaceholder = [];

        for (let i = 0; i < cols.length; i++) {
            colPlaceholder.push(getUniqueRandomNumber(0, 2, cols[i]));
        }

        for (let i = 0; i < colPlaceholder.length; i++) {
            let nums = getUniqueRandomNumber(((i * 10) + 1), (i * 10) + 10, colPlaceholder[i].length)
            for (let j = 0; j < colPlaceholder[i].length; j++) {
                finalTicket[colPlaceholder[i][j]][i] = nums[j];
            }
        }

        flag = testFinalTicket(finalTicket);
    }

    return finalTicket;
}



function testFinalTicket(ticket){

    for (let i=0;i<3;i++)
    {
        let arr = ticket[i];
        let count = 0;
        for (let j=0;j<arr.length;j++)
        {
            if (arr[j] === 0)
            count++;
        }
        if (count != 4)
        return true;
    }
    return false;
}


function sortNumbersinArray (a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
}


//true
function getUniqueRandomNumber (min, max, count,sort = true) {
    let random = [];
    for (let i = 0; i < count; i++) {
        let flag = true;
        while (flag) {
            let r = randomNumber(min, max)
            if (random.indexOf(r) === -1) {
                random.push(r);
                flag = false;
            }
        }
    }
    if (sort)
    random.sort(sortNumbersinArray)
    return random;
}


function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export function genarateTicket(count=1){
    console.log(count)
    let newTicket = []
    for(let i=0; i<count; i++){
        const ticket = generateTicket()
        newTicket.push(ticket)
    }
    
    return newTicket
}

