const jwt=require('jsonwebtoken')
const secret='secret'
const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1ODk2OTU3M30.XOr95TbccIS-gFCseUVdqZPcWZbDohowR0nml1fWp9E'

function verifyToken(token,secret){
    return jwt.verify(token,secret)
}

const payload=verifyToken(token,secret)
console.log(payload)