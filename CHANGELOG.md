# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-16
### Added
- **feature**: Automatic greeting message sent to users when opening a new Modmail.
- **feature**: Channel notification posted to the mail channel with a "View Thread" button when a new Modmail is created.
- **ui**: Upgraded to Discord Components V2 (SectionBuilder) for modern, interactive UI.
- **ui**: Thread names now use aesthetic format: `📨・username` (open) and `✔・username` (closed).

### Changed
- **core**: User ID retrieval now uses hidden component parsing for reliability with new naming convention.
- **docs**: Formalized README.md and CHANGELOG.md documentation.

### Fixed
- **bug**: Resolved race condition causing duplicate thread creation on rapid DM sends.
- **bug**: Fixed "Unknown interaction" error on button clicks by adding graceful error handling.
- **bug**: Fixed Components V2 incompatibility with legacy `content` field.

---

## [1.0.0] - 2026-01-16
### Added
- Initial release of the Modmail Bot.
- **core**: Database-free ticket system using Discord Threads.
- **core**: `/close` slash command for staff.
- **core**: `!close` DM command for users.
- **ui**: Beautiful Rich Embeds for new tickets, messages, and staff replies.
- **ui**: "Modmail" naming convention for consistency.

### Fixed
- Fixed issue where `setTopic` failed on Private Threads by moving ID storage to Thread Name.
