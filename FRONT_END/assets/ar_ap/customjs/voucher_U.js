$(document).ready(function () {
	 

 
	// new Utilities validation
	$("#form_id").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var form_data = new FormData(form);

			if ($("#uuid").val() == "") {
				console.log("create")

				form_data.append("created_by", localStorage.USER_ID);
				console.log(form_data)
				// $.ajax({
				// 	url: apiURL + "utilities/",
				// 	type: "POST", // post, put, delete, get
				// 	data: form_data,
				// 	dataType: "json",
				// 	contentType: false,
				// 	processData: false,
				// 	cache: false,
				// 	success: function (data) {
				// 		toastr.success("New Utility has been created.");
				// 		formReset("hide", "");
				// 		resetFileInput(); 
				// 		loadUtilities_table();
				// 	},
				// 	error: function (data) {
				// 		toastr.error(data.responseJSON.detail);
				// 	},
				// });
			} else {
				console.log("update")

				form_data.append("updated_by", localStorage.USER_ID);
			 
				$.ajax({
					url: apiURL + "utilities/" + $("#uuid").val(),
					type: "PUT", // post, put, delete, get
					data: form_data,
					dataType: "json",
					contentType: false,
					processData: false,
					cache: false,
					success: function (data) {
						toastr.success("Utilities has been updated.");
						formReset("hide", "");
						resetFileInput();
						loadUtilities_table();
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
	loadUtilities_table = () => {
		$("#utilities_table").dataTable().fnClearTable();
		$("#utilities_table").dataTable().fnDraw();
		$("#utilities_table").dataTable().fnDestroy();
		$("#utilities_table").dataTable({
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
								columns: [0, 1, 2, 3, 4, 5, 6],
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
					data: "utility_type",
					name: "utility_type",

					searchable: true,
				},
                {
					data: "utility_name",
					name: "utility_name",

					searchable: true,
				}, 
				{
					data: "utility_bill",
					name: "utility_bill",

					searchable: true,
				},
				{
					data: "due_date",
					name: "due_date",

					searchable: true,
				}, 
                {
					data: "payment_method",
					name: "payment_method",

					searchable: true,
				},
                {
					data: "notes",
					name: "notes",

					searchable: true,
				},
                
				{
					data: null,
					render: function (aData, type, row) {
						let status = "";

						if (aData.status == "Active") {
							status +=
								'<span class="badge badge-success p-2 w-100">Active</span>';
						} 
						else if (aData.status == "Approved") {
							status +=
								'<span class="badge badge-info p-2 w-100">Approved</span>';
						} 
						else  {
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
							'<i class="fas fa-print mr-1 text-black"></i>' +
							"</div>" +
							"<div>Print Voucher</div>" +
							"</div>"+ '<div class="dropdown-divider"></div>';
						// if (aData.status != "Inactive") {
						// 	buttons +=
						// 		'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
						// 		aData["id"] +
						// 		"',1)\">" +
						// 		'<div style="width: 2rem">' +
						// 		'<i class="fas fa-edit mr-1 text-black"></i>' +
						// 		"</div>" +
						// 		"<div>Edit Details</div>" +
						// 		"</div>";
						// }
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" '+
								'onClick="return deleteData(\'' +
								aData["id"] +
								"')\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-trash-alt mr-1 text-black"></i>' +
								"</div>" +
								"<div>Delete Utility</div>" +
								"</div>";
						}

						// if (aData.status != "Inactive") {
						// 	buttons +=
						// 		'<div class="dropdown-item d-flex" role="button" '+
						// 		'onClick="return approvedData(\'' +
						// 		aData["id"] +
						// 		"')\">" +
						// 		'<div style="width: 2rem">' +
						// 		'<i class="fas fa-check mr-1 text-black "></i>' +
						// 		"</div>" + 
						// 		"<div>Approve Utility</div>" +
						// 		"</div>";
						// }
						// else if(aData.status == "Inactive"){
                        //    buttons += "<i>No available action</i>"
            			// }
						buttons += "</div>" + "</div>";
						return buttons; // same class in i element removed it from a element
					},
					sortable: false,
				},
			],

			ajax: {
				url: apiURL + "utilities/datatableApproved",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				let status = "";
				if (aData.status != "Inactive"){
					status += '<span class="badge badge-success p-2 w-100">Active</span>';
				}
				else{
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
					'<i class="fas fa-print mr-1 text-black"></i>' +
					"</div>" +
					"<div>Print Voucher</div>" +
					"</div>"+ '<div class="dropdown-divider"></div>';
				// if (aData.status != "Inactive") {
				// 	buttons +=
				// 		'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
				// 		aData["id"] +
				// 		"',1)\">" +
				// 		'<div style="width: 2rem">' +
				// 		'<i class="fas fa-edit mr-1 text-black"></i>' +
				// 		"</div>" +
				// 		"<div>Edit Details</div>" +
				// 		"</div>";
				// }
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" '+
						'onClick="return deleteData(\'' +
						aData["id"] +
						"')\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-trash-alt mr-1 text-black"></i>' +
						"</div>" +
						"<div>Delete Utility</div>" +
						"</div>";
				} 

				// if (aData.status != "Inactive") { 
				// 	buttons +=
				// 		'<div class="dropdown-item d-flex" role="button" '+
				// 		'onClick="return approvedData(\'' +
				// 		aData["id"] +
				// 		"')\">" +
				// 		'<div style="width: 2rem ">' +
				// 		'<i class="fas fa-check mr-1 text-black"></i>' +
				// 		"</div>" +
				// 		"<div>Approve Purchase Order</div>" +
				// 		"</div>";
				// }
				// else if(aData.status == "Inactive"){
				// 	buttons += "<i>No available action</i>"
				// }
				buttons += "</div>" + "</div>"; 
				$("td:eq(0)", nRow).html(aData["utility_type"]);
				$("td:eq(1)", nRow).html(aData["utility_name"]);
				$("td:eq(2)", nRow).html(aData["utility_bill"]);
				$("td:eq(3)", nRow).html(aData["due_date"]); 
				$("td:eq(4)", nRow).html(aData["payment_method"]);
				$("td:eq(5)", nRow).html(aData["notes"]);
                $("td:eq(6)", nRow).html(aData[status]); 
				$("td:eq(7)", nRow).html(buttons);
                
			},
			drawCallback: function (settings) {},
		});
	};

	loadUtilities_table();

	$(window).resize(function () {
		$("table.dataTable").resize();
	});

	//New Data
	$("#new_record").on("click", function () {
		formReset("new", "New Utilities");
	 
	});

	//view info
	viewData = (id, type) => {
		$.ajax({
			url: apiURL + "utilities/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				 
				if (type == 0) {
					formReset("show", "View Utilities Information");
					$(".view_div").empty();
					$("#form_card_body").append(
						"<div class='print_voucher row view_div'>" + //div for printing
							"<div class='col-md-12 text-center'>" +
								"<div class='card'>" +
								"</div>" +
							"</div>" +

							"<div class='col-md-12'>" +
								"<div class='col-md-12'>" +
									"<h5 class='text-info' style='text-align: center;'>HoMIS Voucher</h5>" +
									"<p style='text-align: center;'>" +
									"1234, Sample Road, Sample Municipality, Philippines" +
									"</p>" +
								"</div>" +

								"<br>" +
								"<hr style='width: 100%; border-width: 2px; border-color: #16A34A;'>" +
								"<br>" +
								
								"<div class='col-md-12'>" +
									"<table class='table table-borderless view-info-table'>" + 

										"<tr>" +
										"<th>Voucher No.</th>" +
										"<td>" +
										"000001" + 
										"</td>" +
										"<td></td>" +
										"<th>Utility Type</th>" +
										"<td>" +
										data.utility_type + 
										"<input type='hidden' id='utility_type' name='utility_type' value='"+data.utility_type + "'></input>"+  
										"</td>" +
										"</tr>" +

										"<tr>" +
										"<th>Vouching Date</th>" +
										"<td>" +
										"(Vouching Date)" + 
										"</td>" +
										"<td></td>" +
										"<th>Billing Date</th>" +
										"<td>" +
										"(Billing Date)" + 
										"</td>" +
										"</tr>" +

										"<tr>" +
										"<th><br><br></th>" +
										"</tr>" +
										
										"<tr>" +
										"<th>Utility Details:</th>" +
										"</tr>" +

										"<tr>" +
										"<td bgcolor='#F1FEF0'></td>" +
										"<th bgcolor='#F1FEF0'>Utility Name</th>" +
										"<th bgcolor='#F1FEF0'>Utility Bill</th>" +
										"<th bgcolor='#F1FEF0'>Due Date</th>" +
										"<th bgcolor='#F1FEF0'>Payment Method</th>" +
										"<td bgcolor='#F1FEF0'></td>" +
										"</tr>" +

										"<tr>" +
										"<td bgcolor='#F1FEF0'></td>" +
										"<td bgcolor='#F1FEF0'>" +
										data.utility_name + 
										"<input type='hidden' id='utility_name' name='utility_name' value='"+data.utility_name+ "'></input>"+
										"</td>" +
										"<td bgcolor='#F1FEF0'>" +
										data.utility_bill +
										"<input type='hidden' id='utility_bill' name='utility_bill' value='"+data.utility_bill+ "'></input>"+
										"</td>" +
										"<td bgcolor='#F1FEF0'>" +
										moment(data.due_date).format("MMMM D, YYYY") +
										"<input type='hidden' id='due_date' name='due_date' value='"+data.due_date+ "'></input>"+
										"</td>" +
										"<td bgcolor='#F1FEF0'>" +
										data.payment_method +
										"<input type='hidden' id='payment_method' name='payment_method' value='"+data.payment_method+ "'></input>"+
										"</td>" +
										"<td bgcolor='#F1FEF0'></td>" +
										"</tr>" +

										"<tr>" +
										"<th><br><br></th>" +
										"</tr>" +	

										"<tr>" +
										"<th>Notes</th>" +
										"<td>" +
										data.notes +
										"<input type='hidden' id='notes' name='notes' value='"+data.notes+ "'></input>"+
										"</td>" +
										"</tr>" +

										"<tr>" +
										"<th><br><br></th>" +
										"</tr>" +	

										"<tr>" +
										"<th>Approved By: </th>" +
										"<td>" +
										"Authorizer Name Here" +
										"</td>" +
										"<td></td>" +
										"<th>Prepared By: </th>" +
										"<td>" +
										"Name Here" +
										"</td>" +
										"</tr>" +

										"<tr>" +
										"<th>Signature: </th>" +
										"<td>" +
										"Signature Here" +
										"</td>" +
										"<td></td>" +
										"<th>Signature: </th>" +
										"<td>" +
										"Signature Here" +
										"</td>" +
										"</tr>" +

										"<tr>" +
										"<th><br><br></th>" +
										"</tr>" +	

							
									"</table>" +
								"</div>" +
							"</div>" +

							"<div class='col-md-8 text-center'>" +
								"<div class='card'>" +
								"</div>" +
							"</div>" + 
						"</div>" +
						// console.log(mode)+
						"<div style='float: right;'>" +
							"<button class='btn btn-primary btn-sm' onclick='print()'>Print Voucher</button><br>" +
						"</div>"

					);
				} else if (type == 1) {
					formReset("update", "Update Utilities Information");
					$("#uuid").val(data.id);
					$("#utility_type").val(data.utility_type); 
					$("#utility_name").val(data.utility_name); 
					$("#utility_bill").val(data.utility_bill);  
					$("#due_date").val(data.due_date); 
					$("#payment_method").val(data.payment_method);
					$("#notes").val(data.notes);
					$("#status").val(data.status);
					
				}
			},
			error: function (data) {
				toastr.error(data.responseJSON.detail);
			},
		});
	};

	approvedData = (id) => {
		$('#modal_approved').modal('show')
		$("#modal_approved").validate({
			submitHandler: function (form, e) {
				e.preventDefault();
				trimInputFields();
				$.ajax({
					url: apiURL + "utilities/" + id + "/" + localStorage.USER_ID,
					type: "PUT", // post, put, delete, get
					dataType: "json",
					success: function (data) {
						toastr.success("Record has been Approved.");
						$('#modal_approved').modal('hide')
						loadUtilities_table();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
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
					url: apiURL + "utilities/" + id + "/" + localStorage.USER_ID,
					type: "DELETE", // post, put, delete, get
					dataType: "json",
					success: function (data) {
						toastr.success("Record has been deactivated.");
						$('#modal_delete').modal('hide')
						loadUtilities_table();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			},
		});

	};

	
	

});

function print(){ 
	var mode = 'iframe';
	var close = mode == "popup";
	var options = {mode:mode,popClose:close}
	$("div.print_voucher").printArea(options) 

}