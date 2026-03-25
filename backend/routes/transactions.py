from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Transaction, Category
from database import db
from datetime import datetime, date

transactions_bp = Blueprint('transactions', __name__)


@transactions_bp.route('/', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    type_filter = request.args.get('type')
    category_id = request.args.get('category_id', type=int)
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)
    search = request.args.get('search', '')

    query = Transaction.query.filter_by(user_id=user_id)

    if type_filter:
        query = query.filter_by(type=type_filter)
    if category_id:
        query = query.filter_by(category_id=category_id)
    if month and year:
        query = query.filter(
            db.extract('month', Transaction.date) == month,
            db.extract('year', Transaction.date) == year
        )
    elif year:
        query = query.filter(db.extract('year', Transaction.date) == year)
    if search:
        query = query.filter(Transaction.description.ilike(f'%{search}%'))

    query = query.order_by(Transaction.date.desc(), Transaction.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'transactions': [t.to_dict() for t in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages,
        'current_page': page
    }), 200


@transactions_bp.route('/', methods=['POST'])
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not all(k in data for k in ['type', 'amount', 'date']):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        txn_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    txn = Transaction(
        user_id=user_id,
        type=data['type'],
        amount=float(data['amount']),
        description=data.get('description', ''),
        date=txn_date,
        notes=data.get('notes', ''),
        payment_method=data.get('payment_method', 'cash'),
        category_id=data.get('category_id')
    )
    db.session.add(txn)
    db.session.commit()

    return jsonify({'message': 'Transaction added', 'transaction': txn.to_dict()}), 201


@transactions_bp.route('/<int:txn_id>', methods=['PUT'])
@jwt_required()
def update_transaction(txn_id):
    user_id = get_jwt_identity()
    txn = Transaction.query.filter_by(id=txn_id, user_id=user_id).first()
    if not txn:
        return jsonify({'error': 'Transaction not found'}), 404

    data = request.get_json()
    for field in ['type', 'amount', 'description', 'notes', 'payment_method', 'category_id']:
        if field in data:
            setattr(txn, field, data[field])
    if 'date' in data:
        txn.date = datetime.strptime(data['date'], '%Y-%m-%d').date()

    db.session.commit()
    return jsonify({'message': 'Updated', 'transaction': txn.to_dict()}), 200


@transactions_bp.route('/<int:txn_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(txn_id):
    user_id = get_jwt_identity()
    txn = Transaction.query.filter_by(id=txn_id, user_id=user_id).first()
    if not txn:
        return jsonify({'error': 'Transaction not found'}), 404
    db.session.delete(txn)
    db.session.commit()
    return jsonify({'message': 'Deleted'}), 200
