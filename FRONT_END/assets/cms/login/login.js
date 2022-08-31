$(document).ready(function () {
	$.removeCookie("TOKEN");
	$("#login_form").validate({
		submitHandler: function (form) {
			//trimInputFields();
			$.ajax({
				url: "http://localhost:8000/login",
				type: "POST", // post, put, delete, get
				data: {
					username: $("#username").val(),
					password: $("#password").val(),
				},
				dataType: "json",
				success: function (data) {
					window.location.replace("/homies/cms/user/main_dashboard");
				},
				error: function (data) {
					toastr.warning(data.responseJSON.detail);
				},
			});
		},
		errorElement: "span",
		errorPlacement: function (error, element) {
			error.addClass("invalid-feedback");
			element.closest(".input-group ").append(error);
		},
		highlight: function (element, errorClass, validClass) {
			$(element).addClass("is-invalid");
		},
		unhighlight: function (element, errorClass, validClass) {
			$(element).removeClass("is-invalid");
		},
	});
});
