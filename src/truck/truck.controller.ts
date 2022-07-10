import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TruckService } from './truck.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SearchUserDto } from 'src/users/dto/search-user.dto';
import { Like } from 'typeorm';

@Controller('trucks')
export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTruckDto: CreateTruckDto) {
    return this.truckService.create(createTruckDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTrucks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit = 15,
    @Query() getTrucks: SearchUserDto,
  ) {
    delete getTrucks.page;
    delete getTrucks.limit;
    let searchParams = [];
    if (getTrucks.searchValue) {
      searchParams = [
        {
          name: Like('%' + getTrucks.searchValue + '%'),
        },
      ];
    }
    return this.truckService.getTrucks({ page, limit }, searchParams);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.truckService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTruckDto: UpdateTruckDto) {
    return this.truckService.update(+id, updateTruckDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.truckService.remove(+id);
  }
}
