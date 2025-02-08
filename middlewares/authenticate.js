const jwt=require('jsonwebtoken')
const user = require('../model/user')

const authenticatetoken=async(req,res,next)=>{
    try {
        const authHeader= req.headers['authorization']
        const token= authHeader && authHeader.split(' ')[1]
        if(token== null){
            return res.status(401)
        }
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decodedToken;
        next();
        
        
    } catch (error) {
        return res.status(400).send(error)
        
    }
}
module.exports=authenticatetoken