var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', function(req,res){
	// res.send('hello world !');
	res.sendFile(__dirname+'/index.html');
});

io.on('connection',function(socket){	//listen on the Connection event for incoming sockets

	socket.emit('message', 'You are connected')
	socket.broadcast.emit('message', 'New connected client.')
	
	socket.on('chat message', function(msg){

		var avatar = ''
		var nickname = socket.newbie
		if(typeof(nickname)=='undefined' || nickname==null){
			nickname = 'Someone'
		}
		nickname = nickname.toLowerCase()
		
		if(nickname.search(/mi(b|c)/i)!=-1){
			avatar = 'http://icons.iconarchive.com/icons/hopstarter/face-avatars/64/Female-Face-FC-4-icon.png';
		}else{
			avatar = 'http://icons.iconarchive.com/icons/hopstarter/face-avatars/64/Male-Face-F4-icon.png';
		}
		
		nickname = nickname.charAt(0).toUpperCase()+nickname.slice(1)
		
		io.emit('chat message', '<img style="width:20px;margin-right:10px;" src="'+avatar+'"/>' + nickname + ': <span style="color:red;">'+msg+'</span>');
	})
	
	socket.on('message', function(msg){
		console.log('poke du client '+socket.newbie+' > '+msg)
	})

	socket.on('newbie', function(nickname){
		console.log('register newbie > '+nickname)
		socket.newbie = nickname;
	})

	socket.on('user typing', function(){
		console.log(socket.newbie+' is typing...')
		io.emit('user typing', socket.newbie + ' is typing....')
	})
	
	socket.on('disconnect',function(){
		console.log('user disconnected')
	})
})

http.listen(3000, function(){
	console.log('listening on *:3000')
})
