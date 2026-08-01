const fetch = require('node-fetch');

async function dareCommand(sock, chatId, message) {
    try {
        const shizokeys = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`);
        
        if (!res.ok) {
            throw await res.text();
        }
        
        const json = await res.json();
        const dareMessage = json.result;

        // Send the dare message
        await sock.sendMessage(chatId, { text: dareMessage }, { quoted: message });
    } catch (error) {
        console.error('Error in dare command:', error);
        await sock.sendMessage(chatId, { text: '❌ 𝙁𝙖𝙞𝙡𝙚𝙙 𝙏𝙤 𝙂𝙚𝙩 𝘿𝙖𝙧𝙚.\n🔄 𝙋𝙡𝙚𝙖𝙨𝙚 𝙏𝙧𝙮 𝘼𝙜𝙖𝙞𝙣 𝙇𝙖𝙩𝙚𝙧. ✨\n\n╭────────────────────╮\n│ 𝘾𝙍𝙀𝘼𝙏𝙀 : ~• 𝗩 𝗜 𝗟 𝗟 𝗔 𝗜 𝗡 ༼༽\n╰────────────────────╯' }, { quoted: message });
    }
}

module.exports = { dareCommand };
