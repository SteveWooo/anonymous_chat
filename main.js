const express = require('express');
const fs = require('fs');
const Moment = require('moment');

async function init(){
	var swc = {
		Config : {
			path : {
				data : `data/data.chat`,
				log : `logs/log.log`
			},
			server : {
				port : 80
			}
		},
		app : express(),
		utils : {
			getClientIp : async function(swc, req) {
			    var ip = req.headers['x-forwarded-for'] ||
			        req.ip ||
			        req.connection.remoteAddress ||
			        req.socket.remoteAddress ||
			        req.connection.socket.remoteAddress || '';
			    if(ip.split(',').length>0){
			        ip = ip.split(',')[0]
			    }
			    ip = ip.substr(ip.lastIndexOf(':')+1,ip.length);
			    return ip;
			}
		}
	}

	if(!fs.existsSync(`${__dirname}/${swc.Config.path.data}`)){
		fs.writeFileSync(`${__dirname}/${swc.Config.path.data}`, '');
	}
	if(!fs.existsSync(`${__dirname}/${swc.Config.path.log}`)){
		fs.writeFileSync(`${__dirname}/${swc.Config.path.log}`, '');
	}


	return swc;
}

async function serverInit(swc){
	swc.app.use('/public', express.static('public'));
	swc.app.get('/api/get_list', async function(req, res, next){
		req.swc = swc;
		next();
	}, async function(req, res) {
		var swc = req.swc;
		var data = fs.readFileSync(`${__dirname}/${swc.Config.path.data}`).toString();
		data = data.split('\n');
		var result = [];

		for(var i=0;i<200;i++) {
			if(data[i] == undefined) {
				break;
			}
			result.push(data[i] + "<br />");
		}
		res.send(result.join(''));
	})

	swc.app.get('/api/submit', async function(req, res, next){
		req.swc = swc;
		next();
	}, async function(req, res) {
		var swc = req.swc;
		var data = req.query.data;
		var nick = req.query.nick;
		var ip = await swc.utils.getClientIp(swc, req);
		if(!nick) {
			nick = 'anonymous';
		}
		file = fs.readFileSync(`${__dirname}/${swc.Config.path.data}`).toString().split('\n');

		var now = Moment().format('lll');

		/**
		* 拼接
		*/
		var string = `(${now}) <font style="color:red">${nick}</font> : ${data}`;
		file.unshift(string);
		fs.writeFileSync(`${__dirname}/${swc.Config.path.data}`, file.join('\n'));
		res.send('ok');

		/**
		* 日志记录
		*/
		var log = `time=${now}\`ip=${ip}\`nick=${nick.replace(/\`/g, '')}\`data=${data.replace(/\`/g, '')}\`\n`;
		fs.appendFileSync(`${__dirname}/${swc.Config.path.log}`, log);
	})
}

async function main(){
	var swc = await init();
	await serverInit(swc, {});
	swc.app.listen(swc.Config.server.port, function(){
		console.log(`listened at : ${swc.Config.server.port}`);
	});
}
main();