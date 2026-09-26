# Icon Academy website guide

The site is a static React/Vite project. It needs no database or backend and is ready for Vercel.

## Logo and brand colours

The official logo is stored at `public/images/icon-academy-logo.png`. Keep that filename when replacing it so the header, hero, footer and favicon update together.

The website colour palette is defined at the top of `src/styles.css`. Its primary colours are academy blue (`#073f8c`) and academy red (`#9e1720`), supported by white and pale blue/red backgrounds.

The header theme switch is available on the homepage, computer-courses page and team page. Dark mode is the default for new visitors, while a visitor's manual light/dark choice is saved in the browser. Dark-theme styles and colours are defined near the end of `src/styles.css`; the shared switch component is `src/ThemeToggle.jsx`.

## Update academy details

Edit `src/content/siteContent.js`. The `academy` object holds contact details, while `socialLinks` holds every social profile. Facebook, YouTube, TikTok and LinkedIn are connected; replace the remaining example Instagram URL with the academy's exact URL before launch.

The homepage Facebook section uses Meta's public Page Plugin, so new public Facebook posts can appear without a backend or a manual website update. If Facebook blocks the feed because of visitor privacy settings, the “Open our Facebook page” button remains available.

The `globalPartner` object controls the CWN Solutions career-partner section, including its logo, LinkedIn URL, Code With Naqvi YouTube channel, description and highlights. The official vector logo is stored at `public/images/cwn-solutions-logo.svg`.

## Update the leadership team

The dedicated leadership page is available at `/our-team`. Its profile cards are controlled by the `teamMembers` array in `src/content/siteContent.js`. Edit each member's name, designation, description or image path there.

Team photos are stored in `public/images/team`. Keep the existing filenames when replacing a photo, or update the matching `image` path in `teamMembers`. The optional `imagePosition` value controls how a portrait is cropped inside its card.

## Computer courses page

The dedicated course catalogue is available at `/computer-courses`. Edit `computerCourses` and `courseContacts` in `src/content/siteContent.js` to update course topics, durations, fees, instructor details or WhatsApp numbers.

The official campus address and Google Maps directions URL are stored in the `academy` object in the same file. The directions link appears on both the homepage and computer-courses page.

The original brochure is stored at `public/images/computer-courses-brochure.png` and is linked from the course page.

## Online tutoring page

The online teaching page is available at `/online-tutoring`, with links in the homepage, desktop/mobile navigation and footer. Edit `onlineTutoring` in `src/content/siteContent.js` to update its introduction, class groups and joining steps. Online course titles, descriptions, categories, logos and topics use the existing `computerCourses` list. The online page leads with courses; category buttons filter the catalogue, and school tutoring appears below it. Enquiries go to `academy.whatsappNumber`; online fees and timings are confirmed through WhatsApp.

## Publish a blog or news item

1. Open `src/content/siteContent.js`.
2. Copy one object inside the `articles` array.
3. Change its `slug`, category, date, title, excerpt, image and body.
4. Commit and push the change to GitHub.

Once the GitHub repository is connected to Vercel, every push triggers a new deployment. Each article has a shareable URL in the form `/blog/your-slug`.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel choose **Add New → Project** and import the repository.
3. Keep the detected Vite settings: build command `npm run build`, output directory `dist`.
4. Deploy. The included `vercel.json` makes direct blog URLs work after refresh.

## Optional next step

When non-technical staff need to publish without editing code, connect a Git-based CMS such as Decap CMS or move the content to a hosted CMS. The current setup intentionally stays backend-free and simple.

## Review slider

`src/Testimonials.jsx` displays only `testimonials` entries with `isSample: false`. Replace sample entries with authentic feedback before changing this flag. The section stays hidden when no real entries are present. The slider supports touch scrolling, arrow buttons and keyboard arrows.

For YouTube feedback, preserve the public author name and actual comment, use `rating: null`, and add `sourceLabel: 'YouTube comment'` and a `sourceUrl` pointing to the original comment. Do not invent star ratings or describe channel viewers as academy students without evidence.
