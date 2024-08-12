const express = require("express");
const cors = require("cors");

const { connectDb } = require("../database/config.db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      employees: "/api/employees",
      auth: "/api/auth",
      requests: "/api/requests",
    };

    this.connectDB();

    this.middlewares();

    this.routes();
  }

  async connectDB() {
    await connectDb();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(express.static("public"));

  }

  routes() {
    this.app.use(this.paths.employees, require("../routes/employees.routes"));
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.requests, require("../routes/requests.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port", this.port);
    });
  }
}

module.exports = Server;
