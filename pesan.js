import { Sticker, createSticker, StickerTypes } from 'wa-sticker-formatter'
import fs from 'fs'
import ytdl from 'ytdl-core'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
const sleep = ms => new Promise(res => setTimeout(res, ms));

export async function printah(sock, id, cmd, pesan, msg, messageType) {
    
    const reactionMessage = {
    react: {
        text: "🤔", 
        key: pesan
    	}
	}
    
    let message = cmd;
    let text = message.split(" ");
    let tanya = text.splice(1);
    let pertanyaan = tanya.join(" ")
    let keyword = text[0];
    if (keyword === "!tanya") {
        await sleep(100);
        await sock.sendMessage(id, reactionMessage);
        await sleep(100);
        fetch('https://whatsapp-bard-ai.vercel.app/bot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tanya: pertanyaan })
        })
        .then(response => response.text())
        .then(data => {
            sock.sendMessage(id, { text: data });
        });
    }
    else if (keyword === "!musik") {
        let info = await ytdl.getInfo(pertanyaan);
        let format = ytdl.chooseFormat(info.formats, { quality: '140', filter: 'audioonly' });
        if (format.contentLength <= 5000000 ){
            ytdl(pertanyaan,{ quality: '140' }).pipe(fs.createWriteStream('audio.mp3'))
            await sleep(100)
            await sock.sendMessage(id, { text: 'tunggu 2 menit'})
            await sleep(120000)
            await sock.sendMessage(id, { audio: { url: "./audio.mp3" }, mimetype: 'audio/mp4' })
        }
        else{
            await sleep(100)
            await sock.sendMessage(id, { text:'format kepanjangann'})
        }
    }
    else if (cmd === "!rafkylist") {
        await sleep(1000);
        await sock.sendMessage(id, { text: "List Menu (masi dikit)\n1. rafkytanya\n2. rafkylist\n3. rafkymusik\njangan lupa pakai prefix (!)" });
    }
    else if (messageType === 'imageMessage') {
        if (msg.message.imageMessage.caption === "!sticker") {
            let media = await downloadMediaMessage(msg,'buffer',{ })
            let sticker = new Sticker(media, {
                pack: "gtw malazz", // The pack name
                author: 'mencoba bermanfaat', // The author name
                type: StickerTypes.CROPPED,
                categories: ["🤩", "🎉"], // The sticker category
                id: "12345", // The sticker id
                quality: 5, // The quality of the output file
            });
            const buffer = await sticker.toBuffer();
            await sleep(100)
            await sock.sendMessage(id,{sticker: buffer})
        }
    }
}