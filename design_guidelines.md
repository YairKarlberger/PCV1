# Petty Cash Application Design Guidelines

## Design Approach: Spreadsheet-Inspired System

**Rationale**: This is a data-heavy productivity tool that digitizes a physical form. The design must prioritize accuracy, efficiency, and familiar spreadsheet-like interaction patterns. Drawing inspiration from Google Sheets, Airtable, and financial management tools for clean, professional data entry.

**Core Principle**: Form follows function - every pixel serves the purpose of accurate data entry and calculation verification.

---

## Layout System

**Spacing Units**: Use Tailwind spacing of 2, 4, 6, and 8 consistently
- Form field gaps: `gap-4`
- Section padding: `p-6` for cards, `p-8` for main containers
- Row spacing in tables: `py-2` for compact data density
- Generous breathing room between major sections: `mb-8`

**Container Strategy**:
- Maximum width: `max-w-7xl mx-auto` for main content
- Form sections in cards with subtle borders for visual separation
- Full-width table container with horizontal scroll on mobile

---

## Typography Hierarchy

**Font Family**: Inter or Roboto (Google Fonts CDN) - optimized for data readability

**Text Scales**:
- Page title: `text-2xl font-semibold` (Petty Cash Envelope)
- Section headers: `text-lg font-medium` (Header Details, Line Items, GL Summary)
- Form labels: `text-sm font-medium` (uppercase labels like "UPM:", "DEPT:")
- Input text: `text-base` (readable data entry)
- Table headers: `text-xs font-semibold uppercase tracking-wide`
- Table data: `text-sm` (compact but legible)
- Calculated totals: `text-base font-bold` (emphasize computed values)
- Help text/notes: `text-xs` (instructions, guidance)

---

## Component Structure

### 1. User Selection Bar (Top)
- Dropdown or quick-select buttons for user profiles
- Add new user option prominently placed
- Compact height (`h-16`), full-width with border-bottom

### 2. Envelope Header Form (First Section)
**Layout**: Multi-column grid responsive design
- Desktop: 4-column grid for compact fields (UPM, Dept, Name, Date)
- Tablet: 2-column grid
- Mobile: Single column stack

**Field Groups**:
- Administrative fields: UPM, Dept, Trans #, Vendor #, Voucher # (right-aligned labels)
- Personal details: Name, Position, Date, Audit
- Check information: Check No, Check/Cash Received, Department Tracking #, Received By

**Field Style**: Inline label-input pairs with labels `min-w-[120px]` for alignment

### 3. Transaction Table (Primary Section)
**Table Structure**:
- Fixed header row with column labels
- 18 numbered rows (1-18 in first column)
- Sticky header on scroll
- Alternating subtle row backgrounds for readability

**Columns** (L to R):
1. Row # (30px fixed)
2. Date (120px) - date picker input
3. To Whom Paid (180px) - text input
4. Purpose/Description (240px) - expandable text area
5. CO, LOC, EPI (60px each) - short code inputs
6. DETL, SET (80px each) - code inputs
7. FF1, FF4 (60px each) - code inputs
8. Net Amount* (120px) - currency input, right-aligned
9. PST Amount (100px) - calculated, display-only, right-aligned
10. GST Amount (100px) - calculated, display-only, right-aligned
11. Total Receipt (120px) - calculated total, bold, right-aligned

**Calculation Row** (Row 19):
- Merged cells with "TOTALS" label spanning to Net Amount column
- Bold, highlighted background for totals
- Display sum of all columns (Net, PST, GST, Total Receipt)

**Input Behavior**:
- Tab navigation flows left-to-right, top-to-bottom
- Enter key moves to next row, same column
- Auto-format currency fields with $ symbol
- Real-time calculation on amount changes
- Clear visual feedback for calculated vs. entered values

### 4. GL Summary Section
**Layout**: Two prominent fields in horizontal layout
- "Applied Against Advance": Currency input field
- "To Be Reimbursed": Calculated field (Total Receipt - Applied Against Advance)
- Large, emphasized display for final reimbursement amount

### 5. Action Bar (Bottom)
**Buttons** (left to right):
- Save Envelope (primary action)
- Export to PDF (secondary action)
- Clear Form (tertiary, destructive confirmation)
- Load Previous Envelope (secondary)

---

## Form & Input Components

**All Input Fields**:
- Consistent height: `h-10`
- Padding: `px-3 py-2`
- Border treatment with focus states
- Placeholder text for guidance
- Error states with inline validation messages

**Input Types**:
- Text inputs: standard bordered fields
- Date picker: calendar dropdown
- Currency: right-aligned with decimal precision
- Calculated fields: read-only with distinct styling (slightly muted background)
- Dropdowns: for code selections (CO, LOC, etc.)

**Table Inputs**:
- Borderless in default state, border appears on focus
- Tighter padding for density: `px-2 py-1`
- Width matches column constraints

---

## Responsive Behavior

**Desktop (1024px+)**: Full table layout with all columns visible
**Tablet (768px-1023px)**: Horizontal scroll for table, stacked header form (2-column)
**Mobile (<768px)**: 
- Card-based row layout instead of table
- Each transaction as an expandable card
- Stack all header fields single-column

---

## Accessibility Standards

- All inputs have associated labels (visible or aria-label)
- Keyboard navigation throughout entire form
- Tab index follows logical data entry flow
- ARIA live regions announce calculation updates
- High contrast for calculated vs. manual entry fields
- Focus indicators on all interactive elements
- Currency formatting announced to screen readers

---

## Additional Elements

**Instructions Banner**: Below header, collapsible panel with usage notes matching PDF instructions ("STAPLE PC ENVELOPE TO NUMBERED RECEIPTS...")

**Status Indicators**: 
- Unsaved changes warning
- Last saved timestamp
- Calculation verification badge

**No Hero Image**: This is a utility application - go straight to functional interface