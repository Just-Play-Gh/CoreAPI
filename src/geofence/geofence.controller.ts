import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { GeofenceService } from './geofence.service';
import { CreateGeofenceDto } from './dto/create-geofence.dto';
import { UpdateGeofenceDto } from './dto/update-geofence.dto';
import { GetGeofencesDto } from './dto/get-geofences.dto';

@Controller('geofences')
export class GeofenceController {
  constructor(private readonly geofenceService: GeofenceService) {}

  @Post()
  create(@Body() createGeofenceDto: CreateGeofenceDto) {
    return this.geofenceService.create(createGeofenceDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 15,
    @Query() getGeofences: GetGeofencesDto,
  ) {
    delete getGeofences.page;
    delete getGeofences.limit;
    return this.geofenceService.findAll({ page, limit }, getGeofences);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geofenceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGeofenceDto: UpdateGeofenceDto,
  ) {
    return this.geofenceService.update(+id, updateGeofenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.geofenceService.remove(+id);
  }
}
