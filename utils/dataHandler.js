import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '..', 'data', 'payouts.json');

/**
 * Reads and returns the data from payouts.json.
 * @returns {Object} The payout data.
 */
export function readData() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data file:", error.message);
        // If file is missing or corrupt, return an empty object
        return {}; 
    }
}

/**
 * Writes the provided data object back to payouts.json.
 * @param {Object} data - The data object to write.
 */
export function writeData(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing data file:", error.message);
    }
}
