const permissionsService = require("../services/permissions.service");
const { GET, CREATED, UPDATE, DELETE } = require("../core/success.response");
const catchAsync = require("../helper/catchAsync.helper");

class PermissionsController {
  getRoles = catchAsync(async (req, res, next) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const keyword = req.query.keyword || "";
    const status = req.query.status || 1;
    const result = await permissionsService.getRoles(
      offset,
      limit,
      keyword,
      status
    );
    GET(res, result.data, result.totalPages, result.totalRecord);
  });
  getPermissions = catchAsync(async (req, res, next) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const keyword = req.query.keyword || "";
    const platform = req.query.platform || "web";
    const status = req.query.status || 1;
    const result = await permissionsService.getPermissions(
      offset,
      limit,
      keyword,
      platform,
      status
    );
    GET(res, result.data, result.totalPages, result.totalRecord);
  });
  getPermissionsRoles = catchAsync(async (req, res, next) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const keyword = req.query.keyword || "";
    const platform = req.query.platform || "web";
    const status = req.query.status || 1;
    const roleId = req.query.roleId;
    const permissionId = req.query.permissionId;
    const result = await permissionsService.getPermissionsRoles(
      offset,
      limit,
      keyword,
      platform,
      status,
      roleId,
      permissionId
    );
    GET(res, result.data, result.totalPages, result.totalRecord);
  });
  getRoleDetail = catchAsync(async (req, res, next) => {
    const roleId = req.params.id;
    const result = await permissionsService.getRoleDetail(roleId);
    GET(res, result);
  });
  getPermissionDetail = catchAsync(async (req, res, next) => {
    const permissionId = req.params.id;
    const result = await permissionsService.getPermissionDetail(permissionId);
    GET(res, result);
  });
  updateRoleStatus = catchAsync(async (req, res, next) => {
    const roleId = req.params.id;
    const result = await permissionsService.updateRoleStatus(roleId);
    UPDATE(res, result);
  });
  updatePermissionStatus = catchAsync(async (req, res, next) => {
    const permissionId = req.params.id;
    const result = await permissionsService.updatePermissionStatus(
      permissionId
    );
    UPDATE(res, result);
  });
  rolePermissionUpdate = catchAsync(async (req, res, next) => {
    const { roleIDs, permissionIDs } = req.body;
    const result = await permissionsService.rolePermissionUpdate(
      roleIDs,
      permissionIDs
    );
    UPDATE(res, result);
  });
  rolePermissionDelete = catchAsync(async (req, res, next) => {
    const { ids } = req.body;
    const result = await permissionsService.rolePermissionDelete(ids);
    DELETE(res, result);
  });
}

module.exports = new PermissionsController();
