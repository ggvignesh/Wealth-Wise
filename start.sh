#!/bin/bash

# Colors
GREEN='\033[0;32m'
GOLD='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

clear
echo -e "${GOLD}${BOLD}"
echo "  ██╗    ██╗███████╗ █████╗ ██╗  ████████╗██╗  ██╗██╗    ██╗██╗███████╗███████╗"
echo "  ██║    ██║██╔════╝██╔══██╗██║  ╚══██╔══╝██║  ██║██║    ██║██║██╔════╝██╔════╝"
echo "  ██║ █╗ ██║█████╗  ███████║██║     ██║   ███████║██║ █╗ ██║██║███████╗█████╗  "
echo "  ██║███╗██║██╔══╝  ██╔══██║██║     ██║   ██╔══██║██║███╗██║██║╚════██║██╔══╝  "
echo "  ╚███╔███╔╝███████╗██║  ██║███████╗██║   ██║  ██║╚███╔███╔╝██║███████║███████╗"
echo "   ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝"
echo -e "${NC}"
echo -e "${CYAN}  Smart Finance, Smarter You${NC}"
echo "  -------------------------------------------------------"
echo ""

# ---- Step 1: Check prerequisites ----
echo -e "${BOLD}[1/5] Checking prerequisites...${NC}"

if ! command -v python3 &>/dev/null && ! command -v python &>/dev/null; then
    echo -e "${RED}  ERROR: Python not found. Please install Python 3.8+${NC}"
    exit 1
fi
PYTHON=$(command -v python3 || command -v python)
echo -e "${GREEN}  ✓ Python: $($PYTHON --version)${NC}"

if ! command -v node &>/dev/null; then
    echo -e "${RED}  ERROR: Node.js not found. Please install Node.js 16+${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Node: $(node --version)${NC}"

if ! command -v mysql &>/dev/null; then
    echo -e "${RED}  ERROR: MySQL not found. Please install MySQL and ensure it's in PATH${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ MySQL found${NC}"

# ---- Step 2: Setup Database ----
echo ""
echo -e "${BOLD}[2/5] Setting up MySQL database...${NC}"
echo -e "${GOLD}  Enter your MySQL root password:${NC}"
mysql -u root -p < database_setup.sql
if [ $? -ne 0 ]; then
    echo -e "${GOLD}  WARNING: Database may already exist. Continuing...${NC}"
fi
echo -e "${GREEN}  ✓ Database ready${NC}"

# ---- Step 3: Configure Backend ----
echo ""
echo -e "${BOLD}[3/5] Configuring backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GOLD}  Created .env — please set your MySQL password:${NC}"
    echo ""
    echo -e "${GOLD}  Edit the file:  nano backend/.env${NC}"
    echo -e "${GOLD}  Change:  DATABASE_URL=mysql+pymysql://root:${RED}YOUR_PASSWORD${GOLD}@localhost/wealthwise_db${NC}"
    echo ""
    read -p "  Press ENTER once you've updated backend/.env with your MySQL password..."
fi

# ---- Step 4: Install Python deps & start backend ----
echo ""
echo -e "${BOLD}[4/5] Installing Python dependencies & starting backend...${NC}"
$PYTHON -m pip install -r requirements.txt -q
echo -e "${GREEN}  ✓ Python packages installed${NC}"

$PYTHON app.py &
BACKEND_PID=$!
echo -e "${GREEN}  ✓ Flask backend started (PID: $BACKEND_PID) → http://localhost:5000${NC}"
sleep 2
cd ..

# ---- Step 5: Install npm deps & start frontend ----
echo ""
echo -e "${BOLD}[5/5] Installing npm packages & starting React frontend...${NC}"
cd frontend
npm install --silent
echo -e "${GREEN}  ✓ npm packages installed${NC}"
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GOLD}${BOLD}  -------------------------------------------------------${NC}"
echo -e "${GREEN}${BOLD}  WealthWise is starting up! 🚀${NC}"
echo ""
echo -e "  ${BOLD}Frontend:${NC}  ${CYAN}http://localhost:3000${NC}"
echo -e "  ${BOLD}Backend:${NC}   ${CYAN}http://localhost:5000${NC}"
echo -e "${GOLD}${BOLD}  -------------------------------------------------------${NC}"
echo ""
echo -e "  Wait ~20 seconds for React to compile, then visit:"
echo -e "  ${CYAN}http://localhost:3000${NC}"
echo ""
echo -e "  Press ${RED}Ctrl+C${NC} to stop both servers."
echo ""

# Keep script alive, kill both on Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
