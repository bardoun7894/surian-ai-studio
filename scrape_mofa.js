import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firecrawl
// Based on inspection, the default export is a class that has a .v1 property for the old API
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

async function scrapeConfig() {
    try {
        console.log("Attempting app.v1.scrapeUrl...");

        // access the v1 client which likely has the methods we know
        const scrapeResult = await app.v1.scrapeUrl('https://mofaex.gov.sy/', {
            formats: ['markdown', 'html'],
        });

        if (scrapeResult.success) {
            console.log("--- MARKDOWN CONTENT ---");
            console.log(scrapeResult.markdown.substring(0, 500) + "...");
            console.log("\n--- HTML CONTENT (Snippet) ---");
            console.log(scrapeResult.html.substring(0, 500) + "...");
        } else {
            console.error("Scrape failed:", scrapeResult);
        }
    } catch (error) {
        console.error("Error running Firecrawl:", error);
        // Fallback?
    }
}

scrapeConfig();
