import React, { useState, useRef, useEffect, useContext } from 'react';
import {Chess} from 'chess.js';
import { createBoard } from '../../functions';
import Board from '../../components/board';
import { GameContext } from '../../context/GameContext';
import {
    setMessage,
    setOpponent,
    setOpponentMoves,
    setPlayer,
    setPlayerColor,
    types,
} from '../../context/actions';
import GameOver from '../../components/gameover';
import { getGameoverState } from '../../functions';
import io from 'socket.io-client';

import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import Player from '../../components/player';
import Toast from '../../components/snackbar';

const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';


// checkmate
// const FEN = 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3';
const socket = io('localhost:3000');
const Game = () => {
	const location = useLocation();
	const history = useNavigate();
	const playerName = useRef();
	const gameID = useRef();
	const {
        dispatch,
        gameOver,
        playerName: player,
        opponentName,
        playerColor,
		turn
    } = useContext(GameContext);

useEffect(() => {
    const { id, name } = queryString.parse(location.search);
    playerName.current = name;
    gameID.current = id;
}, [location.search]);



	const [fen, setFen] = useState(FEN);
	const { current: chess } = useRef(new Chess(fen));
	const [board, setBoard] = useState(createBoard(fen));

	useEffect(() => {
		setBoard(createBoard(fen));
	}, [fen]);

	useEffect(() => {
		dispatch({
			type: types.SET_TURN, //import types from '../../context/actions'
			player: chess.turn(),
			check: chess.inCheck(),
		});
	}, [fen, dispatch, chess]);
	useEffect(() => {
		socket.emit(
			'join',
			{ name: playerName.current, gameID: gameID.current },
			({ error, color }) => {
				if (error) {
					history('/');
				}
				dispatch(setPlayer(playerName.current));
				dispatch(setPlayerColor(color));
			}
		);
		socket.on('welcome', ({ message, opponent }) => {
			dispatch(setMessage(message));
			dispatch(setOpponent(opponent));
		});
		socket.on('opponentJoin', ({ message, opponent }) => {
			dispatch(setMessage(message));
			dispatch(setOpponent(opponent));
		});
		socket.on('opponentMove', ({ from, to }) => {
			chess.move({ from, to });
			setFen(chess.fen());
			dispatch(setMessage('Your Turn'));
			dispatch(setOpponentMoves([from, to]));
		});
		socket.on('message', ({ message }) => {
			dispatch(setMessage(message));
		});
	}, [chess, history, dispatch]);
	const fromPos = useRef();
	const makeMove = (pos) => {
		if (playerColor !== chess.turn()) {
			return;
		}
		const from = fromPos.current;
		let move = { from, to: pos };
		
		const isPromotion = chess.get(from).type === 'p' && (
			(playerColor === 'w' && pos[1] === '8') ||
			(playerColor === 'b' && pos[1] === '1')
		);
		
		if (isPromotion) {
			
			move.promotion = 'q'; 
		}
		
		chess.move(move);
		dispatch({ type: types.CLEAR_POSSIBLE_MOVES });
		setFen(chess.fen());
		socket.emit('move', { gameID: gameID.current, ...move });
	}
	

	const setFromPos = (pos) => {
    if(playerColor!=chess.turn()){
      return;
    }
    fromPos.current = pos;
		dispatch({
			type: types.SET_POSSIBLE_MOVES,
			moves: chess.moves({ square: pos }),
		});
		console.log(chess.moves({square:pos}))
	};
    // The rest of the code is the same
    if (gameOver) {
        return <GameOver />; //import GameOver from '../../components/gameover';
    }
	return (
		<div className="game">
		<Player name={player} color={playerColor} player />
		<Player name={opponentName} color={playerColor === 'w' ? 'b' : 'w'} />
	
		<Board cells={board} makeMove={makeMove} setFromPos={setFromPos} />
		<Toast></Toast>
	</div>
	);
};

export default Game;
