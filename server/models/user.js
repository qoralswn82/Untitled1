const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const saltRounds = 10; //salt 가 몇글자인지 지정
const userSchema = mongoose.Schema({
	name : {
		type : String,
		mamlength : 50
	},
	email : {
		type : String,
		trim : true,
		unique : 1
	},
	password : {
		type : String, 
		minlength : 5
	},
	lastname : {
		type : String, 
		maxlength : 50
	},
	role : {
		type : Number,
		default : 0
	},
	image : String,
	token : {
		type : String
	},
	tokenExp : {
		type  : Number
	}
})

//DB에 저장하기 전에 하는 logic
userSchema.pre('save',function(next){
	var user = this;
	
	//password가 변경될 경우에만 실행
	if(user.isModified('password')){
		//비밀번호 암호화
		//salt 를 선언하여 salt를 사용하여 암호화
		bcrypt.genSalt(saltRounds, function(err, salt) {
			if(err) return next(err)
			bcrypt.hash(user.password, salt, function(err, hash) {
				// Store hash in your password DB.
				if(err) return next(err)
				user.password = hash
				console.log("usermodle : " + user.password)
				next()
			});
		});
		

	}else{
		next()
	}
});


userSchema.methods.comparePassword = function(plainPassword, cb){
	bcrypt.compare(plainPassword, this.password, function(err, isMatch){
		if(err) return cb(err)
		cb(null,isMatch)
	})
}

userSchema.methods.generateToken = function(cb){
	var user = this;

	//err 해결 https://rat2.tistory.com/24
	//Error: Expected "payload" to be a plain object.
	//_user_id 는 12 byte binary BSON
	// jwt.sign(payload, secretOrPrivateKey, [options, callback])
	//payload는 버퍼나 스트링이여야 하므로 변환을 해야함
	//.toJSON() or .toHexString()
	var token = jwt.sign(user._id.toJSON() ,'secretToken');
	
	user.token = token
	user.save(function(err,user){
		if(err) return cb(err)
		return cb(null, user)
	})
}

userSchema.methods.findByToken = function(token, cb){
	var user = this;
	//토큰을 복호화

	jwt.verify(token, 'secretToken', function(err, decoded) {
		//유저 아이디를 이용해서 유저를 찾은 다음에
		//클라이언트에서가져온 token과 DB에 보관된 토큰이 일치하는지 확인
		user.findOne({"_id" : decoded, "token" : token },function(err,user){
			if(err) return cb(err)
			return cb(null,user)
		})
	  });
}



const User = mongoose.model('User',userSchema)

module.exports = { User }