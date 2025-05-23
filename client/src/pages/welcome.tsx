import { useState } from "react";

interface WelcomeProps {
  onApiKeyProvided: (apiKey: string) => void;
  onSignup: (email: string, password: string) => void;
}

export default function Welcome({ onApiKeyProvided, onSignup }: WelcomeProps) {
  const [activeTab, setActiveTab] = useState<"api" | "signup">("api");
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showApiInstructions, setShowApiInstructions] = useState(false);

  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeyProvided(apiKey.trim());
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      onSignup(email.trim(), password.trim());
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa", fontFamily: "Inter, sans-serif" }}>
      {/* Hero Header */}
      <header style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
        color: "white",
        padding: "80px 24px"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "32px" }}>
            <div style={{ 
              width: "64px", 
              height: "64px", 
              background: "rgba(255,255,255,0.2)", 
              borderRadius: "16px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "32px"
            }}>
              🎯
            </div>
            <h1 style={{ fontSize: "48px", fontWeight: "700", margin: 0 }}>
              Smart Leads
            </h1>
          </div>
          <p style={{ fontSize: "28px", marginBottom: "16px", opacity: 0.95 }}>
            Generate high-quality business leads instantly
          </p>
          <p style={{ fontSize: "20px", opacity: 0.85, lineHeight: 1.6 }}>
            Find businesses by location, area codes, and email domains using real SERP data
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "64px 24px" }}>
        
        {/* Tab Navigation */}
        <div style={{ 
          display: "flex", 
          background: "white", 
          borderRadius: "12px", 
          padding: "8px",
          marginBottom: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <button
            onClick={() => setActiveTab("api")}
            style={{
              flex: 1,
              padding: "16px 24px",
              border: "none",
              borderRadius: "8px",
              background: activeTab === "api" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
              color: activeTab === "api" ? "white" : "#6b7280",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            🔑 Use Your SERP API
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            style={{
              flex: 1,
              padding: "16px 24px",
              border: "none",
              borderRadius: "8px",
              background: activeTab === "signup" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
              color: activeTab === "signup" ? "white" : "#6b7280",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            💎 Premium Signup
          </button>
        </div>

        {/* API Key Tab */}
        {activeTab === "api" && (
          <div style={{ 
            background: "white", 
            borderRadius: "16px", 
            padding: "40px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔑</div>
              <h2 style={{ margin: "0 0 12px 0", color: "#1f2937", fontSize: "28px" }}>Use Your SERP API Key</h2>
              <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: 1.6 }}>
                Enter your SerpApi key to get real business data from Google search results
              </p>
            </div>

            <form onSubmit={handleApiSubmit}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "600", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  SERP API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your SerpApi key..."
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "inherit"
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginBottom: "16px"
                }}
              >
                Start Generating Leads
              </button>
            </form>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowApiInstructions(!showApiInstructions)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#667eea",
                  cursor: "pointer",
                  fontSize: "14px",
                  textDecoration: "underline"
                }}
              >
                {showApiInstructions ? "Hide" : "Show"} how to get SERP API key
              </button>
            </div>

            {/* API Instructions */}
            {showApiInstructions && (
              <div style={{ 
                marginTop: "24px", 
                padding: "24px", 
                background: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#1f2937", fontSize: "18px" }}>
                  📋 How to Get Your SERP API Key
                </h3>
                <ol style={{ padding: "0 0 0 20px", margin: 0, color: "#4b5563", lineHeight: 1.8 }}>
                  <li style={{ marginBottom: "8px" }}>
                    Visit <a href="https://serpapi.com" target="_blank" rel="noopener noreferrer" style={{ color: "#667eea", textDecoration: "none" }}>SerpApi.com</a>
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Click "Get free API key" or "Sign up"
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Create your account with email verification
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Go to your dashboard and copy your API key
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    Paste it above to start generating leads!
                  </li>
                </ol>
                <div style={{ 
                  marginTop: "16px", 
                  padding: "12px", 
                  background: "#ddd6fe", 
                  borderRadius: "8px",
                  fontSize: "14px"
                }}>
                  <strong>💡 Pro Tip:</strong> SerpApi offers 100 free searches per month to get you started!
                </div>
              </div>
            )}
          </div>
        )}

        {/* Premium Signup Tab */}
        {activeTab === "signup" && (
          <div style={{ 
            background: "white", 
            borderRadius: "16px", 
            padding: "40px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💎</div>
              <h2 style={{ margin: "0 0 8px 0", color: "#1f2937", fontSize: "28px" }}>Smart Leads Premium</h2>
              <div style={{ fontSize: "40px", fontWeight: "700", color: "#667eea", marginBottom: "8px" }}>
                $5<span style={{ fontSize: "20px", fontWeight: "400" }}>/month</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: "16px" }}>1,000 searches per month • No API key needed</p>
            </div>

            {/* Premium Benefits */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ color: "#10b981", fontSize: "18px" }}>✓</span>
                <span style={{ color: "#374151" }}>No need to get your own API key</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ color: "#10b981", fontSize: "18px" }}>✓</span>
                <span style={{ color: "#374151" }}>Save and access your past lead lists</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ color: "#10b981", fontSize: "18px" }}>✓</span>
                <span style={{ color: "#374151" }}>Unlimited CSV downloads</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ color: "#10b981", fontSize: "18px" }}>✓</span>
                <span style={{ color: "#374151" }}>Priority customer support</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ color: "#10b981", fontSize: "18px" }}>✓</span>
                <span style={{ color: "#374151" }}>Higher quality and more recent data</span>
              </div>
            </div>

            <form onSubmit={handleSignupSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "600", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "inherit"
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ 
                  display: "block", 
                  fontSize: "14px", 
                  fontWeight: "600", 
                  color: "#374151", 
                  marginBottom: "8px" 
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password..."
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "inherit"
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Start Premium Trial
              </button>
            </form>

            <p style={{ 
              textAlign: "center", 
              color: "#6b7280", 
              fontSize: "12px", 
              marginTop: "16px",
              lineHeight: 1.5
            }}>
              By signing up, you agree to our Terms of Service and Privacy Policy. 
              Cancel anytime.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ 
        background: "#1f2937", 
        color: "white", 
        padding: "48px 24px",
        marginTop: "64px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ fontSize: "24px" }}>🎯</div>
            <h3 style={{ margin: 0 }}>Smart Leads</h3>
          </div>
          <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
            The fastest way to generate quality business leads using real SERP data
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
            <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Terms of Service</a>
            <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Contact</a>
            <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Help</a>
          </div>
          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #374151" }}>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>
              © 2024 Smart Leads. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}