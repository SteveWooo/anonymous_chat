const fs = require('fs');

setInterval(function(){
	var chat = fs.readFileSync(`${__dirname}/../data/data.chat`).toString();
	chat = chat.replace(/<img/g, '');
	chat = chat.replace(/<script/g, '');
	fs.writeFileSync(`${__dirname}/../data/data.chat`, chat);
	console.log(`${new Date()} clean`);
}, 5000);