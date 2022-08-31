$(document).ready(function () {
	$(".form_div").hide();
	$(".update_button").hide();
	$("#edit_button").on("click", function () {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$(".view_div").hide();
		$("#edit_button").hide();
		$(".form_div").show();
		$(".div_form_card_title").text("Update My Profile");
		$(".update_button").show();
	});
	$("#cancel_button").on("click", function () {
		loadProfile();
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$(".form_div").hide();
		$(".div_form_card_title").text("My Profile");
		$(".update_button").hide();
		$(".view_div").show();
		$("#edit_button").show();
	});
	loadProfile = () => {
		$.ajax({
			url: apiURL + "employee/" + localStorage.EMP_ID,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				if (data.middle_name == null) {
					var middle_name = "";
				} else {
					var middle_name = data.middle_name;
				}
				if (data.extension_name == null) {
					var extension_name = " ";
				} else {
					var extension_name = data.extension_name;
				}
				if (data.house_number == null) {
					var house_number = " ";
				} else {
					var house_number = data.house_number;
				}
				if (data.street == null) {
					var street = " ";
				} else {
					var street = data.street;
				}
				$("#my_photo").attr("src", baseURL + data.photo);
				$("#my_name_label").text(data.first_name + " " + data.last_name);
				$("#my_job_p").text(data.job.job_title);
				$("#my_full_name").text(
					data.first_name +
						" " +
						middle_name +
						" " +
						data.last_name +
						" " +
						extension_name
				);
				$("#my_birth_date").text(moment(data.birth_date).format("MMMM D, YYYY"));
				$("#my_gender").text(data.gender);
				$("#my_civil_status").text(data.civil_status);
				$("#my_address").text(
					house_number +
						" " +
						street +
						" " +
						data.barangay +
						" " +
						data.city +
						" " +
						data.province +
						" " +
						data.region +
                        " " +
						data.zip_code
				);
				$("#my_contact_number").text(data.contact_number);
				$("#my_department").text(data.department.main_department_name);
				$("#my_job").text(data.job.job_title);
				$("#my_hired_date").text(moment(data.hire_date).format("MMMM D, YYYY"));

				// $("#uuid").val(data.id);
				$("#photo_path_placeholder").attr("src", baseURL + data.photo);
				$('[for="photo"]').removeClass("form-required-field");
				$("#photo").removeAttr("required");
				$("#first_name").val(data.first_name);
				$("#middle_name").val(middle_name);
				$("#last_name").val(data.last_name);
				$("#extension_name").val(extension_name);
				$("#birth_date").val(data.birth_date);
				$("#gender").val(data.gender);
				$("#civil_status").val(data.civil_status);
				$("#house_number").val(data.house_number);
				$("#street").val(data.street);
				$("#barangay").val(data.barangay);
				$("#city").val(data.city);
				$("#province").val(data.province);
                $("#region").val(data.region);
                $("#zip_code").val(data.zip_code);
				$("#contact_number").val(data.contact_number);
				$("#department_id").val(data.department_id).trigger("change");
				$("#job_id").val(data.job_id).trigger("change");
                $("#employee_type_id").val(data.employee_type_id).trigger("change");
				$("#hire_date").val(data.hire_date);
			},
			error: function (data) {
				if (data.responseJSON.detail == "Could not validate credentials") {
				} else {
					toastr.error(data.responseJSON.detail);
				}
			},
		});
	};

	loadProfile();

	resetFileInput = () => {
		$("#photo_path_placeholder").attr("src", baseURL + "img/avatar5.png");
		$("#photo").val("");
		$("#photo_label").text("Choose image");
	};

	$("#photo").change(function () {
		readURL(this);
	});

	function readURL(input) {
		var url = input.value;
		var ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
		if (
			input.files &&
			input.files[0] &&
			(ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")
		) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$("#photo_path_placeholder").attr("src", e.target.result);
			};
			reader.readAsDataURL(input.files[0]);
		} else {
		}
	}

	//date attribute
	//get current date to restrict input of future dates
	var current_date = new Date();
	current_date = current_date.toISOString().split("T")[0];
	$("#hire_date").attr("max", current_date);
	$("#birth_date").attr("max", current_date);

    loadDepartment = () => {
		$.ajax({
			url: apiURL + "department/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				$("#department_id").empty();
				
				$.each(data, function (i, dataOptions) {
					console.log(dataOptions.main_department_name)
					var options = "";

					options =
						"<option value='" + dataOptions.id +"'>" +
						dataOptions.main_department_name +
						"</option>";
					$("#department_id").append(options);

				});
				$("#department_id").trigger("change");

			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadDepartment();

	loadJob = () => {
		$.ajax({
			url: apiURL + "job/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				$("#job_id").empty();
				
				$.each(data, function (i, dataOptions) {
					console.log(dataOptions.job_title)
					var options = "";

					options =
						"<option value='" + dataOptions.id +"'>" +
						dataOptions.job_title +
						"</option>";
					$("#job_id").append(options);

				});
				$("#job_id").trigger("change");

			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadJob();

	loadEmployeeType = () => {
		$.ajax({
			url: apiURL + "employee_type/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				$("#employee_type_id").empty();
				
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" + dataOptions.id +"'>" +
						dataOptions.employee_type +
						"</option>";
					$("#employee_type_id").append(options);

				});
				$("#employee_type_id").trigger("change");

			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadEmployeeType();

	// new employee validation
	$("#form_id").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var form_data = new FormData(form);

			form_data.append("updated_by", localStorage.USER_ID);
			if ($("#photo").val() == "") {
				form_data.delete("photo");
			}
			$.ajax({
				url: apiURL + "employee/" + localStorage.EMP_ID,
				type: "PUT", // post, put, delete, get
				data: form_data,
				dataType: "json",
				contentType: false,
				processData: false,
				cache: false,
				success: function (data) {
					toastr.success("Profile has been updated.");
					resetFileInput();
					setTimeout(() => {
						$("#cancel_button").trigger("click");
					}, 1000);
					loadProfile();
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
