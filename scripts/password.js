const bcrypt = require("bcryptjs");

async function hash(pw) {
  const hash = await bcrypt.hash(pw, 10);
  console.log(pw, "=>", hash);
}

hash("password123");
hash("secret456");
