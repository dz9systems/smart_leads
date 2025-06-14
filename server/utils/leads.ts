import axios from "axios";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export async function getPhoneFromYelpPage(url: string): Promise<string | null> {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const html = await page.content();
    const $ = cheerio.load(html);

    // Try finding the phone number by label first
    const label = $('p').filter((_, el) => $(el).text().trim().toLowerCase() === "phone number").first();
    let phone = label.next("p").text().trim();

    // Fallback to regex if label-based method fails
    if (!phone || !/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(phone)) {
      phone = null;
      $("p").each((_, el) => {
        const text = $(el).text().trim();
        if (/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) {
          phone = text;
          return false;
        }
      });
    }

    return phone || null;
  } catch (error) {
    console.warn(`Failed to fetch phone number from ${url}:`, error.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateLeadsForLocation(data: any, limit = 10) {
  const { location, query = "local businesses", apiKey = process.env.SERPAPI_KEY } = data;

  const emailDomains = data.emailDomains || ["@gmail.com", "@yahoo.com"];
  const areaCodes = data.areaCodes || ["415", "619", "951"];

  const domainQuery = emailDomains.join(" OR ");
  const areaCodeQuery = areaCodes.join(" OR ");
  const fullQuery = `site:yelp.com/biz "${query} in ${location}" "${domainQuery}" ${areaCodeQuery}`;

  const params = {
    api_key: apiKey,
    engine: "google",
    q: fullQuery,
    num: limit,
  };

  try {
    const response = await axios.get("https://serpapi.com/search.json", { params });
    const results = response.data.organic_results || [];

    const leads = [];

    for (const result of results.slice(0, limit)) {
      const name = (result.title || "Business").split(" - ")[0];
      const snippet = result.snippet || "";

      const phoneMatch = snippet.match(/[(]?[0-9]{3}[)]?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
      const emailMatch = snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);

      let phone = phoneMatch ? phoneMatch[0].replace(/[-.\s()]/g, "") : null; // Normalize format

      leads.push({
        businessName: name,
        email: emailMatch ? emailMatch[0] : null,
        phone,
        location,
        yelpUrl: result.link,
        category: query,
      });
    }

    // Remove duplicates by phone
    const seen = new Set();
    const uniqueLeads = leads.filter(lead => {
      if (!lead.phone) return false;
      if (seen.has(lead.phone)) return false;
      seen.add(lead.phone);
      return true;
    });

    return uniqueLeads;
  } catch (err) {
    console.error("SerpAPI error:", err);
    return [];
  }
}

