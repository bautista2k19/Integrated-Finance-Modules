$(document).ready(function () {
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
	$("#birthdate").attr("max", current_date);

	// new employee validation
	$("#form_id").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var form_data = new FormData(form);

			if ($("#uuid").val() == "") {
				form_data.append("created_by", localStorage.USER_ID);
				$.ajax({
					url: apiURL + "employee/",
					type: "POST", // post, put, delete, get
					data: form_data,
					dataType: "json",
					contentType: false,
					processData: false,
					cache: false,
					success: function (data) {
						toastr.success("New employee has been created.");
						formReset("hide", "");
						resetFileInput();
						loadEmployeeTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else {
				form_data.append("updated_by", localStorage.USER_ID);
				if ($("#photo").val() == "") {
					form_data.delete("photo");
				}
				$.ajax({
					url: apiURL + "employee/" + $("#uuid").val(),
					type: "PUT", // post, put, delete, get
					data: form_data,
					dataType: "json",
					contentType: false,
					processData: false,
					cache: false,
					success: function (data) {
						toastr.success("Employee has been updated.");
						formReset("hide", "");
						resetFileInput();
						loadEmployeeTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			}
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

	// DataTable
	$.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
		console.log(message);
	};
	loadEmployeeTable = () => {
		$("#employee_table").dataTable().fnClearTable();
		$("#employee_table").dataTable().fnDraw();
		$("#employee_table").dataTable().fnDestroy();
		$("#employee_table").dataTable({
			responsive: true,
			fixedHeader: true,
			processing: true,
			order: [[0, "desc"]],
			dom:
				"<'row'<'col-sm-12 col-md-6'B>>" +
				"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
				"<'row'<'col-sm-12'tr>>" +
				"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
			buttons: [
				//https://datatables.net/reference/button/collection
				{
					extend: "collection",
					autoClose: "true",
					text: "Options",
					buttons: [
						{
							extend: "print",
							text: '<i class="fa fa-print"></i> Print',
							exportOptions: {
								stripHtml: false,
								columns: [0, 1, 2, 3, 4, 5],
							},
						},
						{
							extend: "pdf",
							text: '<i class="far fa-file-pdf"></i> PDF',
							exportOptions: {
								columns: ":visible",
							},
						},
						{
							extend: "excel",
							text: '<i class="far fa-file-excel"></i> Excel',
							exportOptions: {
								columns: ":visible",
							},
						},
					],
				},
			],
			columns: [
				{
					data: null,
					render: function (aData, type, row) {
						let photo = "";

						photo +=
							"<img src='http://localhost:8000/assets/ar_ap/" +
							aData.photo +
							"' style='width: 40px'></img>";
						return photo;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let full_name = "";
						full_name += aData.first_name + " " + aData.last_name;
						return full_name;
					},

					searchable: true,
				},
				{
					data: "gender",
					name: "gender",

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let contact = "";
						contact += aData.contact_number + " " + aData.email;
						return contact;
					},

					searchable: true,
				},
				{
					data: "job",
					name: "job",

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let status = "";

						if (aData.status != "Inactive") {
							status +=
								'<span class="badge badge-success p-2 w-100">Active</span>';
						} else {
							status +=
								'<span class="badge badge-danger p-2 w-100">Inactive</span>';
						}
						return status;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let buttons = "";

						buttons +=
							'<div class="text-center dropdown">' +
							'<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
							'<i class="fas fa-ellipsis-v"></i>' +
							"</div>" +
							'<div class="dropdown-menu dropdown-menu-right">' +
							'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
							aData["id"] +
							"',0)\">" +
							'<div style="width: 2rem">' +
							'<i class="fas fa-eye mr-1 text-secondary"></i>' +
							"</div>" +
							"<div>View Profile</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 text-info"></i>' +
								"</div>" +
								"<div>Edit Profile</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" '+
								'onClick="return deleteData(\'' +
								aData["id"] +
								"')\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-trash-alt mr-1 text-danger"></i>' +
								"</div>" +
								"<div>Delete Employee</div>" +
								"</div>";
						}
						buttons += "</div>" + "</div>";
						return buttons; // same class in i element removed it from a element
					},
					sortable: false,
				},
			],

			ajax: {
				url: apiURL + "employee/datatable",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				let full_name = "";
				full_name += aData.first_name + " " + aData.last_name;

				let contact = "";
				contact += aData.contact_number + " " + aData.email;

				let photo = "";

				photo +=
					"<img src='http://localhost:8000/assets/ar_ap/" +
					aData.photo +
					"'}}' style='width: 40px'></img>";

				let status = "";

				if (aData.status != "Inactive") {
					status += '<span class="badge badge-success p-2 w-100">Active</span>';
				} else {
					status +=
						'<span class="badge badge-danger p-2 w-100">Inactive</span>';
				}

				let buttons = "";

				buttons +=
					'<div class="text-center dropdown">' +
					'<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
					'<i class="fas fa-ellipsis-v"></i>' +
					"</div>" +
					'<div class="dropdown-menu dropdown-menu-right">' +
					'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
					aData["id"] +
					"',0)\">" +
					'<div style="width: 2rem">' +
					'<i class="fas fa-eye mr-1 text-secondary"></i>' +
					"</div>" +
					"<div>View Profile</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 text-info"></i>' +
						"</div>" +
						"<div>Edit Profile</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" '+
						'onClick="return deleteData(\'' +
						aData["id"] +
						"')\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-trash-alt mr-1 text-danger"></i>' +
						"</div>" +
						"<div>Delete Employee</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";
				$("td:eq(0)", nRow).html(photo);
				$("td:eq(1)", nRow).html(full_name);
				$("td:eq(2)", nRow).html(aData["gender"]);
				$("td:eq(3)", nRow).html(contact);
				$("td:eq(4)", nRow).html(aData["job"]);
				$("td:eq(5)", nRow).html(status);
				$("td:eq(6)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
		});
	};

	loadEmployeeTable();

	$(window).resize(function () {
		$("table.dataTable").resize();
	});

	//New Data
	$("#new_record").on("click", function () {
		formReset("new", "New Employee");
		$("#photo_path_placeholder").attr("src", baseURL + "img/avatar5.png");
		$('[for="photo"]').addClass("form-required-field");
		$("#photo").attr("required", true);
	});

	//view info
	viewData = (id, type) => {
		$.ajax({
			url: apiURL + "employee/" + id,
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
				if (type == 0) {
					formReset("show", "View Employee Information");
					$(".view_div").empty();
					$("#form_card_body").append(
						"<div class='row view_div'>" +
							"<div class='col-md-4 text-center'>" +
							"<div class='card'>" +
							"<div class='card-body'>" +
							"<img src='http://localhost:8000/assets/ar_ap/" +
							data.photo +
							"'class='rounded-circle' width='150'></img><br>" +
							"<label>" +
							data.first_name +
							" " +
							data.last_name +
							"</label>" +
							"<p>" +
							data.job +
							"</p>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"<div class='col-md-8'>" +
							"<div class='col-md-12'>" +
							"<h5 class='text-info'>Personal Information</h5>" +
							"</div>" +
							"<div class='col-md-12'>" +
							"<table class='table table-borderless view-info-table'>" +
							"<tr>" +
							"<th>Full Name</th>" +
							"<td>" +
							data.first_name +
							" " +
							middle_name +
							" " +
							data.last_name +
							" " +
							extension_name +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Gender</th>" +
							"<td>" +
							data.gender +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Birthdate</th>" +
							"<td>" +
							moment(data.birthdate).format("MMMM D, YYYY") +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Birthplace</th>" +
							"<td>" +
							data.birthplace +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Phone Number</th>" +
							"<td>" +
							data.contact_number +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Email Address</th>" +
							"<td>" +
							data.email +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Civil Status</th>" +
							"<td>" +
							data.civil_status +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Address</th>" +
							"<td>" +
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
							data.country +
							" " +
							"</td>" +
							"</tr>" +
							"</table>" +
							"</div>" +
							"<div class='col-md-12'>" +
							"<h5 class='text-info'>Job Information</h5>" +
							"</div>" +
							"<div class='col-md-12'>" +
							"<table class='table table-borderless view-info-table'>" +
							"<tr>" +
							"<th>Department</th>" +
							"<td>" +
							data.department +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Job</th>" +
							"<td>" +
							data.job +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Manager</th>" +
							"<td>" +
							data.manager +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Hired Date</th>" +
							"<td>" +
							moment(data.hire_date).format("MMMM D, YYYY") +
							"</td>" +
							"</tr>" +
							"</table>" +
							"</div>" +
							"</div>" +
							"</div>"
					);
				} else if (type == 1) {
					formReset("update", "Update Employee Information");
					$("#uuid").val(data.id);
					$("#photo_path_placeholder").attr("src", baseURL + data.photo);
					$('[for="photo"]').removeClass("form-required-field");
					$("#photo").removeAttr("required");
					$("#first_name").val(data.first_name);
					$("#middle_name").val(middle_name);
					$("#last_name").val(data.last_name);
					$("#extension_name").val(extension_name);
					$("#birthdate").val(data.birthdate);
					$("#birthplace").val(data.birthplace);
					$("#gender").val(data.gender);
					$("#civil_status").val(data.civil_status);
					$("#house_number").val(data.house_number);
					$("#street").val(data.street);
					$("#barangay").val(data.barangay);
					$("#city").val(data.city);
					$("#province").val(data.province);
					$("#country").val(data.country);
					$("#contact_number").val(data.contact_number);
					$("#email").val(data.email);
					$("#department").val(data.department);
					$("#job").val(data.job);
					$("#manager").val(data.manager);
					$("#hire_date").val(data.hire_date);
				}
			},
			error: function (data) {
				toastr.error(data.responseJSON.detail);
			},
		});
	};

	deleteData = (id) => {
		$('#modal_delete').modal('show')
		$("#form_delete").validate({
			submitHandler: function (form, e) {
				e.preventDefault();
				trimInputFields();
				$.ajax({
					url: apiURL + "employee/" + id + "/" + localStorage.USER_ID,
					type: "DELETE", // post, put, delete, get
					dataType: "json",
					success: function (data) {
						toastr.success("Record has been deactivated.");
						$('#modal_delete').modal('hide')
						loadEmployeeTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			},
		});

	};

	
	

});
