const getMailer = () => {
  console.log(process.env.MAIL_HOST);
};

export const mail = {
  mail: getMailer(),
};
