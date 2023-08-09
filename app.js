const { Client, NoAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new NoAuth()
});
 
 client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

const prefix = "!";
const sleep = ms => new Promise(res => setTimeout(res, ms));

client.on('message', async msg => {
    if (msg.body[0] === prefix) {
        const [cmd, ...args] = msg.body.slice(1).split(" ");
        const argsText = args.join(" ");

        if (cmd === "rafkymenu") {
            client.sendMessage(msg.from, "List Menu (masi dikit)\n1. rafkyhalo\n2. rafkysticker\n3. rafkymenu\n4. rafkytanya\njangan lupa pakai prefix (!)");
        }
        if (cmd === "rafkyhalo") {
            client.sendMessage(msg.from, "botnya online kok");
        }
        if (cmd === "rafkysticker") {
            const attachmentData = await msg.downloadMedia();
            client.sendMessage(msg.from, attachmentData, { sendMediaAsSticker: true });
        }
		if (cmd === "sticker") {
            const attachmentData = await msg.downloadMedia();
            client.sendMessage(msg.from, attachmentData, { sendMediaAsSticker: true });
        }
		if (cmd === "rafkytanya") {
			client.sendMessage(msg.from, "tunggu bentar yaa!");
			let number = msg.body.split(' ')[1];
			let messageIndex = msg.body.indexOf(number);
			let yangDitanya = msg.body.slice(messageIndex, msg.body.length);
			await sleep(2000);
			fetch('https://whatsapp-bard-ai.vercel.app/bot?tanya='+yangDitanya)
				.then(response => response.text())
				.then(data => {
				client.sendMessage(msg.from,data);
				})
				
				.catch(error => {
				console.error('Error:', error);
				});
		}
	}
});

client.initialize();