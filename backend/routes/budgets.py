from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Budget, Transaction
from database import db
from datetime import datetime
from sqlalchemy import func

budgets_bp = Blueprint('budgets', __name__)


@budgets_bp.route('/', methods=['GET'])
@jwt_required()
def get_budgets():
    user_id = get_jwt_identity()
    now = datetime.utcnow()
    month = request.args.get('month', now.month, type=int)
    year = request.args.get('year', now.year, type=int)

    budgets = Budget.query.filter_by(user_id=user_id, month=month, year=year).all()
    result = []
    for b in budgets:
        spent = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == user_id,
            Transaction.type == 'expense',
            Transaction.category_id == b.category_id,
            func.extract('month', Transaction.date) == month,
            func.extract('year', Transaction.date) == year
        ).scalar() or 0
        d = b.to_dict()
        d['spent'] = float(spent)
        d['remaining'] = float(b.amount) - float(spent)
        d['percentage'] = round((float(spent) / float(b.amount) * 100) if float(b.amount) > 0 else 0, 1)
        result.append(d)

    return jsonify({'budgets': result}), 200


@budgets_bp.route('/', methods=['POST'])
@jwt_required()
def add_budget():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not all(k in data for k in ['amount', 'month', 'year']):
        return jsonify({'error': 'Missing required fields'}), 400

    existing = Budget.query.filter_by(
        user_id=user_id,
        category_id=data.get('category_id'),
        month=data['month'],
        year=data['year']
    ).first()

    if existing:
        existing.amount = data['amount']
        existing.alert_threshold = data.get('alert_threshold', 80)
        db.session.commit()
        return jsonify({'message': 'Budget updated', 'budget': existing.to_dict()}), 200

    budget = Budget(
        user_id=user_id,
        category_id=data.get('category_id'),
        amount=data['amount'],
        month=data['month'],
        year=data['year'],
        alert_threshold=data.get('alert_threshold', 80)
    )
    db.session.add(budget)
    db.session.commit()
    return jsonify({'message': 'Budget created', 'budget': budget.to_dict()}), 201


@budgets_bp.route('/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    user_id = get_jwt_identity()
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    if not budget:
        return jsonify({'error': 'Budget not found'}), 404
    db.session.delete(budget)
    db.session.commit()
    return jsonify({'message': 'Deleted'}), 200
