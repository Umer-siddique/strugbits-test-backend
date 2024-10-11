class APIFeatures {
  constructor(query, queryStr, searchArray = []) {
    this.query = query;
    this.queryStr = queryStr;
    this.searchArray = searchArray;
  }

  filter() {
    const queryObj = { ...this.queryStr };

    const excludedFields = ["page", "limit", "sort", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);

    if (this.queryStr.search && this.searchArray.length > 0) {
      const searchRegex = new RegExp(this.queryStr.search, "i");
      queryStr.$or = this.searchArray.map((field) => ({
        [field]: searchRegex,
      }));
    }

    this.query = this.query.find(queryStr);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort({ createdAt: 1 });
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const limitedFields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(limitedFields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const limit = this.queryStr.limit * 1 || 10;
    const page = this.queryStr.page * 1 || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

// class APIFeatures {
//   constructor(query, queryStr) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }

//   filter() {
//     const queryObj = { ...this.queryStr };

//     const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     let queryStr = JSON.stringify(queryObj);

//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

//     queryStr = JSON.parse(queryStr);

//     /**
//      * The search uses name and description to search currently
//      */
//     // if (this.queryStr.search) {
//     //   const searchRegex = new RegExp(this.queryStr.search, 'i');
//     //   queryStr.$or = [{ name: searchRegex }, { email: searchRegex }];
//     // }

//     this.query = this.query.find(queryStr);
//     return this;
//   }

//   sort() {
//     if (this.queryStr.sort) {
//       const sortBy = this.queryStr.sort.split(',').join(' ');
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort({ createdAt: -1 });
//     }

//     return this;
//   }

//   limitFields() {
//     if (this.queryStr.fields) {
//       const limitedFields = this.queryStr.fields.split(',').join(' ');
//       this.query = this.query.select(limitedFields);
//     } else {
//       this.query = this.query.select('-__v');
//     }
//     return this;
//   }

//   paginate() {
//     const limit = this.queryStr.limit * 1 || 10;
//     const page = this.queryStr.page * 1 || 1;
//     const skip = (page - 1) * limit;

//     this.query = this.query.skip(skip).limit(limit);

//     return this;
//   }
// }

// module.exports = APIFeatures;
