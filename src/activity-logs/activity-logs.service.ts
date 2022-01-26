import { Injectable, Logger } from '@nestjs/common';
import { CreateActivityDto } from './dto/create.dto';
import { ActivityLog } from './entities/activityLog.entity';

@Injectable()
export class ActivityLogsService {
  async store(activities: CreateActivityDto) {
    // try {
    //   const activity = ActivityLog.create();
    //   activity.logName = activities.logName;
    //   activity.description = activities.description;
    //   activity.subjectId = activities.subjectId;
    //   activity.subjectType = activities.subjectType;
    //   activity.causerId = activities.causerId;
    //   activity.causerType = activities.causerType;
    //   activity.properties = activities.properties;
    //   activity.save();
    // } catch (error) {
    //   Logger.error('An error occured while saving activity log', error);
    // }
  }
}
