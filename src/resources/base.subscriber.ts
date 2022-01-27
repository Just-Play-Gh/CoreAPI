import { generatePassword } from 'src/helpers/generator';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ActivityLogsService } from 'src/activity-logs/activity-logs.service';
import { CreateActivityDto } from 'src/activity-logs/dto/create.dto';
import { Request } from 'express';
import { ActivityLog } from 'src/activity-logs/entities/activityLog.entity';

@EventSubscriber()
export class BaseSubscriber implements EntitySubscriberInterface<any> {
  constructor(private activityLogsService: ActivityLogsService) {}

  async beforeInsert(event: InsertEvent<any>) {
    event.entity.referralCode = generatePassword(8).toUpperCase();
    event.entity.password = await this.hashPassword(event.entity.password);
  }

  async afterInsert(event: UpdateEvent<any>) {
    const causer = event.queryRunner.data.user;
    if (causer) {
      const role = JSON.parse(causer.role);
      const log = new ActivityLog();
      log.logName = `${event.metadata.givenTableName}_management`;
      log.description = `Created ${event.metadata.targetName}`;
      log.causerId = causer.id;
      log.causerType = role.name;
      log.subjectId = event.entity.id;
      log.subjectType = `${event.metadata.targetName}`;
      log.properties = { attributes: '1' };
      await event.manager
        .getRepository(ActivityLog)
        .save(log, { listeners: false });
    }
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    const updatedColumns = event.updatedColumns.map(
      (column) => column.propertyName,
    );
    if (updatedColumns.includes('password'))
      event.entity.password = await this.hashPassword(event.entity.password);
  }

  async afterUpdate(event: UpdateEvent<any>) {
    const causer = event.queryRunner.data.user;
    if (causer) {
      const role = JSON.parse(causer.role);
      const descriptionType =
        event.entity.deleted !== null ? 'Deleted' : 'Updated';
      const log: CreateActivityDto = {
        logName: `${event.metadata.givenTableName}_management`,
        description: `${descriptionType} ${event.metadata.targetName}`,
        causerId: causer.id,
        causerType: role.name,
        subjectId: event.entity.id,
        subjectType: `${event.metadata.targetName}`,
        properties: {
          old: event.databaseEntity,
          attributes: event.entity.deleted !== null ? {} : event.entity,
        },
      };
      await event.manager
        .getRepository(ActivityLog)
        .save(log, { listeners: false });
    }
  }

  async afterRemove(event: RemoveEvent<any>) {
    const causer = event.queryRunner.data.user;
    if (causer) {
      const role = JSON.parse(causer.role);
      const log: CreateActivityDto = {
        logName: `${event.metadata.givenTableName}_management`,
        description: `Deleted ${event.metadata.targetName}`,
        causerId: causer.id,
        causerType: role.name,
        subjectId: event.databaseEntity.id,
        subjectType: `${event.metadata.targetName}`,
        properties: { old: event.databaseEntity, attributes: {} },
      };
      await event.manager
        .getRepository(ActivityLog)
        .save(log, { listeners: false });
    }
  }

  async hashPassword(password: string) {
    return password ? await bcrypt.hash(password, 8) : password;
  }
}
