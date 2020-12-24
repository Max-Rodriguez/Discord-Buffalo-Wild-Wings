// ----- Required Modules ----- //

const Discord = require('discord.js');
const fs = require('fs');

const Menu = require('./menu.js');


// ----- Bot Listener Prefix ----- //
const prefix = '$';


// ----- Get API Tokens from JSON ----- //

try {
    var json_string = fs.readFileSync("./tokens.json", 'utf-8');
} catch (error) {
    console.error("[ERROR]: API Keys JSON could not be read!");
    console.error(error);
}

try {
    var api_tokens = JSON.parse(json_string);
} catch (error) {
    console.error("[ERROR]: Could not parse API Keys JSON String!");
    console.error(error);
}

// Discord Client API Tokens
const bot_token = api_tokens.token;
const client_id = api_tokens.client_id;
const client_secret = api_tokens.client_secret;


// ----- Official Discord Channel/Roles IDs ----- //

const cooks = "790746081993818132";
const customers = "790726281557835816";

const updates_id = "790727538157813810";
const kitchen_id = "790733960031502366";
const orders_id = "790739643401895966";


// ----- Handling Orders ----- //

var orders = []; // Order Template: ["Customer", ["Food", "Food2"]]


// ----- Discord Bot Client ----- //

const client = new Discord.Client();

client.on('ready', () => {

    console.log(`Successfully Authenticated [ ${client.user.username} ]`);

    async function setPresence() {

        setTimeout( () => {

            client.user.setStatus('idle')
            .catch(console.warn("WARN: Error returned from setting User status."));

        }, 1000 );

        setTimeout( () => {

            client.user.setActivity("for orders..", { type: 'WATCHING' })
            .catch(console.warn("WARN: Error returned from setting User activity."));

        }, 2000 );

    }

    // Bot Prescence
    setPresence()

    // Get Channel Instances
    const updates = client.channels.cache.get(updates_id);
    const kitchen = client.channels.cache.get(kitchen_id);
    const orders = client.channels.cache.get(orders_id);

    // Send Back Online Ping
    //updates.send("<@&" + cooks + "> Buffalo Wild Wings system is back online!");

});

// DISCLAIMER:
//
// The code below is VERY inefficient please do not repeat.

client.on('message', msg => {

    // Ping Test Command

    if (msg.content === prefix + 'ping') {

        msg.reply('Pong! Alright, now get back to working.');

    }

    // Show List of Commands

    else if (msg.content === prefix + 'help') {

        msg.delete(); // Remove Message

        // Form Message String [lol this is the dumbest and laziest part]

        let string = "**-------- Below Is A List Of All My Commands! --------**\n\n";

        string += "    `$help` - Direct Message's the list of commands.\n\n";
        string += "    `$ping` - Pong! (I don't know, testing purposes?)\n\n";
        string += "    `$order` - Register a new order for the cooks to handle!\n\n";
        string += "    `$menu` - Direct Message's our official Buffalo Wild Wings menu!\n\n";
        string += "    `$plate` - Shows the Ingredients of the specified plate from our menu!\n\n";

        msg.author.send(string);

    }

    // Place New Order Command

    else if (msg.content === prefix + 'order') {

        msg.reply('LOL you thought I made the order system already? Barely working out the menu system.');

    }

    // Send Full Menu Command

    else if (msg.content === prefix + 'menu' || msg.content === prefix + 'plates') {

        let author = msg.author;

        // Form Menu to Return

        let dictionary = Menu.getMenu(); // Get Menu Dictionary

        let string = Menu.menuString(dictionary); // Pass Menu Dictionary to convert as string.

        // Reply To Command

        author.send(string); // DM Menu String
        msg.reply("**Alrighty!** Sent you our full official menu! 🍔"); // Public Reply

    }

    else if (msg.content.substring(0, 7) === prefix + "plate ") {

        let content = msg.content.toLowerCase();
        let parameter = content.replace(prefix + "plate ", ""); // Remove Command Text

        // Capitalize Phrases for Search.
        parameter = parameter.split(" ");

        for (let i = 0; i < parameter.length; i++) {

            parameter[i] = parameter[i][0].toUpperCase() + parameter[i].substr(1);

        }

        parameter = parameter.join(" "); // Join all words that were split into one string.

        let plate = Menu.getPlate(parameter); // Get Ingredients Array of Plate.

        if (typeof plate === "object") {

            let string = Menu.plateString(parameter, plate);

            msg.channel.send(string);

        } else {

            msg.reply("❌ **Sorry!** We couldn't find that dish in our menu.");

        }

    }

});


// ----- Client Authentication ----- //

client.login(bot_token);