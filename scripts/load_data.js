import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXCEL_FILE = path.join(__dirname, '../Learning Time Frame.xlsx');
const OUTPUT_FILE = path.join(__dirname, '../src/data/topics.json');

function loadData() {
    try {
        if (!fs.existsSync(EXCEL_FILE)) {
            console.error(`Error: File not found at ${EXCEL_FILE}`);
            process.exit(1);
        }

        const workbook = XLSX.readFile(EXCEL_FILE);

        // Parse MainTopics
        console.log('Available Sheets:', workbook.SheetNames);
        const mainSheet = workbook.Sheets['Main Topics'];
        if (!mainSheet) {
            console.error('Error: Sheet "Main Topics" not found');
            process.exit(1);
        }
        const mainTopicsRaw = XLSX.utils.sheet_to_json(mainSheet);
        console.log('Main Topics Columns:', Object.keys(mainTopicsRaw[0] || {}));

        // Parse SubTopics
        const subSheet = workbook.Sheets['Sub Topics'];
        if (!subSheet) {
            console.error('Error: Sheet "Sub Topics" not found');
            process.exit(1);
        }
        const subTopicsRaw = XLSX.utils.sheet_to_json(subSheet);
        console.log('Sub Topics Columns:', Object.keys(subTopicsRaw[0] || {}));


        // Process Data
        const topics = mainTopicsRaw.map(row => {
            const title = row['Topic'];
            let link = row['Documentation'];

            // Apply override if exists
            if (LINK_OVERRIDES[title]) {
                link = LINK_OVERRIDES[title];
            }

            if (!title) return null;

            const subtopics = subTopicsRaw
                .filter(sub => sub['Parent Topic'] === title)
                .map(sub => sub['Sub-Topics'])
                .filter(Boolean);

            return {
                title,
                link: link || null,
                subtopics
            };
        }).filter(Boolean);

        // Write to JSON
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topics, null, 2));
        console.log(`Successfully generated ${topics.length} topics to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Error processing data:', error);
        process.exit(1);
    }
}

loadData();
