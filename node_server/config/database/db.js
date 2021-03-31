module.exports = {
    HOST: "localhost",
    USER: "noBrandAdmin",
    PASSWORD: "password",
    DB: "noBrandDB",
    dialect: "postgres",
    pool: {
      max: 3,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };