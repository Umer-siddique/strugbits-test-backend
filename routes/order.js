const router = require("express").Router();
const orderController = require("../controllers/order");

router.patch("/update-week", orderController.updateSelectedWeek);
router.get("/", orderController.getAll);
router.delete("/:id", orderController.deleteSelectedWeek);

module.exports = router;
