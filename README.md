# Bulk QR Code Generator (1111 - 1270)

This is a single, self-contained HTML file designed to instantly generate 160 unique QR codes, sequentially numbered from **1111** to **1270**. The primary purpose of this file is to generate a high-quality, printable PDF output suitable for bulk labeling needs.

## 🚀 How to Use It

Because this file uses a CDN (Content Delivery Network) for the QR code library, no installation or build steps are required.

### 1. Generate the Codes

1.  **Save the file:** Save the provided HTML content as `qr_generator.html`.
2.  **Open in Browser:** Double-click the file to open it in any modern web browser (Chrome, Firefox, Edge, etc.).
3.  All 160 QR codes will be displayed immediately.

### 2. Save as Printable PDF

The file is optimized for printing to PDF, which reliably captures all codes and hides the instructions.

1.  Open the browser's **Print Dialog**: Press `Ctrl + P` (Windows/Linux) or `Cmd + P` (Mac).
2.  In the Print Dialog, select **"Save as PDF"** or **"Microsoft Print to PDF"** (or similar system PDF driver) as the destination/printer.
3.  Ensure the layout is set to **Portrait** or **Landscape** (depending on how many codes you want per page, Portrait usually works well).
4.  Click **"Save"** or **"Print"** to create your bulk PDF file.

## ⚙️ Technical Details

| Feature | Description |
| :--- | :--- |
| **Code Range** | 1111 to 1270 (160 codes total) |
| **Data Encoding** | The content of each QR code is simply the 4-digit number (e.g., `1111`, `1112`, etc.). |
| **Library Used** | `qrcode-generator` (loaded via CDN). |
| **Print Optimization** | The JavaScript converts the generated `<canvas>` elements into print-friendly `<img>` tags (Base64 PNGs) to prevent the "blank PDF" issue common with printing dynamic canvas elements. |
| **Styling** | Uses CSS Flexbox for an organized grid layout and `@media print` rules to hide screen elements when saving the PDF. |

---

## 🔧 Modification

If you need to change the range of codes, modify the following two variables within the `<script>` tag of the HTML file:

```javascript
const startNumber = 1111; // Change to your desired starting number
const endNumber = 1270;   // Change to your desired ending number
