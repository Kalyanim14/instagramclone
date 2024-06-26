from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB configuration
app.config['MONGO_URI'] = 'mongodb://localhost:27017/my_posts_database'
mongo = PyMongo(app)

# Routes for CRUD operations

# Create a post
@app.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if title and content:
        post_id = mongo.db.posts.insert_one({'title': title, 'content': content}).inserted_id
        return jsonify({'message': 'Post created successfully', 'post_id': str(post_id)}), 201
    else:
        return jsonify({'error': 'Missing title or content in request'}), 400

# Get all posts
@app.route('/posts', methods=['GET'])
def get_all_posts():
    posts = list(mongo.db.posts.find())
    for post in posts:
        post['_id'] = str(post['_id'])  # Convert ObjectId to string for JSON serialization
    return jsonify({'posts': posts})

# Update a post
# Update a post
@app.route('/posts/<post_id>', methods=['PUT'])
def update_post(post_id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if title and content:
        try:
            result = mongo.db.posts.update_one({'_id': ObjectId(post_id)}, {'$set': {'title': title, 'content': content}})
            if result.modified_count > 0:
                return jsonify({'message': 'Post updated successfully'})
            else:
                return jsonify({'error': 'Post not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Missing title or content in request'}), 400

# Delete a post
@app.route('/posts/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    result = mongo.db.posts.delete_one({'_id': ObjectId(post_id)})
    if result.deleted_count > 0:
        return jsonify({'message': 'Post deleted successfully'})
    else:
        return jsonify({'error': 'Post not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
