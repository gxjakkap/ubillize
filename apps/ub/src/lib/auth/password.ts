import { compare, hash } from 'bcryptjs'

export const checkPassword = async(x: string, y: string) => {
    const isMatch = await compare(x, y);
    return isMatch
}

export const hashPassword = async(plain: string, salt: string) => {
    const hashed = await hash(plain, salt)
    return hashed
}