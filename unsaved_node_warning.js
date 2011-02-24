Drupal.unsaved_node_warning = {};
Drupal.unsaved_node_warning.confirmNavigate = function() {
  return confirm(Drupal.t("There are unsaved fields, are you sure you want to leave this page.") + "\n\n" + Drupal.t("Click <OK> to continue anyway."));
};

Drupal.behaviors.unsavedNodeWarning = function(context) {
    
  // If they leave an input field, assume they changed it.
  $(".node-form :input").each(function() {
    $(this).blur(function() {
      $(window).attr('unsaved_node_warning_edited', true);
    });
  });

  // Let all form submit buttons through
  $(".node-form input[@type='submit']").each(function() {
    $(this).addClass('unsaved-node-warning-processed');
    $(this).click(function() {
      $(window).attr('unsaved_node_warning_clicked', true);
    });
  });

  // Catch all links and buttons
  $("a, button, input[@type='submit']:not(.unsaved-node-warning-processed)").each(function() {
    $(this).click(function() {
      var edited = $(window).attr('unsaved_node_warning_edited');
      if(edited) {
        $(window).attr('unsaved_node_warning_clicked', true);
        return Drupal.unsaved_node_warning.confirmNavigate();
      }
    });
  });

  $(window).unload(function() {
    var clicked = $(this).attr('unsaved_node_warning_clicked');
    var edited = $(this).attr('unsaved_node_warning_edited');
    if(edited && !clicked) {
      return Drupal.unsaved_node_warning.confirmNavigate();
    }
  });
};