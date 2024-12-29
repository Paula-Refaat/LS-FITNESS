const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");
const translateBodyContent = require("../utils/helpers/again"); // تأكد من استيراد translateBodyContent بشكل صحيح

// exports.createOne = (Model) =>
//   asyncHandler(async (req, res) => {
//     const document = await Model.create(req.body);
//     res.status(201).json({ data: document });
//   });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    // تحقق من وجود الحقول التي تحتاج إلى الترجمة
    const body = req.body;

    // تحقق إذا كانت الحقول المطلوبة موجودة في الـ body
    if (body.title || body.description || body.instructions || body.benefits) {
      try {
        // قم بترجمة الحقول
        const translatedFields = await translateBodyContent(body);

        // استبدل الحقول المترجمة في الـ body
        Object.keys(translatedFields).forEach((field) => {
          if (translatedFields[field]) {
            body[field] = translatedFields[field];
          }
        });
      } catch (error) {
        console.error("Error during translation:", error);
        return res.status(500).json({ message: "Error during translation" });
      }
    }

    // أنشئ المستند بعد الترجمة (أو إذا لم توجد الحقول المطلوب ترجمتها)
    const document = await Model.create(body);
    res.status(201).json({ data: document });
  });

// دية الشغاله 100%
// exports.getAll = (Model, modelName = "", populationOpt) =>
//   asyncHandler(async (req, res) => {
//     // Initialize filter object
//     let filter = req.filterObj || {};

//     // Initialize query
//     let query = Model.find(filter);

//     // Apply population if specified
//     if (populationOpt) {
//       if (populationOpt === "courses") {
//         query = query.populate({
//           path: populationOpt,
//           select: "-category ",
//           options: { limit: 4, sort: { _id: -1 } },
//         });
//       } else {
//         query = query.populate(populationOpt);
//       }
//     }

//     // Initialize ApiFeatures with the query and request query parameters
//     const apiFeatures = new ApiFeatures(query, req.query)
//       .filter()
//       .search(modelName)
//       .limitFields()
//       .sort(); // Ensure sorting is applied before pagination

//     // Clone the filtered query to count documents
//     const filteredDocumentsCount = await apiFeatures.mongooseeQuery
//       .clone()
//       .countDocuments();

//     // Apply pagination (uses filteredDocumentsCount for page/limit logic)
//     apiFeatures.paginate(filteredDocumentsCount);

//     // Execute the final query with pagination
//     const { mongooseeQuery, paginationResult } = apiFeatures;
//     const documents = await mongooseeQuery;

//     // Send response
//     res.status(200).json({
//       results: documents.length,
//       totalCount: filteredDocumentsCount,
//       paginationResult,
//       data: documents,
//     });
//   });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    // Initialize filter object
    let filter = req.filterObj || {};

    // Initialize query
    let query = Model.find(filter); // Ensures `pre(/^find/)` is applied.

    // Add the language to the query options for pre middleware
    const lang = req.query.lang || "en";
    query.setOptions({ lang });

    // Initialize ApiFeatures with the query and request query parameters
    const apiFeatures = new ApiFeatures(query, req.query)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Clone the filtered query to count documents
    const filteredDocumentsCount = await apiFeatures.mongooseeQuery
      .clone()
      .countDocuments();

    // Apply pagination (uses filteredDocumentsCount for page/limit logic)
    apiFeatures.paginate(filteredDocumentsCount);

    // Execute the final query with pagination
    const { mongooseeQuery, paginationResult } = apiFeatures;
    const documents = await mongooseeQuery;

    // Translate and clean up response
    const translatedDocuments = documents.map((doc) => {
      const docObj = doc.toJSON(); // Use toJSON to respect custom transformations
      const translatedDoc = {};

      for (const key in docObj) {
        if (
          typeof docObj[key] === "object" &&
          docObj[key] !== null &&
          docObj[key][lang] // If it's a translatable field
        ) {
          translatedDoc[key] = docObj[key][lang];
        } else {
          translatedDoc[key] = docObj[key]; // Non-translatable fields
        }
      }

      return translatedDoc;
    });

    // Return the response
    res.status(200).json({
      results: translatedDocuments.length,
      totalCount: filteredDocumentsCount,
      paginationResult,
      data: translatedDocuments,
    });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || "en"; // اللغة الافتراضية

    let query = Model.findById(id);
    query.setOptions({ lang });

    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this ID: ${id}`, 404));
    }

    // استخدام toJSON لتحويل الوثيقة
    const docObj = document.toJSON(); // Use toJSON to respect custom transformations
    const localizedData = {};

    // معالجة الحقول بناءً على اللغة
    for (const [key, value] of Object.entries(docObj)) {
      if (typeof value === "object" && value !== null && value[lang]) {
        localizedData[key] = value[lang];
      } else {
        localizedData[key] = value;
      }
    }

    res.status(200).json({
      data: localizedData,
    });
  });

// exports.getOne = (Model, populationOpt) =>
//   asyncHandler(async (req, res, next) => {
//     const { id } = req.params;
//     const lang = req.query.lang || "en"; // اللغة الافتراضية

//     let query = Model.findById(id);

//     if (populationOpt) {
//       query = query.populate(populationOpt);
//     }

//     const document = await query;

//     if (!document) {
//       return next(new ApiError(`No document for this ID: ${id}`, 404));
//     }

//     // معالجة الحقول بناءً على اللغة
//     const localizedData = {};
//     for (const [key, value] of Object.entries(document._doc)) {
//       if (typeof value === "object" && value !== null && value[lang]) {
//         localizedData[key] = value[lang];
//       } else {
//         localizedData[key] = value;
//       }
//     }

//     res.status(200).json({
//       data: localizedData,
//     });
//   });

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
    const adminId = process.env.PERENNATE_ADMIN_ID;
    const { id } = req.params;
    if (adminId === id) {
      return next(new ApiError("This admin can't be deleted", 400));
    }
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    // Trigger "remove" event when delete document
    // document.remove();
    res.status(204).send();
  });
