const jwt = require("jsonwebtoken");

async function validateRegistration(data) {
  if (!data.email) {
    return "Email is required";
  }
  if (!validateEmail(data.email)) {
    return "Email is invalid";
  }
  if (!data.password) {
    return "Password is required";
  }
  if (!data.full_name) {
    return "full name is required";
  }
  return false;
}

async function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    return true;
  }
  return false;
}

async function validateToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;
    if (userEmail) {
      return userEmail;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  validateRegistration,
  validateToken,
};
