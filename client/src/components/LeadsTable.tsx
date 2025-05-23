import { useState } from "react";
import styles from "./LeadsTable.module.css";
import { downloadCSV } from "../utils/downloadCSV";

interface Lead {
  id: number;
  businessName: string;
  email: string;
  phone: string;
  location: string;
  yelpUrl?: string;
  category?: string;
}

interface LeadsTableProps {
  leads: Lead[];
  searchLocation: string;
}

export default function LeadsTable({ leads, searchLocation }: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Lead>("businessName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ensure leads is always an array
  const safeLeads = Array.isArray(leads) ? leads : [];

  // Filter leads based on search term
  const filteredLeads = safeLeads.filter(lead =>
    lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    lead.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.category && lead.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const aValue = a[sortField]?.toString() || "";
    const bValue = b[sortField]?.toString() || "";
    
    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Paginate leads
  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = sortedLeads.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDownloadCSV = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const locationSlug = searchLocation.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `leads_${locationSlug}_${timestamp}.csv`;
    downloadCSV(filteredLeads, filename);
  };

  const getBusinessIcon = (category?: string) => {
    const iconMap: { [key: string]: string } = {
      "Coffee Shop": "☕",
      "Restaurant": "🍽️",
      "Fitness Center": "💪",
      "Hair Salon": "✂️",
      "Retail Store": "🛍️",
      "Dental Office": "🦷",
      "Law Firm": "⚖️",
      "Auto Repair": "🔧",
      "Pet Grooming": "🐾",
      "Bakery": "🍞",
    };
    return iconMap[category || ""] || "";
  };

  return (
    <div className={styles.container}>
      {/* Table Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.icon}>📊</div>
          <div>
            <h2 className={styles.title}>Generated Leads</h2>
            <p className={styles.subtitle}>
              <strong>{filteredLeads.length}</strong> leads found in{" "}
              <strong>{searchLocation}</strong>
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          {/* Search */}
          <div className={styles.searchWrapper}>
            <div className={styles.searchIcon}>🔍</div>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          {/* Download CSV Button */}
          <button
            onClick={handleDownloadCSV}
            className={styles.downloadButton}
            disabled={filteredLeads.length === 0}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div>
        {filteredLeads.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <h3 className={styles.emptyTitle}>No leads found</h3>
            <p className={styles.emptySubtitle}>
              {safeLeads.length === 0 
                ? "Generate some leads to see them here" 
                : "Try adjusting your search criteria"
              }
            </p>
          </div>
        ) : (
          <>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>
                    <button
                      onClick={() => handleSort("businessName")}
                      className={styles.sortButton}
                    >
                      Business Name ↕️
                    </button>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <button
                      onClick={() => handleSort("email")}
                      className={styles.sortButton}
                    >
                      Email ↕️
                    </button>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <button
                      onClick={() => handleSort("phone")}
                      className={styles.sortButton}
                    >
                      Phone ↕️
                    </button>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <button
                      onClick={() => handleSort("location")}
                      className={styles.sortButton}
                    >
                      Location ↕️
                    </button>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    Yelp URL
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.map((lead) => (
                  <tr key={lead.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.businessInfo}>
                        <div className={styles.businessIcon}>
                          {getBusinessIcon(lead.category)}
                        </div>
                        <div>
                          <div className={styles.businessName}>{lead.businessName}</div>
                          {lead.category && (
                            <div className={styles.businessCategory}>{lead.category}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.contactInfo}>
                        <span className={styles.contactIcon}>✉️</span>
                        <span className={styles.contactText}>{lead.email}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.contactInfo}>
                        <span className={styles.contactIcon}>📞</span>
                        <span className={styles.contactText}>{lead.phone}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.contactInfo}>
                        <span className={styles.contactIcon}>📍</span>
                        <span className={styles.contactText}>{lead.location}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      {lead.yelpUrl && (
                        <a 
                          href={lead.yelpUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.yelpLink}
                        >
                          🔗 View on Yelp
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Table Footer - Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                  Showing{" "}
                  <strong>{startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedLeads.length)}</strong>{" "}
                  of <strong>{sortedLeads.length}</strong> results
                </div>
                <div className={styles.paginationControls}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                  >
                    ← Previous
                  </button>
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className={styles.ellipsis}>...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={styles.pageButton}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}