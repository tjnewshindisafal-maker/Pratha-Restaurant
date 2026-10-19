=== Sanguine Landing Page ===
Requires at least: 5.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL-2.0-or-later

Redesigned Sanguine Software Solutions landing page as a WordPress page template.

== Installation ==

1. Plugins → Add New → Upload Plugin → choose sanguine-landing.zip → Install → Activate.
2. Pages → Add New. In the sidebar set Template to "Sanguine Landing Page (full page)". Publish.
3. Optional: Settings → Reading → "A static page" → Homepage = that page.
4. Settings → Sanguine Landing: set the email address that should receive demo enquiries.

== Demo enquiries ==

The form posts to /wp-json/sanguine/v1/enquiry. Each enquiry is saved under
"Demo Enquiries" in the admin menu and emailed to the configured address.
If your server cannot send email, install an SMTP plugin; enquiries are still saved.
