import axios from 'axios';

export const register = async (email, password) => {
    const response = await axios.post('/register', { email, password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await axios.post('/login', { email, password });
    return response.data;
};

export const fetchRecipes = async () => {
    const response = await axios.get('/recipes');
    return response.data;
};

export const addRecipe = async (title, description, category, image) => {
    const response = await axios.post('/recipes', { title, description, category, image });
    return response.data;
};

export const editRecipe = async (recipeId, title, description, category, image) => {
    const response = await axios.put(`/recipes/${recipeId}`, { title, description, category, image });
    return response.data;
};

export const deleteRecipe = async (recipeId) => {
    const response = await axios.delete(`/recipes/${recipeId}`);
    return response.data;
};
