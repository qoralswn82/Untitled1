const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
		next()

	}
});

const User = mongoose.model('User',userSchema)

module.exports = { User }