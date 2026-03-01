from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from supply_chain.flow import SupplyChainSystem
from migration.scanner import EnterpriseMigrationScanner
from simulations.qiskit_attack import QuantumAttackSimulator
import uvicorn

app = FastAPI(title="Q-Transition API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Quantum Backend Active"}

@app.get("/benchmark")
def run_benchmark(mode: str = 'Classical'):
    """
    Runs a full supply chain simulation (Manufacturer -> Distributor -> Retailer)
    Metrics include key sizes, generation time, signing time, verification, and block creation.
    """
    try:
        system = SupplyChainSystem(mode=mode)
        result = system.simulate_flow()
        return {"status": "success", "mode": mode, "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

class SystemItem(BaseModel):
    name: str
    crypto: str
    criticality: str
    data_lifespan_years: float

@app.post("/scan")
def run_scan(systems: Optional[List[SystemItem]] = None, mode: str = "Classical"):
    """
    Runs the Enterprise Migration Framework scan across the portfolio
    """
    if systems:
        sys_dicts = [s.dict() for s in systems]
        scanner = EnterpriseMigrationScanner(custom_systems=sys_dicts)
    else:
        scanner = EnterpriseMigrationScanner()
    return scanner.scan_environment(mode=mode)
    
@app.get("/scan")
def run_scan_get(mode: str = "Classical"):
    scanner = EnterpriseMigrationScanner()
    return scanner.scan_environment(mode=mode)

@app.get("/simulate-attack")
def simulate_attack(bits: int = 2048):
    """
    Calculates the quantum attack requirements using Qiskit logic
    """
    simulator = QuantumAttackSimulator()
    rsa_result = simulator.simulate_shors(bits)
    pqc_result = simulator.evaluate_pqc("CRYSTALS-Kyber/Dilithium")
    
    return {
        "classical": rsa_result,
        "pqc": pqc_result
    }

if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
