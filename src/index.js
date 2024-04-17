require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { google } = require('googleapis');
// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
});

const auth = new google.auth.GoogleAuth({
    keyFile: "cred.json", // Replace with path to your credentials JSON file
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const sheets = google.sheets({ version: 'v4', auth });
// When the client is ready, run this code (only once).
client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) =>{
    if (!interaction.isCommand()) return;
    const { commandName, options } = interaction;

    if (commandName === 'power_update') {
        // Extract values from command options
        const IGN = options.get('ign');
        const Class = options.get('class');
        const GR = options.get('gr');
        const Level = options.get('level');
        // Fetch existing data from the Google Sheet
        const spreadsheetId = '1c-ifJxzK8R1Gim-UG24aWu3etMYaWZmAbyuPYQgnhXs';
        const range = 'Power!A:D'; // Assuming data is in columns A, B, and C
        let existingData = [];
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
            existingData = response.data.values || [];
            console.log(response);
        } catch (err) {
            console.error('Error fetching data from Google Sheet:', err);
            return await interaction.reply('Error fetching data from Google Sheet!');
        }

        // Check if IGN already exists in the sheet
        const existingRow = existingData.find(row => row[0] === IGN['value']);
        // If IGN exists, update the row; otherwise, append a new row
        try {
            if (existingRow) {
                // Update the existing row
                const rowIndex = existingData.indexOf(existingRow) + 1;
                const updateResponse = await sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: `Power!A${rowIndex}:D${rowIndex}`, // Update the entire row
                    valueInputOption: 'RAW',
                    resource: {
                        values: [[IGN['value'],Class['value'], GR['value'], Level['value']]]
                    }
                });
                console.log('Data updated in Google Sheet:', updateResponse.data);
                await interaction.reply('Data updated in Google Sheet successfully!');
            } else {
                // Append a new row
                const appendResponse = await sheets.spreadsheets.values.append({
                    spreadsheetId,
                    range: 'Power!A:D',
                    valueInputOption: 'RAW',
                    resource: {
                        values: [[IGN['value'],Class['value'], GR['value'], Level['value']]]
                    }
                });
                console.log('Data added to Google Sheet:', appendResponse.data);
                await interaction.reply('Data added to Google Sheet successfully!');
                console.log('Updating existing row in Google Sheet with values:', [[IGN,Class, GR, Level]]);
            }
        } catch (err) {
            console.error('Error updating data in Google Sheet:', err);
            await interaction.reply('Error updating data in Google Sheet!');
        }
    }
    if (commandName === 'attendance') {
        // Array of days of the week
        const offsetHours = 8;
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date(Date.now() + offsetHours * 60 * 60 * 1000).getUTCDay();
        const todayDay = daysOfWeek[today];
        const column = String.fromCharCode('E'.charCodeAt(0) + today);
        const Status = options.get('status');
        const IGN = options.get('ign');
        const range = `Power!A:A`; // Check the entire A column for the IGN
        const spreadsheetId = '1c-ifJxzK8R1Gim-UG24aWu3etMYaWZmAbyuPYQgnhXs';

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
            const igns = response.data.values.map(row => row[0]); // Extract IGNs from the response

            // Find the index of the provided IGN in the IGNs array
            const ignIndex = igns.indexOf(IGN['value']);

            if (ignIndex !== -1) {
                // IGN exists in the A column, append attendance data to the corresponding row
                const ignRow = ignIndex + 1; // Rows are 1-indexed in Google Sheets
                const attendanceRange = `Power!${column}${ignRow}`; // Range for the attendance data
                const attendanceValues = [[Status['value']]];

                // Append data to the Google Sheet
                const appendResponse = await sheets.spreadsheets.values.append({
                    spreadsheetId,
                    range: attendanceRange,
                    valueInputOption: 'RAW',
                    resource: {
                        values: attendanceValues
                    }
                });
                await interaction.reply(`Attendance successfully added for ${todayDay}!`);
                console.log('Attendance data added to Google Sheet:', appendResponse.data);
            } else {
                console.log('IGN not found in the Google Sheet.');
            }
        } catch (error) {
            console.error('Error checking IGN or adding attendance data:', error);
        }
    }
    if (commandName === 'dias') {
        const IGN = options.getString('ign'); // Get the user's IGN from the command options
        const week = options.getString('week'); // Get the selected week
        const weeks = week['value'];
        let weekColumn;
        switch (week) {
            case 'Week 1':
                weekColumn = 'L'; // Column L for week 1
                break;
            case 'Week 2':
                weekColumn = 'M'; // Column M for week 2
                break;
            case 'Week 3':
                weekColumn = 'N'; // Column N for week 3
                break;
            case 'Week 4':
                weekColumn = 'O'; // Column O for week 4
                break;
            default:
                console.log('Invalid week selection.');
                return;
        }

        const range = 'Power!A:L'; // Range covering columns A to L
        const spreadsheetId = '1c-ifJxzK8R1Gim-UG24aWu3etMYaWZmAbyuPYQgnhXs'; // ID of your Google Sheet

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
            const sheetData = response.data.values || [];
            const igns = sheetData.map(row => row[0]); // Extract IGNs from the response

            // Check if the provided IGN exists in the Google Sheet
            const ignIndex = igns.indexOf(IGN);

            if (ignIndex !== -1) {
                // IGN exists in the Google Sheet, update dias donation value in the same row
                const ignRow = ignIndex + 1; // Rows are 1-indexed in Google Sheets
                const attendanceRange = `Power!${weekColumn}${ignRow}`; // Range for the dias donation data
                const attendanceValues = [['Donated']]; // Set the dias donation value

                // Update data in the Google Sheet
                const updateResponse = await sheets.spreadsheets.values.update({
                    spreadsheetId,
                    range: attendanceRange,
                    valueInputOption: 'RAW',
                    resource: {
                        values: attendanceValues
                    }
                });
                await interaction.reply(`Dias donation successfully added for ${week}!`);
                console.log('Dias donation data updated in Google Sheet:', updateResponse.data);
            } else {
                console.log('IGN not found in the Google Sheet.');
            }
        } catch (error) {
            console.error('Error updating dias donation data:', error);
        }
    }
})

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
