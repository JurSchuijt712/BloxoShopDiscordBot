require('dotenv').config();
const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');

const TOKEN = 'MTM4Mzc2MzA1MDM4MDc4NzcxMg.GkU28u.jcY3g-mB0I6DNjjA7VT9He01Jgdov2pfBe8kSY'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`Bot is online as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (interaction.commandName === 'ban') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            await interaction.reply({ content: '❌ You do not have permission to ban members.', ephemeral: true });
            return;
        }

        const member = await interaction.guild.members.fetch(target.id).catch(() => null);
        if (!member) {
            await interaction.reply({ content: '❌ Could not find that user in this server.', ephemeral: true });
            return;
        }

        if (!member.bannable) {
            await interaction.reply({ content: '❌ I cannot ban this user (maybe they have a higher role?).', ephemeral: true });
            return;
        }

        try {
            await target.send(`You have been banned from **${interaction.guild.name}** by **${interaction.user.tag}**.\nReason: ${reason}`);
        } catch {
            console.log(`Could not send DM to ${target.tag}`);
        }

        await member.ban({ reason });

        await interaction.reply(`✅ **${target.tag}** has been banned.\nReason: ${reason}`);
    }

    else if (interaction.commandName === 'kick') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            await interaction.reply({ content: '❌ You do not have permission to kick members.', ephemeral: true });
            return;
        }

        const member = await interaction.guild.members.fetch(target.id).catch(() => null);
        if (!member) {
            await interaction.reply({ content: '❌ Could not find that user in this server.', ephemeral: true });
            return;
        }

        if (!member.kickable) {
            await interaction.reply({ content: '❌ I cannot kick this user (maybe they have a higher role?).', ephemeral: true });
            return;
        }

        try {
            await target.send(`You have been kicked from **${interaction.guild.name}** by **${interaction.user.tag}**.\nReason: ${reason}`);
        } catch {
            console.log(`Could not send DM to ${target.tag}`);
        }

        await member.kick(reason);

        await interaction.reply(`✅ **${target.tag}** has been kicked.\nReason: ${reason}`);
    }
});

client.login(TOKEN);
