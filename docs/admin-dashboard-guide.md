# Admin dashboard guide

This guide explains how to update the Shoot At Sight Weddings website through the admin dashboard. It is written for everyday editing; no coding is needed for the controls described here.

## 1. Open the dashboard

1. Open the website's admin address supplied by the site owner and sign in with your admin account.
2. The dashboard has a row of main tabs. Select a tab to manage that type of content.
3. In **Site Editor**, choose a page tab, make your changes, then use the save button for that page or section.

The dashboard displays a success or error pop-up after most save, upload, publish, and delete actions. Wait for the success message before leaving the page. If an error appears, keep your edits on screen, correct the issue if you can, and try again. A delete action asks for confirmation because deleted content or images may not be recoverable.

## 2. Which tab controls what?

| Dashboard tab | What it manages |
| --- | --- |
| **Services & Locations** | Dedicated service and location landing pages, their content, FAQs, and whether each page is published. |
| **Archives List** | Existing wedding/event stories, their cover images, photo galleries, descriptions, and case-study details. |
| **Publish New Story** | Creates a new story archive and uploads its cover and gallery photos. |
| **Blog Articles** | Lists existing blog posts so they can be edited or deleted. |
| **Write Blog Post** | Creates and publishes a blog post. |
| **Testimonials** | Lists client testimonials for editing or deletion. |
| **Add Testimonial** | Adds a new client testimonial. |
| **Site Editor** | Edits the Home, Films, About, Contact, FAQ, and Portfolio page copy and media. |

The website's **Recent Captures** section on the home page is intentionally limited to the six newest story archives. Adding more stories to **Archives List** keeps them available in the portfolio and their own story pages without crowding the home page. The dashboard does not provide a separate switch to choose which six appear: it uses the newest six.

## 3. Publish a new story archive

Use **Publish New Story** for a wedding, pre-wedding, portrait, or other event story.

1. Enter **Couple Names (Title)**, **Location**, **Date**, and **The Narrative Story**. These are required. Use a clear title and a readable date such as “Jan 2026.”
2. Choose a **Category** from the list.
3. Under **Search appearance and accessibility**, you may add an SEO title, search description, and canonical URL. These fields are optional. They influence how the page may appear in search results; they do not change the story photos.
4. Add a **Cover image description**. This is required when creating a story and helps visitors using screen readers understand the cover photo.
5. Choose a **Hero Cover Image (Card Thumbnail)**. This is the main image used to represent the story in cards and previews.
6. Add gallery images either with **Choose individual photos** or **Choose a photo folder**. A folder lets you select the event's image folder in one step. Up to 50 images can be uploaded at once, with a 20 MB limit per image. If there are more than 50, split them into batches.
7. Gallery photo descriptions are optional. Add a short, accurate description where useful; they help screen readers and search engines understand the pictures.
8. Optional case-study fields include a narrative, a short results summary, and a client quote. Use a client's quote only with their permission. If a testimonial already exists, you can select it to fill the quote fields.
9. Select **Publish Story Archive** and wait for the success pop-up.

### Edit a story and its gallery

1. Open **Archives List** and find the story card.
2. Choose **View Live** to preview the public story page, or **Edit Gallery** to edit it.
3. In the edit panel, update the story details and photo descriptions, then select **Save descriptions and case study**.
4. To add more photos, select individual images or a folder. The same limit of 50 images per upload and 20 MB per image applies.
5. To remove a photo, use its remove control and confirm. Removing a gallery photo permanently deletes that image from storage.
6. To remove the complete story, choose **Delete** on its card and confirm. This is destructive; check the title before confirming.

## 4. Blog articles

### Write a post

1. Open **Write Blog Post**.
2. Enter an **Article Title**, choose a **Tag / Category**, and write **Article Content**. Separate paragraphs with a blank line.
3. Choose a cover photo. The cover image is uploaded to the site's image storage and previewed in the form.
4. Optional search fields include an SEO title and description, a canonical URL, and author details. A blank author name uses the studio name. Use the image description field for accessible cover-photo text.
5. Select **Publish Blog Article** and wait for the success pop-up.

### Edit or delete a post

Open **Blog Articles**, then choose **Edit Article** to change a post or **Delete** to remove it. Review the title before confirming deletion.

## 5. Testimonials

### Add a testimonial

1. Open **Add Testimonial**.
2. Enter the **Number** to control its display order (for example, 01), **Couple Names (Author)**, **Wedding Event Title (Location)**, and the client quote. These fields are required.
3. **Editorial Tags** are optional; separate multiple tags with commas.
4. Select **Publish Testimonial** and wait for the success pop-up.

### Edit or remove one

Open **Testimonials** and use **Edit** or **Delete** on the relevant card. Obtain the client's permission before publishing their words or identifying details.

## 6. Services & Locations pages

This tab creates and manages individual landing pages for services or places the studio serves. These are separate pages, not the home page's Services section.

1. Choose **Create page**, or choose **Edit** next to an existing page.
2. Select **Page type**: Service or Location.
3. Enter a **URL slug** using lowercase words and hyphens, such as `wedding-photography-bangalore`. The slug becomes part of the page address. When editing an existing page, keep its slug to preserve existing links; changing it creates a separate page.
4. Add a **Page title** and the page content. Separate paragraphs with a blank line.
5. Optionally add an SEO title/description/canonical URL, city or locality, a public hero-image URL, and a hero-image description.
6. Add visitor questions if needed. Each question and answer is required once a question is added. Use **Add question** or **Remove question** to manage them.
7. Check **Published** to make the page public. Uncheck it to keep the page as a draft/hidden page.
8. Choose **Save page**. The dashboard reports that a rebuild and deployment are needed to refresh prerendered search content. This means the saved page data is stored, but its search-engine HTML may not refresh until the site is rebuilt and deployed by the site maintainer.

## 7. Site Editor pages

Use **Site Editor** for the copy and media already wired to the main public pages. Changes are saved by section or page; the save button for one section does not save unsaved edits in other sections. Save each section after editing it.

### Home page

The home page editor is divided into six saveable sections:

1. **Hero Header** — mobile and desktop video URLs, the two lines of headline text and their highlights, and a fallback background image. Video links should be public direct video URLs. The fallback image is used when the video cannot be shown.
2. **About Philosophy** — section tagline and heading, introductory and body paragraphs, two statistics and labels, and three photos.
3. **Services Section** — section tagline and heading plus the service offering numbers, titles, descriptions, and floating preview photo. This is the home page's service overview; manage dedicated landing pages in **Services & Locations**.
4. **Experience Section** — heading and description plus three process phases. Each phase has a number/tagline, heading, description, comma-separated tags, and an illustration photo.
5. **Featured Film** — poster image URL, video URL, tagline, heading, button text, and description.
6. **CTA Booking Block** — booking call-to-action headline, subtext, watermark text, button text, and background image.

Use the matching **Save … Config** button for each section. Check headlines and short character limits before saving; long copy may not fit the design.

### Films page

Edit the Films page heading and description, followed by its four video entries. Each entry has an order number, a public Cloudflare R2 video URL, poster image URL, tag/label, and location. Replace video or poster links with complete public URLs. An empty video link may appear as “Coming soon.” Select **Save Films Page Changes** when finished.

### About page

The About page is arranged in these sections:

1. **About Hero** — main title, highlighted title, subtitle, and parallax background image.
2. **Founder Profile** — tagline, founder name and subtitle, split quote text, two biography paragraphs, two profile pillars, signature label, and founder portrait.
3. **Studio Spread** — tagline, split heading, studio narrative, team-image caption, and team photo.
4. **Core Philosophy** — tagline and split title, backdrop photo, and three philosophy pillars (index, title, description).
5. **Closing Editorial Quote** — closing quote and signature text.

Save with **Save About Page Changes**. Use the upload control to replace a photo; the preview helps check the selected image.

### Contact page

Edit the contact page's tagline and split heading; the bold, light, and gold introduction paragraphs; vertical image tagline; studio location; email and phone; contact form title and subtitle; and side editorial photo. Check email and phone carefully because visitors use these to contact the studio. Save with **Save Contact Page Changes**.

### FAQ page

Edit the page eyebrow, main and highlighted title, subtitle, and call-to-action strip question/button text. Below that, edit FAQ category names and their questions and answers. Use **Add a question** to add a question to a category, **Remove question** to delete one, and **Add a category** / **Remove category** to manage groups. Save the page with **Save FAQ page**.

### Portfolio page

This editor controls the portfolio landing page's heading, featured gallery heading, collection cards, and image lists. It does not create the individual event archives; create those under **Publish New Story**.

1. Edit **Page heading** and **Featured gallery heading**.
2. In each collection (Wedding and Pre-Wedding), edit the collection title and short description.
3. For each card, edit its label, destination page path, and image URL. Keep destination paths internal and valid, for example `/portfolio/wedding`; incorrect paths can send visitors to a missing page.
4. Edit **Top carousel images** and **Featured gallery images** as one full, public HTTPS image URL per line. Keep at least five carousel image URLs and at least one featured image URL. A URL that is private, incomplete, or unavailable will show as a broken image.
5. Select **Save Portfolio page**.

The collection card layout is predefined; this editor changes the existing cards' content and links.

## 8. Photo and URL tips

- Use photos the studio has permission to publish. Pick a sharp cover image that represents the full event.
- Folder selection uploads the images inside the chosen folder, not the folder as a downloadable folder. The website displays them as a gallery.
- For URL fields, paste the complete link beginning with `https://`. Image URLs must be publicly viewable by the website. Video URLs should point directly to a supported video file.
- Keep image descriptions factual and brief (for example, “The couple walking through the garden”). Descriptions are for accessibility; they are not captions unless the page design displays them as captions.
- If a photo looks wrong after upload, preview the public page. Replace it from the same editor if needed.

## 9. A safe editing routine

1. Before making a large change, note or copy the current text and URLs somewhere safe.
2. Change one section at a time and press its matching save button.
3. Wait for the success pop-up. If it reports an error, do not assume the change was saved.
4. Open the public page in another tab and refresh it to check the result on desktop and mobile.
5. For a new archive, verify its title, cover image, gallery order, and story link. Remember that only the newest six archives appear in Home **Recent Captures**; older ones remain in the portfolio/story pages.

## 10. What this dashboard does not edit

The dashboard edits the content and media fields listed above. It does not provide controls for changing the overall page layout, navigation structure, logo, fonts, colors, or the number/arrangement of fixed editor cards and page sections. Those structural design changes require a website code update. Dedicated service/location pages may also need a site rebuild and deployment before their prerendered search content is refreshed.
