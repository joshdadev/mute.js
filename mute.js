const {Message, MessageEmbed}= require('discord.js')
const ms = require('ms')

module.exports = { 
    name : 'mute',
    /**
     * @param {Message} message
     */
    run : async(client, message, args) => {
        if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('You do not have permissions to use this command') // Permission lock
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!Member) return message.channel.send('Member is not found.')
        const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted') // Checks if muted role exists
        if(!role) {
            try {
                message.channel.send('Muted role is not found, attempting to create muted role.') // If not, it creates a role

                let muterole = await message.guild.roles.create({
               
                        name : 'muted', // Data of the role
                        permissions: []
                    
                });
                message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel, id) => {
                    await  channel.permissionOverwrites.edit(muterole, { // Edits the permissions of all channels visible to the bot to disallow the role from speaking
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                });
                message.channel.send('Muted role has sucessfully been created.') // Confirmation
            } catch (error) {
                console.log(error)
            }
        };
        let role2 = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted') // Checks if user has the role
        if(Member.roles.cache.has(role2)) return message.channel.send(`${Member.displayName} has already been muted.`) // Tells that user is muted
        await Member.roles.add(role2)
        message.channel.send(`${Member.displayName} is now muted.`) // Final confirmation
    }
}
