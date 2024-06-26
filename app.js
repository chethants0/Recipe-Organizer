import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        fetchRecipes();
    }, []);

    const register = async () => {
        const response = await axios.post('/register', { email, password });
        alert(response.data.message);
    };

    const login = async () => {
        const response = await axios.post('/login', { email, password });
        if (response.status === 200) {
            fetchRecipes();
        } else {
            alert(response.data.message);
        }
    };

    const fetchRecipes = async () => {
        const response = await axios.get('/recipes');
        setRecipes(response.data);
    };

    const addRecipe = async () => {
        const response = await axios.post('/recipes', { title, description, category, image });
        alert(response.data.message);
        fetchRecipes();
    };

    const editRecipe = async (recipeId) => {
        const response = await axios.put(`/recipes/${recipeId}`, { title, description, category, image });
        alert(response.data.message);
        fetchRecipes();
    };

    const deleteRecipe = async (recipeId) => {
        const response = await axios.delete(`/recipes/${recipeId}`);
        alert(response.data.message);
        fetchRecipes();
    };

    return (
        <div>
            <h1>Recipe Organizer</h1>
            <div>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button onClick={register}>Register</button>
                <button onClick={login}>Login</button>
            </div>
            
            <h2>Add Recipe</h2>
            <div>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <textarea 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                ></textarea>
                <input 
                    type="text" 
                    placeholder="Category" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Image URL" 
                    value={image} 
                    onChange={(e) => setImage(e.target.value)} 
                />
                <button onClick={addRecipe}>Add Recipe</button>
            </div>

            <h2>Recipes</h2>
            <div>
                {recipes.map(recipe => (
                    <div key={recipe.id}>
                        <h3>{recipe.title}</h3>
                        <p>{recipe.description}</p>
                        <p>Category: {recipe.category}</p>
                        {recipe.image && <img src={recipe.image} alt={recipe.title} style={{ maxWidth: '200px' }} />}
                        <div>
                            <input 
                                type="text" 
                                placeholder="New Title" 
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                            <textarea 
                                placeholder="New Description" 
                                onChange={(e) => setDescription(e.target.value)} 
                            ></textarea>
                            <input 
                                type="text" 
                                placeholder="New Category" 
                                onChange={(e) => setCategory(e.target.value)} 
                            />
                            <input 
                                type="text" 
                                placeholder="New Image URL" 
                                onChange={(e) => setImage(e.target.value)} 
                            />
                            <button onClick={() => editRecipe(recipe.id)}>Edit Recipe</button>
                            <button onClick={() => deleteRecipe(recipe.id)}>Delete Recipe</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
