/**
 *
 */
Drupal.behaviors.lolCustomBackToTopButton = {
  /**
   * Main behavior functionality.
   *
   * Queries the API and replaces the related content items.
   */
  attach: function (context, settings) {
    (function($) {
      var riotBttId = "riot-back-to-top-button",
        riotBtt = $('<a id="' + riotBttId + '" href="#top" class="riot-button-btt"></a>'),
        riotBttVisibilityMin = 660,
        windowTop = 0;

      var changeOpacity = function() {
        windowTop = $(window).scrollTop();
        // Check if the current Y is greater than the min required
        if (riotBttVisibilityMin < windowTop) {
          riotBtt.css('opacity', '1');
          riotBtt.css('cursor', 'pointer');
        } else {
          riotBtt.css('opacity', '0');
          riotBtt.css('cursor', 'default');
        }
      }


      // Only add it if it is not already added
      if ($('#' + riotBttId).length === 0) {
        riotBtt.click(function(e){
          Drupal.gaTrackEvent('click', 'back to top');
          // To avoid conflicts with lolkit, do the scrolling here.
          jQuery("html, body").animate({scrollTop: 0})
          e.stopImmediatePropagation();
          e.preventDefault();
        });

        $(window).scroll(changeOpacity);

        $('body').append(riotBtt);

        // Force the call to the method for when reload is invoked and the Y position might be lower that riotBttVisibilityMin
        changeOpacity();
      }
    })(jQuery);
  }
};
