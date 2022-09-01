$(document).ready(function () {
	 

 
	// new purchase order validation
	$("#form_id").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var form_data = new FormData(form);

			if ($("#uuid").val() == "") {
				form_data.append("created_by", localStorage.USER_ID);
				$.ajax({
					url: apiURL + "purchase_order/",
					type: "POST", // post, put, delete, get
					data: form_data,
					dataType: "json",
					contentType: false,
					processData: false,
					cache: false,
					success: function (data) {
						toastr.success("New purchase order has been created.");
						formReset("hide", "");
						resetFileInput(); 
						loadPurchase_orderTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else {
				form_data.append("updated_by", localStorage.USER_ID);
				// if ($("#photo").val() == "") {
				// 	form_data.delete("photo");
				// }
				$.ajax({
					url: apiURL + "purchase_order/" + $("#uuid").val(),
					type: "PUT", // post, put, delete, get
					data: form_data,
					dataType: "json",
					contentType: false,
					processData: false,
					cache: false,
					success: function (data) {
						toastr.success("Purchase order has been updated.");
						formReset("hide", "");
						resetFileInput();
						loadPurchase_orderTable();
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
	loadPurchase_orderTable = () => {
		$("#purchase_order_table").dataTable().fnClearTable();
		$("#purchase_order_table").dataTable().fnDraw();
		$("#purchase_order_table").dataTable().fnDestroy();
		$("#purchase_order_table").dataTable({
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
					data: "purchase_order_number",
					name: "purchase_order_number",

					searchable: true,
				},
				{
					data: "total_bill",
					name: "total_bill",

					searchable: true,
				},
				{
					data: "order_date",
					name: "order_date",

					searchable: true,
				},
                {
					data: "expected_delivery_date",
					name: "expected_delivery_date",

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
							'<i class="fas fa-eye mr-1 text-black"></i>' +
							"</div>" +
							"<div>View Details</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 text-black"></i>' +
								"</div>" +
								"<div>Edit Details</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" '+
								'onClick="return deleteData(\'' +
								aData["id"] +
								"')\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-trash-alt mr-1 text-black"></i>' +
								"</div>" +
								"<div>Delete Purchase Order</div>" +
								"</div>" ;
						}
						 
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" '+
								'onClick="return approvedData(\'' +
								aData["id"] +
								"')\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-check mr-1 text-black "></i>' +
								"</div>" + 
								"<div>Approve Purchase Order</div>" +
								"</div>";
						}
						else if(aData.status == "Inactive"){
                           buttons += "<i>No available action</i>"
            			}
						buttons += "</div>" + "</div>";
						return buttons; // same class in i element removed it from a element
					},
					
					sortable: false
				},
			],

			ajax: {
				url: apiURL + "purchase_order/datatable",
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
					'<i class="fas fa-eye mr-1 text-black"></i>' +
					"</div>" +
					"<div>View Details</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 text-black"></i>' +
						"</div>" +
						"<div>Edit Detail</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" '+
						'onClick="return deleteData(\'' +
						aData["id"] +
						"')\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-trash-alt mr-1 text-black"></i>' +
						"</div>" +
						"<div>Delete Purchase Order</div>" +
						"</div>" + '<div class="dropdown-divider"></div>';
				}
						
				if (aData.status != "Inactive") { 
					buttons +=
						'<div class="dropdown-item d-flex" role="button" '+
						'onClick="return approvedData(\'' +
						aData["id"] +
						"')\">" +
						'<div style="width: 2rem ">' +
						'<i class="fas fa-check mr-1 text-black"></i>' +
						"</div>" +
						"<div>Approve Purchase Order</div>" +
						"</div>";
				}
				else if(aData.status == "Inactive"){
					buttons += "<i>No available action</i>"
				}
				buttons += "</div>" + "</div>"; 
				$("td:eq(0)", nRow).html(aData["purchase_order_number"]);
				$("td:eq(1)", nRow).html(aData["total_bill"]);
				$("td:eq(2)", nRow).html(aData["order_date"]);
				$("td:eq(3)", nRow).html(aData["expected_delivery_date"]);
				$("td:eq(4)", nRow).html(aData["payment_method"]);
				$("td:eq(5)", nRow).html(aData["notes"]);
        		$("td:eq(6)", nRow).html(aData[status]);
				$("td:eq(7)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
		});
	};

	loadPurchase_orderTable();

	$(window).resize(function () {
		$("table.dataTable").resize();
	});

	//New Data
	$("#new_record").on("click", function () {
		formReset("new", "New Purchase Order");
	 
	});

	//view info
	viewData = (id, type) => {
		$.ajax({
			url: apiURL + "purchase_order/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				
				if (type == 0) {
					formReset("show", "View Purchase Order Information");
					$(".view_div").empty();
					$("#form_card_body").append(
						"<div class='row view_div'>" +
							"<div class='col-md-4 text-center'>" +
							"<div class='card'>" +
							
							"</div>" +
							"</div>" +
							"<div class='col-md-8'>" +
							"<div class='col-md-12'>" +
							"<h5 class='text-info'>Purchase Order Information</h5>" +
							"</div>" +
							"<div class='col-md-12'>" +
							"<table class='table table-borderless view-info-table'>" + 

							"<tr>" +
							"<th>Purchase Order No.</th>" +
							"<td>" +
							data.purchase_order_number + 
							"</td>" +
							"</tr>" +

							"<tr>" +
							"<th>Total Bill</th>" +
							"<td>" +
							data.total_bill +
							"</td>" +
							"</tr>" +

							"<tr>" +
							"<th>Order Date</th>" +
							"<td>" +
							moment(data.order_date).format("MMMM D, YYYY") +
							"</td>" +
							"</tr>" +
							
							"<tr>" +
							"<th>Expected Delivery Date</th>" +
							"<td>" +
							moment(data.expected_delivery_date).format("MMMM D, YYYY") +
							"</td>" +
							"</tr>" +

							"<tr>" +
							"<th>Payment Method</th>" +
							"<td>" +
							data.payment_method +
							"</td>" +
							"</tr>" +

							"<tr>" +
							"<th>Notes</th>" +
							"<td>" +
							data.notes +
							"</td>" +
							"</tr>" +

							"<tr>" +
							"<th>Status</th>" +
							"<td>" +
							data.status +
							"</td>" +
							"</tr>" +

							
							"</table>" +
							"</div>" +
							 
							
							"</div>" +
							"</div>"
					);
				} else if (type == 1) {
					formReset("update", "Update Purchase Order Information");
					$("#uuid").val(data.id);
					$("#purchase_order_number").val(data.purchase_order_number); 
					$("#total_bill").val(data.total_bill);  
					$("#order_date").val(data.order_date);
					$("#expected_delivery_date").val(data.expected_delivery_date); 
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
					url: apiURL + "purchase_order/" + id + "/" + localStorage.USER_ID,
					type: "PUT", // post, put, delete, get
					dataType: "json",
					success: function (data) {
						toastr.success("Record has been Approved.");
						$('#modal_approved').modal('hide')
						loadPurchase_orderTable();
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
					url: apiURL + "purchase_order/" + id + "/" + localStorage.USER_ID,
					type: "DELETE", // post, put, delete, get
					dataType: "json",
					success: function (data) {
						toastr.success("Record has been deactivated.");
						$('#modal_delete').modal('hide')
						loadPurchase_orderTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			},
		});

	};

	


});
