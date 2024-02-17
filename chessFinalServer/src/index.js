// const http = require('http');
// const socketio = require('socket.io');
// const express = require('express');
// const cors=require('cors')
// const { addPlayer, game, removePlayer } = require('./game');
// const app = express();
// const server = http.createServer(app);
// const PORT = 5000;
// const io = socketio(server);
// const monitorio = require('monitor.io');

// io.use(monitorio({port:8000}))

// io.on('connection', (socket) => {
// 	socket.on('join', ({ name, gameID }, callback) => {
// 		const { error, player, opponent } = addPlayer({
// 			name,
// 			playerID: socket.id,
// 			gameID,
// 		});
// 		if (error) {
// 			return callback({ error });
// 		}
// 		socket.join(gameID);
// 		callback({ color: player.color });
// 		console.log("Player joined a game")

// 		//send welcome message to player1, and also send the opponent player's data
// 		socket.emit('welcome', {
// 			message: `Hello ${player.name}, Welcome to the game`,
// 			opponent,
// 		});

// 		// Tell player2 that player1 has joined the game.
// 		socket.broadcast.to(player.gameID).emit('opponentJoin', {
// 			message: `${player.name} has joined the game. `,
// 			opponent: player,
// 		});

// 		if (game(gameID).length >= 2) {
// 			const white = game(gameID).find((player) => player.color === 'w');
// 			io.to(gameID).emit('message', {
// 				message: `Let's start the game. White (${white.name}) goes first`,
// 			});
// 		}
// 	});

// 	socket.on('move', ({ from, to, gameID }) => {
// 		socket.broadcast.to(gameID).emit('opponentMove', { from, to });
// 	});

// 	socket.on('disconnect', () => {
// 		const player = removePlayer(socket.id);

// 		if (player) {
// 			io.to(player.game).emit('message', {
// 				message: `${player.name} has left the game.`,
// 			});
// 			socket.broadcast.to(player.game).emit('opponentLeft');
// 			console.log(`${player.name} has left the game ${player.gameID}`);
// 		}
// 	});
// });

// server.listen(PORT, () => console.log('Server running on localhost: ' + PORT));



const express=require('express')
const {createServer}=require('node:http')
const app=express();
const {join}=require('node:path');
const {Server}=require('socket.io');

const cors=require('cors')
app.use(cors())


const server=createServer(app);

const io= new Server(server,{
	cors:{
		origin:'*'
	}
});




const { addPlayer, game, removePlayer } = require('./game')
app.get('/',(req,res)=>{
	res.sendFile(join(__dirname,'index.html'));
})

io.on('connection', (socket) => {
	socket.on('join', ({ name, gameID }, callback) => {
		const { error, player, opponent } = addPlayer({
			name,
			playerID: socket.id,
			gameID,
		});
		if (error) {
			return callback({ error });
		}
		socket.join(gameID);
		callback({ color: player.color });

		//send welcome message to player1, and also send the opponent player's data
		socket.emit('welcome', {
			message: `Hello ${player.name}, Welcome to the game`,
			opponent,
		});

		// Tell player2 that player1 has joined the game.
		socket.broadcast.to(player.gameID).emit('opponentJoin', {
			message: `${player.name} has joined the game. `,
			opponent: player,
		});

		if (game(gameID).length >= 2) {
			const white = game(gameID).find((player) => player.color === 'w');
			io.to(gameID).emit('message', {
				message: `Let's start the game. White (${white.name}) goes first`,
			});
		}
	});

	socket.on('move', ({ from, to, gameID }) => {
		socket.broadcast.to(gameID).emit('opponentMove', { from, to });
	});

	socket.on('disconnect', () => {
		const player = removePlayer(socket.id);

		if (player) {
			io.to(player.game).emit('message', {
				message: `${player.name} has left the game.`,
			});
			socket.broadcast.to(player.game).emit('opponentLeft');
			console.log(`${player.name} has left the game ${player.gameID}`);
		}
	});
});

server.listen(3000,()=>{
	console.log("listening on port 3000");
})



