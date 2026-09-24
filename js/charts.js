/* ==========================================================================
   YOR Estate - Interactive SVG & Visual Chart Controllers
   ========================================================================== */

class ChartController {
  renderSalesChart(fy = "2026-27") {
    // Generates monthly properties sold bar chart matching yordashboard template
    const dataByFy = {
      "2026-27": {
        bars: [56, 68, 78, 62, 86, 96, 108, 92, 114, 104, 126, 142],
        avgY: 91
      },
      "2025-26": {
        bars: [48, 58, 66, 54, 74, 82, 94, 80, 98, 90, 110, 122],
        avgY: 104
      },
      "2024-25": {
        bars: [40, 50, 56, 46, 62, 70, 82, 68, 86, 78, 96, 108],
        avgY: 118
      }
    };
    const current = dataByFy[fy] || dataByFy["2026-27"];
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

    return `
      <svg viewBox="0 0 720 200" preserveAspectRatio="none" style="width:100%; height:155px; display:block">
        <g stroke="var(--line)">
          <line x1="0" y1="30" x2="720" y2="30"/>
          <line x1="0" y1="80" x2="720" y2="80"/>
          <line x1="0" y1="130" x2="720" y2="130"/>
          <line x1="0" y1="180" x2="720" y2="180"/>
        </g>

        <line x1="0" y1="${current.avgY}" x2="720" y2="${current.avgY}"
              stroke="#B7BCC6" stroke-width="1.5" stroke-dasharray="4 4"/>

        <g>
          ${current.bars.map((h, i) => {
            const x = 14 + i * 58;
            const y = 180 - h;
            const isCurrent = (i === current.bars.length - 1);
            const fill = isCurrent ? "#E4CE93" : "var(--ink)";
            return `<rect x="${x}" y="${y}" width="28" height="${h}" rx="3" fill="${fill}"/>`;
          }).join('')}
        </g>

        <g fill="var(--ink-3)" font-size="11" font-family="'Outfit', sans-serif" text-anchor="middle">
          ${months.map((m, i) => `<text x="${28 + i * 58}" y="198">${m}</text>`).join('')}
        </g>
      </svg>

      <div class="legend" style="margin-top:10px">
        <span><i style="background:var(--ink)"></i>Properties sold</span>
        <span><i style="background:#E4CE93"></i>Current month</span>
        <span><i style="background:#B7BCC6"></i>Monthly average</span>
      </div>
    `;
  }

  renderValuationHistoryChart(data = [10.2, 10.8, 11.4, 11.9, 12.5]) {
    return `
      <svg viewBox="0 0 600 160" preserveAspectRatio="none" style="width:100%; height:100%">
        <defs>
          <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#23406D" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#23406D" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path d="M 10 140 C 120 125, 220 105, 340 85 S 480 50, 590 30 L 590 160 L 10 160 Z" fill="url(#valGrad)"/>
        <path d="M 10 140 C 120 125, 220 105, 340 85 S 480 50, 590 30" fill="none" stroke="#23406D" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="10" cy="140" r="4" fill="#23406D"/>
        <circle cx="220" cy="105" r="4" fill="#23406D"/>
        <circle cx="340" cy="85" r="4" fill="#23406D"/>
        <circle cx="590" cy="30" r="5" fill="#BF973E" stroke="#fff" stroke-width="2"/>
      </svg>
    `;
  }

  renderOutletPerformanceChart() {
    const outlets = [
      { name: "YOR Central", rev: 130, tx: 85 },
      { name: "YOR South", rev: 118, tx: 82 },
      { name: "YOR North", rev: 106, tx: 79 },
      { name: "YOR East", rev: 94, tx: 76 },
      { name: "YOR West", rev: 82, tx: 73 }
    ];

    return `
      <svg viewBox="0 0 700 200" preserveAspectRatio="none" style="width:100%; height:100%">
        ${outlets.map((o, i) => `
          <g transform="translate(${40 + i * 130}, 0)">
            <!-- Revenue Bar -->
            <rect x="0" y="${170 - o.rev}" width="34" height="${o.rev}" rx="6" fill="#23406D"/>
            <!-- Transactions Bar -->
            <rect x="38" y="${170 - o.tx}" width="34" height="${o.tx}" rx="6" fill="#BF973E"/>
            <!-- Label -->
            <text x="36" y="190" text-anchor="middle" font-size="11" fill="#5B6068" font-family="'Outfit', sans-serif">${o.name.replace('YOR ', '')}</text>
          </g>
        `).join('')}
      </svg>
    `;
  }
}

window.charts = new ChartController();
