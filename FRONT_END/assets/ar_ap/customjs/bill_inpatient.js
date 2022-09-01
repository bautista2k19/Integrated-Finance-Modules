// computes net charges
const computeNetCharges = (cancel_return) => {
	let cancel_return_amount = cancel_return.value;
	if ( cancel_return_amount != '' && parseFloat(cancel_return_amount) > 0 ) {
	  cancel_return_amount = parseFloat(cancel_return_amount);
	  const charge = parseFloat($(cancel_return).parent().prev().prev().find('label').text());
	  const quantity = parseFloat($(cancel_return).parent().prev().find('label').text());
	  const net_charge1 = quantity - cancel_return_amount;
	  const net_charge = net_charge1* charge	
	  return $(cancel_return).parent().next().find('label').text(net_charge); 
	} 
	return;
};


// computes net charges
const computeDiscount = (cancel_return) => {
	let cancel_return_amount = cancel_return.value;
	if ( cancel_return_amount != '' && parseFloat(cancel_return_amount) > 0 ) {
	  cancel_return_amount = parseFloat(cancel_return_amount);
	  const charge = parseFloat($(cancel_return).parent().prev().find('label').text());
	  const quantity = parseFloat($(cancel_return).parent().prev().find('label').text());
	  const discount = (quantity / 100)
	  console.log(discount)
	  const net_charge1 = cancel_return_amount *discount;
	  const net_charge = net_charge1* charge	
	  return $(cancel_return).parent().next().find('label').text(net_charge); 
	} 
	return;
};



$(document).ready(function () {
	//date attribute
	//get current date to restrict input of future dates
	var current_date = new Date();
	current_date = current_date.toISOString().split("T")[0];
	$("#date_discharge").attr("max", current_date);
	

	// new inpatient bill validation
	$("#form_id").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var form_data = new FormData(form);
			if ($("#uuid").val() == "") {
				form_data.append("created_by", localStorage.USER_ID);
				$.ajax({
					url: apiURL + "inpatient_bills/",
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
				// list of data
                var data_list = [];
                // get all rows of tableParticulars
                const rows = $('#tableParticulars tbody > tr');
				tableLabRequest
                // traverse each row
                for (row of rows) {
                  	const cancellation_return = $(row).find('input').val();
                  	const net_charge = $(row).children('td:last-of-type').children('label').text()
                  	// data
                  	const data ={
						'treatment_id': row.id,
						'total_amount': net_charge,
						'cancellation_return': parseFloat(cancellation_return),
                 	};
                 	// add data to data list
                	data_list.push(data);
                }


				//FOR LAB REEQUEST
                var lab_request_list = [];
                const rows_lab = $('#tableLabRequest tbody > tr');
                for (row of rows_lab) {
                  	const cancellation_return = $(row).find('input').val();
                  	const net_charge = $(row).children('td:last-of-type').children('label').text()
                  	const data ={
						'lab_requests_id': row.id,
						'total_amount': net_charge,
						'cancellation_return': parseFloat(cancellation_return),
                 	};
					lab_request_list.push(data);
                }

				//FOR MEDICINE PRESCRIPTION / PHARMACY
                var med_pr_list = [];
                const rows_med_pr = $('#tablePharmacy tbody > tr');
                for (row of rows_med_pr) {
                  	const cancellation_return = $(row).find('input').val();
                  	const net_charge = $(row).children('td:last-of-type').children('label').text()
                  	const data ={
						'medpr_id': row.id,
						'total_amount': net_charge,
						'cancellation_return': parseFloat(cancellation_return),
                 	};
					med_pr_list.push(data);
                }

                // test
				console.log(med_pr_list)
                console.log(typeof med_pr_list)
				const tmp_admission_id = $("#hide_admission_id").val()

				const data_room ={
					'admission_id': tmp_admission_id,
				 };

				var bill_room_tmp = [];
				bill_room_tmp.push(data_room);
				
				// const admission_id ="4f059da6-6557-444b-953e-ae6c3abc1621"
				// console.log(` my uuid: ${$("#uuid").val()}`)
				form_data.append("updated_by", localStorage.USER_ID);
				$.ajax({
					url: apiURL +  "inpatient_bills/admission_id/"+ $("#uuid").val() + "/update" ,
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						admission_id:$("#hide_admission_id").val(),
						balance_due: 21039,
						updated_by: localStorage.USER_ID,
						bill_treatments:  data_list,
						bill_lab_requests:lab_request_list,
						bill_pharmacy:med_pr_list,
						bill_room: bill_room_tmp


					}),
					dataType:"json",
					success: function (data) {
						toastr.success(" Inpatient bill has been updated.");
						formReset("hide", "");
						loadInpatientBill();
					},
					contentType: "application/json",
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
	loadInpatientBill = () => {
		$("#bill_table").dataTable().fnClearTable();
		$("#bill_table").dataTable().fnDraw();
		$("#bill_table").dataTable().fnDestroy();
		$("#bill_table").dataTable({
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
						let full_name = "";
						full_name += aData.inpatient_info.patient_info.first_name + " " + aData.inpatient_info.patient_info.last_name;
						return full_name;
					},
					searchable: true,
				},
				{
					data: "inpatient_info.patient_info.sex",
					name: "inpatient_info.patient_info.sex",
					searchable: true,
				},

				{
					data: "inpatient_info.date_admitted",
					name: "inpatient_info.date_admitted",
					searchable: true,
				},

				{
					data: null,
					render: function (aData, type, row) {
						let admission_info_length = aData.inpatient_info.admission_info.length
						let last_room_number = admission_info_length -1

						if (last_room_number > 0) {
							room_number_admission_info = aData.inpatient_info.admission_info[last_room_number].room_number;
						} else {
							room_number_admission_info = "No Room"
						}
						return room_number_admission_info
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let inpt_info_length = aData.inpatient_info.inpatient_bill_info.length
						for (let j = 0; j < inpt_info_length; j++) {
							if (inpt_info_length > 0) {
							npatient_info_balance_due = aData.inpatient_info.inpatient_bill_info[j].balance_due;
							} else {
								npatient_info_balance_due = "No Balance Due"
							}
						}
						return npatient_info_balance_due
					},
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let status = "";
						if (aData.status != "Fully paid") {
							status +=
								'<span class="badge badge-success p-2 w-100">Not yet fully paid</span>';
						} else {
							status +=
								'<span class="badge badge-danger p-2 w-100">Fully paid</span>';
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
							"<div>View bill</div>" +
							"</div>";
						if (aData.status != "Not yet fully paid") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 text-info"></i>' +
								"</div>" +
								"<div>Edit Bill</div>" +
								"</div>";
						}
						if (aData.status != "Not yet fully paid") {
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
				url: apiURL + "inpatient_bills/datatable",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				let full_name = "";
				full_name += aData.inpatient_info.patient_info.first_name + " " + aData.inpatient_info.patient_info.last_name;
				let status = "";
				if (aData.status != "Fully paid") {
					status += '<span class="badge badge-success p-2 w-100">Not yet fully paid</span>';
				} else {
					status +=
						'<span class="badge badge-danger p-2 w-100">Fully paid</span>';
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
					"<div>Update Bill</div>" +
					"</div>";
				if (aData.status != "Fully paid") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 text-info"></i>' +
						"</div>" +
						"<div>Edit Bill</div>" +
						"</div>";
				}
				if (aData.status != "Fully paid") {
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
				$("td:eq(0)", nRow).html(full_name);
				$("td:eq(1)", nRow).html(aData["patient_info.sex"]);
				$("td:eq(2)", nRow).html(aData["date_admitted"]);
				$("td:eq(3)", nRow).html(aData["room.room_number"]);
				$("td:eq(4)", nRow).html(aData["room_transfer_id"]);
				$("td:eq(5)", nRow).html(status);
				$("td:eq(6)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
		});
	};
	loadInpatientBill();




	
//view update info
viewData = (id, type) => {
	var admission_id;
    $.ajax({
        url: apiURL + "inpatient_bills/" + id,
        type: "GET", // post, put, delete, get
        async: false,
        dataType: "json",
        success: function (data) {
            var data_ito;
			const admission_id = data.admission_id;
            const patient_id_all = data.inpatient_info.patient_info.patient_id;
            $.ajax({
                url: apiURL + "treatments/find_all_for_billing/" + patient_id_all,
                type: "GET", // post, put, delete, get
                dataType: "json",
                async: false,
                success: function (data) {
                    data_ito = data;
                },
            });
				
				let treatment_list = "";
				let treatment_table ="";
				if (data_ito != null) {
					const data_length = data_ito.length;
					console.log(data_length);
					
					for (let i = 0; i < data_length; i++) {
						let unit_price_let = data_ito[i].treatment_name.unit_price;
						let quantity_let = data_ito[i].quantity;
						let return_treatment = data_ito[i].cancellation_return;
						let new_quantity = quantity_let - return_treatment;
	
						const net_charge_treatment = new_quantity * unit_price_let;
						var curr_date = data_ito[i].session_datetime;
						var datedate = new Date(curr_date).toLocaleDateString("en-US");
						
						

						treatment_list +=
							"<tr id='" +
							data_ito[i].id +
							"'>" +
							"<td class='col-md-6 mb-6'>" +
							"<label style='font-weight: normal;'>" +
							data_ito[i].treatment_name.treatment_type_info.treatment_type_name +
							"</label>" +
							"</td>" +
							"<td class='col-md-6 mb-6'>" +
							"<label style='font-weight: normal;'" +
							" >" +
							data_ito[i].treatment_name.treatment_service_name +
							"</label>" +
							"</td>" +
							// DATE
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal; '" +
							">" +
							datedate +
							"</label>" +
							"</td>" +
							// UNIT PRICE
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal; '" +
							">" +
							data_ito[i].treatment_name.unit_price +
							"</label>" +
							"</td>" +
							// QUANTITY bill_treatments[i].treatment_id_info.quantity
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal;'" +
							">" +
							data_ito[i].quantity +
							"</label>" +
							"</td>" +
							// cancellation amount
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<input class='form-control' type='text' id='" +
							"' oninput='return computeNetCharges(this);' " +
							"value='" +
							return_treatment +
							"'" +
							"'placeholder='" +
							return_treatment +
							"'>" +
							"</td>" +
							// net charged
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal;  '" +
							">" +
							net_charge_treatment +
							"</label>" +
							"</td>" +
							"</tr>";
					}

					treatment_table=
					"<table class='table table-bordered' id='tableParticulars'>" +
					"<thead>" +
					"<tr>" +
					"<th class='col-md-1 mb-1'>Type</th>" +
					"<th class='col-md-1 mb-1'>Particulars</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Date</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Charges</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Quantity</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Cancellation " +
					"<br>" +
					"/Return</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Net Charges</th>" +
					"</tr>" +
					"</thead>" +
					"<tbody class='tbodyclass'>" +
					treatment_list +
					"</tbody>" +
					"</table>"
	
				}
				else{
					treatment_table =  "Patient hadn't done any treatments yet"
				}

			
				
			// LAB REQUEST --------------------------------------------------------------------------
			var data_lab;
			$.ajax({
                url: apiURL + "lab_requests/find_all_for_billing/" + patient_id_all,
                type: "GET", // post, put, delete, get
                dataType: "json",
                async: false,
                success: function (data) {
                    data_lab = data;
                },
            });
				
				let lab_request_list = "";
				let lab_request_table ="";
				if (data_lab != null) {
					const data_length = data_lab.length;
					console.log(data_lab);
					
					for (let j = 0; j < data_length; j++) {
						let unit_price_let = data_lab[j].lab_test_id_info.unit_price	;
						let quantity_let = data_lab[j].quantity;
						let return_lab_request = data_lab[j].cancellation_return;
						let new_quantity = quantity_let - return_lab_request;
	
						const net_charge_lab_request = new_quantity * unit_price_let;
						var curr_date = data_lab[j].created_at;
						var datedate = new Date(curr_date).toLocaleDateString("en-US");
						console.log(net_charge_lab_request)
						

						lab_request_list +=
							"<tr id='" +
							data_lab[j].id +
							"'>" +
							"<td class='col-md-6 mb-6'>" +
							"<label style='font-weight: normal;'>" +
							data_lab[j].lab_test_id_info.lab_test_types_id_info.lab_test_type_name +
							"</label>" +
							"</td>" +
							"<td class='col-md-6 mb-6'>" +
							"<label style='font-weight: normal;'" +
							" >" +
							data_lab[j].lab_test_id_info.lab_service_name +
							"</label>" +
							"</td>" +
							// DATE
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal; '" +
							">" +
							datedate +
							"</label>" +
							"</td>" +
							// UNIT PRICE
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal; '" +
							">" +
							data_lab[j].lab_test_id_info.unit_price +
							"</label>" +
							"</td>" +
							// QUANTITY bill_lab_requests[j].lab_request_id_info.quantity
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal;'" +
							">" +
							data_lab[j].quantity +
							"</label>" +
							"</td>" +
							// cancellation amount
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<input class='form-control' type='text' id='" +
							"' oninput='return computeNetCharges(this);' " +
							"value='" +
							return_lab_request +
							"'" +
							"'placeholder='" +
							return_lab_request +
							"'>" +
							"</td>" +
							// net charged
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal;  '" +
							">" +
							net_charge_lab_request +
							"</label>" +
							"</td>" +
							"</tr>";
					}

					lab_request_table=
					"<table class='table table-bordered' id='tableLabRequest'>" +
					"<thead>" +
					"<tr>" +
					"<th class='col-md-1 mb-1'>Types</th>" +
					"<th class='col-md-1 mb-1'>Particulars</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Date</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Charges</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Quantity</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Cancellation " +
					"<br>" +
					"/Return</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Net Charges</th>" +
					"</tr>" +
					"</thead>" +
					"<tbody class='tbodyclass'>" +
					lab_request_list +
					"</tbody>" +
					"</table>"
	
				}
				else{
					lab_request_table =  "Patient hadn't done any lab_requests yet"
				}
            
			// PHARMACY --------------------------------------------------------------------------
			var data_pharma;
			$.ajax({
                url: apiURL + "medicine_pr/find_all_for_billing/" + admission_id,
                type: "GET", // post, put, delete, get
                dataType: "json",
                async: false,
                success: function (data) {
                    data_pharma = data;
					},
				});
				
				let med_pr_list = "";
				let med_pr_table ="";
				if (data_pharma != null) {
					const data_length = data_pharma.length;
					console.log(data_pharma);
					
					for (let j = 0; j < data_length; j++) {
						let unit_price_let = data_pharma[j].medicine_info.med_unit_price;
						let quantity_let = data_pharma[j].quantity;
						let med_pr_return = data_pharma[j].cancellation_return;
						let new_quantity = quantity_let - med_pr_return;
	
						const net_charge_med_pr = new_quantity * unit_price_let;
						var curr_date = data_pharma[j].created_at;
						var datedate = new Date(curr_date).toLocaleDateString("en-US");
						console.log(data_pharma[j].medpr_id)
						

						med_pr_list +=
							"<tr id='" +
							data_pharma[j].medpr_id +
							"'>" +
							"<td class='col-md-6 mb-6'>" +
							"<label style='font-weight: normal;'>" +
							data_pharma[j].medicine_info.med_product_name +
							"</label>" +
							"</td>" +
							"<td class='col-md-6 mb-6'>" +
							"<label style='font-weight: normal;'" +
							" >" +
							data_pharma[j].prescription_info.prescription_no+
							"</label>" +
							"</td>" +
							// DATE
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal; '" +
							">" +
							datedate +
							"</label>" +
							"</td>" +
							// UNIT PRICE
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal; '" +
							">" +
							data_pharma[j].medicine_info.med_unit_price+
							"</label>" +
							"</td>" +
							// QUANTITY bill_lab_requests[j].lab_request_id_info.quantity
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal;'" +
							">" +
							data_pharma[j].quantity +
							"</label>" +
							"</td>" +
							// cancellation amount
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<input class='form-control' type='text' id='" +
							"' oninput='return computeNetCharges(this);' " +
							"value='" +
							med_pr_return +
							"'" +
							"'placeholder='" +
							med_pr_return +
							"'>" +
							"</td>" +
							// net charged
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal;  '" +
							">" +
							net_charge_med_pr +
							"</label>" +
							"</td>" +
							"</tr>";
					}

					med_pr_table=
					"<table class='table table-bordered' id='tablePharmacy'>" +
					"<thead>" +
					"<tr>" +
					"<th class='col-md-1 mb-1'>Types</th>" +
					"<th class='col-md-1 mb-1'>Particulars</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Date</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Charges</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Quantity</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Cancellation " +
					"<br>" +
					"/Return</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Net Charges</th>" +
					"</tr>" +
					"</thead>" +
					"<tbody class='tbodyclass'>" +
					med_pr_list +
					"</tbody>" +
					"</table>"
	
				}
				else{
					med_pr_table =  "Patient hadn't done any lab_requests yet"
				}
               
                
				// ROOM BILL --------------------------------------------------------------------------
				var data_room;
				$.ajax({
					url: apiURL + "room_bill/find_all_for_billing/" + admission_id,
					type: "GET", // post, put, delete, get
					dataType: "json",
					async: false,
					success: function (data) {
						data_room = data;
					},
				});
					
				let room_bill_list = "";
				let room_bill_table ="";
				if (data_room != null) {
					const data_length = data_room[0].length;
					console.log(data_room);
					
					for (let j = 0; j < data_length; j++) { 
						let unit_price_let = data_room[1][j].room_type_info.amount	;
						let quantity_let = data_room[1][j].quantity;
						let return_lab_request = data_room[1][j].cancellation_return;
						let new_quantity = quantity_let - return_lab_request;
	
						const net_charge_lab_request = new_quantity * unit_price_let;
						var curr_date = data_room[1][j].date_admitted
						var datedate = new Date(curr_date).toLocaleDateString("en-US");

						const room_rate = data_room[1][j].room_type_info.amount
						const date_days = data_room[0][j]
						const room_charges = room_rate* date_days
						console.log(data_room[0][j])

						room_bill_list +=
							"<tr id='" +
							data_room[1][j].id +
							"'>" +
							"<td class='col-md-3 mb-3'>" +
							"<label style='font-weight: normal;'>" +
							data_room[1][j].room_number+
							// data_room[j].lab_test_id_info.lab_test_types_id_info.lab_test_type_name +
							"</label>" +
							"</td>" +
							"<td class='col-md-3 mb-3'>" +
							"<label style='font-weight: normal;'" +
							" >" +
							datedate+
							// data_room[j].lab_test_id_info.lab_service_name +
							"</label>" +
							"</td>" +
							// DATE
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal; '" +
							">" +
							data_room[1][j].room_type_info.room_type_name +
							"</label>" +
							"</td>" +
							// UNIT PRICE
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal; '" +
							">" +
							data_room[1][j].room_type_info.amount +
							"</label>" +
							"</td>" +
							
							// cancellation amount
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal;  '" +
							">" +
							data_room[0][j]+
							"</label>" +
										// "<input class='form-control' type='text' id='" +
										// "' oninput='return computeDiscount(this);' " +
										// "value='" +
										// // return_lab_request +
										// "'" +
										// "'placeholder='" +
										// // return_lab_request +
										// "'>" +
							"</td>" +
							// net charged
							"<td class='col-md-2 mb-2' style='text-align:right'>" +
							"<label style='font-weight: normal;  '" +
							">" +
							room_charges+
							"</label>" +
							"</td>" +
							"</tr>";
					}

					room_bill_table=
					"<table class='table table-bordered' id='tableRoomBill'>" +
					"<thead>" +
					"<tr>" +
					"<th class='col-md-1 mb-1'>Room Number</th>" +
					"<th class='col-md-1 mb-1'>Date transferred</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Room type</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Rate</th>" +
					// "<th class='col-md-1 mb-1'style='text-align:right'>Quantity</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Number of days " +
					"</th>" +
					"<th class='col-md-1 mb-1'style='text-align:right'>Net Charges</th>" +
					"</tr>" +
					"</thead>" +
					"<tbody class='tbodyclass'>" +
					room_bill_list +
					"</tbody>" +
					"</table>"
	
				}
				else{
					room_bill_table =  "Patient is not discharge yet"
				}
            
             
                //===================================================//
                formReset("show", "Inpatient Bill Information");
                $("#uuid").val(id);
				$("#hide_admission_id").val(data.admission_id)
                $(".view_div").empty();
                $("#save_button").show();
                $("#form_card_body").append(
                    // "<div class='row view_div'>"+
                    "<div class='row form_div'>" +
                        "<input type='hidden' id='uuid' name='uuid' />" +
                        "</div>" +
                        "<div class='col-md-12'>" +
                        //////////////////////////////////////////////////////////////////
                        "<div class='row view_div'>" +
                        "<div class='col-md-12'>" +
                        "<h5 class='text-info'>Personal Information</h5>" +
                        "</div>" +
                        "<div class='col-md-12'>" +
                        "<div class='invoice p-3 mb-3'>" +
                        "<!-- title row --> " +
                        "<div class='row'>" +
                        "<h5><i class='fas fa-globe'></i> HoMIES, Inc.	</h5>" +
                        "</div>" +
                        " <!-- /title row --> " +
                        "<!-- info row -->" +
                        "<div class='row invoice-info'>" +
                        "<div class='col-sm-8 invoice-col'>" +
                        "795 Folsom Ave, Suite 600 San Francisco, CA 94107<br>" +
                        "Phone: (804) 123-5432<br>" +
                        "Email: info@almasaeedstudio.com <br><br>" +
                        "Name: " +
                        data.inpatient_info.patient_info.first_name +
                        " " +
                        data.inpatient_info.patient_info.middle_name +
                        " " +
                        data.inpatient_info.patient_info.last_name +
                        "<br> " +
                        // data.bill_registration.extension_name + "<br> "+
                        "Address: " +
                        data.inpatient_info.patient_info.address +
                        "<br> " +
                        " " +
                        // data.bill_registration.pt_street +
                        " " +
                        // data.bill_registration.pt_barangay +
                        " " +
                        // data.bill_registration.pt_city +
                        " " +
                        // data.bill_registration.pt_province +
                        " " +
                        // data.bill_registration.pt_country + "<br>"+
                        "Age: " +
                        data.inpatient_info.patient_info.birthday +
                        "<br>" +
                        "Attending Physician: <br><br> " +
                        "</div>" +
                        "<div class='col-sm-4 invoice-col'>" +
                        "<b>Inpatient Statement Account</b> <br>" +
                        "Date: " +
                        data.date_of_billing +
                        "<br> " +
                        "Bill No: " +
                        data.inpatient_bill_no +
                        "<br>" +
                        "Room No: " +
                        data.inpatient_info.admission_info[0].room_number +
                        "<br>" +
                        "Room Rate: " +
                        data.inpatient_info.admission_info[0].room_type_info.amount +
                        "<br>" +
                        "Date and Time Admittted: " +
                        data.inpatient_info.date_admitted +
                        "<br>" +
                        "Date and Time Discharged: 2/22/2014" +
                        "<br>" +
                        // "<input class='form-control'  type='date' name='date_discharge' id='date_discharge' required data-msg-required='Please enter birthdate.'"+
                        // "/>"+
                        "</div>" +
                        "</div>" +
                        "<!-- /.row -->" +
                        "<br>" +
                        //////////////////////////////////////////////////////
                        "<div class='row invoice-info'>" +
                        treatment_table+
						lab_request_table+
						med_pr_table+
						room_bill_table+
                        "</div>" +
                        // "<button type='button' id='compute' onclick='myFunction()'>Compute</button>" +
                       

                        /////////////////////////////////////////// CANCELLATION RETURN
                        // VIEW INPATIENT BILL
                        "<!-- info row -->" +
                        "<div class='row invoice-info'>" +
                        "<div class='line'  style='width:98%;border-top: 1px solid black;position: absolute; '></div>" +
                        "<div class='line'  style='width:98%;border-top: 1.5px solid black;position: absolute; margin-top: 2px; '></div>" +
                        "<div class='col-sm-8 invoice-col'>" +
                        "</div>" +
                        "<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
                        "<b>Balance Due:</b>" +
                        "</div>" +
                        "<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
                        "<b> " +
                        // total_bill_balance+"</b>" +
                        "</div>" +
                        "</div>" +
                        "<br> <br>" +
                        "<!-- /.row -->" +
                        "<div class='row'>" +
                        "<!-- accepted payments column -->" +
                        "<div class='col-6'>" +
                        "<p>" +
                        "PhilHealth deducted by: " +
                        "<br><br>" +
                        "Billing Clerk:" +
                        "</p>" +
                        "</div>" +
                        "</div>" +
                        "<!-- /.row -->" +
                        "<br>" +
                        "<p class='lead' style='font-size: 12px; margin-bottom: 50px;'> NOTE:LATE CHARGES WILL BE BILLED TO YOU LATER</p>" +
                        //////////////////////////////////////////////////////
                        "</div>" +
                        ////////////////////////////////////////////////////////////////////
                        "</div>" +
                        "</div>"
                    ////////////////////////////////////////////////////
                );
           
        }, // SUCCESS:
    }); // --!SA AJAX ITO
}; //VIEW DATA

	
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

$.fn.formToJson = function () {
	form = $(this);
	var formArray = form.serializeArray();
	var jsonOutput = {};

	$.each(formArray, function (i, element) {
		var elemNameSplit = element["name"].split("[");
		var elemObjName = "jsonOutput";

		$.each(elemNameSplit, function (nameKey, value) {
			if (nameKey != elemNameSplit.length - 1) {
				if (value.slice(value.length - 1) == "]") {
					if (value === "]") {
						elemObjName =
							elemObjName + "[" + Object.keys(eval(elemObjName)).length + "]";
					} else {
						elemObjName = elemObjName + "[" + value;
					}
				} else {
					elemObjName = elemObjName + "." + value;
				}

				if (typeof eval(elemObjName) == "undefined")
					eval(elemObjName + " = {};");
			} else {
				if (value.slice(value.length - 1) == "]") {
					if (value === "]") {
						eval(
							elemObjName +
								"[" +
								Object.keys(eval(elemObjName)).length +
								"] = '" +
								element["value"].replace("'", "\\'") +
								"';"
						);
					} else {
						eval(
							elemObjName +
								"[" +
								value +
								" = '" +
								element["value"].replace("'", "\\'") +
								"';"
						);
					}
				} else {
					eval(
						elemObjName +
							"." +
							value +
							" = '" +
							element["value"].replace("'", "\\'") +
							"';"
					);
				}
			}
		});
	});
	return jsonOutput;
};