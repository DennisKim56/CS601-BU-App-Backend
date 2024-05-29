const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const courseRoutes = require("./routes/courses");
const gradebookRouters = require("./routes/gradebooks");
const planRoutes = require("./routes/plans");
const programRoutes = require("./routes/programs");
const userRoutes = require("./routes/users");

const app = express();

app.use(bodyParser.json());

app.use("/api/courses", courseRoutes);
app.use("/api/gradebooks", gradebookRouters);
app.use("/api/plans", planRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(
    "mongodb+srv://buAdmin:fZOYFoYU7h0Nt3Kr@bu-planning-app.n09tuz2.mongodb.net/app_data"
  )
  .then(() => {
    app.listen(5000);
    console.log("Connected");
  })
  .catch(() => {
    console.log("Connection failed");
  });
