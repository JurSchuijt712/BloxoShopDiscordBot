const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const TOKEN = 'MTM4Mzc2MzA1MDM4MDc4NzcxMg.GPVf0K.x1Zgarmj2GI8lwh-Ucsmgn2_iza-Tc5-9U6CAE'; // Replace with your (regenerated!) bot token

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (interaction.commandName === 'ban') {
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: '❌ That user is not in the server.', ephemeral: true });
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: '❌ You do not have permission to ban members.', ephemeral: true });
        }

        try {
            await targetUser.send(`🚫 You have been **banned** from **${interaction.guild.name}**.\nReason: ${reason}\nBy: ${interaction.user.tag}\nServer: https://discord.gg/mRtPGTjq59`);
        } catch {
            console.log(`Could not send DM to ${targetUser.tag}`);
        }

        await member.ban({ reason });
        await interaction.reply(`✅ ${targetUser.tag} has been banned.`);
    }

    if (interaction.commandName === 'kick') {
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: '❌ That user is not in the server.', ephemeral: true });
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: '❌ You do not have permission to kick members.', ephemeral: true });
        }

        try {
            await targetUser.send(`👢 You have been **kicked** from **${interaction.guild.name}**.\nReason: ${reason}\nBy: ${interaction.user.tag}\nServer: https://discord.gg/mRtPGTjq59`);
        } catch {
            console.log(`Could not send DM to ${targetUser.tag}`);
        }

        await member.kick(reason);
        await interaction.reply(`✅ ${targetUser.tag} has been kicked.`);
    }
});

client.login(TOKEN);
