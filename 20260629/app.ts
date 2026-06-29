import { genSalt, hash, compare } from 'bcrypt';

const hashPassword = async (password: string) => {
    const salt = await genSalt(10)
    return await hash(password, salt);
}

const verifyPassword = async (password: string, hash: string) => {
    return await compare(password, hash);
}

const main = async() => {
    const hashed = await hashPassword('hello123');
    console.log('雜湊結果：', hashed);

    const correct = await verifyPassword('hello123', hashed);
    console.log('正確密碼比對：', correct);

    const wrong = await verifyPassword('wrongPass', hashed);
    console.log('錯誤密碼比對：', wrong);
}

main()





