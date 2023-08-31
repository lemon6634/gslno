const client = require("../index");
const { useGuard, getAuditLogs } = require("../utils/guard");
const Database = require("croxydb")

client.on("channelDelete", async (channel) => {
    const channelDeleteBoolean = await Database.get(`channelDeleteBoolean.${channel.guild.id}`);
    const channelDeleteNumber = await Database.get(`channelDeleteNumber.${channel.guild.id}`) || 1;
    const channelDeleteLogChannel = await Database.get(`channelDeleteLogChannel.${channel.guild.id}`);

    const safeRoleData = await Database.get(`safeRole.${channel.guild.id}`)

    if (channelDeleteBoolean === "open") {
        getAuditLogs(channel.guild, "CHANNEL_DELETE", 1).then(async entry => {
            let member = channel.guild.members.cache.get(entry.executor.id);

            if (member.roles.cache.has(safeRoleData) || member.id === client.user.id || member.id === member.guild.ownerId) return;

            useGuard(channel.guild, "CHANNEL_DELETE", 1, Number(channelDeleteNumber), channelDeleteLogChannel, "channelDeleteLimit", "Kanal Silme Limiti", channel.name);

            var newChannel;

            if (channel.type === "GUILD_TEXT") {
                newChannel = await channel.guild.channels.create(channel.name, {
                    type: channel.type,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    permissionOverwrites: channel.permissionOverwrites.cache
                });

                if (channel.parent) newChannel.setParent(channel.parent);
                newChannel.setPosition(channel.rawPosition);
            }

            if (channel.type === "GUILD_VOICE") {
                newChannel = await channel.guild.channels.create(channel.name, {
                    type: channel.type,
                    bitrate: channel.bitrate,
                    userLimit: channel.userLimit,
                    defaultAutoArchiveDuration: channel.defaultAutoArchiveDuration,
                    rtcRegion: channel.rtcRegion,
                    rateLimitPerUser: channel.rateLimitPerUser,
                    permissionOverwrites: channel.permissionOverwrites.cache
                });

                if (channel.parent) newChannel.setParent(channel.parent);
                newChannel.setPosition(channel.rawPosition);
            }

            if (channel.type === "GUILD_CATEGORY") {
                newChannel = channel.guild.channels.create(channel.name, {
                    type: channel.type,
                    permissionOverwrites: channel.permissionOverwrites.cache
                });

                newChannel.setPosition(channel.rawPosition);
            }
        })
    }
});

client.on("channelCreate", async (channel) => {
    const channelCreateBoolean = await Database.get(`channelCreateBoolean.${channel.guild.id}`);
    const channelCreateNumber = await Database.get(`channelCreateNumber.${channel.guild.id}`) || 1;
    const channelCreateLogChannel = await Database.get(`channelCreateLogChannel.${channel.guild.id}`);

    const safeRoleData = await Database.get(`safeRole.${channel.guild.id}`)

    if (channelCreateBoolean === "open") {
        getAuditLogs(channel.guild, "CHANNEL_CREATE", 1).then(async entry => {
            let member = channel.guild.members.cache.get(entry.executor.id);

            if (member.roles.cache.has(safeRoleData) || member.id === client.user.id || member.id === member.guild.ownerId) return;

            useGuard(channel.guild, "CHANNEL_CREATE", 1, Number(channelCreateNumber), channelCreateLogChannel, "channelCreateLimit", "Kanal Oluşturma Limiti", channel.name);

            channel.delete();
        })
    }
});