const bcrypt = require('bcrypt');

async function hashPassword() {
    const myPassword = 'myPassword';
    const hash = await bcrypt.hash(myPassword, 10);
    console.log(hash);
    return hash;
}

hashPassword()