import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { getConnection, Like } from 'typeorm';
import { RequestDto } from './dto/request.dto';
import { validateDto } from '../helpers/validator';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class BaseService {
  constructor(protected readonly entity) {}

  async getAll(query) {
    try {
      const { limit = 50, page = 1 } = query;
      const builder = await this.prepareBuilder(query);
      const results = await paginate<typeof this.entity>(builder, {
        limit,
        page,
      });
      return this.filteredResults(results);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async getOne(param, query) {
    try {
      const { id } = param;
      const builder = await this.prepareBuilder(query);
      if (id) {
        await builder.andWhere(`entity.id = :id`, { id });
      }
      await this.fetchByColumns(query, builder);
      const results = await builder.getOne();
      if (!results) {
        console.log('No results found', results);
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      console.log('Successfuly retrieved single record', results);
      return this.filteredResult(results);
    } catch (error: any) {
      console.log('An error o ccurred', error);
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async getByColumns(query) {
    try {
      const builder = await this.prepareBuilder(query);
      this.fetchByColumns(query, builder);
      const results = await builder.getMany();
      return results;
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async store(body, model) {
    try {
      return this.filteredResult(
        await this.entity.save(this.entity.create(body), {
          data: { model },
        }),
      );
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Record already exists',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw error;
    }
  }

  async update(param, body, user) {
    try {
      const { id } = param;
      const builder = await this.prepareBuilder({});
      await builder.where(`entity.id = :id`, { id });
      const result = await builder.getOne();
      if (!result) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      return this.filteredResult(
        await this.entity.save(this.entity.create({ ...result, ...body }), {
          data: { user },
        }),
      );
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async delete(param, user) {
    try {
      const { id } = param;
      const builder = await this.prepareBuilder({});
      await builder.where(`entity.id = :id`, { id });
      const results = await builder.getOne();

      if (!results) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      const resource = await this.entity.findOne({ id });
      console.log('results.deleted', results.deleted);
      if (results.deleted === undefined) {
        resource.remove({ data: { user } });
      } else {
        resource.softRemove({ data: { user } });
      }
      return this.filteredResult(results);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
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

  async search(query) {
    let queryString = '(';
    const columns = Object.keys(query);
    columns.forEach((key, index) => {
      queryString += `${key} like '%${query[key]}%'${
        index < columns.length - 1 ? ' or ' : ')'
      }`;
    });
    try {
      Logger.log('searching entity...', query);
      const { limit = 10, page = 1 } = query;
      const builder = (await this.getQueryBuilder()).where(queryString);
      return await paginate<typeof this.entity>(builder, {
        limit,
        page,
      });
    } catch (error) {
      Logger.log('error searching for entity', error);
      throw error;
    }
  }

  private includeContains(request: RequestDto, builder) {
    const { contain } = request;
    if (!contain) {
      return builder;
    }
    const contains = contain.split(',');
    contains.forEach((contain) => {
      if (builder.hasRelation(this.entity, contain)) {
        console.log(`entity.${contain}`, contain);
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

  private filteredResult(results) {
    if (results.hidden) {
      const hiddenAttributes = JSON.parse(JSON.stringify(results.hidden));
      delete results.hidden;
      for (const key in results) {
        if (hiddenAttributes.includes(key)) {
          delete results[key];
        }
      }
    }
    return results;
  }

  private filteredResults(results) {
    if (results.items.length > 0) {
      results.items.forEach((result) => {
        if (result.hidden) {
          const hiddenAttributes = JSON.parse(JSON.stringify(result.hidden));
          delete result.hidden;
          for (const key in result) {
            if (hiddenAttributes.includes(key)) {
              delete result[key];
            }
          }
        }
      });
    }
    return results;
  }
}
