import { SetMetadata } from '@nestjs/common';

export const Permissions = (permission?: string | string[]) => {
  return SetMetadata('permissions', permission);
};
