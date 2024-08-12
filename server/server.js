const express = require("express");
const cors = require("cors");

const { connectDb } = require("../database/config.db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
/*       employees: "/api/employees",
      users: "/api/users",
      requests: "/api/requests",
      auth: "/api/auth", */
    };

    // Conectar a base de datos
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async connectDB() {
    await connectDb();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static("public"));

  }

  routes() {
/*     this.app.use(this.paths.employees, require("../routes/employees.routes"));
    this.app.use(this.paths.requests, require("../routes/requests.routes"));
    this.app.use(this.paths.users, require("../routes/users.routes"));
    this.app.use(this.paths.auth, require("../routes/auth.routes")); */
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port", this.port);
    });
  }
}

module.exports = Server;
