import { useState } from "react";
import styles from "./LeadForm.module.css";

interface LeadFormProps {
  onLeadsGenerated: (leads: any[], location: string) => void;
}

export default function LeadForm({ onLeadsGenerated }: LeadFormProps) {
  const [location, setLocation] = useState("");
  const [areaCodes, setAreaCodes] = useState("");
  const [emailDomains, setEmailDomains] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("smartLeadsApiKey") || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Save API key to localStorage whenever it changes
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem("smartLeadsApiKey", value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim()) {
      alert("Please enter a location");
      return;
    }

    if (!apiKey && (!name.trim() || !email.trim())) {
      alert("Name and email are required for free mode");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = apiKey ? "/api/scrape" : "/api/signup";
      const requestData = {
        location: location.trim(),
        areaCodes: areaCodes.split(',').map(code => code.trim()).filter(Boolean),
        emailDomains: emailDomains.trim(),
        apiKey: apiKey.trim() || undefined,
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        onLeadsGenerated(data.leads || [], location);
        alert(`Success! Generated ${data.leads?.length || 0} leads for ${location}`);
      } else {
        alert(data.message || "Failed to generate leads");
      }
    } catch (error) {
      console.error("Error generating leads:", error);
      alert("Failed to generate leads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.icon}>🔍</div>
        <div>
          <h2 className={styles.title}>Generate Leads</h2>
          <p className={styles.subtitle}>Configure your lead search parameters</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Location Input */}
        <div className={styles.field}>
          <label className={styles.label}>
            📍 Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., New York, NY"
            className={styles.input}
            required
          />
        </div>

        {/* Area Codes */}
        <div className={styles.field}>
          <label className={styles.label}>
            📞 Area Codes
          </label>
          <input
            type="text"
            value={areaCodes}
            onChange={(e) => setAreaCodes(e.target.value)}
            placeholder="212, 718, 917 (comma separated)"
            className={styles.input}
          />
          <p className={styles.hint}>Enter area codes separated by commas</p>
        </div>

        {/* Email Domains */}
        <div className={styles.field}>
          <label className={styles.label}>
            ✉️ Email Domains
          </label>
          <input
            type="text"
            value={emailDomains}
            onChange={(e) => setEmailDomains(e.target.value)}
            placeholder="gmail.com, company.com (comma separated)"
            className={styles.input}
          />
        </div>

        {/* API Key Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <label className={styles.label}>
              🔑 API Key (Optional)
            </label>
            <div className={styles.badge}>
              👑 Premium
            </div>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder="Enter your API key for unlimited searches"
            className={styles.input}
          />
          <p className={styles.hint}>Saved locally for future sessions</p>
        </div>

        {/* Sign-up Section */}
        {!apiKey && (
          <div className={styles.section}>
            <h3 className={styles.label}>
              👤 New User Sign-up (Required for Free Mode)
            </h3>
            <div className={styles.field}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className={styles.input}
                required={!apiKey}
              />
            </div>
            <div className={styles.field}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className={styles.input}
                required={!apiKey}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.button}
          disabled={isLoading}
        >
          🚀 {isLoading ? "Generating..." : "Generate Leads"}
        </button>

        {/* Status Indicator */}
        <div className={styles.status}>
          <div className={`${styles.statusBadge} ${apiKey ? styles.premium : styles.free}`}>
            <div className={styles.statusDot}></div>
            <span>
              {apiKey ? "Premium Mode (Unlimited)" : "Free Mode (5 leads/day)"}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}