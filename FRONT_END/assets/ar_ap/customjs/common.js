
const apiURL = "http://localhost:8000/AR_AP/user/";
const baseURL = "http://localhost:8000/assets/ar_ap/";

$.ajaxSetup({
  headers: {
    Accept: "application/json",
    //Authorization: "Bearer " + $.cookie("TOKEN"),
  },
});

$("#user_name").text(
  localStorage.EMP_NAME
);
$("#department").text(localStorage.DEPARTMENT);
$("#user_type").text(localStorage.USER_TYPE);


//FIXME:error when new tab
$.ajax({
  url: apiURL + "employee/" + localStorage.EMP_ID,
  type: "GET", // post, put, delete, get
  dataType: "json",
  success: function (data) {
    $("#user_name").text(data.first_name +" "+ data.last_name);
    $("#user_image").attr("src", baseURL + data.photo);
    $("#user_job").text(data.job);
    $("#user_department").text(data.department);
  },
  error: function (data) {
    if (data.responseJSON.detail == "Could not validate credentials") {
      toastr.error("Unauthorized.");
      setTimeout(() => {
        window.location.replace(apiURL + "AR_AP/login");
      }, 1000);
    }else{
      toastr.error(data.responseJSON.detail);
    }
  },
});



let button = document.querySelector(".submit");
$(document).ajaxStart(function () {
  button != undefined ? (button.disabled = true) : null;
});

$(document).ajaxSend(function () {
  button != undefined ? (button.disabled = true) : null;
});

$(document).ajaxComplete(function () {
  button != undefined ? (button.disabled = false) : null;
});

$(document).ajaxError(function () {
  button != undefined ? (button.disabled = false) : null;
});

function trimInputFields() {
  var allinputs = $("input:not(:file())");
  allinputs.each(function () {
    $(this).val($.trim($(this).val()));
  });
}

// $(document).ready(function () {
//   $(".select2").select2();
// });

$(".select2").select2();

formReset = (action, card_title) => {
  $("html, body").animate({ scrollTop: 0 }, "slow");

  if (action == "hide") {
    // hide and clear form
    $("#form_id").validate().resetForm();
    $("#div_form").hide();
    $("#form_id")[0].reset();
  } else if (action == "new") {
    // show
    $(".form_div").show();
    $("#form_id")[0].reset();
    $("#uuid").val("");
    $(".view_div").hide();
    $("#save_button").show();
    $("#div_form").show();
    $("button:reset").text("Cancel");
    $("#div_form_card_title").text(card_title);
  } else if (action == "update") {
    $(".form_div").show();
    $(".view_div").hide();
    $("#save_button").show();
    $("#div_form").show();
    $("button:reset").text("Cancel");
    $("#div_form_card_title").text(card_title);
  } else if (action == "show") {
    $("#div_form").show();
    $(".form_div").hide();
    $(".view_div").show();
    $("#save_button").hide();
    $("button:reset").text("Close");
    $("#div_form_card_title").text(card_title);
  }
};


formParticulars = (action, card_title) => {
  $("html, body").animate({ scrollTop: 0 }, "slow");

  if (action == "hide") {
    // hide and clear form
    $("#form_id").validate().resetForm();
    $("#div_form").hide();
    $("#form_id")[0].reset();
  } else if (action == "new") {
    // show
    $(".form_div").show();
    $("#form_id")[0].reset();
    $("#uuid").val("");
    $(".view_div").hide();
    $("#save_button").show();
    $("#div_form").show();
    $("button:reset").text("Cancel");
    $("#div_form_card_title").text(card_title);
  } else if (action == "update") {
    $(".form_div").show();
    $(".view_div").hide();
    $("#save_button").show();
    $("#div_form").show();
    $("button:reset").text("Cancel");
    $("#div_form_card_title").text(card_title);
  } else if (action == "show") {
    $("#div_form").show();
    $(".form_div").show();
    $(".view_div").show();
    $("#save_button").hide();
    $("button:reset").text("Close");
    $("#div_form_card_title").text(card_title);
  }
};

formResetSurgeryPull = (action, card_title) => {
  $("html, body").animate({ scrollTop: 0 }, "slow");

  if (action == "hide") {
    // hide and clear form
    $("#form_id").validate().resetForm();
    $("#div_form").hide();
    $("#form_id")[0].reset();
  } else if (action == "new") {
    // show
    $(".form_div").show();
    $("#form_id")[0].reset();
    $("#uuid").val("");
    $(".view_div").hide();
    $("#save_button").show();
    $("#div_form").show();
    $("button:reset").text("Cancel");
    $("#div_form_card_title").text(card_title);
  } else if (action == "update") {
    $(".form_div").show();
    $(".view_div").hide();
    $("#save_button").show();
    $("#div_form").show();
    $("button:reset").text("Cancel");
    $("#div_form_card_title").text(card_title);
  } else if (action == "show") {
    $("#div_form").show();
    $(".form_div").hide();
    $(".view_div").show();
    $("#save_button").hide();
    $("button:reset").text("Close");
    $("#div_form_card_title").text(card_title);
  }
};

// var instance = $("body").overlayScrollbars({ }).overlayScrollbars();
