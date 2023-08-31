const client = require("../index");
const { useGuard, getAuditLogs } = require("../utils/guard");
const Database = require("croxydb")

client.on("roleDelete", async (role) => {
    const roleDeleteBoolean = await Database.get(`roleDeleteBoolean.${role.guild.id}`);
    const roleDeleteNumber = await Database.get(`roleDeleteNumber.${role.guild.id}`) || 1;
    const roleDeleteLogChannel = await Database.get(`roleDeleteLogChannel.${role.guild.id}`);

    const safeRoleData = await Database.get(`safeRole.${role.guild.id}`)

    if (roleDeleteBoolean === "open") {
        getAuditLogs(role.guild, "ROLE_DELETE", 1).then(async entry => {
            let member = role.guild.members.cache.get(entry.executor.id);

            if (member.roles.cache.has(safeRoleData) || member.id === client.user.id || member.id === member.guild.ownerId) return;

            useGuard(role.guild, "ROLE_DELETE", 1, Number(roleDeleteNumber), roleDeleteLogChannel, "roleDeleteLimit", "Rol Silme Limiti", role.name);

            var newRole;

            newRole = await role.guild.roles.create({
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                permissions: role.permissions,
                mentionable: role.mentionable
            });

            newRole.setPosition(role.rawPosition)
        })
    }
});

client.on("roleCreate", async (role) => {
    const roleCreateBoolean = await Database.get(`roleCreateBoolean.${role.guild.id}`);
    const roleCreateNumber = await Database.get(`roleCreateNumber.${role.guild.id}`) || 1;
    const roleCreateLogChannel = await Database.get(`roleCreateLogChannel.${role.guild.id}`);

    const safeRoleData = await Database.get(`safeRole.${role.guild.id}`)

    if (roleCreateBoolean === "open") {
        getAuditLogs(role.guild, "ROLE_CREATE", 1).then(async entry => {
            let member = role.guild.members.cache.get(entry.executor.id);

            if (member.roles.cache.has(safeRoleData) || member.id === client.user.id || member.id === member.guild.ownerId) return;

            useGuard(role.guild, "ROLE_CREATE", 1, Number(roleCreateNumber), roleCreateLogChannel, "roleCreateLimit", "Rol Oluşturma Limiti", role.name);

            role.delete();
        })
    }
});