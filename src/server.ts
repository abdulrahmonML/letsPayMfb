require("dotenv").config();
const app = require("./app");
const CONNECTDB = require("./config/db");
const { onboard } = require("./services/nibssService");

const PORT = process.env.PORT || 3000;

CONNECTDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
