const { isAdmin } = require("../tools/auth");

async function adminCheck(ctx, next) {
    const token = ctx.headers.token;
    const admin = await isAdmin(token);
    if (!admin) {
        ctx.status = 403;
        ctx.body = "You don't have permission";
        return;
    }
    await next();
}

module.exports = adminCheck;
