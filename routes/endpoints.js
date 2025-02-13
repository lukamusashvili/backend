const Router = require("koa-router");
const router = new Router();
const { koaBody } = require("koa-body");
const {
  getAllUsers,
  getUser,
  insertUser,
  updateUser,
  deleteUser,
} = require("../db.js");
const { isAdmin } = require("../tools/auth.js");
const { validatePassword } = require("../tools/encrypt.js");
const {
  validateRegistration,
  validateToken,
} = require("../tools/validations.js");
const adminCheck = require("../middleware/adminCheck");

router
  .post("/registration", koaBody(), async (ctx) => {
    const data = ctx.request.body;
    const validationError = await validateRegistration(data);
    if (validationError) {
      ctx.status = 400;
      ctx.body = validationError;
      return;
    }
    const user = await getUser(data.email);
    if (user) {
      ctx.status = 401;
      ctx.body = "There is already an account registered using this email";
      return;
    }
    const token = await insertUser(data);
    ctx.status = 201;
    ctx.body = token;
  })
  .post("/login", koaBody(), async (ctx) => {
    const data = ctx.request.body;
    const user = await getUser(data.email);
    if (!user) {
      ctx.status = 401;
      ctx.body = "There is no account registered using this email";
      return;
    }
    const validPassword = await validatePassword(data.password, user.password);
    if (!validPassword) {
      ctx.status = 401;
      ctx.body = "Wrong password";
      return;
    }
    ctx.body = user.token;
  })
  .get("/users", adminCheck, async (ctx) => {
    const result = await getAllUsers();
    ctx.status = 200;
    ctx.body = result;
  })
  .get("/user", async (ctx) => {
    const token = ctx.request.headers.token;
    const emailFromToken = await validateToken(token);
    if (!emailFromToken) {
      ctx.status = 403;
      ctx.body = "Invalid token";
      return;
    }
    const result = await getUser(emailFromToken);
    ctx.status = 200;
    ctx.body = result;
  })
  .put("/user", koaBody(), adminCheck, async (ctx) => {
    const data = ctx.request.body;
    if (!data.email) {
      ctx.status = 422;
      ctx.body = "email has to be provided";
      return;
    }
    const result = await updateUser(data);
    ctx.body = result;
  })
  .del("/user/:email", koaBody(), adminCheck, async (ctx) => {
    const email = ctx.request.params.email;
    const result = await deleteUser(email);
    if (result.deletedCount === 0) {
      ctx.status = 404;
      ctx.body = "User not found";
      return;
    }
    ctx.body = result;
  });

module.exports = router;
