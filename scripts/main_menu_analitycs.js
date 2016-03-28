/**
 *
 */
Drupal.behaviors.lol_custom_main_menu_analitycs = {
  /**
   * Main behavior functionality.
   *
   * Add listener on click to all the elements on the main bar to track analitycs for them
   */
  attach: function (context, settings) {
    (function($) {
      $('#main-navigation a').click(function(e) {
        Drupal.gaTrackEvent('Click on main menu', e.target.text);
      });
    })(jQuery);
  }
}
