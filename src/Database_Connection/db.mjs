import pg from 'pg'
const { Client } = pg
 
const con = new Client({
  user: 'postgres',
  password: 'tiger',
  host: 'localhost',
  port: 5432,
  database: 'Cardb',
})

const dbClient = null; 

function getDBClient() {
    if (dbClient) {
        return dbClient;
    } 
    dbClient = new Client({
        user: 'postgres',
        password: 'tiger',
        host: 'localhost',
        port: 5432,
        database: 'Cardb',
      });
      await dbClient.connect();
    return dbClient;
}

con.connect().then(()=> console.log("Connected Successfully.."))

con.query('Select * from car',(err,res)=>{
    if(!err)
    {
        console.log(res.rows)
    }
    else{
        console.log(err.message)
    }
    con.end()
})