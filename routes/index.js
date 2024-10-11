const express = require("express");
const router = express.Router();
const testRoutes = require("./test");
const orderRoutes = require("./order");

const routes = [
  { path: "/test", route: testRoutes },
  { path: "/recipes", route: orderRoutes },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
