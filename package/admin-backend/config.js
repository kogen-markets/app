module.exports = {
  // Secret key for JWT signing and encryption
  secret: "super secret passphrase",
  db_collection_prefix: "kogen_",
  allowed_origin: ["https://admin.kogen.markets"],

  expiresIn: 3600 * 72, // 3 days
  db_url: "mongodb+srv://tuskidreamer:smiles@cluster0.ki9bs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  db_options: {
    // useNewUrlParser: true, //from 6 or higher version of mongoose
    // useUnifiedTopology: true, // the same above
  },
  serviceUrl:
    process.env.REACT_APP_SERVICE_URL,
};
