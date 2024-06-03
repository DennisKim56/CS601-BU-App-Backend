const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const courseRoutes = require("./routes/courses");
const gradebookRoutes = require("./routes/gradebooks");
const planRoutes = require("./routes/plans");
const programDefRoutes = require("./routes/programDefinitions");
const programRoutes = require("./routes/programs");
const userRoutes = require("./routes/users");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/courses", courseRoutes);
app.use("/api/gradebooks", gradebookRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/programdefinitions", programDefRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(
    "mongodb+srv://buAdmin:@bu-planning-app.n09tuz2.mongodb.net/app_data"
  )
  .then(() => {
    app.listen(5000);
    console.log("Connected");
  })
  .catch(() => {
    console.log("Connection failed");
  });
