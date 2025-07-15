import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.search as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            } as FilterQuery<T>)
        ),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = [
      "search",
      "sortBy",
      "sortOrder",
      "limit",
      "page",
      "fields",
    ];
    excludeFields.forEach((field) => delete queryObj[field]);

    const filterQuery: FilterQuery<T> = {};

    // ✅ Filter by status if present
    if (queryObj.status) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (filterQuery as any)["status"] = queryObj.status;
    }

    // Optionally, also support priority
    if (queryObj.priority) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (filterQuery as any)["priority"] = queryObj.priority;
    }

    this.modelQuery = this.modelQuery.find(filterQuery);
    return this;
  }

  sort() {
    const sortBy = (this.query.sortBy as string) || "createdAt";
    const sortOrder = (this.query.sortOrder as string) === "desc" ? "-" : "";
    const sortString = `${sortOrder}${sortBy}`;
    this.modelQuery = this.modelQuery.sort(sortString);
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 9;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields = (this.query.fields as string)?.split(",")?.join(" ");
    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }
}

export default QueryBuilder;
