import { useState, useEffect } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error(error);
      setResponse("⚠️ Error connecting to AI backend. Please try again.");
    }
    setLoading(false);
  };

  const quickActions = [
    "Bitcoin investment analysis",
    "ETH market trends",
    "DeFi opportunities",
    "Risk assessment",
  ];
  const stats = [
  {
    label: "Multi-Agent AI",
    value: "LangGraph",
    icon: "🤖"
  },
  {
    label: "Market Analysis",
    value: "Real-Time",
    icon: "📈"
  },
  {
    label: "Vector Search",
    value: "RAG Pipeline",
    icon: "🔍"
  },
  {
    label: "Observability",
    value: "Langfuse",
    icon: "⚡"
  }
];

  const [markets, setMarkets] = useState([]);
  useEffect(() => {

  const fetchMarketData = async () => {

    try {

      const res = await fetch("http://127.0.0.1:8000/market");

      const data = await res.json();

      setMarkets(data);

    } catch (error) {

      console.error("Market fetch failed", error);

    }
  };

  fetchMarketData();

const interval = setInterval(fetchMarketData, 30000);

return () => clearInterval(interval);

}, []);

  return (
    <div style={styles.container}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); } }
        textarea:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important; }
        button:hover { transform: translateY(-2px); }
      `}</style>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚡</span>
            <div>
              <h1 style={styles.title}>AlphaForge</h1>
              <p style={styles.subtitle}>AI-Powered Financial Intelligence</p>
            </div>
          </div>
          <nav style={styles.nav}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#stats" style={styles.navLink}>Analytics</a>
            <a href="#contact" style={styles.navLink}>Contact</a>
            <a
  href="YOUR_GITHUB_LINK"
  target="_blank"
  style={styles.navLink}
>
  GitHub
</a>
            <button style={styles.navBtn}>Sign In</button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h2 style={styles.heroTitle}>Financial Intelligence at Your Fingertips</h2>
          <p style={styles.heroDesc}>
            Get real-time market analysis, investment insights, and risk assessments powered by advanced multi-agent AI
          </p>
          <button style={styles.heroBtn} onClick={() => document.querySelector('[style*="queryBox"]').scrollIntoView({ behavior: 'smooth' })}>
            Get Started Now
          </button>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.chartPlaceholder}>📊</div>
        </div>
      </section>

      {/* KEY STATS */}
      <section style={styles.statsSection}>
        {stats.map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statIcon}>{stat.icon}</div>
            <p style={styles.statValue}>{stat.value}</p>
            <p style={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* MARKET CARDS */}
      <section style={styles.marketSection}>
        <h2 style={styles.sectionTitle}>Live Market Data</h2>
        <div style={styles.marketGrid}>
          {markets.map((m, i) => (
            <div key={i} style={styles.marketCard} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-8px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={styles.cardTop}>
                <span style={styles.cardSymbol}>{m.symbol}</span>
                <span style={{
                  ...styles.badge,
                  backgroundColor: m.change >= 0 ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                  color: m.change >= 0 ? "#10b981" : "#ef4444",
                  border: m.change >= 0 ? "1px solid rgba(16, 185, 129, 0.5)" : "1px solid rgba(239, 68, 68, 0.5)"
                }}>
                  {m.change >= 0 ? "↑" : "↓"} {Math.abs(m.change)}%
                </span>
              </div>
              <p style={styles.cardPrice}>
              ${Number(m.price).toLocaleString()}</p>
              <p style={styles.cardName}>{m.name}</p>
              <div style={styles.sparkline}>24h trend</div>
            </div>
          ))}
        </div>
      </section>

      {/* QUERY SECTION */}
      <section style={styles.querySection}>
        <h2 style={styles.sectionTitle}>Ask AlphaForge</h2>
        <div style={styles.queryBox}>
          <textarea
            style={styles.textarea}
            placeholder="Ask about market trends, portfolio analysis, investment strategies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && e.ctrlKey && !loading && askAI()}
            rows="4"
          />
          <div style={styles.queryFooter}>
            <button
              style={{...styles.submitBtn, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer"}}
              onClick={askAI}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span> Analyzing...
                </>
              ) : (
                "Analyze →"
              )}
            </button>
            <span style={styles.hint}>Press Ctrl+Enter to submit</span>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={styles.quickActionsContainer}>
          <p style={styles.quickLabel}>Quick Actions:</p>
          <div style={styles.quickActions}>
            {quickActions.map((action, i) => (
              <button
                key={i}
                style={styles.quickBtn}
                onClick={() => setQuery(action)}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AGENT STATUS */}
      {loading && (
        <section style={styles.agentSection}>
          <div style={styles.agentHeader}>
            <div style={styles.statusDot}></div>
            <h3>AI Agents Processing Your Query</h3>
          </div>
          <div style={styles.agentList}>
            <div style={styles.agentItem}>
              <span style={styles.agentEmoji}>📰</span>
              <div style={styles.agentInfo}>
                <p style={styles.agentName}>News Sentiment Agent</p>
                <p style={styles.agentTask}>Analyzing market sentiment and news</p>
              </div>
              <div style={styles.agentLoader}></div>
            </div>
            <div style={styles.agentItem}>
              <span style={styles.agentEmoji}>⚠️</span>
              <div style={styles.agentInfo}>
                <p style={styles.agentName}>Risk Assessment Agent</p>
                <p style={styles.agentTask}>Evaluating volatility and risk metrics</p>
              </div>
              <div style={styles.agentLoader}></div>
            </div>
            <div style={styles.agentItem}>
              <span style={styles.agentEmoji}>📈</span>
              <div style={styles.agentInfo}>
                <p style={styles.agentName}>Market Trend Agent</p>
                <p style={styles.agentTask}>Fetching real-time market data</p>
              </div>
              <div style={styles.agentLoader}></div>
            </div>
          </div>
        </section>
      )}

      {/* RESPONSE */}
      {response && (
        <section style={styles.responseSection}>
          <div style={styles.responseCard}>
            <div style={styles.responseTop}>
              <h3 style={styles.responseTitle}>Analysis Result</h3>
              <span style={styles.responseBadge}>AI Generated</span>
            </div>
            <div style={styles.responseContent}>
             {response.split("\n").map((line, index) => (
              <p key={index} style={{ marginBottom: "1rem" }}>
               {line}
               </p>
               ))}
              </div>
            <div style={styles.responseFooter}>
              <button
                style={styles.newQueryBtn}
                onClick={() => { setResponse(""); setQuery(""); }}
              >
                Ask Another Question
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES SECTION */}
      <section style={styles.featuresSection} id="features">
        <h2 style={styles.sectionTitle}>Why Choose AlphaForge</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔍</div>
            <h4>Deep Analysis</h4>
            <p>Multi-agent AI analyzing market data from multiple sources simultaneously</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚡</div>
            <h4>Real-Time</h4>
            <p>Get instant insights on market movements and emerging opportunities</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🛡️</div>
            <h4>Risk Management</h4>
            <p>Advanced volatility analysis and risk assessment for informed decisions</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h4>Portfolio Optimization</h4>
            <p>Get personalized recommendations to optimize your investment strategy</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2024 AlphaForge AI • Advanced Financial Intelligence Platform</p>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Privacy Policy</a>
          <a href="#" style={styles.footerLink}>Terms of Service</a>
          <a href="#" style={styles.footerLink}>Documentation</a>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1a1f3a 50%, #0f172a 100%)",
    color: "#e2e8f0",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 0,
    margin: 0,
  },

  header: {
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1.2rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  logoIcon: {
    fontSize: "2.2rem",
  },

  title: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    margin: "0",
    background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  subtitle: {
    fontSize: "0.75rem",
    color: "#60a5fa",
    margin: "0.1rem 0 0 0",
    fontWeight: "500",
  },

  nav: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },

  navLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "color 0.3s",
  },

  navBtn: {
    padding: "0.6rem 1.2rem",
    background: "rgba(59, 130, 246, 0.2)",
    border: "1px solid rgba(59, 130, 246, 0.5)",
    color: "#60a5fa",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.3s",
  },

  hero: {
    padding: "4rem 2rem",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
    alignItems: "center",
  },

  heroContent: {
    animation: "slideUp 0.6s ease",
  },

  heroTitle: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#f1f5f9",
    lineHeight: "1.2",
  },

  heroDesc: {
    fontSize: "1.1rem",
    color: "#cbd5e1",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },

  heroBtn: {
    padding: "0.9rem 2.5rem",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  },

  heroVisual: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  chartPlaceholder: {
    fontSize: "5rem",
    animation: "pulse 2s infinite",
  },

  statsSection: {
    maxWidth: "1200px",
    margin: "2rem auto",
    padding: "2rem",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1.5rem",
  },

  statCard: {
    background: "rgba(30, 41, 59, 0.4)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    padding: "1.5rem",
    borderRadius: "1rem",
    textAlign: "center",
    transition: "all 0.3s",
  },

  statIcon: {
    fontSize: "2rem",
    marginBottom: "0.75rem",
  },

  statValue: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#3b82f6",
    margin: "0.5rem 0",
  },

  statLabel: {
    color: "#cbd5e1",
    fontSize: "0.9rem",
    margin: 0,
  },

  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    color: "#f1f5f9",
    textAlign: "center",
  },

  marketSection: {
    maxWidth: "1200px",
    margin: "4rem auto",
    padding: "0 2rem",
  },

  marketGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
  },

  marketCard: {
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    padding: "1.8rem",
    borderRadius: "1rem",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },

  cardSymbol: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#f1f5f9",
  },

  badge: {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.8rem",
    fontWeight: "600",
  },

  cardPrice: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#60a5fa",
    margin: "0.75rem 0",
  },

  cardName: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    margin: "0.5rem 0 0 0",
  },

  sparkline: {
    fontSize: "0.75rem",
    color: "#475569",
    marginTop: "0.75rem",
    paddingTop: "0.75rem",
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
  },

  querySection: {
    maxWidth: "1000px",
    margin: "4rem auto",
    padding: "0 2rem",
  },

  queryBox: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    padding: "2.5rem",
    borderRadius: "1.5rem",
    marginBottom: "2rem",
    animation: "slideUp 0.6s ease",
  },

  textarea: {
    width: "100%",
    padding: "1.2rem",
    background: "rgba(15, 23, 42, 0.7)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "0.75rem",
    color: "#e2e8f0",
    fontSize: "1rem",
    fontFamily: "inherit",
    marginBottom: "1.5rem",
    resize: "vertical",
  },

  queryFooter: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },

  submitBtn: {
    flex: 1,
    padding: "1rem",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    transition: "all 0.3s",
  },

  hint: {
    fontSize: "0.8rem",
    color: "#64748b",
  },

  spinner: {
    display: "inline-block",
    width: "1rem",
    height: "1rem",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  quickActionsContainer: {
    marginTop: "2rem",
  },

  quickLabel: {
    fontSize: "0.9rem",
    color: "#cbd5e1",
    marginBottom: "1rem",
    fontWeight: "600",
  },

  quickActions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "1rem",
  },

  quickBtn: {
    padding: "0.8rem 1rem",
    background: "rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    color: "#60a5fa",
    borderRadius: "0.625rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s",
  },

  agentSection: {
    maxWidth: "1000px",
    margin: "3rem auto",
    padding: "2.5rem",
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "1.5rem",
    animation: "slideUp 0.4s ease",
  },

  agentHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#f1f5f9",
  },

  statusDot: {
    width: "0.75rem",
    height: "0.75rem",
    background: "#10b981",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },

  agentList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },

  agentItem: {
    display: "flex",
    gap: "1.2rem",
    alignItems: "center",
    padding: "1.2rem",
    background: "rgba(15, 23, 42, 0.6)",
    borderRadius: "0.75rem",
    border: "1px solid rgba(59, 130, 246, 0.1)",
  },

  agentEmoji: {
    fontSize: "1.5rem",
  },

  agentInfo: {
    flex: 1,
  },

  agentName: {
    fontWeight: "600",
    color: "#f1f5f9",
    margin: "0 0 0.3rem 0",
    fontSize: "0.95rem",
  },

  agentTask: {
    color: "#94a3b8",
    fontSize: "0.85rem",
    margin: 0,
  },

  agentLoader: {
    width: "0.6rem",
    height: "0.6rem",
    background: "#3b82f6",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },

  responseSection: {
    maxWidth: "1000px",
    margin: "3rem auto",
    padding: "0 2rem",
    animation: "slideUp 0.4s ease",
  },

  responseCard: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    padding: "2.5rem",
    borderRadius: "1.5rem",
  },

  responseTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
  },

  responseTitle: {
    margin: 0,
    fontSize: "1.2rem",
    color: "#f1f5f9",
  },

  responseBadge: {
    background: "rgba(59, 130, 246, 0.2)",
    color: "#60a5fa",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    fontSize: "0.8rem",
    fontWeight: "600",
  },

  responseContent: {
    lineHeight: "1.8",
    color: "#cbd5e1",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  },

  responseFooter: {
    display: "flex",
    gap: "1rem",
  },

  newQueryBtn: {
    flex: 1,
    padding: "0.8rem",
    background: "rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    color: "#60a5fa",
    borderRadius: "0.625rem",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s",
  },

  featuresSection: {
    maxWidth: "1200px",
    margin: "4rem auto",
    padding: "0 2rem",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  },

  featureCard: {
    background: "rgba(30, 41, 59, 0.4)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    padding: "2rem",
    borderRadius: "1rem",
    textAlign: "center",
    transition: "all 0.3s",
  },

  featureIcon: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },

  footer: {
    textAlign: "center",
    padding: "3rem 2rem",
    color: "#64748b",
    borderTop: "1px solid rgba(59, 130, 246, 0.1)",
    marginTop: "4rem",
  },

  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    marginTop: "1rem",
  },

  footerLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "0.9rem",
  },
};

export default App;
