const fs = require('fs');

var chat = fs.readFileSync(`${__dirname}/../data/data.chat`).toString();

chat = chat.replace(/<img/g, '');
fs.writeFileSync(`${__dirname}/../data/data.chat`, chat);
