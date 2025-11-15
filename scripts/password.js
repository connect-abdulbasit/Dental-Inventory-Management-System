const bcrypt = require("bcryptjs");

async function hash(pw) {
  const hash = await bcrypt.hash(pw, 10);
  console.log(pw, "=>", hash);
}

// Generate hashes for test passwords
hash("password123");
hash("admin123");
hash("member123");
hash("supplier123");
