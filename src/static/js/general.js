function footerAdj() {
    let footerH = jQuery("footer").outerHeight();
    jQuery("footer").css({ "margin-top": -footerH });
    jQuery(".wrapper").css({
      "padding-bottom": footerH,
      "min-height": "100vh"
    });
  }

  jQuery(document).ready(function () {
    footerAdj();
  });