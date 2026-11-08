import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger extends Logger {
  constructor(context: string) {
    super(context);
  }
}
