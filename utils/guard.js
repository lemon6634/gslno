const client = require("../index");
const { MessageEmbed } = require("discord.js");
const Database = require("croxydb");

async function useGuard(guild, type, limit, limits, log, limitName, reason, parameter) {
    const logs = await guild.fetchAuditLogs({ type: type, limit: limit })
    const entries = logs.entries.first();

    if (!entries || !entries.executor || Date.now() - entries.createdTimestamp > 5000) return

    const member = guild.members.cache.get(entries.executor.id)

    await Database.add(`${limitName}.${guild.id}${entries.executor.id}`, 1)

    const executorData = await Database.get(`${limitName}.${guild.id}${entries.executor.id}`) || 0;

    if (limits === executorData) {
        await Database.delete(`${limitName}.${guild.id}${entries.executor.id}`)

        member.ban({ reason: reason }).catch(() => { });

        logChannel(`<:guard:980410755461545985>  Sunucuda izinsiz bir eylem yapıldı ve banlandı. \n\nYapılan Eylem İçeriği: \`${parameter}\` \nEylemi Yapan Kişi: \`${entries.executor.tag}\` \nEylem Limiti: \`Limiti Geçti\``, reason, guild, log, entries)
    } else {
        logChannel(`<:guard:980410755461545985>  Sunucuda izinsiz bir eylem yapıldı. \n\nYapılan Eylem İçeriği: \`${parameter}\` \nEylemi Yapan Kişi: \`${entries.executor.tag}\` \nEylem Limiti: \`(${executorData}/${limits})\``, reason, guild, log, entries)
    }
}

async function getAuditLogs(guild, type, limit) {
    const logs = await guild.fetchAuditLogs({ type: type, limit: limit })
    const entries = logs.entries.first();

    return entries;
}

async function logChannel(content, reason, guild, data, entries) {
    if (data) {
        const channel = guild.channels.cache.get(data)

        if (!channel) return;

        const embed = new MessageEmbed()
            .setAuthor({ name: reason, iconURL: entries.executor.avatarURL({ dynamic: true }) })
            .setColor("BLUE")
            .setDescription(content)
        channel.send({ embeds: [embed] }).catch(() => { })
    }
}

module.exports = {
    useGuard,
    getAuditLogs
}