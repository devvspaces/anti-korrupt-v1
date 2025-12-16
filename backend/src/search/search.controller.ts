import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('modules')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get(':id/search')
  async search(
    @Param('id', ParseIntPipe) moduleId: number,
    @Query('q') query: string,
  ) {
    return this.searchService.searchInModule(moduleId, query);
  }
}
