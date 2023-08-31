const client = require("../index");
const { useGuard, getAuditLogs } = require("../utils/guard");
const Database = require("croxydb")

client.on("guildMemberRemove", async (member) => {
    const banGuardBoolean = await Database.get(`banGuardBoolean.${member.guild.id}`);
    const banGuardNumber = await Database.get(`banGuardNumber.${member.guild.id}`) || 1;
    const banGuardLogChannel = await Database.get(`banGuardLogChannel.${member.guild.id}`);

    const kickGuardBoolean = await Database.get(`kickGuardBoolean.${member.guild.id}`);
    const kickGuardNumber = await Database.get(`kickGuardNumber.${member.guild.id}`) || 1;
    const kickGuardLogChannel = await Database.get(`kickGuardLogChannel.${member.guild.id}`);

    const safeRoleData = await Database.get(`safeRole.${member.guild.id}`)

    if (banGuardBoolean === "open") {
        getAuditLogs(member.guild, "MEMBER_BAN_ADD", 1).then(async entry => {
            if (entry.action === "MEMBER_BAN_ADD") {
                let user = member.guild.members.cache.get(entry.executor.id);

                if (user.roles.cache.has(safeRoleData) || user.id === client.user.id || member.id === member.guild.ownerId) return;

                useGuard(member.guild, "MEMBER_BAN_ADD", 1, Number(banGuardNumber), banGuardLogChannel, "banGuardLimit", "Ban Limiti", member.user.username);
            }
        })
    }

    if (kickGuardBoolean === "open") {
        getAuditLogs(member.guild, "MEMBER_KICK", 1).then(async entry => {
            if (entry.action === "MEMBER_KICK") {
                let user = member.guild.members.cache.get(entry.executor.id);
                 if(!user) return
                if (user.id === client.user.id || user.id === member.guild.ownerId) return;

                useGuard(member.guild, "MEMBER_KICK", 1, Number(kickGuardNumber), kickGuardLogChannel, "kickGuardLimit", "Kick Limiti", member.user.username);
            }
        })
    }
});