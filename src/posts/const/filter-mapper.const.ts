import * as typeorm from 'typeorm';

export const FILTER_MAPPER = {
  more_than: typeorm.MoreThan,
  less_than: typeorm.LessThan,
  equal: typeorm.Equal,
  like: typeorm.Like,
  in: typeorm.In,
  not: typeorm.Not,
  is_null: typeorm.IsNull,
  between: typeorm.Between,
  raw: typeorm.Raw,
  any: typeorm.Any,
  less_than_or_equal: typeorm.LessThanOrEqual,
  more_than_or_equal: typeorm.MoreThanOrEqual,
  ilike: typeorm.ILike,
  less_than_or_equal_to: typeorm.LessThanOrEqual,
  more_than_or_equal_to: typeorm.MoreThanOrEqual,
};
