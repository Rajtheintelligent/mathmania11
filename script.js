// --- 1. INITIAL SETUP ---

// Define the initial share prices, tracking the BASE price (for profit/loss calculation)
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
    const rupeeChange = Math.floor(Math.random() * (maxRupeeChange - minRupeeChange + 1)) + minRupeeChange;
    
    let newPrice = currentPrice + rupeeChange;
    
    // Ensure the price doesn't drop too low (min price is 5)
    newPrice = Math.max(5, newPrice); 
    
    // Calculate the percentage change based on the previous price
    let percentageChange = 0;
    if (currentPrice > 0) {
        percentageChange = (rupeeChange / currentPrice) * 100;
    }

    return {
        price: Math.round(newPrice), // Ensure whole number price
        changeRupees: rupeeChange,
        changePercent: percentageChange
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
        // Note: We use the current price (which is the previous cycle's price) to calculate the change
        const previousPrice = stock.price;
        const { price, changeRupees, changePercent } = fluctuatePrice(previousPrice);
        
        // --- Calculate Total Profit/Loss (₹) per Share ---
        const totalProfitLossPerShare = price - stock.base; 
        
        // Update the stock object for the next interval
        stock.price = price;
        stock.history.push(price);
        
        
        // --- Determine Visuals ---
        const priceClass = changeRupees >= 0 ? 'price-up' : 'price-down';
        const trendClass = changeRupees > 0 ? 'trend-up' : (changeRupees < 0 ? 'trend-down' : 'trend-neutral');
        const changeSign = changeRupees >= 0 ? '▲' : '▼';
        
        
        // --- Update Table (Ticker) ---
        const row = tickerBody.insertRow();
        
        // 1. Company Name
        row.insertCell(0).textContent = name; 
        
        // 2. Current Price (Whole Number)
        row.insertCell(1).textContent = price;
        
        // 3. Change (in ₹)
        const cell3 = row.insertCell(2);
        cell3.innerHTML = `<div class="${priceClass}">${changeSign} ${Math.abs(changeRupees)}</div>`;
        
        // 4. Change (%) - NEW COLUMN
        const cell4 = row.insertCell(3);
        cell4.innerHTML = `<div class="${priceClass}">${changeSign} ${Math.abs(changePercent).toFixed(2)}%</div>`; // Displaying 2 decimals for percentage

        // 5. Total P/L Per Share (₹) - Absolute difference from BASE PRICE
        const cell5 = row.insertCell(4);
        const plSign = totalProfitLossPerShare >= 0 ? '↑' : '↓';
        cell5.innerHTML = `<div class="${priceClass}">${plSign} ${Math.abs(totalProfitLossPerShare)}</div>`;

        // 6. Trend Visualizer
        const cell6 = row.insertCell(5);
        const currentMax = Math.max(...stock.history);
        const currentMin = Math.min(...stock.history);
        let trendHeight;

        if (currentMax === currentMin) {
            trendHeight = 100; // Stable
        } else {
            // Calculate where the current price sits between the min and max historical price (0-100%)
            trendHeight = ((stock.price - currentMin) / (currentMax - currentMin)) * 100;
        }

        cell6.innerHTML = `
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
