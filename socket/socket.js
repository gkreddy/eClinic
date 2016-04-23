module.exports=function(io,rooms){
	var chatrooms=io.of('roomlist').on('connection',function(socket){
		console.log('socket.io roomlist listening on server')
		socket.emit('updateroom',JSON.stringify(rooms))
		socket.on('newroom',function(data){
			rooms.push(data)
			socket.broadcast.emit('updateroom',JSON.stringify(rooms))
			socket.emit('updateroom',JSON.stringify(rooms))
		})
	})

	var messages=io.of('/messages').on('connection',function(socket){
		console.log('socket is connected on server messages')
		socket.on('joinroom',function(data){
			socket.userName=data.userName
			socket.userPic=data.userPic
			socket.join(data.room_number)
			updateUserList(data.room_number,true)
		})
		socket.on('newmessage',function(data){
			socket.broadcast.to(data.room_number).emit('newmessagefeed',JSON.stringify(data))
		})

		function updateUserList(room,updateAll){

			var users=get_users_by_room('/messages', room)
			var userList=[]
			for (var i=0;i<users.length;i++){
				userList.push({userName:users[i].userName,userPic:users[i].userPic})
			}

			
			//socket.to(room).emit('updateUsersList',JSON.stringify(userList))
			socket.emit('updateUsersList',JSON.stringify(userList))
			//io.socket.to(room).emit('updateUsersList',JSON.stringify(userList))
			//io.of('/messages').to('room').emit('updateUsersList',JSON.stringify(userList))
			if (updateAll){
				socket.broadcast.to(room).emit('updateUsersList',JSON.stringify(userList))
			}
		}


		function get_users_by_room(nsp, room) {
		  var users = []
		  for (var id in io.of(nsp).adapter.rooms[room]) {
		    users.push(io.of(nsp).adapter.nsp.connected[id]);
		  };
		  return users;
		};

		socket.on('updateList',function(data){
			updateUserList(data.room_number,false)
		})
	})


}