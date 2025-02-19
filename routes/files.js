const Router = require("koa-router");
const router = new Router();
const { koaBody } = require("koa-body");
const {
    getAllFiles,
    getFile,
    insertFile,
    updateFile,
    deleteFile,
} = require("../db.js");
const adminCheck = require("../middleware/adminCheck");

router
    .post("/file", koaBody(), adminCheck, async (ctx) => {
        const data = ctx.request.body;
        const file = await getFile(data.title);
        if (file) {
            ctx.status = 401;
            ctx.body = "There is already a file with this title";
            return;
        }
        const result = await insertFile(data);
        ctx.status = 201;
        ctx.body = result;
    })
    .get("/files", adminCheck, async (ctx) => {
        const result = await getAllFiles();
        ctx.status = 200;
        ctx.body = result;
    })
    .put("/file", koaBody(), adminCheck, async (ctx) => {
        const data = ctx.request.body;
        if (!data.url) {
            ctx.status = 422;
            ctx.body = "file title has to be provided";
            return;
        }
        const result = await updateFile(data);
        ctx.status = 204;
        ctx.body = result;
    })
    .del("/file/:title", koaBody(), adminCheck, async (ctx) => {
        const title = ctx.request.params.title;
        const result = await deleteFile(title);
        if (result.deletedCount === 0) {
            ctx.status = 404;
            ctx.body = "File not found";
            return;
        }
        ctx.body = result;
    });

module.exports = router;
