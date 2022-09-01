var url = window.location.pathname, 
urlRegExp = new RegExp(url.replace(/\/$/,'') + "$"); // create regexp to match current url pathname and remove trailing slash if present as it could collide with the link in navigation in case trailing slash wasn't present there
// now grab every link from the navigation
$('.nav-sidebar  a').each(function(){
    // and test its normalized href against the url pathname regexp
    if(urlRegExp.test(this.href.replace(/\/$/,''))){
        $(this).addClass('active');
    }
});

document.title =
$('.p-title').text() + " | Hospital Management System"


const apiURL = "http://localhost:8000/cms/user/";
const baseURL = "http://localhost:8000/assets/";

$.ajaxSetup({
  headers: {
    Accept: "application/json",
    //Authorization: "Bearer " + $.cookie("TOKEN"),
  },
});

// $("#user_name").text(
//   $.cookie("EMP_NAME")
// );
// $("#department").text($.cookie("DEPARTMENT"));
// $("#user_type").text($.cookie("USER_TYPE"));
//console.log(localStorage.EMP_NAME)
$("#user_name").text(
  localStorage.EMP_NAME
);
$("#department").text(localStorage.DEPARTMENT);
$("#user_type").text(localStorage.USER_TYPE);

//FIXME:error when new tab
// $.ajax({
//   url: apiURL + "employee/" + localStorage.EMP_ID,
//   type: "GET", // post, put, delete, get
//   dataType: "json",
//   success: function (data) {
    
//   },
//   error: function (data) {
//     if (data.responseJSON.detail == "Could not validate credentials") {
//         window.location.replace(apiURL + "cms/login");
//     } else {
//       toastr.error(data.responseJSON.detail);
//     }
//   },
// });

// $.ajax({
//   url: apiURL + "user/" + localStorage.USER_ID,
//   type: "GET", // post, put, delete, get
//   dataType: "json",
//   success: function (data) {
//     $("#user_type").text(data.user_type);
//   },
//   error: function (data) {
//     if (data.responseJSON.detail == "Could not validate credentials") {
//       toastr.error("Unauthorized.");
//       setTimeout(() => {
//         window.location.replace(apiURL + "cms/login");
//       }, 1000);
//     } else {
//       toastr.error(data.responseJSON.detail);
//     }
//   },
// });

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

// var instance = $("body").overlayScrollbars({ }).overlayScrollbars();
