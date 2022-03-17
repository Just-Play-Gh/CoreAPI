export const generatePassword = (length: number) => {
  const tempPassword = Math.random()
    .toString(36)
    .slice(length || 8);
  return tempPassword;
};

export const generateOtp = (length: number): string => {
  // generate otp
  const otp = Math.floor(
    Number('1'.padEnd(length, '0')) +
      Math.random() * Number('9'.padEnd(length, '9')),
  )
    .toString()
    .substring(0, 4);
  return otp;
};

export const entityResource = (entity: any) => {
  delete entity.hidden;
  return entity;
};
