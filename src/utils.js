module.exports = {
    async getUserIdFromThread(thread) {
        try {
            // Fetch the first few messages in the thread to find the User ID
            const messages = await thread.messages.fetch({ limit: 5 });

            for (const msg of messages.values()) {
                // Check message content for ID patterns
                // Pattern 1: Hidden spoiler ||ID||
                let match = msg.content?.match(/\|\|(\d{17,20})\|\|/);
                if (match) return match[1];

                // Pattern 2: Visible backtick format (`ID`)
                match = msg.content?.match(/\`(\d{17,20})\`/);
                if (match) return match[1];

                // Check components for ID (Components V2)
                // Components V2 structure: msg.components is an array of component rows
                if (msg.components && msg.components.length > 0) {
                    for (const row of msg.components) {
                        // Each row might have components or be a component itself
                        const components = row.components || [row];
                        for (const component of components) {
                            // Try to get text content from various possible locations
                            const text = component.data?.content
                                || component.content
                                || (component.toJSON && component.toJSON().content);

                            if (text) {
                                // Pattern 1: Hidden spoiler ||ID||
                                let match = text.match(/\|\|(\d{17,20})\|\|/);
                                if (match) return match[1];

                                // Pattern 2: Visible backtick format (`ID`)
                                match = text.match(/\`(\d{17,20})\`/);
                                if (match) return match[1];
                            }
                        }
                    }
                }
            }

            // Fallback: Check if ID is in the thread name (Old format: modmail-username-id)
            const nameParts = thread.name.split('-');
            const potentialId = nameParts[nameParts.length - 1];
            if (/^\d{17,20}$/.test(potentialId)) return potentialId;

            return null;
        } catch (e) {
            console.error("Error retrieving User ID from thread:", e);
            return null;
        }
    }
};
