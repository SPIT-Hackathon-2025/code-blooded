import jwt from 'jsonwebtoken';

const authenticatetoken=async(req,res,next)=>{
    try {
        const authHeader= req.headers['authorization']
        const token= authHeader && authHeader.split(' ')[1]
        if(token== null){
            return res.status(401)
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedToken;
        next();
        
        
    } catch (error) {
        return res.status(400).send(error)
        
    }
}
export default authenticatetoken;