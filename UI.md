# NPCL Dashboard - UI Design Documentation

## Overview
This document provides a comprehensive description of the current UI design for the NPCL Dashboard project. It serves as a reference to maintain design consistency and can be used to restore the UI if it gets disturbed during dynamic changes.

**Last Updated:** January 2025  
**Version:** 1.0  
**Framework:** Next.js 15 with Tailwind CSS  

---

## 🎨 Design System

### Color Palette

#### Primary Colors
- **Primary Blue:** `#4f46e5` (Indigo-600)
- **Primary Blue Hover:** `#4338ca` (Indigo-700)
- **Primary Blue Active:** `#3730a3` (Indigo-800)
- **Primary Blue Light:** `#eef2ff` (Indigo-50)

#### Secondary Colors
- **Gray Scale:**
  - Background: `#f9fafb` (Gray-50)
  - Card Background: `#ffffff` (White)
  - Text Primary: `#111827` (Gray-900)
  - Text Secondary: `#6b7280` (Gray-500)
  - Text Muted: `#9ca3af` (Gray-400)
  - Border: `#e5e7eb` (Gray-200)
  - Border Light: `#f3f4f6` (Gray-100)

#### Status Colors
- **Success:** `#10b981` (Emerald-500)
- **Warning:** `#f59e0b` (Amber-500)
- **Error:** `#ef4444` (Red-500)
- **Info:** `#3b82f6` (Blue-500)

#### Metric Card Colors
- **Phone Icon:** Background `#eef2ff`, Icon `#6366f1`
- **Clock Icon:** Background `#f5f3ff`, Icon `#8b5cf6`
- **Globe Icon:** Background `#fdf2f8`, Icon `#ec4899`
- **Document Icon:** Background `#fffbeb`, Icon `#f59e0b`

### Typography

#### Font Family
- **Primary:** Inter (Google Fonts)
- **Fallback:** ui-sans-serif, system-ui, sans-serif

#### Font Sizes & Weights
```css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; } /* 36px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; } /* 24px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; } /* 20px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */

/* Body Text */
.text-base { font-size: 1rem; line-height: 1.5rem; } /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1rem; } /* 12px */

/* Font Weights */
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }
.font-normal { font-weight: 400; }
```

#### Mobile Typography Adjustments
- Form inputs use `font-size: 16px` to prevent iOS zoom
- Touch targets have minimum 44px height
- Responsive text scaling for different screen sizes

### Spacing System

#### Padding & Margins
```css
/* Standard Spacing Scale */
.p-1 { padding: 0.25rem; } /* 4px */
.p-2 { padding: 0.5rem; } /* 8px */
.p-3 { padding: 0.75rem; } /* 12px */
.p-4 { padding: 1rem; } /* 16px */
.p-6 { padding: 1.5rem; } /* 24px */
.p-8 { padding: 2rem; } /* 32px */

/* Mobile-Optimized Spacing */
.space-mobile-y > * + * { margin-top: 12px; }
.space-mobile-x > * + * { margin-left: 12px; }

/* Desktop Spacing (sm: breakpoint and up) */
@media (min-width: 640px) {
  .space-mobile-y > * + * { margin-top: 16px; }
  .space-mobile-x > * + * { margin-left: 16px; }
}
```

### Border Radius
```css
.rounded-sm { border-radius: 0.125rem; } /* 2px */
.rounded { border-radius: 0.25rem; } /* 4px */
.rounded-md { border-radius: 0.375rem; } /* 6px */
.rounded-lg { border-radius: 0.5rem; } /* 8px */
.rounded-xl { border-radius: 0.75rem; } /* 12px */
.rounded-2xl { border-radius: 1rem; } /* 16px */
.rounded-full { border-radius: 9999px; }
```

---

## 📱 Layout Structure

### Root Layout (`app/layout.tsx`)
```tsx
<html lang="en" className="h-full">
  <body className={`${inter.className} h-full antialiased`}>
    <SessionProvider>
      <PWAProvider>
        <PerformanceOptimizer />
        <div className="min-h-screen bg-gray-50 touch-manipulation">
          {children}
          <PWAInstallPrompt />
        </div>
      </PWAProvider>
    </SessionProvider>
  </body>
</html>
```

#### Key Features:
- **PWA Support:** Full Progressive Web App capabilities
- **Session Management:** NextAuth.js integration
- **Mobile Optimization:** Touch manipulation and safe area support
- **Performance:** Optimized loading and rendering

### Dashboard Layout (`app/dashboard/layout.tsx`)
```tsx
<div className="flex h-screen bg-gray-50 overflow-hidden">
  <Sidebar />
  <main className="ml-0 md:ml-60 h-screen p-4 md:p-6 bg-gray-50 w-full overflow-y-auto">
    {children}
  </main>
</div>
```

#### Responsive Behavior:
- **Mobile:** Sidebar hidden, full-width main content
- **Desktop:** Fixed 240px (60 units) sidebar, main content with left margin

---

## 🧩 Component Design Patterns

### 1. Sidebar Component

#### Desktop Design:
```css
/* Fixed positioning */
position: fixed;
left: 0;
top: 0;
height: 100vh;
width: 240px; /* 60 units */
background: white;
border-right: 1px solid #e5e7eb;
z-index: 50;
```

#### Logo Section:
```css
height: 80px; /* 20 units */
padding: 24px 20px; /* py-6 px-5 */
border-bottom: 1px solid #f3f4f6;
font-size: 24px; /* text-2xl */
font-weight: 700; /* font-bold */
color: #1f2937; /* text-gray-800 */
letter-spacing: 0.1em; /* tracking-widest */
```

#### Navigation Items:
```css
/* Container */
padding: 16px 12px; /* py-4 px-3 */

/* Individual Items */
display: flex;
align-items: center;
gap: 12px; /* gap-3 */
padding: 12px 16px; /* py-3 px-4 */
font-size: 14px; /* text-sm */
font-weight: 500; /* font-medium */
border-radius: 8px; /* rounded-lg */
margin: 0 12px; /* mx-3 */
transition: all 0.3s ease;

/* Active State */
background: linear-gradient(to right, #6366f1, #8b5cf6);
color: white;
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* Inactive State */
color: #6b7280; /* text-gray-600 */
hover:background-color: #f9fafb; /* hover:bg-gray-50 */
hover:color: #111827; /* hover:text-gray-900 */
```

#### Logout Button:
```css
position: absolute;
bottom: 24px; /* bottom-6 */
left: 12px; /* left-3 */
right: 12px; /* right-3 */
width: 100%;
height: 44px; /* h-11 */
background-color: #dc2626; /* bg-red-600 */
color: white;
border-radius: 8px; /* rounded-lg */
hover:background-color: #b91c1c; /* hover:bg-red-700 */
```

#### Mobile Behavior:
```css
transform: translateX(-100%); /* Hidden by default */
transition: transform 0.3s ease;

/* When open */
transform: translateX(0);
```

### 2. Mobile Header Component

#### Structure:
```css
/* Container */
position: sticky;
top: 0;
z-index: 30;
background: white;
border-bottom: 1px solid #e5e7eb;
padding-top: env(safe-area-inset-top); /* iOS safe area */

/* Content */
display: flex;
align-items: center;
justify-content: space-between;
padding: 12px 16px; /* py-3 px-4 */
```

#### Logo/Back Button:
```css
/* Logo */
width: 32px; /* w-8 */
height: 32px; /* h-8 */
background-color: #4f46e5; /* bg-indigo-600 */
border-radius: 8px; /* rounded-lg */
color: white;
font-weight: 700; /* font-bold */
font-size: 14px; /* text-sm */

/* Back Button */
padding: 8px; /* p-2 */
margin-left: -8px; /* -ml-2 */
color: #6b7280; /* text-gray-600 */
border-radius: 8px; /* rounded-lg */
hover:color: #111827; /* hover:text-gray-900 */
hover:background-color: #f3f4f6; /* hover:bg-gray-100 */
```

#### Title:
```css
font-size: 18px; /* text-lg */
font-weight: 600; /* font-semibold */
color: #111827; /* text-gray-900 */
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

#### User Avatar:
```css
width: 32px; /* w-8 */
height: 32px; /* h-8 */
background-color: #e0e7ff; /* bg-indigo-100 */
border-radius: 50%; /* rounded-full */
color: #4f46e5; /* text-indigo-600 */
font-weight: 500; /* font-medium */
font-size: 14px; /* text-sm */
```

### 3. Mobile Navigation Component

#### Container:
```css
position: fixed;
bottom: 0;
left: 0;
right: 0;
background: white;
border-top: 1px solid #e5e7eb;
z-index: 40;
padding-bottom: env(safe-area-inset-bottom); /* iOS safe area */
```

#### Navigation Items:
```css
/* Container */
display: flex;
align-items: center;
justify-content: space-around;
padding: 8px 0; /* py-2 */

/* Individual Items */
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 8px 12px; /* py-2 px-3 */
border-radius: 8px; /* rounded-lg */
transition: colors 0.2s ease;
min-width: 0;
flex: 1;

/* Active State */
color: #4f46e5; /* text-indigo-600 */
background-color: #eef2ff; /* bg-indigo-50 */

/* Inactive State */
color: #6b7280; /* text-gray-600 */
hover:color: #111827; /* hover:text-gray-900 */
hover:background-color: #f9fafb; /* hover:bg-gray-50 */
```

#### Icons & Labels:
```css
/* Icons */
width: 24px; /* w-6 */
height: 24px; /* h-6 */

/* Labels */
font-size: 12px; /* text-xs */
margin-top: 4px; /* mt-1 */
font-weight: 500; /* font-medium */
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
width: 100%;
text-align: center;
```

#### Auto-hide on Scroll:
```css
/* Hidden state */
transform: translateY(100%);
transition: transform 0.3s ease;

/* Visible state */
transform: translateY(0);
```

### 4. Metrics Card Component

#### Container:
```css
background: white;
border-radius: 12px; /* rounded-xl */
padding: 16px; /* p-4 */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* shadow-sm */
height: 128px; /* h-32 */
display: flex;
flex-direction: column;
justify-content: space-between;
transition: all 0.2s ease;

/* Hover Effects */
hover:box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); /* hover:shadow-lg */
hover:transform: translateY(-4px); /* hover:-translate-y-1 */
```

#### Icon Container:
```css
width: 40px; /* w-10 */
height: 40px; /* h-10 */
border-radius: 8px; /* rounded-lg */
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 8px; /* mb-2 */

/* Icon */
width: 20px; /* w-5 */
height: 20px; /* h-5 */
```

#### Value Display:
```css
font-size: 30px; /* text-3xl */
font-weight: 700; /* font-bold */
color: #1f2937; /* text-gray-800 */
margin-bottom: 4px; /* mb-1 */
```

#### Title:
```css
font-size: 12px; /* text-xs */
font-weight: 500; /* font-medium */
color: #6b7280; /* text-gray-600 */
margin-bottom: 4px; /* mb-1 */
```

#### Growth Indicator:
```css
font-size: 12px; /* text-xs */
font-weight: 500; /* font-medium */
display: flex;
align-items: center;
gap: 4px; /* gap-1 */

/* Positive Growth */
color: #10b981; /* text-green-500 */

/* Negative Growth */
color: #ef4444; /* text-red-500 */
```

### 5. Chart Components

#### Container:
```css
background: white;
border-radius: 12px; /* rounded-xl */
padding: 16px; /* p-4 */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* shadow-sm */
border: 1px solid #f3f4f6; /* border-gray-100 */
height: 100%;
display: flex;
flex-direction: column;
```

#### Chart Title:
```css
font-size: 18px; /* text-lg */
font-weight: 600; /* font-semibold */
color: #111827; /* text-gray-900 */
margin-bottom: 16px; /* mb-4 */
flex-shrink: 0;
```

#### Chart Container:
```css
flex: 1;
min-height: 0;
```

### 6. Form Components

#### Input Fields:
```css
display: block;
width: 100%;
padding: 12px 16px; /* py-3 px-4 */
font-size: 16px; /* text-base - prevents iOS zoom */
border: 1px solid #d1d5db; /* border-gray-300 */
border-radius: 6px; /* rounded-md */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* shadow-sm */
transition: colors 0.2s ease;

/* Focus State */
focus:outline: none;
focus:ring: 2px solid #4f46e5; /* focus:ring-indigo-500 */
focus:border-color: #4f46e5; /* focus:border-indigo-500 */

/* Error State */
border-color: #fca5a5; /* border-red-300 */
color: #7f1d1d; /* text-red-900 */
```

#### Buttons:
```css
/* Base Button */
display: inline-flex;
align-items: center;
justify-content: center;
min-height: 44px; /* Touch-friendly */
padding: 8px 16px; /* py-2 px-4 */
border-radius: 6px; /* rounded-md */
font-weight: 500; /* font-medium */
font-size: 14px; /* text-sm */
transition: all 0.2s ease;
cursor: pointer;
user-select: none;

/* Primary Button */
background-color: #4f46e5; /* bg-indigo-600 */
color: white;
border: 1px solid transparent;
hover:background-color: #4338ca; /* hover:bg-indigo-700 */
focus:outline: none;
focus:ring: 2px solid #4f46e5; /* focus:ring-indigo-500 */
focus:ring-offset: 2px;

/* Secondary Button */
background-color: #f3f4f6; /* bg-gray-200 */
color: #111827; /* text-gray-900 */
border: 1px solid #d1d5db;
hover:background-color: #e5e7eb; /* hover:bg-gray-300 */

/* Disabled State */
opacity: 0.5;
cursor: not-allowed;
pointer-events: none;
```

#### Mobile Button Adjustments:
```css
@media (max-width: 640px) {
  min-height: 48px; /* Larger touch target */
  padding: 12px 24px; /* More padding */
}
```

---

## 📐 Responsive Design

### Breakpoints
```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

### Grid System

#### Dashboard Grid:
```css
/* Metrics Cards */
.grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: 1 column */
  gap: 16px; /* gap-4 */
}

@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
}

@media (min-width: 1024px) {
  grid-template-columns: repeat(4, 1fr); /* Desktop: 4 columns */
}

/* Charts Grid */
@media (min-width: 1024px) {
  grid-template-columns: repeat(2, 1fr); /* Desktop: 2 columns */
}
```

### Mobile-First Approach
All styles are written mobile-first, with desktop enhancements added via media queries:

```css
/* Mobile styles (default) */
.sidebar {
  transform: translateX(-100%);
}

/* Desktop styles */
@media (min-width: 768px) {
  .sidebar {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 240px; /* ml-60 */
  }
}
```

---

## 🎯 Interactive States

### Hover Effects
```css
/* Cards */
.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

/* Buttons */
.btn:hover {
  transform: scale(1.02);
}

/* Navigation Items */
.nav-item:hover {
  background-color: #f9fafb;
  color: #111827;
}
```

### Active/Focus States
```css
/* Touch Feedback */
.btn:active {
  transform: scale(0.98);
}

/* Focus Rings */
.focusable:focus {
  outline: none;
  ring: 2px solid #4f46e5;
  ring-offset: 2px;
}
```

### Loading States
```css
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## 📱 Mobile Optimizations

### Touch Targets
- Minimum 44px height for all interactive elements
- 48px height on mobile devices for better accessibility
- Adequate spacing between touch targets (8px minimum)

### Safe Areas
```css
/* iOS Safe Area Support */
.mobile-header {
  padding-top: env(safe-area-inset-top);
}

.mobile-nav {
  padding-bottom: env(safe-area-inset-bottom);
}

.mobile-content {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### Viewport Fixes
```css
/* iOS Safari Viewport Height Fix */
@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: -webkit-fill-available;
  }
}
```

### Touch Interactions
```css
/* Disable tap highlights */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Touch manipulation */
.touch-manipulation {
  touch-action: manipulation;
}

/* Prevent text selection on UI elements */
.no-select {
  -webkit-touch-callout: none;
  user-select: none;
}
```

---

## 🎨 Animation & Transitions

### Standard Transitions
```css
/* Default transition for most elements */
transition: all 0.2s ease;

/* Color transitions */
transition: colors 0.2s ease;

/* Transform transitions */
transition: transform 0.3s ease;
```

### Micro-interactions
```css
/* Button press feedback */
@keyframes button-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

/* Card hover lift */
@keyframes card-lift {
  0% { transform: translateY(0); }
  100% { transform: translateY(-4px); }
}

/* Loading spinner */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Page Transitions
```css
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Modal slide-up animation */
.modal-enter {
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.modal-enter-active {
  transform: translateY(0);
}
```

---

## 🔧 Utility Classes

### Custom Utility Classes
```css
/* Mobile-specific utilities */
.mobile-only { display: block; }
.desktop-only { display: none; }

@media (min-width: 768px) {
  .mobile-only { display: none; }
  .desktop-only { display: block; }
}

/* Touch-friendly utilities */
.touch-manipulation { touch-action: manipulation; }
.touch-pan-x { touch-action: pan-x; }
.touch-pan-y { touch-action: pan-y; }
.touch-none { touch-action: none; }

/* Safe area utilities */
.pt-safe { padding-top: env(safe-area-inset-top); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.pl-safe { padding-left: env(safe-area-inset-left); }
.pr-safe { padding-right: env(safe-area-inset-right); }

/* Focus utilities */
.focus-visible {
  focus:outline: none;
  focus:ring: 2px solid #4f46e5;
  focus:ring-offset: 2px;
}

/* Transition utilities */
.transition-mobile {
  transition: all 0.2s ease-out;
}
```

---

## 🎯 Accessibility Features

### Focus Management
- Clear focus indicators with 2px indigo ring
- Focus-visible support for keyboard navigation
- Logical tab order throughout the application

### Color Contrast
- All text meets WCAG AA standards
- High contrast mode support
- Color is not the only way to convey information

### Screen Reader Support
- Semantic HTML structure
- Proper ARIA labels and roles
- Alt text for all images
- Screen reader friendly navigation

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Escape key closes modals and dropdowns
- Arrow keys for navigation where appropriate

---

## 🔄 State Management

### Visual State Indicators

#### Loading States
```css
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f4f6;
  border-radius: 50%;
  border-top-color: #4f46e5;
  animation: spin 1s ease-in-out infinite;
}

.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### Error States
```css
.error-state {
  color: #dc2626; /* text-red-600 */
  background-color: #fef2f2; /* bg-red-50 */
  border: 1px solid #fecaca; /* border-red-200 */
  border-radius: 6px;
  padding: 12px 16px;
}

.error-input {
  border-color: #fca5a5; /* border-red-300 */
  color: #7f1d1d; /* text-red-900 */
}
```

#### Success States
```css
.success-state {
  color: #059669; /* text-emerald-600 */
  background-color: #ecfdf5; /* bg-emerald-50 */
  border: 1px solid #a7f3d0; /* border-emerald-200 */
  border-radius: 6px;
  padding: 12px 16px;
}
```

---

## 📊 Data Visualization

### Chart Styling
```css
/* Chart containers */
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
}

/* Chart titles */
.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
}

/* Chart colors */
.chart-primary { color: #4f46e5; }
.chart-secondary { color: #8b5cf6; }
.chart-success { color: #10b981; }
.chart-warning { color: #f59e0b; }
.chart-danger { color: #ef4444; }
```

### Metric Display
```css
/* Large numbers */
.metric-value {
  font-size: 30px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

/* Metric labels */
.metric-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Growth indicators */
.growth-positive {
  color: #10b981;
}

.growth-negative {
  color: #ef4444;
}
```

---

## 🔧 Performance Optimizations

### Critical CSS
Critical above-the-fold styles are inlined in `app/critical.css` to prevent render blocking.

### Image Optimization
```css
/* Optimized image containers */
.image-container {
  position: relative;
  overflow: hidden;
}

.image-loading {
  background: #f3f4f6;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Layout Shift Prevention
```css
/* Prevent cumulative layout shift */
img {
  height: auto;
  max-width: 100%;
}

.aspect-square { aspect-ratio: 1 / 1; }
.aspect-video { aspect-ratio: 16 / 9; }
```

---

## 🎨 Dark Mode Support (Future)

### CSS Variables Setup
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 84% 4.9%;
  /* ... other variables */
}
```

---

## 📝 Implementation Notes

### File Structure
```
styles/
├── globals.css          # Main stylesheet with Tailwind
├── critical.css         # Critical above-the-fold styles
└── mobile.css          # Mobile-specific optimizations

components/
├── ui/                 # Reusable UI components
├── layout/             # Layout components
├── mobile/             # Mobile-specific components
└── auth/               # Authentication components
```

### Key Dependencies
- **Tailwind CSS 3.3.6:** Utility-first CSS framework
- **Heroicons:** Icon library for consistent iconography
- **Inter Font:** Primary typography from Google Fonts
- **Recharts:** Data visualization library

### Browser Support
- **Modern browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile browsers:** iOS Safari 14+, Chrome Mobile 90+
- **Progressive enhancement:** Graceful degradation for older browsers

---

## 🚀 Future Enhancements

### Planned Improvements
1. **Dark Mode:** Complete dark theme implementation
2. **Theme Customization:** User-selectable color themes
3. **Advanced Animations:** More sophisticated micro-interactions
4. **Accessibility:** Enhanced screen reader support
5. **Performance:** Further optimization for mobile devices

### Maintenance Guidelines
1. **Consistency:** Always follow the established design patterns
2. **Mobile-First:** Design for mobile devices first, then enhance for desktop
3. **Accessibility:** Ensure all new components meet WCAG AA standards
4. **Performance:** Optimize for fast loading and smooth interactions
5. **Testing:** Test on real devices, not just browser dev tools

---

## 📞 Support & Documentation

For questions about this UI design system or implementation details, refer to:
- **Component Documentation:** Individual component files contain detailed comments
- **Tailwind Documentation:** https://tailwindcss.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Accessibility Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

*This document should be updated whenever significant UI changes are made to maintain accuracy and usefulness as a restoration reference.*