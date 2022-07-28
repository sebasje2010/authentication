const jwt=require('jsonwebtoken')
const secret='secret'
const payload={
    sub:'12345',
    role:'admin'
}

function signToken(payload,secret){
    return jwt.sign(payload,secret)
}

const token=signToken(payload,secret)
console.log(token)