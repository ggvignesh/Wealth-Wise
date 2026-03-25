#!/usr/bin/env bash
# Render Build Script — builds React frontend then installs Python deps
set -e

echo "======================================"
echo "  WealthWise — Render Build Script"
echo "======================================"

# Step 1: Build React frontend
echo ""
echo "[1/2] Building React frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..
echo "  React build complete → frontend/build/"

# Step 2: Install Python dependencies
echo ""
echo "[2/2] Installing Python dependencies..."
cd backend
pip install -r requirements.txt
cd ..
echo "  Python packages installed"

echo ""
echo "Build complete!"
