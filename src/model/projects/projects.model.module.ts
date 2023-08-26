import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectsModelService } from './projects.model.service';
import { Projects, ProjectsSchema } from './schema/projects.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Projects.name,
        useFactory: () => {
          const schema = ProjectsSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [ProjectsModelService],
  exports: [ProjectsModelService],
})
export class ProjectsModelModule {}
