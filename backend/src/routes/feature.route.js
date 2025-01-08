const router = require("express").Router();
const {
  VALIDATE_DATA,
  NOT_EMPTY,
  INVALID_IS_DELETED,
} = require("../constants/msg.constant");
const { body, query, param } = require("express-validator");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const moduleName = require("../constants/moduleName.constant");
const featureController = require("../controllers/feature.controller");
module.exports = (app) => {
  router.get(
    "/get-features",
    [
      // query("offset", NOT_EMPTY).optional().isNumeric().escape(),
      // query("limit", NOT_EMPTY).optional().isNumeric().escape(),
      // query("keyword", NOT_EMPTY).optional().isString().escape(),
      // query("status")
      //   .optional()
      //   .isIn([0, 1])
      //   .withMessage("Status must be 0 or 1")
      //   .toInt()
      //   .escape(),
    ],
    authentication,
    authorization(moduleName.featureGet),
    featureController.getFeature
  );
  router.post(
    "/",
    [
      body("name", NOT_EMPTY)
        .notEmpty()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("description", VALIDATE_DATA)
        .optional()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("platform", NOT_EMPTY)
        .notEmpty()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
    ],
    authentication,
    authorization(moduleName.featureCreate),
    featureController.createFeature
  );
  router.patch(
    "/update/:id",
    [
      body("name", VALIDATE_DATA)
        .optional()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("description", VALIDATE_DATA)
        .optional()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
      body("platform", NOT_EMPTY)
        .optional()
        .isString()
        .withMessage(VALIDATE_DATA)
        .escape(),
    ],
    authentication,
    authorization(moduleName.featureUpdate),
    featureController.featureUpdate
  );
  router.put(
    "/update-status-feature/:id",
    [],
    authentication,
    authorization(moduleName.featureUpdateStatus),
    featureController.featureUpdateStatus
  );
  router.get(
    "/feature-detail/:id",
    [],
    authentication,
    authorization(moduleName.featureGet),
    featureController.featureGetDetail
  );
  router.delete(
    "/delete/:id",
    [],
    authentication,
    authorization(moduleName.featureDelete),
    featureController.featureDelete
  );
  router.post(
    "/create-feature-permission",
    [
      body("feature_ids")
        .notEmpty()
        .isArray({ min: 1 })
        .withMessage(NOT_EMPTY)
        .bail()
        .custom((value) => value.every(Number.isInteger))
        .withMessage("feature_ids must be int"),
      body("permission_ids")
        .notEmpty()
        .isArray({ min: 1 })
        .withMessage(NOT_EMPTY)
        .bail()
        .custom((value) => value.every(Number.isInteger))
        .withMessage("permission_ids must be int"),
    ],
    authentication,
    authorization(moduleName.featurePermissionCreate),
    featureController.featurePermissionCreate
  );
  router.get(
    "/get-permission-by-feature/:id",
    [],
    authentication,
    authorization(moduleName.featurePerrmissionGetByFeatureId),
    featureController.featurePerrmissionGetByFeatureId
  );
  router.get(
    "/get-feature-by-permission/:id",
    [],
    authentication,
    authorization(moduleName.featurePerrmissionGetByPermissionId),
    featureController.featurePerrmissionGetByPermissionId
  );
  router.delete(
    "/delete-feature-permission",
    [
      body("ids")
        .notEmpty()
        .isArray({ min: 1 })
        .withMessage(NOT_EMPTY)
        .bail()
        .custom((value) => value.every(Number.isInteger))
        .withMessage("ids must be int"),
    ],
    authentication,
    authorization(moduleName.featurePermissionDelete),
    featureController.featurePermissionDelete
  );

  //----------------------------------------
  router.post(
    "/create-feature-role",
    [
      body("feature_ids")
        .notEmpty()
        .isArray({ min: 1 })
        .withMessage(NOT_EMPTY)
        .bail()
        .custom((value) => value.every(Number.isInteger))
        .withMessage("feature_ids must be int"),
      body("role_ids")
        .notEmpty()
        .isArray({ min: 1 })
        .withMessage(NOT_EMPTY)
        .bail()
        .custom((value) => value.every(Number.isInteger))
        .withMessage("role_ids must be int"),
    ],
    authentication,
    authorization(moduleName.featureRoleCreate),
    featureController.featureRoleCreate
  );
  router.get(
    "/get-role-by-feature/:id",
    [],
    authentication,
    authorization(moduleName.featureRoleGetByFeatureId),
    featureController.featureRoleGetByFeatureId
  );
  router.get(
    "/get-feature-by-role/:id",
    [],
    authentication,
    authorization(moduleName.featurePerrmissionGetByRoleId),
    featureController.featurePerrmissionGetByRoleId
  );
  router.delete(
    "/delete-feature-role",
    [
      body("ids")
        .notEmpty()
        .isArray({ min: 1 })
        .withMessage(NOT_EMPTY)
        .bail()
        .custom((value) => value.every(Number.isInteger))
        .withMessage("ids must be int"),
    ],
    authentication,
    authorization(moduleName.featureRoleDelete),
    featureController.featureRoleDelete
  );
  app.use("/api/v1/feature", router);
};
