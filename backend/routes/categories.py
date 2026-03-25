from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import Category
from database import db

categories_bp = Blueprint('categories', __name__)


@categories_bp.route('/', methods=['GET'])
@jwt_required()
def get_categories():
    cat_type = request.args.get('type')
    query = Category.query
    if cat_type:
        query = query.filter(
            (Category.type == cat_type) | (Category.type == 'both')
        )
    cats = query.all()
    return jsonify({'categories': [c.to_dict() for c in cats]}), 200
