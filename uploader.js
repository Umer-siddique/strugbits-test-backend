const axios = require("axios");
const Order = require("./model/order");
const { DB } = require("./database");

DB();

const fetchAndSaveOrders = async () => {
  try {
    const response = await axios.get("https://dummyjson.com/recipes");
    const recipes = response.data.recipes;
    // Save each recipe to the database
    await Order.insertMany(
      recipes.map((recipe) => ({
        image: recipe.image,
        name: recipe.name,
        instructions: recipe.instructions,
        cuisine: recipe.cuisine,
        rating: recipe.rating,
        mealType: recipe.mealType,
      }))
    );

    console.log("Orders fetched and saved successfully");
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

fetchAndSaveOrders();
