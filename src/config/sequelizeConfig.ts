export default {
  database: "pmt-db",
  username: "piotr",
  password: "lubieplacki",
  params: {
    host: process.env.DB_HOST || "localhost",
    post: "5432",
    dialect: "postgres",
    logging: false,
  },
}
