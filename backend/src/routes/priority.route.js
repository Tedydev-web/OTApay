const router = require("express").Router();
const {
  VALIDATE_DATA,
  NOT_EMPTY,
  INVALID_IS_DELETED,
} = require("../constants/msg.constant");
const PriorityController = require("../controllers/priority.controller");
const { body, query, param } = require("express-validator");

module.exports = (app) => {
  router.get("/rows", PriorityController.getAllType);
  router.post(
    "/",
    [
      body("name", NOT_EMPTY)
        .notEmpty()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("level", "Trường level phải là int")
        .optional()
        .isNumeric()
        .withMessage(INVALID_IS_DELETED),
    ],
    PriorityController.post
  );
  router.patch(
    "/update/:id",
    [
      param("id", NOT_EMPTY)
        .notEmpty()
        .isNumeric()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("name", NOT_EMPTY)
        .optional()
        .isString()
        .notEmpty()
        .withMessage(VALIDATE_DATA),
      body("level", "Trường is_deleted phải là 0 hoặc 1.")
        .optional()
        .isNumeric()
        .withMessage(INVALID_IS_DELETED),
    ],
    PriorityController.updateById
  );
  router.get(
    "/detail/:id",
    [
      param("id", NOT_EMPTY)
        .notEmpty()
        .isNumeric()
        .withMessage(VALIDATE_DATA)
        .escape(),
    ],
    PriorityController.getById
  );
  router.delete(
    "/delete/:id",
    [
      param("id", NOT_EMPTY)
        .notEmpty()
        .isNumeric()
        .withMessage(VALIDATE_DATA)
        .escape(),
    ],
    PriorityController.deleteById
  );
  app.use("/api/v1/priority", router);
};
