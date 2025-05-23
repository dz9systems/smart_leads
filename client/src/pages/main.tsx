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
  
  // UI states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
          width: sidebarCollapsed ? "60px" : "280px", 
          background: "white", 
          borderRight: "1px solid #e5e7eb",
          padding: sidebarCollapsed ? "12px" : "24px",
          transition: "width 0.3s ease, padding 0.3s ease",
          position: "relative"
        }}>
          {/* Collapse/Expand Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              position: "absolute",
              top: "12px",
              right: sidebarCollapsed ? "12px" : "24px",
              background: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              padding: "8px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#6b7280",
              zIndex: 10
            }}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>

          {!sidebarCollapsed && (
            <>
              {/* API Key Section */}
              <div style={{ marginBottom: "32px", marginTop: "40px" }}>
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
            </>
          )}

          {/* Collapsed State - Mini Icons */}
          {sidebarCollapsed && (
            <div style={{ marginTop: "50px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div 
                title="API Key & Premium Access"
                style={{ 
                  fontSize: "24px", 
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "6px",
                  background: apiKey ? "#dcfce7" : "#f3f4f6"
                }}
                onClick={() => setSidebarCollapsed(false)}
              >
                🔑
              </div>
              <div 
                title="Expand to access settings"
                style={{ 
                  fontSize: "20px", 
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "8px"
                }}
                onClick={() => setSidebarCollapsed(false)}
              >
                ⚙️
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "24px" }}>
          {/* Search Form at Top */}
          <div style={{ 
            background: "white", 
            borderRadius: "12px", 
            padding: "24px", 
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ margin: "0 0 20px 0", color: "#1f2937", fontSize: "20px", fontWeight: "600" }}>
              🔍 Generate Business Leads
            </h2>
            
            <form onSubmit={handleSearch}>
              {/* Keywords Dropdown */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Search Keywords
                </label>
                <select
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white"
                  }}
                  required
                >
                  <option value="">Select a business type...</option>
                  <optgroup label="Food & Restaurants">
                    <option value="restaurant">Restaurant</option>
                    <option value="pizza">Pizza Shop</option>
                    <option value="coffee shop">Coffee Shop</option>
                    <option value="bakery">Bakery</option>
                    <option value="food truck">Food Truck</option>
                    <option value="catering">Catering</option>
                  </optgroup>
                  <optgroup label="Health & Medical">
                    <option value="dentist">Dentist</option>
                    <option value="doctor">Doctor</option>
                    <option value="chiropractor">Chiropractor</option>
                    <option value="physical therapy">Physical Therapy</option>
                    <option value="veterinarian">Veterinarian</option>
                    <option value="pharmacy">Pharmacy</option>
                  </optgroup>
                  <optgroup label="Professional Services">
                    <option value="lawyer">Lawyer</option>
                    <option value="accountant">Accountant</option>
                    <option value="real estate agent">Real Estate Agent</option>
                    <option value="insurance agent">Insurance Agent</option>
                    <option value="financial advisor">Financial Advisor</option>
                  </optgroup>
                  <optgroup label="Home & Auto Services">
                    <option value="plumber">Plumber</option>
                    <option value="electrician">Electrician</option>
                    <option value="contractor">Contractor</option>
                    <option value="auto repair">Auto Repair</option>
                    <option value="locksmith">Locksmith</option>
                    <option value="landscaping">Landscaping</option>
                  </optgroup>
                  <optgroup label="Beauty & Wellness">
                    <option value="hair salon">Hair Salon</option>
                    <option value="spa">Spa</option>
                    <option value="nail salon">Nail Salon</option>
                    <option value="fitness center">Fitness Center</option>
                    <option value="yoga studio">Yoga Studio</option>
                  </optgroup>
                  <optgroup label="Retail & Shopping">
                    <option value="clothing store">Clothing Store</option>
                    <option value="electronics store">Electronics Store</option>
                    <option value="jewelry store">Jewelry Store</option>
                    <option value="bookstore">Bookstore</option>
                    <option value="pet store">Pet Store</option>
                  </optgroup>
                </select>
              </div>

              {/* Area Codes with Tags Inside */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Area Codes (Optional)
                </label>
                <div style={{
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "8px",
                  minHeight: "44px",
                  backgroundColor: "white",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  {/* Selected Tags */}
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
                  {/* Dropdown */}
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !selectedAreaCodes.includes(e.target.value)) {
                        setSelectedAreaCodes([...selectedAreaCodes, e.target.value]);
                      }
                    }}
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: "14px",
                      flex: 1,
                      minWidth: "200px",
                      color: selectedAreaCodes.length === 0 ? "#9ca3af" : "#1f2937"
                    }}
                  >
                    <option value="">Select area codes...</option>
                    <optgroup label="California">
                      <option value="213">213 - Los Angeles</option>
                      <option value="310">310 - Beverly Hills, Santa Monica</option>
                      <option value="415">415 - San Francisco</option>
                      <option value="510">510 - Oakland, Berkeley</option>
                      <option value="619">619 - San Diego</option>
                      <option value="714">714 - Orange County</option>
                      <option value="818">818 - San Fernando Valley</option>
                    </optgroup>
                    <optgroup label="New York">
                      <option value="212">212 - Manhattan</option>
                      <option value="347">347 - Brooklyn, Bronx, Queens</option>
                      <option value="516">516 - Long Island</option>
                      <option value="585">585 - Rochester</option>
                      <option value="631">631 - Suffolk County</option>
                      <option value="718">718 - Brooklyn, Bronx, Queens</option>
                      <option value="914">914 - Westchester</option>
                    </optgroup>
                    <optgroup label="Texas">
                      <option value="214">214 - Dallas</option>
                      <option value="281">281 - Houston</option>
                      <option value="409">409 - Beaumont</option>
                      <option value="512">512 - Austin</option>
                      <option value="713">713 - Houston</option>
                      <option value="817">817 - Fort Worth</option>
                      <option value="903">903 - Tyler</option>
                    </optgroup>
                    <optgroup label="Florida">
                      <option value="305">305 - Miami</option>
                      <option value="321">321 - Orlando</option>
                      <option value="407">407 - Orlando</option>
                      <option value="561">561 - West Palm Beach</option>
                      <option value="727">727 - St. Petersburg</option>
                      <option value="813">813 - Tampa</option>
                      <option value="954">954 - Fort Lauderdale</option>
                    </optgroup>
                    <optgroup label="Illinois">
                      <option value="312">312 - Chicago</option>
                      <option value="630">630 - Chicago Suburbs</option>
                      <option value="708">708 - Chicago Suburbs</option>
                      <option value="773">773 - Chicago</option>
                      <option value="815">815 - Rockford</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Email Domains with Tags Inside */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Email Domains
                </label>
                <div style={{
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "8px",
                  minHeight: "44px",
                  backgroundColor: "white",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  {/* Selected Tags */}
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
                  {/* Dropdown */}
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !selectedEmailDomains.includes(e.target.value)) {
                        setSelectedEmailDomains([...selectedEmailDomains, e.target.value]);
                      }
                    }}
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: "14px",
                      flex: 1,
                      minWidth: "200px",
                      color: selectedEmailDomains.length === 0 ? "#9ca3af" : "#1f2937"
                    }}
                  >
                    <option value="">Add email domains...</option>
                    <option value="@gmail.com">@gmail.com</option>
                    <option value="@yahoo.com">@yahoo.com</option>
                    <option value="@outlook.com">@outlook.com</option>
                    <option value="@icloud.com">@icloud.com</option>
                    <option value="@aol.com">@aol.com</option>
                    <option value="@hotmail.com">@hotmail.com</option>
                    <option value="@comcast.net">@comcast.net</option>
                    <option value="@verizon.net">@verizon.net</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: isLoading ? "#9ca3af" : "#10b981",
                  color: "white",
                  border: "none",
                  padding: "14px 32px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {isLoading ? "🔄 Generating..." : "🚀 Generate Leads"}
              </button>
            </form>
          </div>

          {/* Results */}
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
                Select a business type and search parameters above to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}