import { Client, GatewayIntentBits, Collection } from 'discord.js';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Discord Client with required Intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // REQUIRED: Must be enabled in Developer Portal
        GatewayIntentBits.GuildMembers,   // To get user and member info
        GatewayIntentBits.GuildPresences  // REQUIRED: Must be enabled in Developer Portal
    ]
});

// Load Commands Collection
client.commands = new Collection();

// Load the command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { default: command } = await import(filePath);
    if (command && command.name && command.execute) {
        client.commands.set(command.name, command);
        console.log(`Command loaded: ${command.name}`);
    } else {
        console.warn(`[WARNING] The command at ${filePath} is missing a required "name" or "execute" property.`);
    }
}

// Bot ready event
client.once('ready', () => {
    console.log(`🚀 Logged in as ${client.user.tag}!`);
    client.user.setActivity('for commands', { type: 3 }); // Activity: Watching for commands
});

// Message listener for command handling
client.on('messageCreate', async message => {
    // Ignore bot messages and messages without the prefix
    const prefix = '!'; // Define your bot's command prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Extract command and arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Find the command
    const command = client.commands.get(commandName) 
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        message.reply('There was an error trying to execute that command!');
    }
});

// Log in to Discord
// The token is read from the Replit environment (Secrets)
client.login(process.env.TOKEN);
