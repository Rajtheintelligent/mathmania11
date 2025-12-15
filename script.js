// --- 1. INITIAL SETUP ---

// Define the initial share prices, tracking the BASE price (for profit/loss calculation)
const stocks = {
    'Bitcoin': { price: 60.00, base: 60.00, history: [60] },
    'Colgate': { price: 20.00, base: 20.00, history: [20] },
    'Nifty 50': { price: 50.00, base: 50.00, history: [50] },
    'Gold': { price: 40.00, base: 40.00, history: [40] },
    'Sensex': { price: 60.00, base: 60.00, history: [60] },
    'ICICI Bank': { price: 30.00, base: 30.00, history: [30] },
    'Suzlon': { price: 20.00, base: 20.00, history: [20] }
};

const allStockNames = Object.keys(stocks);
let timeStep = 0;

// --- 2. CORE LOGIC (PRICE UPDATE) ---

/**
 * Calculates a new price based on a small random percentage change.
 * @param {number} currentPrice - The price before fluctuation.
 * @returns {object} The new price and the change percentage.
 */
function fluctuatePrice(currentPrice) {
    // Generate a random percentage change between -5% and +5%
    const minChange = -0.05; // -5%
    const maxChange = 0.05;  // +5%
    
    const percentageChange = Math.random() * (maxChange - minChange) + minChange;
    
    let newPrice = currentPrice * (1 + percentageChange);
    
    // Ensure the price doesn't drop too low, especially for low-priced stocks
    newPrice = Math.max(5, parseFloat(newPrice.toFixed(2))); 

    return {
        price: newPrice,
        change: parseFloat((percentageChange * 100).toFixed(2)) // Percentage change
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
        
        // --- Calculate Profit/Loss (₹) ---
        // Profit/Loss is calculated against the initial BASE price for the game
        const absoluteChange = price - stock.base; 
        
        // Update the stock object for the next interval
        stock.price = price;
        stock.history.push(price);
        
        
        // --- Determine Visuals ---
        const priceClass = change >= 0 ? 'price-up' : 'price-down';
        const trendClass = change > 0.01 ? 'trend-up' : (change < -0.01 ? 'trend-down' : 'trend-neutral');
        const changeSign = change >= 0 ? '▲' : '▼';
        
        
        // --- Update Table (Ticker) ---
        const row = tickerBody.insertRow();
        
        // 1. Company Name
        row.insertCell(0).textContent = name; 
        
        // 2. Current Price
        row.insertCell(1).textContent = price.toFixed(2);
        
        // 3. Change Percentage
        const cell3 = row.insertCell(2);
        cell3.innerHTML = `<div class="${priceClass}">${changeSign} ${Math.abs(change).toFixed(2)}%</div>`;
        
        // 4. Profit/Loss (₹) - Absolute value difference from BASE PRICE
        const cell4 = row.insertCell(3);
        cell4.innerHTML = `<div class="${priceClass}">${absoluteChange >= 0 ? '↑' : '↓'} ${Math.abs(absoluteChange).toFixed(2)}</div>`;

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
