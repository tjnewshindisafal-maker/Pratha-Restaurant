<?php
/**
 * Full-page output for the "Sanguine Landing Page" template.
 *
 * The landing page ships its own <head>, styles and scripts, so the theme's
 * header, footer and stylesheets are deliberately not loaded here.
 */

defined( 'ABSPATH' ) || exit;

// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- trusted, plugin-bundled HTML.
echo sanguine_lp_render();
