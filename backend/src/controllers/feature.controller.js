const { GET, CREATED, UPDATE, DELETE } = require("../core/success.response");
const catchAsync = require("../helper/catchAsync.helper");
const featureService = require("../services/feature.service");
class FeatureController {
  getFeature = catchAsync(async (req, res, next) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    const keyword = req.query.keyword || "";
    const platform = req.query.platform || "web";
    const status = req.query.status || 1;
    const result = await featureService.getFeature(
      offset,
      limit,
      keyword,
      platform,
      status
    );
    GET(res, result.data, result.totalPages, result.totalRecord);
  });
  createFeature = catchAsync(async (req, res, next) => {
    const { name, description, platform } = req.body;
    const result = await featureService.createFeature(
      name,
      description,
      platform
    );
    CREATED(res, result);
  });
  featureUpdate = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const { name, description, platform } = req.body;
    const result = await featureService.featureUpdate(
      id,
      name,
      description,
      platform
    );
    UPDATE(res, result);
  });
  featureUpdateStatus = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await featureService.featureUpdateStatus(id);
    UPDATE(res, result);
  });
  featureGetDetail = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await featureService.featureGetDetail(id);
    GET(res, result);
  });
  featureDelete = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await featureService.featureDelete(id);
    DELETE(res, result);
  });
  featurePermissionCreate = catchAsync(async (req, res, next) => {
    const { feature_ids, permission_ids } = req.body;
    const result = await featureService.featurePermissionCreate(
      feature_ids,
      permission_ids
    );
    CREATED(res, result);
  });
  featurePerrmissionGetByFeatureId = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await featureService.featurePerrmissionGetByFeatureId(id);
    GET(res, result);
  });
  featurePerrmissionGetByPermissionId = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await featureService.featurePerrmissionGetByPermissionId(id);
    GET(res, result);
  });
  featurePermissionDelete = catchAsync(async (req, res, next) => {
    const ids = req.body.ids;
    const result = await featureService.featurePermissionDelete(ids);
    DELETE(res, result);
  });
  featurePermissionRoleCreate = catchAsync(async (req, res, next) => {
    const { feature_permission_ids, role_ids } = req.body;
    const result = await featureService.featurePermissionRoleCreate(
      feature_permission_ids,
      role_ids
    );
    CREATED(res, result);
  });
  featurePermissionRoleGetByFeaturePermissionId = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await featureService.featurePermissionRoleGetByFeaturePermissionId(id);
    GET(res, result);
  });
  featurePerrmissionGetByRoleId = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await featureService.featurePerrmissionGetByRoleId(id);
    GET(res, result);
  });
  featureRoleDelete = catchAsync(async (req, res, next) => {
    const ids = req.body.ids;
    const result = await featureService.featureRoleDelete(ids);
    DELETE(res, result);
  });
}
module.exports = new FeatureController();
