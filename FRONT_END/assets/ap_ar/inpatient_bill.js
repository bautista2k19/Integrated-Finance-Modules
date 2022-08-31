$(document).ready(function () {
	hideDiv = () => {
		$("#view_sub_bill_div").hide()
	}
	loadInpatientBillTable = () => {
		$("#inpatient_bill_table").dataTable().fnClearTable();
		$("#inpatient_bill_table").dataTable().fnDraw();
		$("#inpatient_bill_table").dataTable().fnDestroy();
		$("#inpatient_bill_table").dataTable({
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
								columns: [0, 1, 2],
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
					data: "inpatient_bill_no",
					name: "inpatient_bill_no",

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let inpatient_full_name = "";

						inpatient_full_name =
							aData.inpatient_bill_inpatient.inpatient_patient.first_name +
							" " +
							aData.inpatient_bill_inpatient.inpatient_patient.last_name;
						return inpatient_full_name;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let total_bill = "";

						total_bill += "₱ " + aData.total_bill.toLocaleString();

						return total_bill;
					},
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let remaining_balance = "";

						remaining_balance += "₱ " + aData.remaining_balance.toLocaleString();

						return remaining_balance;
					},
					searchable: true,
				},
				{
					data: "date_of_billing",
					render: function (aData, type, row) {
						let date_of_billing = "";
						date_of_billing += moment(aData.date_of_billing).format(
							"MMMM D, YYYY"
						);
						return date_of_billing;
					},

					searchable: true,
				},
				{
					data: "due_date",
					render: function (aData, type, row) {
						let due_date = "";
						due_date += moment(aData.due_date).format("MMMM D, YYYY");
						return due_date;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let status = "";

						if (aData.status == "Paid") {
                            status +=
								'<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Paid</span>';
							
						} else if(aData.status == "Pending"){
                            status +=
								'<span class="badge badge-info p-2 w-100"><i class="nav-icon fas fa-clock mr-1"></i>Pending</span>';
                        } 
                        else if(aData.status == "Incomplete"){
							status +=
								'<span class="badge badge-warning p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Incomplete</span>';
						}
						return status;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
					  let buttons = "";
		  
					  if (aData.status != "Inactive") {
						buttons +=
						  '<div class="text-center dropdown">' +
						  '<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
						  '<i class="fas fa-ellipsis-v"></i>' +
						  "</div>" +
						  '<div class="dropdown-menu dropdown-menu-right">' +
						  '<div class="dropdown-item d-flex" role="button" onClick="return viewSubBills(\'' +
						  aData["id"] +
						  "','"+ aData["inpatient_bill_no"] + "')\">" +
						  '<div style="width: 2rem">' +
						  '<i class="fas fa fa-list mr-1"></i>' +
						  "</div>" +
						  "<div>View Sub-bills</div>" +
						  "</div>" +
						  '<div class="dropdown-item d-flex" role="button" id="delete_data_button" onClick="return deleteData(\'' +
						  aData["id"] +
						  "',0)\">" +
						  '<div style="width: 2rem">' +
						  '<i class="fas fa-trash-alt mr-1"></i>' +
						  "</div>" +
						  "<div>Delete Bill</div>" +
						  "</div>" +
						  "</div>" +
						  "</div>";
					  } else if (aData.status == "Inactive") {
						buttons += "<i>No available action</i>";
					  }
					  return buttons; // same class in i element removed it from a element
					},
					sortable: false,
				  },
			],

			ajax: {
				url: apiURL + "inpatient_bill/datatable",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				let inpatient_full_name = "";

				inpatient_full_name =
					aData.inpatient_bill_inpatient.inpatient_patient.first_name +
					" " +
					aData.inpatient_bill_inpatient.inpatient_patient.last_name;

				let total_bill = "";

				total_bill += "₱ " + aData.total_bill.toLocaleString();
				
				let remaining_balance = "";

				remaining_balance += "₱ " + aData.remaining_balance.toLocaleString();

				let date_of_billing = "";
				date_of_billing += moment(aData.date_of_billing).format("MMMM D, YYYY");

				let due_date = "";
				due_date += moment(aData.due_date).format("MMMM D, YYYY");

				let status = "";

						if (aData.status == "Paid") {
                            status +=
								'<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Paid</span>';
							
						} else if(aData.status == "Pending"){
                            status +=
								'<span class="badge badge-info p-2 w-100"><i class="nav-icon fas fa-clock mr-1"></i>Pending</span>';
                        } 
                        else if(aData.status == "Incomplete"){
							status +=
								'<span class="badge badge-warning p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Incomplete</span>';
						}

		let buttons = "";
        if (aData.status != "Inactive") {
          buttons +=
            '<div class="text-center dropdown">' +
            '<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i>' +
            "</div>" +
            '<div class="dropdown-menu dropdown-menu-right">' +
            '<div class="dropdown-item d-flex" role="button" onClick="return viewSubBills(\'' +
            aData["id"] +
            "','"+ aData["inpatient_bill_no"] + "')\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa fa-list mr-1"></i>' +
            "</div>" +
            "<div>View Sub-bills</div>" +
            "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-trash-alt mr-1"></i>' +
            "</div>" +
            "<div>Delete Bill</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        } else if (aData.status == "Inactive") {
          buttons += "<i>No available action</i>";
        }

				$("td:eq(0)", nRow).html(aData["inpatient_bill_no"]);
				$("td:eq(1)", nRow).html(inpatient_full_name);
				$("td:eq(2)", nRow).html(total_bill);
				$("td:eq(3)", nRow).html(remaining_balance);
                $("td:eq(4)", nRow).html(date_of_billing);
                $("td:eq(5)", nRow).html(due_date);
				$("td:eq(6)", nRow).html(status);
			},
			drawCallback: function (settings) {},
		});
	};
	loadInpatientBillTable();

	$(window).resize(function () {
		$("table.dataTable").resize();
	});


	viewSubBills = (id, bill_no) => {
		$("#sub_bill_list_table").find("tbody").empty();
		$("#modal_inpatient_bill_no").text(bill_no)
		$.ajax({
			url: apiURL + "inpatient_bill/find_inpatient_bill/"+id,
			dataSrc: "",
			type: "GET",
			success: function (data) {

				console.log(data)
				
				$.each(data.inpatient_bill_prescription_bill, function (i, prescriptionBillOptions) {
					var tr = "";
					tr =
						'<tr class="subBillTr" onClick="return viewSubBill(\'' +
						prescriptionBillOptions.id +
						"',0)\">" + 
						"<td><i class='fas fa-prescription mr-1'></i>" +
						prescriptionBillOptions.prescription_bill_no +
						"</td>" +
						"<td class='text-right'>₱" +
						prescriptionBillOptions.total_amount.toLocaleString() +
						"<i class='fas fa-angle-right ml-5 text-primary'></i>"+
						"</td>";
			
					tr += "</tr>";
			
					$("#sub_bill_list_table")
						.find("tbody")
						.append(tr);
				});
				$.each(data.inpatient_bill_room_bill, function (i, roomBillOptions) {
					var tr = "";
					tr =
						'<tr class="subBillTr" onClick="return viewSubBill(\'' +
						roomBillOptions.id +
						"',1)\">" + 
						"<td><i class='fas fa-procedures mr-1'></i>" +
						roomBillOptions.room_bill_no +
						"</td>" +
						"<td class='text-right'>₱" +
						roomBillOptions.total_amount.toLocaleString() +
						"<i class='fas fa-angle-right ml-5 text-primary'></i>"+
						"</td>";
			
					tr += "</tr>";
			
					$("#sub_bill_list_table")
						.find("tbody")
						.append(tr);
				});
				$.each(data.inpatient_bill_request_bill, function (i, requestBillOptions) {
					var tr = "";
					tr =
						'<tr class="subBillTr" onClick="return viewSubBill(\'' +
						requestBillOptions.id +
						"',2)\">" + 
						"<td><i class='fas fa-x-ray mr-1'></i>" +
						requestBillOptions.lab_request_bill_no +
						"</td>" +
						"<td class='text-right'>₱" +
						requestBillOptions.total_amount.toLocaleString() +
						"<i class='fas fa-angle-right ml-5 text-primary'></i>"+
						"</td>";
			
					tr += "</tr>";
			
					$("#sub_bill_list_table")
						.find("tbody")
						.append(tr);
				});
				var treatment_prof_fee = 0
				$.each(data.inpatient_bill_treatment_bill, function (i, treatmentBillOptions) {
					
					$.each(treatmentBillOptions.treatment_bill_treatment.treatment_treatment_in_charge, function (i, treatmentInchargeOptions) {
						treatment_prof_fee += treatmentInchargeOptions.professional_fee
					})

					var tr = "";
					tr =
						'<tr class="subBillTr" onClick="return viewSubBill(\'' +
						treatmentBillOptions.id +
						"',3)\">" + 
						"<td><i class='fas fa-briefcase-medical mr-1'></i>" +
						treatmentBillOptions.treatment_bill_no +
						"</td>" +
						"<td class='text-right'>₱" +
						treatmentBillOptions.total_amount.toLocaleString() + "(Prof fee: ₱" +
						treatment_prof_fee.toLocaleString() + ")" +
						"<i class='fas fa-angle-right ml-5 text-primary'></i>"+
						"</td>";
			
					tr += "</tr>";
			
					$("#sub_bill_list_table")
						.find("tbody")
						.append(tr);
				});
				var surgery_prof_fee = 0
				$.each(data.inpatient_bill_surgery_bill, function (i, surgeryBillOptions) {
					$.each(surgeryBillOptions.surgery_bill_surgery.surgery_surgery_in_charge, function (i, surgeryInchargeOptions) {
						surgery_prof_fee += surgeryInchargeOptions.professional_fee
					})
					var tr = "";
					tr =
						'<tr class="subBillTr" onClick="return viewSubBill(\'' +
						surgeryBillOptions.id +
						"',4)\">" + 
						"<td><i class='fas fa-cut mr-1'></i>" +
						surgeryBillOptions.surgery_bill_no +
						"</td>" +
						"<td class='text-right'>₱" +
						surgeryBillOptions.total_amount.toLocaleString() + "(Prof fee: ₱" +
						surgery_prof_fee.toLocaleString() + ")" +
						"<i class='fas fa-angle-right ml-5 text-primary'></i>"+
						"</td>";
			
					tr += "</tr>";
			
					$("#sub_bill_list_table")
						.find("tbody")
						.append(tr);
				});
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});	
	
		$("#modal_select_sub_bill").modal("show")

		
	};

	viewSubBill = (id,type) => {
		$("#modal_select_sub_bill").modal("hide")
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$("#view_sub_bill_div").show()
		$("#view_prescription_bill_div").hide()
		$("#view_room_bill_div").hide()
		$("#view_request_bill_div").hide()
		$("#view_treatment_bill_div").hide()
		$("#view_surgery_bill_div").hide()
		switch (type) {
			case 0:
				$("#view_prescription_bill_div").show()
				$.ajax({
					url: apiURL + "prescription_bill/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						console.log(data)
						$("#prescription_bill_no").val(data.prescription_bill_no)
						$("#pres_date_of_billing").val(data.billing_date)
						$("#medicine_amount").val(data.medicine_amount)
						$("#medical_amount").val(data.medical_amount)
						$("#pres_total_amount").val(data.total_amount)
						$("#pres_status").val(data.status)
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});	
				break;
			
			case 1:
				$("#view_room_bill_div").show()
				$.ajax({
					url: apiURL + "room_bill/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						console.log(data)
						$("#room_bill_no").val(data.room_bill_no)
						$("#room_date_of_billing").val( moment(data.created_at).format("YYYY-MM-DD"))
						$("#room_no").val(data.room_bill_room_admission.room_admission_room.room_number)
						$("#room_type").val(data.room_bill_room_admission.room_admission_room.room_room_type.name)
						$("#date_of_admission").val(data.room_bill_room_admission.admission_date)
						$("#no_of_days").val(data.no_of_days)
						$("#room_total_amount").val(data.total_amount)
						$("#room_status").val(data.status)
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});		
				break;
			
			case 2:
				$("#view_request_bill_div").show()
				$.ajax({
					url: apiURL + "lab_request_bill/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						console.log(data)
						$("#request_bill_no").val(data.lab_request_bill_no)
						$("#request_date_of_billing").val( moment(data.created_at).format("YYYY-MM-DD"))
						$("#request_no").val(data.request_bill_lab_request.lab_request_no)
						$("#request_type").val(data.request_bill_lab_request.lab_request_lab_test_type.name)
						$("#date_of_request").val(moment(data.request_bill_lab_request.created_at).format("YYYY-MM-DD"))
						$("#request_total_amount").val(data.total_amount)
						$("#request_status").val(data.status)
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});	
				break;
			
			case 3:
				$("#view_treatment_bill_div").show()
				$.ajax({
					url: apiURL + "treatment_bill/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						console.log(data)
						$("#treatment_bill_no").val(data.treatment_bill_no)
						$("#treatment_date_of_billing").val( moment(data.created_at).format("YYYY-MM-DD"))
						$("#treatment_no").val(data.treatment_bill_treatment.treatment_no)
						$("#treatment_type").val(data.treatment_bill_treatment.treatment_treatment_type.name)
						$("#date_of_treatment").val(moment(data.treatment_bill_treatment.created_at).format("YYYY-MM-DD"))
						$("#treatment_total_amount").val(data.total_amount)
						$("#treatment_status").val(data.status)
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});	
				break;

			case 4:
				$("#view_surgery_bill_div").show()
				$.ajax({
					url: apiURL + "surgery_bill/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						console.log(data)
						$("#surgery_bill_no").val(data.surgery_bill_no)
						$("#surgery_date_of_billing").val( moment(data.created_at).format("YYYY-MM-DD"))
						$("#surgery_no").val(data.surgery_bill_surgery.surgery_no)
						$("#surgery_type").val(data.surgery_bill_surgery.surgery_surgery_type.name)
						$("#date_of_surgery").val(moment(data.surgery_bill_surgery.created_at).format("YYYY-MM-DD"))
						$("#surgery_total_amount").val(data.total_amount)
						$("#surgery_status").val(data.status)
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});	
				break;
		
			default:
				break;
		}
	}
});
