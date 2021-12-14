import { SetMetadata } from '@nestjs/common';

export const Permission = (req: any, permission?: string) => {
  console.log(req);
  return SetMetadata('permission', permission);
};
