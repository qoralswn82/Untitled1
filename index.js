const express = require('express')
const config = require('./config/key')
// EXPRESS 에 포함되어 다운되었기 때문에 사용 X 
// const bodyParser = require('body-Parser')
const app = express()
const { User } = require("./models/user");
const port = 3000

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify :false
}).then(() => console.log('MongoDB Connected ...'))
  .catch(err => console.log(err))  

//test



app.get('/hello', (req, res) => {
  res.send('Hello World! nodemon 적용 / test')
})

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
	
	
	user.save((err,userInfo)=>{
		if(err) return res.json({success : false, err})
			return res.status(200).json({
				success : true
			})
	})

})
