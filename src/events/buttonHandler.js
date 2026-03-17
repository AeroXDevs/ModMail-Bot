const { Events } = require('discord.js');
const { getUserIdFromThread } = require('../utils');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'close_ticket') {
            try {
                await interaction.deferReply();
            } catch (err) {
                if (err.code === 10062) return; // Unknown interaction (already handled/expired), ignore
                console.error("Interaction defer error:", err);
                return;
            }

            // Verify logic (similar to close command)
            const userId = await getUserIdFromThread(interaction.channel);

            if (!userId) {
                return interaction.followUp({ content: '❌ Could not find user ID from thread.', ephemeral: true });
            }

            // Close logic
            try {
                // Notify User
                const client = interaction.client;
                let username = "Unknown";
                try {
                    const user = await client.users.fetch(userId);
                    username = user.username;
                    await user.send('**Modmail Closed**\nYour modmail has been closed by staff.');
                } catch (err) {
                    console.log('Could not DM user', err);
                }

                await interaction.followUp('🔒 Button clicked: Closing Modmail...');

                // Rename to indicate finished
                if (username !== "Unknown") {
                    await interaction.channel.setName(`✔・${username}`);
                }

                await interaction.channel.setLocked(true);
                await interaction.channel.setArchived(true);

            } catch (error) {
                console.error("Error closing via button:", error);
                await interaction.followUp({ content: '❌ Error closing ticket.', ephemeral: true });
            }
        }
    },
};
