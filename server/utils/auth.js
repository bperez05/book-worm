const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {

  authMiddleware: function ({req}) {
    // added in req.body.token
     let token = req.body.token || req.query.token || req.headers.authorization;
 
     
     if (!token) {
      return req;
     }
 
     // if (!token) {
     //   return res.status(400).json({ message: 'You have no token!' });
     // }
 
     try {
       const { data } = jwt.verify(token, secret, { maxAge: expiration });
       req.user = data;
     } catch {
       console.log('Invalid token');
       // return res.status(400).json({ message: 'invalid token!' });
     }
       return req;
       // this is going through the resolver 
 
     // next();
   },
   signToken: function ({ username, email, _id }) {
     const payload = { username, email, _id };
 
     return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
   },
 };
 