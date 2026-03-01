# Q-Transition

**Q-Transition** is a full-stack advanced prototype demonstrating a **Quantum-Safe Blockchain** and an **Enterprise Migration Framework for Supply Chains**.

As the threat of cryptographically-relevant quantum computers (Q-Day) approaches, classical cryptographic systems like RSA and ECC will become vulnerable to Shor's Algorithm. Q-Transition provides an interactive, visual dashboard to understand these vulnerabilities and map out a mitigation strategy using Post-Quantum Cryptography (PQC).

## Features

1. **Cryptographic Engine Toggle**
   - Switch the entire simulation between **Classical (RSA)** and **Post-Quantum** (modeling lattice-based algorithms like CRYSTALS-Dilithium/Kyber).
   - View real-time performance benchmarks comparing key generation times, signing/verification speeds, and public key sizes.

2. **Supply Chain Blockchain Simulation**
   - A mock flow tracking assets from Manufacturer -> Distributor -> Retailer.
   - Watch blocks get mined and validated dynamically using the selected cryptographic standard.

3. **Quantum Attack Simulation Insight**
   - Uses theoretical models to evaluate the current active cryptography. 
   - When on Classical mode, it details how many physical/logical qubits are needed to break the encryption via Shor's Algorithm.

4. **Enterprise HNDL Risk Scanner**
   - **Harvest Now, Decrypt Later (HNDL)** risk calculation.
   - Upload or paste a JSON portfolio of your enterprise architecture systems.
   - The engine will scan the data lifespan, criticality, and current cryptographic algorithms to assign a Portfolio Risk Score (0-100).
   - Generates a **Phased Migration Plan** with cost estimates and timelines.

## Tech Stack

- **Backend**: Python (FastAPI), Qiskit theory mappings, Uvicorn
- **Frontend**: React, Vite, Framer Motion, Recharts, Lucide Icons

## Getting Started

### 1. Start the Backend API

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install fastapi uvicorn rsa ecdsa pycryptodome pandas
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Start the Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
```

The React dashboard will be accessible at `http://localhost:5173` (or the port specified by Vite).

## Custom Testing

To test your own enterprise systems, you can use the `"Scan Custom Sample"` feature on the dashboard. You can upload a JSON file formatted like this:

```json
[
  {
    "name": "Global Payment Gateway",
    "crypto": "RSA-2048",
    "criticality": "High",
    "data_lifespan_years": 25.0
  }
]
```
