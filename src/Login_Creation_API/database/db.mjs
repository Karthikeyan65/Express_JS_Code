import pg from 'pg';

const { Pool } = pg;

const client = new Pool({
  user: "postgres",
  password: "tiger",
  host: "localhost",
  port: 5432,
  database: "logindb",
});

client.connect()
  .then(() => console.log("Database connected successfully"))
  .catch(err => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });

export default client;
