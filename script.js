// --- 1. INITIAL SETUP ---

// Define the initial share prices and track history for the graph
const stocks = {
    'Bitcoin': { price: 60, base: 60, color: 'rgb(255, 99, 132)', history: [60] },
    'Colgate': { price: 20, base: 20, color: 'rgb(54, 162, 235)', history: [20] },
    'Nifty 50': { price: 50, base: 50, color: 'rgb(255, 206, 86)', history: [50] },
    'Gold': { price: 40, base: 40, color: 'rgb(75, 192, 192)', history: [40] },
    'Sensex': { price: 60, base: 60, color: 'rgb(153, 102, 255)', history: [60] },
    'ICICI Bank': { price: 30, base: 30, color: 'rgb(255, 159, 64)', history: [30] },
    'Suzlon': { price: 20, base: 20, color: 'rgb(199, 199, 199)', history: [20] }
};

// You can adjust this list as needed.
const allStockNames = Object.keys(stocks);
let timeLabels = [0]; // Tracks the update cycles for the graph

// --- 2. CHART.JS CONFIGURATION ---

const ctx = document.getElementById('marketChart').getContext('2d');
const marketChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: allStockNames.map(name => ({
            label: name,
            data: stocks[name].history,
            borderColor: stocks[name].color,
            borderWidth: 2,
            fill: false,
            tension: 0.1
        }))
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: { display: true, text: 'Price (₹)' },
                beginAtZero: false // Prices don't have to start at 0
            },
            x: {
                title: { display: true, text: 'Time (15 sec intervals)' }
            }
        },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Share Price Movements Over Time' }
        }
    }
});

// --- 3. CORE LOGIC (PRICE UPDATE) ---

/**
 * Calculates a new price based on a small random percentage change.
 * @param {number} currentPrice - The price before fluctuation.
 * @returns {object} The new price and the change percentage.
 */
function fluctuatePrice(currentPrice) {
    // Generate a random percentage change between -5% and +5%
    // This keeps the fluctuations manageable for Grade 6 math.
    const minChange = -0.05; // -5%
    const maxChange = 0.05;  // +5%
    
    // Get a random change (e.g., 0.03 for 3%, or -0.02 for -2%)
    const percentageChange = Math.random() * (maxChange - minChange) + minChange;
    
    const newPrice = currentPrice * (1 + percentageChange);
    
    // Keep price rounded to 2 decimal places (like real money)
    return {
        price: Math.max(1, parseFloat(newPrice.toFixed(2))), // Price cannot go below 1
        change: parseFloat((percentageChange * 100).toFixed(2)) // Percentage change
    };
}

/**
 * Updates the prices of all shares, the ticker table, and the graph.
 */
function updateMarket() {
    const tickerBody = document.getElementById('stock-ticker-body');
    tickerBody.innerHTML = ''; // Clear the table

    allStockNames.forEach((name, index) => {
        const stock = stocks[name];
        const { price, change } = fluctuatePrice(stock.price);
        
        // Update the stock object
        stock.price = price;
        stock.history.push(price);
        
        // --- Update Table (Ticker) ---
        const row = tickerBody.insertRow();
        const priceClass = change >= 0 ? 'price-up' : 'price-down';
        const changeSign = change >= 0 ? '▲' : '▼';
        
        // 1. Company Name
        row.insertCell(0).textContent = name; 
        
        // 2. Current Price
        row.insertCell(1).textContent = price.toFixed(2);
        
        // 3. Change Percentage
        const changeCell = row.insertCell(2);
        changeCell.innerHTML = `${changeSign} ${Math.abs(change).toFixed(2)}%`;
        changeCell.className = priceClass;
        
        // --- Update Graph Dataset ---
        marketChart.data.datasets[index].data = stock.history;
    });

    // Update the time label for the graph
    timeLabels.push(timeLabels.length);
    marketChart.data.labels = timeLabels;

    // Redraw the chart
    marketChart.update();
    
    console.log(`Market updated at time step: ${timeLabels.length - 1}`);
}

// --- 4. START GAME TIMER ---

// Initial update on page load
updateMarket(); 

// Set the game to update every 15 seconds (15000 milliseconds)
const updateInterval = 15000;
setInterval(updateMarket, updateInterval);
