const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("MONGO_URI: ", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Options to avoid deprecation warnings (check mongoose docs for latest)
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;