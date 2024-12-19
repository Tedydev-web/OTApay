const { GET, CREATED, UPDATE, DELETE } = require("../core/success.response");
const catchAsync = require("../helper/catchAsync.helper");
const PriorityService = require("../services/priority.service");

class PriorityController {
  getAllType = catchAsync(async (req, res, next) => {
    const offset = req.body.offset || 0;
    const limit = req.body.limit || 10;
    const status = req.query.is_deleted || 0;
    const keyword = req.query.keyword || "";
    const result = await PriorityService.getAll(status, keyword, offset, limit);
    GET(res, result.data, result.totalPages, result.totalRecords);
  });
  post = catchAsync(async (req, res, next) => {
    const { name, des, level } = req.body;
    const result = await PriorityService.post(name, des, level);
    CREATED(res, result);
  });
  updateById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const { name, des, level } = req.body;
    const result = await PriorityService.updateById(id, name, des, level);
    UPDATE(res, result);
  });
  getById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const status = Number(req.query.is_deleted) || null;
    const result = await PriorityService.getById(id, status);
    GET(res, result);
  });
  deleteById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const result = await PriorityService.deleteById(id);
    DELETE(res, result);
  });
}

module.exports = new PriorityController();
