const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

// دية الشغاله 100%
exports.getAll = (Model, modelName = "", populationOpt) =>
  asyncHandler(async (req, res) => {
    // Initialize filter object
    let filter = req.filterObj || {};

    // Initialize query
    let query = Model.find(filter);

    // Apply population if specified
    if (populationOpt) {
      if (populationOpt === "courses") {
        query = query.populate({
          path: populationOpt,
          select: "-category -users ",
          options: { limit: 4, sort: { _id: -1 } },
        });
      } else {
        query = query.populate(populationOpt);
      }
    }

    // Initialize ApiFeatures with the query and request query parameters
    const apiFeatures = new ApiFeatures(query, req.query)
      .filter()
      .search(modelName)
      .limitFields()
      .sort(); // Ensure sorting is applied before pagination

    // Clone the filtered query to count documents
    const filteredDocumentsCount = await apiFeatures.mongooseeQuery
      .clone()
      .countDocuments();

    // Apply pagination (uses filteredDocumentsCount for page/limit logic)
    apiFeatures.paginate(filteredDocumentsCount);

    // Execute the final query with pagination
    const { mongooseeQuery, paginationResult } = apiFeatures;
    const documents = await mongooseeQuery;

    // Send response
    res.status(200).json({
      results: documents.length,
      totalCount: filteredDocumentsCount,
      paginationResult,
      data: documents,
    });
  });

// اللي بتست بيها
// exports.getAll = (Model, modelName = "", populationOptions) =>
//   asyncHandler(async (req, res) => {
//     try {
//       // إعداد الفلتر إذا كان موجودًا
//       let filter = {};
//       if (req.filterObj) {
//         filter = req.filterObj;
//       }

//       // إنشاء الاستعلام الأساسي
//       let query = Model.find(filter);

//       // إذا كان هناك population (ربط جداول)
//       if (populationOptions) {
//         query = query.populate(populationOptions);
//       }

//       // حساب العدد الإجمالي للوثائق
//       const totalDocuments = await Model.countDocuments(filter);

//       // **Pagination Logic**
//       const page = Math.max(Number(req.query.page) || 1, 1); // الصفحة الافتراضية 1
//       const limit = Math.min(Number(req.query.limit) || 6, totalDocuments); // الحد الافتراضي 6
//       const skip = (page - 1) * limit;

//       // **Ensure Consistent Sorting**: ترتيب ثابت حسب createdAt أو _id
//       const sortingField = "_id"; // أو "_id" إذا لم يكن createdAt موجودًا
//       query = query
//         .sort({ [sortingField]: 1 })
//         .skip(skip)
//         .limit(limit); // ترتيب تصاعدي

//       // تنفيذ الاستعلام
//       const documents = await query;

//       // إعداد بيانات الـ pagination
//       const paginationResult = {
//         currentPage: page,
//         limit,
//         numberOfPages: Math.ceil(totalDocuments / limit),
//       };

//       if (skip + limit < totalDocuments) {
//         paginationResult.nextPage = page + 1;
//       }
//       if (page > 1) {
//         paginationResult.previousPage = page - 1;
//       }

//       // إرسال الاستجابة
//       res.status(200).json({
//         results: documents.length,
//         totalCount: totalDocuments,
//         paginationResult,
//         data: documents,
//       });
//     } catch (err) {
//       console.error("Error in getAll:", err);
//       res.status(500).json({
//         status: "error",
//         message: "Failed to fetch data",
//       });
//     }
//   });

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

exports.moveToRecycleBin = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // تحديث المستند مباشرةً مع التحقق من وجوده
    const result = await Model.updateOne(
      {
        _id: id,
        $or: [
          { isDeleted: { $exists: false } }, // المستندات التي لا تحتوي على isDeleted
          { isDeleted: false }, // المستندات التي isDeleted = false
        ],
      },
      {
        $set: { isDeleted: true, deletedAt: new Date() }, // تحديث الحقول المطلوبة
      }
    );

    if (result.matchedCount === 0) {
      return next(
        new ApiError(
          `No document found for this id ${id} or it is already deleted`,
          404
        )
      );
    }

    res
      .status(200)
      .json({ message: "Document moved to recycle bin successfully" });
  });

exports.restoreFromRecycleBin = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // تحديث المستند مباشرةً مع التحقق من وجوده
    const result = await Model.updateOne(
      { _id: id, isDeleted: true }, // التأكد من أن العنصر محذوف
      { $set: { isDeleted: false, deletedAt: null } } // تحديث الحقول المطلوبة
    );

    if (result.matchedCount === 0) {
      return next(
        new ApiError(
          `No document found for this id ${id} or it is not deleted`,
          404
        )
      );
    }

    res.status(200).json({ message: "Document restored successfully" });
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
