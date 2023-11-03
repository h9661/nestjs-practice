import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  LessThan,
  Repository,
} from 'typeorm';
import { Base } from './entities/base.entity';
import { FILTER_MAPPER } from 'src/posts/const/filter-mapper.const';

@Injectable()
export class CommonService {
  paginate<T extends Base>(
    basePaginationDto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (basePaginationDto.page) {
      return this.pagePaginate(
        basePaginationDto,
        repository,
        overrideFindOptions,
      );
    } else {
      return this.cursorPaginate(
        basePaginationDto,
        repository,
        overrideFindOptions,
        path,
      );
    }
  }

  private async pagePaginate<T extends Base>(
    basePaginationDto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(basePaginationDto);

    const [entities, count] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
    });

    return {
      data: entities,
      total: count,
    };
  }

  private async cursorPaginate<T extends Base>(
    basePaginationDto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const findOptions = this.composeFindOptions<T>(basePaginationDto);

    const entities = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    const lastItem = entities.length > 0 ? entities[entities.length - 1] : null;
    const nextUrl = lastItem ? new URL(`http://localhost:3000/${path}`) : null;
    if (nextUrl) {
      for (const key of Object.keys(basePaginationDto)) {
        if (!basePaginationDto[key]) continue;

        if (key != 'where__id_more_than' && key != 'where__id_less_than') {
          nextUrl.searchParams.append(key, basePaginationDto[key]);
        }
      }

      if (basePaginationDto.order__createdAt == 'ASC') {
        nextUrl.searchParams.append(
          'where__id_more_than',
          lastItem.id.toString(),
        );
      } else {
        nextUrl.searchParams.append(
          'where__id_less_than',
          lastItem.id.toString(),
        );
      }
    }

    return {
      data: entities,
      cursor: {
        after: lastItem?.id,
      },
      count: entities?.length,
      next: nextUrl?.toString(),
    };
  }

  private composeFindOptions<T extends Base>(
    basePaginationDto: BasePaginationDto,
  ): FindManyOptions<T> {
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(basePaginationDto)) {
      if (key.startsWith('where__')) {
        where = { ...where, ...this.parseWhereFilter<T>(key, value) };
      } else if (key.startsWith('order__')) {
        order = { ...order, ...this.parseOrderFilter<T>(key, value) };
      }
    }

    return {
      where,
      order,
      take: basePaginationDto.take,
      skip: basePaginationDto.page
        ? basePaginationDto.take * (basePaginationDto.page - 1)
        : 0,
    };
  }

  private parseWhereFilter<T extends Base>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> {
    const options: FindOptionsWhere<T> = {};
    const split = key.split('__');

    if (split.length != 2 && split.length != 3) {
      throw new BadRequestException('Invalid where filter');
    }

    if (split.length == 2) {
      const [_, field] = split;

      options[field] = value;
    } else {
      const [_, field, operator] = split;

      const values = value.toString().split(',');

      if (operator == 'between') {
        options[field] = FILTER_MAPPER[operator](values[0], values[1]);
      } else {
        options[field] = FILTER_MAPPER[operator](value);
      }
    }

    return options;
  }

  private parseOrderFilter<T extends Base>(
    key: string,
    value: any,
  ): FindOptionsOrder<T> {
    const options: FindOptionsOrder<T> = {};
    const split = key.split('__');

    if (split.length != 2) {
      throw new BadRequestException('Invalid order filter');
    }

    const [_, field] = split;

    options[field] = value;

    return options;
  }
}
