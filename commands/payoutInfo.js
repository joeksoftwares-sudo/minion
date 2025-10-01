
import { readData } from '../utils/dataHandler.js';

export default {
    name: 'payouts',
    description: 'Displays the number of recorded payouts for a user.',
    aliases: ['p', 'checkpayouts'],
    
    /**
     * @param {import('discord.js').Message} message 
     * @param {string[]} args 
     */
    async execute(message, args) {
        // Target the user mentioned or the message author
        const targetUser = message.mentions.users.first() || message.author;
        const targetMember = message.guild.members.cache.get(targetUser.id);
        
        if (!targetMember) {
            return message.reply("Could not find that user in the server.");
        }

        const data = readData();
        const userId = targetUser.id;
        const username = targetMember.displayName;

        // Get the payout count for the user
        const payoutCount = data[userId] ? data[userId].count : 0;
        
        // Respond with the information
        if (payoutCount > 0) {
            message.channel.send(`**${username}** has a total of **${payoutCount}** recorded payouts.`);
        } else {
            message.channel.send(`**${username}** has no recorded payouts yet.`);
        }
    },
};
