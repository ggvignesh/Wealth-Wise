from models import Category
from database import db

DEFAULT_CATEGORIES = [
    {'name': 'Salary', 'type': 'income', 'icon': '💼', 'color': '#10b981'},
    {'name': 'Freelance', 'type': 'income', 'icon': '💻', 'color': '#6366f1'},
    {'name': 'Investment', 'type': 'income', 'icon': '📈', 'color': '#f59e0b'},
    {'name': 'Business', 'type': 'income', 'icon': '🏢', 'color': '#3b82f6'},
    {'name': 'Other Income', 'type': 'income', 'icon': '💰', 'color': '#8b5cf6'},
    {'name': 'Food & Dining', 'type': 'expense', 'icon': '🍽️', 'color': '#ef4444'},
    {'name': 'Transportation', 'type': 'expense', 'icon': '🚗', 'color': '#f97316'},
    {'name': 'Shopping', 'type': 'expense', 'icon': '🛍️', 'color': '#ec4899'},
    {'name': 'Entertainment', 'type': 'expense', 'icon': '🎬', 'color': '#a855f7'},
    {'name': 'Healthcare', 'type': 'expense', 'icon': '🏥', 'color': '#14b8a6'},
    {'name': 'Education', 'type': 'expense', 'icon': '📚', 'color': '#3b82f6'},
    {'name': 'Utilities', 'type': 'expense', 'icon': '⚡', 'color': '#eab308'},
    {'name': 'Rent/EMI', 'type': 'expense', 'icon': '🏠', 'color': '#6366f1'},
    {'name': 'Travel', 'type': 'expense', 'icon': '✈️', 'color': '#06b6d4'},
    {'name': 'Groceries', 'type': 'expense', 'icon': '🛒', 'color': '#22c55e'},
    {'name': 'Subscriptions', 'type': 'expense', 'icon': '📱', 'color': '#f43f5e'},
    {'name': 'Insurance', 'type': 'expense', 'icon': '🛡️', 'color': '#64748b'},
    {'name': 'Other Expense', 'type': 'expense', 'icon': '📦', 'color': '#78716c'},
]


def seed_categories():
    if Category.query.count() == 0:
        for cat_data in DEFAULT_CATEGORIES:
            cat = Category(**cat_data, is_default=True)
            db.session.add(cat)
        db.session.commit()
        print("✅ Default categories seeded.")
