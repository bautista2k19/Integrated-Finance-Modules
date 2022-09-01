
	//date attribute
	//get current date to restrict input of future dates
	var current_date = new Date();
	current_date = current_date.toISOString().split("T")[0];

	$("#birthdate").attr("max", current_date);

	// new inpatient validation
	$("#form_id").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var form_data = new FormData(form);
			
			if ($("#uuid").val()=="") {
				form_data.append("created_by", localStorage.USER_ID);
				$.ajax({
					url: apiURL + "inpatient/",
					type: "POST", // post, put, delete, get
					data: form_data,
					dataType: "json",
					contentType: false,
					processData: false,
					cache: false,
					success: function (data) {
						toastr.success("New inpatient has been created.");
						formReset("hide","");
						resetFileInput();
						loadInpatientTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			}else{
				form_data.append("updated_by", localStorage.USER_ID);
			
				$.ajax({
					url: apiURL + "inpatient_bill/" + $("#uuid").val(),
					type: "PUT", // post, put, delete, get
					data: form_data,
					dataType: "json",
					contentType: false,
					processData: false,
					cache: false,
					success: function (data) {
						toastr.success("New inpatient has been updated.");
						formReset("hide","");
						resetFileInput();
						loadInpatientTable();
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


	//New Data
	$("#new_record").on("click", function () {
		formReset('new','New Inpatient');
	})

	// DataTable
	loadInpatientTable = () => {
		$("#inpatient_table").dataTable().fnClearTable();
		$("#inpatient_table").dataTable().fnDraw();
		$("#inpatient_table").dataTable().fnDestroy();
		$("#inpatient_table").dataTable({
			responsive: true,
			fixedHeader: true,
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
								columns: [0, 1, 2, 3, 4, 5, ],
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
					data: "bill_registration.first_name",
					name: "bill_registration.first_name",
					className: "align-middle",
					searchable: true,
				},
				{
					data: "bill_registration.last_name",
					name: "bill_registration.last_name",
					className: "align-middle",
					searchable: true,
				},
				{
					data: "bill_admission.date_admitted",
					name: "bill_admission.date_admitted",
					className: "align-middle",
					searchable: true,
				},
				{
					data: "bill_admission.room_type_id",
					name: "bill_admission.room_type_id",
					className: "align-middle",
					searchable: true,
				},
				
				{
					data: null,
					render: function (aData, type, row) {
						let status = "";

						if (aData.status == "Not yet fully paid") {
							status +=
								'<span class="badge badge-pill badge-success">Not yet fully paid</span>';
						} else {
							status +=
								'<span class="badge badge-pill badge-danger">Inactive</span>';
						}
						return status;
					},
					className: "align-middle",
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let buttons = "";
						// info
						buttons +=
							'<button type="button" onClick="return viewData(\'' +
							aData["inpatient_bill_id"] +
							'\',0)" title="View" class="btn btn-sm mr-1 btn-secondary "' +
							'><i class="fas fa-eye" ' +
							"></i></button>";
						// edit
						if (aData.status == "Active") {
							buttons +=
								'<button type="button" onClick="return viewData(\'' +
								aData["inpatient_bill_id"] +
								'\',1)" title="Edit" class="btn btn-sm mr-1 btn-success "' +
								'><i class="fas fa-pen" ' +
								" ></i></button>";
						}
						// delete
						if (aData.status == "Active") {
							buttons +=
								'<button type="button" onClick="return deleteData(\'' +
								aData["inpatient_bill_id"] +
								'\')" title="Delete" class="btn btn-sm btn-danger "' +
								'><i class="fas fa-trash" ' +
								" ></i></button>";
						}
						return buttons; // same class in i element removed it from a element
					},
					className: "align-middle",
				},
			],

			ajax: {
				url: apiURL + "inpatient_bill/datatable",
				dataSrc: "",
				type: "GET",
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {

				let status = "";

				if (aData.status == "Not yet fully paid") {
					status +=
						'<span class="badge badge-pill badge-success">Not yet fully paid</span>';
				} else {
					status +=
						'<span class="badge badge-pill badge-danger">Inactive</span>';
				}

				let buttons = "";
				// info
				buttons +=
					'<button type="button" onClick="return viewData(\'' +
					aData["inpatient_bill_id"] +
					'\',0)" title="View" class="btn btn-sm mr-1 btn-secondary "' +
					'><i class="fas fa-eye" ' +
					"></i></button>";
				// edit
				if (aData.status == "Not yet fully paid") {
					buttons +=
						'<button type="button" onClick="return viewData(\'' +
						aData["inpatient_bill_id"] +
						'\',1)" title="Edit" class="btn btn-sm mr-1 btn-success "' +
						'><i class="fas fa-pen" ' +
						" ></i></button>";
				}
				// delete
				if (aData.status == "Not yet fully paid") {
					buttons +=
						'<button type="button" onClick="return deleteData(\'' +
						aData["inpatient_bill_id"] +
						'\')" title="Delete" class="btn btn-sm btn-danger "' +
						'><i class="fas fa-trash" ' +
						" ></i></button>";
				}
				
				$("td:eq(0)", nRow).html(aData["system_con.first_name"]);
				$("td:eq(0)", nRow).html(aData["bill_registration.last_name"]);
				$("td:eq(1)", nRow).html(aData["bill_admission.date_admitted"]);
				$("td:eq(2)", nRow).html(aData["bill_registration.pt_discount_type"]);
				$("td:eq(3)", nRow).html(aData["bill_admission.room_type"]);
				$("td:eq(4)", nRow).html(status);
				$("td:eq(5)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
		});
	};

	loadInpatientTable();

	$(window).resize(function () {
		$("table.dataTable").resize();
	});

	//New Data

	//view info
	viewData = (inpatient_bill_id, type) => {
		$.ajax({
			url: apiURL + "inpatient_bill/" + inpatient_bill_id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				
					if (data.bill_registration.middle_name == null) {
						data.bill_registration.middle_name = "";
					} else {
						data.bill_registration.middle_name = data.bill_registration.middle_name;
					}
					if (data.bill_registration.extension_name == null) {
						data.bill_registration.extension_name = " ";
					} else {
						data.bill_registration.extension_name = data.bill_registration.extension_name;
					}
					if (data.bill_registration.pt_house_number == null) {
						data.bill_registration.pt_house_number = "";
					} else {
						data.bill_registration.pt_house_number = data.bill_registration.pt_house_number;
					}
					if (data.bill_registration.pt_street == null) {
						data.bill_registration.pt_street = "";
					} else {
						data.bill_registration.pt_street = data.bill_registration.pt_street;
					}
				if (type == 0) {
					formReset("show","View Inpatient Bill Information");
					$(".view_div").empty();
					$("#form_card_body").append(
						"<div class='row view_div'>" +
							
							
						
							"<div class='col-md-12'>" +
							"<h5 class='text-info'>Personal Information</h5>" +
							"</div>" +
							"<div class='col-md-12'>" +
							"<section class='content'>"+
							"<div class='container-fluid'>"+
							  

					  
									"<div class='invoice p-3 mb-3'>"+
									"<div class='row'>"+
									  "<div class='col-12'>"+
										"<h4>"+
										  "<i class='fas fa-globe'></i>" +
										 " Homies, Inc "+
										  "<small class='float-right'>"+
										  
										  "Date: "+
										  current_date+
										  "</small>"+
										"</h4>"+
									  "</div>"+
									 "</div>"+

									 "<div class='row invoice-info'>"+
									  "<div class='col-sm-8 invoice-col'>"+
									  
										"<address>"+
										 
										  data.bill_registration.first_name +
										  " " +
										  data.bill_registration.middle_name +
										  " " +
										  data.bill_registration.last_name +
										  " " +
										  data.bill_registration.extension_name +
										 
										  "<br>"+
										  "Date of Birth: "+
										  data.bill_registration.pt_birthdate +
										"</address>"+
									  "</div>"+
															  
					
										
										"<div class='col-sm-4 invoice-col'>"+
										"<strong>"+
										"Bill No: "+
										data.temp_bill_no+
										"</strong>"+
										"<br>"+"Room No: "+
										data.bill_admission.room_number+
										"<br>"+
										"Room Type: " +
										data.bill_admission.room_type+
										"<br>"+
										"Dscount Type: "+
										data.bill_registration.pt_discount_type+
										"<br>"+
										"<br>"+
									   
									  "</div>"+
									"</div>"+
								
					  
									
									"<div class='row'>"+
									  "<div class='col-12 table-responsive'>"+
										"<table class='table table-hover text-nowrap'>"+
										  "<thead>"+
										  "<tr>"+
											"<th>Services</th>"+
											"<th>Amount</th>"+
										  "</tr>"+
										  "</thead>"+
										  "<tbody>"+
										  "<tr>"+
											"<td>Emergency Room</td>"+
											"<td>"+
											data.bill_admission.room_number+
											"</td>"+
										  "</tr>"+
										  "<tr>"+
											"<td>Laboratory</td>"+
											"<td>70,000.00</td>"+
										  "</tr>"+
															   
										  "<tr>"+
											"<td>Ultrasound</td>"+
											"<td>16,667.00</td>"+
										  "</tr>"+
				  
										  "<tr>"+
											"<td>Miscellaneous Charges </td>"+
											"<td>16,667.00</td>"+
										  "</tr>"+
										  "<tr>"+
											"<td><b>Total Service Charges</b></td>"+
											"<td>54,667.00</td>"+
										  "</tr>"+
										 " </tbody>"+
										"</table>"+
										"<table class='table table-hover text-nowrap'>"+
										  "<thead>"+
										  "<tr>"+
											"<th>Medicine</th>"+
											"<th> </th>"+
										  "</tr>"+
										  "</thead>"+
										  "<tbody>"+
											"<tr>"+
											  "<td>Gamot  &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;   </td>"+
											  "<td>9,000.00</td>"+
											"</tr>"+
										  "</tbody>"+
										"</table>"+
										"<table class='table table-hover text-nowrap'>"+
										  "<thead>"+
										  "<tr>"+
											"<th>Professional Fees</th>"+
											"<th> </th>"+
										  "</tr>"+
										  "</thead>"+
										  "<tbody>"+
										  "<tr>"+
											"<td>Bacayana, ALyana MD</td>"+
											"<td>12,000.00</td>"+
										  "</tr>"+
										  "<tr>"+
											"<td>Cruz, Juean MD</td>"+
											"<td>10,000.00</td>"+
										  "</tr>"+
										  "<tr>"+
											"<td><b>Total Professional Fees </b></td>"+
											"<td>22,000.00</td>"+
										  "</tr>"+
										  "</tbody>"+
										"</table>"+
										"<br>"+
										"<table class='table table-hover text-nowrap'>"+
										  "<thead>"+
										  "<tr>"+
											"<th>NET AMOUNT DUE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>"+
											"<th>85,667.00</th>"+
										  "</tr>"+
										  "</thead>"+
										"</table>"+
									  "</div>"+
									 
									"</div>"+
									
							  
					  
									
									"<div class='row no-print'>"+
									  "<div class='col-12'>"+
										"<a href='invoice-print.html' rel='noopener' target='_blank' class='btn btn-default'><i class='fas fa-print'></i> Print</a>"+
										
										"<button type='button' class='btn btn-primary float-right' style='margin-right: 5px;'>"+
										  "<i class='fas fa-download'>"+
										  "</i>"+
										  "Generate PDF"+
										"</button>"+
									  "</div>"+
									"</div>"+
								  "</div>"+
								  
								"</div>"+
								
							 " </div>"+
							
					
						
						"</section>"+
							"</div>" 
							 
					);
				}else if (type==1) {
					formReset("update","Update Inpatient Information");
					$("#uuid").val(data.inpatient_bill_id);
					$("#pt_first_name").val(data.bill_registration.first_name);
					$("#pt_middle_name").val(data.bill_registration.middle_name);
					$("#pt_last_name").val(data.bill_registration.last_name);
					$("#pt_extension_name").val(data.bill_registration.extension_name);
					$("#pt_birthdate").val(data.bill_registration.pt_birthdate);
					$("#pt_birthplace").val(data.pt_birthplace);
					$("#pt_gender").val(data.bill_registration.sex);
					$("#pt_civil_status").val(data.pt_civil_status);
					$("#pt_house_number").val(data.pt_house_number);
					$("#pt_street").val(data.pt_street);
					$("#pt_barangay").val(data.pt_barangay);
					$("#pt_city").val(data.pt_city);
					$("#pt_province").val(data.pt_province);
					$("#pt_country").val(data.pt_country);
					$("#pt_room_no").val(data.pt_room_no);
					$("#pt_room_type").val(data.pt_room_type);
					$("#date_admitted").val(data.date_admitted);
				
				
				}
			},
			error: function (data) {
				toastr.error(data.responseJSON.detail);
			},
		});
	};

	deleteData = (inpatient_bill_id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#e52d27",
			cancelButtonColor: "#748892",
			confirmButtonText: "Yes, delete it!",
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					url:
						apiURL + "inpatient/" + inpatient_bill_id + "/" + localStorage.USER_ID,
					type: "DELETE", // post, put, delete, get
					dataType: "json",
					success: function (data) {
						toastr.success("Record has been deleted.");
						loadInpatientTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			}
		});
	};
