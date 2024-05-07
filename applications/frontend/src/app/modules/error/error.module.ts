import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ForbiddenErrorComponent } from './components/forbidden-error/forbidden-error.component';
import { NotFoundErrorComponent } from './components/not-found-error/not-found-error.component';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './layout/error.component';

@NgModule({
  declarations: [ErrorComponent, ForbiddenErrorComponent, NotFoundErrorComponent],
  imports: [CommonModule, ErrorRoutingModule],
})
export class ErrorModule {}
