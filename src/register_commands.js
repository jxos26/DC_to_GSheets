require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'power_update',
        description: 'Save data to Google Sheet',
        options: [
            {
                name: 'ign',
                description: 'In-game Name',
                type: 3, // ApplicationCommandOptionType.String
                required: true,
            },
            {
                name: 'class',
                description: 'Growth rate of your character',
                type: 3, // ApplicationCommandOptionType.String
                required: true,
                choices: [
                    {
                        name: 'Archer',
                        value: 'Archer'
                    },
                    {
                        name: 'Warrior',
                        value: 'Warrior'
                    },
                    {
                        name: 'Assassin',
                        value: 'Assassin'
                    },
                    {
                        name: 'Mage',
                        value: 'Mage'
                    },
                    {
                        name: 'Priest',
                        value: 'Priest'
                    },
                ]
            }
            ,
            {
                name: 'level',
                description: 'Your Level in the game',
                type: 4, // ApplicationCommandOptionType.Integer
                required: true,
            },
            {
                name: 'gr',
                description: 'Growth rate of your character',
                type: 4, // ApplicationCommandOptionType.Integer
                required: true,
            }
        ]
    },
    {
        name: 'attendance',
        description: 'Attendance check',
        options: [
            {
                name: 'ign',
                description: 'ign',
                type: 3, // ApplicationCommandOptionType.String
                required: true,
            },
            {
                name: 'status',
                description: 'Attendance status',
                type: 3, // ApplicationCommandOptionType.String
                required: true,
                choices: [
                    {
                        name: 'Present',
                        value: 'Present'
                    },
                ]
            }

        ]
    },
    {
        name: 'dias',
        description: 'dias attendance check',
        options: [
            {
                name: 'ign',
                description: 'ign',
                type: 3, // ApplicationCommandOptionType.String
                required: true,
            },
            {
                name: 'week',
                description: 'Week number',
                type: 3, // ApplicationCommandOptionType.String
                required: true,
                choices: [
                    {
                        name: 'Week 1',
                        value: 'Week 1'
                    },
                    {
                        name: 'Week 2',
                        value: 'Week 2'
                    },
                    {
                        name: 'Week 3',
                        value: 'Week 3'
                    },
                    {
                        name: 'Week 4',
                        value: 'Week 4'
                    },
                ]
            }
        ]
    }
];

const rest = new REST({version:'10'}).setToken(process.env.TOKEN);

( async () => {
    try {
        console.log('Register slash commands..')
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {
                body: commands
            }
        )
        console.log('Register succesfully');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();