const express = require('express')
const config = require('./config/key')
// EXPRESS 에 포함되어 다운되었기 때문에 사용 X 
// const bodyParser = require('body-Parser')
const app = express()
const { User } = require("./models/user");
var router = require('./router/main')(app);

const port = 3000

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



	app.post('/register',(req,res)=>{
	
	//client 로 통해 받은 데이터를 DB에 저장
	const user = new User(req.body);
	
	console.log(req.body.name);
	console.log(req.body.email);
	console.log(req.body.role);
	console.log(req.body.password);
	user.save((err,userInfo)=>{
		if(err) return res.json({success : false, err})
			return res.status(200).json({
				success : true
			})
	})

})
