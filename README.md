# 🤖 DealMindAI – Multi-Agent Negotiation System

NegotiaAI is an AI-powered web platform where autonomous agents representing a **Buyer 🛒**, **Seller 🏪**, and **Mediator ⚖️** negotiate with each other to reach the best possible deal in real time.
The system simulates intelligent negotiations using multiple AI agents and visualizes the negotiation process through a simple web dashboard.

---

# 🚀 Project Overview

This project demonstrates how **multi-agent systems** can collaborate and compete to solve negotiation problems automatically.

Three AI agents interact with each other:

* **Buyer Agent 🛒** – tries to purchase the product at the lowest possible price.
* **Seller Agent 🏪** – tries to sell the product at the highest possible price.
* **Mediator Agent ⚖️** – monitors the negotiation and suggests fair compromises.

The agents exchange offers until a **mutually acceptable agreement 🤝** is reached.

---

# ✨ Features

✅ Multi-agent negotiation simulation
✅ Buyer, Seller, and Mediator AI agents
✅ Real-time negotiation rounds visualization
✅ Automated deal generation
✅ Simple and interactive web interface
✅ Negotiation history tracking

---

# 🧠 How It Works

1. The user enters negotiation parameters such as:

   * Product name
   * Buyer budget
   * Seller asking price
   * Seller minimum price

2. The system starts the negotiation process.

3. Each round includes:

   * Buyer making an offer
   * Seller providing a counter-offer
   * Mediator analyzing the negotiation

4. The negotiation continues until:

   * A deal is reached 🤝
   * Or the maximum rounds are completed.

---

# 🏗️ System Architecture

Frontend → Backend API → Negotiation Manager → AI Agents

Agents involved:

* Buyer Agent
* Seller Agent
* Mediator Agent

The negotiation manager coordinates communication between all agents and tracks the negotiation history.

---

# 🛠️ Tech Stack

### Frontend

* React
* Tailwind CSS
* Chart.js (for visualization)

### Backend

* Python FastAPI (or Node.js Express)

### AI / Agents

* LLM-based prompts
* Agent-based decision logic

### Database (Optional)

* PostgreSQL / MongoDB

---

# 📂 Project Structure

```
project-root
│
├── frontend
│   ├── components
│   ├── pages
│   └── dashboard
│
├── backend
│   ├── agents
│   │   ├── buyer_agent.py
│   │   ├── seller_agent.py
│   │   └── mediator_agent.py
│   │
│   ├── routes
│   └── negotiation_manager.py
│
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```
git clone https://github.com/yourusername/negotiaAI.git
```

Move into the project folder

```
cd negotiAIAI
```

Install backend dependencies

```
pip install -r requirements.txt
```

Start the backend server

```
uvicorn main:app --reload
```

Start frontend

```
npm install
npm run dev
```

---

# 📊 Example Negotiation

```
Round 1
Buyer → ₹10,000
Seller → ₹15,000

Round 2
Buyer → ₹11,000
Seller → ₹14,000

Round 3
Buyer → ₹12,000
Seller → ₹13,000

Mediator Suggestion → ₹12,500

Final Deal 🤝 → ₹12,500
```

---

# 🔮 Future Improvements

* Reinforcement learning negotiation strategies
* Multi-product negotiations
* Sentiment analysis for negotiation behavior
* Live WebSocket negotiation updates
* Advanced analytics dashboard

---

# 🎯 Use Cases

* E-commerce price negotiation
* Marketplace automation
* Business deal simulations
* AI research on multi-agent systems

---

# 👨‍💻 Author

**Project Authour Sanya Gupta**

---

# ⭐ Support

If you like this project, please ⭐ the repository and share it .
