import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export const handleDBExceptions = (error: any, logger?: Logger) => {
  if (error.code === '23505') {
    throw new BadRequestException(error.detail);
  }

  if (error.code === '23502') {
    throw new BadRequestException(error.detail);
  }

  if (error.code === '23503') {
    throw new BadRequestException(error.detail);
  }

  logger?.error(error);

  throw new InternalServerErrorException(
    'Unexpected error, please check server logs',
  );
};
