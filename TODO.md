# TODO: Implement Beranda (Home) Page Features Step by Step

## Highlights Section
- [ ] Add drag & drop reorder UI for Highlights blocks.
- [ ] Add "Reset to default" button to restore default Highlights.
- [ ] Connect reorder and reset actions to backend or local state.

## News Section
- [ ] Add manual/auto mode toggle for Berita Terbaru.
- [ ] Support manual pinning of headline + 3 cards.
- [ ] Add "Reset to default" button for News section.

## Agenda Section
- [ ] Add toggle to show/hide mini calendar.
- [ ] Add "Reset to default" button for Agenda section.

## Gallery Section
- [ ] Add "Reset to default" button for Gallery section.

## Stats Section
- [ ] Add "Reset to default" button for Stats section.

## Testimonials Section
- [ ] Add "Reset to default" button for Testimonials section.

## Backend Support
- [ ] Ensure SiteContent supports storing order, manual pins, toggles, and reset.
- [ ] Update HomeController to handle new config and pass to frontend.

## Testing
- [ ] Test each section UI and functionality.
- [ ] Verify data flow between backend and frontend.
- [ ] Ensure SEO and accessibility compliance.

---

# Progress will be updated here as steps are completed.

- Made migrations idempotent for local sqlite databases:
  - `2025_10_06_133522_add_section_key_type_value_to_site_settings_table.php` now checks for `site_settings` table and `section` column before altering.
  - `2025_10_07_000010_create_media_assets_table.php` now checks for `media_assets` table before creating.
  This prevents "duplicate column name" and "table already exists" errors when running migrations against an existing SQLite file.
- Updated `SiteSetting` model to use `value_json` (normalized schema) instead of `type`/`value`.
- Updated `DemoContentSeeder` to write `value_json` and to use an allowed `media_assets.collection` value so sqlite CHECK constraints are satisfied.
- These changes resolve "no column named type" and media_assets CHECK constraint errors when seeding against an existing sqlite DB.
