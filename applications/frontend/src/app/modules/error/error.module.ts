import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ForbiddenErrorComponent } from './components/forbidden-error/forbidden-error.component';
import { NotFoundErrorComponent } from './components/not-found-error/not-found-error.component';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './layout/error.component';

/**
 * The ErrorModule is responsible for providing components and routing
 * related to error handling in the application.
 */
@NgModule({
  declarations: [
    ErrorComponent,
    ForbiddenErrorComponent,
    NotFoundErrorComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule
  ],
})
export class ErrorModule {}
