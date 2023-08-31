const client = require("../index");
const { useGuard, getAuditLogs } = require("../utils/guard");
const Database = require("croxydb")

client.on("guildMemberAdd", async (member) => {
    if (!member.user.bot) return;

    const botGuardBoolean = await Database.get(`botGuardBoolean.${member.guild.id}`);
    const botGuardNumber = 1;
    const botGuardLogChannel = await Database.get(`botGuardLogChannel.${member.guild.id}`);

    const botGuardPerm = await Database.get(`botGuardPerm.${member.guild.id}${member.id}`)

    const safeRoleData = await Database.get(`safeRole.${member.guild.id}`)

    if (botGuardBoolean === "open") {
        getAuditLogs(member.guild, "BOT_ADD", 1).then(async entry => {
            let user = member.guild.members.cache.get(entry.executor.id);

            if (user.roles.cache.has(safeRoleData) || user.id === client.user.id || botGuardPerm || user.id === member.guild.ownerId) return;

            member.kick();

            useGuard(member.guild, "BOT_ADD", 1, Number(botGuardNumber), botGuardLogChannel, "botGuardLimit", "İzinsiz Bot Ekleme", member.user.username);
        })
    }
});