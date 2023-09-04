import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  CreateProjectsRetuenType,
  FindAllDepartmentType,
  TokenPayloadInterface,
} from '@interfaces/interfaces';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthGuard)
  @Post('department')
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
  ): Promise<CreateProjectsRetuenType> {
    const { department, ...rest } = createProjectDto;
    return this.projectsService.create({
      department,
      details: { ...rest, user: (req as TokenPayloadInterface).sub },
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: FindAllDepartmentType) {
    return this.projectsService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get('department/:departmentId')
  findByDepratment(
    @Param('departmentId') id: string,
    @Query() query: FindAllDepartmentType,
  ) {
    return this.projectsService.findByDepartment(id, query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.projectsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
  //   return this.projectsService.update(+id, updateProjectDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.projectsService.remove(+id);
  // }
}
