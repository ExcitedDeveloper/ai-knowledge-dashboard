# Comprehensive Design System Guide

**Document Purpose:** This guide serves as the foundational reference for all design decisions, component implementations, and interface patterns within our project. Each style system analyzed below represents best-in-class design thinking from leading platforms. Study these philosophies and learn how to leverage their principles in your daily work.

---

# Fey — Financial Dashboard Design System

## Philosophy

**Core Principle: Confidence Through Clarity in Darkness**

Fey's design philosophy centers on the belief that financial interfaces must project unwavering confidence, precision, and focus. When users interact with financial data, they're making decisions that affect real money and real futures. The interface must therefore become invisible—a transparent lens through which truth emerges without distortion or distraction.

**Why Darkness Matters:**
The dark theme isn't an aesthetic indulgence; it's a functional imperative. Financial professionals spend hours monitoring markets, reviewing portfolios, and analyzing trends. A dark interface reduces eye strain during extended sessions and creates a cocoon of concentration where external stimuli fade away. The darkness also allows bright data visualizations—charts, graphs, percentage indicators—to command attention through contrast. White lines on black backgrounds don't just look striking; they're mathematically more legible at a glance.

**Information Hierarchy Through Space:**
Fey understands that financial users don't read interfaces—they scan them. The three-panel layout (market overview left, primary visualization center, news feed right) mirrors the natural F-pattern of eye movement that emerges from decades of web browsing behavior. Each panel has a distinct purpose, and users can orient themselves instantly: "Where am I? What am I looking at? What's happening in the market?"

**Emotional Resonance:**
Dark interfaces communicate seriousness, premium quality, and professional-grade tools. Think about Bloomberg terminals, professional trading platforms, and high-end financial software—they embrace darkness because it signals "this is where serious work happens." The rounded bottom navigation bar adds just enough modern softness to prevent the interface from feeling cold or intimidating, striking a balance between professional rigor and contemporary approachability.

**Trust Through Consistency:**
Every percentage uses tabular numerals so columns align perfectly. Every status uses consistent color coding (green = gain, red = loss) paired with directional indicators to ensure accessibility for colorblind users. Every animation timing is deliberate—fast enough to feel responsive (150ms hovers), slow enough to feel controlled (400ms chart animations). This consistency builds unconscious trust: the interface behaves predictably, so users can focus on unpredictable markets.

## How To Leverage

**For Designers:**

1. **Embrace the Darkness:** Always design on true black backgrounds (`#0F0F0F`, `#1A1A1A`), never pure black (#000000) which can feel harsh on modern displays. Use subtle elevation through slightly lighter blacks (`#252525`) to create depth without shadows.

2. **Contrast is King:** Maintain WCAG AAA contrast ratios (7:1 minimum) for all text elements. White text on dark backgrounds must be crisp and readable. Test your designs in various lighting conditions, including bright offices and dim evening environments.

3. **Data Visualization First:** When designing new features, start with the data visualization or primary metric display. Everything else supports this core function. Ask yourself: "Can a user glance at this for 2 seconds and extract the key insight?"

4. **Use Semantic Color Sparingly:** Red and green should only indicate financial performance (losses/gains). Don't use red for general errors or green for general success in a financial context—this creates confusion. Use blue for interactive elements, purple for premium features, and maintain strict color discipline.

5. **Micro-interactions Matter:** Financial users notice everything. A button that responds slowly (>200ms) feels untrustworthy. A chart that animates too quickly feels frivolous. Dial in your timing curves and test them extensively.

**For Developers:**

1. **Implement a Robust Color Token System:**
```typescript
// example color token implementation
const colors = {
  background: {
    primary: '#0A0A0A',
    elevated: '#1C1C1C',
    subtle: '#141414',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#E0E0E0',
    tertiary: '#6B7280',
  },
  data: {
    positive: '#10B981',
    negative: '#EF4444',
    neutral: '#6B7280',
  },
};
```

2. **Typography with Tabular Numerals:**
Always use tabular numerals for financial figures to ensure alignment:
```css
.financial-figure {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  letter-spacing: 0;
}
```

3. **Optimize Chart Performance:**
Financial charts update frequently. Use canvas-based rendering (Chart.js, D3 with canvas, or lightweight alternatives like uPlot) for better performance than SVG with large datasets. Implement smart debouncing for real-time updates (200-300ms) to prevent visual jitter.

4. **Accessibility Compliance:**
Never rely solely on color to convey information. Always pair red/green indicators with arrows or text:
```jsx
<StatusIndicator value={change}>
  <ArrowIcon direction={change > 0 ? 'up' : 'down'} />
  <span>{Math.abs(change)}%</span>
</StatusIndicator>
```

5. **Loading States Matter:**
Financial users expect instant feedback. Implement skeleton screens for charts and data panels rather than spinners. Show stale data with a subtle overlay while fetching fresh data rather than blanking the screen.

**For Product Managers:**

1. **Prioritize Glanceability:** Every feature request should pass the "3-second test." Can a user extract value in 3 seconds or less? If not, simplify or provide progressive disclosure.

2. **Respect Information Density:** Financial users are sophisticated and can handle dense information displays. Don't oversimplify. However, ensure density serves comprehension, not just space efficiency.

3. **Context is Critical:** Users need to know "where am I, what am I looking at, when was this updated?" Always display timestamps, data sources, and navigation breadcrumbs.

4. **Mobile Considerations:** While Fey's design is desktop-first, financial users increasingly check markets on mobile. Plan for responsive breakpoints that maintain information hierarchy even on small screens.

---

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

# Grammarly — Content Writing Platform Design System

## Philosophy

**Core Principle: Clarity and Breathing Room for the Mind**

Grammarly's design philosophy is rooted in a profound understanding: writing is cognitive labor. The interface must reduce mental overhead, not add to it. Every pixel exists to either help users understand their writing or get out of the way so they can focus on creating. This is design as cognitive architecture—structuring space and information to match how the human mind processes language, feedback, and improvement.

**The Three-Column Truth:**
The three-column layout isn't arbitrary; it maps directly to the mental model of navigating complex information:
- **Left (Where):** Navigation sidebar answers "Where can I go?"
- **Middle (Structure):** Tree navigation answers "How is this organized?"
- **Right (What):** Main content answers "What am I working on?"

This spatial organization reduces the cognitive load of orientation. Users never have to wonder "where am I?" because the structure itself communicates location and context.

**Light as a Canvas:**
The light color palette isn't just aesthetic preference—it's functional psychology. Light backgrounds feel open, unimposing, and safe. When you're showing users their writing mistakes or suggesting tone adjustments (which can feel personal or even judgmental), the interface must feel supportive, not aggressive. Light grays, soft greens, and gentle blues create an emotional atmosphere of constructive feedback rather than harsh criticism.

**Humanizing Technical Feedback:**
The genius of Grammarly's design lies in making algorithmic feedback feel human. Emoji usage ("😊 Friendly, 💛 Sincere, 🙏 Appreciative") transforms abstract concepts into emotional touchstones. Expandable cards with explanations respect user intelligence—don't just tell me I sound "off-brand," show me why and let me decide. The badges ("On-Brand," "Off-Brand") provide instant visual feedback without requiring users to read paragraphs of explanation.

**Progressive Disclosure:**
Not every user needs every detail at every moment. Collapsible sections, expandable cards, and hierarchical information architecture allow users to drill down only when they need more context. This design pattern respects user expertise—beginners can skim the surface, while advanced users can explore the depths.

**Trust Through Transparency:**
Timestamps on every card ("CREATED 01.21.25"), clear labeling ("EXPLANATION (DEFAULT)"), and explicit upgrade paths ("upgrade to Enterprise") build trust through transparency. Users always know what they're looking at, when it was created, and what limitations exist in their current plan.

## How To Leverage

**For Designers:**

1. **Master the Three-Column Layout:**
When designing new features, always start by determining which column they belong in:
- Navigation decisions → Left sidebar
- Structural/organizational content → Middle tree panel
- Primary content/workspace → Right main area

Never blur these boundaries. A button that "sort of" fits in two places probably needs its own home.

2. **Use Color to Communicate State, Not Just Style:**
- Secondary Green Light (`#D7F4ED`) = selected/active state
- Secondary Blue Light (`#E8F4F9`) = informational context
- Primary Green (`#15C39A`) = primary actions
- Accent Red/Orange = warnings/off-brand indicators

Maintain strict semantic meaning. Don't use green for anything except positive feedback, active states, or primary CTAs.

3. **Design for Scanning, Not Reading:**
Users don't read every word. They scan for patterns. Use:
- Bold section labels (uppercase, increased letter-spacing)
- Emoji or icons as visual anchors
- Consistent card structures so users recognize patterns
- Adequate whitespace between sections (24dp minimum)

4. **Expandable Content Design Pattern:**
When designing cards or sections with expandable content:
- Always show a preview of what's inside
- Use a clear chevron icon (20dp) positioned consistently (usually right-aligned)
- Animate expansion smoothly (200ms ease-in-out)
- Ensure collapsed state provides enough value to stand alone

**For Developers:**

1. **Implement Robust Tree Navigation:**
Tree navigation is deceptively complex. Use a proper tree data structure and ensure:
```typescript
interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  isExpanded: boolean;
  level: number; // for indentation: level * 16dp
}
```

Handle keyboard navigation (arrow keys, Enter to expand/collapse, Tab to move between tree levels).

2. **Accessible Expandable Components:**
```jsx
<details open={isExpanded}>
  <summary onClick={toggleExpanded} aria-expanded={isExpanded}>
    <ChevronIcon direction={isExpanded ? 'down' : 'right'} />
    <h3>Section Title</h3>
  </summary>
  <div className="expandable-content">
    {/* content */}
  </div>
</details>
```

Use semantic HTML (`<details>`/`<summary>`) when appropriate, or ensure proper ARIA attributes.

3. **Badge Component Library:**
Create reusable, semantic badge components:
```tsx
<Badge variant="on-brand" size="small">
  On-Brand
</Badge>

<Badge variant="off-brand" size="small">
  Off-Brand
</Badge>
```

Variants should map to semantic meaning, not just colors. This makes refactoring color schemes trivial.

4. **Information Callout Pattern:**
```tsx
<Callout variant="info" icon={TwoCirclesIcon}>
  <p>Your current plan includes 1 tone profile.</p>
  <Link href="/upgrade">upgrade to Enterprise</Link>
</Callout>
```

Callouts should be visually distinct (light blue background), include an icon, and provide clear next actions when limitations exist.

5. **Focus Management in Three-Column Layout:**
Ensure focus moves logically between columns. When a user clicks an item in the tree navigation (middle), focus should move to the corresponding content in the main area (right). Implement focus traps in modals to prevent focus from escaping to background content.

**For Product Managers:**

1. **Feature Placement Strategy:**
- Global features (affect entire account) → Left sidebar
- Organizational features (manage structure) → Middle tree
- Content features (work on specific items) → Right main area

This consistency helps users build mental models quickly.

2. **Information Architecture Principles:**
- Maximum tree depth: 3 levels (beyond this, users get lost)
- Maximum sidebar items: 12 (more requires scrolling, which breaks the "everything at a glance" principle)
- Main content area: max-width 960dp (optimal line length for reading is 60-80 characters)

3. **Upgrade Path Visibility:**
Grammarly masterfully surfaces upgrade opportunities without being pushy. Always show users what they're missing, how to get it, and why it matters. Use soft, informational language ("To create unique tone profiles for different teams, upgrade to Enterprise") rather than hard blocks ("Upgrade to continue").

4. **Feedback Timing:**
When showing users writing feedback or tone suggestions, timing matters:
- Instant feedback (< 100ms): Users perceive as natural
- Delayed feedback (> 500ms): Users perceive as "thinking" or processing
- Design for instant visual feedback with progressive detail loading

---

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

# Patreon — Creator Platform Design System

## Philosophy

**Core Principle: Warmth, Community, and Creative Empowerment**

Patreon's design philosophy recognizes a fundamental truth: creative work is vulnerable. When creators share their art, writing, music, or ideas with the world and ask for financial support, they're exposing themselves to potential rejection. The interface, therefore, must feel like a supportive community space—warm, encouraging, and safe—rather than a cold transactional platform.

**Softness as Strategy:**
Every corner is rounded. Every button is pill-shaped. Every interaction is smooth and gentle. This isn't arbitrary—sharp corners subconsciously communicate aggression, boundaries, and barriers. Rounded corners communicate openness, friendliness, and welcome. When creators log into Patreon, they should feel like they're entering a supportive creative community, not a corporate dashboard.

**The Gradient as Aspiration:**
The promo card gradient (warm red-brown flowing into orange-gold, ending in cool blue) isn't just beautiful—it's emotionally strategic. Gradients represent journey, transition, and possibility. The warm-to-cool color progression mirrors the creative journey itself: starting with passion (warm reds), moving through work and golden moments (orange-gold), and ultimately achieving success and stability (cool blue). This subtle emotional design reinforces the platform's promise: "Your creative journey has a path, and we're here to support it."

**Clarity in Workflow:**
The bottom navigation bar exemplifies Patreon's "clarity trumps cleverness" philosophy. Creators are building businesses, managing communities, and producing content—they can't afford to be confused by their tools. "Back," "Preview post," "Next" are unambiguous. The black buttons on light gray backgrounds provide strong visual contrast. Every creator, regardless of technical sophistication, knows exactly where they are in the workflow and how to proceed.

**Modal Dialogs as Invitations:**
The modal design is masterclass work. Rather than feeling like interruptions, Patreon's modals feel like invitations: "Hey, you've created something special—let's share it with the world!" The 16dp corner radius, generous 32dp padding, and ample whitespace prevent the feeling of being trapped or pressured. The close button is always visible (top-right, 40dp × 40dp) so users never feel forced into actions.

**Iconography as Language:**
The left sidebar uses icons consistently to create a visual language. Shield = Moderation (protection), Megaphone = Promotions (amplification), Chart bars = Analytics (measurement), Bell = Notifications (awareness). Once learned, these icons allow users to navigate almost without reading text labels—making the interface faster and more intuitive with repeated use.

**The Color Psychology of Red:**
Patreon's signature red (`#FF424D`) is strategically deployed. Red evokes passion, energy, and love—exactly the emotions that drive creative communities. But red can also signal danger or error, so Patreon uses it sparingly: primary CTAs, active navigation states, and the brand logo. This restraint ensures red remains associated with positive, empowering actions rather than warnings.

## How To Leverage

**For Designers:**

1. **Design Modals as Experiences, Not Interruptions:**
When creating modal dialogs:
- Start with the content, then add chrome (borders, shadows, close buttons)
- Ensure the first thing users see explains "why am I looking at this?"
- Provide clear primary action (usually bottom-right) and escape routes (close X, backdrop click)
- Test modal timing: Showing modals immediately after an action feels responsive; showing them unprompted feels annoying

2. **Use Gradients Purposefully:**
Gradients should enhance meaning, not just add visual interest:
- Promo content: Use warm-to-cool gradients suggesting journey/aspiration
- Success states: Use light-to-saturated color suggesting achievement
- Backgrounds: Use subtle same-hue gradients for depth without distraction

Implementation tip: Always provide fallback solid colors for accessibility and older browsers.

3. **Bottom Bar Navigation for Workflows:**
When designing multi-step workflows (post creation, setup wizards, onboarding):
- Always show current step and total steps ("Step 2 of 5")
- Left button = go back, Right button = primary action (next/complete)
- Center area can show tertiary actions (save draft, preview)
- Fix the bar to the bottom (position: fixed) so it's always accessible

4. **Rounded Corner Consistency:**
Establish a corner radius scale and stick to it:
- Small elements (badges, small buttons): 4-8dp
- Medium elements (cards, input fields): 8-12dp
- Large elements (modals, containers): 12-16dp
- Pill-shaped elements (primary buttons): 50% (full pill)

Never mix radius values arbitrarily within a component.

5. **Sidebar Icon Design:**
When designing sidebar icons:
- Keep them simple and recognizable at 20dp × 20dp
- Test in grayscale first (they should be identifiable without color)
- Use consistent stroke weights (2px typically)
- Ensure icons work in both active and inactive states

**For Developers:**

1. **Modal Dialog Implementation:**
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  size="medium" // 640dp max-width
  showBackdrop={true}
  backdropBlur={8}
  closeOnBackdropClick={true}
  closeOnEscape={true}
>
  <ModalHeader>
    <h1>Share your upcoming drop</h1>
    <CloseButton onClick={handleClose} />
  </ModalHeader>
  <ModalBody>
    {/* content */}
  </ModalBody>
</Modal>
```

Implement focus trap: When modal opens, focus moves to first focusable element. Tab cycles through modal elements only. Escape closes modal and returns focus to trigger element.

2. **Gradient Implementation:**
```css
.promo-card {
  background: linear-gradient(
    135deg,
    #C04848 0%,
    #E6A04E 50%,
    #4A8FB8 100%
  );
}

/* Ensure text remains readable */
.promo-card-text {
  color: #FFFFFF;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
```

Test gradients with multiple text colors and ensure WCAG contrast compliance.

3. **Bottom Navigation Bar:**
```tsx
<BottomBar fixed={true}>
  <ButtonGroup position="left">
    <Button variant="secondary" onClick={goBack}>
      Back
    </Button>
  </ButtonGroup>

  <ButtonGroup position="center">
    <Button variant="tertiary" onClick={preview}>
      Preview post
    </Button>
  </ButtonGroup>

  <ButtonGroup position="right">
    <Button variant="primary" onClick={goNext}>
      Next
    </Button>
  </ButtonGroup>
</BottomBar>
```

Ensure bottom bar has proper z-index (100+) to float above content, and add box-shadow to create separation.

4. **Pill-Shaped Button Component:**
```tsx
<Button
  variant="primary" // red background
  size="large" // 48dp height
  shape="pill" // border-radius: 24dp
  fullWidth={false}
>
  Continue
</Button>
```

Pill buttons should have minimum 24dp horizontal padding to ensure text doesn't feel cramped.

5. **Social Share Implementation:**
```tsx
<ShareButton
  platform="twitter"
  url={contentUrl}
  text={shareText}
  icon={TwitterIcon}
>
  Share on X (Twitter)
</ShareButton>

<ShareButton
  platform="facebook"
  url={contentUrl}
  icon={FacebookIcon}
>
  Share on Facebook
</ShareButton>
```

Use proper social sharing APIs rather than custom implementations. Include proper og:meta tags for rich previews.

**For Product Managers:**

1. **Creator-First Feature Design:**
When evaluating new features, ask:
- Does this make creators' lives easier or harder?
- Does this help creators build sustainable businesses?
- Would a non-technical creator understand how to use this?

If answers are "harder," "no," or "no," redesign the feature.

2. **Workflow Design Principles:**
Multi-step workflows should:
- Allow saving drafts at any step (autosave ideally)
- Permit going back without losing progress
- Show progress indicators (step 2 of 5)
- Validate incrementally (show errors at the relevant step, not at the end)
- Provide preview functionality before final publication

3. **Community Safety Balance:**
Patreon must balance creator freedom with community safety. When designing moderation features:
- Make safety tools visible but not intrusive
- Provide clear explanations of why content might be flagged
- Allow appeals and provide transparency in decision-making
- Never make creators feel like they're being watched or policed

4. **Monetization Without Manipulation:**
Patreon shows upgrade paths without manipulative dark patterns:
- Always explain what the upgrade provides
- Never block core functionality behind paywalls
- Use informational language ("Unlock more features") not fear-based language ("Don't miss out!")
- Make it easy to understand pricing before committing

---

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

# Plane — Project Management Platform Design System

## Philosophy

**Core Principle: Respect Intelligence, Reward Expertise**

Plane's design philosophy is built on a refreshing premise: project management users are sophisticated professionals who can handle complexity—they just need it presented intelligently. Unlike consumer apps that prioritize "simplicity at all costs," Plane embraces information density while maintaining clarity. This is design for power users who want to see everything at a glance and make decisions rapidly.

**Cards as Information Containers:**
The kanban card is Plane's atomic unit of information architecture. Each card packs impressive metadata density—ID, title, status, dates, assignees, tags, sub-item counts, priority indicators—without feeling cluttered. This is achieved through three key principles:

1. **Icon Language:** Icons replace text wherever possible (calendar = date, person = assignee, number badge = sub-items)
2. **Color Coding:** Status colors provide instant visual scanning without requiring reading
3. **Information Hierarchy:** ID at top (scanning/reference), title below (understanding), metadata footer (details)

This structure respects the user's scanning behavior: Quick glance shows status (color), deeper look reveals specifics (metadata).

**Breadcrumbs as Cognitive Anchors:**
In project management tools, users can easily get lost in deep hierarchies. "AS Mobbin Official > Work Items" isn't just navigation—it's a constant reminder of context. This breadcrumb pattern prevents the disorientation that plagues complex systems. Users always know: "Where am I? How did I get here? How do I go back?"

**The Sidebar as Personal Workspace:**
The collapsible sidebar with favorites and recent items acknowledges that project management is personal. Every user has their own workflows, priorities, and frequently-accessed projects. The customizable sidebar transforms Plane from a generic tool into "my workspace." This personal investment increases engagement and daily active usage.

**Status Colors with Sophistication:**
Plane's status color system is brilliantly restrained:
- Backlog Gray: Intentionally muted—these items aren't active yet, don't demand attention
- Todo Blue: Calm and informational—work to be done, but not urgent
- In Progress Yellow: Warm and attention-grabbing—active work that matters right now
- Done Green: Satisfying and affirmative—completion and achievement

These aren't primary colors (which would create visual fatigue); they're muted, professional tones that can be scanned for hours without eye strain.

**View Flexibility as Respect:**
The view toggles (list, kanban, calendar, table, Gantt) recognize a fundamental truth: different roles need different perspectives on the same data. Developers want kanban, managers want Gantt charts, executives want calendars. Plane doesn't force a single view; it adapts to how you think.

**Personality Within Professionalism:**
"Welcome to Plane 👋" and "Ask Pi (Beta)" humanize what could be sterile enterprise software. The emoji usage is strategic—just enough to feel friendly without being unprofessional. The AI assistant positioned as conversational ("Ask Pi") rather than robotic ("Search") invites interaction.

## How To Leverage

**For Designers:**

1. **Design for Scanning, Then Reading:**
Users scan cards by color/shape first, then read titles, then examine metadata. Design accordingly:
- Most important info (status) = color coding throughout card
- Second level (title/description) = larger font, high contrast
- Third level (metadata) = smaller font, icons, footer placement

2. **Icon Library as Language:**
Build a comprehensive icon library where every icon has ONE clear meaning:
- Calendar = dates/deadlines
- Person = assignee/owner
- Tag = categories/labels
- Number badge = count (sub-items, comments, attachments)
- Clock = time tracking/estimates

Never reuse icons for different meanings in different contexts—this breaks the visual language.

3. **Status Color System Design:**
When creating status-based systems:
```
Inactive → Gray (#71717A)
Planned → Blue (#3B82F6)
Active → Yellow/Orange (#F59E0B)
Complete → Green (#10B981)
Blocked → Red (#EF4444)
```

Use 20% opacity versions for backgrounds (status badge pills) and full opacity for borders and icons.

4. **Drag-and-Drop Visual Feedback:**
When designing drag interactions:
- **Lift:** Add shadow, slightly increase size (scale: 1.02)
- **Drag Ghost:** Reduce opacity to 0.7, add cursor: grab
- **Drop Zone:** Show colored border (2px, status color) when dragging over
- **Drop Feedback:** Brief "settle" animation (100ms ease-out)

5. **Responsive Information Density:**
Plane is information-dense on desktop, but must simplify on mobile:
- Desktop: Show all metadata in card footer
- Tablet: Show most critical 3-4 metadata items
- Mobile: Show status color + title only, tap for full details

Create component variants for each breakpoint.

**For Developers:**

1. **Kanban Board Implementation:**
```tsx
<KanbanBoard
  columns={[
    { id: 'backlog', title: 'Backlog', color: 'gray' },
    { id: 'todo', title: 'Todo', color: 'blue' },
    { id: 'in-progress', title: 'In Progress', color: 'yellow' },
    { id: 'done', title: 'Done', color: 'green' },
  ]}
  cards={workItems}
  onCardMove={handleCardMove}
  onCardClick={handleCardClick}
/>
```

Implement drag-and-drop with react-beautiful-dnd or @dnd-kit. Ensure keyboard accessibility (arrow keys to move between cards, Space to pick up/drop).

2. **Card Component with Metadata:**
```tsx
<Card>
  <CardHeader>
    <CardID monospace>{item.id}</CardID>
    <CardTitle>{item.title}</CardTitle>
  </CardHeader>

  <CardMetadata>
    {item.dueDate && (
      <MetaItem>
        <CalendarIcon />
        <span>{formatDate(item.dueDate)}</span>
      </MetaItem>
    )}
    {item.assignee && (
      <MetaItem>
        <AvatarIcon src={item.assignee.avatar} />
      </MetaItem>
    )}
    {item.tags.map(tag => (
      <Badge key={tag.id} color={tag.color}>
        {tag.name}
      </Badge>
    ))}
  </CardMetadata>

  <CardFooter>
    <IconButton icon="comments" count={item.commentCount} />
    <IconButton icon="attachments" count={item.attachmentCount} />
    <IconButton icon="subtasks" count={item.subtaskCount} />
  </CardFooter>
</Card>
```

3. **Breadcrumb Navigation:**
```tsx
<Breadcrumbs>
  {pathSegments.map((segment, index) => (
    <Fragment key={segment.id}>
      <BreadcrumbLink href={segment.url}>
        {segment.icon && <Icon name={segment.icon} />}
        <span>{segment.title}</span>
      </BreadcrumbLink>
      {index < pathSegments.length - 1 && (
        <BreadcrumbSeparator>
          <ChevronRightIcon />
        </BreadcrumbSeparator>
      )}
    </Fragment>
  ))}
</Breadcrumbs>
```

Current page should have different styling (semibold, darker color, not a link).

4. **View Switcher Component:**
```tsx
<ViewSwitcher activeView={currentView} onViewChange={setView}>
  <ViewOption value="list" icon={ListIcon} label="List" />
  <ViewOption value="kanban" icon={KanbanIcon} label="Board" />
  <ViewOption value="calendar" icon={CalendarIcon} label="Calendar" />
  <ViewOption value="table" icon={TableIcon} label="Table" />
</ViewSwitcher>
```

Persist view preference to localStorage or user settings. Implement view transitions smoothly (200ms fade).

5. **Sidebar Collapsible Sections:**
```tsx
<Sidebar>
  <SidebarSection
    title="Workspace"
    defaultExpanded={true}
    collapsible={true}
  >
    <SidebarItem icon={HomeIcon} href="/home">
      Home
    </SidebarItem>
    <SidebarItem icon={InboxIcon} href="/inbox" badge={5}>
      Inbox
    </SidebarItem>
  </SidebarSection>

  <SidebarSection title="Favorites" collapsible={true}>
    {favorites.map(item => (
      <SidebarItem key={item.id} href={item.url}>
        {item.name}
      </SidebarItem>
    ))}
  </SidebarSection>
</Sidebar>
```

Store collapsed/expanded state in user preferences.

**For Product Managers:**

1. **Information Architecture Principles:**
- Maximum board columns: 6 (beyond this requires horizontal scrolling which disrupts workflow)
- Maximum card metadata items: 8 (more than this, cards become too tall)
- Maximum breadcrumb depth: 4 levels (Project > Space > Board > Item)

2. **Status Workflow Design:**
When designing status workflows:
- Start with 4-5 statuses (backlog, todo, in progress, done)
- Allow customization, but provide strong defaults
- Ensure every status has a clear "next status" (no dead ends)
- Make status transitions audited (who moved it, when, why)

3. **Notification Strategy:**
Project management tools risk notification overload. Design notifications with priority levels:
- **Critical:** Mentions, assignments to you, blocked items → Real-time notification + email
- **Important:** Status changes on items you're watching → Daily digest email
- **Informational:** Comments on items in your projects → Weekly summary

Users should be able to customize these thresholds.

4. **Search and Filter Priority:**
Power users live in search and filters. Prioritize:
- Saved filter presets ("My items," "Overdue," "High priority")
- Quick filters in top-right (assignee, status, due date)
- Advanced filter builder for complex queries
- Keyboard shortcut to open search (Cmd/Ctrl + K)

5. **Collaboration Features:**
When adding collaboration features (comments, @mentions, attachments):
- Always show who and when (attribution builds accountability)
- Allow inline replies to comments (threading)
- Support markdown in text fields (power users love it)
- Show real-time cursors when multiple users edit (presence awareness)

---

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

# Seline — Analytics Dashboard Design System

## Philosophy

**Core Principle: Truth Through Simplicity**

Seline's design philosophy is grounded in a profound respect for data integrity and user cognition. Analytics dashboards walk a treacherous line: too much information overwhelms users and obscures insights; too little information fails to provide value. Seline navigates this balance through radical simplicity—every element serves either data presentation or data exploration, and nothing else.

**The White Canvas Approach:**
The predominantly white interface isn't minimalism for aesthetics' sake—it's cognitive psychology in action. White backgrounds create a "blank slate" feeling where data becomes the story. When you look at Seline, you're not looking at an interface; you're looking at your data. The subtle gray tones (`#F9FAFB`, `#F3F4F6`) provide just enough visual separation between cards and background to create hierarchy without distraction.

**Metric Cards as Information Atoms:**
Each metric card follows a strict information hierarchy:
1. **Metric label** (what am I measuring?)
2. **Large number** (what's the current value?)
3. **Comparison indicator** (is this good or bad compared to before?)
4. **Contextual timeline** (how has this trended over time?)

This structure mirrors how analysts naturally think: identification → status → evaluation → context. Users can extract insights at any level of depth depending on how much time they have.

**Filters as First-Class Citizens:**
The top-right filter placement isn't accidental. In Western reading patterns, the eye naturally travels to the top-right after scanning headers. By positioning time range selectors and filters here consistently, Seline reduces cognitive load—users don't have to hunt for controls. This placement also creates a natural workflow: "Understand current state (scan metrics) → Adjust timeframe (top-right filters) → Observe changes (metrics update) → Refine (adjust filters further)."

**Charts as Supporting Evidence:**
Notice that charts in Seline are purposefully understated: light gray backgrounds, minimal gridlines, simple line strokes. This is intentional. Charts aren't the hero—metrics are. Charts provide context and validation ("Is this number trending up or down?") rather than being the primary information delivery mechanism. This design choice prevents chart junk and visual complexity from overwhelming the dashboard.

**The Illustration as Humanity:**
The playful character illustration in the empty state ("behind all this data are real people and real websites") is brilliant UX psychology. Analytics can feel cold and impersonal—just numbers and graphs. The illustration reminds users that they're measuring human behavior, real website visitors, actual engagement. This subtle humanization prevents the emotional detachment that can occur when users view analytics as abstract numbers rather than representations of real people.

**Progressive Disclosure Through Simplicity:**
Seline's sidebar contains just four options: Dashboard, Visitors, Funnels, Settings. This ruthless feature constraint forces product decisions toward doing a few things exceptionally well. Each option represents a distinct mental model (overview, who, conversion, configuration). Users never experience decision paralysis because the options are limited and clearly differentiated.

## How To Leverage

**For Designers:**

1. **Metric Card Design:**
Always structure metric cards with this hierarchy:
```
[Icon] [Metric Label]     ← 14px Medium, secondary color
[Large Number]            ← 36px Bold, tabular nums, primary color
[% Change] [Arrow]        ← 14px Medium, green/red based on sentiment
[vs previous timeframe]   ← 12px Regular, tertiary color
```

Use generous padding (20dp) to prevent cards from feeling cramped. Avoid borders or shadows—let whitespace create separation.

2. **Chart Design Principles:**
When designing analytics charts:
- **Background:** Light gray (`#F9FAFB`), not white—provides subtle contrast
- **Gridlines:** Minimal, light color (`#E5E7EB`), only on major intervals
- **Data lines:** 2px stroke, brand color (`#3B82F6`)
- **Axis labels:** 12px, tertiary color, minimal
- **Data points:** Show only on hover, not by default (reduces visual noise)

Test charts with zero data, partial data, and full data to ensure they always look intentional.

3. **Filter Control Design:**
Top-right filter controls should:
- Use button group patterns (visually connected)
- Show current selection prominently
- Use dropdown chevrons consistently (16dp)
- Provide keyboard shortcuts (e.g., "R" for date range, "F" for filter)

4. **Empty State Design:**
Empty states should:
- Include friendly illustration (200dp × 200dp)
- Explain why data is empty ("No visitors yet")
- Provide clear next action ("Install Seline" with primary button)
- Avoid feeling like an error—frame as opportunity

5. **Responsive Dashboard Design:**
Analytics dashboards must work on all screen sizes:
- Desktop (>1280px): 4-column metric card layout
- Tablet (768-1280px): 2-column metric card layout
- Mobile (<768px): Single column, cards stack

Always test with real data at various viewport sizes.

**For Developers:**

1. **Tabular Numerals for Metrics:**
Always use tabular numerals for analytics numbers:
```css
.metric-value {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  font-weight: 700;
  font-size: 36px;
  line-height: 44px;
  letter-spacing: -0.5px;
}
```

This ensures numbers align properly and don't shift when values change (e.g., "999" → "1000").

2. **Chart Library Selection:**
For analytics dashboards, prioritize performance over features:
- **Lightweight:** uPlot, Chart.js, or Recharts
- **Avoid:** Heavy libraries like D3 (unless you need custom visualizations)

Implement chart skeletons/loading states to prevent layout shift:
```tsx
{isLoading ? (
  <ChartSkeleton width="100%" height="200px" />
) : (
  <LineChart data={chartData} />
)}
```

3. **Metric Card Component:**
```tsx
<MetricCard>
  <MetricHeader>
    <MetricIcon name="visitors" />
    <MetricLabel>Total Visits</MetricLabel>
  </MetricHeader>

  <MetricValue>{formatNumber(totalVisits)}</MetricValue>

  <MetricComparison
    value={percentChange}
    sentiment={percentChange >= 0 ? 'positive' : 'negative'}
  >
    <Arrow direction={percentChange >= 0 ? 'up' : 'down'} />
    <span>{Math.abs(percentChange)}%</span>
    <span className="context">vs previous 30 days</span>
  </MetricComparison>
</MetricCard>
```

4. **Date Range Picker Integration:**
```tsx
<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  presets={[
    { label: 'Last 7 days', value: 'last-7-days' },
    { label: 'Last 30 days', value: 'last-30-days' },
    { label: 'Last 90 days', value: 'last-90-days' },
    { label: 'Custom range', value: 'custom' },
  ]}
/>
```

Store selected range in URL query parameters so users can share filtered views.

5. **Real-Time Data Updates:**
For analytics dashboards, implement smart data fetching:
```tsx
// Poll for updates every 60 seconds when tab is active
useInterval(() => {
  if (!document.hidden) {
    refetchMetrics();
  }
}, 60000);

// Show subtle indicator when data updates
<UpdateIndicator show={isRefetching}>
  Updated {formatRelativeTime(lastUpdated)}
</UpdateIndicator>
```

Never auto-refresh silently—always show users when data has updated.

**For Product Managers:**

1. **Metric Selection Strategy:**
Don't show every possible metric. Show the 4-6 most important ones:
- **Vanity metrics** (total visits, page views): Users love them, but limited actionability
- **Engagement metrics** (time on site, bounce rate): More actionable, show user behavior
- **Conversion metrics** (goal completions, conversions): Most valuable, directly tied to business outcomes

Start with vanity metrics for dashboard overview, provide drill-down paths to engagement and conversion metrics.

2. **Comparison Timeframes:**
Always provide comparison context:
- "vs previous period" (if viewing last 30 days, compare to previous 30 days)
- "vs same period last year" (accounts for seasonality)
- "vs average" (helps identify anomalies)

Let users toggle between comparison modes.

3. **Data Granularity:**
Time series granularity should match the selected timeframe:
- 1-7 days: Show hourly data points
- 8-30 days: Show daily data points
- 31-90 days: Show daily data points
- 91-365 days: Show weekly data points
- >365 days: Show monthly data points

This prevents charts from becoming unreadable with too many data points.

4. **Filtering and Segmentation:**
Analytics power users need to slice data multiple ways:
- **By dimension:** Page, referrer source, device, location
- **By segment:** New visitors vs returning, mobile vs desktop
- **By date range:** Custom date ranges with calendar picker

Allow combining filters (AND logic) and saving filter presets.

5. **Export and Sharing:**
Professional users need to:
- Export data to CSV/Excel for further analysis
- Share dashboards with team members (generate shareable links)
- Schedule email reports (daily/weekly/monthly summaries)
- Embed metrics in other tools (API access)

These features transform Seline from viewing tool to decision-making tool.

---

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

# Summary & Cross-Platform Patterns

## Common Design Principles Across All Platforms

1. **Card-Based Layouts:** All platforms use card components for content organization
2. **Generous Spacing:** 16-24dp is the standard for section separation
3. **Rounded Corners:** 8-16dp radius is universal for modern, friendly aesthetics
4. **Icon Consistency:** 20-24dp for navigation, 16dp for inline icons
5. **Button Heights:** 40-48dp for primary actions, 36-44dp for secondary
6. **Typography:** Sans-serif system fonts (Inter, SF Pro, Roboto) dominate
7. **Status Colors:** Green = success/positive, Red = error/negative, Yellow/Orange = warning

## Light vs Dark Theme Insights

- **Fey (Dark):** Uses true blacks (#0A0A0A, #0F0F0F) with high contrast white text for premium feel
- **Grammarly/Patreon/Plane/Seline (Light):** Use off-whites (#F9FAFB, #FAFAFA) to reduce glare, with dark grays for text

## Layout Patterns

- **Left Sidebar:** Grammarly, Patreon, Plane, Seline (industry standard for navigation)
- **Multi-Panel:** Grammarly (3-column), Fey (2-panel with center focus)
- **Bottom Navigation:** Patreon (workflow-driven), Fey (app-style navigation)
- **Top Filters:** Seline (analytics standard for time-based filtering)

## Modal & Dialog Design

- **Patreon** excels at modal design: centered, clear hierarchy, gradient promo cards, bottom action bar
- Modals should be 600-640dp max width for optimal reading
- Always include clear close affordance (X button) and backdrop dismissal

---

## Document Usage

This comprehensive style guide should be referenced:
- **During design reviews** - Ensure new designs align with established patterns
- **During implementation** - Developers should reference component specs directly
- **During onboarding** - New team members should read Philosophy sections to understand design thinking
- **During product planning** - Product managers should consider platform patterns when scoping features

Remember: These aren't arbitrary rules—they're distilled wisdom from successful products serving millions of users. Use them as foundations, adapt them to your specific needs, but always understand *why* they work before changing them.
