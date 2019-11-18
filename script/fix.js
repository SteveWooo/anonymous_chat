const fs = require('fs');
var chat = fs.readFileSync(`${__dirname}/../data/data.chat`).toString();

chat = chat.replace(/\/span font style="color:red"/g, '');
chat = chat.replace(/span/g, '');
chat = chat.replace(/\/font/g, '');

fs.writeFileSync(`${__dirname}/../data/data.chat`, chat);