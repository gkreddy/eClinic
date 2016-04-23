var express=require('express'),
	app=express(),
	path=require('path'),
	session=require('express-session'),
	config=require('./config/config.js')
	ConnectMongo=require('connect-mongo')(session),
	mongoose=require('mongoose').connect(config.dbURL),
	passport=require('passport'),
	FacebookStrategy=require('passport-facebook').Strategy,
	rooms=[]

app.set('views',path.join(__dirname,'views'))
app.engine('html',require('hogan-express'))
app.set('view engine','html')
app.use(express.static(path.join(__dirname,'public')))

var env=process.env.NODE_ENV || 'development'

if (env==='development'){
	app.use(session({secret:config.sessionSecret,resave:true,saveUninitialized:true}))
}else{
	app.use(session({
		secret:config.sessionSecret,
		resave:true,
		saveUninitialized:true,
		store:new ConnectMongo({
			mongooseConnection:mongoose.connections[0],
			stringify:true
		})
	}))
}

app.use(passport.initialize())
app.use(passport.session())


require('./auth/passportAuth.js')(passport,FacebookStrategy,mongoose,config)
require('./routes/routes.js')(express,app,passport,config,rooms)

// app.listen(3000,function(){
// 	console.log(env)
// 	console.log('express is running')
// })
app.set('port',process.env.PORT || 3000)
var server=require('http').createServer(app)
var io=require('socket.io')(server)
require('./socket/socket.js')(io,rooms)

server.listen(app.get('port'),function(){
	console.log(env)
	console.log('socket.io is listening on port' + app.get('port'))
})