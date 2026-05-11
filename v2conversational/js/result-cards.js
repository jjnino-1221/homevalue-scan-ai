// Result Cards - Rich visual display components using RDS (Rocket Design System)
// Uses RDS classes from css/chat.css - NO custom CSS

// Render Valuation Result Card
export function renderValuationCard(data) {
  const card = document.createElement('div');
  card.className = 'rkt-Card rkt-Spacing--mb24 rkt-Elevation-2';
  card.style.backgroundColor = 'white';
  card.style.marginTop = '16px';

  // Header
  const header = document.createElement('div');
  header.className = 'rkt-Card__header';
  header.innerHTML = `
    <span class="rkt-Icon" style="font-size: 32px;">🏡</span>
    <span style="font-size: 20px; font-weight: 600; color: var(--text-primary);">Your Property Valuation</span>
  `;

  // Content Container
  const content = document.createElement('div');
  content.className = 'rkt-Card__content';

  // Value Range Section
  const rangeSection = document.createElement('div');
  rangeSection.className = 'rkt-Spacing--mb16';
  rangeSection.innerHTML = `
    <div class="rkt-Card__subtitle rkt-Spacing--mb8">Estimated Value Range</div>
    <div style="display: flex; align-items: center; gap: 12px; font-size: 20px; color: var(--primary-color);">
      <span>$${data.rangeLow.toLocaleString()}</span>
      <span>—</span>
      <span>$${data.rangeHigh.toLocaleString()}</span>
    </div>
  `;

  // Most Likely Value
  const valueSection = document.createElement('div');
  valueSection.className = 'rkt-Spacing--mb16';
  valueSection.innerHTML = `
    <div class="rkt-Card__subtitle rkt-Spacing--mb8">Most Likely Value</div>
    <div class="rkt-Card__value">$${data.estimate.toLocaleString()}</div>
  `;

  // Confidence Meter
  const confidenceSection = document.createElement('div');
  confidenceSection.className = 'rkt-ConfidenceMeter rkt-Spacing--mb16';
  confidenceSection.innerHTML = `
    <div class="rkt-ConfidenceMeter__header">
      <span class="rkt-ConfidenceMeter__label">Confidence Level</span>
      <span class="rkt-ConfidenceMeter__value">${data.confidence}%</span>
    </div>
    <div class="rkt-ConfidenceMeter__track">
      <div class="rkt-ConfidenceMeter__fill" style="width: ${data.confidence}%"></div>
    </div>
    <div class="rkt-ConfidenceMeter__message">
      ${data.confidence >= 90 ? 'Very confident estimate' : data.confidence >= 80 ? 'Good confidence' : 'Moderate confidence'}
    </div>
  `;

  // Property Details Grid
  const detailsGrid = document.createElement('div');
  detailsGrid.style.display = 'grid';
  detailsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
  detailsGrid.style.gap = '16px';
  detailsGrid.style.marginTop = '24px';
  detailsGrid.style.paddingTop = '24px';
  detailsGrid.style.borderTop = '1px solid var(--border-color)';

  const details = [
    { icon: '📍', label: 'Address', value: data.address },
    { icon: '📐', label: 'Square Footage', value: `${data.sqft.toLocaleString()} sq ft` },
    { icon: '💵', label: 'Price per Sq Ft', value: `$${data.pricePerSqFt}` },
    { icon: '🛏️', label: 'Bedrooms / Bathrooms', value: `${data.bedrooms} bd / ${data.bathrooms} ba` }
  ];

  details.forEach(detail => {
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.gap = '12px';
    item.innerHTML = `
      <span style="font-size: 24px;">${detail.icon}</span>
      <div>
        <div class="rkt-Card__subtitle">${detail.label}</div>
        <div style="font-size: 16px; font-weight: 600; color: var(--text-primary);">${detail.value}</div>
      </div>
    `;
    detailsGrid.appendChild(item);
  });

  content.appendChild(rangeSection);
  content.appendChild(valueSection);
  content.appendChild(confidenceSection);
  content.appendChild(detailsGrid);

  // Action Buttons
  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '12px';
  actions.style.marginTop = '24px';
  actions.style.flexWrap = 'wrap';

  const buttons = [
    { label: 'View Comparables', value: 'view_comparables' },
    { label: 'View Recommendations', value: 'view_recommendations' },
    { label: 'Download PDF Report', value: 'download_pdf' }
  ];

  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.className = 'rkt-Button--primary';
    button.style.flex = '1';
    button.style.minWidth = '150px';
    button.textContent = btn.label;
    button.dataset.action = btn.value;

    button.addEventListener('click', () => {
      if (window.AIOrchestrator) {
        window.AIOrchestrator.sendMessageWithDisplay(btn.value, btn.label);
      }
    });

    actions.appendChild(button);
  });

  card.appendChild(header);
  card.appendChild(content);
  card.appendChild(actions);

  return card;
}

// Render Comparables Cards (3 properties)
export function renderComparablesCards(data) {
  const container = document.createElement('div');
  container.className = 'rkt-Spacing--mb24';

  // Header
  const header = document.createElement('div');
  header.className = 'rkt-Spacing--mb16';
  header.innerHTML = '<h3 style="font-size: 20px; font-weight: 600; color: var(--text-primary);">Comparable Properties Near You</h3>';
  container.appendChild(header);

  // Grid
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
  grid.style.gap = '16px';
  grid.className = 'rkt-Spacing--mb16';

  data.forEach((comp, index) => {
    const card = document.createElement('div');
    card.className = 'rkt-Card rkt-Elevation-1';
    card.style.position = 'relative';
    card.style.backgroundColor = 'white';

    card.innerHTML = `
      <div style="position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;">
        #${index + 1}
      </div>
      <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">${comp.address}</div>
      <div class="rkt-Card__value" style="margin-bottom: 8px;">$${comp.price.toLocaleString()}</div>
      <div style="display: flex; gap: 16px; font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">
        <span>${comp.sqft.toLocaleString()} sq ft</span>
        <span>${comp.bedrooms || comp.beds} bd / ${comp.bathrooms || comp.baths} ba</span>
      </div>
      <div style="font-size: 14px; color: var(--text-secondary);">
        <span style="margin-right: 4px;">📍</span>${comp.distance} mi
      </div>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);

  // Summary
  const summary = document.createElement('div');
  summary.className = 'rkt-Card rkt-BackgroundColor--gray-50';
  summary.style.fontSize = '14px';
  summary.style.color = 'var(--text-secondary)';
  const avgPrice = data.reduce((sum, c) => sum + c.price, 0) / data.length;
  summary.innerHTML = `
    <p>Average comparable price: <strong style="color: var(--text-primary);">$${Math.round(avgPrice).toLocaleString()}</strong></p>
    <p style="margin-top: 8px;">Your property's estimated value of <strong style="color: var(--text-primary);">$285,000</strong> is right in line with these comparable homes.</p>
  `;
  container.appendChild(summary);

  return container;
}

// Render Recommendations Cards
export function renderRecommendationsCards(summaryData, recommendations) {
  console.log('DEBUG: renderRecommendationsCards called');
  console.log('  summaryData:', summaryData);
  console.log('  recommendations count:', recommendations?.length);

  try {
    const container = document.createElement('div');
    container.className = 'rkt-Spacing--mb24';

    // Summary Card
    const summaryCard = document.createElement('div');
    summaryCard.className = 'rkt-Card rkt-Elevation-2 rkt-Spacing--mb16';
    summaryCard.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    summaryCard.style.color = 'white';
    summaryCard.style.display = 'flex';
    summaryCard.style.alignItems = 'center';
    summaryCard.style.gap = '20px';
    summaryCard.innerHTML = `
      <div style="font-size: 48px;">📊</div>
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 24px;">We found ${summaryData.count} recommendations</h3>
        <p style="font-size: 16px; opacity: 0.9; margin: 0;">
          Potential value increase:
          <strong>$${summaryData.valueIncrease.min.toLocaleString()} - $${summaryData.valueIncrease.max.toLocaleString()}</strong>
        </p>
      </div>
    `;
    container.appendChild(summaryCard);
    console.log('  ✅ Summary card created');

  // Recommendations Grid
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gap = '16px';

  console.log('  Creating recommendation cards...');
  recommendations.forEach((rec, index) => {
    console.log(`  Processing rec #${index + 1}:`, rec.title);
    const card = document.createElement('div');
    card.className = 'rkt-Card rkt-Elevation-1';
    card.style.backgroundColor = 'white';

    // Impact score color
    const impact = rec.impactScore || rec.impact || 0;
    let impactColor = '#4caf50'; // Green
    if (impact < 60) impactColor = '#f44336'; // Red
    else if (impact < 80) impactColor = '#ff9800'; // Orange

    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div style="width: 36px; height: 36px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px;">
          #${index + 1}
        </div>
        <div style="font-size: 20px; font-weight: 600; color: var(--text-primary);">${rec.title}</div>
      </div>
      <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px;">${rec.description}</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; margin-bottom: 16px; padding: 16px; background: var(--secondary-color); border-radius: 8px;">
        <div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Investment</div>
          <div style="font-size: 16px; font-weight: 600; color: var(--text-primary);">$${(rec.investmentRange?.[0] || rec.investment?.min || 0).toLocaleString()} - $${(rec.investmentRange?.[1] || rec.investment?.max || 0).toLocaleString()}</div>
        </div>
        <div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Value Add</div>
          <div style="font-size: 16px; font-weight: 600; color: #4caf50;">+$${(rec.valueAdd?.[0] || rec.valueAdd?.min || 0).toLocaleString()} - $${(rec.valueAdd?.[1] || rec.valueAdd?.max || 0).toLocaleString()}</div>
        </div>
        <div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">ROI</div>
          <div style="font-size: 16px; font-weight: 600; color: #ff9800;">${rec.roi}%</div>
        </div>
      </div>
      <div style="padding: 12px; border-radius: 8px; background: var(--secondary-color);">
        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">Impact Score</div>
        <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
          <div style="height: 100%; background: ${impactColor}; width: ${impact}%; transition: width 0.3s ease;"></div>
        </div>
        <div style="font-size: 16px; font-weight: 600; color: var(--text-primary);">${impact}/100</div>
      </div>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);

  // Disclaimer
  const disclaimer = document.createElement('div');
  disclaimer.className = 'rkt-Card rkt-Spacing--mb16';
  disclaimer.style.background = '#fff3cd';
  disclaimer.style.borderLeft = '4px solid #ffc107';
  disclaimer.style.fontSize = '14px';
  disclaimer.style.color = '#856404';
  disclaimer.innerHTML = `
    <p><strong>Note:</strong> These recommendations are estimates based on typical market conditions and property data.
    Actual costs and value increases may vary. Consult with licensed contractors for accurate quotes.</p>
  `;
  container.appendChild(disclaimer);

    console.log('✅ Recommendations card container complete, returning...');
    return container;
  } catch (error) {
    console.error('❌ ERROR in renderRecommendationsCards:', error);
    console.error('  summaryData:', summaryData);
    console.error('  recommendations:', recommendations);
    return null;
  }
}

// Render PDF download notification
export function renderPDFDownload(pdfUrl) {
  const notification = document.createElement('div');
  notification.className = 'rkt-Card rkt-Elevation-2';
  notification.style.backgroundColor = 'white';
  notification.style.borderLeft = '4px solid #4caf50';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.justifyContent = 'space-between';
  notification.style.marginTop = '16px';
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 16px;">
      <span style="font-size: 32px;">📄</span>
      <div>
        <strong style="display: block; font-size: 16px; margin-bottom: 4px;">Your report is ready!</strong>
        <p style="margin: 0; font-size: 14px; color: var(--text-secondary);">Complete property valuation report with recommendations</p>
      </div>
    </div>
    <a href="${pdfUrl}" download="property-valuation-report.pdf" class="rkt-Button--primary" style="text-decoration: none; background-color: #4caf50;">
      Download PDF
    </a>
  `;
  return notification;
}
