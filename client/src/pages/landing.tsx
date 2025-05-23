import { useState } from "react";
import LeadForm from "../components/LeadForm";
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

export default function Landing() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>("All Locations");
  const [showSubscription, setShowSubscription] = useState(false);

  const handleLeadsGenerated = (newLeads: Lead[], location: string) => {
    // Add timestamp to leads
    const leadsWithTimestamp = newLeads.map(lead => ({
      ...lead,
      createdAt: new Date().toISOString()
    }));
    
    // Add to existing leads
    setLeads(prevLeads => [...leadsWithTimestamp, ...prevLeads]);
    setSearchLocation(location);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa", fontFamily: "Inter, sans-serif" }}>
      {/* Hero Header */}
      <header style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
        color: "white",
        padding: "60px 24px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ 
              width: "48px", 
              height: "48px", 
              background: "rgba(255,255,255,0.2)", 
              borderRadius: "12px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "24px"
            }}>
              🎯
            </div>
            <h1 style={{ fontSize: "42px", fontWeight: "700", margin: 0 }}>
              Smart Leads
            </h1>
          </div>
          <p style={{ fontSize: "24px", marginBottom: "16px", opacity: 0.9 }}>
            Generate high-quality business leads instantly
          </p>
          <p style={{ fontSize: "18px", opacity: 0.8 }}>
            Find businesses by location, area codes, and email domains • 100% Free to start
          </p>
          
          {/* Stats */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "48px", 
            marginTop: "40px",
            flexWrap: "wrap"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>10K+</div>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>Leads Generated</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>50+</div>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>US Cities</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>Free</div>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>To Get Started</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 2fr", 
          gap: "48px",
          alignItems: "start"
        }}>
          {/* Lead Generation Form */}
          <div>
            <LeadForm onLeadsGenerated={handleLeadsGenerated} />
            
            {/* Premium CTA */}
            <div style={{ 
              marginTop: "24px", 
              background: "white", 
              borderRadius: "12px", 
              padding: "24px", 
              border: "2px solid #f0f0f0",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "20px", marginBottom: "8px" }}>💎</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#1f2937" }}>Want More Features?</h3>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 16px 0" }}>
                Save past leads, unlimited searches, no email required
              </p>
              <button
                onClick={() => setShowSubscription(true)}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Upgrade for $5/month
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div>
            <LeadsTable 
              leads={leads} 
              searchLocation={searchLocation} 
            />
            
            {/* How it Works */}
            {leads.length === 0 && (
              <div style={{ 
                background: "white", 
                borderRadius: "12px", 
                padding: "32px", 
                marginTop: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ margin: "0 0 24px 0", color: "#1f2937", textAlign: "center" }}>
                  🚀 How Smart Leads Works
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "32px", marginBottom: "12px" }}>📍</div>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>1. Choose Location</h4>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                      Select from 50+ major US cities or enter custom location
                    </p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎯</div>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>2. Filter Criteria</h4>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                      Add area codes and email domains to target specific businesses
                    </p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "32px", marginBottom: "12px" }}>📊</div>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>3. Get Results</h4>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                      Download CSV or view leads with business info and contact details
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscription && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "400px",
            width: "90%",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💎</div>
            <h2 style={{ margin: "0 0 16px 0", color: "#1f2937" }}>Smart Leads Premium</h2>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "#667eea", marginBottom: "8px" }}>
              $5<span style={{ fontSize: "18px", fontWeight: "400" }}>/month</span>
            </div>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>1,000 requests per month</p>
            
            <div style={{ textAlign: "left", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ color: "#10b981" }}>✓</span>
                <span>Save and access past lead lists</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ color: "#10b981" }}>✓</span>
                <span>No email/password required for searches</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ color: "#10b981" }}>✓</span>
                <span>Unlimited CSV downloads</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ color: "#10b981" }}>✓</span>
                <span>Priority customer support</span>
              </div>
            </div>
            
            <button
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "12px 32px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "16px",
                width: "100%",
                marginBottom: "12px"
              }}
            >
              Start Premium Trial
            </button>
            
            <button
              onClick={() => setShowSubscription(false)}
              style={{
                background: "none",
                border: "none",
                color: "#6b7280",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

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
            The fastest way to generate quality business leads
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