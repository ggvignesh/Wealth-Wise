from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Transaction, Budget, Category
from database import db
from datetime import datetime, date
from sqlalchemy import func
import calendar

analytics_bp = Blueprint('analytics', __name__)


@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    now = datetime.utcnow()
    month = request.args.get('month', now.month, type=int)
    year = request.args.get('year', now.year, type=int)

    # Monthly totals
    def monthly_total(txn_type):
        result = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == user_id,
            Transaction.type == txn_type,
            func.extract('month', Transaction.date) == month,
            func.extract('year', Transaction.date) == year
        ).scalar()
        return float(result or 0)

    income = monthly_total('income')
    expenses = monthly_total('expense')
    savings = income - expenses

    # Category breakdown for expenses
    cat_breakdown = db.session.query(
        Category.name, Category.icon, Category.color,
        func.sum(Transaction.amount).label('total')
    ).join(Transaction, Transaction.category_id == Category.id).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense',
        func.extract('month', Transaction.date) == month,
        func.extract('year', Transaction.date) == year
    ).group_by(Category.id).all()

    # Last 6 months trend
    trend = []
    for i in range(5, -1, -1):
        m = month - i
        y = year
        while m <= 0:
            m += 12
            y -= 1
        inc = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == user_id,
            Transaction.type == 'income',
            func.extract('month', Transaction.date) == m,
            func.extract('year', Transaction.date) == y
        ).scalar() or 0
        exp = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == user_id,
            Transaction.type == 'expense',
            func.extract('month', Transaction.date) == m,
            func.extract('year', Transaction.date) == y
        ).scalar() or 0
        trend.append({
            'month': calendar.month_abbr[m],
            'year': y,
            'income': float(inc),
            'expenses': float(exp),
            'savings': float(inc) - float(exp)
        })

    # Recent transactions
    recent = Transaction.query.filter_by(user_id=user_id).order_by(
        Transaction.date.desc()).limit(5).all()

    # Budget alerts
    budgets = Budget.query.filter_by(user_id=user_id, month=month, year=year).all()
    alerts = []
    for b in budgets:
        spent = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == user_id,
            Transaction.type == 'expense',
            Transaction.category_id == b.category_id,
            func.extract('month', Transaction.date) == month,
            func.extract('year', Transaction.date) == year
        ).scalar() or 0
        pct = (float(spent) / float(b.amount) * 100) if float(b.amount) > 0 else 0
        if pct >= b.alert_threshold:
            alerts.append({
                'budget': b.to_dict(),
                'spent': float(spent),
                'percentage': round(pct, 1),
                'exceeded': pct >= 100
            })

    return jsonify({
        'summary': {
            'income': income,
            'expenses': expenses,
            'savings': savings,
            'savings_rate': round((savings / income * 100) if income > 0 else 0, 1)
        },
        'category_breakdown': [
            {'name': r.name, 'icon': r.icon, 'color': r.color, 'total': float(r.total)}
            for r in cat_breakdown
        ],
        'trend': trend,
        'recent_transactions': [t.to_dict() for t in recent],
        'budget_alerts': alerts
    }), 200


@analytics_bp.route('/monthly-report', methods=['GET'])
@jwt_required()
def monthly_report():
    user_id = get_jwt_identity()
    month = request.args.get('month', datetime.utcnow().month, type=int)
    year = request.args.get('year', datetime.utcnow().year, type=int)

    # Daily spending in the month
    daily = db.session.query(
        Transaction.date,
        Transaction.type,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == user_id,
        func.extract('month', Transaction.date) == month,
        func.extract('year', Transaction.date) == year
    ).group_by(Transaction.date, Transaction.type).order_by(Transaction.date).all()

    days_in_month = calendar.monthrange(year, month)[1]
    daily_map = {}
    for row in daily:
        day_str = row.date.strftime('%Y-%m-%d')
        if day_str not in daily_map:
            daily_map[day_str] = {'date': day_str, 'income': 0, 'expense': 0}
        daily_map[day_str][row.type] = float(row.total)

    daily_list = []
    for day in range(1, days_in_month + 1):
        d = date(year, month, day).strftime('%Y-%m-%d')
        daily_list.append(daily_map.get(d, {'date': d, 'income': 0, 'expense': 0}))

    # Category-wise for pie
    cat_income = db.session.query(
        Category.name, Category.icon, Category.color,
        func.sum(Transaction.amount).label('total')
    ).join(Transaction, Transaction.category_id == Category.id).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'income',
        func.extract('month', Transaction.date) == month,
        func.extract('year', Transaction.date) == year
    ).group_by(Category.id).all()

    cat_expense = db.session.query(
        Category.name, Category.icon, Category.color,
        func.sum(Transaction.amount).label('total')
    ).join(Transaction, Transaction.category_id == Category.id).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense',
        func.extract('month', Transaction.date) == month,
        func.extract('year', Transaction.date) == year
    ).group_by(Category.id).all()

    return jsonify({
        'daily': daily_list,
        'income_by_category': [
            {'name': r.name, 'icon': r.icon, 'color': r.color, 'total': float(r.total)}
            for r in cat_income
        ],
        'expense_by_category': [
            {'name': r.name, 'icon': r.icon, 'color': r.color, 'total': float(r.total)}
            for r in cat_expense
        ],
        'month': month,
        'year': year,
        'month_name': calendar.month_name[month]
    }), 200
