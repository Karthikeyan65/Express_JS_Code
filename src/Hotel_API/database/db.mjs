import pg from 'pg';

const { Client } = pg;

const client = new Client({
  user: "postgres",
  password: "tiger",
  host: "localhost",
  port: 5432,
  database: "hotel",
});

client.connect()
  .then(() => console.log("Database connected successfully"))
  .catch(err => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });

export default client;
