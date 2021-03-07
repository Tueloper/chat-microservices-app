import bcryptjs from 'bcryptjs';

const hashPassword = (password: string) => bcryptjs.hashSync(password, bcryptjs.genSaltSync(12));

export default hashPassword;
