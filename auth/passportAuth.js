module.exports=function(passport,FacebookStrategy,mongoose,config){
	
	var chatUserschema=new mongoose.Schema({
		fullName:String,		
		profilePic:String,
		userID:String
	})

	var chatUserModel=mongoose.model('chatusers',chatUserschema)

	passport.serializeUser(function(user,done){
		done(null,user.id)
	})

	passport.deserializeUser(function(id,done){
		chatUserModel.findById(id,function(error,user){
			done(null,user)
		})
	})

	passport.use(new FacebookStrategy({
		clientID:config.fb.appID,
		clientSecret:config.fb.appSecret,
		callbackURL:config.fb.callbackURL,
		profileFields:['id','displayName','photos']
	},function(accessToken,refreshToken,profile,done){
		chatUserModel.findOne({'userID':profile.id},function(error,result){
			if (result){
				done(null,result)
			}else{
				var newChatUser=new chatUserModel({
					fullName:profile.displayName,
					userID:profile.id,
					profilePic:profile.photos[0].value || ''
				})

				newChatUser.save(function(error){
					done(null,newChatUser)
				})
			}
		})
	}))
}