import {
  CollectionQuery,
  DetailQuery,
  Filter,
  Order,
} from "@/lib/entity";

export type apiType = "ps" | "strapi";

const flattenFilter = (filters: Filter[][]): Filter[] => filters.flatMap((group) => group);

export const getKeyValue =
  <U extends keyof T, T extends object>(key: U) =>
  (obj: T) =>
    obj[key];

export const collectionQueryBuilder = (
  request: CollectionQuery,
  type: apiType = "ps"
) => {
  const params: Record<string, string> = {};
  const setParam = (key: string, value: string) => {
    params[key] = value;
  };

  if (request?.skip !== undefined) {
    const skip = type === "strapi" ? "_start" : "skip";
    setParam(skip, request.skip.toString());
  }

  if (request?.take !== undefined) {
    const take = type === "strapi" ? "_limit" : "take";
    setParam(take, request.take.toString());
  }

  if (request?.search !== undefined) {
    setParam("search", request.search.toString());
  }

  if (request?.searchFrom?.length) {
    request.searchFrom.forEach((searchFrom, index) => {
      setParam(`searchFrom[${index}]`, searchFrom.toString());
    });
  }

  if (request?.sortBy?.length) {
    if (request.useFlatSort) {
      const first = request.sortBy[0];
      if (first?.field) {
        setParam("sortBy", first.field);
      }
      const dir = (first?.direction ?? "asc").toLowerCase();
      setParam("order", dir === "desc" ? "DESC" : "ASC");
    } else {
      request.sortBy.forEach((sortBy, index) => {
        const orderKeys: (keyof Order)[] = ["field", "direction"];
        orderKeys.forEach((key) => {
          const value = sortBy[key];
          if (value !== undefined) {
            setParam(`sortBy[${index}][${key}]`, encodeURIComponent(value));
          }
        });
      });
    }
  }

  if (request?.groupBy?.length) {
    request.groupBy.forEach((groupBy, index) => {
      setParam(`groupBy[${index}]`, encodeURIComponent(groupBy));
    });
  }

  if (request?.filter?.length) {
    if (type === "strapi") {
      const flat = flattenFilter(request.filter);
      const operators = {
        "=": "_eq",
      };
      flat.forEach((r: Filter) => {
        // const operator = getKeyValue("operator")(r);
        const operator = getKeyValue<"operator", Filter>("operator")(r);
        const fieldKey = `${r.field}${operators[operator as keyof typeof operators]}`;
        setParam(fieldKey, String(r.value));
      });
    } else {
      const filterKeys: (keyof Filter)[] = ["field", "value", "operator"];
      request.filter.forEach((filterAnd, index) => {
        filterAnd.forEach((filterOr, orIndex) => {
          filterKeys.forEach((key) => {
            const value = filterOr[key];
            if (value !== undefined) {
              setParam(
                `filter[${index}][${orIndex}][${key}]`,
                String(value)
              );
            }
          });
        });
      });
    }
  }

  if (request?.select?.length) {
    request.select.forEach((select, index) => {
      setParam(`select[${index}]`, select);
    });
  }

  if (request?.includes?.length) {
    request.includes.forEach((include, index) => {
      setParam(`includes[${index}]`, include);
    });
  }

  if (request?.distinct?.length) {
    request.distinct.forEach((distinct, index) => {
      setParam(`distinct[${index}]`, distinct);
    });
  }

  if (request?.count !== undefined) {
    setParam("count", request.count.toString());
  }

  if (request?.withArchived !== undefined && request.withArchived) {
    setParam("withArchived", request.withArchived.toString());
  }

  return params;
};

export const findById = (id: string) => {
  const request: DetailQuery = {
    filter: [
      [
        {
          field: "id",
          value: id,
          operator: "=",
        },
      ],
    ],
  };

  return collectionQueryBuilder(request);
};
