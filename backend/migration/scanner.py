import random

class EnterpriseMigrationScanner:
    def __init__(self, custom_systems=None):
        # Use custom systems if provided, otherwise default mock
        if custom_systems is not None:
            self.systems = custom_systems
        else:
            self.systems = [
                {"name": "Core Banking Ledger", "crypto": "RSA-2048", "criticality": "High", "data_lifespan_years": 50},
                {"name": "Supply Chain DB", "crypto": "ECC-256", "criticality": "High", "data_lifespan_years": 10},
                {"name": "HR Portal Auth", "crypto": "RSA-1024", "criticality": "Medium", "data_lifespan_years": 5},
                {"name": "Public Blog API", "crypto": "SHA-256", "criticality": "Low", "data_lifespan_years": 0.5}
            ]

    def scan_environment(self, mode="Classical"):
        results = []
        total_risk = 0
        
        for sys in self.systems:
            crypto_algo = sys["crypto"]
            
            # If Post-Quantum mode, simulate the enterprise upgrading their vulnerable systems
            is_upgraded = False
            if mode == "PQC":
                if "RSA" in crypto_algo or "ECC" in crypto_algo:
                    crypto_algo = "CRYSTALS-Dilithium (Upgraded)"
                    is_upgraded = True

            # Calculate Harvest Now, Decrypt Later (HNDL) risk
            # If data lifespan + migration time > time to quantum computer (Q-Day), high risk!
            q_day_estimate = 2030  # Estimated year of cryptographically relevant quantum computer
            current_year = 2026
            
            years_to_q_day = q_day_estimate - current_year
            migration_time = 2  # Estimated years to migrate
            
            # Risk Equation: lifepan + migration_time > years_to_q_day
            if is_upgraded:
                hndl_risk = False
            else:
                hndl_risk = (sys["data_lifespan_years"] + migration_time) > years_to_q_day
            
            # Calculate Risk Score (0-100)
            if "RSA" in crypto_algo or "ECC" in crypto_algo:
                crypto_factor = 1.0
            elif "Kyber" in crypto_algo or "Dilithium" in crypto_algo or "PQC" in crypto_algo:
                crypto_factor = 0.0
            else:
                crypto_factor = 0.1 # Hashes are relatively safer
                
            criticality_map = {"High": 1.0, "Medium": 0.5, "Low": 0.2}
            
            score = int((crypto_factor * criticality_map.get(sys["criticality"], 0.5) * 100))
            if hndl_risk:
                score = min(100, score + 20)
                
            total_risk += score
            
            results.append({
                "system": sys["name"],
                "algorithm": crypto_algo,
                "criticality": sys["criticality"],
                "hndl_exposure": hndl_risk,
                "risk_score": score,
                "recommended_pqc": "CRYSTALS-Kyber/Dilithium" if score > 50 else "Maintain current"
            })
            
        avg_risk = total_risk / len(self.systems)
        
        migration_plan = {
            "phase_1": {"name": "Hybrid Classical + PQC", "timeline": "0-12 months", "cost_est": "$250k"},
            "phase_2": {"name": "Critical Asset Upgrade (Core Ledger & Supply Chain)", "timeline": "12-24 months", "cost_est": "$500k"},
            "phase_3": {"name": "Full Quantum-Safe Adoption", "timeline": "24-36 months", "cost_est": "$300k"}
        }
        
        return {
            "overall_risk_score": int(avg_risk),
            "system_analysis": results,
            "migration_roadmap": migration_plan
        }
