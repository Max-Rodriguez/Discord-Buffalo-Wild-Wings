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

var pending = {

    // "ID": ["Customer", "Plate"] <<== Pending Order Template
    
    "1": ["Test", "Fries"],

}

var claimed = {

    // "User": ["ID", "Customer", "Plate", [ingredients_done]] <<== Claimed Order Template

}


// ----- Discord Bot Client ----- //

const client = new Discord.Client();

// Channel Variables [On Scope]
let updates;
let kitchen;
let orders;

client.on('ready', () => {

    console.log(`Successfully Authenticated [ ${client.user.username} ]`);

    async function setPresence() {

        setTimeout( () => {

            client.user.setStatus('idle')
            .catch( (err) => { console.warn("WARN: Error returned from setting User Status.") } );

        }, 1000 );

        setTimeout( () => {

            client.user.setActivity("for orders..", { type: 'WATCHING' })
            .catch( (err) => { console.warn("WARN: Error returned from setting User Activity.") } );

        }, 2000 );

    }

    // Bot Prescence
    setPresence()

    // Get Channel Instances
    updates = client.channels.cache.get(updates_id);
    kitchen = client.channels.cache.get(kitchen_id);
    orders = client.channels.cache.get(orders_id);

    // Send Back Online Ping
    //updates.send("<@&" + cooks + "> Buffalo Wild Wings system is back online!");

});

client.on('message', msg => {

    // If Message is a Direct Message, Return Out.
    if ( msg.channel.type === "dm" ) { return }

    // Show List of Commands

    else if (msg.content === prefix + 'help') {

        if (msg.channel.type != "dm") {

            // Remove Sent Message.
            msg.delete({timeout: 100});
            
        }

        // Form Message String [Lazy Code]

        let string = "**-------- Below Is A List Of All My Commands! --------**\n\n";

        string += "    `$help` - Direct Message's the list of commands.\n\n";
        string += "    `$ping` - Pong! (I don't know, testing purposes?)\n\n";
        string += "    `$order` - Register a new order for the cooks to handle!\n\n";
        string += "    `$menu` - Direct Message's our official Buffalo Wild Wings menu!\n\n";
        string += "    `$plate <menuItem>` - Shows the Ingredients of the specified plate from our menu!\n\n";
        string += "    `$claim <orderID>` - Cooks Only Command! Claims a pending order.\n\n";

        msg.author.send(string);

    }

    // Place New Order Command

    else if (msg.content === prefix + 'order') {

        msg.reply('**Sorry!** Customers will be able to place orders in a future update.');

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

    // Search Plate Ingredients Command

    else if (msg.content.substring(0, 6) === prefix + "plate") {

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

    // Claim Pending Order Command

    else if (msg.content.substring(0, 6) === prefix + "claim") {

        if (msg.channel.id == kitchen_id) {

            // Check If Cook Has Already Claimed an Order.

            let flag = true;

            let search = claimed[msg.author.username];

            if (typeof search != "undefined") { flag = false; }

            if (flag) {

                let content = msg.content.toLowerCase();
                let parameter = content.replace(prefix + "claim ", ""); // Remove Command Text

                // Capitalize Phrases for Search.
                parameter = parameter.split(" ");

                for (let i = 0; i < parameter.length; i++) {

                    parameter[i] = parameter[i][0].toUpperCase() + parameter[i].substr(1);

                }

                parameter = parameter.join(" ");

                // ----- Search For Pending Order ID If Valid ----- //

                let returned = pending[parameter];

                if ( typeof returned === "object" ) {

                    // Remove Pending Order
                    delete pending[parameter];

                    // Add Claimed Order In Progress [Assign By Username, add order information]
                    claimed[msg.author.username] = [ parameter, returned[0], returned[1], [] ];

                    // Announce Claimed Order
                    kitchen.send("✅ **" + msg.author.username + "** has claimed Order ID: [ " + parameter + " ]");
                    
                    if (msg.channel.type != "dm") {

                        msg.delete({timeout: 100});
                        
                    }

                } else {

                    msg.author.send("❌ **Sorry!** That Pending Order ID was invalid! Please try again.");
                    
                    if (msg.channel.type != "dm") {

                        msg.delete({timeout: 100});
                        
                    }

                }

            } else {

                msg.author.send("❌ You **cannot** claim more than 1 order at a time.");
                
                if (msg.channel.type != "dm") {

                    msg.delete({timeout: 100});
                    
                }

            }

        } else {

            msg.author.send("❌ **Sorry!** Only cooks can execute the claim order command!");

            if (msg.channel.type != "dm") {

                msg.delete({timeout: 100});

            }

         }

    } 
    
    // Add Ingredient Command
    
    else if (msg.content.substring(0, 4) === prefix + "add") {

        if (msg.channel.id == kitchen_id) {

            // ----- Get Argument From Message ----- //

            let content = msg.content.toLowerCase();
            let parameter = content.replace(prefix + "add ", "");

            // ----- Validate Food Item, add to claimed order. ----- //

            let food = Menu.getFood(parameter); // Either Returns Undefined or String.

            if (typeof food === "string") {

                claimed[msg.author.username][3].push(food); // Add Food Item.

                msg.author.send("✅ **Added " + food + " to your claimed order.**");

                if (msg.channel.type != "dm") {

                    msg.delete({timeout: 100});

                }

            } else {

                msg.author.send("❌ **Error!** Requested Food was not found in our stock!");

                if (msg.channel.type != "dm") {

                    msg.delete({timeout: 100});

                }

            }

        }

    } 
    
    // Show Order Assembled Ingredients Command
    
    else if (msg.content.substring(0, 6) === prefix + "build") {

        // Direct Message Working Order's Assembled Ingredients.

    }

});


// ----- Client Authentication ----- //

client.login(bot_token);