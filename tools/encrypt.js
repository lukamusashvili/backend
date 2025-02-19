const bcrypt = require("bcrypt");

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

async function validatePassword(password, hashedPassword) {
    console.log(password, hashedPassword);
    if (!password || !hashedPassword) {
        return false;
    }
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
