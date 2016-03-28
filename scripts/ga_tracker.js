/**
 * Drupal behavior for tracking GA events.
 *
 * Usage:
 *   In any other script, call Drupal.gaTrackEvent('your action', 'your label');
 *   whenever an event should be triggered.
 */
Drupal.behaviors.lol_custom_ga_tracker = {

  /**
   * Drupal behavior attach.
   *
   * Extends the Drupal object with the gaTrackEvent. Uses settings defined in
   * lol_custom.
   */
  attach: function (context, settings) {
    var category = settings['lol_custom']['ga_event_tracker_category'];
    var account = settings['lol_custom']['ga_event_tracker_account'];
    var host = settings['lol_custom']['ga_event_tracker_host'];

    if (account != "" && category != "" && host != "" && typeof ga != "undefined") {
      ga('create', account, host);
      Drupal.gaTrackEvent = function (action, label) {
        ga('send', 'event', category, action, label);
      };

      // Add analytics tracking if we have the tracking function defined (we are under WPP context)
      if(typeof jQuery !== "undefined") {
        jQuery('.node-full div.view-display-id-recent_news a').click(function() {
          Drupal.gaTrackEvent('click', 'related content#' + this.href);
        });
      }
    }
    else {
      Drupal.gaTrackEvent = function (action, label) {
        // silently fail.
      }
    }
  }
};
