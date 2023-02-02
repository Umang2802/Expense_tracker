const mongoose = require("mongoose");

const connection = async () => {
  try {
    mongoose.set("strictQuery", false);
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "expensetracker",
    });

    console.log(`Database connected : ${con.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connection;
