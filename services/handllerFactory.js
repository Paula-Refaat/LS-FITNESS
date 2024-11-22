const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });
exports.getAll = (Model, modelName = "", populationOt) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

    // Initialize query
    let query = Model.find(filter);
    if (populationOt) {
      query = query.populate(populationOt);
    }

    // Apply API Features
    let apiFeatures = new ApiFeatures(query, req.query)
      .filter()
      .search(modelName)
      .limitFields();

    // Count documents after applying filters
    const filteredQuery = apiFeatures.mongooseeQuery;
    const filteredDocumentsCount = await filteredQuery.clone().countDocuments();

    // Check role status to apply pagination
    if (req.role === "admin") {
      apiFeatures = apiFeatures.paginate(filteredDocumentsCount);
    }

    // Apply sort and execute query
    apiFeatures.sort();
    const { mongooseeQuery, paginationResult } = apiFeatures;
    const documents = await mongooseeQuery;

    // Respond with the results
    res.status(200).json({
      results: documents.length,
      // totalCount: filteredDocumentsCount,
      paginationResult:
        req.role === "admin" ? paginationResult : undefined, // Include pagination only for admin
      data: documents,
    });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //1-build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    //2- excute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document For this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document For this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    // Trigger "remove" event when delete document
    // document.remove();
    res.status(204).send();
  });
