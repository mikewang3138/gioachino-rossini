(function($) {

Drupal.behaviors.lolCustomColorbox = {
  attach: function (context, settings) {
    var amUrl = Drupal.settings.lol_custom_am || 'am-a.akamaihd.net';
    $("a.lightbox").each(function(){
      var href = $(this).attr("href");
      // if the href is :
      // - NOT already going through AM
      if (href.indexOf('am.leagueoflegends.com') < 0 &&
          href.indexOf('am-a.akamaihd.net') < 0 &&
          href.indexOf(amUrl) < 0 &&
          // - NOT a path which AM doesn't have access to
          href.indexOf('default/files/styles') < 0 &&
          href.indexOf('s3.amazonaws.com') < 0) {
        // then rewrite the href to go through AssetMagick
        href = 'http://' + amUrl + '/image?f=' + href + '&resize=' + Math.round(window.screen.width * 0.8) + ':';
        $(this).attr("href", href);
      }
      $(this).colorbox({
        "maxWidth": "80%",
        "current": "{current} / {total}",
        "photo": "true"
      });
    });
  }
};
})(jQuery);
