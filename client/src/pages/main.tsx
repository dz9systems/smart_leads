import { useState } from "react";
import LeadsTable from "../components/LeadsTable";

interface Lead {
  id: number;
  businessName: string;
  email: string;
  phone: string;
  location: string;
  yelpUrl?: string;
  category?: string;
  createdAt?: string;
}

export default function Main() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth states
  const [apiKey, setApiKey] = useState(localStorage.getItem("serpApiKey") || "");
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Search states
  const [keyword, setKeyword] = useState("");
  const [selectedAreaCodes, setSelectedAreaCodes] = useState<string[]>([]);
  const [selectedEmailDomains, setSelectedEmailDomains] = useState<string[]>(["@gmail.com", "@yahoo.com", "@outlook.com", "@icloud.com", "@aol.com", "@hotmail.com"]);
  const [areaCodeInput, setAreaCodeInput] = useState("");
  const [emailDomainInput, setEmailDomainInput] = useState("");

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem("serpApiKey", apiKey.trim());
      alert("API key saved successfully!");
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      console.log("Premium signup:", { email, password });
      alert("Premium signup submitted! (Demo)");
      setShowSignup(false);
    }
  };

  const addAreaCode = (code: string) => {
    const trimmedCode = code.trim();
    if (trimmedCode && !selectedAreaCodes.includes(trimmedCode)) {
      setSelectedAreaCodes([...selectedAreaCodes, trimmedCode]);
    }
    setAreaCodeInput("");
  };

  const removeAreaCode = (code: string) => {
    setSelectedAreaCodes(selectedAreaCodes.filter(c => c !== code));
  };

  const addEmailDomain = (domain: string) => {
    const trimmedDomain = domain.trim();
    if (trimmedDomain && !selectedEmailDomains.includes(trimmedDomain)) {
      setSelectedEmailDomains([...selectedEmailDomains, trimmedDomain]);
    }
    setEmailDomainInput("");
  };

  const removeEmailDomain = (domain: string) => {
    setSelectedEmailDomains(selectedEmailDomains.filter(d => d !== domain));
  };

  const handleAreaCodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && areaCodeInput.trim()) {
      e.preventDefault();
      addAreaCode(areaCodeInput);
    }
  };

  const handleEmailDomainKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && emailDomainInput.trim()) {
      e.preventDefault();
      addEmailDomain(emailDomainInput);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      alert("Please enter a keyword to search");
      return;
    }

    if (!apiKey && !email) {
      alert("Please provide an API key or sign up for premium access");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual SERP API integration
      const searchData = {
        keyword: keyword.trim(),
        areaCodes: selectedAreaCodes,
        emailDomains: selectedEmailDomains,
        apiKey: apiKey.trim() || undefined,
      };

      // Mock lead generation for demo
      const mockLeads = generateMockLeads(keyword, 10);
      
      const leadsWithTimestamp = mockLeads.map(lead => ({
        ...lead,
        createdAt: new Date().toISOString()
      }));
      
      setLeads(prevLeads => [...leadsWithTimestamp, ...prevLeads]);
      alert(`Generated ${mockLeads.length} leads for "${keyword}"`);
      
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to generate leads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockLeads = (keyword: string, count: number): Lead[] => {
    const businessTypes = ["Restaurant", "Coffee Shop", "Retail Store", "Fitness Center", "Hair Salon", "Dental Office", "Law Firm", "Auto Repair", "Pet Grooming", "Bakery"];
    const cities = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA"];
    const domains = selectedEmailDomains.map(d => d.replace('@', ''));
    
    return Array.from({ length: count }, (_, i) => {
      const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const businessName = `${keyword} ${businessType} ${i + 1}`;
      
      return {
        id: Date.now() + i,
        businessName,
        email: `contact@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${domain}`,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        location: city,
        yelpUrl: `https://yelp.com/biz/${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        category: businessType,
      };
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <header style={{ 
        background: "white", 
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ 
            width: "32px", 
            height: "32px", 
            background: "#3b82f6", 
            borderRadius: "8px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "white",
            fontSize: "16px"
          }}>
            🎯
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
            Smart Leads
          </h1>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
        {/* Sidebar */}
        <div style={{ 
          width: "320px", 
          background: "white", 
          borderRight: "1px solid #e5e7eb",
          padding: "24px"
        }}>
          {/* API Key Section */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#1f2937", fontSize: "16px", fontWeight: "600" }}>
              🔑 API Access
            </h3>
            <form onSubmit={handleApiKeySubmit}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter SERP API key..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  marginBottom: "12px"
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  marginBottom: "12px"
                }}
              >
                Save API Key
              </button>
            </form>
            
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>or</span>
            </div>
            
            <button
              onClick={() => setShowSignup(!showSignup)}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                marginTop: "12px"
              }}
            >
              Premium Signup ($5/mo)
            </button>

            {/* Premium Signup Form */}
            {showSignup && (
              <form onSubmit={handleSignupSubmit} style={{ marginTop: "16px", padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    marginBottom: "8px"
                  }}
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    marginBottom: "12px"
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  Sign Up
                </button>
              </form>
            )}
          </div>

          {/* Search Form */}
          <div>
            <h3 style={{ margin: "0 0 16px 0", color: "#1f2937", fontSize: "16px", fontWeight: "600" }}>
              🔍 Search Leads
            </h3>
            <form onSubmit={handleSearch}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Keyword
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., restaurant, dentist, lawyer"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Select Area Codes (optional)
                </label>
                <div style={{
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "8px",
                  minHeight: "44px",
                  backgroundColor: "#1f2937",
                  color: "white"
                }}>
                  {/* Selected Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: selectedAreaCodes.length > 0 ? "8px" : "0" }}>
                    {selectedAreaCodes.map((code, index) => (
                      <span
                        key={index}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        {code}
                        <button
                          onClick={() => removeAreaCode(code)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            padding: "0",
                            fontSize: "12px"
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {/* Input */}
                  <input
                    type="text"
                    value={areaCodeInput}
                    onChange={(e) => setAreaCodeInput(e.target.value)}
                    onKeyPress={handleAreaCodeKeyPress}
                    placeholder={selectedAreaCodes.length === 0 ? "Type area code and press Enter..." : "Add another..."}
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "white",
                      fontSize: "14px",
                      width: "100%"
                    }}
                  />
                </div>
                {selectedAreaCodes.length > 0 && (
                  <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                    Selected Area Codes: {selectedAreaCodes.join(", ")}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Select email domains to search for
                </label>
                <div style={{
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "8px",
                  minHeight: "44px",
                  backgroundColor: "#1f2937",
                  color: "white"
                }}>
                  {/* Selected Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: selectedEmailDomains.length > 0 ? "8px" : "0" }}>
                    {selectedEmailDomains.map((domain, index) => (
                      <span
                        key={index}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        {domain}
                        <button
                          onClick={() => removeEmailDomain(domain)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            padding: "0",
                            fontSize: "12px"
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {/* Input */}
                  <input
                    type="text"
                    value={emailDomainInput}
                    onChange={(e) => setEmailDomainInput(e.target.value)}
                    onKeyPress={handleEmailDomainKeyPress}
                    placeholder="Type domain and press Enter (e.g., @company.com)..."
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "white",
                      fontSize: "14px",
                      width: "100%"
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  background: isLoading ? "#9ca3af" : "#10b981",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer"
                }}
              >
                {isLoading ? "Generating..." : "🚀 Generate Leads"}
              </button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "24px" }}>
          <LeadsTable 
            leads={leads} 
            searchLocation="Search Results" 
          />
          
          {/* Empty State */}
          {leads.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              padding: "64px 24px",
              color: "#6b7280"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎯</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#1f2937" }}>Ready to Generate Leads?</h3>
              <p style={{ margin: 0 }}>
                Enter a keyword and search parameters in the sidebar to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}