interface Lead {
  id: number;
  businessName: string;
  email: string;
  phone: string;
  location: string;
  yelpUrl?: string;
  category?: string;
}

export function downloadCSV(leads: Lead[], filename: string) {
  if (leads.length === 0) {
    console.warn("No leads to export");
    return;
  }

  // Define CSV headers
  const headers = ["Business Name", "Email", "Phone", "Location", "Category", "Yelp URL", "Created At"];
  
  // Convert leads to CSV rows
  const csvRows = [
    headers.join(","), // Header row
    ...leads.map(lead => [
      `"${lead.businessName.replace(/"/g, '""')}"`, // Escape quotes in business name
      lead.email,
      lead.phone,
      `"${lead.location.replace(/"/g, '""')}"`, // Escape quotes in location
      lead.category || "",
      lead.yelpUrl || "",
      new Date().toISOString().split('T')[0]
    ].join(","))
  ];

  // Create CSV content
  const csvContent = csvRows.join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
  
  console.log(`CSV exported successfully: ${filename}`);
}
