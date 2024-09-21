import makeWASocket, { BufferJSON, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { printah } from './pesan.js';

async function connectToWhatsApp() {
   console.log("mulai");
   const { state, saveCreds } = await useMultiFileAuthState("auth");
   const sock = makeWASocket.default({
       printQRInTerminal: true,
       auth: state,

   });
   sock.ev.on("creds.update", saveCreds);
   sock.ev.on("connection.update", (update) => {
       const { connection, lastDisconnect } = update;
       if (connection === "close") {
           connectToWhatsApp().catch()
       } else if (connection === "open") {
           console.log("opened connection");
           console.clear()
       }
   });

   sock.ev.on("messages.upsert", async (m) => {
       const msg = m.messages[0];
       const id = msg.key.remoteJid
       var cmd = msg.message?.conversation
       const pesan = msg.key
       const messageType = Object.keys (msg.message)[0]
       if (cmd.length !== 0 && m.type === "notify") {
           console.log(`\n ID = ${id}\n Nama = ${msg.pushName}\n Pesan = ${cmd}`)
           await printah(sock, id, cmd, pesan, msg, 'a')
       }
       else if ( messageType ==='imageMessage' && m.type === "notify") {
           console.log(`\n ID = ${id}\n Nama = ${msg.pushName}\n Pesan = Gambar`)
           await printah(sock, id, cmd, pesan, msg, messageType)
       }
       else if (messageType === 'extendedTextMessage' && m.type === "notify") {
           cmd = msg.message.extendedTextMessage.text
           console.log(`\n ID = ${id}\n Nama = ${msg.pushName}\n Pesan = ${cmd}`)
           await printah(sock, id, cmd, pesan, msg, 'a')
       }
   });
}
try{connectToWhatsApp()}
catch{}