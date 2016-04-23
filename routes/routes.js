module.exports=function(express,app,passport,config,rooms){
	var router=express.Router()
	app.use('/',router)

	router.get('/',function(req,res,next){
		res.render('index',{title:'Welcome to ChatCat'})
	})

	router.get('/logout',function(req,res,next){
		req.logout()
		res.redirect('/')
	})

	router.get('/chatrooms',securePages,function(req,res,next){
		res.render('chatrooms',{title:'ChatCat - Chat Rooms',user:req.user,config:config})
	})

	router.get('/room/:id',securePages,function(req,res,next){
		var room_name=getRoomName(req.params.id)
		
		res.render('room',{title:'ChatCat - Chat Rooms',user:req.user,config:config,room_number:req.params.id,room_name:room_name})
	})

	router.get('/auth/facebook',passport.authenticate('facebook'))

	router.get('/auth/facebook/callback',passport.authenticate('facebook',{
		successRedirect:'/chatrooms',
		failureRedirect:'/'
	}))	
	
	function securePages(req,res,next){
		if (req.isAuthenticated()){
			next()
		}else{
			res.redirect('/')
		}
	}

	function getRoomName(id){
		var n=0
		while (n<rooms.length){
			if (rooms[n].room_number==id){
				return (rooms[n].room_name)
			}else{
				n++
				continue
			}
		}
	}
	
}