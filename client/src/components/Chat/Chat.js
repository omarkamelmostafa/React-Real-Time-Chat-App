import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import { InfoBar } from "./../InfoBar/InfoBar";
import { Input } from "./../Input/Input";
import { Messages } from "./../Messages/Messages";
import { TextContainer } from "./../TextContainer/TextContainer";

import './Chat.css';

let socket;
export const Chat = ({ location }) => {
	const [name, setName] = useState('');
	const [room, setRoom] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState('');
	const ENDPOINT = 'localhost:5000';


	useEffect(() => {
		const { name, room } = queryString.parse(location.search);
		// console.log(name, room);
		setName(name);
		setRoom(room);

		socket = io(ENDPOINT);
		// console.log(socket);
		// socket.emit('join', { name, room }, ({ error }) => {
		// 	alert(error);
		// } );
		socket.emit('join', { name, room }, () => { });
		return () => {
			socket.emit('disconnect');
			socket.off();
		}
	}, [ENDPOINT, location.search])

	useEffect(() => {
		socket.on('message', message => {
			setMessages(messages => [...messages, message]);
		});

		socket.on("roomData", ({ users }) => {
			setUsers(users);
		});

	}, []);

	// functon for sending messages

	const sendMessage = (event) => {
		event.preventDefault();
		if (message) {
			socket.emit('sendMessage', message, () => setMessage(''));
		}
	};

	// console.log(message, messages);
	return (
		<div className='outerContainer'>
			<div className='container'>
				<InfoBar room={room} />
				<Messages messages={messages} name={name} />
				<Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
			</div>
			<TextContainer users={users} />
		</div>
	)
}
