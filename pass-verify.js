const bcrypt = require('bcrypt');

async function verifyPassword() {
    const myPassword = 'myPassword';
    const hash = '$2b$10$5vGVmezO1kcbxGuvzIZCg.oMS.h1x9vAJuj4l.yQi6JweFR6hFbdW';
    const isMatch = await bcrypt.compare(myPassword, hash);
    console.log(isMatch);
}

verifyPassword()