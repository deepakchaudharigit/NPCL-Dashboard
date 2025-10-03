#!/bin/bash

# NPCL Dashboard - Lighthouse Performance Testing Script
# This script runs comprehensive Lighthouse audits for your dashboard

echo "🚀 NPCL Dashboard - Lighthouse Performance Testing"
echo "=================================================="

# Check if server is running
if ! curl -s http://localhost:4000 > /dev/null; then
    echo "❌ Error: Development server is not running on port 4000"
    echo "Please run 'npm run dev' first"
    exit 1
fi

echo "✅ Server is running on http://localhost:4000"
echo ""

# Create reports directory
mkdir -p reports/lighthouse

# 1. Full Performance Audit
echo "📊 Running Full Performance Audit..."
npx lighthouse http://localhost:4000 \
    --output=html \
    --output=json \
    --output-path=./reports/lighthouse/full-audit \
    --chrome-flags="--headless" \
    --quiet

# 2. Mobile Performance Test
echo "📱 Running Mobile Performance Test..."
npx lighthouse http://localhost:4000 \
    --output=html \
    --output=json \
    --output-path=./reports/lighthouse/mobile-audit \
    --preset=perf \
    --form-factor=mobile \
    --chrome-flags="--headless" \
    --quiet

# 3. Desktop Performance Test
echo "💻 Running Desktop Performance Test..."
npx lighthouse http://localhost:4000 \
    --output=html \
    --output=json \
    --output-path=./reports/lighthouse/desktop-audit \
    --form-factor=desktop \
    --screenEmulation.mobile=false \
    --chrome-flags="--headless" \
    --quiet

# 4. PWA Audit
echo "📲 Running PWA Audit..."
npx lighthouse http://localhost:4000 \
    --output=html \
    --output=json \
    --output-path=./reports/lighthouse/pwa-audit \
    --only-categories=pwa \
    --chrome-flags="--headless" \
    --quiet

# 5. Accessibility Audit
echo "♿ Running Accessibility Audit..."
npx lighthouse http://localhost:4000 \
    --output=html \
    --output=json \
    --output-path=./reports/lighthouse/accessibility-audit \
    --only-categories=accessibility \
    --chrome-flags="--headless" \
    --quiet

# 6. SEO Audit
echo "🔍 Running SEO Audit..."
npx lighthouse http://localhost:4000 \
    --output=html \
    --output=json \
    --output-path=./reports/lighthouse/seo-audit \
    --only-categories=seo \
    --chrome-flags="--headless" \
    --quiet

# 7. Best Practices Audit
echo "✨ Running Best Practices Audit..."
npx lighthouse http://localhost:4000 \
    --output=html \
    --output=json \
    --output-path=./reports/lighthouse/best-practices-audit \
    --only-categories=best-practices \
    --chrome-flags="--headless" \
    --quiet

# 8. Dashboard Page Specific Test
echo "📈 Running Dashboard Page Test..."
npx lighthouse http://localhost:4000/dashboard \
    --output=html \
    --output=json \
    --output-path=./reports/lighthouse/dashboard-page \
    --chrome-flags="--headless" \
    --quiet

# 9. Reports Page Test
echo "📋 Running Reports Page Test..."
npx lighthouse http://localhost:4000/reports \
    --output=html \
    --output=json \
    --output-path=./reports/lighthouse/reports-page \
    --chrome-flags="--headless" \
    --quiet

# 10. Settings Page Test
echo "⚙️ Running Settings Page Test..."
npx lighthouse http://localhost:4000/settings \
    --output=html \
    --output=json \
    --output-path=./reports/lighthouse/settings-page \
    --chrome-flags="--headless" \
    --quiet

echo ""
echo "🎉 All Lighthouse audits completed!"
echo "📁 Reports saved in: ./reports/lighthouse/"
echo ""
echo "📊 Quick Summary:"
echo "- Full audit: ./reports/lighthouse/full-audit.report.html"
echo "- Mobile: ./reports/lighthouse/mobile-audit.report.html"
echo "- Desktop: ./reports/lighthouse/desktop-audit.report.html"
echo "- PWA: ./reports/lighthouse/pwa-audit.report.html"
echo "- Accessibility: ./reports/lighthouse/accessibility-audit.report.html"
echo "- SEO: ./reports/lighthouse/seo-audit.report.html"
echo "- Best Practices: ./reports/lighthouse/best-practices-audit.report.html"
echo ""
echo "🌐 To view reports, open the HTML files in your browser"
echo "💡 Tip: Use 'open ./reports/lighthouse/full-audit.report.html' to view the main report"