# 📨 Discord Modmail Bot

> [!NOTE]
> **A Personal Note from AshhLattee**
> After 6 years of pouring my heart into code, I've decided to close this chapter and retire from development. It's been an incredible journey, and I'm deeply grateful for everyone who has been a part of it. I'm now looking forward to finding new ways to create and explore.
>
> While I’m stepping away and this project will no longer be maintained, it is **not** retired—it remains here for you to use, fork, and build upon. Development has stopped, but the work remains for the community. Thank you for being part of my story. 🌙
>
> For the full journey, feel free to visit my [GitHub profile](https://github.com/AshhLattee).

A professionally engineered, database-free Modmail solution for Discord communities. This application leverages **Discord Threads** and **Components V2** to deliver a modern, efficient support ticket system without external database dependencies.

---

## 📋 Table of Contents

- [Licensing & Usage](#️-licensing--usage-restrictions)
- [Author & Credits](#-author--credits)
- [Key Features](#-key-features)
- [Installation](#-installation--configuration)
- [Usage](#-usage)
- [Changelog](#-changelog)

---

## ⚖️ Licensing & Usage Restrictions

This project is released under the **Apache License 2.0**, modified with the **Commons Clause**.

### 🚫 Commercial Use Prohibited

**The sale, resale, or commercial distribution of this software is strictly prohibited.**

By accessing, downloading, or using this software, you acknowledge and agree that:

1. **No Commercial Distribution**: You may not sell, rent, lease, or sublicense this software.
2. **No Paid Services**: You may not include this software as part of a paid service, hosting package, or premium feature set.
3. **Personal & Internal Use Only**: Usage is permitted for personal, educational, or internal business purposes, provided no fees are charged for the software itself.

### 🛡️ Enforcement Policy

We actively monitor and protect our intellectual property rights. Violations of the license terms will be met with immediate action, including but not limited to:

- **DMCA Takedown Notices**: Immediate removal of infringing repositories or hosted instances.
- **Legal Action**: Issuance of Cease & Desist orders and potential pursuit of damages.
- **Public Disclosure**: Documented instances of license violation may be publicly listed.

**Full License**: [Apache License 2.0 + Commons Clause](./LICENSE)

---

## 👤 Author & Credits

**Developed by: Ashhlattee**

| Platform | Link                                        |
| -------- | ------------------------------------------- |
| Discord  | `Ashhlattee`                                |
| GitHub   | [Ashhlattee](https://github.com/AshhLattee) |

> **🤖 AI Augmented Engineering**  
> This project was architected and implemented by an **AI Augmented Engineer**, utilizing advanced Artificial Intelligence to ensure high-quality, maintainable, and efficient code standards.

_If you find this project useful, please consider starring the repository._ ⭐

---

## ✨ Key Features

| Feature                        | Description                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Zero-Database Architecture** | Utilizes Discord's native Thread system for persistent state management, eliminating external dependencies. |
| **Modern UI/UX**               | Features Discord Components V2 (Sections, Buttons) for a polished, interactive experience.                  |
| **Automatic Greeting**         | Sends a personalized welcome message to users upon opening a Modmail.                                       |
| **Channel Notifications**      | Posts an alert to the mail channel with a direct link when a new thread is created.                         |
| **Intuitive Workflow**         | Seamlessly bridges Direct Messages to Server Threads for both users and staff.                              |
| **Command Suite**              | Staff-side Slash Commands (`/close`) and user-side DM commands (`!close`).                                  |
| **Aesthetic Thread Names**     | Uses `📨・username` for open and `✔・username` for closed threads.                                          |

---

## 🚀 Installation & Configuration

### Prerequisites

- Node.js v18 or higher
- A Discord Bot Application with the following **Privileged Gateway Intents** enabled:
  - `Message Content Intent`
  - `Server Members Intent` (optional, for enhanced user info)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/AshhLattee/AshhLattee-ModMail.git
   cd AshhLattee-ModMail
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**  
   Create a `.env` file based on `.env.example`:

   ```env
   DISCORD_TOKEN=your_bot_token_here
   GUILD_ID=your_server_id_here
   MAIL_CHANNEL_ID=your_modmail_channel_id_here
   ```

4. **Start the Bot**
   ```bash
   npm start
   ```

---

## 📖 Usage

### For Users

- **Open a Modmail**: Send a Direct Message to the bot.
- **Close a Modmail**: Reply with `!close` in your DM conversation.

### For Staff

- **View Modmails**: Check the designated mail channel for notifications and thread links.
- **Reply to Users**: Simply type in the modmail thread; messages are forwarded automatically.
- **Close a Modmail**: Use the `/close` command or click the "🔒 Close Modmail" button.

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes and releases.

---

<div align="center">

**Made with ❤️ by Ashhlattee**

</div>
