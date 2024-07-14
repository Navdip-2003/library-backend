import * as bcrypt from 'bcryptjs';
import { BYCRYPT_SALT_COST } from './constrats';

export const hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(BYCRYPT_SALT_COST);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export const hashToken = (token: string): string => {
    const salt = bcrypt.genSaltSync(BYCRYPT_SALT_COST);
    const hash = bcrypt.hashSync(token, salt);
    return hash;
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
}