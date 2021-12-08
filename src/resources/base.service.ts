import { Injectable } from '@nestjs/common';
import { Customer } from 'src/customer/entities/customer.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { DriverRatingsSummary } from 'src/driver/ratings-summary/entities/ratings-summary.entity';
import { getConnection } from 'typeorm';
import { RequestDto } from './dto/request.dto';
import { resolve } from 'path';

@Injectable()
export class BaseService {
  constructor(protected readonly entity) {}

  async getAll(query) {
    const { limit = 10, offset = 0 } = query;
    const builder = await this.prepareBuilder(query);
    const results = await builder.skip(offset).take(limit).getMany();
    return results;
  }

  async getOne(param, query) {
    const { id } = param;
    const builder = await this.prepareBuilder(query);
    await this.fetchByColumns(query, builder);
    if (id) {
      await builder.andWhere(`entity.id = :id`, { id });
    }
    const results = await builder.getOne();
    return results;
  }

  async getByColumns(query) {
    const builder = await this.prepareBuilder(query);
    this.fetchByColumns(query, builder);
    const results = await builder.getMany();
    return results;
  }

  async store(query) {
    console.log(resolve(this.entity));
    // const queryBuilder = (await this.getQueryBuilder())
    //   .insert()
    //   .into(this.entity)
    // .values()
    // .execute();
    // const builder = await this.prepareBuilder(query, queryBuilder);
    // this.fetchByColumns(query, builder);
    // const results = await builder.getMany();
    // return results;
  }

  private async prepareBuilder(query, queryBuilder = this.getQueryBuilder()) {
    const builder = await queryBuilder;
    const orderBy = await this.applyOrderBy(query, builder);
    const results = await this.includeContains(query, orderBy);
    return results;
  }

  private async fetchByColumns(request: RequestDto, builder) {
    const { columns: columnNames } = request;
    if (!columnNames) {
      return builder;
    }
    const columns = columnNames.split(',');
    columns.forEach((column) => {
      const columnArr = column.split(':');
      if (builder.getQuery().toString().includes(columnArr[0])) {
        builder.where(`entity.${columnArr[0]} = :${columnArr[0]}`, {
          [columnArr[0]]: [columnArr[1]],
        });
      }
    });
    return builder;
  }

  private includeContains(request: RequestDto, builder) {
    const { contain } = request;
    if (!contain) {
      return builder;
    }
    const contains = contain.split(',');
    contains.forEach((contain) => {
      if (builder.hasRelation(this.entity, contain)) {
        builder.leftJoinAndSelect(`entity.${contain}`, contain);
      }
    });
    return builder;
  }

  private applyOrderBy(request: RequestDto, builder) {
    const { orderBy } = request;
    if (!orderBy) {
      return builder;
    }
    const sort = orderBy.split(',');
    sort.forEach((column) => {
      const sortArr = column.split(':');
      if (builder.getQuery().toString().includes(sortArr[0])) {
        builder.orderBy(`entity.${sortArr[0]}`, sortArr[1].toUpperCase());
      }
    });
    return builder;
  }

  private async getQueryBuilder() {
    return getConnection()
      .getRepository(this.entity)
      .createQueryBuilder('entity');
  }
}
