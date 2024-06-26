const express = require("express");
const cors = require("cors");
const UserRoutes = require("./routes/user.routes");
const ApartmentRoutes = require("./routes/apartments.routes");
require("dotenv").config();
const app = express();

app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.static("public"));

app.use("/users", UserRoutes);
app.use("/apartments", ApartmentRoutes);

app.listen(5000);
