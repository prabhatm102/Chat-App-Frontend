import { ErrorHandler } from '@angular/core';

export class AppErrorHandler implements ErrorHandler {
  constructor() {}

  handleError(error: any): void {
    console.log(error);
  }
}
