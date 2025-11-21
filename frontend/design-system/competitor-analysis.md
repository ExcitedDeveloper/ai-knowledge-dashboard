# Competitor Design System Analysis

---

# Fey — Financial Dashboard

## Pondering

<pondering>
Fey is a sophisticated financial dashboard that embraces the darkness—not just literally with its dark theme, but conceptually in how it handles the complexity and weight of financial data. The aesthetic is deliberately austere and professional, creating an environment where numbers and data visualization take center stage. The dark background isn't just a stylistic choice; it's a functional one that reduces eye strain during extended sessions and allows data visualizations—particularly the white and colored line charts—to pop with clarity.

The layout philosophy here is about information hierarchy through spatial organization. The left panel contains market summaries and sector performance, the right feeds news and updates, and the center anchors the user with primary visualizations. This creates a natural F-pattern reading flow that financial professionals are accustomed to. The use of micro-bars next to sector performance indicators and the minimalist chart controls (1M, 3M, YTD, 1Y, 2Y) speaks to a user who wants quick, glanceable insights without friction.

The emotional design here is confidence and control. Dark interfaces feel premium, focused, and serious—perfect for financial applications where users are making important decisions. The muted color palette (primarily grayscale with strategic use of red for losses and green for gains) reinforces this professionalism while maintaining accessibility through high contrast ratios. The rounded bottom navigation bar with centered icons feels modern yet grounded, suggesting stability in a volatile market environment.
</pondering>

## Color Palette

### Primary Colors

- **Primary Black** - `#0F0F0F` (Main background, deep true black)
- **Secondary Black** - `#1A1A1A` (Card backgrounds and elevated surfaces)
- **Tertiary Black** - `#252525` (Subtle separation, borders)

### Accent Colors

- **Accent White** - `#FFFFFF` (Primary text, chart lines, high emphasis elements)
- **Accent Light Gray** - `#E0E0E0` (Secondary text, timestamps)
- **Accent Blue** - `#3B82F6` (Links, interactive elements, active states)

### Data Visualization Colors

- **Success Green** - `#10B981` (Positive percentages, upward trends)
- **Error Red** - `#EF4444` (Negative percentages, downward trends)
- **Chart Gray** - `#6B7280` (Neutral data, inactive visualizations)
- **Badge Red** - `#DC2626` (Company badges, alerts like TSLA)
- **Badge Purple** - `#8B5CF6` (Premium indicators, special designations)

### Background & Surface Colors

- **Background Primary** - `#0A0A0A` (App-level background)
- **Surface Elevated** - `#1C1C1C` (Cards, panels, feeds)
- **Surface Subtle** - `#141414` (Slight elevation, hover states)

## Typography

### Font Family

- **Primary Font:** SF Pro Display / Inter
- **Monospace Font:** SF Mono / Roboto Mono (for financial figures)

### Font Weights

- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

### Text Styles

#### Headings

- **H1:** 32px/40px, Bold, Letter spacing -0.4px
  - Used for greeting headers like "Hello, Sam"
- **H2:** 24px/32px, Bold, Letter spacing -0.3px
  - Used for primary content titles "The markets are neutral"
- **H3:** 18px/24px, Semibold, Letter spacing -0.2px
  - Used for section headers "Daily recap", card titles

#### Body Text

- **Body Large:** 16px/24px, Regular, Letter spacing 0px
  - Primary reading text for feed content
- **Body:** 14px/20px, Regular, Letter spacing 0px
  - Standard UI text, descriptions
- **Body Small:** 12px/18px, Regular, Letter spacing 0.1px
  - Timestamps, metadata "Today · 1h ago"

#### Financial Text

- **Percentage Large:** 16px/20px, Medium, Letter spacing -0.1px
  - For performance indicators "+0.88%"
- **Ticker Symbol:** 14px/20px, Bold, Letter spacing 0.3px
  - Stock tickers "TSLA", "NVDA", uppercase
- **Figure Text:** 14px/20px, Tabular Nums, Letter spacing 0px
  - Ensures number alignment in tables

## Component Styling

### Cards

- **Background:** Secondary Black (`#1A1A1A`)
- **Border:** None or 1px Tertiary Black (`#252525`)
- **Shadow:** None (flat design aesthetic)
- **Corner Radius:** 16dp
- **Padding:** 20dp
- **Spacing between cards:** 16dp

### Feed Items

- **Background:** Surface Elevated (`#1C1C1C`)
- **Border:** None
- **Corner Radius:** 12dp
- **Padding:** 16dp
- **Hover State:** Background lightens to `#222222`
- **Icon Badge:** 32dp x 32dp, circular, colored background

### Navigation Bar (Bottom)

- **Background:** `#1A1A1A` with slight blur effect
- **Height:** 64dp
- **Corner Radius:** 32dp (pill shape)
- **Icon Size:** 24dp x 24dp
- **Spacing between icons:** 48dp
- **Active State:** Icon color changes to Accent Blue

### Buttons

#### Icon Button

- **Background:** Transparent
- **Icon Color:** Accent Light Gray (`#E0E0E0`)
- **Size:** 40dp x 40dp
- **Corner Radius:** 8dp
- **Hover State:** Background `#252525`

### Data Visualization

#### Bar Charts (Micro)

- **Height:** 24dp
- **Width:** Variable, max 120dp
- **Corner Radius:** 2dp
- **Positive color:** Success Green with 40% opacity
- **Negative color:** Error Red with 40% opacity
- **Background:** Tertiary Black (`#252525`)

#### Line Charts

- **Stroke Width:** 2px
- **Color:** White (`#FFFFFF`)
- **Grid Lines:** `#252525`, 1px
- **Point Indicators:** 6dp circle, white fill

### Status Indicators

- **Positive Performance:**
  - Text color: Success Green (`#10B981`)
  - Icon: Up arrow or positive indicator
- **Negative Performance:**
  - Text color: Error Red (`#EF4444`)
  - Icon: Down arrow or negative indicator
- **Neutral:**
  - Text color: Accent Light Gray (`#E0E0E0`)

## Layout Structure

### Overall Grid

- **Left Panel:** 35% width (market overview, sector performance)
- **Right Panel:** 30% width (news feed, updates)
- **Center Content:** 35% width (primary visualization, charts)
- **Gutter:** 20dp between panels

### Spacing System

- **2dp** - Micro spacing (badges, inline elements)
- **8dp** - Small spacing (icon-to-text)
- **16dp** - Default spacing (between cards, sections)
- **20dp** - Medium spacing (card internal padding)
- **24dp** - Large spacing (major section separation)
- **32dp** - Extra large spacing (top-level layout padding)

## Motion & Animation

- **Hover Transitions:** 150ms, Ease-out
- **Panel Slide:** 250ms, Ease-in-out
- **Chart Animations:** 400ms, Cubic-bezier(0.4, 0.0, 0.2, 1)
- **Data Updates:** 200ms fade, Ease-in-out
- **Navigation:** 300ms, Spring curve

## Accessibility Considerations

- **Contrast Ratios:** All text maintains WCAG AAA standards (7:1) against dark backgrounds
- **Focus States:** 2px blue outline with 2dp offset
- **Touch Targets:** Minimum 44dp x 44dp for all interactive elements
- **Color Independence:** Never rely solely on color (red/green) - always include directional indicators

---

# Grammarly — Content Writing Platform

## Pondering

<pondering>
Grammarly exemplifies the light, airy aesthetic of modern productivity software. It's a tool designed for writers and communicators, so the interface naturally embraces whitespace and clarity—removing friction between the user and their content. The layout follows a classic three-column information architecture: navigation tree on the left, content hierarchy (the navigation tree/outline), and main content canvas on the right. This is reminiscent of traditional writing software and IDE layouts, which makes sense given the technical nature of tone profiling.

The color palette is restrained and professional, with Grammarly's signature teal green as the primary brand color serving as calls-to-action and emphasis points. The use of light blue backgrounds for information callouts creates gentle hierarchy without disrupting reading flow. What's particularly clever is how the emoji integration humanizes what could be very clinical content about tone—making abstract concepts like "Friendly, Sincere, Appreciative" feel tangible and relatable.

The card-based content organization with expand/collapse affordances suggests complexity being managed elegantly. Users can drill down when they need detail but maintain a clean overview when scanning. The interface feels trustworthy and intelligent—exactly what you want from a writing assistant that's essentially critiquing your communication style. The generous padding and breathing room convey that this tool respects your mental space while you work through the nuanced task of tone calibration.
</pondering>

## Color Palette

### Primary Colors

- **Primary Green** - `#15C39A` (Grammarly brand color, CTAs, emphasis)
- **Primary White** - `#FFFFFF` (Main background, content surfaces)
- **Primary Black** - `#1C1C1C` (Primary text, headers)

### Secondary Colors

- **Secondary Green Light** - `#D7F4ED` (Backgrounds for selected states, highlights)
- **Secondary Blue Light** - `#E8F4F9` (Information callout backgrounds)
- **Secondary Gray** - `#F5F5F5` (Subtle backgrounds, panel separation)

### Accent Colors

- **Accent Teal** - `#00A67E` (Links, hover states on green elements)
- **Accent Blue** - `#1E88E5` (Secondary actions, links)
- **Accent Red** - `#D32F2F` (Error states, "Off-Brand" indicators)
- **Accent Orange** - `#FF6B35` (Warnings, "Off-Brand" borders)

### Text Colors

- **Text Primary** - `#1C1C1C` (Main content, headers)
- **Text Secondary** - `#5F6368` (Supporting text, metadata)
- **Text Tertiary** - `#9AA0A6` (Disabled states, placeholder text)
- **Text Link** - `#1E88E5` (Interactive text, "upgrade to Enterprise")

### Background Colors

- **Background White** - `#FFFFFF` (Primary surfaces, cards)
- **Background Light** - `#FAFAFA` (App-level background)
- **Background Gray** - `#F0F0F0` (Sidebar, navigation areas)

## Typography

### Font Family

- **Primary Font:** Inter / System UI
- **Alternative Font:** -apple-system, BlinkMacSystemFont, "Segoe UI"

### Font Weights

- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

### Text Styles

#### Headings

- **H1:** 28px/36px, Bold, Letter spacing -0.3px
  - Used for main page titles "Sam's Team Tone Profile"
- **H2:** 20px/28px, Semibold, Letter spacing -0.2px
  - Used for card headers "I want to be relatable."
- **H3:** 16px/24px, Semibold, Letter spacing -0.1px
  - Used for subsections "TONES", "EXPLANATION"

#### Body Text

- **Body Large:** 16px/24px, Regular, Letter spacing 0px
  - Primary content text in cards
- **Body:** 14px/22px, Regular, Letter spacing 0px
  - Standard UI text, navigation items
- **Body Small:** 13px/20px, Regular, Letter spacing 0.1px
  - Metadata "CREATED 01.21.25"

#### Label Text

- **Label:** 11px/16px, Bold, Letter spacing 0.8px, Uppercase
  - Section labels "TONES", "EXPLANATION (DEFAULT)"
- **Badge:** 12px/16px, Medium, Letter spacing 0.2px
  - Status badges "On-Brand", "Off-Brand"

## Component Styling

### Sidebar Navigation

- **Width:** 240dp
- **Background:** Background Gray (`#F0F0F0`)
- **Item Height:** 40dp
- **Item Padding:** 12dp horizontal, 8dp vertical
- **Active State Background:** White with subtle shadow
- **Active State Border:** 2px left border, Primary Green
- **Text Color:** Text Primary, Text Secondary when inactive
- **Icon Size:** 20dp x 20dp
- **Hover State:** Background lightens to `#EEEEEE`

### Tree Navigation (Middle Panel)

- **Width:** 280dp
- **Background:** White (`#FFFFFF`)
- **Border Right:** 1px solid `#E0E0E0`
- **Item Height:** 36dp
- **Indent per Level:** 16dp
- **Expand/Collapse Icon:** 16dp chevron
- **Selected Item:** Background Secondary Green Light (`#D7F4ED`)

### Cards

- **Background:** White (`#FFFFFF`)
- **Border:** 1px solid `#E5E5E5`
- **Corner Radius:** 8dp
- **Padding:** 20dp
- **Shadow:** None (flat design)
- **Spacing between cards:** 16dp
- **Expandable/Collapsible:** Chevron icon 20dp, smooth 200ms transition

### Buttons

#### Primary Button

- **Background:** Primary Green (`#15C39A`)
- **Text:** White (`#FFFFFF`)
- **Height:** 40dp
- **Corner Radius:** 6dp
- **Padding:** 16dp horizontal
- **Font:** 14px, Medium
- **Hover State:** Background darkens to `#00A67E`

#### Secondary Button

- **Background:** Transparent or White
- **Border:** 1px solid `#D0D0D0`
- **Text:** Text Primary (`#1C1C1C`)
- **Height:** 40dp
- **Corner Radius:** 6dp
- **Hover State:** Border color Primary Green

#### Icon Button

- **Size:** 32dp x 32dp
- **Icon Color:** Text Secondary
- **Corner Radius:** 4dp
- **Hover State:** Background `#F5F5F5`

### Badges

- **On-Brand Badge:**
  - Background: `#E8F8F4`
  - Text: Primary Green (`#15C39A`)
  - Border: 1px solid Primary Green
  - Padding: 4dp 8dp
  - Corner Radius: 4dp
  - Font: 11px, Medium

- **Off-Brand Badge:**
  - Background: `#FFEBEE`
  - Text: Accent Red (`#D32F2F`)
  - Border: 1px solid Accent Red
  - Padding: 4dp 8dp
  - Corner Radius: 4dp

### Information Callout

- **Background:** Secondary Blue Light (`#E8F4F9`)
- **Border:** None or 1px solid `#B3E0F2`
- **Corner Radius:** 8dp
- **Padding:** 16dp
- **Icon Size:** 24dp x 24dp (two-tone circles icon)
- **Text:** 14px/22px Regular

### Input Fields

- **Height:** 44dp
- **Border:** 1px solid `#D0D0D0`
- **Corner Radius:** 6dp
- **Background:** White (`#FFFFFF`)
- **Focus Border:** 2px solid Primary Green
- **Padding:** 12dp
- **Placeholder Color:** Text Tertiary (`#9AA0A6`)

## Layout Structure

### Three-Column Layout

- **Left Sidebar:** 240dp fixed (navigation)
- **Middle Panel:** 280dp fixed (tree/outline navigation)
- **Main Content:** Flexible, min 600dp (primary content area)
- **Total Max Width:** 1440dp

### Header Bar

- **Height:** 64dp
- **Background:** White with 1px bottom border `#E0E0E0`
- **Logo Position:** Left-aligned, 40dp from left edge
- **Search Bar:** Center or right-aligned, 400dp max width
- **Actions:** Right-aligned, 40dp from right edge

### Content Area

- **Max Width:** 960dp (within main content column)
- **Padding:** 32dp horizontal, 24dp vertical
- **Section Spacing:** 24dp between major sections

### Spacing System

- **4dp** - Micro spacing (icon-to-text, badges)
- **8dp** - Small spacing (within components)
- **12dp** - Default spacing (between related elements)
- **16dp** - Medium spacing (between cards, sections)
- **20dp** - Card internal padding
- **24dp** - Large spacing (major section separation)
- **32dp** - Extra large spacing (page-level margins)

## Motion & Animation

- **Expand/Collapse:** 200ms, Ease-in-out
- **Hover Effects:** 120ms, Ease-out
- **Panel Transitions:** 250ms, Cubic-bezier(0.4, 0.0, 0.2, 1)
- **Button States:** 150ms, Ease-out
- **Page Transitions:** 300ms, Ease-in-out

## Accessibility Considerations

- **Contrast Ratios:** WCAG AA compliance minimum (4.5:1)
- **Focus Indicators:** 2px green outline, 2dp offset
- **Keyboard Navigation:** Full keyboard support for tree navigation
- **Screen Reader Labels:** Proper ARIA labels on all interactive elements
- **Touch Targets:** Minimum 44dp for mobile responsive views

---

# Patreon — Creator Platform

## Pondering

<pondering>
Patreon's design system is all about community, warmth, and accessibility. The interface needs to serve both creators managing their communities and patrons engaging with content, so it strikes a careful balance between functionality and approachability. The modal dialog design is particularly thoughtful—it doesn't feel like an interruption but rather an invitation to share and connect. The gradient promo card (that sunset-to-blue gradient) adds an emotional, aspirational quality that says "your content is special and worth sharing."

The bottom navigation bar is genius in its simplicity. Black buttons on light gray, with clear labeling—"Back," "Preview post," "Next"—remove any ambiguity about the creator's workflow. This is a platform where people are building livelihoods, so clarity trumps cleverness every time. The left sidebar navigation is comprehensive without being overwhelming, using iconography consistently to create pattern recognition (the shield for Moderation Hub, the megaphone for Promotions, etc.).

What I find compelling is the use of rounded corners everywhere—nothing is sharp or harsh here. The 12dp radius on cards, the pill-shaped buttons, even the profile images maintain this softness. Combined with the warm color palette (reds, corals, warm grays), the entire experience feels inviting and human. This is particularly important for a platform where creators are being vulnerable by sharing their work and asking for financial support. The design needs to feel safe, supportive, and encouraging—and it absolutely does.
</pondering>

## Color Palette

### Primary Colors

- **Primary Red** - `#FF424D` (Patreon brand color, primary CTAs)
- **Primary White** - `#FFFFFF` (Content backgrounds, cards)
- **Primary Black** - `#2C2D2E` (Primary text, headers)

### Secondary Colors

- **Secondary Gray Light** - `#F5F5F5` (App background, sidebar)
- **Secondary Gray** - `#E8E8E8` (Borders, subtle dividers)
- **Secondary Gray Dark** - `#6A6A6A` (Secondary text, metadata)

### Accent Colors

- **Accent Coral** - `#FF6B6B` (Hover states on primary buttons)
- **Accent Blue** - `#1E88E5` (Links, informational elements)
- **Accent Teal** - `#00B8A9` (Success states, confirmation)
- **Accent Purple** - `#6366F1` (Special features, premium indicators)

### Gradient Colors

- **Promo Gradient Start** - `#C04848` (Warm red-brown)
- **Promo Gradient Mid** - `#E6A04E` (Orange-gold)
- **Promo Gradient End** - `#4A8FB8` (Cool blue)

### Background Colors

- **Background White** - `#FFFFFF` (Cards, modal backgrounds)
- **Background Light** - `#F9F9F9` (Page-level background)
- **Background Sidebar** - `#F5F5F5` (Navigation sidebar)
- **Background Overlay** - `rgba(0, 0, 0, 0.5)` (Modal backdrop)

### Text Colors

- **Text Primary** - `#2C2D2E` (Main content)
- **Text Secondary** - `#6A6A6A` (Supporting information)
- **Text Tertiary** - `#9E9E9E` (Disabled states, placeholders)
- **Text On Dark** - `#FFFFFF` (Text on colored backgrounds)

## Typography

### Font Family

- **Primary Font:** GT America / Inter / -apple-system
- **Alternative Font:** "Helvetica Neue", Arial, sans-serif

### Font Weights

- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

### Text Styles

#### Headings

- **H1:** 32px/40px, Bold, Letter spacing -0.4px
  - Used for main headers "Share your upcoming drop"
- **H2:** 24px/32px, Semibold, Letter spacing -0.3px
  - Used for section headers "Let's see this through together!"
- **H3:** 18px/26px, Semibold, Letter spacing -0.2px
  - Used for card titles, subsection headers

#### Body Text

- **Body Large:** 17px/26px, Regular, Letter spacing 0px
  - Primary content text in posts
- **Body:** 15px/23px, Regular, Letter spacing 0px
  - Standard UI text, descriptions
- **Body Small:** 13px/20px, Regular, Letter spacing 0.1px
  - Metadata, timestamps "Posted on 26 Feb 2025 - 15:48"

#### Special Text

- **Label:** 14px/20px, Medium, Letter spacing 0.2px
  - Form labels, section labels
- **Button Text:** 16px/24px, Semibold, Letter spacing 0.1px
  - All button text
- **Caption:** 12px/18px, Regular, Letter spacing 0.2px
  - Image captions, fine print

## Component Styling

### Modal Dialog

- **Background:** White (`#FFFFFF`)
- **Max Width:** 640dp
- **Corner Radius:** 16dp
- **Shadow:** 0 20dp 60dp rgba(0, 0, 0, 0.25)
- **Padding:** 32dp
- **Backdrop:** `rgba(0, 0, 0, 0.5)` with backdrop blur 8dp
- **Close Button:** Top-right, 40dp x 40dp, icon 24dp

### Sidebar Navigation

- **Width:** 220dp
- **Background:** Background Sidebar (`#F5F5F5`)
- **Item Height:** 44dp
- **Item Padding:** 12dp horizontal
- **Icon Size:** 20dp x 20dp
- **Icon-to-Text Spacing:** 12dp
- **Text:** 15px Medium
- **Active State:** Background White with left 3px Primary Red border
- **Hover State:** Background `#EEEEEE`
- **Badge (Notifications):** 20dp circle, Primary Red background, white text

### Bottom Navigation Bar

- **Height:** 72dp
- **Background:** Background Light (`#F9F9F9`)
- **Border Top:** 1px solid Secondary Gray (`#E8E8E8`)
- **Padding:** 16dp horizontal
- **Button Spacing:** Space-between layout
- **Shadow:** 0 -2dp 8dp rgba(0, 0, 0, 0.08)

### Buttons

#### Primary Button

- **Background:** Primary Red (`#FF424D`)
- **Text:** White (`#FFFFFF`)
- **Height:** 48dp
- **Corner Radius:** 24dp (pill shape)
- **Padding:** 24dp horizontal
- **Font:** 16px, Semibold
- **Hover State:** Background Accent Coral (`#FF6B6B`)
- **Active State:** Background darkens to `#E6001E`

#### Secondary Button (Outlined)

- **Background:** White (`#FFFFFF`)
- **Border:** 2px solid Primary Black (`#2C2D2E`)
- **Text:** Primary Black
- **Height:** 48dp
- **Corner Radius:** 24dp
- **Hover State:** Background `#F5F5F5`

#### Tertiary Button (Ghost)

- **Background:** Transparent
- **Text:** Text Secondary (`#6A6A6A`)
- **Height:** 44dp
- **Corner Radius:** 8dp
- **Hover State:** Background `#F5F5F5`

#### Navigation Button (Bottom Bar)

- **Background:** Primary Black (`#2C2D2E`)
- **Text:** White (`#FFFFFF`)
- **Height:** 44dp
- **Corner Radius:** 8dp
- **Padding:** 20dp horizontal
- **Font:** 15px, Medium

### Cards

#### Promo Card

- **Background:** Gradient (see Gradient Colors)
- **Corner Radius:** 12dp
- **Shadow:** 0 4dp 12dp rgba(0, 0, 0, 0.15)
- **Padding:** 24dp
- **Text Color:** White (`#FFFFFF`)
- **Overlay:** Optional subtle dark gradient for text readability

#### Content Card

- **Background:** White (`#FFFFFF`)
- **Border:** 1px solid Secondary Gray (`#E8E8E8`)
- **Corner Radius:** 12dp
- **Padding:** 20dp
- **Hover State:** Border color changes to Primary Red, subtle lift shadow

### Icons

- **Primary Size:** 24dp x 24dp (navigation, actions)
- **Small Size:** 20dp x 20dp (inline icons)
- **Large Size:** 32dp x 32dp (feature icons)
- **Color:** Matches context (Primary Black for general, Primary Red for active states)

### Social Share Buttons

- **Height:** 48dp
- **Padding:** 16dp
- **Corner Radius:** 8dp
- **Icon Size:** 20dp x 20dp
- **Icon Position:** Left-aligned, 12dp spacing to text
- **Border:** 1px solid Secondary Gray (`#E8E8E8`)
- **Hover State:** Background `#F5F5F5`, border matches icon color

### Input Fields

- **Height:** 52dp
- **Border:** 1px solid Secondary Gray (`#E8E8E8`)
- **Corner Radius:** 8dp
- **Background:** White (`#FFFFFF`)
- **Focus Border:** 2px solid Primary Red
- **Padding:** 16dp
- **Placeholder Color:** Text Tertiary (`#9E9E9E`)

### Link Display (Copy Link)

- **Background:** Background Light (`#F9F9F9`)
- **Border:** 1px solid Secondary Gray (`#E8E8E8`)
- **Corner Radius:** 8dp
- **Height:** 48dp
- **Padding:** 12dp
- **Icon:** 20dp Patreon logo
- **Copy Button:** Right-aligned, text button "Copy link"

## Layout Structure

### Sidebar Layout

- **Sidebar Width:** 220dp fixed
- **Main Content:** Flexible, min 600dp
- **Content Max Width:** 1080dp
- **Gutter:** 0 (sidebar flush to edge)

### Modal Layout

- **Max Width:** 640dp
- **Vertical Centering:** Center of viewport
- **Horizontal Centering:** Center of viewport
- **Mobile:** Full-screen on small devices

### Bottom Bar Layout

- **Position:** Fixed to bottom
- **Z-index:** 100 (above content)
- **Button Group Left:** "Back" or secondary actions
- **Button Group Center:** "Preview post" or tertiary actions
- **Button Group Right:** "Next" or primary actions

### Spacing System

- **4dp** - Micro spacing (icon-to-text, inline elements)
- **8dp** - Small spacing (between closely related items)
- **12dp** - Default spacing (between elements in a group)
- **16dp** - Medium spacing (between components)
- **20dp** - Card padding
- **24dp** - Large spacing (between sections)
- **32dp** - Extra large spacing (modal padding, page margins)

## Motion & Animation

- **Modal Entry:** 300ms, Cubic-bezier(0.2, 0.8, 0.2, 1) with scale from 0.95
- **Modal Exit:** 200ms, Ease-in with scale to 0.95
- **Button Hover:** 150ms, Ease-out
- **Navigation Transition:** 250ms, Ease-in-out
- **Card Hover:** 200ms, Ease-out with subtle scale to 1.02
- **Backdrop Fade:** 250ms, Ease-in-out

## Accessibility Considerations

- **Contrast Ratios:** WCAG AA compliance (4.5:1 for text, 3:1 for UI components)
- **Focus States:** 3px Primary Red outline, 2dp offset
- **Modal Focus Trap:** Keyboard focus stays within modal when open
- **Escape Key:** Closes modal
- **Screen Reader:** Proper dialog role and aria-labels
- **Touch Targets:** Minimum 44dp x 44dp

---

# Plane — Project Management Platform

## Pondering

<pondering>
Plane is clearly inspired by tools like Linear and Jira but brings its own design perspective to the project management space. What immediately strikes me is the card-based kanban layout with incredibly thoughtful information density. Each work item card packs a ton of metadata—ID, status, dates, assignees, tags, icons—without feeling cluttered. This is achieved through careful use of iconography, color coding, and information hierarchy.

The breadcrumb navigation at the top isn't just functional—it's a constant reminder of context in a potentially overwhelming sea of work items. "AS Mobbin Official > Work Items" keeps users grounded in where they are within the information architecture. The left sidebar with its collapsible sections and favorites creates a sense of personal workspace customization that's essential for tools people use daily.

The color system is particularly sophisticated. Each status (Backlog, Todo, In Progress, Done) has its own color, but they're muted and professional—no garish primaries that would create visual fatigue. The icons within cards are beautifully detailed: calendars for dates, people icons for assignments, tags for categories, numbered badges for sub-items. The view controls in the top-right (list, kanban, calendar, table, etc.) show flexibility in how users want to see their data, which is crucial for team collaboration where different roles need different perspectives.

The aesthetic is clean professionalism with personality. The friendly welcome message "Welcome to Plane 👋" and the conversational AI assistant "Ask Pi" humanize what could be a very sterile enterprise tool. The spacing is generous, the typography is crisp, and the overall feel is "we respect your intelligence and your time."
</pondering>

## Color Palette

### Primary Colors

- **Primary Blue** - `#3B82F6` (Brand color, primary actions, active states)
- **Primary White** - `#FFFFFF` (Card backgrounds, content surfaces)
- **Primary Black** - `#18181B` (Primary text, headers)

### Status Colors

- **Status Backlog Gray** - `#71717A` (Backlog items, inactive states)
- **Status Todo Blue** - `#3B82F6` (Todo items, informational)
- **Status In Progress Yellow** - `#F59E0B` (In progress items, warnings)
- **Status Done Green** - `#10B981` (Completed items, success)

### Accent Colors

- **Accent Purple** - `#8B5CF6` (Special tags like "concepts")
- **Accent Pink** - `#EC4899` (Priority indicators, alerts)
- **Accent Teal** - `#14B8A6` (Secondary actions, highlights)
- **Accent Red** - `#EF4444` (Date overdue, errors)
- **Accent Orange** - `#F97316` (Warnings, medium priority)

### Background Colors

- **Background Light** - `#FAFAFA` (App-level background)
- **Background White** - `#FFFFFF` (Cards, panels)
- **Background Hover** - `#F4F4F5` (Hover states on cards)
- **Background Selected** - `#EFF6FF` (Selected items, active panel)

### Text Colors

- **Text Primary** - `#18181B` (Main content, headers)
- **Text Secondary** - `#71717A` (Supporting text, metadata)
- **Text Tertiary** - `#A1A1AA` (Disabled states, placeholders)
- **Text Link** - `#3B82F6` (Links, interactive text)

### Border Colors

- **Border Light** - `#E4E4E7` (Subtle dividers)
- **Border Medium** - `#D4D4D8` (Card borders, panel separators)
- **Border Strong** - `#A1A1AA` (Focus states, emphasis)

## Typography

### Font Family

- **Primary Font:** Inter / -apple-system / System UI
- **Monospace Font:** JetBrains Mono / SF Mono (for IDs like "AS123-4")

### Font Weights

- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

### Text Styles

#### Headings

- **H1:** 28px/36px, Bold, Letter spacing -0.3px
  - Used for main page headers "Good morning,"
- **H2:** 20px/28px, Semibold, Letter spacing -0.2px
  - Used for section headers, column titles "Backlog", "Todo", "In Progress"
- **H3:** 16px/24px, Semibold, Letter spacing -0.1px
  - Used for card titles "Create and assign Work Items 👏"

#### Body Text

- **Body:** 14px/20px, Regular, Letter spacing 0px
  - Card descriptions, standard UI text
- **Body Small:** 13px/18px, Regular, Letter spacing 0.1px
  - Metadata, labels
- **Body Tiny:** 12px/16px, Regular, Letter spacing 0.1px
  - Timestamps, fine print

#### Special Text

- **ID/Monospace:** 13px/18px, Medium, Monospace font, Letter spacing 0.2px
  - Work item IDs "AS123-4", "AS123-7"
- **Badge Text:** 11px/16px, Medium, Letter spacing 0.3px
  - Status badges, tags
- **Button Text:** 14px/20px, Medium, Letter spacing 0.1px
  - All interactive buttons

## Component Styling

### Sidebar Navigation

- **Width:** 240dp
- **Background:** Background White (`#FFFFFF`)
- **Border Right:** 1px solid Border Light (`#E4E4E7`)
- **Item Height:** 36dp
- **Item Padding:** 8dp horizontal
- **Icon Size:** 20dp x 20dp
- **Text:** 14px Medium
- **Active State:** Background Selected (`#EFF6FF`), Text Primary Blue
- **Hover State:** Background Hover (`#F4F4F5`)
- **Section Spacing:** 16dp between sections
- **Collapsible Headers:** Chevron icon 16dp, 200ms animation

### Breadcrumb Navigation

- **Height:** 40dp
- **Background:** Transparent
- **Icon Size:** 16dp x 16dp
- **Separator:** Chevron right, 16dp, Text Secondary color
- **Text:** 14px Medium, Text Secondary
- **Current Page:** Text Primary, Semibold
- **Hover State:** Text Primary Blue, underline

### Kanban Cards

- **Background:** White (`#FFFFFF`)
- **Border:** 1px solid Border Light (`#E4E4E7`)
- **Corner Radius:** 8dp
- **Padding:** 12dp
- **Min Height:** 120dp
- **Shadow:** None (flat), 0 2dp 4dp rgba(0,0,0,0.08) on hover
- **Hover State:** Border color Primary Blue, slight shadow
- **Dragging State:** Opacity 0.7, cursor grab

### Card Components

#### Card Header (ID + Title)

- **ID Font:** 13px Monospace, Medium, Text Secondary
- **Title Font:** 14px Regular, Text Primary
- **Spacing:** 4dp between ID and title
- **Icon Size:** 16dp (if present, like emoji or status icon)

#### Card Metadata Row

- **Height:** 24dp
- **Icon Size:** 16dp x 16dp
- **Text:** 12px Regular, Text Secondary
- **Spacing:** 8dp between metadata items
- **Color Coding:** Icons match their function (calendar=date, person=assignee, etc.)

#### Card Tags/Badges

- **Height:** 20dp
- **Padding:** 4dp 8dp
- **Corner Radius:** 4dp
- **Font:** 11px Medium, Letter spacing 0.2px
- **Background:** Semi-transparent status color (20% opacity)
- **Text:** Darker shade of status color
- **Icon:** 12dp x 12dp (optional)

#### Card Footer (Icons Row)

- **Height:** 24dp
- **Icon Size:** 16dp x 16dp
- **Icon Color:** Text Secondary
- **Spacing:** 6dp between icons
- **Hover State:** Icon color Text Primary

### Kanban Columns

- **Width:** 320dp
- **Min Height:** 100vh
- **Background:** Transparent
- **Border:** None
- **Column Header Height:** 44dp
- **Column Header Font:** 16px Semibold, Text Primary
- **Item Count Badge:** 16dp circle, Background Light, Text Secondary
- **Add Button:** 32dp x 32dp, Border Medium, dashed border
- **Card Spacing:** 12dp between cards

### Top Action Bar

- **Height:** 56dp
- **Background:** White (`#FFFFFF`)
- **Border Bottom:** 1px solid Border Light (`#E4E4E7`)
- **Padding:** 12dp horizontal
- **Button Height:** 36dp
- **Button Spacing:** 8dp
- **Icon Size:** 20dp x 20dp

### View Toggles (List/Kanban/Calendar/etc.)

- **Button Size:** 36dp x 36dp
- **Icon Size:** 20dp x 20dp
- **Corner Radius:** 6dp
- **Active State:** Background Selected (`#EFF6FF`), Icon Primary Blue
- **Inactive State:** Background transparent, Icon Text Secondary
- **Hover State:** Background Hover (`#F4F4F5`)

### Buttons

#### Primary Button

- **Background:** Primary Blue (`#3B82F6`)
- **Text:** White (`#FFFFFF`)
- **Height:** 36dp
- **Corner Radius:** 6dp
- **Padding:** 12dp horizontal
- **Font:** 14px Medium
- **Hover State:** Background darkens to `#2563EB`

#### Secondary Button (Ghost)

- **Background:** Transparent
- **Border:** 1px solid Border Medium (`#D4D4D8`)
- **Text:** Text Primary
- **Height:** 36dp
- **Corner Radius:** 6dp
- **Hover State:** Background Hover (`#F4F4F5`)

#### Icon Button

- **Size:** 32dp x 32dp
- **Icon Size:** 20dp x 20dp
- **Corner Radius:** 6dp
- **Hover State:** Background Hover (`#F4F4F5`)

### Icons

- **Card Icons:** 16dp x 16dp
- **Navigation Icons:** 20dp x 20dp
- **Action Icons:** 20dp x 20dp
- **Tiny Icons:** 12dp x 12dp (in badges)
- **Style:** Outlined/line-style icons, 1.5px stroke

### Filters Panel (Top Right)

- **Button Height:** 36dp
- **Corner Radius:** 6dp
- **Border:** 1px solid Border Medium
- **Font:** 14px Medium
- **Icon:** 16dp dropdown chevron
- **Badge (Count):** 18dp circle, Primary Blue background, white text

## Layout Structure

### Overall Grid

- **Sidebar:** 240dp fixed width
- **Main Content:** Flexible, full remaining width
- **Content Max Width:** Unlimited (full viewport)
- **Breadcrumb Row:** 40dp height
- **Action Bar:** 56dp height
- **Content Area:** Remaining viewport height

### Kanban Layout

- **Column Width:** 320dp
- **Column Spacing:** 20dp
- **Horizontal Scroll:** When columns exceed viewport
- **Min Columns Visible:** 3 (on desktop)
- **Card Spacing:** 12dp vertical

### Spacing System

- **2dp** - Micro spacing (icon-to-text within badges)
- **4dp** - Tiny spacing (tight element grouping)
- **6dp** - Small spacing (icon rows)
- **8dp** - Default spacing (between related elements)
- **12dp** - Medium spacing (card padding, between cards)
- **16dp** - Large spacing (section separation in sidebar)
- **20dp** - Extra large spacing (column gutters)
- **24dp** - Major spacing (panel padding)

## Motion & Animation

- **Card Drag:** Smooth follow cursor, 120ms settle animation
- **Column Scroll:** Smooth scroll with momentum
- **Sidebar Collapse:** 250ms, Ease-in-out
- **Hover Effects:** 120ms, Ease-out
- **View Switch:** 200ms fade, Ease-in-out
- **Card Add:** 300ms slide-in from top, Spring curve

## Accessibility Considerations

- **Contrast Ratios:** WCAG AA compliance (4.5:1 minimum)
- **Focus States:** 2px Primary Blue outline, 2dp offset
- **Keyboard Navigation:** Arrow keys for card navigation, Enter to open, Escape to close
- **Drag and Drop:** Keyboard accessible alternative (modal picker)
- **Screen Reader:** Proper ARIA labels, live regions for status updates
- **Touch Targets:** Minimum 36dp (optimized for desktop, 44dp on mobile)

---

# Seline — Analytics Dashboard

## Pondering

<pondering>
Seline is an analytics platform that embraces minimalism and data clarity. The design philosophy here is "get out of the way and let the data speak." The predominantly white canvas with subtle gray tones creates a neutral backdrop where metrics and visualizations can command attention. The cute illustration in the top-right adds personality without distracting—it's a friendly reminder that behind all this data are real people and real websites.

The filtering controls in the top-right corner are the hero of this interface. "Filter", "Last 30 days", and view toggles are all right-aligned, creating a consistent action area that users can quickly reference. This is smart UX because in analytics tools, time range selection is one of the most frequent actions. Putting it prominently where the eye naturally travels (top-right in Western reading patterns) reduces cognitive load.

The card-based metric display is textbook good design: large numbers for quick scanning, subtle comparison indicators (0%, up/down arrows), and supporting context ("vs previous 30 days"). The line charts beneath are purposefully understated—light gray backgrounds, minimal gridlines, simple line strokes. This isn't about flashy visualizations; it's about truth and clarity in data representation.

What I appreciate most is the generous whitespace. Analytics dashboards can easily become overwhelming walls of numbers, but Seline's breathing room prevents that information overload. The left sidebar is elegantly simple—just four options plus settings at the bottom. This suggests a product that does a few things exceptionally well rather than trying to be everything to everyone. The blue CTA button "Install Seline" is strategically placed but not aggressive, inviting users to take action when they're ready.
</pondering>

## Color Palette

### Primary Colors

- **Primary Blue** - `#3B82F6` (Brand color, CTAs, primary actions)
- **Primary White** - `#FFFFFF` (Main background, card surfaces)
- **Primary Black** - `#1F2937` (Primary text, headers)

### Secondary Colors

- **Secondary Gray Light** - `#F9FAFB` (App background, subtle panels)
- **Secondary Gray** - `#F3F4F6` (Card backgrounds, chart backgrounds)
- **Secondary Gray Medium** - `#E5E7EB` (Borders, dividers)
- **Secondary Gray Dark** - `#6B7280` (Secondary text, labels)

### Accent Colors

- **Accent Blue Light** - `#DBEAFE` (Hover states, selected backgrounds)
- **Accent Green** - `#10B981` (Positive indicators, success states)
- **Accent Red** - `#EF4444` (Negative indicators, errors)
- **Accent Purple** - `#8B5CF6` (Premium features, highlights)

### Data Visualization Colors

- **Chart Line** - `#3B82F6` (Primary data line)
- **Chart Gray** - `#D1D5DB` (Secondary lines, axis)
- **Chart Background** - `#F9FAFB` (Chart canvas background)
- **Chart Grid** - `#E5E7EB` (Gridlines, subtle guides)

### Text Colors

- **Text Primary** - `#1F2937` (Main content, headers)
- **Text Secondary** - `#6B7280` (Supporting text, metadata)
- **Text Tertiary** - `#9CA3AF` (Disabled states, placeholders)
- **Text Muted** - `#D1D5DB` (De-emphasized text)

## Typography

### Font Family

- **Primary Font:** Inter / -apple-system / "Segoe UI"
- **Monospace Font:** "Roboto Mono" / "Courier New" (for numeric data)

### Font Weights

- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

### Text Styles

#### Headings

- **H1:** 30px/38px, Bold, Letter spacing -0.4px
  - Used for main page titles "Dashboard"
- **H2:** 20px/28px, Semibold, Letter spacing -0.2px
  - Used for card section headers "Total Visits", "Unique Visitors"
- **Subdomain:** 14px/20px, Regular, Text Secondary
  - "content-mobbin.com"

#### Data/Metrics

- **Metric Large:** 36px/44px, Bold, Tabular Nums, Letter spacing -0.5px
  - Primary metrics "0", "0.00", "0s"
- **Metric Small:** 14px/20px, Medium, Tabular Nums, Letter spacing 0px
  - Comparison percentages "0%"
- **Metric Label:** 14px/20px, Medium, Letter spacing 0.1px
  - Labels like "Total Visits", "Views per Visit"

#### Body Text

- **Body:** 14px/20px, Regular, Letter spacing 0px
  - Standard UI text, descriptions
- **Body Small:** 13px/18px, Regular, Letter spacing 0.1px
  - Supporting information
- **Caption:** 12px/16px, Regular, Letter spacing 0.2px
  - Chart axis labels, timestamps "30. 02. 05. 08."

## Component Styling

### Sidebar Navigation

- **Width:** 200dp
- **Background:** White (`#FFFFFF`)
- **Border Right:** 1px solid Secondary Gray Medium (`#E5E7EB`)
- **Logo Section Height:** 72dp
- **Item Height:** 48dp
- **Item Padding:** 16dp horizontal
- **Icon Size:** 20dp x 20dp
- **Text:** 15px Medium
- **Active State:** Background Accent Blue Light (`#DBEAFE`), Text Primary Blue
- **Hover State:** Background Secondary Gray (`#F3F4F6`)
- **Badge Count:** 20dp circle, Text Secondary

### Top Header Bar

- **Height:** 72dp
- **Background:** White (`#FFFFFF`)
- **Border Bottom:** 1px solid Secondary Gray Medium (`#E5E7EB`)
- **Padding:** 16dp horizontal
- **Title Font:** 24px Semibold
- **Subdomain Font:** 14px Regular, Text Secondary

### Filter Controls (Top Right)

- **Container Padding:** 16dp
- **Button Height:** 36dp
- **Button Spacing:** 8dp
- **Corner Radius:** 6dp
- **Border:** 1px solid Secondary Gray Medium (`#E5E7EB`)
- **Font:** 14px Medium
- **Icon Size:** 16dp x 16dp
- **Hover State:** Border color Primary Blue, Background Accent Blue Light

### Metric Cards

- **Background:** White (`#FFFFFF`)
- **Border:** 1px solid Secondary Gray Medium (`#E5E7EB`)
- **Corner Radius:** 8dp
- **Padding:** 20dp
- **Shadow:** None (flat design)
- **Min Height:** 100dp
- **Spacing Between Cards:** 16dp

#### Card Header

- **Icon Size:** 16dp x 16dp
- **Icon Color:** Text Secondary
- **Label Font:** 14px Medium, Text Secondary
- **Spacing:** 8dp between icon and label

#### Card Metric

- **Metric Font:** 36px Bold, Tabular Nums
- **Metric Color:** Text Primary
- **Comparison Font:** 14px Medium
- **Comparison Color:** Text Secondary
- **Comparison Spacing:** 8dp from metric
- **Change Indicator:** Arrow icon 12dp, color matches sentiment (green/red)

### Chart Cards

- **Background:** White (`#FFFFFF`)
- **Border:** 1px solid Secondary Gray Medium (`#E5E7EB`)
- **Corner Radius:** 8dp
- **Padding:** 20dp
- **Chart Background:** Secondary Gray Light (`#F9FAFB`)
- **Chart Corner Radius:** 6dp
- **Chart Padding:** 16dp

#### Chart Styling

- **Line Stroke:** 2px, Primary Blue (`#3B82F6`)
- **Grid Lines:** 1px, Chart Grid (`#E5E7EB`)
- **Axis Labels:** 12px Regular, Text Tertiary
- **Data Points:** 6dp circles, Primary Blue fill (on hover)
- **Hover Tooltip:** 8dp shadow, White background, 6dp radius

### Data Tables

- **Row Height:** 44dp
- **Header Height:** 36dp
- **Header Background:** Secondary Gray Light (`#F9FAFB`)
- **Header Font:** 12px Semibold, Uppercase, Letter spacing 0.5px
- **Row Border:** 1px solid Secondary Gray Medium (`#E5E7EB`)
- **Cell Padding:** 12dp horizontal
- **Hover State:** Background Secondary Gray Light (`#F9FAFB`)

### Buttons

#### Primary Button

- **Background:** Primary Blue (`#3B82F6`)
- **Text:** White (`#FFFFFF`)
- **Height:** 40dp
- **Corner Radius:** 6dp
- **Padding:** 16dp horizontal
- **Font:** 14px Medium
- **Icon Size:** 16dp x 16dp
- **Hover State:** Background darkens to `#2563EB`

#### Secondary Button (Ghost)

- **Background:** Transparent
- **Border:** 1px solid Secondary Gray Medium (`#E5E7EB`)
- **Text:** Text Primary
- **Height:** 40dp
- **Corner Radius:** 6dp
- **Hover State:** Background Secondary Gray (`#F3F4F6`)

#### Filter Button

- **Background:** White (`#FFFFFF`)
- **Border:** 1px solid Secondary Gray Medium (`#E5E7EB`)
- **Text:** Text Primary
- **Height:** 36dp
- **Corner Radius:** 6dp
- **Padding:** 12dp horizontal
- **Icon:** 16dp (filter icon or dropdown chevron)
- **Hover State:** Border Primary Blue, slight shadow

### Empty State Illustration

- **Position:** Top-right of main content
- **Size:** ~200dp x 200dp
- **Style:** Playful, character-based illustration
- **Purpose:** Softens empty data states

### Input Fields

- **Height:** 40dp
- **Border:** 1px solid Secondary Gray Medium (`#E5E7EB`)
- **Corner Radius:** 6dp
- **Background:** White (`#FFFFFF`)
- **Focus Border:** 2px solid Primary Blue
- **Padding:** 12dp
- **Font:** 14px Regular
- **Placeholder Color:** Text Tertiary (`#9CA3AF`)

## Layout Structure

### Overall Grid

- **Sidebar:** 200dp fixed width
- **Main Content:** Flexible, max-width 1400dp
- **Content Padding:** 24dp horizontal, 24dp vertical
- **Two-Column Card Layout:** 50/50 split on desktop
- **Full-Width Charts:** Below metric cards

### Dashboard Grid

- **Metric Cards Row:** 4 cards, equal width with 16dp gaps
- **Chart Cards Row:** 2 cards, equal width with 16dp gaps
- **Table Card:** Full-width below charts
- **Responsive:** Stacks vertically on mobile

### Spacing System

- **4dp** - Micro spacing (icon-to-text)
- **8dp** - Small spacing (between related elements)
- **12dp** - Default spacing (within components)
- **16dp** - Medium spacing (between cards, sections)
- **20dp** - Card padding
- **24dp** - Large spacing (page margins)
- **32dp** - Extra large spacing (major section separation)

## Motion & Animation

- **Chart Load:** 600ms, Ease-out with line draw animation
- **Metric Count Up:** 800ms, Ease-out with number increment
- **Hover Effects:** 120ms, Ease-out
- **Filter Apply:** 200ms fade-out old data, 300ms fade-in new data
- **Sidebar Collapse:** 250ms, Ease-in-out
- **Button States:** 150ms, Ease-out

## Accessibility Considerations

- **Contrast Ratios:** WCAG AA compliance (4.5:1 for text, 3:1 for UI)
- **Focus States:** 2px Primary Blue outline, 2dp offset
- **Keyboard Navigation:** Full keyboard support for all interactive elements
- **Screen Reader Labels:** Proper ARIA labels on charts and data visualizations
- **Data Tables:** Proper table markup with headers
- **Color Independence:** Never rely solely on color for data meaning (use icons/labels)
- **Touch Targets:** Minimum 40dp x 40dp for all interactive elements

---

## Summary & Cross-Platform Patterns

### Common Design Principles Across All Platforms

1. **Card-Based Layouts:** All platforms use card components for content organization
2. **Generous Spacing:** 16-24dp is the standard for section separation
3. **Rounded Corners:** 8-16dp radius is universal for modern, friendly aesthetics
4. **Icon Consistency:** 20-24dp for navigation, 16dp for inline icons
5. **Button Heights:** 40-48dp for primary actions, 36-44dp for secondary
6. **Typography:** Sans-serif system fonts (Inter, SF Pro, Roboto) dominate
7. **Status Colors:** Green = success/positive, Red = error/negative, Yellow/Orange = warning

### Light vs Dark Theme Insights

- **Fey (Dark):** Uses true blacks (#0A0A0A, #0F0F0F) with high contrast white text for premium feel
- **Grammarly/Patreon/Plane/Seline (Light):** Use off-whites (#F9FAFB, #FAFAFA) to reduce glare, with dark grays for text

### Layout Patterns

- **Left Sidebar:** Grammarly, Patreon, Plane, Seline (industry standard for navigation)
- **Multi-Panel:** Grammarly (3-column), Fey (2-panel with center focus)
- **Bottom Navigation:** Patreon (workflow-driven), Fey (app-style navigation)
- **Top Filters:** Seline (analytics standard for time-based filtering)

### Modal & Dialog Design

- **Patreon** excels at modal design: centered, clear hierarchy, gradient promo cards, bottom action bar
- Modals should be 600-640dp max width for optimal reading
- Always include clear close affordance (X button) and backdrop dismissal
