const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/urbanhive");
  console.log("Conectado ao banco de dados");
}

main().catch((err) => {
  console.log(err);
});

module.exports = mongoose;
