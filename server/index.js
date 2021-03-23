const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth} = require('./middleware/auth');
// EXPRESS 에 포함되어 다운되었기 때문에 사용 X 
// const bodyParser = require('body-Parser')
const app = express();
const { User } = require("./models/user");
var router = require('./router/main')(app);

const port = 5000

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify :false
}).then(() => console.log('MongoDB Connected ...'))
  .catch(err => console.log(err))  

//test




// app.get('/hello', (req, res) => {
//   res.send('Hello World! nodemon 적용 / test');
// })

//html 파일 위치 설정
app.set('views', __dirname + '/views');
// set the view engine to ejs
app.set('view engine', 'ejs');
//html 을 ejs 파일로 바꾸는 건가..?
app.engine('html', require('ejs').renderFile);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


// from express v4.16.0 include bodyparser
// req => json
app.use(express.json());
//application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());


	app.get('/api/test',(req,res)=>{
		res.send("안녕~ 응답했다~")
	})


	app.post('api/users/register',(req,res)=>{
	
	//client 로 통해 받은 데이터를 DB에 저장
	const user = new User(req.body);
	
	console.log(req.body.name);
	console.log(req.body.email);
	console.log(req.body.role);
	console.log(req.body.password);

  console.log(user.password);
	user.save((err,userInfo)=>{
		if(err) return res.json({success : false, err})
			return res.status(200).json({
				success : true
			})
	})

});

app.post('api/users/login',(req,res)=>{
	User.findOne({email : req.body.email},(err,user)=>{
		if(!user){
			return res.json({
				loginSuccess : "제공된 이메일에 해당하는 유저가 없습니다."
			})
		}

		user.comparePassword(req.body.password, (err, isMatch)=>{
			if(!isMatch)
				return res.json({
					loginSuccess : false, message : "비밀번호가 틀렸습니다."
				})

			user.generateToken((err,user)=>{
				if(err)return res.status(400).send(err);

				//토큰을 쿠키 혹은 로컬 스토리지에 저장
				//쿠키에 토큰 저장
				res.cookie("x_auth",user.token)
				.status(200)
				.json({loginSuccess : true , userId : user._id})



			})
		})
	})
})


//role 0 default 
//role 1 admin 
//role 
app.get('/api/users/auth',auth,(req,res)=>{
	req.status(200).json({
		_id : req.user._id,
		isAdmin : req.user.role === 1 ? true : false,
		isAuth : true,
		email : req.user.email,
		name : req.user.name,
		lastname : req.user.lastname ,
		role : req.user.role,
		image : req.user.image 
	})

})



app.get('/api/users/logout',auth,(req,res)=>{
	User.findOneAndUpdate({_id : req.user._id},
		{token : ""}, (err, user)=>{
			if(err) return res.json({
				success : false, err
			})
			return res.json({success : true})
		})

})
