import bcryptjs from 'bcryptjs';

const passwordCompareSync = (passwordTest: string, passwordHash: string) => bcryptjs.compareSync(passwordTest, passwordHash)

export default passwordCompareSync;
