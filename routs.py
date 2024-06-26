from flask import Blueprint, request, jsonify
from flask_login import login_user, current_user, logout_user, login_required
from models import db, User, Recipe
from utils import hash_password, check_password

auth_routes = Blueprint('auth', __name__)
recipe_routes = Blueprint('recipe', __name__)

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = hash_password(data['password'])
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(message="User registered"), 201

@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password(user.password, data['password']):
        login_user(user)
        return jsonify(message="Login successful"), 200
    return jsonify(message="Invalid credentials"), 401

@auth_routes.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify(message="Logout successful"), 200

@recipe_routes.route('/recipes', methods=['GET'])
@login_required
def get_recipes():
    recipes = Recipe.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': recipe.id,
        'title': recipe.title,
        'description': recipe.description,
        'image': recipe.image,
        'category': recipe.category
    } for recipe in recipes])

@recipe_routes.route('/recipes', methods=['POST'])
@login_required
def add_recipe():
    data = request.get_json()
    new_recipe = Recipe(
        title=data['title'], 
        description=data['description'], 
        image=data.get('image'), 
        category=data['category'], 
        user_id=current_user.id
    )
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify(message="Recipe added"), 201

@recipe_routes.route('/recipes/<int:recipe_id>', methods=['PUT'])
@login_required
def edit_recipe(recipe_id):
    recipe = Recipe.query.filter_by(id=recipe_id, user_id=current_user.id).first()
    if recipe:
        data = request.get_json()
        recipe.title = data['title']
        recipe.description = data['description']
        recipe.image = data.get('image')
        recipe.category = data['category']
        db.session.commit()
        return jsonify(message="Recipe updated"), 200
    return jsonify(message="Recipe not found"), 404

@recipe_routes.route('/recipes/<int:recipe_id>', methods=['DELETE'])
@login_required
def delete_recipe(recipe_id):
    recipe = Recipe.query.filter_by(id=recipe_id, user_id=current_user.id).first()
    if recipe:
        db.session.delete(recipe)
        db.session.commit()
        return jsonify(message="Recipe deleted"), 200
    return jsonify(message="Recipe not found"), 404
