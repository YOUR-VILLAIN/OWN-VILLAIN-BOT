const fs = require('fs');
const path = require('path');
const os = require('os');
const isOwnerOrSudo = require('../lib/isOwner');

const channelInfo = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363408526596775@newsletter',
            newsletterName: '~• 𝗩 𝗜 𝗟 𝗟 𝗔 𝗜 𝗡 ༼༽',
            serverMessageId: -1
        }
    }
};

async function clearSessionCommand(sock, chatId, msg) {
    try {
        const senderId = msg.key.participant || msg.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        if (!msg.key.fromMe && !isOwner) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command can only be used by the owner!',
                ...channelInfo
            });
            return;
        }

        // Define session directory
        const sessionDir = path.join(__dirname, '../session');

        if (!fs.existsSync(sessionDir)) {
            await sock.sendMessage(chatId, { 
                text: '❌ Session directory not found!',
                ...channelInfo
            });
            return;
        }

        let filesCleared = 0;
        let errors = 0;
        let errorDetails = [];

        // Send initial status
        await sock.sendMessage(chatId, { 
            text: `🔍 𝙊𝙥𝙩𝙞𝙢𝙞𝙯𝙞𝙣𝙜 𝙎𝙚𝙨𝙨𝙞𝙤𝙣 𝙁𝙞𝙡𝙚𝙨 𝙁𝙤𝙧 𝘽𝙚𝙩𝙩𝙚𝙧 𝙋𝙚𝙧𝙛𝙤𝙧𝙢𝙖𝙣𝙘𝙚...\n⚡ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙒𝙖𝙞𝙩 𝙒𝙝𝙞𝙡𝙚 𝙏𝙝𝙚 𝙋𝙧𝙤𝙘𝙚𝙨𝙨 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙚𝙨. ✨\n\n╭────────────────────╮\n│ 𝘾𝙍𝙀𝘼𝙏𝙀 : ~• 𝗩 𝗜 𝗟 𝗟 𝗔 𝗜 𝗡 ༼༽\n╰────────────────────╯`,
            ...channelInfo
        });

        const files = fs.readdirSync(sessionDir);
        
        // Count files by type for optimization
        let appStateSyncCount = 0;
        let preKeyCount = 0;

        for (const file of files) {
            if (file.startsWith('app-state-sync-')) appStateSyncCount++;
            if (file.startsWith('pre-key-')) preKeyCount++;
        }

        // Delete files
        for (const file of files) {
            if (file === 'creds.json') {
                // Skip creds.json file
                continue;
            }
            try {
                const filePath = path.join(sessionDir, file);
                fs.unlinkSync(filePath);
                filesCleared++;
            } catch (error) {
                errors++;
                errorDetails.push(`Failed to delete ${file}: ${error.message}`);
            }
        }

        // Send completion message
        const message = `✅ Session files cleared successfully!\n\n` +
                       `📊 Statistics:\n` +
                       `• Total files cleared: ${filesCleared}\n` +
                       `• App state sync files: ${appStateSyncCount}\n` +
                       `• Pre-key files: ${preKeyCount}\n` +
                       (errors > 0 ? `\n⚠️ Errors encountered: ${errors}\n${errorDetails.join('\n')}` : '');

        await sock.sendMessage(chatId, { 
            text: message,
            ...channelInfo
        });

    } catch (error) {
        console.error('Error in clearsession command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Failed to clear session files!',
            ...channelInfo
        });
    }
}

module.exports = clearSessionCommand; 