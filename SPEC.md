# Hotel PMS - Property Management System Specification

## 1. Project Overview

**Project Name:** CloudStay PMS  
**Type:** Web-based Hotel Property Management System  
**Core Functionality:** Comprehensive hotel operations management including reservations, guest management, room inventory, rate management, front desk operations, and reporting - similar to OPERA Cloud PMS  
**Target Users:** Hotel staff (front desk, managers, administrators)

---

## 2. UI/UX Specification

### Layout Structure

**Main Layout:**
- Collapsible sidebar navigation (280px expanded, 72px collapsed)
- Top header bar with user info, notifications, date/time (60px height)
- Main content area with module-specific views
- Responsive: Desktop-first (1200px+), Tablet (768px-1199px), Mobile (<768px)

**Dashboard Grid:**
- 12-column grid system
- Gap: 24px
- Cards with subtle shadows

### Visual Design

**Color Palette:**
- Primary: `#1a365d` (Deep Navy Blue - trust/professionalism)
- Secondary: `#2d5a87` (Ocean Blue)
- Accent: `#ed8936` (Warm Orange - CTAs, highlights)
- Success: `#38a169` (Green)
- Warning: `#d69e2e` (Amber)
- Danger: `#e53e3e` (Red)
- Background: `#f7fafc` (Light Gray)
- Surface: `#ffffff` (White)
- Text Primary: `#1a202c`
- Text Secondary: `#718096`
- Border: `#e2e8f0`

**Typography:**
- Headings: "DM Sans", sans-serif (weights: 500, 600, 700)
- Body: "IBM Plex Sans", sans-serif (weights: 400, 500)
- Monospace (for IDs/codes): "JetBrains Mono"
- H1: 32px/600, H2: 24px/600, H3: 20px/500, H4: 16px/500
- Body: 14px/400, Small: 12px/400

**Spacing System:**
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

**Visual Effects:**
- Card shadows: `0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)`
- Hover shadows: `0 4px 12px rgba(0,0,0,0.15)`
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Transitions: 200ms ease-out

### Components

**Navigation:**
- Sidebar with icon + label items
- Active state: Accent background with white text
- Hover: Subtle background change
- Collapsible with hamburger toggle

**Cards:**
- White background
- Subtle shadow
- Padding: 24px
- Header with title + optional actions

**Buttons:**
- Primary: Navy background, white text
- Secondary: White background, navy border
- Accent: Orange background for CTAs
- Sizes: sm (28px), md (36px), lg (44px)

**Tables:**
- Striped rows (alternating `#f7fafc`)
- Hover row highlight
- Sortable column headers
- Pagination controls

**Forms:**
- Labels above inputs
- Border on focus (accent color)
- Error states with red border + message

**Modals:**
- Centered overlay
- Max-width: 600px
- Close button top-right

**Status Badges:**
- Available: Green background
- Occupied: Red background
- Reserved: Blue background
- Maintenance: Yellow background
- Checkout: Orange background

---

## 3. Functionality Specification

### Core Modules

**1. Dashboard**
- Today's arrivals count
- Today's departures count
- Current occupancy percentage
- Available rooms count
- Pending check-ins list
- Pending check-outs list
- Recent activity feed
- Revenue summary widget

**2. Reservations**
- Calendar view (month/week/day)
- New reservation form
- Search existing reservations
- Reservation details view
- Modify/cancel reservation
- Guest history lookup

**3. Front Desk / Check-in**
- Quick search guest
- Walk-in registration
- Room assignment
- Print key card
- ID verification
- Early check-in processing

**4. Guest Management**
- Guest profiles (name, contact, preferences, notes)
- Guest history
- VIP flagging
- Blacklist management
- Communication log

**5. Room Management**
- Room grid/list view
- Room types configuration
- Room status (Available, Occupied, Reserved, Cleaning, Maintenance)
- Room features/amenities
- Floor/block management

**6. Rate Management**
- Rate plans (Daily, Package, Corporate)
- Seasonal pricing
- Dynamic rate display
- Rate comparison
- Price rules

**7. Housekeeping**
- Room assignment to housekeeping
- Status tracking
- Priority cleaning
- Inspection status
- Lost & found logging

**8. Reports**
- Occupancy reports
- Revenue reports
- Guest reports
- Arrival/departure reports
- Export to CSV

### Data Model (Local Storage)

```
Guests: { id, firstName, lastName, email, phone, country, idType, idNumber, vip, notes, createdAt }
Reservations: { id, guestId, roomId, checkIn, checkOut, status, rate, source, notes, createdAt }
Rooms: { id, number, type, floor, status, amenities, rate, blocked }
RoomTypes: { id, name, maxOccupancy, baseRate, description }
Rates: { id, roomTypeId, date, amount, ratePlan }
Housekeeping: { id, roomId, assignedTo, status, priority, notes }
```

---

## 4. Acceptance Criteria

1. ✅ Dashboard loads with real-time statistics
2. ✅ All navigation modules accessible
3. ✅ Can create new guest profile
4. ✅ Can create new reservation
5. ✅ Can perform check-in action
6. ✅ Can perform check-out action
7. ✅ Room grid shows correct status colors
8. ✅ Reports generate with data
9. ✅ Responsive on tablet/mobile
10. ✓ All transitions smooth (<200ms)
11. ✓ No console errors