const router = require("express").Router();
const testController = require("../controllers/test");
router.post("/", testController.create);
router.get("/", testController.getAll);
router.get("/:id", testController.getOne);
router.patch("/:id", testController.update);
router.delete("/:id", testController.delete);

module.exports = router;
