import React from "react"
import IngredientsList from "./IngredientsList.jsx"
import ClaudeRecipe from "./ClaudeRecipe.jsx"
import { getRecipeFromMistral } from "../ai.js"

export default function Base() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [loading, setLoading] = React.useState(false)




    async function getRecipe() {
        setLoading(true)
        setRecipe("")
        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients)
            setRecipe(recipeMarkdown)
        } catch (error) {
            console.error("Failed to get recipe:", error);
            setRecipe("Sorry, I couldn't generate a recipe. Please check that the server is running and try again.");
        }
        finally{
            setLoading(false)
        }
    } 

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    return (
        <main>

           <p className="app-description">Your AI-powered sous chef. What's in your pantry? Give me 4+ ingredients, and I'll whip up a delecious recipe for you!</p>
           <br />


            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    toggleRecipeShown={getRecipe}
                />
            }

            
            {loading && (
                <div className="loading-message">
                    <span className="chef-hat">👩🏻‍🍳</span>
                    <p>Waiting for <strong>ChefMate</strong> to get your recipe...</p>
                </div>
            )}
            {!loading && recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}