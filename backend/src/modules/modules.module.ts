import { Module, forwardRef } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { ProgressModule } from '../progress/progress.module';

@Module({
  imports: [forwardRef(() => ProgressModule)],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
