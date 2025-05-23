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
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>("All Locations");

  const handleLeadsGenerated = (newLeads: Lead[], location: string) => {
    setLeads(newLeads);
    setSearchLocation(location);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <header style={{ 
        background: "white", 
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
        borderBottom: "1px solid #e5e7eb" 
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px"
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
              📊
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
              Smart Leads
            </h1>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <a href="#" style={{ color: "#6b7280", textDecoration: "none" }}>Dashboard</a>
            <a href="#" style={{ color: "#6b7280", textDecoration: "none" }}>Leads</a>
            <a href="#" style={{ color: "#6b7280", textDecoration: "none" }}>Settings</a>
            <button style={{ 
              background: "#3b82f6", 
              color: "white", 
              border: "none", 
              padding: "8px 16px", 
              borderRadius: "6px", 
              fontWeight: "500",
              cursor: "pointer"
            }}>
              Account
            </button>
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 2fr", 
          gap: "32px"
        }}>
          {/* Lead Form */}
          <div>
            <LeadForm onLeadsGenerated={handleLeadsGenerated} />
          </div>

          {/* Leads Table */}
          <div>
            <LeadsTable 
              leads={leads} 
              searchLocation={searchLocation} 
            />
          </div>
        </div>

        {/* Status Bar */}
        <div style={{ 
          marginTop: "32px", 
          background: "white", 
          borderRadius: "12px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #e5e7eb", 
          padding: "24px" 
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "12px", height: "12px", background: "#10b981", borderRadius: "50%" }}></div>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  API Status: <span style={{ fontWeight: "500", color: "#10b981" }}>Connected</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>🕒</span>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  Last Updated: <span style={{ fontWeight: "500" }}>Just now</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>🗄️</span>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  Total Leads: <span style={{ fontWeight: "500" }}>{leads.length}</span>
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button style={{ 
                background: "none", 
                border: "none", 
                color: "#6b7280", 
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                📜 View History
              </button>
              <button style={{ 
                background: "none", 
                border: "none", 
                color: "#6b7280", 
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}