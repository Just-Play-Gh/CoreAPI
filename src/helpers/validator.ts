import { validate } from 'class-validator';

export const validateDto = async (dto, loginDto) => {
  for (const key in loginDto) {
    dto[key] = loginDto[key];
  }
  const dtoError = await validate(dto);
  const errorsObject = {};
  dtoError.forEach((error) => {
    errorsObject[error.property] = Object.values(error.constraints);
  });
  return errorsObject;
};
