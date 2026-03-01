import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, ShieldAlert, Activity, Database, Zap, GitBranch } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import './index.css'

// Helper component for animated counting numbers
const AnimatedCounter = ({ value, duration = 1 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTimestamp = null
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [value, duration])

  return <span>{count}</span>
}

// Helper component for particle background
const QuantumBackground = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate static particles for performance
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.1
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="quantum-bg">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left,
          animationDuration: p.animationDuration,
          animationDelay: p.animationDelay,
          opacity: p.opacity
        }} />
      ))}
    </div>
  )
}

function App() {
  const [mode, setMode] = useState('Classical')
  const [metrics, setMetrics] = useState(null)
  const [chain, setChain] = useState([])
  const [loading, setLoading] = useState(true)
  const [attackSim, setAttackSim] = useState(null)
  const [migrationData, setMigrationData] = useState(null)
  const [attackProgress, setAttackProgress] = useState(0)
  const [attackStatus, setAttackStatus] = useState("Idle")
  const [glitchKey, setGlitchKey] = useState(0)
  const [selectedBlock, setSelectedBlock] = useState(null)

  const [customData, setCustomData] = useState(JSON.stringify([
    { "name": "Custom Server 1", "crypto": "RSA-4096", "criticality": "High", "data_lifespan_years": 8 },
    { "name": "Old App", "crypto": "ECC-256", "criticality": "Medium", "data_lifespan_years": 4 }
  ], null, 2))

  useEffect(() => {
    fetchData()
    fetchMigrationData()
    setGlitchKey(prev => prev + 1)

    // Attack Simulation Logic
    setAttackProgress(0)
    if (mode === 'Classical') {
      setAttackStatus("Calculating Qubits...")
      const timer1 = setTimeout(() => { setAttackProgress(20); setAttackStatus("Running Shor's Algorithm...") }, 1000)
      const timer2 = setTimeout(() => { setAttackProgress(60); setAttackStatus("Factoring Modulus...") }, 3000)
      const timer3 = setTimeout(() => { setAttackProgress(100); setAttackStatus("Keys Compromised!") }, 5000)
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3) }
    } else {
      setAttackStatus("Attack Failed: Lattice cryptography is immune.")
    }
  }, [mode])

  useEffect(() => {
    fetchAttackData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8000/benchmark?mode=${mode}`)
      const json = await res.json()
      if (json.status === 'success') {
        setMetrics(json.data.metrics)
        setChain(json.data.chain)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const fetchAttackData = async () => {
    try {
      const res = await fetch(`http://localhost:8000/simulate-attack`)
      const json = await res.json()
      setAttackSim(json)
    } catch (e) { }
  }

  const fetchMigrationData = async () => {
    try {
      const res = await fetch(`http://localhost:8000/scan?mode=${mode}`)
      const json = await res.json()
      setMigrationData(json)
    } catch (e) { }
  }

  const handleCustomScan = async () => {
    try {
      const parsed = JSON.parse(customData)
      const res = await fetch(`http://localhost:8000/scan?mode=${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsed)
      })
      if (!res.ok) {
        throw new Error("Server validation failed. Ensure correct JSON fields.")
      }
      const json = await res.json()
      setMigrationData(json)
    } catch (e) {
      alert("Error processing custom sample:\n" + e.message)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonText = event.target.result;
          JSON.parse(jsonText); // Validate JSON
          setCustomData(jsonText);
        } catch (error) {
          alert("Uploaded file does not contain valid JSON.");
        }
      };
      reader.readAsText(file);
    }
  }

  const getChartData = () => {
    if (!metrics) return []
    return [
      { name: 'Key Gen (ms)', value: metrics.key_gen_time_ms },
      { name: 'Sign (ms)', value: metrics.sig_time_ms },
      { name: 'Verify (ms)', value: metrics.verify_time_ms }
    ]
  }

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo-area">
          <h1>Q-Transition</h1>
          <p>Quantum-Safe Blockchain & Enterprise Migration Framework</p>
        </div>

        <div className="toggle-container">
          <button
            className={`toggle-btn ${mode === 'Classical' ? 'active classical' : ''}`}
            onClick={() => setMode('Classical')}
          >
            <ShieldAlert size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Classical (RSA)
          </button>
          <button
            className={`toggle-btn ${mode === 'PQC' ? 'active pqc' : ''}`}
            onClick={() => setMode('PQC')}
          >
            <Shield size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Post-Quantum
          </button>
        </div>
      </header>

      <QuantumBackground />

      <div className="grid-3">
        <motion.div className="glass-panel metric-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Activity size={20} /> <span className="metric-label">Avg Block Time</span>
          </div>
          <span className="metric-value">
            {metrics ? <AnimatedCounter value={Math.floor(metrics.block_time_ms)} /> : '--'}.{metrics ? (metrics.block_time_ms % 1).toFixed(2).substring(2) : '00'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ms</span>
          </span>
        </motion.div>

        <motion.div className="glass-panel metric-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Database size={20} /> <span className="metric-label">Public Key Size</span>
          </div>
          <span className="metric-value">
            {metrics ? <AnimatedCounter value={metrics.pub_key_size_bytes} /> : '--'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>bytes</span>
          </span>
        </motion.div>

        <motion.div className="glass-panel metric-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Zap size={20} /> <span className="metric-label">Security State</span>
          </div>
          <span className="metric-value" style={{ color: mode === 'Classical' ? 'var(--accent-danger)' : 'var(--accent-primary)', fontSize: '1.5rem', paddingTop: '0.5rem' }}>
            {mode === 'Classical' ? "Vulnerable to Shor's" : "Quantum-Resistant"}
          </span>
        </motion.div>
      </div>

      <div className="grid-2">
        <motion.div className="glass-panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={24} /> Cryptographic Performance</h2>
          <div className="metric-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="value" fill={mode === 'Classical' ? 'var(--accent-danger)' : 'var(--accent-primary)'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>Notice: Post-Quantum Cryptography (like Kyber/Dilithium) often has larger key sizes but can be heavily optimized for speed (as shown by mocked metrics).</p>
        </motion.div>

        <motion.div className="glass-panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><GitBranch size={24} /> Blockchain State (Supply Chain)</h2>
          <motion.div key={glitchKey} initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.4 }} className="chain-viewer">
            {loading ? 'Mining blocks...' : chain.map((block, idx) => (
              <div key={idx} className={`block-node ${mode === 'Classical' ? (attackProgress === 100 ? 'compromised' : 'vulnerable') : 'secure'}`} onClick={() => setSelectedBlock(block)}>
                <div className="block-header">
                  <span>Block #{block.index}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(block.timestamp * 1000).toLocaleTimeString()}</span>
                </div>
                <div className="block-hash">
                  Prev: {block.previous_hash.substring(0, 16)}...
                </div>
                <div className="block-txs">
                  {block.transactions.length} Transactions<br />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secured via {mode === 'Classical' ? 'RSA-2048' : 'Dilithium'}</span>
                </div>

                {mode === 'Classical' && (
                  <div style={{ marginTop: '1rem' }}>
                    <div className="attack-status">
                      <span>{attackStatus}</span>
                      <span>{attackProgress}%</span>
                    </div>
                    <div className="attack-bar-container">
                      <div className="attack-bar" style={{ width: `${attackProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {migrationData && attackSim && (
        <div className="grid-2">
          <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 style={{ marginBottom: '1rem' }}>Enterprise HNDL Risk Scan</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: migrationData.overall_risk_score > 50 ? 'var(--accent-danger)' : 'var(--accent-primary)' }}>
                <AnimatedCounter value={migrationData.overall_risk_score} />/100
              </div>
              <div style={{ color: 'var(--text-muted)' }}>Overall Portfolio Quantum Risk<br />(Harvest Now, Decrypt Later)</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Test Custom Sample (JSON Array)</h4>
              <textarea
                style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }}
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={handleCustomScan}
                  style={{ background: 'var(--accent-secondary)', color: '#000', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Scan Custom Sample
                </button>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>or upload .json file:</div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div className="system-grid">
              {migrationData.system_analysis.map((sys, idx) => (
                <div key={idx} className={`system-node ${sys.hndl_exposure ? 'risk-high' : 'risk-low'}`}>
                  <div className="sys-content">
                    <h4 style={{ marginBottom: '0.2rem', color: 'var(--text-main)', fontSize: '1.1rem' }}>{sys.system}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Current: {sys.algorithm} | Criticality: {sys.criticality}</div>
                    <div>
                      {sys.hndl_exposure ?
                        <span style={{ display: 'inline-block', background: 'rgba(255, 61, 0, 0.2)', color: 'var(--accent-danger)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,61,0,0.5)', fontWeight: 'bold', fontSize: '0.75rem', animation: 'pulse-red 1s infinite alternate' }}>BREACH EXPOSURE</span> :
                        <span style={{ display: 'inline-block', background: 'rgba(0, 230, 118, 0.2)', color: 'var(--accent-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(0,230,118,0.5)', fontWeight: 'bold', fontSize: '0.75rem' }}>QUANTUM SECURE</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 style={{ marginBottom: '1rem' }}>Phased Migration Plan</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div>
                  <h4 style={{ color: 'var(--accent-secondary)' }}>Phase 1: {migrationData.migration_roadmap.phase_1.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Timeline: {migrationData.migration_roadmap.phase_1.timeline}</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>Deploy PQC alongside classical algorithms. Ensures backward compatibility with legacy systems while securing data transfers against future quantum decryption.</p>
                </div>
                <div style={{ fontWeight: 'bold' }}>{migrationData.migration_roadmap.phase_1.cost_est}</div>
              </div>
              <div className="timeline-item">
                <div>
                  <h4 style={{ color: 'var(--accent-secondary)' }}>Phase 2: {migrationData.migration_roadmap.phase_2.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Timeline: {migrationData.migration_roadmap.phase_2.timeline}</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>Prioritize migration of components highlighted as HIGH RISK in the HNDL scan above (e.g., identity databases, core ledgers) to pure Post-Quantum standards.</p>
                </div>
                <div style={{ fontWeight: 'bold' }}>{migrationData.migration_roadmap.phase_2.cost_est}</div>
              </div>
              <div className="timeline-item">
                <div>
                  <h4 style={{ color: 'var(--accent-primary)' }}>Phase 3: {migrationData.migration_roadmap.phase_3.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Timeline: {migrationData.migration_roadmap.phase_3.timeline}</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>Full deprecation of RSA and ECC globally. Zero reliance on classical asymmetric primitives, achieving complete enterprise quantum immunity.</p>
                </div>
                <div style={{ fontWeight: 'bold' }}>{migrationData.migration_roadmap.phase_3.cost_est}</div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Qiskit Simulation Insight</h4>
              <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-muted)' }}>
                {mode === 'Classical' ? attackSim.classical.message : attackSim.pqc.message}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Block Details Modal */}
      {selectedBlock && (
        <div className="modal-overlay" onClick={() => setSelectedBlock(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>Block #{selectedBlock.index} Details</h2>
              <button className="close-btn" onClick={() => setSelectedBlock(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>
                <strong>Time:</strong> {new Date(selectedBlock.timestamp * 1000).toLocaleString()}<br />
                <strong>Hash:</strong> {selectedBlock.hash}<br />
                <strong>Prev:</strong> {selectedBlock.previous_hash}
              </p>
              <h3 style={{ color: 'var(--accent-secondary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Transactions ({selectedBlock.transactions.length})</h3>
              {selectedBlock.transactions.length === 0 ? <p>No transactions in this block (Genesis chunk)</p> : null}
              {selectedBlock.transactions.map((tx, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', borderLeft: '3px solid var(--accent-primary)' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Asset Transfer: </span>
                    <strong style={{ color: 'var(--text-main)' }}>{tx.asset_id || "System Init"}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ marginBottom: '0.3rem' }}><span style={{ color: 'var(--text-muted)' }}>Sender PK:</span><br /> {tx.sender.substring(0, 60)}...</div>
                    <div style={{ marginBottom: '0.5rem' }}><span style={{ color: 'var(--text-muted)' }}>Receiver PK:</span><br /> {tx.receiver.substring(0, 60)}...</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Signature Validation ({mode}):</span><br /> <span style={{ color: mode === 'Classical' ? 'var(--accent-danger)' : 'var(--accent-primary)', wordBreak: 'break-all' }}>{tx.signature}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
