const { SlashCommandBuilder } = require('discord.js');
const { getUserIdFromThread } = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Closes the current modmail'),
    async execute(interaction) {
        // Check if inside a thread
        if (!interaction.channel.isThread()) {
            return interaction.reply({ content: 'This command can only be used in a modmail thread.', ephemeral: true });
        }

        const userId = await getUserIdFromThread(interaction.channel);

        // Basic validation
        if (!userId) {
            return interaction.reply({ content: '❌ Could not find user ID from thread.', ephemeral: true });
        }

        const client = interaction.client;

        await interaction.reply('🔒 Closing Modmail...');

        // Notify User
        let username = "Unknown";
        try {
            const user = await client.users.fetch(userId);
            username = user.username;
            await user.send('**Modmail Closed**\nYour modmail has been closed by staff. If you need further assistance, please reply to create a new modmail.');
        } catch (error) {
            console.error('Could not DM user on close:', error);
            await interaction.followUp({ content: '⚠️ Could not notify user (DMs off?), but closing anyway.', ephemeral: true });
        }

        // Archive/Lock Thread
        try {
            // Rename to indicate finished
            if (username !== "Unknown") {
                await interaction.channel.setName(`✔・${username}`);
            }

            await interaction.channel.setLocked(true);
            await interaction.channel.setArchived(true);
        } catch (error) {
            console.error('Error closing thread:', error);
            await interaction.followUp({ content: '❌ Error archiving thread. Check my permissions.', ephemeral: true });
        }
    },
};
