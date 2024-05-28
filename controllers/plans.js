const MongoClient = require("mongodb").MongoClient;

const url =
  "mongodb+srv://buAdmin:fZOYFoYU7h0Nt3Kr@bu-planning-app.n09tuz2.mongodb.net/app_data";

const createPlan = async (req, res, next) => {
  const newPlan = {
    username: req.body.username,
    program: req.body.program,
    startTerm: req.body.startTerm,
    courseList: req.body.courseList,
  };

  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection("plans").insertOne(newPlan);
  } catch (error) {
    return res.json({ message: "Could not create new plan" });
  } finally {
    await client.close();
  }

  res.json(newPlan);
};

const getPlan = async (req, res, next) => {
  const client = new MongoClient(url);
  let plan;
  try {
    await client.connect();
    const db = client.db();
    plan = await db.collection("plans").find().toArray();
  } catch (error) {
    return res.json({ message: "Could not retrieve plan" });
  } finally {
    await client.close();
  }

  res.json(plan);
};

exports.createPlan = createPlan;
exports.getPlan = getPlan;
