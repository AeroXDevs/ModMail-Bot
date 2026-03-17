const { Events, ChannelType, ThreadAutoArchiveDuration, EmbedBuilder, SectionBuilder, ButtonStyle, MessageFlags, ComponentType } = require('discord.js');
const { getUserIdFromThread } = require('../utils');

// Lock Set to prevent race conditions on thread creation
const creatingThread = new Set();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignore bots
        if (message.author.bot) return;

        const client = message.client;
        const guildId = process.env.GUILD_ID;
        const mailChannelId = process.env.MAIL_CHANNEL_ID;

        // -----------------------------
        // 1. Handle DMs (User -> Bot)
        // -----------------------------
        if (message.channel.type === ChannelType.DM) {
            const guild = await client.guilds.fetch(guildId).catch(console.error);
            if (!guild) return console.error(`Guild ${guildId} not found`);

            const mailChannel = await guild.channels.fetch(mailChannelId).catch(console.error);
            if (!mailChannel) return console.error(`Mail channel ${mailChannelId} not found`);

            // Check for existing thread
            // We search for a thread that is NOT locked (closed)
            // Name format: 📨・username
            const targetName = `📨・${message.author.username}`;
            let thread = mailChannel.threads.cache.find(t => t.name === targetName && !t.locked);

            if (!thread) {
                // Try fetching active threads if not in cache
                const activeThreads = await mailChannel.threads.fetchActive();
                thread = activeThreads.threads.find(t => t.name === targetName && !t.locked);
            }

            // RE-CHECK CACHE: A concurrent request might have finished creating the thread while we were awaiting fetchActive.
            if (!thread) {
                thread = mailChannel.threads.cache.find(t => t.name === targetName && !t.locked);
            }

            if (!thread) {
                // LOCK CHECK: If we are already creating a thread for this user, stop.
                if (creatingThread.has(message.author.id)) return;

                creatingThread.add(message.author.id);

                // Create new thread
                try {
                    const threadName = `📨・${message.author.username}`;
                    thread = await mailChannel.threads.create({
                        name: threadName,
                        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                        type: ChannelType.PrivateThread,
                        reason: `New modmail from ${message.author.tag}`
                    });

                    // New Modmail UI using SectionBuilder
                    const ticketInfoSection = new SectionBuilder()
                        .addTextDisplayComponents(
                            (text) => text.setContent(`### 📨 New Modmail`),
                            (text) => text.setContent(`**User:** ${message.author} (\`${message.author.id}\`)\n**Created:** <t:${Math.floor(Date.now() / 1000)}:R>`)
                        )
                        .setThumbnailAccessory((thumbnail) =>
                            thumbnail
                                .setURL(message.author.displayAvatarURL({ extension: 'png' }))
                                .setDescription('User Avatar')
                        );

                    const ticketControlSection = new SectionBuilder()
                        .addTextDisplayComponents(
                            (text) => text.setContent('**Modmail Controls**')
                        )
                        .setButtonAccessory((button) =>
                            button
                                .setCustomId('close_ticket')
                                .setLabel('Close Modmail')
                                .setStyle(ButtonStyle.Danger)
                                .setEmoji({ name: '🔒' })
                        );

                    // Hidden ID component for robust retrieval
                    const { TextDisplayBuilder } = require('discord.js');
                    const hiddenIdComponent = new TextDisplayBuilder()
                        .setContent(`-# ||${message.author.id}||`);

                    await thread.send({
                        components: [ticketInfoSection, ticketControlSection, hiddenIdComponent],
                        flags: MessageFlags.IsComponentsV2
                    });

                    // Send greeting message to user
                    const greetingSection = new SectionBuilder()
                        .addTextDisplayComponents(
                            (text) => text.setContent(`### 📬 Modmail Received`),
                            (text) => text.setContent(`Hey **${message.author.username}**! Your message has been received.\n\nOur staff will respond as soon as possible. Please be patient and provide any additional details if needed.`),
                            (text) => text.setContent(`-# Powered by **Modmail**`)
                        )
                        .setThumbnailAccessory((thumbnail) =>
                            thumbnail
                                .setURL(message.guild?.iconURL({ extension: 'png' }) || client.user.displayAvatarURL({ extension: 'png' }))
                                .setDescription('Server Icon')
                        );

                    await message.author.send({
                        components: [greetingSection],
                        flags: MessageFlags.IsComponentsV2
                    });

                    // Notify mail channel about new modmail
                    const notificationSection = new SectionBuilder()
                        .addTextDisplayComponents(
                            (text) => text.setContent(`### 📩 New Modmail Opened`),
                            (text) => text.setContent(`**User:** ${message.author} (\`${message.author.id}\`)\n**Thread:** ${thread}\n**Opened:** <t:${Math.floor(Date.now() / 1000)}:R>`)
                        )
                        .setButtonAccessory((button) =>
                            button
                                .setLabel('View Thread')
                                .setStyle(ButtonStyle.Link)
                                .setURL(`https://discord.com/channels/${guildId}/${thread.id}`)
                        );

                    await mailChannel.send({
                        components: [notificationSection],
                        flags: MessageFlags.IsComponentsV2
                    });

                } catch (error) {
                    console.error("Error creating thread:", error);
                    return message.reply("❌ Error creating ticket. Please contact an admin directly.");
                } finally {
                    creatingThread.delete(message.author.id);
                }
            }

            // Forward message to thread
            const content = message.content || "(No Content)";

            // Check for user-side close command
            if (content.trim().toLowerCase() === '!close') {
                if (!thread) return message.reply("❌ No active ticket found to close.");

                try {
                    await thread.send('🔒 **User has closed this ticket.**');
                    await thread.setLocked(true);
                    await thread.setArchived(true);
                    return message.reply("✅ Ticket closed.");
                } catch (error) {
                    console.error("Error closing thread from user side:", error);
                    return message.reply("❌ Error closing ticket.");
                }
            }

            const files = message.attachments.map(a => a.url);

            // User Message using SectionBuilder
            const userSection = new SectionBuilder()
                .addTextDisplayComponents(
                    (text) => text.setContent(content),
                    (text) => text.setContent(`-# Sent by **${message.author.username}**`)
                )
                .setThumbnailAccessory((thumbnail) =>
                    thumbnail.setURL(message.author.displayAvatarURL({ extension: 'png' }))
                        .setDescription('User Avatar')
                );

            // Add separate text component for attachments if present, as SectionBuilder text is limited? 
            // Actually SectionBuilder handles text. If there are attachments, we just pass them as files.
            // But we might want to mention them in text if it's empty.

            try {
                await thread.send({
                    components: [userSection],
                    files: files.length > 0 ? files : [],
                    flags: MessageFlags.IsComponentsV2
                });
                await message.react('✅');
            } catch (error) {
                console.error("Error forwarding to thread:", error);
                message.reply("❌ Failed to send message.");
            }
        }

        // -----------------------------
        // 2. Handle Thread Replies (Staff -> User)
        // -----------------------------
        else if (message.channel.type === ChannelType.PrivateThread || message.channel.type === ChannelType.PublicThread) {
            // Check if this thread belongs to mail channel
            if (message.channel.parentId !== mailChannelId) return;

            // Get User ID from Thread
            const userId = await getUserIdFromThread(message.channel);
            console.log(`[DEBUG] Staff reply in thread ${message.channel.name}, found userId: ${userId}`);
            if (!userId) {
                console.log('[DEBUG] Could not find userId, ignoring message');
                return;
            }

            try {
                const user = await client.users.fetch(userId);
                console.log(`[DEBUG] Sending reply to user: ${user.tag}`);

                const content = message.content || "";
                const files = message.attachments.map(a => a.url);

                // Staff Reply using SectionBuilder
                const staffSection = new SectionBuilder()
                    .addTextDisplayComponents(
                        (text) => text.setContent(content),
                        (text) => text.setContent(`-# Sent by **${message.author.username}** (Staff)`)
                    )
                    .setThumbnailAccessory((thumbnail) =>
                        thumbnail.setURL(message.guild.iconURL({ extension: 'png' }) || '')
                            .setDescription('Server Icon')
                    );

                // Send DM
                await user.send({
                    components: [staffSection],
                    files: files.length > 0 ? files : [],
                    flags: MessageFlags.IsComponentsV2
                });
                // await message.react('✅'); // Optional: confirm sent
            } catch (error) {
                console.error("Error replying to user:", error);
                message.reply("❌ Failed to send DM. User might have DMs off.");
            }
        }
    },
};
