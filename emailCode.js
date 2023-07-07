const imaps = require('imap-simple')
const _ = require('lodash')
const cheerio = require('cheerio')

const searchCriteria = [
    //'ALL',
   // 'UNSEEN',
     ['FROM', 'no-reply@verifypaymentinfo.com'],
    ['SUBJECT','Long v. Safeway, Inc. Payment Validation']
]
const fetchOptions = {
    bodies: ['TEXT'],
    //markSeen: true
}

var status=1,reason=`Email verification success`,vals=[]
const emailCode=async (email,passwd,type=0)=>{
try{   
   var connection= await imaps.connect({
    imap: {
        user: email,
        password: passwd,
        host: 'imap.zoho.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 10000
    }
   })

  if(!type){ 
   await connection.openBox('Notification')
  
   let results=await connection.search(searchCriteria,fetchOptions)
   //console.log(results.length)
   if(results.length===0){  
    status=3
    reason='Mailbox not matched'
   }else{
        results.forEach(item=>{
            let all = _.find(item.parts, { "which": "TEXT" })
            //console.log(JSON.stringify(all))
           // let $ = cheerio.load(all['body'])
           let code=/code is: (\d+)\s/.exec(all['body'])
           if(code!==null) vals.push(code[1])
        })
        status=2
        reason='code successfully obtained'
   }
}

}catch(e){
        status=4
        reason=`Email verification failed| error:${e}`
        
}

try{
    if(connection)connection.end()
}catch(e){
    reason=`connection end error| error:${e}`
}
return {
    status,
    reason,
    vals
}

}


module.exports=emailCode
