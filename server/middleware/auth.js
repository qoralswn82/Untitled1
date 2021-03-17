const {User} = require('../models/user') ;


let auth = (req,res,next)=>{
    //클라이어트 쿠키에서 토큰 가져오기
	let token = req.cookies.x_auth
	//토큰 복호화 => _userid 획득
	User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return res.json({ isAuth : false, error : true})

        req.token = token;
        req.user = user;
        next();
    })
	//
}


module.exports = { auth };