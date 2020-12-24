// ----- Items/Recipes Library ----- //

const foods = {

    "pasta" : "🥖 Pasta",

    "cheese" : "🧀 Cheese",

    "milk" : "🥛 Milk",

    "butter": "🧈 Butter",

    "flour": "🗯️ Flour",

    "buffalo": "🐂 Buffalo Sauce",

    "chicken": "🐔 Chicken",

    "salt" : "🧂 Salt",

    "pepper": "♟️ Pepper",

    "garlic" : "🧄 Garlic",

    "potato": "🥔 Potato",

    "tomato": "🍅 Tomato",

    "breadcrums" : "🍞 Breadcrums",

    "bread": "🍞 Bread",

    "beef": "🍔 Beef Patty",

    "onion": "🧅 Onion",

    "tortilla": "🌯 Flour Tortilla",

    "lettuce": "🥬 Lettuce",

    "chocolate": "🍫 Chocolate Fudge",

    "icecream": "🍨 Ice Cream",

    "cream": "🍦 Whipped Cream",

    "egg": "🥚 Egg",

    "sugar": "⚪ Sugar",

}

const menu = {

    "Mac And Cheese": 

        [ foods.pasta, foods.cheese, foods.milk, foods.flour, foods.butter, foods.salt ],

    "Boneless Buffalo Wings":

        [ foods.chicken, foods.breadcrums, foods.buffalo, foods.butter, foods.garlic, foods.salt ],

    "Traditional Buffalo Wings":

        [ foods.chicken, foods.buffalo, foods.butter, foods.garlic, foods.salt, foods.pepper ],

    "Mozzarella Sticks":

        [ foods.cheese, foods.breadcrums, foods.tomato, foods.garlic ],

    "Chips And Salsa":

        [ foods.potato, foods.salt, foods.pepper, foods.tomato ],

    "Classic Chicken Tenders":

        [ foods.chicken, foods.breadcrums, foods.butter, foods.salt ],

    "All American Cheeseburger":

        [ foods.bread, foods.cheese, foods.tomato, foods.beef, foods.onion, foods.lettuce ],

    "Buffalo Chicken Sandwich":

        [ foods.bread, foods.chicken, foods.cheese, foods.buffalo, foods.salt ],

    "Buffalo Chicken Wrap":

        [ foods.tortilla, foods.lettuce, foods.tomato, foods.chicken, foods.buffalo ],

    "Classic Chicken Wrap": 

        [ foods.tortilla, foods.tomato, foods.lettuce, foods.chicken ],

    "Chocolate Fudge Cake":

        [ foods.chocolate, foods.egg, foods.flour, foods.milk, 
            foods.butter, foods.sugar, foods.cream, foods.icecream ],

    "Fries":

        [ foods.potato, foods.salt, foods.pepper ],

}


class Menu {

    getMenu() { return menu } // Returns Dictionary

    getFoods() { return foods } // Returns Dictionary
    
    getPlate(plate) { if (menu[plate]) { return menu[plate] } else { return false } } // Returns Array

    getFood(food) { if (foods[food]) { return foods[food] } else { return false } } // Returns String

    // Return Plates as Strings
    // [Could've made it a smarter way, but who cares]

    plateString(title, ingredients) {

        let template = "**-------- " + title + " --------**\n\n";

        for ( var i = 0; i < ingredients.length; i++ ) {

            let ingredient = ingredients[i];

            template += "    " + ingredient + "\n";

        }

        template += "\n**------------------------------------------------**";

        return template;

    }

    menuString(dictionary) {

        let template = "**🍔  -------- Our Official Menu --------  🍔**\n\n";

        Object.keys(dictionary).forEach( (key) => {

            template += "    - " + key + "\n";

        });

        template += "\n**------------------------------------------------**";

        return template;

    }

}


// ----- Module Exports ----- //
module.exports = new Menu;