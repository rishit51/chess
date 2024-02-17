// import React, { useRef } from 'react';
// import PropTypes from 'prop-types';

// import './piece-styles.css';

// const Piece = ({ name, pos,setFromPos }) => {
// 	const color = name === name.toUpperCase() ? 'b' : 'w';
// 	const imageName = color + name.toUpperCase();
// 	const element=useRef();
// 	const handleDragStart=()=>{
// 		setFromPos(pos);
// 		setTimeout(()=>{
// 				element.current.style.display="none";

// 		},0);
// 	}

// 	const handleDragEnd=()=>{
// 		element.current.style="block"
// 	}
	

// 	let image;

// 	try {
// 		image = `../../assets/pieces/${imageName}.png`;
// 	} catch (error) {
// 		image = '';
// 	}

// 	return (
// 		<div
// 			className="piece"
// 			style={{
// 				background: `url(${image}) center center/cover`,
// 			}}
// 			draggable={true}
// 			onDragStart={handleDragStart}
// 			onDrag={handleDragEnd}
// 		/>
// 	);
// };

// Piece.prototype = {
// 	name: PropTypes.string.isRequired,
// 	pos: PropTypes.string.isRequired,
// };
// export default Piece;


import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import './piece-styles.css';

const Piece = ({ name, pos, setFromPos }) => {
	const color = name === name.toUpperCase() ? 'w' : 'b';
	const imageName = color + name.toUpperCase();
	const element = useRef();

	let image;

	try {
		image = `/assets/pieces/${imageName}.png`;
	} catch (error) {
		image = '';
	}

	const handleDragStart = () => {
		setFromPos(pos);
		console.log(pos);
		setTimeout(() => {
			element.current.style.display = 'none';
		}, 0);
	};
	const handleDragEnd = () => {
		element.current.style.display = 'block';
	};
	return (
		<div
			className="piece"
			style={{
				background: `url(${image}) center center/cover`,
			}}
			draggable={true}
			ref={element}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		
		/>
	);
};

Piece.prototype = {
	name: PropTypes.string.isRequired,
	pos: PropTypes.string.isRequired,
	setFromPos: PropTypes.func.isRequired,
};
export default Piece;
