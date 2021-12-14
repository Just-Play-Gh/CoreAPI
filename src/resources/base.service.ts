import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { RequestDto } from './dto/request.dto';
import { validateDto } from 'src/helpers/validator';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class BaseService {
  constructor(protected readonly entity) {}

  async getAll(query) {
    const { limit = 10, page = 1 } = query;
    const builder = await this.prepareBuilder(query);
    const results = await paginate<typeof this.entity>(builder, {
      limit,
      page,
    });
    return results;
  }

  async getOne(param, query) {
    const { id } = param;
    const builder = await this.prepareBuilder(query);
    if (id) {
      await builder.andWhere(`entity.id = :id`, { id });
    }
    await this.fetchByColumns(query, builder);
    const results = await builder.getOne();
    if (!results) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return results;
  }

  async getByColumns(query) {
    const builder = await this.prepareBuilder(query);
    this.fetchByColumns(query, builder);
    const results = await builder.getMany();
    return results;
  }

  async store(body, query, storeDto) {
    try {
      if (storeDto) {
        const validDto = await validateDto(new storeDto(), body);
        if (Object.keys(validDto).length > 0)
          throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
      }

      const { identifiers } = await (await this.getQueryBuilder())
        .insert()
        .into(this.entity)
        .values(body)
        .execute();
      const id = identifiers[0].id;
      console.log(id);
      const builder = await this.prepareBuilder(query);
      await builder.where(`entity.id = :id`, { id });
      const results = await builder.getOne();
      return results;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Record already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw error;
    }
  }

  async update(param, body, query, updateDto) {
    const { id } = param;
    if (updateDto) {
      const validDto = await validateDto(new updateDto(), body);
      if (Object.keys(validDto).length > 0)
        throw new HttpException(validDto, HttpStatus.BAD_REQUEST);
    }

    console.log(id);

    await (await this.getQueryBuilder())
      .update(this.entity)
      .set(body)
      .where('id = :id', { id })
      .execute();
    const builder = await this.prepareBuilder(query);
    await builder.where(`entity.id = :id`, { id });
    const results = await builder.getOne();
    return results;
  }

  async delete(param) {
    const { id } = param;
    const builder = await this.prepareBuilder({});
    await builder.where(`entity.id = :id`, { id });
    const results = await builder.getOne();

    if (!results) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    await (await this.getQueryBuilder())
      .delete()
      .from(this.entity)
      .where('id = :id', { id })
      .execute();
    return results;
  }

  private async prepareBuilder(query, queryBuilder = this.getQueryBuilder()) {
    const builder = await queryBuilder;
    const orderBy = await this.applyOrderBy(query, builder);
    const results = await this.includeContains(query, orderBy);
    return results;
  }

  private async fetchByColumns(request: RequestDto, builder) {
    const { columns: columnNames } = request;
    console.log('columnNames', columnNames);
    if (!columnNames) {
      return builder;
    }
    console.log(columnNames);
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

  async validateBody() {
    console.log('validate');
  }

  private async getQueryBuilder() {
    return getConnection()
      .getRepository(this.entity)
      .createQueryBuilder('entity');
  }
}
