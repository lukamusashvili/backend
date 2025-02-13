const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function validatePassword(password, hashedPassword) {
  if (await bcrypt.compare(password, hashedPassword)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  hashPassword,
  validatePassword,
};
