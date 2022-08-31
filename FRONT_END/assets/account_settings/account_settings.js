$(document).ready(function () {
	$("#change_user_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$.ajax({
				url:
					apiURL +
					"user/" +
					localStorage.USER_ID +
					"/update_email",
				type: "PUT", // post, put, delete, get
				data: JSON.stringify({
                    password: $("#password").val(),
					email: $("#email").val(),
					updated_by: localStorage.USER_ID,
				}),
				contentType: "application/json",
				success: function (data) {
					toastr.success("Email has been updated.");
                    setTimeout(() => {
                        window.location.replace("../../login");
                      }, 1000);
				},
				error: function (data) {
					toastr.error(data.responseJSON.detail);
				},
			});
		},
		errorElement: "span",
		errorPlacement: function (error, element) {
			error.addClass("invalid-feedback");
			element.closest(".form-group ").append(error);
		},
		highlight: function (element, errorClass, validClass) {
			$(element).addClass("is-invalid");
		},
		unhighlight: function (element, errorClass, validClass) {
			$(element).removeClass("is-invalid");
		},
	});

    $("#change_pass_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$.ajax({
				url:
					apiURL +
					"user/" +
					localStorage.USER_ID +
					"/update_password",
				type: "PUT", // post, put, delete, get
				data: JSON.stringify({
                    password: $("#current_password").val(),
                    new_password: $("#new_password").val(),
					updated_by: localStorage.USER_ID,
				}),
				contentType: "application/json",
				success: function (data) {
					toastr.success("Password has been updated.");
                    setTimeout(() => {
                        window.location.replace("../../login");
                      }, 1000);
				},
				error: function (data) {
					toastr.error(data.responseJSON.detail);
				},
			});
		},
		errorElement: "span",
		errorPlacement: function (error, element) {
			error.addClass("invalid-feedback");
			element.closest(".form-group ").append(error);
		},
		highlight: function (element, errorClass, validClass) {
			$(element).addClass("is-invalid");
		},
		unhighlight: function (element, errorClass, validClass) {
			$(element).removeClass("is-invalid");
		},
	});
});
