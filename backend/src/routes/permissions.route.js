const router = require("express").Router();
const {
  VALIDATE_DATA,
  NOT_EMPTY,
  INVALID_IS_DELETED,
} = require("../constants/msg.constant");
const { body, query, param } = require("express-validator");
const perrmissionsController = require("../controllers/permissions.controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const moduleName = require("../constants/moduleName.constant");

module.exports = (app) => {
  router.get(
    "/get-roles",
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
    authorization(moduleName.rolesGet),
    perrmissionsController.getRoles
  );
  router.get(
    "/get-permissions",
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
    authorization(moduleName.getPermissions),
    perrmissionsController.getPermissions
  );
  router.get(
    "/get-permissions-roles",
    [
      // query("offset", NOT_EMPTY).optional().isNumeric().escape(),
      // query("limit", NOT_EMPTY).optional().isNumeric().escape(),
      // query("keyword", NOT_EMPTY).optional().isString().escape(),
      // query("platform", NOT_EMPTY).optional().isString().escape(),
      // query("roleId", NOT_EMPTY).optional().isNumeric().escape(),
      // query("permissionId", NOT_EMPTY).optional().isNumeric().escape(),
      // query("status")
      //   .optional()
      //   .isIn([0, 1])
      //   .withMessage("Status must be 0 or 1")
      //   .toInt()
      //   .escape(),
    ],
    authentication,
    authorization(moduleName.getPermissions),
    perrmissionsController.getPermissionsRoles
  );
  router.get(
    "/get-detail-role/:id",
    [],
    authentication,
    authorization(moduleName.rolesGet),
    perrmissionsController.getRoleDetail
  );
  router.get(
    "/get-detail-permission/:id",
    [],
    authentication,
    authorization(moduleName.getPermissions),
    perrmissionsController.getPermissionDetail
  );
  router.put(
    "/update-role-status/:id",
    [],
    authentication,
    authorization(moduleName.roleUpdateStatus),
    perrmissionsController.updateRoleStatus
  );
  router.put(
    "/update-permission-status/:id",
    [],
    authentication,
    authorization(moduleName.permissionUpdateStatus),
    perrmissionsController.updatePermissionStatus
  );
  router.put(
    "/update-role-permission",
    [
      body("roleIDs")
        .notEmpty()
        .isArray({ min: 1 })
        .withMessage(NOT_EMPTY)
        .bail()
        .custom((value) => value.every(Number.isInteger))
        .withMessage("roleIDs must be int"),
      body("permissionIDs")
        .notEmpty()
        .isArray({ min: 1 })
        .withMessage(NOT_EMPTY)
        .bail()
        .custom((value) => value.every(Number.isInteger))
        .withMessage("permissionIDs must be int"),
    ],
    authentication,
    authorization(moduleName.rolePermissionUpdate),
    perrmissionsController.rolePermissionUpdate
  );
  router.delete(
    "/delete-role-permission",
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
    authorization(moduleName.rolePermissionDelete),
    perrmissionsController.rolePermissionDelete
  );
  app.use("/api/v1/permission", router);
};
