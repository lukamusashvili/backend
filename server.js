require("isomorphic-fetch");
const dotenv = require("dotenv");
dotenv.config();
const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("koa-router");
const users = require("./routes/users");
const files = require("./routes/files");

const server = new Koa();
const router = new Router();

router.get("/", async (ctx) => {
    ctx.body = "Welcome to Backend";
});

server
    .use(cors())
    .use(router.allowedMethods())
    .use(router.routes())
    .use(users.routes())
    .use(users.allowedMethods())
    .use(files.routes())
    .use(files.allowedMethods())
    .listen(3000, () => {
        console.log(`> Ready on http://localhost:${3000}`);
    });
