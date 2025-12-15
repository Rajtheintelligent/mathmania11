// --- 1. INITIAL SETUP ---

// Define the initial share prices, tracking the BASE price (for profit/loss calculation)
// All prices are whole numbers.
const stocks = {
    'Bitcoin': { price: 60, base: 60, history: [60] },
    'Colgate': { price: 20, base: 20, history: [20] },
    'Nifty 50': { price: 50, base: 50, history: [50] },
    'Gold': { price: 40, base: 40, history: [40] },
    'Sensex': { price: 60, base: 60, history: [60] },
    'ICICI Bank': { price: 30, base: 30, history: [30] },
    'Suzlon': { price: 20, base: 20, history: [20] }
};

const allStockNames = Object.keys(stocks);
let timeStep = 0;

// --- 2. CORE LOGIC (PRICE UPDATE) ---

/**
 * Calculates a new price based on a small random whole number change.
 * @param {number} currentPrice - The price before fluctuation.
 * @returns {object} The new price and the change amount (in whole rupees).
 */
function fluctuatePrice(currentPrice) {
    // Generate a random whole number change between -3 and +3 (in Rupees)
    const minRupeeChange = -3; 
    const maxRupeeChange = 3;  
    
    // Calculate a random whole number change (e.g., -2, -1, 0, 1, 2, 3)
    // Math.floor(Math.random() * (max - min + 1)) + min;
    const rupeeChange = Math.floor(Math.random() * (maxRupeeChange - minRupeeChange + 1)) + minRupeeChange;
    
    let newPrice = currentPrice + rupeeChange;
    
    // Ensure the price doesn't drop too low (min price is 5)
    newPrice = Math.max(5, newPrice); 

    // Ensure the price remains a whole number
    return {
        price: Math.round(newPrice),
        change: rupeeChange 
    };
}

/**
 * Updates the prices of all shares and the ticker table.
 */
function updateMarket() {
    timeStep++;
    const tickerBody = document.getElementById('stock-ticker-body');
    tickerBody.innerHTML = ''; // Clear the table

    allStockNames.forEach((name) => {
        const stock = stocks[name];
        const { price, change } = fluctuatePrice(stock.price);
        
        // --- Calculate Total Profit/Loss (₹) per Share ---
        // P/L is calculated against the initial BASE price (the student's cost)
        const totalProfitLossPerShare = price - stock.base; 
        
        // Update the stock object for the next interval
        stock.price = price;
        stock.history.push(price);
        
        
        // --- Determine Visuals ---
        const priceClass = change >= 0 ? 'price-up' : 'price-down';
        const trendClass = change > 0 ? 'trend-up' : (change < 0 ? 'trend-down' : 'trend-neutral');
        const changeSign = change >= 0 ? '▲' : '▼';
        
        
        // --- Update Table (Ticker) ---
        const row = tickerBody.insertRow();
        
        // 1. Company Name
        row.insertCell(0).textContent = name; 
        
        // 2. Current Price (Whole Number)
        row.insertCell(1).textContent = price;
        
        // 3. Change (in ₹)
        const cell3 = row.insertCell(2);
        cell3.innerHTML = `<div class="${priceClass}">${changeSign} ${Math.abs(change)}</div>`;
        
        // 4. Total P/L Per Share (₹) - Absolute difference from BASE PRICE
        const cell4 = row.insertCell(3);
        const plSign = totalProfitLossPerShare >= 0 ? '↑' : '↓';
        cell4.innerHTML = `<div class="${priceClass}">${plSign} ${Math.abs(totalProfitLossPerShare)}</div>`;

        // 5. Trend Visualizer
        const cell5 = row.insertCell(4);
        // We use the entire history range to set the height (simple visual)
        const currentMax = Math.max(...stock.history);
        const currentMin = Math.min(...stock.history);
        let trendHeight;

        if (currentMax === currentMin) {
            trendHeight = 100; // Stable
        } else {
            // Calculate where the current price sits between the min and max historical price (0-100%)
            trendHeight = ((stock.price - currentMin) / (currentMax - currentMin)) * 100;
        }

        cell5.innerHTML = `
            <div class="trend-visual ${trendClass}">
                <div class="trend-fill" style="height: ${Math.round(trendHeight)}%;"></div>
            </div>`;
    });
    
    console.log(`Market updated at time step: ${timeStep}`);
}

// --- 3. START GAME TIMER ---

// Initial update on page load
updateMarket(); 

// Set the game to update every 15 seconds (15000 milliseconds)
const updateInterval = 15000;
setInterval(updateMarket, updateInterval);
