# MYR Advance Solution — Complete Website Analysis (Source of Truth Audit)

- **Source:** https://www.myradvancesolution.com/
- **Platform:** WordPress + Elementor + WooCommerce + WPForms (All in One SEO Pro)
- **Audit date:** 2026-10-22
- **Raw capture:** `/tmp/myr/html/*.html` (56 routes, 18 MB)
- **Extracted manifests:** `audit/pages/<route>.md` (content) + `audit/pages/<route>.links.md` (links/CTAs/forms/images)
- **Machine inventory:** `audit/inventory.json`

---

## 1. Business Identity

| Field | Value |
|---|---|
| Company | MYR Advance Solution / MYR Advance Solutions Private Limited (PVT. LTD.) |
| Tagline | IT Products. Solutions. Services. / "IT & Digital Solutions Provider" |
| Founded | 2016 (as MYR Network Security Solution; rebranded MYR Advance Solution Pvt. Ltd. in 2018) |
| Founders | Akhtar Waquar (with co-founders Sabah Akhtar, Mohammad Tauhid, Akhtar Arif) — from About timeline |
| Sales phone / WhatsApp | +91 7408443341 (wa.me/+917408443341) |
| Support email | support@myradvancesolution.com |
| Press | press@myradvancesolution.com |
| Abuse | abuse@myradvancesolution.com |
| Account recovery | account-recovery@myradvancesolution.com |
| Live chat | https://1367.3cx.cloud/myradvancesolutionpr (support), /myrsolution (sales), /eli (abuse report) |
| CRM signup | https://app.jetcrm.in/register/myrsignup |
| Legacy plan checkout | Old external destinations were removed; current plan buttons route to the contact form. |
| Socials | Facebook /myrnetwork · Instagram /myr_solution/ · LinkedIn /in/myr-advance-solution-04b1151a6/ · X /myrnetwork · WhatsApp |

**Office locations (exact source text preserved):**
1. Lucknow, INDIA — TC 14, 3rd Floor Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010
2. Jubail, Saudi Arabia — Gulf Support Contarcting Est. , 8616 – Al Safat Dist, Unit No. 9006 Al Jubail 35514 – 4297
3. Dammam, Saudi Arabia — Gulf Support Contarcting Est. , 12th Street – Dammam 2nd Industrial City P.O. Box 34508
4. Dubai - United Arab Emirates — The Dome Tower, Cluster N – Jumeirah Lake Towers

---

## 2. Verified Route Inventory (56 routes)

### 2.1 Marketing pages (public, fully verifiable)
| Route | Title (source) | Key content |
|---|---|---|
| `/` | MyR Advance Solution \| IT & Digital Solutions Provider | Homepage (canonical) |
| `/myr/` | same as `/` | Exact duplicate of homepage |
| `/services/` | IT & Digital Services by MYR Advance Solution | Services hub |
| `/website-development/` | Website Development Services – Custom, Fast & SEO-… | Web dev + 3 pricing plans |
| `/crm-development/` | CRM to Boost Sales and Convert Leads from Your Phone | CRM dev service |
| `/digital-marketing/` | Digital Marketing | DM service + plan pricing (Standard/Pro+/Custom) |
| `/network-solution/` | Comprehensive IT Infrastructure Services for Your… | Networking service |
| `/ipbx-solution/` | PBX System Solutions for Business Communication | IPBX service + pricing |
| `/cctv-solution/` | cctv solution | CCTV service |
| `/1800-number/` | 1800 NUMBER | Toll-free + WhatsApp API service |
| `/privyr/` | Best Mobile CRM for Lead Management & Sales Automa… | Privyr mobile CRM landing |
| `/about-us/` | About Us | Company story, timeline 2016–2024, team, values |
| `/roadmap/` | Roadmap | Knowledge/roadmap (search + content) |
| `/contact-us/` | Contact Us | Contact options, 4 offices |
| `/talk-to-sales/` | Talk to sales | Sales consultation form |
| `/booking/` | Booking | Amelia booking plugin (client-rendered, unverified UI) |
| `/how-we-help-your-business/` | How we help your business | Support/help content + search |
| `/our-products-benefit/` | Our Products Benefit | Product benefits content |
| `/knowledge-base/` | Knowledge Base | H1 + plugin content (client-rendered) |
| `/lets-keep-in-touch/` | Let's Keep In Touch | Newsletter/keep-in-touch |
| `/evercompare/` | EverCompare | `[evercompare_table]` shortcode (client-rendered) |
| `/not-found/` | not found | 404 page (also used by `/services/web-development/`) |

### 2.2 Store (WooCommerce)
| Route | Notes |
|---|---|
| `/tech-store/` | Main store; categories, banners, product grid, deals |
| `/shop/` | Store variant (same title, form posts to /tech-store/) |
| `/product/website-development/` | Variable product (plan attribute), from ₹14,499 (store shows ₹11,988 on banner — flagged) |
| `/product/newbiz-essentials/` | ₹30,000 → ₹14,499, SKU MYR-IT-254341TS |
| `/product/revampcommerce-lite/` | ₹60,999 → ₹24,499 (verify price from manifest) |
| `/product/elitecustom-suite/` | ₹75,000 → ₹59,499 |
| `/product/digital-marketing/` | Variable (pick-version, choose-plan attributes) |
| `/product/myrlink-ip-pbx-ip100-v3/` | ₹150,000 → ₹65,499, SKU MYR-IT-254301TS, 1 review |
| `/product-category/website-development/` (+ `/website/`, `/website-design/`) | 3 website categories |
| `/product-category/digital-marketing/`, `/ip-pbx/`, `/it-products/`, `/pbx/` | Category archives |
| `/cart/` | WooCommerce cart |
| `/checkout/` | WooCommerce checkout (title quirk: shows "Cart") |
| `/my-account/` | Login / Register / lost-password |

**add-to-cart IDs verified:** 2765, 2766, 2767 (website plans), 2773–2776 (DM?), 3056 (IP PBX), 5085, 5088, 5090.

### 2.3 Login-gated panel pages (shortcode UI unverified — rebuild as demo shell)
| Route | Shortcode | Visible chrome |
|---|---|---|
| `/crm-dashboard/`, `/my-leads/`, `/crm-reports/`, `/crm-tasks/`, `/my-profile/`, `/import-leads/`, `/crm-login/`, `/team-chat/` | `[lfcrm_dashboard]`, `[lfcrm_leads]` etc. | "Team Task & Appointment Panel" + sidebar: Dashboard / My Leads / Reports / My Profile |
| `/team-panel/` | lfcrm variant | "Team Task & Appointment Panel" (duplicate H2) |
| `/customer-panel/` | lfcrm variant | "Customer Appointment Panel" |

### 2.4 Legal / policy
`/privacy-policy/` (10 sections), `/shipping-policy/` (9), `/terms-and-conditions/` (17+), `/refund-and-return-policy/` (9), `/refund-request-form/` (12-field WPForm).

---

## 3. Global Information Architecture

### 3.1 Primary header (homepage header)
Home · Launch Your Website → `/website-development/` · All-in-One Lead CRM → `/privyr/` · Smart IPBX Solutions → `/ipbx-solution/` · Contact Us → `/contact-us/` · **All Services** (off-canvas panel) · Cart `₹0.00 (0)` · Logo → `/`

**Off-canvas "Our Core Services" panel** links: Web Development (badge: Featured), CRM Development, Digital Marketing, Networking Solution, IPBX Solution, CCTV Solution (badge: Book Now), Toll-Free 1800 XXX 8899 Number. Socials: Facebook, Instagram.

### 3.2 Alternate header (Elementor header used on inner pages)
Logo · Shop icon → `/tech-store/` · popup toggle (id 2975 = Login/Register) · Cart ·
Nav: Home · Shop · Launch Your Website · All-in-One Lead CRM · **All Services ▾** (Digital Marketing, Scalable IPBX Systems, CCTV Solution & Installation, Get Your 1800 Number) · Contact Us · Log In

Above-header strip on homepage: Arabic basmala `(بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ) (ماشاء الله لا ولا قوة إلا بالله)` — appears also above "Our Core Services" section.

### 3.3 Global popups (Elementor popup IDs → rebuild equivalents)
| ID | Purpose | Trigger |
|---|---|---|
| (off-canvas) `c98801` | All Services off-canvas | "All Services" button |
| `2975` | **Login / Register** (WooCommerce auth: username/password + remember me, lost password; register: email only) | "Log in", "My Account", contact page "Log in" |
| `2107` | "read more" — Who We Are expansion (About page) | read more link |
| `3175` / `3195` | "Schedule an Appointment with Our IT Pro" / booking popups | Services + service pages |
| `4499` | **Partner with Us & Earn 40%** form (footer "Partner with Us") | Footer |
| `5180` | Secondary popup (unknown content — unverified) | header toggle |

### 3.4 Footer (every page)
- Logo → `/`, brand blurb ("We Can Take Your Business To The Next Level. Elevate your business with our comprehensive suite of IT services and solutions, encompassing IPBX systems, CCTV security, computer networking, CRM development, digital marketing, website development and design, billing solutions and more.")
- Socials: Facebook, Instagram, Linkedin, Whatsapp, X-twitter
- **Quick Links:** Home, Shop Page (`/tech-store/`), Services, Privacy Policy, Shipping Policy, Terms & Conditions, Refund & Return Policy
- **Services:** Web Development, CRM Development, Digital Marketing, IPBX Solution, CCTV, Toll Free 1800 XXX -, More (`/services/`)
- **Company:** About Myr Advance Solution, Roadmap, Contact Us, Talk to sales, Partner with Us (popup)
- `[lsft_horizontal_flags]` shortcode — country/language flags strip (unverified rendering)
- Copyright: "© 2016-2025 myradvancesolution.com - Premium website development, CRM, IP PBX & telephone system and More"

### 3.5 Global "Partner with Us" form (footer popup, on every page)
Heading: **Partner with Us & Earn 40% Profit Today!** + paragraph (earn up to 40% revenue promoting IT services…) + 4 bullets (Earn 40% revenue on every successful sale / Access to premium marketing resources and training / Dedicated partner support for smooth collaboration / Expand your business network and customer base.)
Fields: Your Name*, Email*, Contact Number*, Business Name, Complete Address, Number (Optional) Email(?), Services You Are Interested In (checkboxes: Website Development, CRM Solutions, IT Infrastructure, Digital Marketing, Toll-Free Numbers, Cloud Telephony Systems, CCTV & Security, Other), Your Location (City/State)*, Message/Additional Details (Optional), Submit.

### 3.6 Recurring section components
- **"Here to help 24/7"** support block (CTA → 3cx chat) — on services + most service pages
- **FAQ accordion** (5 standard FAQs) — homepage, services, website-development (its own FAQ set)
- **Stats counters** (Team Member, Efficiency, Happy Clients, Countries — animate from 0)
- **Partners logo marquee** (15 brand logos: Time Attendance, Restaurant Billing, POS, Lenovo, Keyboard/Mouse, HP, Hikvision, Grandstream, D-Link, Dell, CP Plus, CCTV, Belden, Avaya, Thermal Printer)
- **Featured Client Stories** (4 testimonials: Dr. Prabhat Tripathi, Abhishek Khare, Mohammad Ali Khan, Riya Tiwari) + "9,000+ customers worldwide" claim
- **Pricing block "Pick Your Perfect Plan"** (NewBiz ₹14,499 / RevampCommerce ₹24,499 MOST POPULAR / EliteCustom ₹59,499) with Choose plan → `checkout/?add-to-cart=ID`
- **"GET IN TOUCH" CTA strip** → contact page

---

## 4. Page-by-Page Section Manifests (summary; full text in `audit/pages/`)

### 4.1 Homepage `/` (sections in order)
1. Header (primary variant) + off-canvas All Services
2. Hero: "IT Products. Solutions. Services." + company paragraph + **Shop Now** → `/tech-store/` + hero image
3. Animated stats: Team Member / Efficiency / Happy Clients / Countries
4. Basmala strip + "Our Core Services" (7 service cards, some with "UPTO 60/70% OFF" badges) + IPBX/IT-expert images
5. "Who We Are" / "What We Can Do for You" + **Contact Us Now**
6. "About our mission, values, and commitment" (Mission / Values / Commitment bullets) + **Know More** → about
7. "Exclusive Website Pricing — Pick Your Perfect Plan" (3 plans, Save 51%/60%/20%) + View all features → `/website-development/#viewallfeatures`
8. GET IN TOUCH strip → contact
9. Partners marquee (15 logos) + quote
10. Featured Client Stories (4 cards + Read more stories)
11. FAQs (5 questions, accordion)
12. "Unlock the Ideal Solution…" + "Here to help 24/7" + **Got Questions? Chat Now!** → 3cx
13. CTA band: "Save up to 60% on Website development plan + get a free domain" + 30-day money-back + **Get Started** → anchor `#E-Commerce`
14. Footer + global popups

### 4.2 `/services/`
Core Services (7 cards + "Schedule an Appointment with Our IT Pro" popup) → stats (Team Member/Total Project/Happy Clients/Countries) → mission/values (variant copy, differs from homepage — preserve) → FAQ (5, wording differs slightly from homepage: "How work the support policy?", "Within 72 Hours") → Unlock CTA + Here to help 24/7 → footer.

### 4.3 `/website-development/`
Hero "Grow Your Brand with Expert Website Development + Marketing Solutions" → pricing (3 plans: NewBiz ₹14,499 save 51%, RevampCommerce ₹24,499 save 60 MOST POPULAR, EliteCustom ₹59,499 save 20; renewal notes ₹599/₹1649/₹2499 per mo) → **#viewallfeatures** comparison table → "Included with every plan" (5 features) → testimonials (Rohan Malhotra, Ananya Desai, Vikram Singh + 3 story cards: Amit & Neha Khanna, Rajesh Verma, Priya Sharma) → "Trusted by 3K+ website owners" → FAQs (6 questions) → support 24/7 → footer.

### 4.4 `/crm-development/`
"Your Business, Your CRM – Tailored for Success." → "Our Approach to CRM Development" (5 items: Understanding Your Business / Customization at Its Best / User-Friendly Interface / Scalable and Secure / Ongoing Innovation) → "Crafting Custom CRM Solutions…" process (Consultation & Requirements Gathering / Design & Prototype / Development & Customization / Testing… + more) → jetcrm Sign Up CTA → form → footer.

### 4.5 `/digital-marketing/`
Hero "Digital Marketing Solutions to Drive Growth and Results" → intro (At MYR ADVANCE SOLUTION PVT. LTD.) → "Our Digital Marketing Services" (SEO, Digital Community (Account Handling), Digital Community Page Post Design and Posting, Lead Generation, Ads Campaign Design) → "Why Choose us ?" (share-to-Twitter CTAs present) → pricing **Pick Your Perfect Plan** two groups: Standard ₹25000/mo → ₹7999, Pro+ ₹35000/mo → ₹16999, Custom Plan; and Standard → ₹6999, Pro+ → ₹14999, Custom Plan (preserve exactly, flag duplicate-price confusion) → Here to help 24/7 → footer.

### 4.6 `/network-solution/`
Hero "Seamless IT Infrastructure & Network Solutions for Unmatched Connectivity" → intro → "Our IT Infrastructure & Network Solutions Include:" (IT Infrastructure Management, Network Design & Implementation, Managed Network Services, Wireless Network Solutions, Security Solutions, + more) → Why Choose us → Success stories → Here to help 24/7 → footer.

### 4.7 `/ipbx-solution/`
Hero "Your All-in-One Telecommunication Solution: Scalable, Reliable, and Future-Ready" → Key Features ("Not only IP PBX…") → Unified Communication / Call Routing & Management / Multi-site Deployment / VoIP Technology / Advanced IVR / Scalable Solution → Benefits → pricing (₹65,499 / ₹95,499 crossed prices present) → "Our Success Stories Speak for Themselves" → Here to help 24/7 → footer.

### 4.8 `/cctv-solution/`
H1 "cctv solution" + CCTV service sections + booking/appointment popup CTA + Book Now badges → footer. (See manifest for full text.)

### 4.9 `/1800-number/`
H1 "1800 NUMBER" + toll-free/WhatsApp API service content + lead form (WPForm: name/email/phone/company/requirements + services checkboxes) → footer.

### 4.10 `/privyr/`
"Transform Your Leads into Loyal Clients, Right from Your Phone" → audience tabs (Real Estate Agents, Financial Advisors, Trainers & Coaches, Marketing Agencies, Direct Sales Agents, Wedding Planners) → stats (Trusted by over 250,000 businesses across 100+ countries; 250,000 / 100+ / 100 Million / +300%) → feature blocks → "Ready to get started?" → plan enquiries route to the contact form → form → footer. **Flag:** 250,000 vs homepage 9,000+ customer claims coexist — preserve both.

### 4.11 `/about-us/`
"Advancing Technology, Enhancing Businesses" → Our Journey (2016 founding text) → Who We Are (+ read more popup 2107) → Timeline 2016–2024 (9 milestones) → Our Strengths (6 tabs w/ descriptions) → Thousands of satisfied customers (3 testimonials: Rakesh Kumar, Sneha Kapoor, Dr. Kavita Rao) → Here to help 24/7 → Our Values → Our Team (3: Rakesh Kumar?, Sneha Kapoor, Dr. Kavita Rao — see manifest) → Our Products and Services → Our Commitment → Looking Ahead → footer.

### 4.12 `/contact-us/`
"Less Waiting. More Solutions." → How can we assist you? (Chat with Customer Support Team [login popup], Sales inquiry → talk-to-sales, Media (PR) press@, Report abuse abuse@ + 3cx/eli, Lost access → account-recovery@) → Find Out More (4 links) → Our office locations (4 offices w/ map) → footer. **Note:** page contains a WPForm (fields 1-8, same as global contact form) — see `.links.md`.

### 4.13 `/talk-to-sales/`
"Discover Your Ideal IT and Security Solution with a Personalized Consultation!" + WPForm (fields 6,7,1,2,4,8,10,9 — name/email/phone/company/service/…) → footer.

### 4.14 Store `/tech-store/` (and `/shop/`)
Category nav (Website Development, PBX, IT Products, IP PBX Solution, Digital Marketing) → search + cart → hero slider banners ("Transforming Your Vision into a Digital Reality…", "Your Business, Your CRM…", "Digital Marketing Solutions…", "Your Business, Connected: Advanced IP PBX…") → promo banners ("UP TO 70% OFF DEAL" ₹30,000→₹11,988 BUY NOW add-to-cart=2765; "Purchase Today, Go Live Tomorrow – Websites Ready in 24hrs"; "Streamline Your Calls…" ₹150,000→₹65,499 add-to-cart=3056; "Buy MYRLINK IPPBX Now…") → category tiles (Digital Marketing, CCTV Solution, Network Product → /product-category/networking-devices/ [404-flag], PBX & IP Telephone) → product grid (Website Development From ₹14,499, NewBiz, RevampCommerce, EliteCustom, Digital Marketing, MYRLINK IP PBX) → footer.

### 4.15 Product page anatomy (all 6)
Gallery (1–4 images) → title → price (sale: original struck + current) → quantity stepper → **Add to cart** + **Buy Now** → short description → SKU → Categories links → **Product Information tabs:** Description | Additional information | Reviews (n) [review form: rating/comment/author/email] → Related products → You may also like… → footer.

### 4.16 Cart / Checkout / My Account
- `/cart/`: WooCommerce cart table (add-ons, quantity, totals), "Proceed to checkout", empty-cart message variant.
- `/checkout/`: billing details form (first name, last name, company, country, street, city, state, postcode, phone, email), order notes, PayU hosted checkout when merchant credentials are configured, "Place order".
- `/my-account/`: Login (username/password/remember/lost password) + Register (email) tabs, plus dashboard when authed (unverified).

### 4.17 Policies
Standard 4 policy pages — verbatim section text in manifests. `/refund-request-form/` — 12-field WPForm (order info, reason, attachments…). Support policy claims appear inside FAQ (homepage vs services variants differ — preserve per page).

### 4.18 Panel pages (demo rebuild)
Shell: "Team Task & Appointment Panel" (or "Customer Appointment Panel") + sidebar nav (Dashboard, My Leads, Reports, My Profile) + shortcode area → **rebuild as demo UI** (decided by owner): Dashboard stats widgets, Leads table, Reports charts, Profile form, Tasks, Import Leads, Team Chat, Team Panel, Customer Appointment Panel, CRM Login. Must be labeled demo.

---

## 5. Interaction / Link Inventory

- **Commerce:** add-to-cart query URLs (`/checkout/?add-to-cart=ID&quantity=1`), cart drawer `₹0.00 (0)`, quantity steppers, variation dropdowns (`attribute_plan`, `attribute_pick-version`, `attribute_choose-plan`), Buy Now, reviews form (`/wp-comments-post.php`).
- **Auth:** login/register popup forms (WooCommerce nonce — rebuild client-side demo auth), lost password → `/my-account/lost-password/` (route not in sitemap — flag).
- **Forms (WPForms):** partner popup (global), contact, talk-to-sales, 1800-number, refund-request-form, crm-development (extended fields 11 + page meta), privyr (3-field signup), services (8-field), + per-page duplicates on nearly all pages. Rebuild as one reusable Form component with per-page field config; submission = client-side validation + success state (no server endpoint — **unverified backend**).
- **Search:** GET `/?s=…&post_type=` on several pages (search widget in header of store/404 pages).
- **Chat:** 3 external 3cx links (support/sales/abuse).
- **Popups:** off-canvas menu, login/register, read-more, appointment, partner form, unknown 5180.
- **Anchors:** `#viewallfeatures`, `#E-Commerce`, tab anchors `#tab-description` etc.
- **Social share:** twitter intent links (digital-marketing, network pages).
- **Dead links to preserve-or-flag:** "Read the full story" → `#`, "Read more reviews" → `#`, "Get Started" → `#E-Commerce`, some `[](https://…)` empty-text links.

---

## 6. Asset Inventory (representative; hot-link originals or download)
- Logos: `MYR-e1709294854593.png`, `MYR-LOGO.png`, `MYR-ADVANCE-SOLUTION.png` (270×79)
- Hero: `website-front-hero-image.png` (2000×1333), `it-expert-2.png`, `ipbx-768x644-1.png`, `buy-toll-free-number-768x644-1.png`
- People: `Prabhat-Tripathi.jpeg`, `Abhishek-Khare.jpg`, `male-icon.jpg`, `female-icon.jpg`, `sales-support-girl.png`, `Live-Support-Chat.png`
- Product: `ip-pbx-1.png`, `myrlink-ip-pbx.png`, `website-development.jpg`, `ai-design.jpg`, `website-expert.jpg`
- 15 partner logos under `/wp-content/uploads/2024/08/buy-*.png`
- (Full list per page in `audit/pages/*.links.md`)

---

## 7. Flags for Owner Review (do not silently fix — preserve until approved)

1. **Support response-time contradictions:** homepage FAQ "within minutes / 24 hours email"; services FAQ "Within 72 Hours"; "Here to help 24/7" blocks say "under a few minutes" (homepage) vs "under 2 minutes" (services).
2. **Customer-count claims differ:** homepage "9,000+ customers worldwide" vs Privyr "250,000 businesses / 100+ countries".
3. **Website plan price mismatch:** homepage pricing ₹14,499 vs store promo banner ₹11,988 (both link add-to-cart=2765).
4. **Digital marketing plans** show two different price groups (₹7999/₹16999 and ₹6999/₹14999) with same Standard/Pro+ labels.
5. `/checkout/` page `<title>` = "Cart"; `/shop/` vs `/tech-store/` duplicate; `/myr/` duplicates `/`.
6. `/services/web-development/` returns 404 content.
7. Store link → `/product-category/networking-devices/` (category not in sitemap — likely 404).
8. Typos preserved: "Contarcting" (offices), "needS"/"we" (homepage), "Intregation", "How work the support policy?", "How can send a refund request?".
9. Testimonial/story links `#` are dead in original.
10. `[lsft_horizontal_flags]` (language flags) and `[evercompare_table]`, `[lfcrm_*]`, Amelia booking = plugin content, client-rendered/unverified.
11. Copyright says "2016-2025" though audit year is 2026.
12. Support hours claim "Mon-Fri 10 AM to 6 PM" vs "24/7" headline (coexisting claims — preserve).
13. `/cctv-solution/` and `/1800-number/` contain **only an H1 + WPForms 4500** in source (verified byte-identical live fetch). Supporting lines on the rebuild ("Seamless Communication with 1800 Toll-Free & WhatsApp API Solutions." etc.) are the exact homepage/services *card* wording for those routes; nothing else exists to show.
14. IPBX page shows three price strings for product 3056 on one page: "₹ 65,499 .00" (hero/pricing), "₹ 95,499 .00" (struck), and malformed "₹ 65,499.00 .00" (sic) — all preserved exactly.
15. Privyr pricing differs by viewport in source: desktop/tablet widget ₹1,599/month + ₹1,439/month annual (CTAs c4ZG37v/BRYPjee) vs mobile-only widgets ₹1,449/month + ₹1,305/month annual (CTAs c4ZG37v/o8XYLr6j) — both rendered at their source breakpoints.
16. Network page "Book Free Consultation" → `#dm` — no `id="dm"` exists on the page (dead anchor in original).
17. `/network-solution/` and `/ipbx-solution/` have **no h1** in source (start at h2); rebuild renders the identical heading text as h1 for SEO (structure only — wording unchanged).

---

## 8. Unverified Items (recorded, not fabricated)

- Login-gated CRM shortcode UIs (all `/crm-*`, `/my-leads`, `/import-leads`, `/team-*`, `/customer-panel`, `/my-profile` inner content).
- Amelia booking calendar UI on `/booking/`.
- EverCompare comparison table rows.
- Knowledge Base articles.
- Real WooCommerce checkout gateways, order endpoints, account dashboard.
- WPForms server-side storage/notifications.
- Recurring Privyr plan purchases are not configured for online checkout; plan buttons route to sales contact.
- `[lsft_horizontal_flags]` rendering.
- `/my-account/lost-password/` page (linked, not in sitemap).
- Post `/myr/` blog content (duplicate of home).
