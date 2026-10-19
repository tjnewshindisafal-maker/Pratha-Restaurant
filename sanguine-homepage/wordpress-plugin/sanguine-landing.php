<?php
/**
 * Plugin Name:       Sanguine Landing Page
 * Description:       Adds the redesigned Sanguine landing page as a page template, and a demo enquiry form backend that saves and emails every request.
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Sanguine Software Solutions
 * License:           GPL-2.0-or-later
 * Text Domain:       sanguine-landing
 */

defined( 'ABSPATH' ) || exit;

define( 'SANGUINE_LP_TEMPLATE', 'sanguine-landing-page' );
define( 'SANGUINE_LP_OPTION', 'sanguine_lp_recipient' );
define( 'SANGUINE_LP_POST_TYPE', 'sanguine_enquiry' );

/* -------------------------------------------------------------------------
 * Page template
 * ---------------------------------------------------------------------- */

// Offer the landing page in the page editor's "Template" dropdown.
add_filter(
	'theme_page_templates',
	function ( $templates ) {
		$templates[ SANGUINE_LP_TEMPLATE ] = __( 'Sanguine Landing Page (full page)', 'sanguine-landing' );
		return $templates;
	}
);

add_filter(
	'template_include',
	function ( $template ) {
		if ( is_singular( 'page' ) && get_page_template_slug() === SANGUINE_LP_TEMPLATE ) {
			return __DIR__ . '/template.php';
		}
		return $template;
	},
	99
);

/** Returns the landing page HTML with this site's URLs and form endpoint injected. */
function sanguine_lp_render() {
	$html = file_get_contents( __DIR__ . '/landing.html' );
	if ( false === $html ) {
		return '<p>Landing page file is missing. Please reinstall the Sanguine Landing Page plugin.</p>';
	}

	$config = wp_json_encode( array( 'enquiryEndpoint' => esc_url_raw( rest_url( 'sanguine/v1/enquiry' ) ) ) );
	$html   = str_replace( '</head>', '<script>window.SANGUINE_CONFIG=' . $config . ';</script></head>', $html );

	$url  = esc_url( get_permalink() );
	$html = str_replace(
		array( '<link rel="canonical" href="https://sanguinesoftwares.com/" />', '<meta property="og:url" content="https://sanguinesoftwares.com/" />' ),
		array( '<link rel="canonical" href="' . $url . '" />', '<meta property="og:url" content="' . $url . '" />' ),
		$html
	);

	return $html;
}

/* -------------------------------------------------------------------------
 * Enquiry storage (admin: "Demo Enquiries")
 * ---------------------------------------------------------------------- */

add_action(
	'init',
	function () {
		register_post_type(
			SANGUINE_LP_POST_TYPE,
			array(
				'labels'          => array(
					'name'          => __( 'Demo Enquiries', 'sanguine-landing' ),
					'singular_name' => __( 'Demo Enquiry', 'sanguine-landing' ),
				),
				'public'          => false,
				'show_ui'         => true,
				'menu_icon'       => 'dashicons-email-alt',
				'supports'        => array( 'title', 'editor' ),
				'capability_type' => 'post',
				'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
				'map_meta_cap'    => true,
			)
		);
	}
);

// Show whether each enquiry email went out, so a broken mail setup is noticed.
add_filter(
	'manage_' . SANGUINE_LP_POST_TYPE . '_posts_columns',
	function ( $columns ) {
		$columns['sanguine_mailed'] = __( 'Email sent', 'sanguine-landing' );
		return $columns;
	}
);

add_action(
	'manage_' . SANGUINE_LP_POST_TYPE . '_posts_custom_column',
	function ( $column, $post_id ) {
		if ( 'sanguine_mailed' === $column ) {
			echo 'yes' === get_post_meta( $post_id, '_sanguine_mailed', true )
				? esc_html__( 'Yes', 'sanguine-landing' )
				: esc_html__( 'No — check your site email / SMTP setup', 'sanguine-landing' );
		}
	},
	10,
	2
);

/* -------------------------------------------------------------------------
 * REST endpoint: POST /wp-json/sanguine/v1/enquiry
 * ---------------------------------------------------------------------- */

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'sanguine/v1',
			'/enquiry',
			array(
				'methods'             => 'POST',
				'callback'            => 'sanguine_lp_handle_enquiry',
				'permission_callback' => '__return_true',
			)
		);
	}
);

function sanguine_lp_handle_enquiry( WP_REST_Request $request ) {
	$p = $request->get_json_params();
	if ( ! is_array( $p ) ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'invalid_body' ), 400 );
	}

	// Honeypot: bots that fill the hidden field get a quiet success and nothing is stored.
	if ( ! empty( $p['website'] ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}

	// At most 5 enquiries per IP per hour.
	$ip_key = 'sanguine_lp_rl_' . md5( isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '' );
	$count  = (int) get_transient( $ip_key );
	if ( $count >= 5 ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'rate_limited' ), 429 );
	}

	$fields = array(
		'fullName' => 'Full name',
		'email'    => 'Work email',
		'phone'    => 'Phone',
		'company'  => 'Company / brand',
		'industry' => 'Industry',
		'outlets'  => 'Outlets',
		'city'     => 'City',
		'product'  => 'Product of interest',
		'message'  => 'Message',
	);

	$data = array();
	foreach ( $fields as $key => $label ) {
		$raw          = isset( $p[ $key ] ) && is_scalar( $p[ $key ] ) ? (string) $p[ $key ] : '';
		$data[ $key ] = 'message' === $key ? sanitize_textarea_field( $raw ) : sanitize_text_field( $raw );
	}
	$data['email'] = sanitize_email( $data['email'] );

	foreach ( array( 'fullName', 'phone', 'company', 'industry', 'outlets', 'city', 'product' ) as $required ) {
		if ( '' === $data[ $required ] ) {
			return new WP_REST_Response( array( 'ok' => false, 'error' => 'missing_' . $required ), 422 );
		}
	}
	if ( ! is_email( $data['email'] ) ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'invalid_email' ), 422 );
	}
	if ( ( function_exists( 'mb_strlen' ) ? mb_strlen( $data['message'] ) : strlen( $data['message'] ) ) > 2000 ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'message_too_long' ), 422 );
	}

	$lines = array();
	foreach ( $fields as $key => $label ) {
		$lines[] = $label . ': ' . ( '' === $data[ $key ] ? '-' : $data[ $key ] );
	}
	$body  = implode( "\n", $lines );
	$title = sprintf( '%s — %s (%s)', $data['company'], $data['fullName'], $data['product'] );

	$post_id = wp_insert_post(
		array(
			'post_type'    => SANGUINE_LP_POST_TYPE,
			'post_status'  => 'private',
			'post_title'   => $title,
			'post_content' => $body,
		),
		true
	);

	$recipient = get_option( SANGUINE_LP_OPTION, get_option( 'admin_email' ) );
	$mailed    = wp_mail(
		$recipient,
		'New demo request: ' . $title,
		$body,
		array( 'Reply-To: ' . $data['fullName'] . ' <' . $data['email'] . '>' )
	);

	// Success only if the enquiry was actually kept somewhere.
	if ( is_wp_error( $post_id ) && ! $mailed ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'not_saved' ), 500 );
	}
	if ( ! is_wp_error( $post_id ) ) {
		update_post_meta( $post_id, '_sanguine_mailed', $mailed ? 'yes' : 'no' );
	}

	set_transient( $ip_key, $count + 1, HOUR_IN_SECONDS );
	return new WP_REST_Response( array( 'ok' => true ), 200 );
}

/* -------------------------------------------------------------------------
 * Settings: Settings → Sanguine Landing
 * ---------------------------------------------------------------------- */

add_action(
	'admin_init',
	function () {
		register_setting(
			'sanguine_lp',
			SANGUINE_LP_OPTION,
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_email',
				'default'           => get_option( 'admin_email' ),
			)
		);
	}
);

add_action(
	'admin_menu',
	function () {
		add_options_page(
			__( 'Sanguine Landing', 'sanguine-landing' ),
			__( 'Sanguine Landing', 'sanguine-landing' ),
			'manage_options',
			'sanguine-landing',
			'sanguine_lp_settings_page'
		);
	}
);

function sanguine_lp_settings_page() {
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Sanguine Landing Page', 'sanguine-landing' ); ?></h1>
		<form method="post" action="options.php">
			<?php settings_fields( 'sanguine_lp' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="sanguine_lp_recipient"><?php esc_html_e( 'Send demo enquiries to', 'sanguine-landing' ); ?></label></th>
					<td>
						<input type="email" class="regular-text" id="sanguine_lp_recipient" name="<?php echo esc_attr( SANGUINE_LP_OPTION ); ?>" value="<?php echo esc_attr( get_option( SANGUINE_LP_OPTION, get_option( 'admin_email' ) ) ); ?>" />
						<p class="description"><?php esc_html_e( 'Every enquiry is also saved under "Demo Enquiries" in the admin menu.', 'sanguine-landing' ); ?></p>
					</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
		<h2><?php esc_html_e( 'How to use', 'sanguine-landing' ); ?></h2>
		<ol>
			<li><?php esc_html_e( 'Pages → Add New (or edit an existing page).', 'sanguine-landing' ); ?></li>
			<li><?php esc_html_e( 'In the page settings sidebar, set Template to "Sanguine Landing Page (full page)" and publish.', 'sanguine-landing' ); ?></li>
			<li><?php esc_html_e( 'To make it the homepage: Settings → Reading → "A static page" → choose that page.', 'sanguine-landing' ); ?></li>
		</ol>
	</div>
	<?php
}

add_filter(
	'plugin_action_links_' . plugin_basename( __FILE__ ),
	function ( $links ) {
		array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=sanguine-landing' ) ) . '">' . esc_html__( 'Settings', 'sanguine-landing' ) . '</a>' );
		return $links;
	}
);
