# Interior Design App — Comprehensive Design System

**Project Vision:** An AI-powered interior design application that helps homeowners and renters reimagine their spaces through image uploads and LLM-guided recommendations. The app embraces warmth, simplicity, and clarity to make interior design accessible and inspiring for everyone.

---

## Pontificating

### The Intersection of Home, Technology, and Emotion

Interior design is deeply personal. A home isn't just four walls and furniture—it's where life happens, where memories form, where people feel safe, creative, and themselves. When we ask users to upload photos of their spaces and trust an AI to help them reimagine these intimate environments, we're asking for vulnerability. The design of this application must honor that trust.

**Synthesis from Five Worlds:**

From **Fey's** dark, professional aesthetic, we learn that interfaces can project confidence and authority. However, interior design demands the opposite emotional register—not the serious focus of financial markets, but the warm invitation of a trusted friend's advice. We reject darkness but embrace Fey's principle of **trust through consistency**: every interaction should behave predictably, building confidence in the AI's suggestions.

From **Grammarly's** light, airy interface, we inherit the understanding that **clarity is kindness**. When the app provides design suggestions, it must explain _why_—not just "add this sofa," but "this sofa's warm terracotta tone complements your existing artwork and creates visual harmony." Like Grammarly's expandable cards, our suggestions should respect user intelligence through progressive disclosure.

From **Patreon's** warm, rounded aesthetic, we adopt the philosophy that **softness communicates safety**. Rounded corners, pill-shaped buttons, and warm color accents aren't decoration—they're emotional design that says "you're in a creative, supportive space." The gradient promo card inspiration translates perfectly to our "inspiration gallery" feature: gradients represent journey and transformation, exactly what users seek when reimagining their spaces.

From **Plane's** information-dense kanban cards, we learn that **users can handle complexity when it's structured intelligently**. Our "room redesign cards" will pack substantial information—style tags, color palettes, furniture suggestions, budget estimates—without feeling overwhelming. Icon language, color coding, and clear information hierarchy make dense information scannable and actionable.

From **Seline's** analytics dashboard, we embrace **truth through simplicity**. The predominantly white canvas with subtle gray tones creates a blank slate where _images_ of redesigned spaces become the hero. Generous whitespace prevents cognitive overload. Like Seline's metric cards, our "design stat cards" (room dimensions, budget ranges, style matches) should present information in clear hierarchies: identification → status → evaluation → context.

### Core Design Principles for Interior Design App

**1. Images Are Sacred**
Interior design is fundamentally visual. Every design decision must serve the primacy of images—room photos, design inspirations, AI-generated concepts. The interface is the frame; the images are the art.

**2. Warmth Without Clutter**
Warmth comes from color psychology (earth tones, soft terracottas, sage greens) and rounded forms, not from decorative elements. Every pixel must justify its existence. Warmth and simplicity are not contradictions—they're complements.

**3. AI as Collaborator, Not Oracle**
The AI doesn't dictate design choices; it suggests, explains, and empowers. Every AI-generated suggestion should include:

- Visual representation (rendered mockup)
- Rationale (why this works for your space)
- Alternatives (explore variations)
- User control (accept, modify, or reject)

**4. Progressive Trust Building**
New users need hand-holding; experienced users need speed. The interface must adapt:

- First-time upload: Guided tooltips, explanatory cards, suggested starting points
- Returning users: Quick actions, saved preferences, keyboard shortcuts
- Power users: Batch operations, style presets, direct editing tools

**5. Celebration of Progress**
Redesigning a space is a journey. The app should celebrate milestones:

- First image uploaded → "Great start! Let's explore possibilities"
- First design generated → "Look at this transformation! ✨"
- Saved design → "Your vision is taking shape"
- Shared design → "Inspiring others—you're a designer now!"

Small moments of encouragement build emotional investment and user retention.

### Emotional Journey Mapping

**Entry State (First Visit):**
User feels: Curious but uncertain ("Will this actually work?")
Interface must: Project warmth and simplicity. Large, friendly upload button. Example before/after images. Simple copy: "Upload a photo of your room. We'll help you reimagine it."

**Upload State:**
User feels: Slight vulnerability (sharing personal space) + anticipation
Interface must: Provide immediate feedback. Progress indicator. Reassuring copy: "Looking at your beautiful space..." Camera handling UI should feel premium, not clinical.

**AI Processing State:**
User feels: Anticipation, possibly impatience
Interface must: Engaging loading state. Not spinners—visual progressions. "Analyzing room dimensions..." → "Selecting complementary colors..." → "Generating design concepts..."

**Results State:**
User feels: Excitement, curiosity, possible overwhelm (too many options?)
Interface must: Present 3-4 design variations maximum. Card-based layout with clear visual hierarchy. Large, beautiful images. Quick-scan information (style name, key changes, estimated cost).

**Exploration State:**
User feels: Engaged, creative, in control
Interface must: Smooth interactions. Expandable details. Comparison tools (before/after slider). Save/favorite affordances. Social sharing options.

**Decision/Action State:**
User feels: Confidence building toward purchase decisions
Interface must: Clear next steps. "Get shopping list," "Find similar furniture," "Connect with designer." Never pushy—always empowering.

### Color Psychology for Interior Design App

Unlike financial apps (Fey's serious blacks), productivity tools (Grammarly's professional grays), or project management (Plane's status colors), interior design demands colors that evoke _home_.

**Primary Palette: Earth Tones**

- Warm Terracotta: Inviting, comfortable, earthy
- Sage Green: Calming, natural, balanced
- Soft Cream: Clean, spacious, neutral canvas

**Secondary Palette: Natural Accents**

- Clay Brown: Grounding, organic, reliable
- Sky Blue: Open, airy, inspiring
- Warm Sand: Subtle, sophisticated, timeless

**Accent Palette: Emotional Highlights**

- Sunset Orange: Energy, creativity, transformation
- Deep Teal: Depth, quality, trust
- Soft Blush: Gentleness, care, attention

These aren't arbitrary—they're the colors of homes people love. They appear in mid-century modern furniture, Scandinavian interiors, bohemian textiles, and minimalist spaces. They're psychologically associated with comfort, nature, and well-being.

### Typography: Approachable Yet Refined

Interior design occupies interesting territory: it's aspirational (users want beautiful spaces) but accessible (everyone has a home to design). Typography must balance these tensions.

**Sans-Serif Foundation:**
Primary font should be humanist sans-serif (Inter, GT America, or similar) at regular weight for most text. This communicates approachability and modernity without coldness.

**Serif Accents for Aspiration:**
Section headers and feature names can use elegant serif fonts (Freight Text, Crimson Pro) to add sophistication. This says "we take design seriously" without being pretentious.

**Generous Sizes and Spacing:**
Body text minimum 16px (not 14px). Line height 1.6-1.8 for comfortable reading. Letter spacing slightly opened up (+0.02em) for airiness. This creates the "breathing room" that communicates simplicity and clarity.

### Layout Philosophy: Focus + Flexibility

**Mobile-First, Always:**
Unlike Fey (desktop financial dashboards) or Plane (desktop project management), interior design apps live on mobile devices. Users photograph rooms with phones, browse inspiration while sitting on their couch, share designs via social media. Desktop is supplementary.

**Center-Stage Image Display:**
Following Seline's principle of "data as hero," our layouts put images center-stage:

- Full-width hero images
- Generous whitespace around images
- Subtle UI chrome that doesn't compete with visual content
- Image galleries with smooth, tactile interactions

**Card-Based Organization:**
Like all five reference systems, we embrace cards for content organization:

- Design concept cards: Large image, title, key features, actions
- Room cards: Space photo, room type, dimensions, current status
- Inspiration cards: Style examples, mood boards, curated collections
- Suggestion cards: AI recommendations with rationale

**Progressive Disclosure:**
Following Grammarly's expandable pattern:

- Collapsed state: Essential info at a glance
- Expanded state: Detailed explanations, options, customization
- Never show everything at once—respect cognitive load

### Interaction Patterns: Smooth and Tactile

**Image Upload Flow:**

1. Large, centered upload zone with drag-and-drop
2. Camera access for mobile (capture directly)
3. Gallery selection (choose existing photos)
4. Instant thumbnail preview
5. Optional annotations ("this wall is staying," "ignore the moving boxes")

**Design Exploration:**

1. Swipeable card carousel (mobile) or grid (desktop)
2. Tap to expand full-screen
3. Before/after comparison slider
4. Pinch-to-zoom on specific areas
5. Save/favorite with heart icon + haptic feedback

**AI Suggestion Interaction:**

1. Suggestion appears as card with image + brief explanation
2. Expandable drawer reveals full rationale
3. "Try variations" button generates alternatives
4. "Apply this" button adds to saved designs
5. "Tell me more" opens contextual help

**Social Sharing:**
Following Patreon's modal pattern:

1. Share button triggers modal (not navigation away)
2. Preview card shows what will be shared
3. Multiple platform options (Pinterest, Instagram, direct link)
4. Optional message customization
5. Copy link with one tap

### Motion and Delight

**Loading States:**
Never static spinners. Progressive, meaningful animations:

- Image upload: Photo "developing" effect (like instant camera)
- AI processing: Subtle room elements highlighting sequentially
- Design generation: Gentle fade-in with slight scale-up (1.05 → 1.0)

**Transitions:**

- Page transitions: 300ms, ease-out with slight fade
- Card expansions: 250ms, spring curve (slight bounce)
- Image galleries: 200ms, smooth momentum scrolling
- Modal entry/exit: 300ms scale + fade (Patreon pattern)

**Micro-interactions:**

- Button hover: Subtle lift shadow + color shift (150ms)
- Heart favorite: Scale bounce + color fill + haptic (200ms)
- Checkbox toggle: Slide with spring curve (180ms)
- Image loading: Progressive blur-up (crisp → full quality)

**Celebration Moments:**

- First design saved: Confetti animation (subtle, tasteful)
- Design shared: Checkmark with expanding circle
- Profile completed: Progress ring fills with success color

### Accessibility: Design for Everyone

Interior design should be accessible to everyone, regardless of ability:

**Visual Accessibility:**

- WCAG AA minimum contrast (4.5:1 text, 3:1 UI components)
- Never rely solely on color (use icons + text)
- Image alt text generated by AI (room descriptions)
- Zoom support up to 200% without breaking layouts

**Motor Accessibility:**

- Touch targets minimum 44dp × 44dp
- Spacing between interactive elements minimum 8dp
- Keyboard navigation for all functionality
- No actions requiring precise timing or coordination

**Cognitive Accessibility:**

- Clear, jargon-free language ("room type" not "spatial classification")
- Progressive disclosure (don't overwhelm)
- Consistent patterns (same actions work the same everywhere)
- Undo functionality for all destructive actions

**Screen Reader Support:**

- Proper ARIA labels on all interactive elements
- Image descriptions that convey design concepts
- Live regions for AI processing status updates
- Logical tab order through interface

### Data Privacy and Trust

Users upload photos of their homes—deeply personal spaces. Trust is paramount:

**Transparent Data Usage:**

- Clear copy on upload screen: "Your photos help us generate designs. We never share them publicly without your permission."
- Privacy settings easily accessible
- Option to delete photos at any time
- Explicit consent before any sharing

**Visual Privacy Indicators:**

- Lock icon for private designs
- Public/private toggle clearly visible
- Sharing status indicators on cards
- "Who can see this?" help text

**Security Design:**

- Secure image handling (HTTPS, encrypted storage)
- No surprise social posts (explicit share actions only)
- User control over data retention
- Export functionality (own your data)

---

## Color Palette

### Primary Colors

**Warm Terracotta** - `#D4816D`

- Primary brand color and CTA buttons
- Evokes warmth, comfort, earthiness
- Use for: Primary buttons, active states, important highlights

**Soft Cream** - `#F9F6F2`

- Main background color
- Clean, spacious, gentle on eyes
- Use for: App background, card backgrounds

**Charcoal** - `#2D2D2D`

- Primary text color
- Strong enough for readability, soft enough to avoid harshness
- Use for: Headers, body text, important labels

### Secondary Colors

**Sage Green** - `#8FA88E`

- Success states, positive feedback
- Calming, natural, balanced
- Use for: Success messages, saved indicators, "liked" states

**Clay Brown** - `#8B6F5E`

- Secondary actions, supporting elements
- Grounding, reliable, organic
- Use for: Secondary buttons, borders, subtle emphasis

**Warm Sand** - `#E8DED2`

- Subtle backgrounds, gentle separation
- Sophisticated, timeless, neutral
- Use for: Section backgrounds, hover states, disabled elements

### Accent Colors

**Sunset Orange** - `#E89B6D`

- Energy, transformation, inspiration
- Use for: Transformation highlights, "before/after" indicators, inspiration tags

**Deep Teal** - `#5B8A8A`

- Trust, quality, depth
- Use for: Premium features, verification badges, trust indicators

**Soft Blush** - `#E8C4B8`

- Gentleness, care, attention to detail
- Use for: Tooltips, helper text backgrounds, subtle highlights

**Sky Blue** - `#A8C5D1`

- Openness, possibility, inspiration
- Use for: Informational elements, links, secondary highlights

### Functional Colors

**Success Green** - `#7BA877`

- Success states, confirmations
- Use for: Success messages, completion indicators

**Warning Amber** - `#E8AE6D`

- Warnings, cautions
- Use for: Warning messages, attention indicators

**Error Coral** - `#D47B6D`

- Errors, destructive actions
- Use for: Error messages, delete confirmations

### Background & Surface Colors

**Background Primary** - `#F9F6F2` (Soft Cream)

- App-level background

**Background Secondary** - `#FFFFFF`

- Card backgrounds, elevated surfaces

**Background Tertiary** - `#F3EFE9`

- Subtle section backgrounds, gentle separation

**Overlay** - `rgba(45, 45, 45, 0.5)`

- Modal backdrops, image overlays

### Text Colors

**Text Primary** - `#2D2D2D` (Charcoal)

- Main content, headers

**Text Secondary** - `#6B6560`

- Supporting text, metadata, labels

**Text Tertiary** - `#A39A92`

- Disabled states, placeholders, deemphasized text

**Text On Dark** - `#F9F6F2`

- Text on dark backgrounds or images

## Typography

### Font Family

**Primary Font:** Inter / -apple-system / system-ui

- Used for: UI elements, body text, navigation

**Accent Font:** Crimson Pro / Georgia / serif

- Used for: Section headers, feature titles, inspiration

### Font Weights

**Regular:** 400 (body text, standard UI)
**Medium:** 500 (emphasis, labels, small headers)
**Semibold:** 600 (subheaders, important labels)
**Bold:** 700 (main headers, strong emphasis)

### Text Styles

#### Headings

**H1: Display**

- **Font:** Crimson Pro, Semibold
- **Size/Line Height:** 36px/44px
- **Letter Spacing:** -0.5px
- **Use:** Main page titles, welcome screens
- **Example:** "Reimagine Your Space"

**H2: Section Header**

- **Font:** Inter, Bold
- **Size/Line Height:** 28px/36px
- **Letter Spacing:** -0.3px
- **Use:** Major section headers
- **Example:** "Your Design Concepts"

**H3: Subsection Header**

- **Font:** Inter, Semibold
- **Size/Line Height:** 20px/28px
- **Letter Spacing:** -0.2px
- **Use:** Card titles, feature names
- **Example:** "Modern Minimalist Living Room"

**H4: Small Header**

- **Font:** Inter, Semibold
- **Size/Line Height:** 16px/24px
- **Letter Spacing:** -0.1px
- **Use:** Component headers, grouped elements
- **Example:** "Color Palette"

#### Body Text

**Body Large**

- **Font:** Inter, Regular
- **Size/Line Height:** 18px/30px
- **Letter Spacing:** 0px
- **Use:** Primary content, explanations, descriptions
- **Example:** "This warm, minimalist design brings natural light to the forefront while maintaining cozy comfort."

**Body**

- **Font:** Inter, Regular
- **Size/Line Height:** 16px/26px
- **Letter Spacing:** 0.02px
- **Use:** Standard UI text, form labels, navigation
- **Example:** "Upload a photo of your room"

**Body Small**

- **Font:** Inter, Regular
- **Size/Line Height:** 14px/22px
- **Letter Spacing:** 0.05px
- **Use:** Supporting information, metadata, helper text
- **Example:** "Last saved 5 minutes ago"

**Caption**

- **Font:** Inter, Medium
- **Size/Line Height:** 12px/18px
- **Letter Spacing:** 0.1px
- **Use:** Image captions, tiny labels, timestamps
- **Example:** "Living Room · 220 sq ft"

#### Special Text

**Label (Uppercase)**

- **Font:** Inter, Bold
- **Size/Line Height:** 11px/16px
- **Letter Spacing:** 0.8px, Uppercase
- **Use:** Section labels, categories, tags
- **Example:** "STYLE: SCANDINAVIAN"

**Button Text**

- **Font:** Inter, Medium
- **Size/Line Height:** 16px/24px
- **Letter Spacing:** 0.1px
- **Use:** All button labels
- **Example:** "Generate Design"

**Link Text**

- **Font:** Inter, Medium
- **Size/Line Height:** 16px/26px (matches body)
- **Letter Spacing:** 0.02px
- **Color:** Deep Teal (#5B8A8A)
- **Use:** Inline links, navigation links
- **Hover:** Underline appears

## Component Styling

### Buttons

#### Primary Button

- **Background:** Warm Terracotta (`#D4816D`)
- **Text:** White (`#FFFFFF`)
- **Height:** 48dp (mobile), 44dp (desktop)
- **Corner Radius:** 24dp (pill shape)
- **Padding:** 24dp horizontal
- **Font:** 16px, Medium
- **Shadow:** 0 2dp 8dp rgba(212, 129, 109, 0.2)
- **Hover:** Background darkens to `#C67161`, shadow increases to 4dp
- **Active:** Scale to 0.98, shadow decreases
- **Disabled:** Background `#E8DED2`, text `#A39A92`

#### Secondary Button

- **Background:** Transparent
- **Border:** 2px solid Clay Brown (`#8B6F5E`)
- **Text:** Clay Brown (`#8B6F5E`)
- **Height:** 48dp (mobile), 44dp (desktop)
- **Corner Radius:** 24dp (pill shape)
- **Padding:** 24dp horizontal
- **Font:** 16px, Medium
- **Hover:** Background Warm Sand (`#E8DED2`)
- **Active:** Border darkens to `#755D4E`

#### Tertiary/Ghost Button

- **Background:** Transparent
- **Text:** Text Secondary (`#6B6560`)
- **Height:** 40dp
- **Corner Radius:** 8dp
- **Padding:** 16dp horizontal
- **Font:** 16px, Medium
- **Hover:** Background `#F3EFE9`
- **Active:** Background `#E8DED2`

#### Icon Button

- **Size:** 44dp × 44dp
- **Icon Size:** 24dp × 24dp
- **Corner Radius:** 22dp (circular)
- **Background:** Transparent
- **Icon Color:** Text Secondary (`#6B6560`)
- **Hover:** Background `#F3EFE9`, Icon darkens to Text Primary
- **Active:** Background `#E8DED2`

### Cards

#### Design Concept Card

- **Background:** White (`#FFFFFF`)
- **Border:** 1px solid `#E8DED2`
- **Corner Radius:** 16dp
- **Shadow:** 0 4dp 12dp rgba(45, 45, 45, 0.08)
- **Padding:** 0 (image fills to edges), 16dp internal padding for text content
- **Hover:** Shadow increases to 0 8dp 24dp rgba(45, 45, 45, 0.12), subtle lift (translateY: -2px)
- **Transition:** 200ms ease-out

**Card Structure:**

```
[Full-width image, 16dp top corner radius]
[16dp padding container]
  [H3: Design title]
  [Body Small: Style tags]
  [Divider line: 1px, #E8DED2]
  [Metadata row: icons + text]
  [Action buttons row]
[16dp padding container end]
```

#### Room Card (User's Spaces)

- **Background:** White (`#FFFFFF`)
- **Border:** 1px solid `#E8DED2`
- **Corner Radius:** 12dp
- **Shadow:** 0 2dp 8dp rgba(45, 45, 45, 0.06)
- **Padding:** 12dp
- **Hover:** Border color Warm Terracotta, shadow increases

**Card Structure:**

```
[Square thumbnail image, 8dp corner radius]
[Text content, 12dp left padding]
  [H4: Room name]
  [Caption: Room details]
[Icon buttons row]
```

#### Inspiration Card (Gallery/Mood Boards)

- **Background:** Gradient overlay on image
- **Corner Radius:** 16dp
- **Shadow:** 0 4dp 16dp rgba(45, 45, 45, 0.1)
- **Overlay:** Linear gradient from transparent to rgba(45, 45, 45, 0.6)
- **Text:** White, positioned bottom-left with 20dp padding
- **Hover:** Overlay darkens slightly, scale: 1.02

### Input Fields

#### Text Input

- **Height:** 52dp
- **Background:** White (`#FFFFFF`)
- **Border:** 1.5px solid `#D4C4B8`
- **Corner Radius:** 12dp
- **Padding:** 16dp horizontal
- **Font:** 16px Regular
- **Placeholder:** Text Tertiary (`#A39A92`)
- **Focus:** Border 2px solid Warm Terracotta (`#D4816D`), subtle shadow
- **Error:** Border 2px solid Error Coral (`#D47B6D`)
- **Success:** Border 2px solid Success Green (`#7BA877`)

#### Text Area

- **Min Height:** 120dp
- **Max Height:** 300dp (scrollable)
- **Other styles:** Same as Text Input
- **Padding:** 16dp all sides

#### Image Upload Zone

- **Min Height:** 240dp (mobile), 320dp (desktop)
- **Background:** Background Tertiary (`#F3EFE9`)
- **Border:** 2px dashed Clay Brown (`#8B6F5E`)
- **Corner Radius:** 16dp
- **Hover:** Border solid, Background White
- **Active (dragging):** Border color Warm Terracotta, Background Soft Cream
- **Content:** Centered icon (64dp) + text

### Modals

#### Modal Container

- **Max Width:** 640dp (mobile: full screen with 16dp margins)
- **Background:** White (`#FFFFFF`)
- **Corner Radius:** 24dp (0 on mobile)
- **Shadow:** 0 20dp 60dp rgba(45, 45, 45, 0.25)
- **Padding:** 32dp (24dp on mobile)
- **Backdrop:** Overlay color with backdrop-blur: 8px

#### Modal Header

- **Height:** 64dp
- **Border Bottom:** 1px solid `#E8DED2`
- **Padding Bottom:** 16dp
- **Close Button:** Top-right, 40dp × 40dp icon button

#### Modal Body

- **Padding:** 24dp vertical
- **Max Height:** 70vh (scrollable)

#### Modal Footer

- **Height:** auto
- **Border Top:** 1px solid `#E8DED2`
- **Padding Top:** 16dp
- **Button Layout:** Right-aligned, 12dp spacing between buttons

### Navigation

#### Top Navigation Bar

- **Height:** 64dp
- **Background:** Soft Cream (`#F9F6F2`) with slight blur (backdrop-filter: blur(10px))
- **Border Bottom:** 1px solid `#E8DED2`
- **Padding:** 16dp horizontal
- **Position:** Sticky top
- **Z-index:** 100
- **Shadow:** 0 2dp 8dp rgba(45, 45, 45, 0.04) (on scroll)

**Layout:**

- Logo/Brand: Left, 32dp height
- Navigation Links: Center (desktop), hidden (mobile)
- Action Buttons: Right, 12dp spacing

#### Bottom Navigation (Mobile)

- **Height:** 72dp + safe-area-inset-bottom
- **Background:** White (`#FFFFFF`) with backdrop-filter: blur(10px)
- **Border Top:** 1px solid `#E8DED2`
- **Shadow:** 0 -2dp 16dp rgba(45, 45, 45, 0.08)
- **Position:** Fixed bottom
- **Z-index:** 100

**Items:**

- 4-5 items maximum
- Icon: 24dp × 24dp
- Label: Caption style, optional (can hide on small screens)
- Active State: Warm Terracotta color, icon fills
- Spacing: Evenly distributed

#### Sidebar Navigation (Desktop)

- **Width:** 260dp
- **Background:** Background Tertiary (`#F3EFE9`)
- **Border Right:** 1px solid `#E8DED2`
- **Padding:** 24dp vertical, 16dp horizontal

**Items:**

- Height: 44dp
- Padding: 12dp horizontal
- Corner Radius: 8dp
- Icon: 20dp × 20dp, 12dp spacing to text
- Active State: Background White, left 3px border Warm Terracotta
- Hover: Background White opacity 50%

### Tags and Badges

#### Style Tag

- **Height:** 28dp
- **Background:** Warm Sand (`#E8DED2`)
- **Text:** Clay Brown (`#8B6F5E`)
- **Font:** 12px Medium, Letter spacing 0.2px
- **Padding:** 6dp 12dp
- **Corner Radius:** 14dp (pill)
- **Border:** None
- **Hover:** Background darkens slightly

#### Status Badge

- **Height:** 24dp
- **Padding:** 4dp 10dp
- **Corner Radius:** 12dp (pill)
- **Font:** 11px Bold, Letter spacing 0.3px, Uppercase

**Variants:**

- **Saved:** Background Success Green 20%, Text Success Green
- **Processing:** Background Sky Blue 20%, Text Sky Blue darker shade
- **Shared:** Background Deep Teal 20%, Text Deep Teal
- **Private:** Background Text Secondary 20%, Text Text Secondary

#### Count Badge (Notifications)

- **Size:** 20dp × 20dp (min-width: 20dp, scales for large numbers)
- **Background:** Warm Terracotta (`#D4816D`)
- **Text:** White, 11px Bold
- **Corner Radius:** 10dp (circular)
- **Position:** Top-right of parent, -6dp offset

### Image Components

#### Before/After Comparison Slider

- **Container:** Full-width, aspect ratio 16:9 or 4:3
- **Handle:** 48dp diameter circle, White background, Shadow: 0 2dp 12dp rgba(45, 45, 45, 0.2)
- **Handle Icon:** Arrows icon 24dp, Warm Terracotta color
- **Divider Line:** 2px solid White with subtle shadow
- **Labels:** "Before" / "After", Caption style, positioned in corners with 12dp padding

#### Image Gallery

- **Grid Layout:** 2 columns (mobile), 3 columns (tablet), 4 columns (desktop)
- **Gap:** 16dp
- **Aspect Ratio:** 1:1 (square) or 4:3
- **Corner Radius:** 12dp
- **Hover:** Overlay with gradient, scale: 1.03, shadow increase
- **Transition:** 200ms ease-out

#### Image with Loading State

- **Placeholder:** Background Tertiary (`#F3EFE9`)
- **Loading Effect:** Shimmer animation, gradient sweeping across
- **Blur-Up:** Low-quality placeholder blurs into high-quality image (400ms fade)
- **Error State:** Icon + text "Image unavailable", retry button

### Tooltips and Popovers

#### Tooltip

- **Max Width:** 240dp
- **Background:** Charcoal (`#2D2D2D`) opacity 95%
- **Text:** White, 14px Regular
- **Padding:** 8dp 12dp
- **Corner Radius:** 8dp
- **Arrow:** 6dp triangle pointing to trigger
- **Shadow:** 0 4dp 12dp rgba(45, 45, 45, 0.3)
- **Delay:** 400ms on hover
- **Transition:** 150ms ease-out, fade + slight translate

#### Popover (Contextual Menu)

- **Max Width:** 320dp
- **Background:** White (`#FFFFFF`)
- **Border:** 1px solid `#E8DED2`
- **Corner Radius:** 12dp
- **Shadow:** 0 8dp 24dp rgba(45, 45, 45, 0.15)
- **Padding:** 8dp vertical
- **Item Height:** 40dp
- **Item Hover:** Background `#F3EFE9`
- **Divider:** 1px solid `#E8DED2`, 8dp margin vertical

### Loading States

#### Skeleton Screen

- **Background:** Background Tertiary (`#F3EFE9`)
- **Shimmer:** Linear gradient animation, Warm Sand → White → Warm Sand
- **Corner Radius:** Matches actual component
- **Animation:** 1.5s ease-in-out infinite

#### Spinner (Minimal Use)

- **Size:** 32dp × 32dp (small), 48dp × 48dp (default)
- **Color:** Warm Terracotta (`#D4816D`)
- **Stroke Width:** 3px
- **Animation:** Smooth rotation, 1s linear infinite

#### Progress Bar

- **Height:** 8dp
- **Background:** Warm Sand (`#E8DED2`)
- **Fill:** Warm Terracotta (`#D4816D`)
- **Corner Radius:** 4dp
- **Animation:** Smooth width transition, 300ms ease-out

#### Processing Indicator (AI Generation)

- **Container:** Card-style, Center of screen
- **Icon:** Animated illustration (e.g., brush painting, room transforming)
- **Text:** Processing steps, updates every 2-3 seconds
- **Progress:** Determinate progress bar or step indicator
- **Cancel Button:** Tertiary/ghost style

### Empty States

#### Empty Gallery/List

- **Illustration:** 200dp × 200dp, warm colors, friendly style
- **Headline:** H3 style, encouraging tone
- **Description:** Body style, 2-3 sentences explaining next steps
- **CTA Button:** Primary button, clear action
- **Spacing:** 32dp between elements

**Example:**

```
[Illustration: Empty room with potential]
"Your Design Journey Starts Here"
"Upload a photo of any room in your home, and we'll help you explore beautiful design possibilities tailored to your space and style."
[Upload Photo Button]
```

## Layout Structure

### Mobile Layout (< 768px)

**Primary Pattern: Single Column**

- Full-width content
- 16dp side margins
- 24dp vertical spacing between sections
- Bottom navigation for primary actions
- Floating action button for main CTA when needed

**Image Display:**

- Full-width images (bleed to edges)
- 16:9 or 4:3 aspect ratios
- Galleries in 2-column grid with 12dp gap

**Card Layout:**

- Full-width cards, 16dp margins
- 16dp spacing between cards
- Swipeable card carousels when appropriate

### Tablet Layout (768px - 1024px)

**Primary Pattern: Two Column (Optional Sidebar)**

- Main content: 60-65% width
- Sidebar: 35-40% width (optional, contextual)
- 24dp gutters
- 32dp side margins

**Image Display:**

- 2-column galleries
- Larger hero images
- Modal views for expanded images

### Desktop Layout (> 1024px)

**Primary Pattern: Centered Content with Max Width**

- Max content width: 1280dp
- Centered with auto margins
- Optional sidebar navigation (260dp fixed)

**Main Content Area:**

- Max width: 960dp for reading content
- Full width for galleries and image-heavy layouts
- 32dp gutters

**Image Display:**

- 3-4 column galleries
- Large hero images (full width of content area)
- Before/after comparisons side-by-side

### Spacing System

**Micro Spacing**

- **2dp:** Icon-to-text within buttons/badges
- **4dp:** Tight element grouping (tags, inline items)

**Small Spacing**

- **8dp:** Related elements (form label to input, icon to text)
- **12dp:** Card internal spacing, button spacing in groups

**Medium Spacing**

- **16dp:** Between cards, between sections (default)
- **20dp:** Card internal padding
- **24dp:** Major section separation

**Large Spacing**

- **32dp:** Page-level margins, between major features
- **48dp:** Extra large separation, hero section spacing
- **64dp:** Maximum spacing for dramatic separation

### Grid System

**12-Column Grid (Desktop):**

- Column width: Flexible
- Gutter: 24dp
- Margin: 32dp

**6-Column Grid (Tablet):**

- Column width: Flexible
- Gutter: 20dp
- Margin: 24dp

**4-Column Grid (Mobile):**

- Column width: Flexible
- Gutter: 16dp
- Margin: 16dp

## Motion & Animation

### Timing Functions

**Standard Ease-Out:** For most UI transitions

- **Curve:** cubic-bezier(0.4, 0.0, 0.2, 1)
- **Duration:** 200ms
- **Use:** Hover states, simple transitions

**Ease-In-Out:** For reversible animations

- **Curve:** cubic-bezier(0.4, 0.0, 0.6, 1)
- **Duration:** 250ms
- **Use:** Modal open/close, expandable sections

**Spring Curve:** For bouncy, delightful moments

- **Curve:** cubic-bezier(0.2, 0.8, 0.2, 1)
- **Duration:** 300ms
- **Use:** Success states, favorite actions, celebration

### Animation Guidelines

**Micro-interactions (< 200ms):**

- Button hover: 150ms ease-out
- Icon color change: 120ms ease-out
- Checkbox toggle: 180ms spring curve
- Ripple effect: 200ms ease-out

**Transitions (200-300ms):**

- Card expansion: 250ms ease-in-out
- Modal entry/exit: 300ms scale + fade
- Image gallery navigation: 250ms ease-out
- Page transitions: 300ms ease-out

**Longer Animations (> 300ms):**

- AI processing indicator: 400ms looping
- Image upload progress: Smooth, continuous
- Confetti celebration: 600ms spring curve
- Blur-up image load: 400ms fade

### Specific Animation Behaviors

**Image Upload:**

1. Drag enter zone: Border animates to solid (150ms)
2. Drop: Scale down to 0.95 then back to 1.0 (spring, 300ms)
3. Upload progress: Smooth progress bar fill
4. Success: Checkmark appears with scale bounce (300ms spring)

**Design Card Interaction:**

1. Hover: Lift shadow increases, translateY: -2px (200ms ease-out)
2. Click: Scale to 0.98 (100ms), then expand to full view (300ms ease-out)
3. Full view entry: Fade in backdrop (200ms), scale card from 0.95 to 1.0 (300ms spring)
4. Exit: Reverse animation

**AI Generation Process:**

1. Processing icon: Pulsing scale 1.0 to 1.1 (1s ease-in-out infinite)
2. Status text: Fade out old text (150ms), fade in new text (150ms), 100ms delay between
3. Progress bar: Smooth width transition (300ms ease-out per step)
4. Completion: Success checkmark with scale bounce (300ms spring) + brief confetti (600ms)

**Heart/Favorite Action:**

1. Click: Scale from 1.0 to 1.3 to 1.0 (300ms spring)
2. Color fill: Warm Terracotta fills from center outward (200ms ease-out)
3. Haptic feedback: Light tap (mobile only)
4. Undo: Reverse animation, color drains out (200ms ease-in)

**Page Transitions:**

1. Exit: Current page fades opacity to 0.8 and scales to 0.98 (200ms ease-in)
2. Enter: New page fades from 0 to 1 and scales from 1.02 to 1.0 (300ms ease-out)
3. Total transition: 300ms (100ms overlap)

**Modal Interactions:**

1. Entry: Backdrop fades in (250ms), modal scales from 0.95 to 1.0 with fade (300ms spring)
2. Exit: Modal scales to 0.95 with fade out (200ms ease-in), backdrop fades out (250ms)
3. Backdrop click: Modal shakes slightly (150ms) to indicate "not dismissible" if needed

## Accessibility

### Visual Accessibility

**Contrast Ratios:**

- Text on backgrounds: Minimum 4.5:1 (WCAG AA)
- Large text (18px+): Minimum 3:1
- UI components: Minimum 3:1
- Active/focus states: Enhanced contrast

**Color Considerations:**

- Never use color alone to convey information
- Always pair color with icons, text, or patterns
- Test with colorblind simulators (deuteranopia, protanopia, tritanopia)
- Error states: Red color + icon + explanatory text
- Success states: Green color + icon + confirmation text

**Focus Indicators:**

- Visible focus ring on all interactive elements
- **Style:** 2px solid Warm Terracotta, 2dp offset
- **Alternative:** Outline with background color change for complex components
- Never remove focus indicators (maintain for keyboard users)

### Motor Accessibility

**Touch Targets:**

- Minimum size: 44dp × 44dp (mobile), 40dp × 40dp (desktop)
- Spacing between targets: Minimum 8dp
- Large primary actions: 48dp+ height
- Icon buttons: 44dp × 44dp minimum

**Interaction Patterns:**

- No hover-only functionality (consider touch users)
- Avoid requiring precise timing or coordination
- Provide large, forgiving interaction areas
- Support multiple input methods (touch, mouse, keyboard)

### Keyboard Navigation

**Tab Order:**

- Logical, left-to-right, top-to-bottom
- Skip to main content link at page top
- All interactive elements reachable via Tab
- Modal focus trap (tab cycles within modal)

**Keyboard Shortcuts:**

- Common actions have shortcuts (document clearly)
- Escape key closes modals, dropdowns, expanded states
- Enter/Space activates buttons and toggles
- Arrow keys navigate galleries, carousels, lists

### Screen Reader Support

**ARIA Labels:**

- All icons have aria-label
- All images have meaningful alt text (or aria-label if decorative)
- Loading states announce via aria-live regions
- Form inputs have associated labels (not just placeholders)

**Landmarks:**

- Proper semantic HTML (header, nav, main, footer, aside)
- ARIA landmarks when semantic HTML insufficient
- Skip links for keyboard users

**Dynamic Content:**

- aria-live="polite" for status updates (e.g., "Design generation in progress")
- aria-live="assertive" for important alerts (e.g., errors)
- Loading states announce completion

### Cognitive Accessibility

**Clear Language:**

- Avoid jargon and technical terms
- Explain AI suggestions in plain language
- Use consistent terminology throughout app
- Provide examples when introducing new concepts

**Progressive Disclosure:**

- Don't overwhelm with options
- Reveal complexity gradually
- Allow users to explore at their own pace
- Provide "Learn more" links for deeper explanations

**Error Prevention & Recovery:**

- Validate inputs early with helpful messages
- Confirm destructive actions (delete, discard)
- Provide undo functionality whenever possible
- Save user progress automatically

**Consistency:**

- UI patterns behave the same everywhere
- Same action triggered by same gesture/click
- Predictable navigation structure
- Familiar interaction patterns

## Responsive Breakpoints

### Mobile First Approach

**Extra Small (xs): < 480px**

- Single column layout
- Simplified navigation (hamburger or bottom nav)
- Full-width images and cards
- Touch-optimized spacing
- Larger touch targets

**Small (sm): 480px - 767px**

- Still primarily single column
- Slightly increased margins (16dp → 20dp)
- 2-column galleries possible
- Bottom navigation preferred

**Medium (md): 768px - 1023px**

- Two-column layouts emerge
- Sidebar navigation option
- 2-3 column galleries
- More horizontal space for content

**Large (lg): 1024px - 1439px**

- Full multi-column layouts
- Sidebar navigation standard
- 3-4 column galleries
- Desktop-optimized spacing

**Extra Large (xl): ≥ 1440px**

- Max-width containers (1280dp)
- Centered content with generous margins
- 4+ column galleries
- Enhanced visual hierarchy

### Adaptive Components

**Navigation:**

- xs-sm: Bottom navigation or hamburger
- md: Hybrid (top bar + optional sidebar)
- lg-xl: Full sidebar + top bar

**Cards:**

- xs: Full-width, 16dp margins
- sm-md: Full-width or 2-column grid
- lg-xl: 2-4 column grid

**Images:**

- xs-sm: Full-width
- md: 2-column or full-width
- lg-xl: 3-4 column galleries, large hero images

**Modals:**

- xs-sm: Full-screen
- md+: Centered with max-width, rounded corners

## Design Patterns

### Image Upload Flow

**Pattern: Multi-Method Upload**

1. **Landing State:**
   - Large upload zone (240dp+ height)
   - Icon (64dp camera icon)
   - Primary text: "Upload a Room Photo"
   - Secondary text: "Drag and drop, or tap to browse"
   - Button: "Choose File" (mobile shows camera icon option)

2. **Drag Active State:**
   - Border changes to solid Warm Terracotta
   - Background lightens
   - Text updates: "Drop your photo here"
   - Slight scale animation (1.02)

3. **Upload In Progress:**
   - Preview thumbnail appears
   - Progress bar shows upload percentage
   - Cancel button available
   - Text: "Uploading your photo..."

4. **Upload Complete:**
   - Checkmark animation
   - Preview image full size
   - Edit/annotate options appear
   - CTA: "Generate Designs" button

### AI Processing Pattern

**Pattern: Transparent AI with Progress Indicators**

1. **Initiation:**
   - User clicks "Generate Designs"
   - Modal or full-screen overlay appears
   - Processing illustration begins animating

2. **Progress Steps:**
   - Step 1: "Analyzing room dimensions..." (0-25%)
   - Step 2: "Identifying current style elements..." (25-50%)
   - Step 3: "Selecting complementary colors..." (50-75%)
   - Step 4: "Generating design concepts..." (75-100%)

3. **Each Step:**
   - Animated icon representing current task
   - Progress bar updates smoothly
   - Text updates with each phase
   - Cancel option always available

4. **Completion:**
   - Success animation (brief confetti or checkmark)
   - Transition to results view
   - Text: "Your designs are ready! ✨"

### Design Exploration Pattern

**Pattern: Card-Based Browsing with Expandable Details**

1. **Grid View (Default):**
   - 2-4 design concept cards in grid
   - Each card shows: Large image, title, style tags, quick actions
   - Hover: Shadow increases, slight lift
   - Click: Expands to full view

2. **Full View (Expanded):**
   - Large before/after comparison
   - Design title and description
   - Expandable "Why this works" section
   - Style details (colors, furniture, layout)
   - Action buttons: Save, Share, "Try Variations"

3. **Variation Generation:**
   - "Try Variations" opens drawer from right
   - 3-4 variations shown as thumbnails
   - Click variation to swap into main view
   - Generate more variations option

4. **Comparison Mode:**
   - Select multiple designs (checkbox on each card)
   - "Compare" button appears
   - Side-by-side view of selected designs
   - Metrics comparison (budget, style match, complexity)

### Sharing Pattern

**Pattern: Modal-Based Sharing with Preview**

1. **Trigger:**
   - Share button/icon on design card or full view
   - Opens centered modal (640dp max width)

2. **Modal Content:**
   - Preview card: Image + title + "Designed with [App Name]"
   - Message field: Optional personal message
   - Platform buttons:
     - Pinterest (with custom pin description)
     - Instagram (copy + opens Instagram)
     - Direct link (copy link)
     - Email (opens email client)

3. **Share Action:**
   - Click platform button
   - Generating share link... (brief loading)
   - Success state: "Copied to clipboard!" or "Opening [Platform]..."
   - Modal auto-closes after 1 second (or stays open with "Close" button)

4. **Shared Design Landing Page:**
   - Public URL showcasing design
   - Before/after comparison
   - Basic design details
   - "Create your own design" CTA
   - Privacy controls for original user

### Onboarding Pattern

**Pattern: Minimal Progressive Onboarding**

1. **First Visit:**
   - Hero section with example before/after
   - Clear value proposition
   - Large CTA: "Get Started"
   - No account required to try

2. **First Upload:**
   - Contextual tooltip: "This is where you upload room photos"
   - Upload success → First-time tip: "Great! Now let's generate designs"
   - AI processing → Explain what's happening in real-time

3. **First Result:**
   - Celebrate the moment: "Look at this transformation! ✨"
   - Contextual tooltips on key features:
     - "Tap to expand and see details"
     - "Save designs you love"
     - "Try different variations"

4. **Account Prompt (Soft):**
   - After saving 2-3 designs: "Sign up to access your designs anywhere"
   - Benefits clearly stated
   - Option to skip (and prompt later)

### Save and Organize Pattern

**Pattern: Collections with Smart Auto-Categorization**

1. **Quick Save:**
   - Heart icon on any design card
   - Instant feedback (heart fills, brief animation)
   - Design saved to default "Saved Designs" collection
   - Toast notification: "Saved!"

2. **Organize into Collections:**
   - "Saved Designs" section in sidebar
   - Tab: "All" | "Living Room" | "Bedroom" | "Custom"
   - Auto-categorization by room type
   - Manual collection creation: "+ New Collection"

3. **Collection View:**
   - Grid of saved designs
   - Filter by style, color, budget
   - Sort by: Date saved, Most liked, Alphabetical
   - Bulk actions: Move, Delete, Share

4. **Collaboration (Future):**
   - Share collection with others (family, roommate)
   - Comment on designs within collection
   - Vote on favorites (for group decisions)

## Implementation Guidelines

### For Designers

**Design Files Organization:**

1. **Component Library:** Maintain single source of truth in Figma/Sketch
2. **Token System:** Use design tokens for colors, spacing, typography
3. **Responsive Variants:** Create mobile, tablet, desktop versions for key screens
4. **States:** Document all states (default, hover, active, disabled, error, loading)
5. **Documentation:** Include usage notes, do's and don'ts, edge cases

**Design QA Checklist:**

- [ ] All colors from defined palette
- [ ] All spacing uses 4dp grid system
- [ ] All typography matches defined styles
- [ ] All interactive elements meet minimum touch target sizes
- [ ] Contrast ratios meet WCAG AA standards
- [ ] Focus states defined for all interactive elements
- [ ] Error and empty states designed
- [ ] Loading states designed
- [ ] Responsive breakpoints considered

### For Developers

**CSS Architecture:**

```css
/* Use CSS custom properties for theming */
:root {
  /* Colors */
  --color-primary: #d4816d;
  --color-secondary: #8fa88e;
  --color-background: #f9f6f2;
  --color-text: #2d2d2d;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Typography */
  --font-family-primary: Inter, -apple-system, system-ui, sans-serif;
  --font-family-accent: 'Crimson Pro', Georgia, serif;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(45, 45, 45, 0.06);
  --shadow-md: 0 4px 12px rgba(45, 45, 45, 0.08);
  --shadow-lg: 0 8px 24px rgba(45, 45, 45, 0.12);
}
```

**Component Structure:**

```tsx
// Use composition for flexible, reusable components
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
}) => {
  const baseClasses = 'button';
  const variantClasses = `button--${variant}`;
  const sizeClasses = `button--${size}`;
  const stateClasses = disabled
    ? 'button--disabled'
    : loading
      ? 'button--loading'
      : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};
```

**Responsive Design:**

```tsx
// Use container queries when appropriate, fallback to media queries
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const DesignGrid = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const columns = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div
      className="design-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {/* Grid content */}
    </div>
  );
};
```

**Performance Considerations:**

- Lazy load images with intersection observer
- Use Next.js Image component or similar for optimized image delivery
- Implement virtual scrolling for long lists
- Code-split routes and heavy components
- Use React.memo for expensive re-renders
- Debounce search and filter inputs

### For Product Managers

**Feature Prioritization Framework:**

**P0 (Must Have - MVP):**

- Image upload and management
- AI design generation (basic)
- Design browsing and viewing
- Save designs
- Basic account creation

**P1 (Should Have - Post-MVP):**

- Design variations
- Before/after comparisons
- Style preferences
- Collections/organization
- Social sharing

**P2 (Nice to Have - Future):**

- Collaboration features
- Designer marketplace
- Shopping list generation
- 3D room visualization
- AR preview

**Success Metrics:**

1. **Activation:** % of users who upload first photo within 24 hours of signup
2. **Engagement:** Average designs generated per user per week
3. **Retention:** % of users returning 7 days after first visit
4. **Value:** % of users who save/share at least one design
5. **Growth:** Viral coefficient (shares per user)

**User Research Questions:**

- What's the primary goal when using the app? (Inspiration vs. concrete planning)
- What level of design knowledge do users have?
- What's the typical budget for room redesigns?
- Do users prefer aspirational or realistic design suggestions?
- What would make users trust AI design recommendations?

## Conclusion

This design system synthesizes best practices from five world-class platforms—Fey's trust through consistency, Grammarly's cognitive clarity, Patreon's warm accessibility, Plane's intelligent information density, and Seline's truth through simplicity—to create an interior design application that is:

- **Warm:** Earth tones, rounded forms, encouraging language
- **Simple:** Clear information hierarchy, progressive disclosure, generous whitespace
- **Clear:** Explainable AI, transparent processes, user control

Every design decision serves the core user need: transforming a house into a home through accessible, AI-powered interior design guidance. The interface gets out of the way, letting images of beautiful spaces inspire and empower users to create the homes they've always imagined.

---

**Document Version:** 1.0
**Last Updated:** 2025-10-26
**Maintained By:** Design Team
