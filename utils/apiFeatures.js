class ApiFeatures {
  constructor(mongooseeQuery, queryStr) {
    this.mongooseeQuery = mongooseeQuery;
    this.queryStr = queryStr;
  }

  filter() {
    // take copy from req.query and delete the page and limit and..... from the copy req.body to use in filter
    const queryStringObj = { ...this.queryStr };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseeQuery = this.mongooseeQuery.find(JSON.parse(queryStr));
    return this;
  }

  // filter() {
  //   // نسخ الاستعلام الأصلي مع استبعاد الحقول غير المرغوبة
  //   const queryStringObj = { ...this.queryStr };
  //   const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
  //   excludesFields.forEach((field) => delete queryStringObj[field]);

  //   let queryStr = JSON.stringify(queryStringObj);
  //   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  //   // التحقق إذا كان هناك فلترة على volumes.date
  //   if (queryStringObj["volumes.date"]) {
  //     const dateFilter = JSON.parse(queryStr)["volumes.date"];
  //     this.mongooseeQuery = this.mongooseeQuery.find({
  //       volumes: { $elemMatch: { date: dateFilter } },
  //     });
  //   } else {
  //     this.mongooseeQuery = this.mongooseeQuery.find(JSON.parse(queryStr));
  //   }

  //   return this;
  // }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(".").join(" ");
      this.mongooseeQuery = this.mongooseeQuery.sort(sortBy);
    } else {
      this.mongooseeQuery = this.mongooseeQuery.sort("createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.mongooseeQuery = this.mongooseeQuery.select(fields);
    } else {
      this.mongooseeQuery = this.mongooseeQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryStr.keyword) {
      let query = {};

      if (modelName === "User") {
        query = { name: { $regex: this.queryStr.keyword, $options: "i" } };
      } else if (modelName === "Event") {
        query = { eventName: { $regex: this.queryStr.keyword, $options: "i" } };
      } else if (
        modelName === "MealsCategory" ||
        modelName === "MealsCalculation"
      ) {
        query = {
          $or: [
            { Title_AR: { $regex: this.queryStr.keyword, $options: "i" } },
            { Title_EN: { $regex: this.queryStr.keyword, $options: "i" } },
          ],
        };
      } else if (modelName === "Meals") {
        query = {
          $or: [
            { title_ar: { $regex: this.queryStr.keyword, $options: "i" } },
            { title_en: { $regex: this.queryStr.keyword, $options: "i" } },
            {
              description_ar: { $regex: this.queryStr.keyword, $options: "i" },
            },
            {
              description_en: { $regex: this.queryStr.keyword, $options: "i" },
            },
          ],
        };
      } else {
        query = {
          title: { $regex: this.queryStr.keyword, $options: "i" },
        };
      }

      this.mongooseeQuery = this.mongooseeQuery.find(query);
    }

    return this;
  }

  paginate(totalDocuments) {
    // استخراج الصفحة والحد من الاستعلام مع القيم الافتراضية
    const page = Math.max(Number(this.queryStr.page) || 1, 1); // الصفحة الافتراضية 1
    const limit = Math.min(Number(this.queryStr.limit) || 6, totalDocuments); // الحد الافتراضي 6
    const skip = (page - 1) * limit; // حساب عدد الوثائق التي يجب تخطيها
    const endIndex = page * limit; // نهاية الوثائق لهذه الصفحة

    // إعداد الـ pagination object
    const pagination = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(totalDocuments / limit),
    };

    // تحديد الصفحة التالية إذا كانت موجودة
    if (endIndex < totalDocuments) {
      pagination.nextPage = page + 1;
    }

    // تحديد الصفحة السابقة إذا كانت موجودة
    if (page > 1) {
      pagination.previousPage = page - 1;
    }

    // التأكد من وجود query قبل التعديل عليه
    if (!this.mongooseeQuery) {
      throw new Error(
        "Mongoose query not initialized. Ensure `this.mongooseQuery` is defined."
      );
    }

    // إضافة الترتيب الثابت لمنع التكرار بين الصفحات
    this.mongooseeQuery = this.mongooseeQuery
      .sort({ _id: 1 }) // ترتيب ثابت بناءً على _id أو حقل آخر مثل createdAt
      .skip(skip)
      .limit(limit);

    this.paginationResult = pagination;
    return this;
  }

  // search(modelName) {
  //   if (this.queryStr.keyword) {
  //     let query = {};

  //     if (modelName === "User") {
  //       query = { name: { $regex: this.queryStr.keyword, $options: "i" } };
  //     } else if (modelName === "Event") {
  //       query = { eventName: { $regex: this.queryStr.keyword, $options: "i" } };
  //     } else if (
  //       modelName === "MealsCategory" ||
  //       modelName === "MealsCalculation"
  //     ) {
  //       query = {
  //         $or: [
  //           { Title_AR: { $regex: this.queryStr.keyword, $options: "i" } },
  //           { Title_EN: { $regex: this.queryStr.keyword, $options: "i" } },
  //         ],
  //       };
  //     } else {
  //       query = {
  //         title: { $regex: this.queryStr.keyword, $options: "i" },
  //       };
  //     }

  //     // تعديل query بحيث يشمل التصفية
  //     this.mongooseeQuery = this.mongooseeQuery.find(query);
  //   }

  //   return this;
  // }
}

module.exports = ApiFeatures;
