import { SetMetadata } from '@nestjs/common';

export const PublicValid = 'isPublic';
export const Public = () => SetMetadata(PublicValid, true);
