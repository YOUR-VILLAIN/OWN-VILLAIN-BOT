const axios = require('axios');
const { channelInfo } = require('../lib/messageConfig');

async function characterCommand(sock, chatId, message) {
    let userToAnalyze;
    
    // Check for mentioned users
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        userToAnalyze = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    // Check for replied message
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToAnalyze = message.message.extendedTextMessage.contextInfo.participant;
    }
    
    if (!userToAnalyze) {
        await sock.sendMessage(chatId, { 
            text: 'Please mention someone or reply to their message to analyze their character!', 
            ...channelInfo 
        });
        return;
    }

    try {
        // Get user's profile picture
        let profilePic;
        try {
            profilePic = await sock.profilePictureUrl(userToAnalyze, 'image');
        } catch {
            profilePic = 'https://i.ibb.co/yn9kbkJs/file-00000000506081fb897c0be0c61eac56.png'; // Default image if no profile pic
        }

        const traits = [
            "Intelligent", "Creative", "Determined", "Ambitious", "Caring",
            "Charismatic", "Confident", "Empathetic", "Energetic", "Friendly",
            "Generous", "Honest", "Humorous", "Imaginative", "Independent",
            "Intuitive", "Kind", "Logical", "Loyal", "Optimistic",
            "Passionate", "Patient", "Persistent", "Reliable", "Resourceful",
            "Sincere", "Thoughtful", "Understanding", "Versatile", "Wise"
        ];

        // Get 3-5 random traits
        const numTraits = Math.floor(Math.random() * 3) + 3; // Random number between 3 and 5
        const selectedTraits = [];
        for (let i = 0; i < numTraits; i++) {
            const randomTrait = traits[Math.floor(Math.random() * traits.length)];
            if (!selectedTraits.includes(randomTrait)) {
                selectedTraits.push(randomTrait);
            }
        }

        // Calculate random percentages for each trait
        const traitPercentages = selectedTraits.map(trait => {
            const percentage = Math.floor(Math.random() * 41) + 60; // Random number between 60-100
            return `${trait}: ${percentage}%`;
        });

        // Create character analysis message
        const analysis = `🔮 *𝘾𝙃𝘼𝙍𝘼𝘾𝙏𝙀𝙍 𝘼𝙉𝘼𝙇𝙔𝙎𝙄𝙎* 🔮\n\n👤 *𝙐𝙎𝙀𝙍 :* ${userToAnalyze.split('@')[0]}\n\n✨ *𝙆𝙀𝙔 𝙏𝙍𝘼𝙄𝙏𝙎 :*\n${traitPercentages.join('\n')}\n\n🎯 *𝙊𝙑𝙀𝙍𝘼𝙇𝙇 𝙍𝘼𝙏𝙄𝙉𝙂 :* ${Math.floor(Math.random() * 21) + 80}%\n\n⚠️ *𝙉𝙊𝙏𝙀 :* 𝙏𝙝𝙞𝙨 𝙄𝙨 𝘼 𝙁𝙪𝙣 𝘼𝙣𝙖𝙡𝙮𝙨𝙞𝙨 𝘼𝙣𝙙 𝙎𝙝𝙤𝙪𝙡𝙙 𝙉𝙤𝙩 𝘽𝙚 𝙏𝙖𝙠𝙚𝙣 𝙎𝙚𝙧𝙞𝙤𝙪𝙨𝙡𝙮. ✨\n\n╭────────────────────╮\n│ 𝘾𝙍𝙀𝘼𝙏𝙀 : ~• 𝗩 𝗜 𝗟 𝗟 𝗔 𝗜 𝗡 ༼༽\n╰────────────────────╯`;

        // Send the analysis with the user's profile picture
        await sock.sendMessage(chatId, {
            image: { url: profilePic },
            caption: analysis,
            mentions: [userToAnalyze],
            ...channelInfo
        });

    } catch (error) {
        console.error('Error in character command:', error);
        await sock.sendMessage(chatId, { 
            text: 'Failed to analyze character! Try again later.',
            ...channelInfo 
        });
    }
}

module.exports = characterCommand; 