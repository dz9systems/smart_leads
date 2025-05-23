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
          <select 
            onChange={(e) => {
              if (e.target.value) {
                setLocation(e.target.value);
                e.target.value = '';
              }
            }}
            className={styles.input}
            style={{ marginTop: '8px' }}
          >
            <option value="">Select a popular location...</option>
            <option value="New York, NY">New York, NY</option>
            <option value="Los Angeles, CA">Los Angeles, CA</option>
            <option value="Chicago, IL">Chicago, IL</option>
            <option value="Houston, TX">Houston, TX</option>
            <option value="Phoenix, AZ">Phoenix, AZ</option>
            <option value="Philadelphia, PA">Philadelphia, PA</option>
            <option value="San Antonio, TX">San Antonio, TX</option>
            <option value="San Diego, CA">San Diego, CA</option>
            <option value="Dallas, TX">Dallas, TX</option>
            <option value="San Jose, CA">San Jose, CA</option>
            <option value="Austin, TX">Austin, TX</option>
            <option value="Jacksonville, FL">Jacksonville, FL</option>
            <option value="San Francisco, CA">San Francisco, CA</option>
            <option value="Columbus, OH">Columbus, OH</option>
            <option value="Fort Worth, TX">Fort Worth, TX</option>
            <option value="Indianapolis, IN">Indianapolis, IN</option>
            <option value="Charlotte, NC">Charlotte, NC</option>
            <option value="Seattle, WA">Seattle, WA</option>
            <option value="Denver, CO">Denver, CO</option>
            <option value="Boston, MA">Boston, MA</option>
          </select>
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
          <select 
            onChange={(e) => {
              if (e.target.value) {
                const newCode = e.target.value;
                const currentCodes = areaCodes.split(',').map(code => code.trim()).filter(Boolean);
                if (!currentCodes.includes(newCode)) {
                  const updatedCodes = [...currentCodes, newCode].join(', ');
                  setAreaCodes(updatedCodes);
                }
                e.target.value = '';
              }
            }}
            className={styles.input}
            style={{ marginTop: '8px' }}
          >
            <option value="">Add area code...</option>
            <optgroup label="California">
              <option value="213">213 - Los Angeles</option>
              <option value="310">310 - Beverly Hills, Santa Monica</option>
              <option value="323">323 - Los Angeles</option>
              <option value="408">408 - San Jose</option>
              <option value="415">415 - San Francisco</option>
              <option value="510">510 - Oakland</option>
              <option value="619">619 - San Diego</option>
              <option value="650">650 - Palo Alto</option>
              <option value="714">714 - Anaheim</option>
              <option value="818">818 - San Fernando Valley</option>
              <option value="858">858 - San Diego</option>
              <option value="909">909 - San Bernardino</option>
              <option value="916">916 - Sacramento</option>
              <option value="925">925 - Concord</option>
              <option value="949">949 - Irvine</option>
            </optgroup>
            <optgroup label="New York">
              <option value="212">212 - Manhattan</option>
              <option value="315">315 - Syracuse</option>
              <option value="347">347 - Bronx, Brooklyn, Queens</option>
              <option value="516">516 - Long Island</option>
              <option value="518">518 - Albany</option>
              <option value="585">585 - Rochester</option>
              <option value="607">607 - Binghamton</option>
              <option value="631">631 - Long Island</option>
              <option value="646">646 - Manhattan</option>
              <option value="716">716 - Buffalo</option>
              <option value="718">718 - Bronx, Brooklyn, Queens</option>
              <option value="845">845 - Hudson Valley</option>
              <option value="914">914 - Westchester</option>
              <option value="917">917 - New York City</option>
              <option value="929">929 - New York City</option>
            </optgroup>
            <optgroup label="Texas">
              <option value="214">214 - Dallas</option>
              <option value="281">281 - Houston</option>
              <option value="409">409 - Beaumont</option>
              <option value="432">432 - Midland</option>
              <option value="469">469 - Dallas</option>
              <option value="512">512 - Austin</option>
              <option value="713">713 - Houston</option>
              <option value="737">737 - Austin</option>
              <option value="806">806 - Lubbock</option>
              <option value="817">817 - Fort Worth</option>
              <option value="832">832 - Houston</option>
              <option value="903">903 - Tyler</option>
              <option value="915">915 - El Paso</option>
              <option value="936">936 - Huntsville</option>
              <option value="940">940 - Wichita Falls</option>
              <option value="956">956 - Laredo</option>
              <option value="972">972 - Dallas</option>
              <option value="979">979 - College Station</option>
            </optgroup>
            <optgroup label="Florida">
              <option value="239">239 - Fort Myers</option>
              <option value="305">305 - Miami</option>
              <option value="321">321 - Orlando</option>
              <option value="352">352 - Gainesville</option>
              <option value="386">386 - Daytona Beach</option>
              <option value="407">407 - Orlando</option>
              <option value="561">561 - West Palm Beach</option>
              <option value="727">727 - St. Petersburg</option>
              <option value="754">754 - Fort Lauderdale</option>
              <option value="772">772 - Port St. Lucie</option>
              <option value="786">786 - Miami</option>
              <option value="813">813 - Tampa</option>
              <option value="850">850 - Tallahassee</option>
              <option value="863">863 - Lakeland</option>
              <option value="904">904 - Jacksonville</option>
              <option value="941">941 - Sarasota</option>
              <option value="954">954 - Fort Lauderdale</option>
            </optgroup>
            <optgroup label="Illinois">
              <option value="217">217 - Springfield</option>
              <option value="224">224 - Evanston</option>
              <option value="309">309 - Peoria</option>
              <option value="312">312 - Chicago</option>
              <option value="331">331 - Aurora</option>
              <option value="618">618 - Carbondale</option>
              <option value="630">630 - Aurora</option>
              <option value="708">708 - Chicago Heights</option>
              <option value="773">773 - Chicago</option>
              <option value="815">815 - Rockford</option>
              <option value="847">847 - Evanston</option>
              <option value="872">872 - Chicago</option>
            </optgroup>
            <optgroup label="Other States">
              <option value="301">301 - Maryland</option>
              <option value="404">404 - Atlanta, GA</option>
              <option value="480">480 - Phoenix, AZ</option>
              <option value="504">504 - New Orleans, LA</option>
              <option value="617">617 - Boston, MA</option>
              <option value="702">702 - Las Vegas, NV</option>
              <option value="720">720 - Denver, CO</option>
              <option value="804">804 - Richmond, VA</option>
            </optgroup>
          </select>
          <p className={styles.hint}>Select from dropdown or type comma separated codes</p>
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
          <select 
            onChange={(e) => {
              if (e.target.value) {
                const newDomain = e.target.value;
                const currentDomains = emailDomains.split(',').map(domain => domain.trim()).filter(Boolean);
                if (!currentDomains.includes(newDomain)) {
                  const updatedDomains = [...currentDomains, newDomain].join(', ');
                  setEmailDomains(updatedDomains);
                }
                e.target.value = '';
              }
            }}
            className={styles.input}
            style={{ marginTop: '8px' }}
          >
            <option value="">Add email domain...</option>
            <optgroup label="Popular Free Providers">
              <option value="gmail.com">gmail.com</option>
              <option value="yahoo.com">yahoo.com</option>
              <option value="outlook.com">outlook.com</option>
              <option value="hotmail.com">hotmail.com</option>
              <option value="aol.com">aol.com</option>
              <option value="icloud.com">icloud.com</option>
              <option value="protonmail.com">protonmail.com</option>
            </optgroup>
            <optgroup label="Business Domains">
              <option value="company.com">company.com</option>
              <option value="business.com">business.com</option>
              <option value="corp.com">corp.com</option>
              <option value="enterprise.com">enterprise.com</option>
              <option value="office.com">office.com</option>
              <option value="professional.com">professional.com</option>
              <option value="services.com">services.com</option>
              <option value="consulting.com">consulting.com</option>
              <option value="solutions.com">solutions.com</option>
              <option value="group.com">group.com</option>
              <option value="llc.com">llc.com</option>
              <option value="inc.com">inc.com</option>
            </optgroup>
            <optgroup label="Industry Specific">
              <option value="restaurant.com">restaurant.com</option>
              <option value="retail.com">retail.com</option>
              <option value="tech.com">tech.com</option>
              <option value="medical.com">medical.com</option>
              <option value="legal.com">legal.com</option>
              <option value="construction.com">construction.com</option>
              <option value="realestate.com">realestate.com</option>
              <option value="fitness.com">fitness.com</option>
              <option value="beauty.com">beauty.com</option>
              <option value="automotive.com">automotive.com</option>
            </optgroup>
          </select>
          <p className={styles.hint}>Select from dropdown or type comma separated domains</p>
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