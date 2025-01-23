import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
  Paramtype,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);
  constructor(private readonly schema: Partial<Record<Paramtype, ZodSchema>>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const schema = this.schema[metadata.type];

    if (!schema) {
      this.logger.error('ZodValidationPipe error: ', {
        schema: this.schema,
        value,
        metadata,
      });
      throw new BadRequestException('Validation failed, schema not defined.');
    }
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      this.logger.error('ZodValidationPipe error: ', parsed.error);
      throw new BadRequestException(parsed.error.issues[0].message);
    }
    return parsed.data;
  }
}
