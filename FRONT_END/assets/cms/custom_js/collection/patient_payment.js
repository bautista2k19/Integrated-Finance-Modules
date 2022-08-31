$(document).ready(function () {
	var stepper = new Stepper($(".bs-stepper")[0]);
});
$(document).ready(function () {
	hideDiv = () => {
		$("#full_payment_div_form").hide();
		$("#partial_payment_div_form").hide();
		$("#prescription_bill_div").hide();
		$("#room_bill_div").hide();
		$("#lab_request_bill_div").hide();
		$("#treatment_bill_div").hide();
		$("#surgery_bill_div").hide();
		$("#inpatient_payment_div").hide()
		$("#view_full_payment_div").hide()
		$("#view_prescription_payment_div").hide()
		$("#view_room_payment_div").hide()
		$("#view_request_payment_div").hide()
		$("#view_treatment_payment_div").hide()
		$("#view_surgery_payment_div").hide()
		$("#view_receipt_prescription_payment_div").hide()
		$("#view_receipt_room_payment_div").hide()
		$("#view_receipt_request_payment_div").hide()
		$("#view_receipt_treatment_payment_div").hide()
		$("#view_receipt_surgery_payment_div").hide()
		
	};
	//PAYMENTS DATATABLE
	//INPATIENT PAYMENT
	loadInpatientPaymentTable = () => {
		$("#inpatient_payments_table").dataTable().fnClearTable();
		$("#inpatient_payments_table").dataTable().fnDraw();
		$("#inpatient_payments_table").dataTable().fnDestroy();
		$("#inpatient_payments_table").dataTable({
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
					data: "or_no",
					name: "or_no",
					searchable: true,
				},
				{
					data: "inpatient_payment_inpatient_bill.inpatient_bill_no",
					name: "inpatient_payment_inpatient_bill.inpatient_bill_no",
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let inpatient_full_name = "";

						inpatient_full_name =
							aData.inpatient_payment_inpatient_bill.inpatient_bill_inpatient
								.inpatient_patient.first_name +
							" " +
							aData.inpatient_payment_inpatient_bill.inpatient_bill_inpatient
								.inpatient_patient.last_name;
						return inpatient_full_name;
					},
					searchable: true,
				},

				{
					data: "total_amount_paid",
					render: function (aData, type, row) {
						let total_amount_paid = "";
						total_amount_paid = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return total_amount_paid;
					},

					searchable: true,
				},
				{
					data: "inpatient_payment_payment_term.term_name",
					name: "inpatient_payment_payment_term.term_name",
					searchable: true,
				},
				{
					data: "date_of_payment",
					render: function (aData, type, row) {
						let date_of_payment = "";
						date_of_payment += moment(aData.date_of_payment).format(
							"MMMM D, YYYY"
						);
						return date_of_payment;
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
							'<div class="dropdown-item d-flex" role="button" onClick="return viewFullpayment(\'' +
							aData["id"] +
							"',0)\">" +
							'<div style="width: 2rem">' +
							'<i class="fas fa-eye mr-1 "></i>' +
							"</div>" +
							"<div>View Inpatient Payment</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewFullpayment(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 "></i>' +
								"</div>" +
								"<div>Edit Inpatient Payment</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
								aData["id"] +
								"',0)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 "></i>' +
								"</div>" +
								"<div>View/Print Receipt</div>" +
								"</div>";
						}
						buttons += "</div>" + "</div>";
						return buttons; // same class in i element removed it from a element
					},
					sortable: false,
					searchable: false,
				},
			],

			ajax: {
				url: apiURL + "inpatient_payment/datatable",
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
					aData.inpatient_payment_inpatient_bill.inpatient_bill_inpatient
						.inpatient_patient.first_name +
					" " +
					aData.inpatient_payment_inpatient_bill.inpatient_bill_inpatient
						.inpatient_patient.last_name;

				let total_amount_paid = "";

				total_amount_paid = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.total_amount_paid);

				let date_of_payment = "";
				date_of_payment += moment(aData.date_of_payment).format("MMMM D, YYYY");

				let buttons = "";

				buttons +=
					'<div class="text-center dropdown">' +
					'<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
					'<i class="fas fa-ellipsis-v"></i>' +
					"</div>" +
					'<div class="dropdown-menu dropdown-menu-right">' +
					'<div class="dropdown-item d-flex" role="button" onClick="return viewFullpayment(\'' +
					aData["id"] +
					"',0)\">" +
					'<div style="width: 2rem">' +
					'<i class="fas fa-eye mr-1 "></i>' +
					"</div>" +
					"<div>View Inpatient Payment</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewFullpayment(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 "></i>' +
						"</div>" +
						"<div>Edit Inpatient Payment</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
						aData["id"] +
						"',0)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 "></i>' +
						"</div>" +
						"<div>View/Print Receipt</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(
					aData["inpatient_payment_inpatient_bill.inpatient_bill_no"]
				);
				$("td:eq(2)", nRow).html(inpatient_full_name);
				$("td:eq(3)", nRow).html(total_amount_paid);
				$("td:eq(4)", nRow).html(
					aData["inpatient_payment_payment_term.term_name"]
				);
				$("td:eq(5)", nRow).html(date_of_payment);
				$("td:eq(6)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
			initComplete: function () {
				var api = this.api();
				api.$("td:not(:last-child)").click(function () {
					api.search(this.innerHTML).draw();
				});
			},
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === "string"
						? i.replace(/[\₱,]/g, "") * 1
						: typeof i === "number"
						? i
						: 0;
				};

				//CASH
				total_amount_paid = api
					.column(3)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				page_total_amount_paid = api
					.column(3, { page: "current" })
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				$(api.column(0).footer()).html(
					"Page Amount Paid: <b>₱" +
						page_total_amount_paid.toLocaleString() +
						"</b>  (Total Amount Paid:  <b>₱" +
						total_amount_paid.toLocaleString() +
						"</b>)<br>"
				);
			},
		});
	};
	loadInpatientPaymentTable();

	//INPATIENT PRESCRIPTION PAYMENT
	loadPrescriptionBillPaymentTable = () => {
		$("#prescription_bill_payments_table").dataTable().fnClearTable();
		$("#prescription_bill_payments_table").dataTable().fnDraw();
		$("#prescription_bill_payments_table").dataTable().fnDestroy();
		$("#prescription_bill_payments_table").dataTable({
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
					data: "or_no",
					name: "or_no",
					searchable: true,
				},
				{
					data: "in_prescription_payment_in_prescription_bill.prescription_bill_no",
					name: "in_prescription_payment_in_prescription_bill.prescription_bill_no",
					searchable: true,
				},
				{
					data: "in_prescription_payment_in_prescription_bill.prescription_bill_no",
					name: "in_prescription_payment_in_prescription_bill.prescription_bill_no",
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let inpatient_full_name = "";

						inpatient_full_name =
							aData.in_prescription_payment_in_prescription_bill
								.prescription_bill_inpatient.inpatient_patient.first_name +
							" " +
							aData.in_prescription_payment_in_prescription_bill
								.prescription_bill_inpatient.inpatient_patient.last_name;
						return inpatient_full_name;
					},
					searchable: true,
				},
				{
					data: "amount_paid",
					render: function (aData, type, row) {
						let amount_paid = "";
						amount_paid = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return amount_paid;
					},

					searchable: true,
				},
				{
					data: "date_of_payment",
					render: function (aData, type, row) {
						let date_of_payment = "";
						date_of_payment += moment(aData.date_of_payment).format(
							"MMMM D, YYYY"
						);
						return date_of_payment;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let payment_method = "";

						if (aData.patient_cash_payment_id != null) {
							payment_method = "Cash";
						} else if (aData.patient_check_payment_id != null) {
							payment_method = "Check";
						}
						return payment_method;
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
							'<div class="dropdown-item d-flex" role="button" onClick="return viewPrescriptionPayment(\'' +
							aData["id"] +
							"',0)\">" +
							'<div style="width: 2rem">' +
							'<i class="fas fa-eye mr-1 "></i>' +
							"</div>" +
							"<div>View Prescription Payment</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewPrescriptionPayment(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 "></i>' +
								"</div>" +
								"<div>Edit Prescription Payment</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 "></i>' +
								"</div>" +
								"<div>View/Print Receipt</div>" +
								"</div>";
						}
						buttons += "</div>" + "</div>";
						return buttons; // same class in i element removed it from a element
					},
					sortable: false,
					searchable: false,
				},
			],

			ajax: {
				url: apiURL + "inpatient_prescription_payment/datatable",
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
					aData.in_prescription_payment_in_prescription_bill
						.prescription_bill_inpatient.inpatient_patient.first_name +
					" " +
					aData.in_prescription_payment_in_prescription_bill
						.prescription_bill_inpatient.inpatient_patient.last_name;

				let amount_paid = "";

				amount_paid = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.amount_paid);

				let date_of_payment = "";
				date_of_payment += moment(aData.date_of_payment).format("MMMM D, YYYY");

				let payment_method = "";

				if (aData.patient_cash_payment_id != null) {
					payment_method = "Cash";
				} else if (aData.patient_check_payment_id != null) {
					payment_method = "Check";
				}

				let buttons = "";

				buttons +=
					'<div class="text-center dropdown">' +
					'<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
					'<i class="fas fa-ellipsis-v"></i>' +
					"</div>" +
					'<div class="dropdown-menu dropdown-menu-right">' +
					'<div class="dropdown-item d-flex" role="button" onClick="return viewPrescriptionPayment(\'' +
					aData["id"] +
					"',0)\">" +
					'<div style="width: 2rem">' +
					'<i class="fas fa-eye mr-1 "></i>' +
					"</div>" +
					"<div>View Prescription Payment</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewPrescriptionPayment(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 "></i>' +
						"</div>" +
						"<div>Edit Prescription Payment</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 "></i>' +
						"</div>" +
						"<div>View/Print Receipt</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(
					aData[
						"in_prescription_payment_in_prescription_bill.prescription_bill_no"
					]
				);
				$("td:eq(2)", nRow).html(
					aData[
						"in_prescription_payment_in_prescription_bill.prescription_bill_no"
					]
				);
				$("td:eq(3)", nRow).html(inpatient_full_name);
				$("td:eq(4)", nRow).html(amount_paid);
				$("td:eq(5)", nRow).html(date_of_payment);
				$("td:eq(6)", nRow).html(payment_method);
				$("td:eq(7)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
			initComplete: function () {
				var api = this.api();
				api.$("td:not(:last-child)").click(function () {
					api.search(this.innerHTML).draw();
				});
			},
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === "string"
						? i.replace(/[\₱,]/g, "") * 1
						: typeof i === "number"
						? i
						: 0;
				};

				//CASH
				total_amount_paid = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				page_total_amount_paid = api
					.column(4, { page: "current" })
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				$(api.column(0).footer()).html(
					"Page Amount Paid: <b>₱" +
						page_total_amount_paid.toLocaleString() +
						"</b>  (Total Amount Paid:  <b>₱" +
						total_amount_paid.toLocaleString() +
						"</b>)<br>"
				);
			},
		});
	};
	loadPrescriptionBillPaymentTable();

	//INPATIENT ROOM PAYMENT
	loadRoomBillPaymentTable = () => {
		$("#room_bill_payments_table").dataTable().fnClearTable();
		$("#room_bill_payments_table").dataTable().fnDraw();
		$("#room_bill_payments_table").dataTable().fnDestroy();
		$("#room_bill_payments_table").dataTable({
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
					data: "or_no",
					name: "or_no",
					searchable: true,
				},
				{
					data: "in_room_payment_in_room_bill.room_bill_no",
					name: "in_room_payment_in_room_bill.room_bill_no",
					searchable: true,
				},
				{
					data: "in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_number",
					name: "in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_number",
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let inpatient_full_name = "";

						inpatient_full_name =
							aData.in_room_payment_in_room_bill.room_bill_room_admission
								.room_admission_inpatient.inpatient_patient.first_name +
							" " +
							aData.in_room_payment_in_room_bill.room_bill_room_admission
								.room_admission_inpatient.inpatient_patient.last_name;
						return inpatient_full_name;
					},
					searchable: true,
				},

				{
					data: "amount_paid",
					render: function (aData, type, row) {
						let amount_paid = "";
						amount_paid = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return amount_paid;
					},

					searchable: true,
				},
				{
					data: "date_of_payment",
					render: function (aData, type, row) {
						let date_of_payment = "";
						date_of_payment += moment(aData.date_of_payment).format(
							"MMMM D, YYYY"
						);
						return date_of_payment;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let payment_method = "";

						if (aData.patient_cash_payment_id != null) {
							payment_method = "Cash";
						} else if (aData.patient_check_payment_id != null) {
							payment_method = "Check";
						}
						return payment_method;
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
							'<div class="dropdown-item d-flex" role="button" onClick="return viewRoomPayment(\'' +
							aData["id"] +
							"',0)\">" +
							'<div style="width: 2rem">' +
							'<i class="fas fa-eye mr-1 "></i>' +
							"</div>" +
							"<div>View Room Payment</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewRoomPayment(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 "></i>' +
								"</div>" +
								"<div>Edit Room Payment</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
								aData["id"] +
								"',2)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 "></i>' +
								"</div>" +
								"<div>View/Print Receipt</div>" +
								"</div>";
						}
						buttons += "</div>" + "</div>";
						return buttons; // same class in i element removed it from a element
					},
					sortable: false,
					searchable: false,
				},
			],

			ajax: {
				url: apiURL + "inpatient_room_payment/datatable",
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
					aData.in_room_payment_in_room_bill.room_bill_room_admission
						.room_admission_inpatient.inpatient_patient.first_name +
					" " +
					aData.in_room_payment_in_room_bill.room_bill_room_admission
						.room_admission_inpatient.inpatient_patient.last_name;

				let amount_paid = "";

				amount_paid = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.amount_paid);

				let date_of_payment = "";
				date_of_payment += moment(aData.date_of_payment).format("MMMM D, YYYY");

				let payment_method = "";

				if (aData.patient_cash_payment_id != null) {
					payment_method = "Cash";
				} else if (aData.patient_check_payment_id != null) {
					payment_method = "Check";
				}

				let buttons = "";

				buttons +=
					'<div class="text-center dropdown">' +
					'<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
					'<i class="fas fa-ellipsis-v"></i>' +
					"</div>" +
					'<div class="dropdown-menu dropdown-menu-right">' +
					'<div class="dropdown-item d-flex" role="button" onClick="return viewRoomPayment(\'' +
					aData["id"] +
					"',0)\">" +
					'<div style="width: 2rem">' +
					'<i class="fas fa-eye mr-1 "></i>' +
					"</div>" +
					"<div>View Room Payment</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewRoomPayment(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 "></i>' +
						"</div>" +
						"<div>Edit Room Payment</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
						aData["id"] +
						"',2)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 "></i>' +
						"</div>" +
						"<div>View/Print Receipt</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(
					aData["in_room_payment_in_room_bill.room_bill_no"]
				);
				$("td:eq(2)", nRow).html(
					aData[
						"in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_number"
					]
				);
				$("td:eq(3)", nRow).html(inpatient_full_name);
				$("td:eq(4)", nRow).html(amount_paid);
				$("td:eq(5)", nRow).html(date_of_payment);
				$("td:eq(6)", nRow).html(payment_method);
				$("td:eq(7)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
			initComplete: function () {
				var api = this.api();
				api.$("td:not(:last-child)").click(function () {
					api.search(this.innerHTML).draw();
				});
			},
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === "string"
						? i.replace(/[\₱,]/g, "") * 1
						: typeof i === "number"
						? i
						: 0;
				};

				//CASH
				total_amount_paid = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				page_total_amount_paid = api
					.column(4, { page: "current" })
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				$(api.column(0).footer()).html(
					"Page Amount Paid: <b>₱" +
						page_total_amount_paid.toLocaleString() +
						"</b>  (Total Amount Paid:  <b>₱" +
						total_amount_paid.toLocaleString() +
						"</b>)<br>"
				);
			},
		});
	};
	loadRoomBillPaymentTable();

	//INPATIENT LAB REQUEST PAYMENT
	loadLabRequestBillPaymentTable = () => {
		$("#lab_request_bill_payments_table").dataTable().fnClearTable();
		$("#lab_request_bill_payments_table").dataTable().fnDraw();
		$("#lab_request_bill_payments_table").dataTable().fnDestroy();
		$("#lab_request_bill_payments_table").dataTable({
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
					data: "or_no",
					name: "or_no",
					searchable: true,
				},
				{
					data: "in_request_payment_in_request_bill.lab_request_bill_no",
					name: "in_request_payment_in_request_bill.lab_request_bill_no",
					searchable: true,
				},
				{
					data: "in_request_payment_in_request_bill.request_bill_lab_request.lab_request_no",
					name: "in_request_payment_in_request_bill.request_bill_lab_request.lab_request_no",
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let inpatient_full_name = "";

						inpatient_full_name =
							aData.in_request_payment_in_request_bill
								.request_bill_inpatient_bill.inpatient_bill_inpatient
								.inpatient_patient.first_name +
							" " +
							aData.in_request_payment_in_request_bill
								.request_bill_inpatient_bill.inpatient_bill_inpatient
								.inpatient_patient.last_name;
						return inpatient_full_name;
					},
					searchable: true,
				},
				{
					data: "amount_paid",
					render: function (aData, type, row) {
						let amount_paid = "";
						amount_paid = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return amount_paid;
					},

					searchable: true,
				},
				{
					data: "date_of_payment",
					render: function (aData, type, row) {
						let date_of_payment = "";
						date_of_payment += moment(aData.date_of_payment).format(
							"MMMM D, YYYY"
						);
						return date_of_payment;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let payment_method = "";

						if (aData.patient_cash_payment_id != null) {
							payment_method = "Cash";
						} else if (aData.patient_check_payment_id != null) {
							payment_method = "Check";
						}
						return payment_method;
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
							'<div class="dropdown-item d-flex" role="button" onClick="return viewRequestPayment(\'' +
							aData["id"] +
							"',0)\">" +
							'<div style="width: 2rem">' +
							'<i class="fas fa-eye mr-1 "></i>' +
							"</div>" +
							"<div>View Lab Request Payment</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewRequestPayment(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 "></i>' +
								"</div>" +
								"<div>Edit Lab Request Payment</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
								aData["id"] +
								"',3)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 "></i>' +
								"</div>" +
								"<div>View/Print Receipt</div>" +
								"</div>";
						}
						buttons += "</div>" + "</div>";
						return buttons; // same class in i element removed it from a element
					},
					sortable: false,
					searchable: false,
				},
			],

			ajax: {
				url: apiURL + "inpatient_lab_request_payment/datatable",
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
					aData.in_request_payment_in_request_bill.request_bill_inpatient_bill
						.inpatient_bill_inpatient.inpatient_patient.first_name +
					" " +
					aData.in_request_payment_in_request_bill.request_bill_inpatient_bill
						.inpatient_bill_inpatient.inpatient_patient.last_name;

				let amount_paid = "";

				amount_paid = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.amount_paid);

				let date_of_payment = "";
				date_of_payment += moment(aData.date_of_payment).format("MMMM D, YYYY");

				let payment_method = "";

				if (aData.patient_cash_payment_id != null) {
					payment_method = "Cash";
				} else if (aData.patient_check_payment_id != null) {
					payment_method = "Check";
				}

				let buttons = "";

				buttons +=
					'<div class="text-center dropdown">' +
					'<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
					'<i class="fas fa-ellipsis-v"></i>' +
					"</div>" +
					'<div class="dropdown-menu dropdown-menu-right">' +
					'<div class="dropdown-item d-flex" role="button" onClick="return viewRequestPayment(\'' +
					aData["id"] +
					"',0)\">" +
					'<div style="width: 2rem">' +
					'<i class="fas fa-eye mr-1 "></i>' +
					"</div>" +
					"<div>View Lab Request Payment</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewRequestPayment(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 "></i>' +
						"</div>" +
						"<div>Edit Lab Request Payment</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
						aData["id"] +
						"',3)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 "></i>' +
						"</div>" +
						"<div>View/Print Receipt</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(
					aData["in_request_payment_in_request_bill.lab_request_bill_no"]
				);
				$("td:eq(2)", nRow).html(
					aData[
						"in_request_payment_in_request_bill.request_bill_lab_request.lab_request_no"
					]
				);
				$("td:eq(3)", nRow).html(inpatient_full_name);
				$("td:eq(4)", nRow).html(amount_paid);
				$("td:eq(5)", nRow).html(date_of_payment);
				$("td:eq(6)", nRow).html(payment_method);
				$("td:eq(7)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
			initComplete: function () {
				var api = this.api();
				api.$("td:not(:last-child)").click(function () {
					api.search(this.innerHTML).draw();
				});
			},
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === "string"
						? i.replace(/[\₱,]/g, "") * 1
						: typeof i === "number"
						? i
						: 0;
				};

				//CASH
				total_amount_paid = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				page_total_amount_paid = api
					.column(4, { page: "current" })
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				$(api.column(0).footer()).html(
					"Page Amount Paid: <b>₱" +
						page_total_amount_paid.toLocaleString() +
						"</b>  (Total Amount Paid:  <b>₱" +
						total_amount_paid.toLocaleString() +
						"</b>)<br>"
				);
			},
		});
	};
	loadLabRequestBillPaymentTable();

	//INPATIENT TREATMENT PAYMENT
	loadTreatmentBillPaymentTable = () => {
		$("#treatment_bill_payments_table").dataTable().fnClearTable();
		$("#treatment_bill_payments_table").dataTable().fnDraw();
		$("#treatment_bill_payments_table").dataTable().fnDestroy();
		$("#treatment_bill_payments_table").dataTable({
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
					data: "or_no",
					name: "or_no",
					searchable: true,
				},
				{
					data: "in_treatment_payment_in_treatment_bill.treatment_bill_no",
					name: "in_treatment_payment_in_treatment_bill.treatment_bill_no",
					searchable: true,
				},
				{
					data: "in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_no",
					name: "in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_no",
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let inpatient_full_name = "";

						inpatient_full_name =
							aData.in_treatment_payment_in_treatment_bill
								.treatment_bill_inpatient_bill.inpatient_bill_inpatient
								.inpatient_patient.first_name +
							" " +
							aData.in_treatment_payment_in_treatment_bill
								.treatment_bill_inpatient_bill.inpatient_bill_inpatient
								.inpatient_patient.last_name;
						return inpatient_full_name;
					},
					searchable: true,
				},
				{
					data: "amount_paid",
					render: function (aData, type, row) {
						let amount_paid = "";
						amount_paid = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return amount_paid;
					},

					searchable: true,
				},
				{
					data: "date_of_payment",
					render: function (aData, type, row) {
						let date_of_payment = "";
						date_of_payment += moment(aData.date_of_payment).format(
							"MMMM D, YYYY"
						);
						return date_of_payment;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let payment_method = "";

						if (aData.patient_cash_payment_id != null) {
							payment_method = "Cash";
						} else if (aData.patient_check_payment_id != null) {
							payment_method = "Check";
						}
						return payment_method;
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
							'<div class="dropdown-item d-flex" role="button" onClick="return viewTreatmentPayment(\'' +
							aData["id"] +
							"',0)\">" +
							'<div style="width: 2rem">' +
							'<i class="fas fa-eye mr-1 "></i>' +
							"</div>" +
							"<div>View Treatment Payment</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewTreatmentPayment(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 "></i>' +
								"</div>" +
								"<div>Edit Treatment Payment</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
								aData["id"] +
								"',4)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 "></i>' +
								"</div>" +
								"<div>View/Print Receipt</div>" +
								"</div>";
						}
						buttons += "</div>" + "</div>";
						return buttons; // same class in i element removed it from a element
					},
					sortable: false,
					searchable: false,
				},
			],

			ajax: {
				url: apiURL + "inpatient_treatment_payment/datatable",
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
					aData.in_treatment_payment_in_treatment_bill
						.treatment_bill_inpatient_bill.inpatient_bill_inpatient
						.inpatient_patient.first_name +
					" " +
					aData.in_treatment_payment_in_treatment_bill
						.treatment_bill_inpatient_bill.inpatient_bill_inpatient
						.inpatient_patient.last_name;

				let amount_paid = "";

				amount_paid = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.amount_paid);

				let date_of_payment = "";
				date_of_payment += moment(aData.date_of_payment).format("MMMM D, YYYY");

				let payment_method = "";

				if (aData.patient_cash_payment_id != null) {
					payment_method = "Cash";
				} else if (aData.patient_check_payment_id != null) {
					payment_method = "Check";
				}

				let buttons = "";

				buttons +=
					'<div class="text-center dropdown">' +
					'<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
					'<i class="fas fa-ellipsis-v"></i>' +
					"</div>" +
					'<div class="dropdown-menu dropdown-menu-right">' +
					'<div class="dropdown-item d-flex" role="button" onClick="return viewTreatmentPayment(\'' +
					aData["id"] +
					"',0)\">" +
					'<div style="width: 2rem">' +
					'<i class="fas fa-eye mr-1 "></i>' +
					"</div>" +
					"<div>View Treatment Payment</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewTreatmentPayment(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 "></i>' +
						"</div>" +
						"<div>Edit Treatment Payment</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
						aData["id"] +
						"',4)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 "></i>' +
						"</div>" +
						"<div>View/Print Receipt</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(
					aData["in_treatment_payment_in_treatment_bill.treatment_bill_no"]
				);
				$("td:eq(2)", nRow).html(
					aData[
						"in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_no"
					]
				);
				$("td:eq(3)", nRow).html(inpatient_full_name);
				$("td:eq(4)", nRow).html(amount_paid);
				$("td:eq(5)", nRow).html(date_of_payment);
				$("td:eq(6)", nRow).html(payment_method);
				$("td:eq(7)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
			initComplete: function () {
				var api = this.api();
				api.$("td:not(:last-child)").click(function () {
					api.search(this.innerHTML).draw();
				});
			},
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === "string"
						? i.replace(/[\₱,]/g, "") * 1
						: typeof i === "number"
						? i
						: 0;
				};

				//CASH
				total_amount_paid = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				page_total_amount_paid = api
					.column(4, { page: "current" })
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				$(api.column(0).footer()).html(
					"Page Amount Paid: <b>₱" +
						page_total_amount_paid.toLocaleString() +
						"</b>  (Total Amount Paid:  <b>₱" +
						total_amount_paid.toLocaleString() +
						"</b>)<br>"
				);
			},
		});
	};
	loadTreatmentBillPaymentTable();

	//INPATIENT TREATMENT PAYMENT
	loadSurgeryBillPaymentTable = () => {
		$("#surgery_bill_payments_table").dataTable().fnClearTable();
		$("#surgery_bill_payments_table").dataTable().fnDraw();
		$("#surgery_bill_payments_table").dataTable().fnDestroy();
		$("#surgery_bill_payments_table").dataTable({
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
					data: "or_no",
					name: "or_no",
					searchable: true,
				},
				{
					data: "in_surgery_payment_in_surgery_bill.surgery_bill_no",
					name: "in_surgery_payment_in_surgery_bill.surgery_bill_no",
					searchable: true,
				},
				{
					data: "in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_no",
					name: "in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_no",
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let inpatient_full_name = "";

						inpatient_full_name =
							aData.in_surgery_payment_in_surgery_bill
								.surgery_bill_inpatient_bill.inpatient_bill_inpatient
								.inpatient_patient.first_name +
							" " +
							aData.in_surgery_payment_in_surgery_bill
								.surgery_bill_inpatient_bill.inpatient_bill_inpatient
								.inpatient_patient.last_name;
						return inpatient_full_name;
					},
					searchable: true,
				},
				{
					data: "amount_paid",
					render: function (aData, type, row) {
						let amount_paid = "";
						amount_paid = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return amount_paid;
					},

					searchable: true,
				},
				{
					data: "date_of_payment",
					render: function (aData, type, row) {
						let date_of_payment = "";
						date_of_payment += moment(aData.date_of_payment).format(
							"MMMM D, YYYY"
						);
						return date_of_payment;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let payment_method = "";

						if (aData.patient_cash_payment_id != null) {
							payment_method = "Cash";
						} else if (aData.patient_check_payment_id != null) {
							payment_method = "Check";
						}
						return payment_method;
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
							'<div class="dropdown-item d-flex" role="button" onClick="return viewSurgeryPayment(\'' +
							aData["id"] +
							"',0)\">" +
							'<div style="width: 2rem">' +
							'<i class="fas fa-eye mr-1 "></i>' +
							"</div>" +
							"<div>View Surgery Payment</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewSurgeryPayment(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 "></i>' +
								"</div>" +
								"<div>Edit Surgery Payment</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
								aData["id"] +
								"',5)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 "></i>' +
								"</div>" +
								"<div>View/Print Receipt</div>" +
								"</div>";
						}
						buttons += "</div>" + "</div>";
						return buttons; // same class in i element removed it from a element
					},
					sortable: false,
					searchable: false,
				},
			],

			ajax: {
				url: apiURL + "inpatient_surgery_payment/datatable",
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
					aData.in_surgery_payment_in_surgery_bill.surgery_bill_inpatient_bill
						.inpatient_bill_inpatient.inpatient_patient.first_name +
					" " +
					aData.in_surgery_payment_in_surgery_bill.surgery_bill_inpatient_bill
						.inpatient_bill_inpatient.inpatient_patient.last_name;

				let amount_paid = "";

				amount_paid = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.amount_paid);

				let date_of_payment = "";
				date_of_payment += moment(aData.date_of_payment).format("MMMM D, YYYY");

				let payment_method = "";

				if (aData.patient_cash_payment_id != null) {
					payment_method = "Cash";
				} else if (aData.patient_check_payment_id != null) {
					payment_method = "Check";
				}

				let buttons = "";

				buttons +=
					'<div class="text-center dropdown">' +
					'<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
					'<i class="fas fa-ellipsis-v"></i>' +
					"</div>" +
					'<div class="dropdown-menu dropdown-menu-right">' +
					'<div class="dropdown-item d-flex" role="button" onClick="return viewSurgeryPayment(\'' +
					aData["id"] +
					"',0)\">" +
					'<div style="width: 2rem">' +
					'<i class="fas fa-eye mr-1 "></i>' +
					"</div>" +
					"<div>View Surgery Payment</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewSurgeryPayment(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 "></i>' +
						"</div>" +
						"<div>Edit Surgery Payment</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintreceipt(\'' +
						aData["id"] +
						"',5)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 "></i>' +
						"</div>" +
						"<div>View/Print Receipt</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(
					aData["in_surgery_payment_in_surgery_bill.surgery_bill_no"]
				);
				$("td:eq(2)", nRow).html(
					aData[
						"in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_no"
					]
				);
				$("td:eq(3)", nRow).html(inpatient_full_name);
				$("td:eq(4)", nRow).html(amount_paid);
				$("td:eq(5)", nRow).html(date_of_payment);
				$("td:eq(6)", nRow).html(payment_method);
				$("td:eq(7)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
			initComplete: function () {
				var api = this.api();
				api.$("td:not(:last-child)").click(function () {
					api.search(this.innerHTML).draw();
				});
			},
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === "string"
						? i.replace(/[\₱,]/g, "") * 1
						: typeof i === "number"
						? i
						: 0;
				};

				//CASH
				total_amount_paid = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				page_total_amount_paid = api
					.column(4, { page: "current" })
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				$(api.column(0).footer()).html(
					"Page Amount Paid: <b>₱" +
						page_total_amount_paid.toLocaleString() +
						"</b>  (Total Amount Paid:  <b>₱" +
						total_amount_paid.toLocaleString() +
						"</b>)<br>"
				);
			},
		});
	};
	loadSurgeryBillPaymentTable();

	$(window).resize(function () {
		$("table.dataTable").resize();
	});

	//INPATIENT FULL PAYMENT
	//new inpatient full payment
	$("#full_payment_btn").on("click", function () {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$("#partial_payment_div_form").hide();
		$("#prescription_bill_div").hide();
		$("#room_bill_div").hide();
		$("#lab_request_bill_div").hide();
		$("#treatment_bill_div").hide();
		$("#surgery_bill_div").hide();
		$("#inpatient_payment_div").hide()
		$("#view_full_payment_div").hide()
		$("#view_prescription_payment_div").hide()
		$("#view_room_payment_div").hide()
		$("#view_request_payment_div").hide()
		$("#view_treatment_payment_div").hide()
		$("#view_surgery_payment_div").hide()
		$("#view_receipt_prescription_payment_div").hide()
		$("#view_receipt_room_payment_div").hide()
		$("#view_receipt_request_payment_div").hide()
		$("#view_receipt_treatment_payment_div").hide()
		$("#view_receipt_surgery_payment_div").hide()
		$("#full_payment_div_form").show();
		
		term_name = "Full Payment";
		$.ajax({
			url: apiURL + "payment_term/find_by_name/" + term_name,
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#payment_term_id").val(data.id);
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	});

	loadPaymentMethod = () => {
		$.ajax({
			url: apiURL + "payment_method/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#full_payment_method_id").empty();
				$("#pres_payment_method_id").empty();
				$("#room_payment_method_id").empty();
				$("#lab_request_payment_method_id").empty();
				$("#treatment_payment_method_id").empty();
				$("#surgery_payment_method_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.method_name +
						"</option>";
					$("#full_payment_method_id").append(options);
					$("#pres_payment_method_id").append(options);
					$("#room_payment_method_id").append(options);
					$("#lab_request_payment_method_id").append(options);
					$("#treatment_payment_method_id").append(options);
					$("#surgery_payment_method_id").append(options);
				});
				$("#full_payment_method_id").trigger("change");
				$("#pres_payment_method_id").trigger("change");
				$("#room_payment_method_id").trigger("change");
				$("#lab_request_payment_method_id").trigger("change");
				$("#treatment_payment_method_id").trigger("change");
				$("#surgery_payment_method_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadPaymentMethod();

	loadInpatientBill = () => {
		$.ajax({
			url: apiURL + "inpatient_bill/find_all_pending",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#inpatient_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.inpatient_bill_no +
						" | " +
						dataOptions.inpatient_bill_inpatient.inpatient_patient.first_name +
						" " +
						dataOptions.inpatient_bill_inpatient.inpatient_patient.last_name +
						"</option>";
					$("#inpatient_bill_id").append(options);
				});
				$("#inpatient_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadInpatientBill();

	$("#inpatient_bill_id").change(function () {
		$.ajax({
			url:
				apiURL +
				"inpatient_bill/find_inpatient_bill/" +
				$("#inpatient_bill_id").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#lab_request_total_bill").text(data.total_lab_test_fee);
				$("#room_total_bill").text(data.total_room_fee);
				$("#prescriotion_total_bill").text(data.total_prescription_fee);
				$("#treatment_total_bill").text(data.total_treatment_fee);
				$("#surergery_total_bill").text(data.total_surgery_fee);
				$("#professional_fee_total_bill").text(data.total_professional_fee);
				$("#inpatient_bill_total_discount").text(data.total_discounts);
				$("#inpatient_total_bill").text(data.total_bill);

				$("#full_payment_method_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	});

	$("#full_payment_method_id").change(function () {
		var method = $("#full_payment_method_id").select2("data");
		if (method[0].text == "Cash") {
			$(".full_check_payment").hide();
			$(".full_cash_payment").show();
			$("#full_cash_tendered").attr("min", $("#inpatient_total_bill").text());
			$("#full_cash_tendered").attr(
				"data-msg-min",
				"Cash tendered is not enough."
			);
			$("#full_cash_tendered").keyup(function () {
				var change =
					$("#full_cash_tendered").val() -
					parseFloat($("#inpatient_total_bill").text());
				if (change >= 0) {
					$("#full_change").text(change);
				} else {
					$("#full_change").text("0");
				}
			});
		} else if (method[0].text == "Check") {
			$(".full_cash_payment").hide();
			$(".full_check_payment").show();

			$("#full_check_amount").attr("min", $("#inpatient_total_bill").text());
			$("#full_check_amount").attr(
				"data-msg-min",
				"Check amount is not enough."
			);
		} else {
			$(".full_cash_payment").hide();
			$(".full_check_payment").hide();
		}
	});

	$("#full_check_amount").change(function(){
		$('#full_check_amount_in_words').moneyinwords($("#full_check_amount").val().toLocaleString(),'PH','PHP');
		$('#full_check_amount_in_words').text($('#full_check_amount_in_words').text().toUpperCase())
	})

	$("#inpatient_payment_receipt_btn").printPreview({
		obj2print: "#inpatient_payment_receipt",
		width: "810",
	});
	

	$("#inpatient_full_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$("#modal_submit_confirmation").modal('show')
			$("#confirm_submit").on("click", function () {
				var method = $("#full_payment_method_id").select2("data");
				if (method[0].text == "Cash") {
					$.ajax({
						url: apiURL + "inpatient_payment/create_inpatient_payment",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							name: $("#treatment_type_name").val(),
							fee: $("#treatment_fee").val(),
							description: $("#treatment_description").val(),
							inpatient_bill_id: $("#inpatient_bill_id").val(),
							total_amount_paid: parseFloat($("#inpatient_total_bill").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#full_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_cash_payment: {
								amount: parseFloat($("#inpatient_total_bill").text()),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Inpatient Bill has been paid.");
							$("#inpatient_full_payment_form").validate().resetForm();
							$("#inpatient_full_payment_form")[0].reset();
							loadInpatientPaymentTable();

							$("#inpatient_payment_div").show()
							$("#ip_receipt_table tbody").empty()
							$("#ip_or_no").text(data.or_no)
							$("#ip_date_of_billing").text(moment(data.inpatient_payment_inpatient_bill.date_of_billing).format("MMMM D, YYYY"))
							$("#ip_date_of_payment").text(moment(data.date_of_payment).format("MMMM D, YYYY"))
							$("#ip_inpatient_name").text(data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name + ", " +
								data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name + " " +
								data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.middle_name
								)
							$("#ip_inpatient_address").text(data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address)
							$("#ip_remaining_balance").text(data.inpatient_payment_inpatient_bill.remaining_balance)
							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='4'>LAB REQUESTS</th>" +
										"</tr>"
								);
							var request_subtotal =0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_request_bill, function (i, requestBillData) {
								request_subtotal += requestBillData.request_bill_lab_request.lab_request_lab_test_type.fee
								$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>&emsp;"+ moment(requestBillData.request_bill_lab_request.created_at).format("MMM D, YYYY") +" - "+ requestBillData.request_bill_lab_request.lab_request_lab_test_type.name +"</td>" +
										"<td></td>" +
										"<td class='text-right'>₱"+ requestBillData.request_bill_lab_request.lab_request_lab_test_type.fee.toLocaleString() +"</td>" +
										"<td class='text-right'>₱"+ requestBillData.request_bill_lab_request.lab_request_lab_test_type.fee.toLocaleString() +"</td>" +
									"</tr>"
								);
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ request_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>ROOMS</td>" +
										"</tr>"
								);

							var room_subtotal = 0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_room_bill, function (i, roomBillData) {
								room_subtotal += (roomBillData.no_of_days * roomBillData.room_bill_room_admission.room_admission_room.room_room_type.fee)
								$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>&emsp;"+ moment(roomBillData.room_bill_room_admission.created_at).format("MMM D, YYYY") +" - "+ roomBillData.room_bill_room_admission.room_admission_room.room_number + " ("+ (roomBillData.no_of_days).toString() +" Days)</td>" +
										"<td></td>" +
										"<td class='text-right'>₱"+ roomBillData.room_bill_room_admission.room_admission_room.room_room_type.fee.toLocaleString() +"</td>" +
										"<td class='text-right'>₱"+ (roomBillData.no_of_days * roomBillData.room_bill_room_admission.room_admission_room.room_room_type.fee).toLocaleString() +"</td>" +
									"</tr>"
								);
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ room_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>MEDICINES</td>" +
										"</tr>"
								);
							
							var medicine_subtotal = 0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_prescription_bill, function (i, prescriptionBillData) {
								$.each(prescriptionBillData.prescription_bill_inpatient.inpatient_prescription, function (i, prescriptionData) {
									$.each(prescriptionData.prescription_medicine_prescription, function (i, medicinePrescriptionData) {
										medicine_subtotal += medicinePrescriptionData.medicine_prescription_medicine.med_unit_price * medicinePrescriptionData.quantity - medicinePrescriptionData.medicine_prescription_medicine.med_tax
										$("#ip_receipt_table")
											.find("tbody")
											.append(
												"<tr>" +
													"<td>&emsp;"+ moment(medicinePrescriptionData.medicine_prescription_medicine.created_at).format("MMM D, YYYY") + " - " + medicinePrescriptionData.medicine_prescription_medicine.med_product_name +"</td>" +
													"<td class='text-right'>"+ (medicinePrescriptionData.quantity).toString() +"</td>" +
													"<td class='text-right'>₱"+ (medicinePrescriptionData.medicine_prescription_medicine.med_unit_price +"(₱"+ medicinePrescriptionData.medicine_prescription_medicine.med_tax +")").toLocaleString() +"</td>" + 
													"<td class='text-right'>₱"+ (medicinePrescriptionData.medicine_prescription_medicine.med_unit_price * medicinePrescriptionData.quantity - medicinePrescriptionData.medicine_prescription_medicine.med_tax).toLocaleString()  +"</td>" +
												"</tr>"
											);
									})
								})
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ medicine_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>MEDICIAL SUPPLIES</td>" +
										"</tr>"
								);
							
							var medical_subtotal =0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_prescription_bill, function (i, prescriptionBillData) {
								$.each(prescriptionBillData.prescription_bill_inpatient.inpatient_prescription, function (i, prescriptionData) {
									$.each(prescriptionData.prescription_medical_prescription, function (i, medicalPrescriptionData) {
										medical_subtotal += medicalPrescriptionData.medical_prescription_medical.ms_unit_price * medicalPrescriptionData.quantity - medicalPrescriptionData.medical_prescription_medical.ms_tax
										$("#ip_receipt_table")
											.find("tbody")
											.append(
												"<tr>" +
													"<td>&emsp;"+ moment(medicalPrescriptionData.medical_prescription_medical.created_at).format("MMM D, YYYY") + " - " + medicalPrescriptionData.medical_prescription_medical.ms_product_name +"</td>" +
													"<td class='text-right'>"+ (medicalPrescriptionData.quantity).toString() +"</td>" +
													"<td class='text-right'>₱"+ (medicalPrescriptionData.medical_prescription_medical.ms_unit_price +"(₱"+ medicalPrescriptionData.medical_prescription_medical.ms_tax +")").toLocaleString() +"</td>" + 
													"<td class='text-right'>₱"+ (medicalPrescriptionData.medical_prescription_medical.ms_unit_price * medicalPrescriptionData.quantity - medicalPrescriptionData.medical_prescription_medical.ms_tax).toLocaleString()  +"</td>" +
												"</tr>"
											);
									})
								})
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ medical_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>TREATMENTS</td>" +
										"</tr>"
								);

							var treatment_subtotal =0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_treatment_bill, function (i, treatmentBillData) {
								treatment_subtotal += treatmentBillData.treatment_bill_treatment.treatment_treatment_type.fee
								$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>&emsp;"+ moment(treatmentBillData.treatment_bill_treatment.created_at).format("MMM D, YYYY") +" - "+ treatmentBillData.treatment_bill_treatment.treatment_treatment_type.name +"</td>" +
										"<td></td>" +
										"<td class='text-right'>₱"+ treatmentBillData.treatment_bill_treatment.treatment_treatment_type.fee.toLocaleString() +"</td>" +
										"<td class='text-right'>₱"+ treatmentBillData.treatment_bill_treatment.treatment_treatment_type.fee.toLocaleString() +"</td>" +
									"</tr>"
								);
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ treatment_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);
							
							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>TREATMENT PROFESSIONAL FEE</td>" +
										"</tr>"
								);

							var treatment_in_charge_subtotal =0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_treatment_bill, function (i, treatmentBillData) {
								$.each(treatmentBillData.treatment_bill_treatment.treatment_treatment_in_charge, function (i, inChargeData) {
									treatment_in_charge_subtotal += inChargeData.professional_fee
									$("#ip_receipt_table")
										.find("tbody")
										.append(
											"<tr>" +
												"<td>&emsp;"+ moment(inChargeData.created_at).format("MMM D, YYYY") +" - "+ inChargeData.treatment_in_charge_employee.last_name + ", " +
												inChargeData.treatment_in_charge_employee.first_name + " " + inChargeData.treatment_in_charge_employee.middle_name + " (" + 
												inChargeData.treatment_in_charge_employee.job.job_title +")</td>" +
												"<td></td>" +
												"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
												"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
											"</tr>"
										);
								})
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ treatment_in_charge_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>SURGERIES</td>" +
										"</tr>"
								);
							
							var surgery_subtotal=0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_surgery_bill, function (i, surgeryBillData) {
								surgery_subtotal += surgeryBillData.surgery_bill_surgery.surgery_surgery_type.fee
								$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>&emsp;"+ moment(surgeryBillData.surgery_bill_surgery.created_at).format("MMM D, YYYY") +" - "+ surgeryBillData.surgery_bill_surgery.surgery_surgery_type.name +"</td>" +
										"<td></td>" +
										"<td class='text-right'>₱"+ surgeryBillData.surgery_bill_surgery.surgery_surgery_type.fee.toLocaleString() +"</td>" +
										"<td class='text-right'>₱"+ surgeryBillData.surgery_bill_surgery.surgery_surgery_type.fee.toLocaleString() +"</td>" +
									"</tr>"
								);
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ surgery_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>SURGERIES PROFESSIONAL FEE</td>" +
										"</tr>"
								);

							var surgery_in_charge_subtotal =0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_surgery_bill, function (i, surgeryBillData) {
								$.each(surgeryBillData.surgery_bill_surgery.surgery_surgery_in_charge, function (i, inChargeData) {
									surgery_in_charge_subtotal += inChargeData.professional_fee
									$("#ip_receipt_table")
										.find("tbody")
										.append(
											"<tr>" +
												"<td>&emsp;"+ moment(inChargeData.created_at).format("MMM D, YYYY") +" - "+ inChargeData.surgery_in_charge_employee.last_name + ", " +
												inChargeData.surgery_in_charge_employee.first_name + " " + inChargeData.surgery_in_charge_employee.middle_name + " (" + 
												inChargeData.surgery_in_charge_employee.job.job_title +")</td>" +
												"<td></td>" +
												"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
												"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
											"</tr>"
										);
								})
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ surgery_in_charge_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);
							var total_hospital_charges = (request_subtotal + room_subtotal + medical_subtotal +
								medicine_subtotal + treatment_subtotal + treatment_in_charge_subtotal + surgery_subtotal + surgery_in_charge_subtotal)
								
							$("#ip_total_charges").text(
								"₱" + total_hospital_charges.toLocaleString()
							);
							$("#ip_cash_amount").text(
								"₱" + total_hospital_charges.toLocaleString()
							);
							$("#ip_total_paid").text(
								"₱" + total_hospital_charges.toLocaleString()
							);

						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				} else if (method[0].text == "Check") {
					$.ajax({
						url: apiURL + "inpatient_payment/create_inpatient_payment",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							inpatient_bill_id: $("#inpatient_bill_id").val(),
							total_amount_paid: parseFloat($("#inpatient_total_bill").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#full_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_check_payment: {
								check_no: $("#full_check_no").val(),
								check_date: $("#full_check_date").val(),
								account_name: $("#full_account_name").val(),
								account_no: $("#full_account_no").val(),
								rt_number: $("#full_rt_number").val(),
								payee_name: $("#full_payee_name").val(),
								amount: $("#full_check_amount").val(),
								// amount_in_words: $("#full_check_amount_in_words").val(),
								bank_name: $("#full_bank_name").val(),
								bank_address: $("#full_bank_address").val(),
								description: $("#full_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Inpatient Bill has been paid.");
							$("#inpatient_full_payment_form").validate().resetForm();
							$("#inpatient_full_payment_form")[0].reset();
							loadInpatientPaymentTable();

							$("#inpatient_payment_div").show()
							$("#ip_receipt_table tbody").empty()
							$("#ip_or_no").text(data.or_no)
							$("#ip_date_of_billing").text(moment(data.inpatient_payment_inpatient_bill.date_of_billing).format("MMMM D, YYYY"))
							$("#ip_date_of_payment").text(moment(data.date_of_payment).format("MMMM D, YYYY"))
							$("#ip_inpatient_name").text(data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name + ", " +
								data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name + " " +
								data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.middle_name
								)
							$("#ip_inpatient_address").text(data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address)
							$("#ip_remaining_balance").text(data.inpatient_payment_inpatient_bill.remaining_balance)
							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='4'>LAB REQUESTS</th>" +
										"</tr>"
								);
							var request_subtotal =0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_request_bill, function (i, requestBillData) {
								request_subtotal += requestBillData.request_bill_lab_request.lab_request_lab_test_type.fee
								$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>&emsp;"+ moment(requestBillData.request_bill_lab_request.created_at).format("MMM D, YYYY") +" - "+ requestBillData.request_bill_lab_request.lab_request_lab_test_type.name +"</td>" +
										"<td></td>" +
										"<td class='text-right'>₱"+ requestBillData.request_bill_lab_request.lab_request_lab_test_type.fee.toLocaleString() +"</td>" +
										"<td class='text-right'>₱"+ requestBillData.request_bill_lab_request.lab_request_lab_test_type.fee.toLocaleString() +"</td>" +
									"</tr>"
								);
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ request_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>ROOMS</td>" +
										"</tr>"
								);

							var room_subtotal = 0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_room_bill, function (i, roomBillData) {
								room_subtotal += (roomBillData.no_of_days * roomBillData.room_bill_room_admission.room_admission_room.room_room_type.fee)
								$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>&emsp;"+ moment(roomBillData.room_bill_room_admission.created_at).format("MMM D, YYYY") +" - "+ roomBillData.room_bill_room_admission.room_admission_room.room_number + " ("+ (roomBillData.no_of_days).toString() +" Days)</td>" +
										"<td></td>" +
										"<td class='text-right'>₱"+ roomBillData.room_bill_room_admission.room_admission_room.room_room_type.fee.toLocaleString() +"</td>" +
										"<td class='text-right'>₱"+ (roomBillData.no_of_days * roomBillData.room_bill_room_admission.room_admission_room.room_room_type.fee).toLocaleString() +"</td>" +
									"</tr>"
								);
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ room_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>MEDICINES</td>" +
										"</tr>"
								);
							
							var medicine_subtotal = 0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_prescription_bill, function (i, prescriptionBillData) {
								$.each(prescriptionBillData.prescription_bill_inpatient.inpatient_prescription, function (i, prescriptionData) {
									$.each(prescriptionData.prescription_medicine_prescription, function (i, medicinePrescriptionData) {
										medicine_subtotal += medicinePrescriptionData.medicine_prescription_medicine.med_unit_price * medicinePrescriptionData.quantity - medicinePrescriptionData.medicine_prescription_medicine.med_tax
										$("#ip_receipt_table")
											.find("tbody")
											.append(
												"<tr>" +
													"<td>&emsp;"+ moment(medicinePrescriptionData.medicine_prescription_medicine.created_at).format("MMM D, YYYY") + " - " + medicinePrescriptionData.medicine_prescription_medicine.med_product_name +"</td>" +
													"<td class='text-right'>"+ (medicinePrescriptionData.quantity).toString() +"</td>" +
													"<td class='text-right'>₱"+ (medicinePrescriptionData.medicine_prescription_medicine.med_unit_price +"(₱"+ medicinePrescriptionData.medicine_prescription_medicine.med_tax +")").toLocaleString() +"</td>" + 
													"<td class='text-right'>₱"+ (medicinePrescriptionData.medicine_prescription_medicine.med_unit_price * medicinePrescriptionData.quantity - medicinePrescriptionData.medicine_prescription_medicine.med_tax).toLocaleString()  +"</td>" +
												"</tr>"
											);
									})
								})
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ medicine_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>MEDICIAL SUPPLIES</td>" +
										"</tr>"
								);
							
							var medical_subtotal =0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_prescription_bill, function (i, prescriptionBillData) {
								$.each(prescriptionBillData.prescription_bill_inpatient.inpatient_prescription, function (i, prescriptionData) {
									$.each(prescriptionData.prescription_medical_prescription, function (i, medicalPrescriptionData) {
										medical_subtotal += medicalPrescriptionData.medical_prescription_medical.ms_unit_price * medicalPrescriptionData.quantity - medicalPrescriptionData.medical_prescription_medical.ms_tax
										$("#ip_receipt_table")
											.find("tbody")
											.append(
												"<tr>" +
													"<td>&emsp;"+ moment(medicalPrescriptionData.medical_prescription_medical.created_at).format("MMM D, YYYY") + " - " + medicalPrescriptionData.medical_prescription_medical.ms_product_name +"</td>" +
													"<td class='text-right'>"+ (medicalPrescriptionData.quantity).toString() +"</td>" +
													"<td class='text-right'>₱"+ (medicalPrescriptionData.medical_prescription_medical.ms_unit_price +"(₱"+ medicalPrescriptionData.medical_prescription_medical.ms_tax +")").toLocaleString() +"</td>" + 
													"<td class='text-right'>₱"+ (medicalPrescriptionData.medical_prescription_medical.ms_unit_price * medicalPrescriptionData.quantity - medicalPrescriptionData.medical_prescription_medical.ms_tax).toLocaleString()  +"</td>" +
												"</tr>"
											);
									})
								})
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ medical_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>TREATMENTS</td>" +
										"</tr>"
								);

							var treatment_subtotal =0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_treatment_bill, function (i, treatmentBillData) {
								treatment_subtotal += treatmentBillData.treatment_bill_treatment.treatment_treatment_type.fee
								$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>&emsp;"+ moment(treatmentBillData.treatment_bill_treatment.created_at).format("MMM D, YYYY") +" - "+ treatmentBillData.treatment_bill_treatment.treatment_treatment_type.name +"</td>" +
										"<td></td>" +
										"<td class='text-right'>₱"+ treatmentBillData.treatment_bill_treatment.treatment_treatment_type.fee.toLocaleString() +"</td>" +
										"<td class='text-right'>₱"+ treatmentBillData.treatment_bill_treatment.treatment_treatment_type.fee.toLocaleString() +"</td>" +
									"</tr>"
								);
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ treatment_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);
							
							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>TREATMENT PROFESSIONAL FEE</td>" +
										"</tr>"
								);

							var treatment_in_charge_subtotal =0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_treatment_bill, function (i, treatmentBillData) {
								$.each(treatmentBillData.treatment_bill_treatment.treatment_treatment_in_charge, function (i, inChargeData) {
									treatment_in_charge_subtotal += inChargeData.professional_fee
									$("#ip_receipt_table")
										.find("tbody")
										.append(
											"<tr>" +
												"<td>&emsp;"+ moment(inChargeData.created_at).format("MMM D, YYYY") +" - "+ inChargeData.treatment_in_charge_employee.last_name + ", " +
												inChargeData.treatment_in_charge_employee.first_name + " " + inChargeData.treatment_in_charge_employee.middle_name + " (" + 
												inChargeData.treatment_in_charge_employee.job.job_title +")</td>" +
												"<td></td>" +
												"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
												"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
											"</tr>"
										);
								})
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ treatment_in_charge_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>SURGERIES</td>" +
										"</tr>"
								);
							
							var surgery_subtotal=0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_surgery_bill, function (i, surgeryBillData) {
								surgery_subtotal += surgeryBillData.surgery_bill_surgery.surgery_surgery_type.fee
								$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>&emsp;"+ moment(surgeryBillData.surgery_bill_surgery.created_at).format("MMM D, YYYY") +" - "+ surgeryBillData.surgery_bill_surgery.surgery_surgery_type.name +"</td>" +
										"<td></td>" +
										"<td class='text-right'>₱"+ surgeryBillData.surgery_bill_surgery.surgery_surgery_type.fee.toLocaleString() +"</td>" +
										"<td class='text-right'>₱"+ surgeryBillData.surgery_bill_surgery.surgery_surgery_type.fee.toLocaleString() +"</td>" +
									"</tr>"
								);
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ surgery_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='4'>SURGERIES PROFESSIONAL FEE</td>" +
										"</tr>"
								);

							var surgery_in_charge_subtotal =0
							$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_surgery_bill, function (i, surgeryBillData) {
								$.each(surgeryBillData.surgery_bill_surgery.surgery_surgery_in_charge, function (i, inChargeData) {
									surgery_in_charge_subtotal += inChargeData.professional_fee
									$("#ip_receipt_table")
										.find("tbody")
										.append(
											"<tr>" +
												"<td>&emsp;"+ moment(inChargeData.created_at).format("MMM D, YYYY") +" - "+ inChargeData.surgery_in_charge_employee.last_name + ", " +
												inChargeData.surgery_in_charge_employee.first_name + " " + inChargeData.surgery_in_charge_employee.middle_name + " (" + 
												inChargeData.surgery_in_charge_employee.job.job_title +")</td>" +
												"<td></td>" +
												"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
												"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
											"</tr>"
										);
								})
							})

							$("#ip_receipt_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
										"<th class='text-right'>₱"+ surgery_in_charge_subtotal.toLocaleString()  +"</th>" +
									"</tr>"
								);
							var total_hospital_charges = (request_subtotal + room_subtotal + medical_subtotal +
								medicine_subtotal + treatment_subtotal + treatment_in_charge_subtotal + surgery_subtotal + surgery_in_charge_subtotal)
								
							$("#ip_total_charges").text(
								"₱" + total_hospital_charges.toLocaleString()
							);
							$("#ip_check_amount").text(
								"₱" + total_hospital_charges.toLocaleString()
							);
							$("#ip_total_paid").text(
								"₱" + total_hospital_charges.toLocaleString()
							);
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}
				$("#modal_submit_confirmation").modal('hide')
				$("#full_payment_div_form").hide()
			})
			
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

	// $("#full_payment_btn").on("click", function () {
	// 	$("html, body").animate({ scrollTop: 0 }, "slow");
	// 	$("#full_payment_div_form").show();
	// 	term_name = "Full Payment";
	// 	$.ajax({
	// 		url: apiURL + "payment_term/find_by_name/" + term_name,
	// 		dataSrc: "",
	// 		type: "GET",
	// 		success: function (data) {
	// 			$("#payment_term_id").val(data.id);
	// 		},
	// 		error: function ({ responseJSON }) {
	// 			// toastr.error(data.responseJSON.detail);
	// 		},
	// 	});
	// });

	

	//INPATIENT PARTIAL PAYMENT
	$("#partial_payment_btn").on("click", function () {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$("#full_payment_div_form").hide();
		$("#prescription_bill_div").hide();
		$("#room_bill_div").hide();
		$("#lab_request_bill_div").hide();
		$("#treatment_bill_div").hide();
		$("#surgery_bill_div").hide();
		$("#inpatient_payment_div").hide()
		$("#view_full_payment_div").hide()
		$("#view_prescription_payment_div").hide()
		$("#view_room_payment_div").hide()
		$("#view_request_payment_div").hide()
		$("#view_treatment_payment_div").hide()
		$("#view_surgery_payment_div").hide()
		$("#view_receipt_prescription_payment_div").hide()
		$("#view_receipt_room_payment_div").hide()
		$("#view_receipt_request_payment_div").hide()
		$("#view_receipt_treatment_payment_div").hide()
		$("#view_receipt_surgery_payment_div").hide()
		$("#partial_payment_div_form").show();
		term_name = "Partial Payment";
		$.ajax({
			url: apiURL + "payment_term/find_by_name/" + term_name,
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#payment_term_id").val(data.id);
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	});

	loadInpatientName = () => {
		$.ajax({
			url: apiURL + "inpatient/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#inpatient_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.inpatient_patient.first_name +
						" " +
						dataOptions.inpatient_patient.last_name +
						"</option>";
					$("#inpatient_id").append(options);
				});
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadInpatientName();

	selectBillToPay = (bill_type) => {
		if (bill_type == "Prescription Bill") {
			$("#this_inpatient_room_bills_table").hide();
			$("#this_inpatient_request_bills_table").hide();
			$("#this_inpatient_surgery_bills_table").hide();
			$("#this_inpatient_treatment_bills_table").hide();
			$("#this_inpatient_prescription_bills_table").show();
			$("#search_patient_modal").modal("show");
			$("#inpatient_id").on("change", function () {
				$.ajax({
					url:
						apiURL +
						"inpatient/" +
						$("#inpatient_id").val() +
						"/prescription_bills",
					dataSrc: "",
					type: "GET",
					success: function (data) {
						$("#this_inpatient_prescription_bills_table").find("tbody").empty();
						if (data.inpatient_prescription_bill.length == 0) {
							$("#this_inpatient_prescription_bills_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='3'><i>No Pending Prescription Bill Available</i></td>" +
										"</tr>"
								);
						}

						$.each(data.inpatient_prescription_bill, function (i, dataOptions) {
							var prescription_bill_no = dataOptions.prescription_bill_no;
							var tr = "";

							tr =
								"<tr>" +
								"<td>" +
								prescription_bill_no +
								"</td>" +
								"<td>" +
								dataOptions.total_amount +
								"</td>";

							if (dataOptions.status == "Paid") {
								tr +=
									"<td><span class='badge badge-success p-2 w-100'><i class='nav-icon fas fa-check mr-1'></i>Paid</span></td>";
							} else if (dataOptions.status == "Pending") {
								tr +=
									"<td><button type='button' class='btn btn-primary'" +
									"onClick=\"return payPrescriptionBill('" +
									dataOptions.id +
									"')\"><i class='fas fa-money-check-alt'>Pay Now</i></button></td>";
							}

							tr += "</tr>";

							$("#this_inpatient_prescription_bills_table")
								.find("tbody")
								.append(tr);
						});
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});
			});
			$("#inpatient_id").trigger("change");
		} else if (bill_type == "Room Bill") {
			$("#this_inpatient_prescription_bills_table").hide();
			$("#this_inpatient_request_bills_table").hide();
			$("#this_inpatient_surgery_bills_table").hide();
			$("#this_inpatient_treatment_bills_table").hide();
			$("#this_inpatient_room_bills_table").show();
			$("#search_patient_modal").modal("show");
			$("#inpatient_id").on("change", function () {
				$.ajax({
					url:
						apiURL +
						"inpatient/" +
						$("#inpatient_id").val() +
						"/inpatient_bill",
					dataSrc: "",
					type: "GET",
					success: function (data) {
						$("#this_inpatient_room_bills_table").find("tbody").empty();
						if (data.inpatient_inpatient_bill.length == 0) {
							$("#this_inpatient_room_bills_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='3'><i>No Pending Room Bill Available</i></td>" +
										"</tr>"
								);
						}
						$.each(data.inpatient_inpatient_bill, function (i, dataOptions) {
							if (dataOptions.inpatient_bill_room_bill.length == 0) {
								$("#this_inpatient_room_bills_table")
									.find("tbody")
									.append(
										"<tr>" +
											"<td colspan='3'><i>No Pending Room Bill Available</i></td>" +
											"</tr>"
									);
							}

							$.each(
								dataOptions.inpatient_bill_room_bill,
								function (i, roomBillDataOptions) {
									var room_bill_no = roomBillDataOptions.room_bill_no;
									var tr = "";

									tr =
										"<tr>" +
										"<td>" +
										room_bill_no +
										"</td>" +
										"<td>" +
										roomBillDataOptions.total_amount +
										"</td>";

									if (roomBillDataOptions.status == "Paid") {
										tr +=
											"<td><span class='badge badge-success p-2 w-100'><i class='nav-icon fas fa-check mr-1'></i>Paid</span></td>";
									} else if (roomBillDataOptions.status == "Pending") {
										tr +=
											"<td><button type='button' class='btn btn-primary'" +
											"onClick=\"return payRoomBill('" +
											roomBillDataOptions.id +
											"')\"><i class='fas fa-money-check-alt'>Pay Now</i></button></td>";
									}

									tr += "</tr>";

									$("#this_inpatient_room_bills_table")
										.find("tbody")
										.append(tr);
								}
							);
						});
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});
			});
			$("#inpatient_id").trigger("change");
		} else if (bill_type == "Lab Request Bill") {
			$("#this_inpatient_prescription_bills_table").hide();
			$("#this_inpatient_room_bills_table").hide();
			$("#this_inpatient_surgery_bills_table").hide();
			$("#this_inpatient_treatment_bills_table").hide();
			$("#this_inpatient_request_bills_table").show();
			$("#search_patient_modal").modal("show");
			$("#inpatient_id").on("change", function () {
				$.ajax({
					url:
						apiURL +
						"inpatient/" +
						$("#inpatient_id").val() +
						"/inpatient_bill",
					dataSrc: "",
					type: "GET",
					success: function (data) {
						$("#this_inpatient_request_bills_table").find("tbody").empty();
						if (data.inpatient_inpatient_bill.length == 0) {
							$("#this_inpatient_request_bills_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='3'><i>No Pending Lab Request Bill Available</i></td>" +
										"</tr>"
								);
						}
						$.each(data.inpatient_inpatient_bill, function (i, dataOptions) {
							if (dataOptions.inpatient_bill_request_bill.length == 0) {
								$("#this_inpatient_request_bills_table")
									.find("tbody")
									.append(
										"<tr>" +
											"<td colspan='3'><i>No Pending Lab Request Bill Available</i></td>" +
											"</tr>"
									);
							}

							$.each(
								dataOptions.inpatient_bill_request_bill,
								function (i, requestBillDataOptions) {
									var lab_request_bill_no =
										requestBillDataOptions.lab_request_bill_no;
									var tr = "";

									tr =
										"<tr>" +
										"<td>" +
										lab_request_bill_no +
										"</td>" +
										"<td>" +
										requestBillDataOptions.total_amount +
										"</td>";

									if (requestBillDataOptions.status == "Paid") {
										tr +=
											"<td><span class='badge badge-success p-2 w-100'><i class='nav-icon fas fa-check mr-1'></i>Paid</span></td>";
									} else if (requestBillDataOptions.status == "Pending") {
										tr +=
											"<td><button type='button' class='btn btn-primary'" +
											"onClick=\"return payLabRequestBill('" +
											requestBillDataOptions.id +
											"')\"><i class='fas fa-money-check-alt'>Pay Now</i></button></td>";
									}

									tr += "</tr>";

									$("#this_inpatient_request_bills_table")
										.find("tbody")
										.append(tr);
								}
							);
						});
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});
			});
			$("#inpatient_id").trigger("change");
		} else if (bill_type == "Treatment Bill") {
			$("#this_inpatient_prescription_bills_table").hide();
			$("#this_inpatient_request_bills_table").hide();
			$("#this_inpatient_room_bills_table").hide();
			$("#this_inpatient_surgery_bills_table").hide();
			$("#this_inpatient_treatment_bills_table").show();
			$("#search_patient_modal").modal("show");
			$("#inpatient_id").on("change", function () {
				$.ajax({
					url:
						apiURL +
						"inpatient/" +
						$("#inpatient_id").val() +
						"/inpatient_bill",
					dataSrc: "",
					type: "GET",
					success: function (data) {
						$("#this_inpatient_treatment_bills_table").find("tbody").empty();
						if (data.inpatient_inpatient_bill.length == 0) {
							$("#this_inpatient_treatment_bills_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='3'><i>No Pending Treatment Bill Available</i></td>" +
										"</tr>"
								);
						}
						$.each(data.inpatient_inpatient_bill, function (i, dataOptions) {
							if (dataOptions.inpatient_bill_treatment_bill.length == 0) {
								$("#this_inpatient_treatment_bills_table")
									.find("tbody")
									.append(
										"<tr>" +
											"<td colspan='3'><i>No Pending Treatment Bill Available</i></td>" +
											"</tr>"
									);
							}

							$.each(
								dataOptions.inpatient_bill_treatment_bill,
								function (i, treatmentBillDataOptions) {
									var treatment_bill_no =
										treatmentBillDataOptions.treatment_bill_no;
									var tr = "";

									tr =
										"<tr>" +
										"<td>" +
										treatment_bill_no +
										"</td>" +
										"<td>" +
										treatmentBillDataOptions.total_amount +
										"</td>";

									if (treatmentBillDataOptions.status == "Paid") {
										tr +=
											"<td><span class='badge badge-success p-2 w-100'><i class='nav-icon fas fa-check mr-1'></i>Paid</span></td>";
									} else if (treatmentBillDataOptions.status == "Pending") {
										tr +=
											"<td><button type='button' class='btn btn-primary'" +
											"onClick=\"return payTreatmentBill('" +
											treatmentBillDataOptions.id +
											"')\"><i class='fas fa-money-check-alt'>Pay Now</i></button></td>";
									}

									tr += "</tr>";

									$("#this_inpatient_treatment_bills_table")
										.find("tbody")
										.append(tr);
								}
							);
						});
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});
			});
			$("#inpatient_id").trigger("change");
		} else if (bill_type == "Surgery Bill") {
			$("#this_inpatient_prescription_bills_table").hide();
			$("#this_inpatient_request_bills_table").hide();
			$("#this_inpatient_room_bills_table").hide();
			$("#this_inpatient_treatment_bills_table").hide();
			$("#this_inpatient_surgery_bills_table").show();
			$("#search_patient_modal").modal("show");
			$("#inpatient_id").on("change", function () {
				$.ajax({
					url:
						apiURL +
						"inpatient/" +
						$("#inpatient_id").val() +
						"/inpatient_bill",
					dataSrc: "",
					type: "GET",
					success: function (data) {
						$("#this_inpatient_surgery_bills_table").find("tbody").empty();
						if (data.inpatient_inpatient_bill.length == 0) {
							$("#this_inpatient_surgery_bills_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td colspan='3'><i>No Pending Surgery Bill Available</i></td>" +
										"</tr>"
								);
						}
						$.each(data.inpatient_inpatient_bill, function (i, dataOptions) {
							if (dataOptions.inpatient_bill_surgery_bill.length == 0) {
								$("#this_inpatient_surgery_bills_table")
									.find("tbody")
									.append(
										"<tr>" +
											"<td colspan='3'><i>No Pending Surgery Bill Available</i></td>" +
											"</tr>"
									);
							}

							$.each(
								dataOptions.inpatient_bill_surgery_bill,
								function (i, surgeryBillDataOptions) {
									var surgery_bill_no = surgeryBillDataOptions.surgery_bill_no;
									var tr = "";

									tr =
										"<tr>" +
										"<td>" +
										surgery_bill_no +
										"</td>" +
										"<td>" +
										surgeryBillDataOptions.total_amount +
										"</td>";

									if (surgeryBillDataOptions.status == "Paid") {
										tr +=
											"<td><span class='badge badge-success p-2 w-100'><i class='nav-icon fas fa-check mr-1'></i>Paid</span></td>";
									} else if (surgeryBillDataOptions.status == "Pending") {
										tr +=
											"<td><button type='button' class='btn btn-primary'" +
											"onClick=\"return paySurgeryBill('" +
											surgeryBillDataOptions.id +
											"')\"><i class='fas fa-money-check-alt'>Pay Now</i></button></td>";
									}

									tr += "</tr>";

									$("#this_inpatient_surgery_bills_table")
										.find("tbody")
										.append(tr);
								}
							);
						});
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});
			});
			$("#inpatient_id").trigger("change");
		}
	};

	payPrescriptionBill = (id) => {
		$("#search_patient_modal").modal("hide");
		$("#room_bill_payment_stepper").removeClass("bs-stepper");
		$("#lab_request_bill_payment_stepper").removeClass("bs-stepper");
		$("#treatment_bill_payment_stepper").removeClass("bs-stepper");
		$("#surgery_bill_payment_stepper").removeClass("bs-stepper");
		$("#pres_bill_payment_stepper").addClass("bs-stepper");
		stepper = new Stepper($(".bs-stepper")[0]);

		$.ajax({
			url: apiURL + "prescription_bill/" + id,
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#room_bill_div").hide();
				$("#lab_request_bill_div").hide();
				$("#treatment_bill_div").hide();
				$("#surgery_bill_div").hide();
				$("#prescription_bill_div").show();

				$("#prescription_bill_uuid").val(id);
				$("#td_prescription_bill_no").text(data.prescription_bill_no);
				$("#td_date_of_billing").text(data.billing_date);
				$("#td_medicine_amount").text(data.medicine_amount);
				$("#td_medical_supply_amount").text(data.medical_amount);
				$("#td_sub_total").text(data.sub_total);
				$("#td_total_amount").text(data.total_amount);

				$("#pres_payment_method_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#pres_payment_method_id").change(function () {
		var method = $("#pres_payment_method_id").select2("data");
		if (method[0].text == "Cash") {
			$(".partial_pres_bill_payment_check").hide();
			$(".partial_pres_bill_payment_cash").show();
			$("#pres_payment_cash_tendered").attr(
				"min",
				$("#td_total_amount").text()
			);
			$("#pres_payment_cash_tendered").attr(
				"data-msg-min",
				"Cash tendered is not enough."
			);
			$("#pres_payment_cash_tendered").keyup(function () {
				var change =
					$("#pres_payment_cash_tendered").val() -
					parseFloat($("#td_total_amount").text());

				if (change >= 0) {
					$("#pres_payment_change").text(change);
				} else {
					$("#pres_payment_change").text("0");
				}
			});
		} else if (method[0].text == "Check") {
			$(".partial_pres_bill_payment_cash").hide();
			$(".partial_pres_bill_payment_check").show();
			$("#pres_payment_check_amount").attr("min", $("#td_total_amount").text());
			$("#pres_payment_check_amount").attr(
				"data-msg-min",
				"Check amount is not enough."
			);
			$("#pres_payment_check_amount").attr("max", $("#td_total_amount").text());
			$("#pres_payment_check_amount").attr(
				"data-msg-max",
				"Check amount exceeded the required amount."
			);
		} else {
			$(".partial_pres_bill_payment_cash").hide();
			$(".partial_pres_bill_payment_check").hide();
		}
	});

	$("#pres_payment_check_amount").change(function(){
		$('#pres_payment_check_amount_in_words').moneyinwords($("#pres_payment_check_amount").val().toLocaleString(),'PH','PHP');
		$('#pres_payment_check_amount_in_words').text($('#pres_payment_check_amount_in_words').text().toUpperCase())
	})

	$("#prescription_payment_receipt_btn").printPreview({
		obj2print: "#prescription_payment_receipt",
		width: "810",
	});

	//add prescription payment
	$("#partial_payment_prescription_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$("#modal_submit_confirmation").modal('show')
			$("#confirm_submit").on("click", function () {
				var method = $("#pres_payment_method_id").select2("data");
				if (method[0].text == "Cash") {
					$.ajax({
						url: apiURL + "inpatient_prescription_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							prescription_bill_id: $("#prescription_bill_uuid").val(),

							amount_paid: parseFloat($("#td_total_amount").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#pres_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_cash_payment: {
								amount: parseFloat($("#td_total_amount").text()),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Prescription Bill has been paid.");
							$("#partial_payment_prescription_form").validate().resetForm();
							$("#partial_payment_prescription_form")[0].reset();
							loadPrescriptionBillPaymentTable();
							loadInpatientPaymentTable();
							$("#rec_pres_or_no").text(data.or_no);

							$("#rec_pres_date_of_billing").text(
								moment(
									data.in_prescription_payment_in_prescription_bill.billing_date
								).format("MMMM D, YYYY")
							);
							$("#rec_pres_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var inpatient_name =
								data.in_prescription_payment_in_prescription_bill
									.prescription_bill_inpatient.inpatient_patient.first_name +
								" " +
								data.in_prescription_payment_in_prescription_bill
									.prescription_bill_inpatient.inpatient_patient.last_name;
							$("#rec_pres_inpatient_name").text(inpatient_name);
							$("#rec_pres_remaining_balance").text(
								"₱" +
									data.in_prescription_payment_in_prescription_bill.prescription_bill_inpatient_bill.remaining_balance.toLocaleString()
							);
							var inpatient_bill_no =
								data.in_prescription_payment_in_prescription_bill
									.prescription_bill_inpatient_bill.inpatient_bill_no;
							$("#rec_pres_inpatient_bill_no").text(inpatient_bill_no);
							$("#rec_pres_bill_no").text(
								data.in_prescription_payment_in_prescription_bill
									.prescription_bill_no
							);

							var medical_row = "";
							var medicine_row = "";
							
							$("#pres_receipt_table tbody").empty();
							$("#pres_receipt_table tbody").append(
								"<tr>"+
									"<td colspan='4'>Medical Supplies</td>"+
								"</tr>"
							);
							$.each(
								data.in_prescription_payment_in_prescription_bill
									.prescription_bill_inpatient.inpatient_prescription,
								function (i, dataOptions) {
									$.each(
										dataOptions.prescription_medical_prescription,
										function (i, medicalOptions) {
											
											medical_row += "<tr>"+
											"<td>"+ (moment(medicalOptions.created_at).format("MMMM D, YYYY") + " " +medicalOptions.medical_prescription_medical.ms_product_name).toString() +"</td>"+
											"<td class='text-right'>"+ (medicalOptions.quantity).toString()+"</td>"+
											"<td class='text-right'>₱"+ (medicalOptions.medical_prescription_medical.ms_unit_price).toString() +"</td>"+
											"<td class='text-right'>₱"+ (medicalOptions.quantity * medicalOptions.medical_prescription_medical.ms_unit_price - medicalOptions.medical_prescription_medical.ms_tax).toString() +"</td>"+
											"</tr>";

										}
									);

									$.each(
										dataOptions.prescription_medicine_prescription,
										function (i, medicineOptions) {
											medicine_row += "<tr>"+
											"<td>" + (moment(medicineOptions.created_at).format("MMMM D, YYYY") + " " + medicineOptions.medicine_prescription_medicine.med_product_name).toString() +"</td>"+
											"<td class='text-right'>"+ (medicineOptions.quantity).toString() +"</td>"+
											"<td class='text-right'>₱"+ (medicineOptions.medicine_prescription_medicine.med_unit_price).toLocaleString() +"</td>"+
											"<td class='text-right'>₱"+ (medicineOptions.quantity * medicineOptions.medicine_prescription_medicine.med_unit_price - medicineOptions.medicine_prescription_medicine.med_tax).toLocaleString() +"</td>"+
											"</tr>";
										}
									);
								}
							);
							$("#pres_receipt_table tbody").append(medical_row);
							$("#pres_receipt_table tbody").append(
								"<tr>"+
									"<td colspan='4'>Medicines</td>"+
								"</tr>"
							);
							$("#pres_receipt_table tbody").append(medicine_row);
							$("#pres_receipt_table tbody").append(
								"<tr>"+
									"<th colspan='2'></th>"+
									"<th class='text-right'>Total Amount</th>"+
									"<th class='text-right'>₱"+ (data.in_prescription_payment_in_prescription_bill.total_amount).toLocaleString()+"</th>"+
								"</tr>"
							);

							$("#rec_pres_medicine_amount").text(
								"₱" +
									data.in_prescription_payment_in_prescription_bill.medicine_amount.toLocaleString()
							);
							$("#rec_pres_medical_amount").text(
								"₱" +
									data.in_prescription_payment_in_prescription_bill.medical_amount.toLocaleString()
							);
							$("#rec_pres_total_amount").text(
								"₱" +
									data.in_prescription_payment_in_prescription_bill.total_amount.toLocaleString()
							);
							$("#rec_pres_cash_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							$("#rec_pres_total_paid").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							stepper.next();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				} else if (method[0].text == "Check") {
					$.ajax({
						url: apiURL + "inpatient_prescription_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							prescription_bill_id: $("#prescription_bill_uuid").val(),
							amount_paid: $("#pres_payment_check_amount").val(),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#pres_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_check_payment: {
								check_no: $("#pres_payment_check_no").val(),
								check_date: $("#pres_payment_check_date").val(),
								account_name: $("#pres_payment_account_name").val(),
								account_no: $("#pres_payment_account_no").val(),
								rt_number: $("#pres_payment_rt_number").val(),
								payee_name: $("#pres_payment_payee_name").val(),
								amount: $("#pres_payment_check_amount").val(),
								// amount_in_words: $("#pres_payment_check_amount_in_words").val(),
								bank_name: $("#pres_payment_bank_name").val(),
								bank_address: $("#pres_payment_bank_address").val(),
								description: $("#pres_payment_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Prescription Bill has been paid.");
							$("#partial_payment_prescription_form").validate().resetForm();
							$("#partial_payment_prescription_form")[0].reset();
							loadPrescriptionBillPaymentTable();
							loadInpatientPaymentTable();
							$("#rec_pres_or_no").text(data.or_no);

							$("#rec_pres_date_of_billing").text(
								moment(
									data.in_prescription_payment_in_prescription_bill.billing_date
								).format("MMMM D, YYYY")
							);
							$("#rec_pres_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var inpatient_name =
								data.in_prescription_payment_in_prescription_bill
									.prescription_bill_inpatient.inpatient_patient.first_name +
								" " +
								data.in_prescription_payment_in_prescription_bill
									.prescription_bill_inpatient.inpatient_patient.last_name;
							$("#rec_pres_inpatient_name").text(inpatient_name);
							$("#rec_pres_remaining_balance").text(
								"₱" +
									data.in_prescription_payment_in_prescription_bill.prescription_bill_inpatient_bill.remaining_balance.toLocaleString()
							);
							var inpatient_bill_no =
								data.in_prescription_payment_in_prescription_bill
									.prescription_bill_inpatient_bill.inpatient_bill_no;
							$("#rec_pres_inpatient_bill_no").text(inpatient_bill_no);
							$("#rec_pres_bill_no").text(
								data.in_prescription_payment_in_prescription_bill
									.prescription_bill_no
							);

							var medical_row = "";
							var medicine_row = "";
							
							$("#pres_receipt_table tbody").empty();
							$("#pres_receipt_table tbody").append(
								"<tr>"+
									"<td colspan='4'>Medical Supplies</td>"+
								"</tr>"
							);
							$.each(
								data.in_prescription_payment_in_prescription_bill
									.prescription_bill_inpatient.inpatient_prescription,
								function (i, dataOptions) {
									$.each(
										dataOptions.prescription_medical_prescription,
										function (i, medicalOptions) {
											
											medical_row += "<tr>"+
											"<td>"+ (moment(medicalOptions.created_at).format("MMMM D, YYYY") + " " +medicalOptions.medical_prescription_medical.ms_product_name).toString() +"</td>"+
											"<td class='text-right'>"+ (medicalOptions.quantity).toString()+"</td>"+
											"<td class='text-right'>₱"+ (medicalOptions.medical_prescription_medical.ms_unit_price).toString() +"</td>"+
											"<td class='text-right'>₱"+ (medicalOptions.quantity * medicalOptions.medical_prescription_medical.ms_unit_price - medicalOptions.medical_prescription_medical.ms_tax).toString() +"</td>"+
											"</tr>";

										}
									);

									$.each(
										dataOptions.prescription_medicine_prescription,
										function (i, medicineOptions) {
											medicine_row += "<tr>"+
											"<td>" + (moment(medicineOptions.created_at).format("MMMM D, YYYY") + " " + medicineOptions.medicine_prescription_medicine.med_product_name).toString() +"</td>"+
											"<td class='text-right'>"+ (medicineOptions.quantity).toString() +"</td>"+
											"<td class='text-right'>₱"+ (medicineOptions.medicine_prescription_medicine.med_unit_price).toLocaleString() +"</td>"+
											"<td class='text-right'>₱"+ (medicineOptions.quantity * medicineOptions.medicine_prescription_medicine.med_unit_price - medicineOptions.medicine_prescription_medicine.med_tax).toLocaleString() +"</td>"+
											"</tr>";
										}
									);
								}
							);
							$("#pres_receipt_table tbody").append(medical_row);
							$("#pres_receipt_table tbody").append(
								"<tr>"+
									"<td colspan='4'>Medicines</td>"+
								"</tr>"
							);
							$("#pres_receipt_table tbody").append(medicine_row);
							$("#pres_receipt_table tbody").append(
								"<tr>"+
									"<th colspan='2'></th>"+
									"<th class='text-right'>Total Amount</th>"+
									"<th class='text-right'>₱"+ (data.in_prescription_payment_in_prescription_bill.total_amount).toLocaleString()+"</th>"+
								"</tr>"
							);

							$("#rec_pres_medicine_amount").text(
								"₱" +
									data.in_prescription_payment_in_prescription_bill.medicine_amount.toLocaleString()
							);
							$("#rec_pres_medical_amount").text(
								"₱" +
									data.in_prescription_payment_in_prescription_bill.medical_amount.toLocaleString()
							);
							$("#rec_pres_total_amount").text(
								"₱" +
									data.in_prescription_payment_in_prescription_bill.total_amount.toLocaleString()
							);
							$("#rec_pres_check_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							$("#rec_pres_total_paid").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							stepper.next();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}
				$("#modal_submit_confirmation").modal('hide')
				$("#prescription_bill_div").hide()
			})
			
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

	payRoomBill = (id) => {
		$("#search_patient_modal").modal("hide");

		$("#pres_bill_payment_stepper").removeClass("bs-stepper");
		$("#lab_request_bill_payment_stepper").removeClass("bs-stepper");
		$("#treatment_bill_payment_stepper").removeClass("bs-stepper");
		$("#surgery_bill_payment_stepper").removeClass("bs-stepper");
		$("#room_bill_payment_stepper").addClass("bs-stepper");

		stepper = new Stepper($(".bs-stepper")[0]);

		$.ajax({
			url: apiURL + "room_bill/" + id,
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#lab_request_bill_div").hide();
				$("#treatment_bill_div").hide();
				$("#surgery_bill_div").hide();
				$("#prescription_bill_div").hide();
				$("#room_bill_div").show();

				$("#prescription_bill_uuid").val(id);

				$("#room_bill_uuid").val(id);
				$("#td_room_bill_no").text(data.room_bill_no);
				$("#td_room_bill_date_of_billing").text(
					moment(data.created_at).format("MMMM D, YYYY")
				);
				$("#td_room_number").text(
					data.room_bill_room_admission.room_admission_room.room_number
				);
				$("#td_no_of_days").text(data.no_of_days);
				$("#td_room_bill_total_amount").text(data.total_amount);

				$("#room_payment_method_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#room_payment_method_id").change(function () {
		var method = $("#room_payment_method_id").select2("data");
		if (method[0].text == "Cash") {
			$(".partial_room_bill_payment_check").hide();
			$(".partial_room_bill_payment_cash").show();
			$("#room_payment_cash_tendered").attr(
				"min",
				$("#td_room_bill_total_amount").text()
			);
			$("#room_payment_cash_tendered").attr(
				"data-msg-min",
				"Cash tendered is not enough."
			);
			$("#room_payment_cash_tendered").keyup(function () {
				var change =
					$("#room_payment_cash_tendered").val() -
					parseFloat($("#td_room_bill_total_amount").text());
				if (change >= 0) {
					$("#room_payment_change").text(change);
				} else {
					$("#room_payment_change").text("0");
				}
			});
		} else if (method[0].text == "Check") {
			$(".partial_room_bill_payment_cash").hide();
			$(".partial_room_bill_payment_check").show();
			$("#room_payment_check_amount").attr(
				"min",
				$("#td_room_bill_total_amount").text()
			);
			$("#room_payment_check_amount").attr(
				"data-msg-min",
				"Check amount is not enough."
			);
			$("#room_payment_check_amount").attr(
				"max",
				$("#td_room_bill_total_amount").text()
			);
			$("#room_payment_check_amount").attr(
				"data-msg-max",
				"Check amount exceeded the required amount."
			);
		} else {
			$(".partial_room_bill_payment_cash").hide();
			$(".partial_room_bill_payment_check").hide();
		}
	});

	$("#room_payment_check_amount").change(function(){
		$('#room_payment_check_amount_in_words').moneyinwords($("#room_payment_check_amount").val().toLocaleString(),'PH','PHP');
		$('#room_payment_check_amount_in_words').text($('#room_payment_check_amount_in_words').text().toUpperCase())
	})

	$("#room_payment_receipt_btn").printPreview({
		obj2print: "#room_payment_receipt",
		width: "810",
	});

	//add room 	payment
	$("#partial_payment_room_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$("#modal_submit_confirmation").modal('show')
			$("#confirm_submit").on("click", function () {
				var method = $("#room_payment_method_id").select2("data");
				if (method[0].text == "Cash") {
					$.ajax({
						url: apiURL + "inpatient_room_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							room_bill_id: $("#room_bill_uuid").val(),
							amount_paid: parseFloat($("#td_room_bill_total_amount").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#room_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_cash_payment: {
								amount: parseFloat($("#td_room_bill_total_amount").text()),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Room Bill has been paid.");
							$("#partial_payment_room_form").validate().resetForm();
							$("#partial_payment_room_form")[0].reset();
							loadRoomBillPaymentTable();
							loadInpatientPaymentTable();

							$("#rec_room_or_no").text(data.or_no);

							$("#rec_room_date_of_billing").text(
								moment(
									data.in_room_payment_in_room_bill.room_bill_inpatient_bill.date_of_billing
								).format("MMMM D, YYYY")
							);
							$("#rec_room_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var inpatient_name =
								data.in_room_payment_in_room_bill
									.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
								" " +
								data.in_room_payment_in_room_bill
									.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
							var inpatient_address = data.in_room_payment_in_room_bill
							.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
							$("#rec_room_inpatient_name").text(inpatient_name);
							$("#rec_room_inpatient_address").text(inpatient_address);
							
							$("#rec_room_remaining_balance").text(
								"₱" +
									data.in_room_payment_in_room_bill.room_bill_inpatient_bill.remaining_balance.toLocaleString()
							);
							var inpatient_bill_no =
								data.in_room_payment_in_room_bill
									.room_bill_inpatient_bill.inpatient_bill_no;
							$("#rec_room_inpatient_bill_no").text(inpatient_bill_no);
							$("#rec_room_bill_no").text(
								data.in_room_payment_in_room_bill
									.room_bill_no
							);

							var description = "";
							
							$("#room_receipt_table tbody").empty();

							description += "<tr>"+
											"<td>" + (data.in_room_payment_in_room_bill.room_bill_room_admission.admission_date+ " to " + 
											data.in_room_payment_in_room_bill.room_bill_room_admission.admission_date + " " +
											data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_number + " " +
											data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_room_type.name).toString() +"</td>"+
											"<td class='text-right'>"+ (data.in_room_payment_in_room_bill.no_of_days).toString() +"</td>"+
											"<td class='text-right'>₱"+ (data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_room_type.fee).toLocaleString() +"</td>"+
											"<td class='text-right'>₱"+ (data.in_room_payment_in_room_bill.no_of_days * data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_room_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#room_receipt_table tbody").append(description);
							$("#room_receipt_table tbody").append(
								"<tr>"+
									"<th colspan='2'></th>"+
									"<th class='text-right'>Total Amount</th>"+
									"<th class='text-right'>₱"+ data.in_room_payment_in_room_bill.total_amount.toLocaleString()+"</th>"+
								"</tr>"
							);
							$("#rec_room_cash_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							$("#rec_room_total_paid").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							stepper.next();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				} else if (method[0].text == "Check") {
					$.ajax({
						url: apiURL + "inpatient_room_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							room_bill_id: $("#room_bill_uuid").val(),
							amount_paid: $("#room_payment_check_amount").val(),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#room_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_check_payment: {
								check_no: $("#room_payment_check_no").val(),
								check_date: $("#room_payment_check_date").val(),
								account_name: $("#room_payment_account_name").val(),
								account_no: $("#room_payment_account_no").val(),
								rt_number: $("#room_payment_rt_number").val(),
								payee_name: $("#room_payment_payee_name").val(),
								amount: $("#room_payment_check_amount").val(),
								// amount_in_words: $("#room_payment_check_amount_in_words").val(),
								bank_name: $("#room_payment_bank_name").val(),
								bank_address: $("#room_payment_bank_address").val(),
								description: $("#room_payment_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Room Bill has been paid.");
							$("#partial_payment_room_form").validate().resetForm();
							$("#partial_payment_room_form")[0].reset();
							loadRoomBillPaymentTable();
							loadInpatientPaymentTable();
							$("#rec_room_or_no").text(data.or_no);

							$("#rec_room_date_of_billing").text(
								moment(
									data.in_room_payment_in_room_bill.room_bill_inpatient_bill.date_of_billing
								).format("MMMM D, YYYY")
							);
							$("#rec_room_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var inpatient_name =
								data.in_room_payment_in_room_bill
									.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
								" " +
								data.in_room_payment_in_room_bill
									.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
							var inpatient_address = data.in_room_payment_in_room_bill
							.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
							$("#rec_room_inpatient_name").text(inpatient_name);
							$("#rec_room_inpatient_address").text(inpatient_address);
							
							$("#rec_room_remaining_balance").text(
								"₱" +
									data.in_room_payment_in_room_bill.room_bill_inpatient_bill.remaining_balance.toLocaleString()
							);
							var inpatient_bill_no =
								data.in_room_payment_in_room_bill
									.room_bill_inpatient_bill.inpatient_bill_no;
							$("#rec_room_inpatient_bill_no").text(inpatient_bill_no);
							$("#rec_room_bill_no").text(
								data.in_room_payment_in_room_bill
									.room_bill_no
							);

							var description = "";
							
							$("#room_receipt_table tbody").empty();

							description += "<tr>"+
											"<td>" + (data.in_room_payment_in_room_bill.room_bill_room_admission.admission_date+ " to " + 
											data.in_room_payment_in_room_bill.room_bill_room_admission.admission_date + " " +
											data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_number + " " +
											data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_room_type.name).toString() +"</td>"+
											"<td class='text-right'>"+ (data.in_room_payment_in_room_bill.no_of_days).toString() +"</td>"+
											"<td class='text-right'>₱"+ (data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_room_type.fee).toLocaleString() +"</td>"+
											"<td class='text-right'>₱"+ (data.in_room_payment_in_room_bill.no_of_days * data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_room_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#room_receipt_table tbody").append(description);
							$("#room_receipt_table tbody").append(
								"<tr>"+
									"<th colspan='2'></th>"+
									"<th class='text-right'>Total Amount</th>"+
									"<th class='text-right'>₱"+ data.in_room_payment_in_room_bill.total_amount.toLocaleString()+"</th>"+
								"</tr>"
							);
							$("#rec_room_check_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							$("#rec_room_total_paid").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							stepper.next();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}
				$("#modal_submit_confirmation").modal('hide')
				$("#room_bill_div").hide()
			})
			
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

	payLabRequestBill = (id) => {
		$("#search_patient_modal").modal("hide");

		$("#pres_bill_payment_stepper").removeClass("bs-stepper");
		$("#room_bill_payment_stepper").removeClass("bs-stepper");
		$("#treatment_bill_payment_stepper").removeClass("bs-stepper");
		$("#surgery_bill_payment_stepper").removeClass("bs-stepper");
		$("#lab_request_bill_payment_stepper").addClass("bs-stepper");

		stepper = new Stepper($(".bs-stepper")[0]);

		$.ajax({
			url: apiURL + "lab_request_bill/" + id,
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#surgery_bill_div").hide();
				$("#prescription_bill_div").hide();
				$("#room_bill_div").hide();
				$("#treatment_bill_div").hide();
				$("#lab_request_bill_div").show();

				$("#lab_request_bill_uuid").val(id);
				$("#td_lab_request_bill_no").text(data.lab_request_bill_no);
				$("#td_lab_request_bill_date_of_billing").text(
					moment(data.created_at).format("MMMM D, YYYY")
				);
				$("#td_lab_request_no").text(
					data.request_bill_lab_request.lab_request_no
				);
				$("#td_lab_test_type").text(
					data.request_bill_lab_request.lab_request_lab_test_type.name
				);
				$("#td_lab_request_bill_total_amount").text(data.total_amount);

				$("#lab_request_payment_method_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#lab_request_payment_method_id").change(function () {
		var method = $("#lab_request_payment_method_id").select2("data");
		if (method[0].text == "Cash") {
			$(".partial_lab_request_bill_payment_check").hide();
			$(".partial_lab_request_bill_payment_cash").show();
			$("#lab_request_payment_cash_tendered").attr(
				"min",
				$("#td_lab_request_bill_total_amount").text()
			);
			$("#lab_request_payment_cash_tendered").attr(
				"data-msg-min",
				"Cash tendered is not enough."
			);
			$("#lab_request_payment_cash_tendered").keyup(function () {
				var change =
					$("#lab_request_payment_cash_tendered").val() -
					parseFloat($("#td_lab_request_bill_total_amount").text());
				if (change >= 0) {
					$("#lab_request_payment_change").text(change);
				} else {
					$("#lab_request_payment_change").text("0");
				}
			});
		} else if (method[0].text == "Check") {
			$(".partial_lab_request_bill_payment_cash").hide();
			$(".partial_lab_request_bill_payment_check").show();
			$("#lab_request_payment_check_amount").attr(
				"min",
				$("#td_lab_request_bill_total_amount").text()
			);
			$("#lab_request_payment_check_amount").attr(
				"data-msg-min",
				"Check amount is not enough."
			);
			$("#lab_request_payment_check_amount").attr(
				"max",
				$("#td_lab_request_bill_total_amount").text()
			);
			$("#lab_request_payment_check_amount").attr(
				"data-msg-max",
				"Check amount exceeded the required amount."
			);
		} else {
			$(".partial_lab_request_bill_payment_cash").hide();
			$(".partial_lab_request_bill_payment_check").hide();
		}
	});

	$("#lab_request_payment_check_amount").change(function(){
		$('#lab_request_payment_check_amount_in_words').moneyinwords($("#lab_request_payment_check_amount").val().toLocaleString(),'PH','PHP');
		$('#lab_request_payment_check_amount_in_words').text($('#lab_request_payment_check_amount_in_words').text().toUpperCase())
	})

	$("#lab_request_payment_receipt_btn").printPreview({
		obj2print: "#lab_request_payment_receipt",
		width: "810",
	});

	//add lab request payment
	$("#partial_payment_lab_request_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$("#modal_submit_confirmation").modal('show')
			$("#confirm_submit").on("click", function () {
				var method = $("#lab_request_payment_method_id").select2("data");
				if (method[0].text == "Cash") {
					$.ajax({
						url: apiURL + "inpatient_lab_request_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							lab_request_bill_id: $("#lab_request_bill_uuid").val(),
							amount_paid: parseFloat(
								$("#td_lab_request_bill_total_amount").text()
							),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#lab_request_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_cash_payment: {
								amount: parseFloat($("#td_lab_request_bill_total_amount").text()),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Lab Request Bill has been paid.");
							$("#partial_payment_lab_request_form").validate().resetForm();
							$("#partial_payment_lab_request_form")[0].reset();
							loadLabRequestBillPaymentTable();
							loadInpatientPaymentTable();
							$("#rec_lab_request_or_no").text(data.or_no);

							$("#rec_lab_request_date_of_billing").text(
								moment(
									data.in_request_payment_in_request_bill.request_bill_inpatient_bill.date_of_billing
								).format("MMMM D, YYYY")
							);
							$("#rec_lab_request_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var inpatient_name =
								data.in_request_payment_in_request_bill
									.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
								" " +
								data.in_request_payment_in_request_bill
									.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
							var inpatient_address = data.in_request_payment_in_request_bill
							.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
							$("#rec_lab_request_inpatient_name").text(inpatient_name);
							$("#rec_lab_request_inpatient_address").text(inpatient_address);
							
							$("#rec_lab_request_remaining_balance").text(
								"₱" +
									data.in_request_payment_in_request_bill.request_bill_inpatient_bill.remaining_balance.toLocaleString()
							);
							var inpatient_bill_no =
								data.in_request_payment_in_request_bill
									.request_bill_inpatient_bill.inpatient_bill_no;
							$("#rec_lab_request_inpatient_bill_no").text(inpatient_bill_no);
							$("#rec_lab_request_bill_no").text(
								data.in_request_payment_in_request_bill
									.lab_request_bill_no
							);

							var description = "";
							
							$("#lab_request_receipt_table tbody").empty();
							description += "<tr>"+
											"<td>" + (moment(data.in_request_payment_in_request_bill.request_bill_lab_request.created_at).format("MMMM D, YYYY")+ " " +
											data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_no + " " +
											data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_lab_test_type.name).toString() +"</td>"+
											"<td class='text-right'>₱"+ (data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_lab_test_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#lab_request_receipt_table tbody").append(description);
							$("#lab_request_receipt_table tbody").append(
								"<tr>"+
									"<th>Total Amount</th>"+
									"<th class='text-right'>₱"+ data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_lab_test_type.fee.toLocaleString()+"</th>"+
								"</tr>"
							);
							$("#rec_lab_request_cash_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							$("#rec_lab_request_total_paid").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							stepper.next();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				} else if (method[0].text == "Check") {
					$.ajax({
						url: apiURL + "inpatient_lab_request_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							lab_request_bill_id: $("#lab_request_bill_uuid").val(),
							amount_paid: $("#lab_request_payment_check_amount").val(),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#lab_request_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_check_payment: {
								check_no: $("#lab_request_payment_check_no").val(),
								check_date: $("#lab_request_payment_check_date").val(),
								account_name: $("#lab_request_payment_account_name").val(),
								account_no: $("#lab_request_payment_account_no").val(),
								rt_number: $("#lab_request_payment_rt_number").val(),
								payee_name: $("#lab_request_payment_payee_name").val(),
								amount: $("#lab_request_payment_check_amount").val(),
								// amount_in_words: $(
								// 	"#lab_request_payment_check_amount_in_words"
								// ).val(),
								bank_name: $("#lab_request_payment_bank_name").val(),
								bank_address: $("#lab_request_payment_bank_address").val(),
								description: $("#lab_request_payment_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Lab Request Bill has been paid.");
							$("#partial_payment_lab_request_form").validate().resetForm();
							$("#partial_payment_lab_request_form")[0].reset();
							loadLabRequestBillPaymentTable();
							loadInpatientPaymentTable();
							$("#rec_lab_request_or_no").text(data.or_no);

							$("#rec_lab_request_date_of_billing").text(
								moment(
									data.in_request_payment_in_request_bill.request_bill_inpatient_bill.date_of_billing
								).format("MMMM D, YYYY")
							);
							$("#rec_lab_request_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var inpatient_name =
								data.in_request_payment_in_request_bill
									.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
								" " +
								data.in_request_payment_in_request_bill
									.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
							var inpatient_address = data.in_request_payment_in_request_bill
							.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
							$("#rec_lab_request_inpatient_name").text(inpatient_name);
							$("#rec_lab_request_inpatient_address").text(inpatient_address);
							
							$("#rec_lab_request_remaining_balance").text(
								"₱" +
									data.in_request_payment_in_request_bill.request_bill_inpatient_bill.remaining_balance.toLocaleString()
							);
							var inpatient_bill_no =
								data.in_request_payment_in_request_bill
									.request_bill_inpatient_bill.inpatient_bill_no;
							$("#rec_lab_request_inpatient_bill_no").text(inpatient_bill_no);
							$("#rec_lab_request_bill_no").text(
								data.in_request_payment_in_request_bill
									.lab_request_bill_no
							);

							var description = "";
							
							$("#lab_request_receipt_table tbody").empty();
							description += "<tr>"+
											"<td>" + (moment(data.in_request_payment_in_request_bill.request_bill_lab_request.created_at).format("MMMM D, YYYY")+ " " +
											data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_no + " " +
											data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_lab_test_type.name).toString() +"</td>"+
											"<td class='text-right'>₱"+ (data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_lab_test_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#lab_request_receipt_table tbody").append(description);
							$("#lab_request_receipt_table tbody").append(
								"<tr>"+
									"<th>Total Amount</th>"+
									"<th class='text-right'>₱"+ data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_lab_test_type.fee.toLocaleString()+"</th>"+
								"</tr>"
							);
							$("#rec_lab_request_check_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							$("#rec_lab_request_total_paid").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							stepper.next();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}
				$("#modal_submit_confirmation").modal('hide')
				$("#request_bill_div").hide()
			})
			
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

	payTreatmentBill = (id) => {
		$("#search_patient_modal").modal("hide");

		$("#pres_bill_payment_stepper").removeClass("bs-stepper");
		$("#room_bill_payment_stepper").removeClass("bs-stepper");
		$("#lab_request_bill_payment_stepper").removeClass("bs-stepper");
		$("#surgery_bill_payment_stepper").removeClass("bs-stepper");
		$("#treatment_bill_payment_stepper").addClass("bs-stepper");

		stepper = new Stepper($(".bs-stepper")[0]);

		$.ajax({
			url: apiURL + "treatment_bill/" + id,
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#lab_request_bill_div").hide();
				$("#surgery_bill_div").hide();
				$("#prescription_bill_div").hide();
				$("#room_bill_div").hide();
				$("#treatment_bill_div").show();

				$("#treatment_bill_uuid").val(id);

				$("#td_treatment_bill_no").text(data.treatment_bill_no);
				$("#td_treatment_bill_date_of_billing").text(
					moment(data.created_at).format("MMMM D, YYYY")
				);
				$("#td_treatment_no").text(data.treatment_bill_treatment.treatment_no);
				$("#td_treatment_type").text(
					data.treatment_bill_treatment.treatment_treatment_type.name
				);
				$("#td_treatment_bill_total_amount").text(data.total_amount);

				$("#treatment_payment_method_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#treatment_payment_method_id").change(function () {
		var method = $("#treatment_payment_method_id").select2("data");
		if (method[0].text == "Cash") {
			$(".partial_treatment_bill_payment_check").hide();
			$(".partial_treatment_bill_payment_cash").show();
			$("#treatment_payment_cash_tendered").attr(
				"min",
				$("#td_treatment_bill_total_amount").text()
			);
			$("#treatment_payment_cash_tendered").attr(
				"data-msg-min",
				"Cash tendered is not enough."
			);
			$("#treatment_payment_cash_tendered").keyup(function () {
				var change =
					$("#treatment_payment_cash_tendered").val() -
					parseFloat($("#td_treatment_bill_total_amount").text());
				if (change >= 0) {
					$("#treatment_payment_change").text(change);
				} else {
					$("#treatment_payment_change").text("0");
				}
			});
		} else if (method[0].text == "Check") {
			$(".partial_treatment_bill_payment_cash").hide();
			$(".partial_treatment_bill_payment_check").show();
			$("#treatment_payment_check_amount").attr(
				"min",
				$("#td_treatment_bill_total_amount").text()
			);
			$("#treatment_payment_check_amount").attr(
				"data-msg-min",
				"Check amount is not enough."
			);
			$("#treatment_payment_check_amount").attr(
				"max",
				$("#td_treatment_bill_total_amount").text()
			);
			$("#treatment_payment_check_amount").attr(
				"data-msg-max",
				"Check amount exceeded the required amount."
			);
		} else {
			$(".partial_treatment_bill_payment_cash").hide();
			$(".partial_treatment_bill_payment_check").hide();
		}
	});

	$("#treatment_payment_check_amount").change(function(){
		$('#treatment_payment_check_amount_in_words').moneyinwords($("#treatment_payment_check_amount").val().toLocaleString(),'PH','PHP');
		$('#treatment_payment_check_amount_in_words').text($('#treatment_payment_check_amount_in_words').text().toUpperCase())
	})

	$("#treatment_payment_receipt_btn").printPreview({
		obj2print: "#treatment_payment_receipt",
		width: "810",
	});

	//add treatment payment
	$("#partial_payment_treatment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$("#modal_submit_confirmation").modal('show')
			$("#confirm_submit").on("click", function () {
				var method = $("#treatment_payment_method_id").select2("data");
				if (method[0].text == "Cash") {
					$.ajax({
						url: apiURL + "inpatient_treatment_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							treatment_bill_id: $("#treatment_bill_uuid").val(),
							amount_paid: parseFloat(
								$("#td_treatment_bill_total_amount").text()
							),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#treatment_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_cash_payment: {
								amount: parseFloat($("#td_treatment_bill_total_amount").text()),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Treatment bill has been paid.");
							$("#partial_payment_treatment_form").validate().resetForm();
							$("#partial_payment_treatment_form")[0].reset();
							loadTreatmentBillPaymentTable();
							loadInpatientPaymentTable();
							$("#rec_treatment_or_no").text(data.or_no);

							$("#rec_treatment_date_of_billing").text(
								moment(
									data.in_treatment_payment_in_treatment_bill.treatment_bill_inpatient_bill.date_of_billing
								).format("MMMM D, YYYY")
							);
							$("#rec_treatment_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var inpatient_name =
								data.in_treatment_payment_in_treatment_bill
									.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
								" " +
								data.in_treatment_payment_in_treatment_bill
									.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
							var inpatient_address = data.in_treatment_payment_in_treatment_bill
							.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
							$("#rec_treatment_inpatient_name").text(inpatient_name);
							$("#rec_treatment_inpatient_address").text(inpatient_address);
							
							$("#rec_treatment_remaining_balance").text(
								"₱" +
									data.in_treatment_payment_in_treatment_bill.treatment_bill_inpatient_bill.remaining_balance.toLocaleString()
							);
							var inpatient_bill_no =
								data.in_treatment_payment_in_treatment_bill
									.treatment_bill_inpatient_bill.inpatient_bill_no;
							$("#rec_treatment_inpatient_bill_no").text(inpatient_bill_no);
							$("#rec_treatment_bill_no").text(
								data.in_treatment_payment_in_treatment_bill
									.treatment_bill_no
							);

							var description = "";
							
							$("#treatment_receipt_table tbody").empty();
							description += "<tr>"+
											"<td>" + (moment(data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.created_at).format("MMMM D, YYYY")+ " " +
											data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_no + " " +
											data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_type.name).toString() +"</td>"+
											"<td class='text-right'>₱"+ (data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#treatment_receipt_table tbody").append(description);
							$("#treatment_receipt_table tbody").append(
							"<tr>"+
							"<th colspan='2'>Professional Fee</th>"+
							"</tr>");

							var prof_fee_total = 0
							$.each(data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_in_charge, function (i, dataOptions) {
								prof_fee_total = prof_fee_total +  dataOptions.professional_fee
								$("#treatment_receipt_table tbody").append(
									"<tr>"+
									"<td>"+ dataOptions.treatment_in_charge_employee.first_name + " " + dataOptions.treatment_in_charge_employee.last_name +"</td>"+
									"<td class='text-right'>₱"+ dataOptions.professional_fee +"</td>"+
									"</tr>");
							})

							$("#treatment_receipt_table tbody").append(
								"<tr>"+
									"<th>Total Amount</th>"+
									"<th class='text-right'>₱"+ 
									(prof_fee_total + data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_type.fee).toLocaleString() +
									"</th>"+
								"</tr>"
							);
							
							$("#rec_treatment_cash_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							$("#rec_treatment_total_paid").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							stepper.next();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				} else if (method[0].text == "Check") {
					$.ajax({
						url: apiURL + "inpatient_treatment_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							treatment_bill_id: $("#treatment_bill_uuid").val(),
							amount_paid: $("#treatment_payment_check_amount").val(),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#treatment_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_check_payment: {
								check_no: $("#treatment_payment_check_no").val(),
								check_date: $("#treatment_payment_check_date").val(),
								account_name: $("#treatment_payment_account_name").val(),
								account_no: $("#treatment_payment_account_no").val(),
								rt_number: $("#treatment_payment_rt_number").val(),
								payee_name: $("#treatment_payment_payee_name").val(),
								amount: $("#treatment_payment_check_amount").val(),
								// amount_in_words: $(
								// 	"#treatment_payment_check_amount_in_words"
								// ).val(),
								bank_name: $("#treatment_payment_bank_name").val(),
								bank_address: $("#treatment_payment_bank_address").val(),
								description: $("#treatment_payment_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Treatment bill has been paid.");
							$("#partial_payment_treatment_form").validate().resetForm();
							$("#partial_payment_treatment_form")[0].reset();
							loadTreatmentBillPaymentTable();
							loadInpatientPaymentTable();
							$("#rec_treatment_or_no").text(data.or_no);

							$("#rec_treatment_date_of_billing").text(
								moment(
									data.in_treatment_payment_in_treatment_bill.treatment_bill_inpatient_bill.date_of_billing
								).format("MMMM D, YYYY")
							);
							$("#rec_treatment_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var inpatient_name =
								data.in_treatment_payment_in_treatment_bill
									.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
								" " +
								data.in_treatment_payment_in_treatment_bill
									.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
							var inpatient_address = data.in_treatment_payment_in_treatment_bill
							.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
							$("#rec_treatment_inpatient_name").text(inpatient_name);
							$("#rec_treatment_inpatient_address").text(inpatient_address);
							
							$("#rec_treatment_remaining_balance").text(
								"₱" +
									data.in_treatment_payment_in_treatment_bill.treatment_bill_inpatient_bill.remaining_balance.toLocaleString()
							);
							var inpatient_bill_no =
								data.in_treatment_payment_in_treatment_bill
									.treatment_bill_inpatient_bill.inpatient_bill_no;
							$("#rec_treatment_inpatient_bill_no").text(inpatient_bill_no);
							$("#rec_treatment_bill_no").text(
								data.in_treatment_payment_in_treatment_bill
									.treatment_bill_no
							);

							var description = "";
							
							$("#treatment_receipt_table tbody").empty();
							description += "<tr>"+
											"<td>" + (moment(data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.created_at).format("MMMM D, YYYY")+ " " +
											data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_no + " " +
											data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_type.name).toString() +"</td>"+
											"<td class='text-right'>₱"+ (data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#treatment_receipt_table tbody").append(description);
							$("#treatment_receipt_table tbody").append(
								"<tr>"+
								"<th colspan='2'>Professional Fee</th>"+
								"</tr>");
		
								var prof_fee_total = 0
								$.each(data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_in_charge, function (i, dataOptions) {
									prof_fee_total = prof_fee_total +  dataOptions.professional_fee
									$("#treatment_receipt_table tbody").append(
										"<tr>"+
										"<td>"+ dataOptions.treatment_in_charge_employee.first_name + " " + dataOptions.treatment_in_charge_employee.last_name +"</td>"+
										"<td class='text-right'>₱"+ dataOptions.professional_fee +"</td>"+
										"</tr>");
								})
		
								$("#treatment_receipt_table tbody").append(
									"<tr>"+
										"<th>Total Amount</th>"+
										"<th class='text-right'>₱"+ 
										(prof_fee_total + data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_type.fee).toLocaleString() +
										"</th>"+
									"</tr>"
								);
							$("#rec_treatment_check_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							$("#rec_treatment_total_paid").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							stepper.next();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}
				$("#modal_submit_confirmation").modal('hide')
				$("#treatment_bill_div").hide()
			})
			
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

	paySurgeryBill = (id) => {
		$("#search_patient_modal").modal("hide");

		$("#pres_bill_payment_stepper").removeClass("bs-stepper");
		$("#room_bill_payment_stepper").removeClass("bs-stepper");
		$("#lab_request_bill_payment_stepper").removeClass("bs-stepper");
		$("#treatment_bill_payment_stepper").removeClass("bs-stepper");
		$("#surgery_bill_payment_stepper").addClass("bs-stepper");

		stepper = new Stepper($(".bs-stepper")[0]);

		$.ajax({
			url: apiURL + "surgery_bill/" + id,
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#lab_request_bill_div").hide();
				$("#treatment_bill_div").hide();
				$("#prescription_bill_div").hide();
				$("#room_bill_div").hide();
				$("#surgery_bill_div").show();

				$("#surgery_bill_uuid").val(id);
				$("#td_surgery_bill_no").text(data.surgery_bill_no);
				$("#td_surgery_bill_date_of_billing").text(
					moment(data.created_at).format("MMMM D, YYYY")
				);
				$("#td_surgery_no").text(data.surgery_bill_surgery.surgery_no);
				$("#td_surgery_type").text(
					data.surgery_bill_surgery.surgery_surgery_type.name
				);
				$("#td_surgery_bill_total_amount").text(data.total_amount);

				$("#surgery_payment_method_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#surgery_payment_method_id").change(function () {
		var method = $("#surgery_payment_method_id").select2("data");
		if (method[0].text == "Cash") {
			$(".partial_surgery_bill_payment_check").hide();
			$(".partial_surgery_bill_payment_cash").show();
			$("#surgery_payment_cash_tendered").attr(
				"min",
				$("#td_surgery_bill_total_amount").text()
			);
			$("#surgery_payment_cash_tendered").attr(
				"data-msg-min",
				"Cash tendered is not enough."
			);
			$("#surgery_payment_cash_tendered").keyup(function () {
				var change =
					$("#surgery_payment_cash_tendered").val() -
					parseFloat($("#td_surgery_bill_total_amount").text());
				if (change >= 0) {
					$("#surgery_payment_change").text(change);
				} else {
					$("#surgery_payment_change").text("0");
				}
			});
		} else if (method[0].text == "Check") {
			$(".partial_surgery_bill_payment_cash").hide();
			$(".partial_surgery_bill_payment_check").show();
			$("#surgery_payment_check_amount").attr(
				"min",
				$("#td_surgery_bill_total_amount").text()
			);
			$("#surgery_payment_check_amount").attr(
				"data-msg-min",
				"Check amount is not enough."
			);
			$("#surgery_payment_check_amount").attr(
				"max",
				$("#td_surgery_bill_total_amount").text()
			);
			$("#surgery_payment_check_amount").attr(
				"data-msg-max",
				"Check amount exceeded the required amount."
			);
		} else {
			$(".partial_surgery_bill_payment_cash").hide();
			$(".partial_surgery_bill_payment_check").hide();
		}
	});

	$("#surgery_payment_check_amount").change(function(){
		$('#surgery_payment_check_amount_in_words').moneyinwords($("#surgery_payment_check_amount").val().toLocaleString(),'PH','PHP');
		$('#surgery_payment_check_amount_in_words').text($('#surgery_payment_check_amount_in_words').text().toUpperCase())
	})

	$("#surgery_payment_receipt_btn").printPreview({
		obj2print: "#surgery_payment_receipt",
		width: "810",
	});

	//add surgery payment
	$("#partial_payment_surgery_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$("#modal_submit_confirmation").modal('show')
			$("#confirm_submit").on("click", function () {
				var method = $("#surgery_payment_method_id").select2("data");
				if (method[0].text == "Cash") {
					$.ajax({
						url: apiURL + "inpatient_surgery_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							surgery_bill_id: $("#surgery_bill_uuid").val(),
							amount_paid: parseFloat($("#td_surgery_bill_total_amount").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#surgery_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_cash_payment: {
								amount: parseFloat($("#td_surgery_bill_total_amount").text()),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Surgery Bill has been paid.");
							$("#partial_payment_surgery_form").validate().resetForm();
							$("#partial_payment_surgery_form")[0].reset();
							loadSurgeryBillPaymentTable();
							loadInpatientPaymentTable();
							$("#rec_surgery_or_no").text(data.or_no);

							$("#rec_surgery_date_of_billing").text(
								moment(
									data.in_surgery_payment_in_surgery_bill.surgery_bill_inpatient_bill.date_of_billing
								).format("MMMM D, YYYY")
							);
							$("#rec_surgery_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var inpatient_name =
								data.in_surgery_payment_in_surgery_bill
									.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
								" " +
								data.in_surgery_payment_in_surgery_bill
									.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
							var inpatient_address = data.in_surgery_payment_in_surgery_bill
							.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
							$("#rec_surgery_inpatient_name").text(inpatient_name);
							$("#rec_surgery_inpatient_address").text(inpatient_address);
							
							$("#rec_surgery_remaining_balance").text(
								"₱" +
									data.in_surgery_payment_in_surgery_bill.surgery_bill_inpatient_bill.remaining_balance.toLocaleString()
							);
							var inpatient_bill_no =
								data.in_surgery_payment_in_surgery_bill
									.surgery_bill_inpatient_bill.inpatient_bill_no;
							$("#rec_surgery_inpatient_bill_no").text(inpatient_bill_no);
							$("#rec_surgery_bill_no").text(
								data.in_surgery_payment_in_surgery_bill
									.surgery_bill_no
							);

							var description = "";
							
							$("#surgery_receipt_table tbody").empty();
							description += "<tr>"+
											"<td>" + (moment(data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.created_at).format("MMMM D, YYYY")+ " " +
											data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_no + " " +
											data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_type.name).toString() +"</td>"+
											"<td class='text-right'>₱"+ (data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#surgery_receipt_table tbody").append(description);
							$("#surgery_receipt_table tbody").append(
							"<tr>"+
							"<th colspan='2'>Professional Fee</th>"+
							"</tr>");

							var prof_fee_total = 0
							$.each(data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_in_charge, function (i, dataOptions) {
								prof_fee_total = prof_fee_total +  dataOptions.professional_fee
								$("#surgery_receipt_table tbody").append(
									"<tr>"+
									"<td>"+ dataOptions.surgery_in_charge_employee.first_name + " " + dataOptions.surgery_in_charge_employee.last_name +"</td>"+
									"<td class='text-right'>₱"+ dataOptions.professional_fee +"</td>"+
									"</tr>");
							})

							$("#surgery_receipt_table tbody").append(
								"<tr>"+
									"<th>Total Amount</th>"+
									"<th class='text-right'>₱"+ 
									(prof_fee_total + data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_type.fee).toLocaleString() +
									"</th>"+
								"</tr>"
							);
							$("#rec_surgery_cash_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							$("#rec_surgery_total_paid").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							stepper.next();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				} else if (method[0].text == "Check") {
					$.ajax({
						url: apiURL + "inpatient_surgery_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							surgery_bill_id: $("#surgery_bill_uuid").val(),
							amount_paid: $("#surgery_payment_check_amount").val(),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#surgery_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_check_payment: {
								check_no: $("#surgery_payment_check_no").val(),
								check_date: $("#surgery_payment_check_date").val(),
								account_name: $("#surgery_payment_account_name").val(),
								account_no: $("#surgery_payment_account_no").val(),
								rt_number: $("#surgery_payment_rt_number").val(),
								payee_name: $("#surgery_payment_payee_name").val(),
								amount: $("#surgery_payment_check_amount").val(),
								// amount_in_words: $(
								// 	"#surgery_payment_check_amount_in_words"
								// ).val(),
								bank_name: $("#surgery_payment_bank_name").val(),
								bank_address: $("#surgery_payment_bank_address").val(),
								description: $("#surgery_payment_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Surgery Bill has been paid.");
							$("#partial_payment_surgery_form").validate().resetForm();
							$("#partial_payment_surgery_form")[0].reset();
							loadSurgeryBillPaymentTable();
							loadInpatientPaymentTable();
							$("#rec_surgery_or_no").text(data.or_no);

							$("#rec_surgery_date_of_billing").text(
								moment(
									data.in_surgery_payment_in_surgery_bill.surgery_bill_inpatient_bill.date_of_billing
								).format("MMMM D, YYYY")
							);
							$("#rec_surgery_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var inpatient_name =
								data.in_surgery_payment_in_surgery_bill
									.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
								" " +
								data.in_surgery_payment_in_surgery_bill
									.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
							var inpatient_address = data.in_surgery_payment_in_surgery_bill
							.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
							$("#rec_surgery_inpatient_name").text(inpatient_name);
							$("#rec_surgery_inpatient_address").text(inpatient_address);
							
							$("#rec_surgery_remaining_balance").text(
								"₱" +
									data.in_surgery_payment_in_surgery_bill.surgery_bill_inpatient_bill.remaining_balance.toLocaleString()
							);
							var inpatient_bill_no =
								data.in_surgery_payment_in_surgery_bill
									.surgery_bill_inpatient_bill.inpatient_bill_no;
							$("#rec_surgery_inpatient_bill_no").text(inpatient_bill_no);
							$("#rec_surgery_bill_no").text(
								data.in_surgery_payment_in_surgery_bill
									.surgery_bill_no
							);

							var description = "";
							
							$("#surgery_receipt_table tbody").empty();
							description += "<tr>"+
											"<td>" + (moment(data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.created_at).format("MMMM D, YYYY")+ " " +
											data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_no + " " +
											data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_type.name).toString() +"</td>"+
											"<td class='text-right'>₱"+ (data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#surgery_receipt_table tbody").append(description);
							$("#surgery_receipt_table tbody").append(
							"<tr>"+
							"<th colspan='2'>Professional Fee</th>"+
							"</tr>");

							var prof_fee_total = 0
							$.each(data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_in_charge, function (i, dataOptions) {
								prof_fee_total = prof_fee_total +  dataOptions.professional_fee
								$("#surgery_receipt_table tbody").append(
									"<tr>"+
									"<td>"+ dataOptions.surgery_in_charge_employee.first_name + " " + dataOptions.surgery_in_charge_employee.last_name +"</td>"+
									"<td class='text-right'>₱"+ dataOptions.professional_fee +"</td>"+
									"</tr>");
							})

							$("#surgery_receipt_table tbody").append(
								"<tr>"+
									"<th>Total Amount</th>"+
									"<th class='text-right'>₱"+ 
									(prof_fee_total + data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_type.fee).toLocaleString() +
									"</th>"+
								"</tr>"
							);
							$("#rec_surgery_check_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							$("#rec_surgery_total_paid").text(
								"₱" + data.amount_paid.toLocaleString()
							);
							stepper.next();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}
				$("#modal_submit_confirmation").modal('hide')
				$("#surgery_bill_div").hide()
			})
			
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


	loadViewInpatientBill = () => {
		$.ajax({
			url: apiURL + "inpatient_bill/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#view_full_payment_inpatient_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.inpatient_bill_no +
						" | " +
						dataOptions.inpatient_bill_inpatient.inpatient_patient.first_name +
						" " +
						dataOptions.inpatient_bill_inpatient.inpatient_patient.last_name +
						"</option>";
					$("#view_full_payment_inpatient_bill_id").append(options);
				});
				$("#view_full_payment_inpatient_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	loadViewPaymentTerm = () => {
		$.ajax({
			url: apiURL + "payment_term/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#view_full_payment_term").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.term_name +
						"</option>";
					$("#view_full_payment_term").append(options);
				});
				$("#view_full_payment_term").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	loadViewPaymentMethod = () => {
		$.ajax({
			url: apiURL + "payment_method/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#view_full_payment_method").empty();
				$("#view_prescription_payment_method").empty();
				$("#view_room_payment_method").empty();
				$("#view_request_payment_method").empty();
				$("#view_treatment_payment_method").empty();
				$("#view_surgery_payment_method").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.method_name +
						"</option>";
					$("#view_full_payment_method").append(options);
					$("#view_prescription_payment_method").append(options);
					$("#view_room_payment_method").append(options);
					$("#view_request_payment_method").append(options);
					$("#view_treatment_payment_method").append(options);
					$("#view_surgery_payment_method").append(options);
				});
				$("#view_full_payment_method").trigger("change");
				$("#view_prescription_payment_method").trigger("change");
				$("#view_room_payment_method").trigger("change");
				$("#view_request_payment_method").trigger("change");
				$("#view_treatment_payment_method").trigger("change");
				$("#view_surgery_payment_method").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#view_full_payment_term").on("change", function () {
		var term = $("#view_full_payment_term").select2("data");
		var method = $("#view_full_payment_method").select2("data");
		if (term[0].text == "Full Payment" && method[0].text == "Cash") {
			$(".view_inpatient_sub_payments").hide()
			$(".view_full_payment_check_info").hide()
			$(".view_full_payment_check_info :input").val('')
		} 
		else if (term[0].text == "Full Payment" && method[0].text == "Check") {
			$(".view_inpatient_sub_payments").hide()
			$(".view_full_payment_check_info").show()

		}else if (term[0].text == "Partial Payment" && method[0].text == "Cash" ) {
			$(".view_full_payment_check_info").hide()
			$(".view_full_payment_check_info :input").val('')
		}
		else if (term[0].text == "Partial Payment" && method[0].text == "Check" ) {
			$(".view_full_payment_check_info").hide()
			$(".view_full_payment_check_info :input").val('')
		}
	})
	
	$("#view_full_payment_method").on("change", function () {
		var term = $("#view_full_payment_term").select2("data");
		var method = $("#view_full_payment_method").select2("data");
		if (term[0].text == "Full Payment" && method[0].text == "Cash") {
			$(".view_inpatient_sub_payments").hide()
			$(".view_full_payment_check_info").hide()
			$(".view_full_payment_check_info :input").val('')
		} 
		else if (term[0].text == "Full Payment" && method[0].text == "Check") {
			$(".view_inpatient_sub_payments").hide()
			$(".view_full_payment_check_info").show()

		}else if (term[0].text == "Partial Payment" && method[0].text == "Cash" ) {
			$(".view_full_payment_check_info").hide()
			$(".view_full_payment_check_info :input").val('')
		}
		else if (term[0].text == "Partial Payment" && method[0].text == "Check" ) {
			$(".view_full_payment_check_info").hide()
			$(".view_full_payment_check_info :input").val('')
		}
	})

	$("#view_full_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var method2 = $("#view_full_payment_method").select2("data");
			var term2 = $("#view_full_payment_term").select2("data");
			if (method2[0].text == "Cash") {
				console.log("xxxx")
				$.ajax({
					url: apiURL + "inpatient_payment/update_inpatient_payment/"+ $("#edit_inpatient_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						inpatient_bill_id: $("#view_full_payment_inpatient_bill_id").val(),
						total_amount_paid: $("#view_full_payment_amount_paid").val(),
						payment_term_id:$("#view_full_payment_term").val(),
						payment_method_id: $("#view_full_payment_method").val(),
						date_of_payment: $("#view_full_payment_payment_date").val(),
						status:$("#view_full_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_check_payment_id:$("#edit_i_patient_check_payment_id").val(),
						patient_cash_payment_id:$("#edit_i_patient_cash_payment_id").val(),
						patient_cash_payment: {
							amount: $("#view_full_payment_amount_paid").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Inpatient payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if (method2[0].text == "Check") {
				console.log("xxcccc")
				if (term2[0].text == 'Partial Payment'){
					$.ajax({
						url: apiURL + "inpatient_payment/update_inpatient_payment/"+ $("#edit_inpatient_payment_uuid").val(),
						type: "PUT", // post, put, delete, get
						data: JSON.stringify({
							inpatient_bill_id: $("#view_full_payment_inpatient_bill_id").val(),
							total_amount_paid: $("#view_full_payment_amount_paid").val(),
							payment_term_id:$("#view_full_payment_term").val(),
							payment_method_id: $("#view_full_payment_method").val(),
							date_of_payment: $("#view_full_payment_payment_date").val(),
							status:$("#view_full_payment_status").val(),
							updated_by: localStorage.USER_ID,
							patient_check_payment_id:$("#edit_i_patient_check_payment_id").val(),
							patient_cash_payment_id:$("#edit_i_patient_cash_payment_id").val(),
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Inpatient payment has been updated.");
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}else{
					$.ajax({
						url: apiURL + "inpatient_payment/update_inpatient_payment/"+ $("#edit_inpatient_payment_uuid").val(),
						type: "PUT", // post, put, delete, get
						data: JSON.stringify({
							inpatient_bill_id: $("#view_full_payment_inpatient_bill_id").val(),
							total_amount_paid: $("#view_full_payment_amount_paid").val(),
							payment_term_id:$("#view_full_payment_term").val(),
							payment_method_id: $("#view_full_payment_method").val(),
							date_of_payment: $("#view_full_payment_payment_date").val(),
							status:$("#view_full_payment_status").val(),
							updated_by: localStorage.USER_ID,
							patient_check_payment_id:$("#edit_i_patient_check_payment_id").val(),
							patient_cash_payment_id:$("#edit_i_patient_cash_payment_id").val(),
							patient_check_payment: {
								check_no: $("#view_full_payment_check_no").val(),
								check_date: $("#view_full_payment_check_date").val(),
								account_name: $("#view_full_payment_acc_name").val(),
								account_no: $("#view_full_payment_acc_no").val(),
								rt_number: $("#view_full_payment_rt_number").val(),
								payee_name: $("#view_full_payment_payee_name").val(),
								amount: $("#view_full_payment_check_amount").val(),
								//amount_in_words: $("#view_full_payment_check_amount_in_words").val(),
								bank_name: $("#view_full_payment_bank_name").val(),
								bank_address: $("#view_full_payment_bank_address").val(),
								description: $("#view_full_payment_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Inpatient payment has been updated.");
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}
				
			}
			setTimeout(() => {
				loadInpatientPaymentTable();
				$("#view_full_payment_div").hide()
			}, 1000);
			
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

	//view full payment
	viewFullpayment = (id, type) => {
		$.ajax({
		  url: apiURL + "inpatient_payment/" + id,
		  type: "GET", // post, put, delete, get
		  dataType: "json",
		  success: function (data) {
			console.log(data)
			$("html, body").animate({ scrollTop: 0 }, "slow");
			$("#full_payment_div_form").hide();
			$("#partial_payment_div_form").hide();
			$("#prescription_bill_div").hide();
			$("#room_bill_div").hide();
			$("#lab_request_bill_div").hide();
			$("#treatment_bill_div").hide();
			$("#surgery_bill_div").hide();
			$("#inpatient_payment_div").hide()
			$("#view_prescription_payment_div").hide()
			$("#view_room_payment_div").hide()
			$("#view_request_payment_div").hide()
			$("#view_treatment_payment_div").hide()
			$("#view_surgery_payment_div").hide()
			$("#view_receipt_prescription_payment_div").hide()
			$("#view_receipt_room_payment_div").hide()
			$("#view_receipt_request_payment_div").hide()
			$("#view_receipt_treatment_payment_div").hide()
			$("#view_receipt_surgery_payment_div").hide()
			$("#view_full_payment_div").show()
			$("#view_full_payment_card_title").text("View Inpatient Payment")
			$("#edit_inpatient_payment_uuid").val(data.id)
			$("#view_full_payment_or").text(data.or_no)
			loadViewInpatientBill()
			loadViewPaymentTerm()
			loadViewPaymentMethod()
			setTimeout(() => {
				$("#view_full_payment_inpatient_bill_id").val(data.inpatient_bill_id)
				$("#view_full_payment_inpatient_bill_id").trigger("change")
				$("#view_full_payment_term").val(data.payment_term_id)
				$("#view_full_payment_term").trigger("change")
				$("#view_full_payment_method").val(data.payment_method_id)
				$("#view_full_payment_method").trigger("change")
			}, 1000);
			
			if (data.inpatient_payment_payment_term.term_name == 'Full Payment') {

				$(".view_inpatient_sub_payments").hide()

				if (data.in_payment_method.method_name == 'Cash') {
					$("#edit_i_patient_cash_payment_id").val(data.patient_cash_payment_id)
					$(".view_full_payment_check_info").hide()	
					
					console.log(data.in_payment_patient_cash.id)
					console.log(data.in_payment_patient_cash.amount)
				}else if (data.in_payment_method.method_name == 'Check') {
					$("#edit_i_patient_check_payment_id").val(data.patient_check_payment_id)
					setTimeout(() => {
					
					$(".view_full_payment_check_info").show()
					$("#view_full_payment_bank_name").val(data.in_payment_patient_check.bank_name)
					$("#view_full_payment_bank_address").val(data.in_payment_patient_check.bank_address)
					$("#view_full_payment_check_no").val(data.in_payment_patient_check.check_no)
					$("#view_full_payment_check_date").val(data.in_payment_patient_check.check_date)
					//$("#view_full_payment_bank_name").val(data.in_payment_patient_check.id)
					$("#view_full_payment_acc_name").val(data.in_payment_patient_check.account_name)
					$("#view_full_payment_acc_no").val(data.in_payment_patient_check.account_no)
					$("#view_full_payment_rt_number").val(data.in_payment_patient_check.rt_number)
					$("#view_full_payment_check_amount").val(data.in_payment_patient_check.amount)
					$("#view_full_payment_check_description").val(data.in_payment_patient_check.description)
					$("#view_full_payment_payee_name").val(data.in_payment_patient_check.payee_name)
					$("#view_full_payment_check_status").val(data.in_payment_patient_check.check_status)
					}, 1000);
				}
				
			}else if (data.inpatient_payment_payment_term.term_name == 'Partial Payment') {
				
				$(".view_full_payment_check_info").hide()
				$(".view_inpatient_sub_payments").show()
				$("#view_sub_prescription_payment_table tbody").empty()	
				$("#view_sub_room_payment_table tbody").empty()	
				$("#view_sub_request_payment_table tbody").empty()	
				
				$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_prescription_bill, function (i, prescriptionBillData) {
					if(prescriptionBillData.in_prescription_bill_in_prescription_payment != ""){
						$(".view_sub_prescription_payment").show()
						$.each(prescriptionBillData.in_prescription_bill_in_prescription_payment, function (i, prescriptionPaymentData) {
							$("#view_sub_prescription_payment_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>"+ prescriptionPaymentData.or_no +"</td>" +
										"<td>"+ prescriptionPaymentData.prescription_bill_id +"</td>" +
										"<td class='text-right'>₱"+ prescriptionPaymentData.amount_paid.toLocaleString() +"</td>" +
										"<td>"+ moment(prescriptionPaymentData.date_of_payment).format("MMMM D, YYYY") +"</td>" +
										"<td>"+ prescriptionPaymentData.in_prescription_payment_method.method_name +"</td>"+
									"</tr>"
								);
	
							if (prescriptionPaymentData.in_prescription_payment_method.method_name == "Cash") {
								console.log("Cash")
							}else if (prescriptionPaymentData.in_prescription_payment_method.method_name == "Check") {
								console.log("check")
							}
						})
					}else{
						$(".view_sub_prescription_payment").hide()
					}
					
				})

				$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_room_bill, function (i, roomBillData) {
					if(roomBillData.in_room_bill_in_room_payment != ""){
						$(".view_sub_room_payment").show()
						$.each(roomBillData.in_room_bill_in_room_payment, function (i, roomPaymentData) {
							$("#view_sub_room_payment_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>"+ roomPaymentData.or_no +"</td>" +
										"<td>"+ roomPaymentData.room_bill_id +"</td>" +
										"<td class='text-right'>₱"+ roomPaymentData.amount_paid.toLocaleString() +"</td>" +
										"<td>"+ moment(roomPaymentData.date_of_payment).format("MMMM D, YYYY") +"</td>" +
										"<td>"+ roomPaymentData.in_room_payment_method.method_name +"</td>"+
									"</tr>"
								);
	
							if (roomPaymentData.in_room_payment_method.method_name == "Cash") {
								console.log("Cash")
							}else if (roomPaymentData.in_room_payment_method.method_name == "Check") {
								console.log("check")
							}
						})
					}else{
						$(".view_sub_room_payment").hide()
					}
					
				})

				$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_request_bill, function (i, requestBillData) {
					if(requestBillData.in_request_bill_in_request_payment != ""){
						$(".view_sub_request_payment").show()
						$.each(requestBillData.in_request_bill_in_request_payment, function (i, requestPaymentData) {
						
							$("#view_sub_request_payment_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>"+ requestPaymentData.or_no +"</td>" +
										"<td>"+ requestPaymentData.lab_request_bill_id +"</td>" +
										"<td class='text-right'>₱"+ requestPaymentData.amount_paid.toLocaleString() +"</td>" +
										"<td>"+ moment(requestPaymentData.date_of_payment).format("MMMM D, YYYY") +"</td>" +
										"<td>"+ requestPaymentData.in_request_payment_method.method_name +"</td>"+
									"</tr>"
								);
	
						})
					}else{
						$(".view_sub_request_payment").hide()
					}
				})

				$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_treatment_bill, function (i, treatmentBillData) {
					if(treatmentBillData.in_treatment_bill_in_treatment_payment != ""){
						$(".view_sub_treatment_payment").show()
						$.each(treatmentBillData.in_treatment_bill_in_treatment_payment, function (i, treatmentPaymentData) {
							$("#view_sub_treatment_payment_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>"+ treatmentPaymentData.or_no +"</td>" +
										"<td>"+ treatmentPaymentData.treatment_bill_id +"</td>" +
										"<td class='text-right'>₱"+ treatmentPaymentData.amount_paid.toLocaleString() +"</td>" +
										"<td>"+ moment(treatmentPaymentData.date_of_payment).format("MMMM D, YYYY") +"</td>" +
										"<td>"+ treatmentPaymentData.in_treatment_payment_method.method_name +"</td>"+
									"</tr>"
								);
	
						})
					}else{
						$(".view_sub_treatment_payment").hide()
					}
					
				})

				$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_surgery_bill, function (i, surgeryBillData) {
					if(surgeryBillData.in_surgery_bill_in_surgery_payment != ""){
						$(".view_sub_surgery_payment").show()
						$.each(surgeryBillData.in_surgery_bill_in_surgery_payment, function (i, surgeryPaymentData) {
							$("#view_sub_surgery_payment_table")
								.find("tbody")
								.append(
									"<tr>" +
										"<td>"+ surgeryPaymentData.or_no +"</td>" +
										"<td>"+ surgeryPaymentData.surgery_bill_id +"</td>" +
										"<td class='text-right'>₱"+ surgeryPaymentData.amount_paid.toLocaleString() +"</td>" +
										"<td>"+ moment(surgeryPaymentData.date_of_payment).format("MMMM D, YYYY") +"</td>" +
										"<td>"+ surgeryPaymentData.in_surgery_payment_method.method_name +"</td>"+
									"</tr>"
								);
	
						})
					}else{
						$(".view_sub_surgery_payment").hide()
					}
					
				})

			}

			$("#view_full_payment_amount_paid").val(data.total_amount_paid)
			$("#view_full_payment_payment_date").val(data.date_of_payment)
			$("#view_full_payment_status").val(data.status)

			if (type == 0) {
				$("#cancel_edit_inpatient_payment_button").text("Close")
				$("#view_full_payment_form :input").prop("disabled", true);
				$("#cancel_edit_inpatient_payment_button").prop("disabled", false);
				$("#edit_inpatient_payment_button").hide()


			}else if (type == 1) {
				$("#cancel_edit_inpatient_payment_button").text("Cancel")
				$("#view_full_payment_form :input").prop("disabled", false);
				$("#edit_inpatient_payment_button").show()
				setTimeout(() => {
					$(".view_inpatient_sub_payments").hide()
				}, 1000);
				
			}
		  },
		  error: function (data) {
			toastr.error(data.responseJSON.detail);
		  },
		});
	};

	$("#view_prescription_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var method = $("#view_prescription_payment_method").select2("data");
			if (method[0].text == "Cash") {
				$.ajax({
					url: apiURL + "inpatient_prescription_payment/update/"+ $("#edit_prescription_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						prescription_bill_id: $("#view_prescription_payment_prescription_bill_id").val(),
						amount_paid: $("#view_prescription_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_prescription_payment_method").val(),
						date_of_payment: $("#view_prescription_payment_payment_date").val(),
						status:$("#view_prescription_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_check_payment_id:$("#edit_p_patient_check_payment_id").val(),
						patient_cash_payment_id:$("#edit_p_patient_cash_payment_id").val(),
						patient_cash_payment: {
							amount: $("#view_prescription_payment_amount_paid").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Prescription payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if (method[0].text == "Check") {
				$.ajax({
					url: apiURL + "inpatient_prescription_payment/update/"+ $("#edit_prescription_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						prescription_bill_id: $("#view_prescription_payment_prescription_bill_id").val(),
						amount_paid: $("#view_prescription_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_prescription_payment_method").val(),
						date_of_payment: $("#view_prescription_payment_payment_date").val(),
						status:$("#view_prescription_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_cash_payment_id:$("#edit_p_patient_cash_payment_id").val(),
						patient_check_payment_id:$("#edit_p_patient_check_payment_id").val(),
						patient_check_payment: {
							check_no: $("#view_prescription_payment_check_no").val(),
							check_date: $("#view_prescription_payment_check_date").val(),
							account_name: $("#view_prescription_payment_acc_name").val(),
							account_no: $("#view_prescription_payment_acc_no").val(),
							rt_number: $("#view_prescription_payment_rt_number").val(),
							payee_name: $("#view_prescription_payment_payee_name").val(),
							amount: $("#view_prescription_payment_check_amount").val(),
							//amount_in_words: $("#view_prescription_payment_check_amount_in_words").val(),
							bank_name: $("#view_prescription_payment_bank_name").val(),
							bank_address: $("#view_prescription_payment_bank_address").val(),
							description: $("#view_prescription_payment_check_description").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Prescription payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			}
			setTimeout(() => {
				loadPrescriptionBillPaymentTable();
				$("#view_prescription_payment_div").hide()
			}, 1000);
			
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

	loadViewPrescriptionBill = () => {
		$.ajax({
			url: apiURL + "prescription_bill/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				$("#view_prescription_payment_prescription_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.prescription_bill_no +
						" | " +
						dataOptions.prescription_bill_inpatient.inpatient_patient.first_name +
						" " +
						dataOptions.prescription_bill_inpatient.inpatient_patient.last_name +
						"</option>";
					$("#view_prescription_payment_prescription_bill_id").append(options);
				});
				$("#view_prescription_payment_prescription_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#view_prescription_payment_method").on("change", function () {
		var method = $("#view_prescription_payment_method").select2("data");
		if (method[0].text == "Cash") {
			$(".view_prescription_payment_check_info").hide()
			$(".view_prescription_payment_check_info :input").val('')
		} if (method[0].text == "Check") {
			$(".view_prescription_payment_check_info").show()
		}
	})

	viewPrescriptionPayment = (id, type) => {
		$.ajax({
			url: apiURL + "inpatient_prescription_payment/find_one/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				console.log(data)
			  	$("html, body").animate({ scrollTop: 0 }, "slow");
				$("#full_payment_div_form").hide();
				$("#partial_payment_div_form").hide();
				$("#prescription_bill_div").hide();
				$("#room_bill_div").hide();
				$("#lab_request_bill_div").hide();
				$("#treatment_bill_div").hide();
				$("#surgery_bill_div").hide();
				$("#inpatient_payment_div").hide()
				$("#view_full_payment_div").hide()
				$("#view_room_payment_div").hide()
				$("#view_request_payment_div").hide()
				$("#view_treatment_payment_div").hide()
				$("#view_surgery_payment_div").hide()
				$("#view_receipt_prescription_payment_div").hide()
				$("#view_receipt_room_payment_div").hide()
				$("#view_receipt_request_payment_div").hide()
				$("#view_receipt_treatment_payment_div").hide()
				$("#view_receipt_surgery_payment_div").hide()
				$("#view_prescription_payment_div").show()
				$("#edit_prescription_payment_uuid").val(data.id)
				$("#view_prescription_payment_or").text(data.or_no)
				$("#view_prescription_payment_amount_paid").val(data.amount_paid)
				$("#view_prescription_payment_payment_date").val(data.date_of_payment)
				$("#view_prescription_payment_status").val(data.status)
				loadViewPrescriptionBill()
				loadViewPaymentMethod()
				setTimeout(() => {
					$("#view_prescription_payment_prescription_bill_id").val(data.prescription_bill_id)
					$("#view_prescription_payment_prescription_bill_id").trigger("change")
					$("#view_prescription_payment_method").val(data.payment_method_id)
					$("#view_prescription_payment_method").trigger("change")
				}, 1000);
				
				if (data.in_prescription_payment_method.method_name == 'Cash') {
					$("#edit_p_patient_cash_payment_id").val(data.patient_cash_payment_id)
					$(".view_prescription_payment_check_info").hide()	
					
					console.log(data.in_prescription_payment_patient_cash.id)
					console.log(data.in_prescription_payment_patient_cash.amount)
				}else if (data.in_prescription_payment_method.method_name == 'Check') {
					$("#edit_p_patient_check_payment_id").val(data.patient_check_payment_id)
					$(".view_prescription_payment_check_info").show()
					$("#view_prescription_payment_bank_name").val(data.in_prescription_payment_patient_check.bank_name)
					$("#view_prescription_payment_bank_address").val(data.in_prescription_payment_patient_check.bank_address)
					$("#view_prescription_payment_check_no").val(data.in_prescription_payment_patient_check.check_no)
					$("#view_prescription_payment_check_date").val(data.in_prescription_payment_patient_check.check_date)
					//$("#view_prescription_payment_bank_name").val(data.in_prescription_payment_patient_check.id)
					$("#view_prescription_payment_acc_name").val(data.in_prescription_payment_patient_check.account_name)
					$("#view_prescription_payment_acc_no").val(data.in_prescription_payment_patient_check.account_no)
					$("#view_prescription_payment_rt_number").val(data.in_prescription_payment_patient_check.rt_number)
					$("#view_prescription_payment_check_amount").val(data.in_prescription_payment_patient_check.amount)
					$("#view_prescription_payment_check_description").val(data.in_prescription_payment_patient_check.description)
					$("#view_prescription_payment_payee_name").val(data.in_prescription_payment_patient_check.payee_name)
					$("#view_prescription_payment_check_status").val(data.in_prescription_payment_patient_check.check_status)
				}
			  
			},
			error: function (data) {
			  toastr.error(data.responseJSON.detail);
			},
		  });
		if (type == 0) {
			$("#cancel_edit_prescription_payment_button").text("Close")
			$("#view_prescription_payment_form :input").prop("disabled", true);
			$("#cancel_edit_prescription_payment_button").prop("disabled", false);
			$("#edit_prescription_payment_button").hide()
		}else if (type == 1) {
			$("#cancel_edit_prescription_payment_button").text("Cancel")
			$("#view_prescription_payment_form :input").prop("disabled", false);
			$("#edit_prescription_payment_button").show()
		}
	}

	$("#view_room_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var method = $("#view_room_payment_method").select2("data");
			if (method[0].text == "Cash") {
				$.ajax({
					url: apiURL + "inpatient_room_payment/update/"+ $("#edit_room_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						room_bill_id: $("#view_room_payment_room_bill_id").val(),
						amount_paid: $("#view_room_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_room_payment_method").val(),
						date_of_payment: $("#view_room_payment_payment_date").val(),
						status:$("#view_room_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_check_payment_id:$("#edit_r_patient_check_payment_id").val(),
						patient_cash_payment_id:$("#edit_r_patient_cash_payment_id").val(),
						patient_cash_payment: {
							amount: $("#view_room_payment_amount_paid").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Room payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if (method[0].text == "Check") {
				$.ajax({
					url: apiURL + "inpatient_room_payment/update/"+ $("#edit_room_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						room_bill_id: $("#view_room_payment_room_bill_id").val(),
						amount_paid: $("#view_room_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_room_payment_method").val(),
						date_of_payment: $("#view_room_payment_payment_date").val(),
						status:$("#view_room_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_cash_payment_id:$("#edit_r_patient_cash_payment_id").val(),
						patient_check_payment_id:$("#edit_r_patient_check_payment_id").val(),
						patient_check_payment: {
							check_no: $("#view_room_payment_check_no").val(),
							check_date: $("#view_room_payment_check_date").val(),
							account_name: $("#view_room_payment_acc_name").val(),
							account_no: $("#view_room_payment_acc_no").val(),
							rt_number: $("#view_room_payment_rt_number").val(),
							payee_name: $("#view_room_payment_payee_name").val(),
							amount: $("#view_room_payment_check_amount").val(),
							//amount_in_words: $("#view_room_payment_check_amount_in_words").val(),
							bank_name: $("#view_room_payment_bank_name").val(),
							bank_address: $("#view_room_payment_bank_address").val(),
							description: $("#view_room_payment_check_description").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Room payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			}
			setTimeout(() => {
				loadRoomBillPaymentTable();
				$("#view_room_payment_div").hide()
			}, 1000);
			
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

	loadViewRoomBill = () => {
		$.ajax({
			url: apiURL + "room_bill/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				$("#view_room_payment_room_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.room_bill_no +
						" | " +
						dataOptions.room_bill_room_admission.room_admission_inpatient.inpatient_patient.first_name +
						" " +
						dataOptions.room_bill_room_admission.room_admission_inpatient.inpatient_patient.last_name +
						"</option>";
					$("#view_room_payment_room_bill_id").append(options);
				});
				$("#view_room_payment_room_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#view_room_payment_method").on("change", function () {
		var method = $("#view_room_payment_method").select2("data");
		if (method[0].text == "Cash") {
			$(".view_room_payment_check_info").hide()
			$(".view_room_payment_check_info :input").val('')
		} if (method[0].text == "Check") {
			$(".view_room_payment_check_info").show()
		}
	})

	viewRoomPayment = (id, type) => {
		$.ajax({
			url: apiURL + "inpatient_room_payment/find_one/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				console.log(data)
			  	$("html, body").animate({ scrollTop: 0 }, "slow");
				$("#full_payment_div_form").hide();
				$("#partial_payment_div_form").hide();
				$("#prescription_bill_div").hide();
				$("#room_bill_div").hide();
				$("#lab_request_bill_div").hide();
				$("#treatment_bill_div").hide();
				$("#surgery_bill_div").hide();
				$("#inpatient_payment_div").hide()
				$("#view_full_payment_div").hide()
				$("#view_prescription_payment_div").hide()
				$("#view_request_payment_div").hide()
				$("#view_treatment_payment_div").hide()
				$("#view_surgery_payment_div").hide()
				$("#view_receipt_prescription_payment_div").hide()
				$("#view_receipt_room_payment_div").hide()
				$("#view_receipt_request_payment_div").hide()
				$("#view_receipt_treatment_payment_div").hide()
				$("#view_receipt_surgery_payment_div").hide()
				$("#view_room_payment_div").show()
				$("#edit_room_payment_uuid").val(data.id)
				$("#view_room_payment_or").text(data.or_no)
				$("#view_room_payment_amount_paid").val(data.amount_paid)
				$("#view_room_payment_payment_date").val(data.date_of_payment)
				$("#view_room_payment_status").val(data.status)
				loadViewRoomBill()
				loadViewPaymentMethod()
				setTimeout(() => {
					$("#view_room_payment_room_bill_id").val(data.room_bill_id)
					$("#view_room_payment_room_bill_id").trigger("change")
					$("#view_room_payment_method").val(data.payment_method_id)
					$("#view_room_payment_method").trigger("change")
				}, 1000);
				
				if (data.in_room_payment_method.method_name == 'Cash') {
					$("#edit_r_patient_cash_payment_id").val(data.patient_cash_payment_id)
					$(".view_room_payment_check_info").hide()	
					
					console.log(data.in_room_payment_patient_cash.id)
					console.log(data.in_room_payment_patient_cash.amount)
				}else if (data.in_room_payment_method.method_name == 'Check') {
					$("#edit_r_patient_check_payment_id").val(data.patient_check_payment_id)
					$(".view_room_payment_check_info").show()
					$("#view_room_payment_bank_name").val(data.in_room_payment_patient_check.bank_name)
					$("#view_room_payment_bank_address").val(data.in_room_payment_patient_check.bank_address)
					$("#view_room_payment_check_no").val(data.in_room_payment_patient_check.check_no)
					$("#view_room_payment_check_date").val(data.in_room_payment_patient_check.check_date)
					//$("#view_room_payment_bank_name").val(data.in_room_payment_patient_check.id)
					$("#view_room_payment_acc_name").val(data.in_room_payment_patient_check.account_name)
					$("#view_room_payment_acc_no").val(data.in_room_payment_patient_check.account_no)
					$("#view_room_payment_rt_number").val(data.in_room_payment_patient_check.rt_number)
					$("#view_room_payment_check_amount").val(data.in_room_payment_patient_check.amount)
					$("#view_room_payment_check_description").val(data.in_room_payment_patient_check.description)
					$("#view_room_payment_payee_name").val(data.in_room_payment_patient_check.payee_name)
					$("#view_room_payment_check_status").val(data.in_room_payment_patient_check.check_status)
				}
			  
			},
			error: function (data) {
			  toastr.error(data.responseJSON.detail);
			},
		  });

		if (type == 0) {
			$("#cancel_edit_room_payment_button").text("Close")
			$("#view_room_payment_form :input").prop("disabled", true);
			$("#cancel_edit_room_payment_button").prop("disabled", false);
			$("#edit_room_payment_button").hide()
		}else if (type == 1) {
			$("#cancel_edit_room_payment_button").text("Cancel")
			$("#view_room_payment_form :input").prop("disabled", false);
			$("#edit_room_payment_button").show()
		}
	}

	$("#view_request_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var method = $("#view_request_payment_method").select2("data");
			if (method[0].text == "Cash") {
				$.ajax({
					url: apiURL + "inpatient_lab_request_payment/update/"+ $("#edit_request_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						lab_request_bill_id: $("#view_request_payment_request_bill_id").val(),
						amount_paid: $("#view_request_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_request_payment_method").val(),
						date_of_payment: $("#view_request_payment_payment_date").val(),
						status:$("#view_request_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_check_payment_id:$("#edit_lr_patient_check_payment_id").val(),
						patient_cash_payment_id:$("#edit_lr_patient_cash_payment_id").val(),
						patient_cash_payment: {
							amount: $("#view_request_payment_amount_paid").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Lab Request payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if (method[0].text == "Check") {
				$.ajax({
					url: apiURL + "inpatient_lab_request_payment/update/"+ $("#edit_request_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						lab_request_bill_id: $("#view_request_payment_request_bill_id").val(),
						amount_paid: $("#view_request_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_request_payment_method").val(),
						date_of_payment: $("#view_request_payment_payment_date").val(),
						status:$("#view_request_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_cash_payment_id:$("#edit_lr_patient_cash_payment_id").val(),
						patient_check_payment_id:$("#edit_lr_patient_check_payment_id").val(),
						patient_check_payment: {
							check_no: $("#view_request_payment_check_no").val(),
							check_date: $("#view_request_payment_check_date").val(),
							account_name: $("#view_request_payment_acc_name").val(),
							account_no: $("#view_request_payment_acc_no").val(),
							rt_number: $("#view_request_payment_rt_number").val(),
							payee_name: $("#view_request_payment_payee_name").val(),
							amount: $("#view_request_payment_check_amount").val(),
							//amount_in_words: $("#view_request_payment_check_amount_in_words").val(),
							bank_name: $("#view_request_payment_bank_name").val(),
							bank_address: $("#view_request_payment_bank_address").val(),
							description: $("#view_request_payment_check_description").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Lab Request payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			}
			setTimeout(() => {
				loadLabRequestBillPaymentTable();
				$("#view_request_payment_div").hide()
			}, 1000);
			
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

	loadViewRequestBill = () => {
		$.ajax({
			url: apiURL + "lab_request_bill/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				$("#view_request_payment_request_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.lab_request_bill_no +
						" | " +
						dataOptions.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
						" " +
						dataOptions.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name +
						"</option>";
					$("#view_request_payment_request_bill_id").append(options);
				});
				$("#view_request_payment_request_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#view_request_payment_method").on("change", function () {
		var method = $("#view_request_payment_method").select2("data");
		if (method[0].text == "Cash") {
			$(".view_request_payment_check_info").hide()
			$(".view_request_payment_check_info :input").val('')
		} if (method[0].text == "Check") {
			$(".view_request_payment_check_info").show()
		}
	})

	viewRequestPayment = (id, type) => {
		$.ajax({
			url: apiURL + "inpatient_lab_request_payment/find_one/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				console.log(data)
			  	$("html, body").animate({ scrollTop: 0 }, "slow");
				$("#full_payment_div_form").hide();
				$("#partial_payment_div_form").hide();
				$("#prescription_bill_div").hide();
				$("#room_bill_div").hide();
				$("#lab_request_bill_div").hide();
				$("#treatment_bill_div").hide();
				$("#surgery_bill_div").hide();
				$("#inpatient_payment_div").hide()
				$("#view_full_payment_div").hide()
				$("#view_prescription_payment_div").hide()
				$("#view_room_payment_div").hide()
				$("#view_treatment_payment_div").hide()
				$("#view_surgery_payment_div").hide()
				$("#view_receipt_prescription_payment_div").hide()
				$("#view_receipt_room_payment_div").hide()
				$("#view_receipt_request_payment_div").hide()
				$("#view_receipt_treatment_payment_div").hide()
				$("#view_receipt_surgery_payment_div").hide()
				$("#view_request_payment_div").show()
				$("#edit_request_payment_uuid").val(data.id)
				$("#view_request_payment_or").text(data.or_no)
				$("#view_request_payment_amount_paid").val(data.amount_paid)
				$("#view_request_payment_payment_date").val(data.date_of_payment)
				$("#view_request_payment_status").val(data.status)
				loadViewRequestBill()
				loadViewPaymentMethod()
				setTimeout(() => {
					$("#view_request_payment_request_bill_id").val(data.lab_request_bill_id)
					$("#view_request_payment_request_bill_id").trigger("change")
					$("#view_request_payment_method").val(data.payment_method_id)
					$("#view_request_payment_method").trigger("change")
				}, 1000);
				
				if (data.in_request_payment_method.method_name == 'Cash') {
					$("#edit_lr_patient_cash_payment_id").val(data.patient_cash_payment_id)
					$(".view_request_payment_check_info").hide()	
					
					console.log(data.in_request_payment_patient_cash.id)
					console.log(data.in_request_payment_patient_cash.amount)
				}else if (data.in_request_payment_method.method_name == 'Check') {
					$("#edit_lr_patient_check_payment_id").val(data.patient_check_payment_id)
					$(".view_request_payment_check_info").show()
					$("#view_request_payment_bank_name").val(data.in_request_payment_patient_check.bank_name)
					$("#view_request_payment_bank_address").val(data.in_request_payment_patient_check.bank_address)
					$("#view_request_payment_check_no").val(data.in_request_payment_patient_check.check_no)
					$("#view_request_payment_check_date").val(data.in_request_payment_patient_check.check_date)
					//$("#view_request_payment_bank_name").val(data.in_request_payment_patient_check.id)
					$("#view_request_payment_acc_name").val(data.in_request_payment_patient_check.account_name)
					$("#view_request_payment_acc_no").val(data.in_request_payment_patient_check.account_no)
					$("#view_request_payment_rt_number").val(data.in_request_payment_patient_check.rt_number)
					$("#view_request_payment_check_amount").val(data.in_request_payment_patient_check.amount)
					$("#view_request_payment_check_description").val(data.in_request_payment_patient_check.description)
					$("#view_request_payment_payee_name").val(data.in_request_payment_patient_check.payee_name)
					$("#view_request_payment_check_status").val(data.in_request_payment_patient_check.check_status)
				}
			  
			},
			error: function (data) {
			  toastr.error(data.responseJSON.detail);
			},
		  });
		
		  if (type == 0) {
			$("#cancel_edit_request_payment_button").text("Close")
			$("#view_request_payment_form :input").prop("disabled", true);
			$("#cancel_edit_request_payment_button").prop("disabled", false);
			$("#edit_request_payment_button").hide()
		}else if (type == 1) {
			$("#cancel_edit_request_payment_button").text("Cancel")
			$("#view_request_payment_form :input").prop("disabled", false);
			$("#edit_request_payment_button").show()
		}
	}

	$("#view_treatment_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var method = $("#view_treatment_payment_method").select2("data");
			if (method[0].text == "Cash") {
				$.ajax({
					url: apiURL + "inpatient_treatment_payment/update/"+ $("#edit_treatment_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						treatment_bill_id: $("#view_treatment_payment_treatment_bill_id").val(),
						amount_paid: $("#view_treatment_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_treatment_payment_method").val(),
						date_of_payment: $("#view_treatment_payment_payment_date").val(),
						status:$("#view_treatment_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_check_payment_id:$("#edit_t_patient_check_payment_id").val(),
						patient_cash_payment_id:$("#edit_t_patient_cash_payment_id").val(),
						patient_cash_payment: {
							amount: $("#view_treatment_payment_amount_paid").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Treatment payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if (method[0].text == "Check") {
				$.ajax({
					url: apiURL + "inpatient_treatment_payment/update/"+ $("#edit_treatment_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						treatment_bill_id: $("#view_treatment_payment_treatment_bill_id").val(),
						amount_paid: $("#view_treatment_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_treatment_payment_method").val(),
						date_of_payment: $("#view_treatment_payment_payment_date").val(),
						status:$("#view_treatment_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_cash_payment_id:$("#edit_t_patient_cash_payment_id").val(),
						patient_check_payment_id:$("#edit_t_patient_check_payment_id").val(),
						patient_check_payment: {
							check_no: $("#view_treatment_payment_check_no").val(),
							check_date: $("#view_treatment_payment_check_date").val(),
							account_name: $("#view_treatment_payment_acc_name").val(),
							account_no: $("#view_treatment_payment_acc_no").val(),
							rt_number: $("#view_treatment_payment_rt_number").val(),
							payee_name: $("#view_treatment_payment_payee_name").val(),
							amount: $("#view_treatment_payment_check_amount").val(),
							//amount_in_words: $("#view_treatment_payment_check_amount_in_words").val(),
							bank_name: $("#view_treatment_payment_bank_name").val(),
							bank_address: $("#view_treatment_payment_bank_address").val(),
							description: $("#view_treatment_payment_check_description").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Treatment payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			}
			setTimeout(() => {
				loadTreatmentBillPaymentTable();
				$("#view_treatment_payment_div").hide()
			}, 1000);
			
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

	loadViewTreatmentBill = () => {
		$.ajax({
			url: apiURL + "treatment_bill/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				$("#view_treatment_payment_treatment_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.treatment_bill_no +
						" | " +
						dataOptions.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
						" " +
						dataOptions.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name +
						"</option>";
					$("#view_treatment_payment_treatment_bill_id").append(options);
				});
				$("#view_treatment_payment_treatment_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#view_treatment_payment_method").on("change", function () {
		var method = $("#view_treatment_payment_method").select2("data");
		if (method[0].text == "Cash") {
			$(".view_treatment_payment_check_info").hide()
			$(".view_treatment_payment_check_info :input").val('')
		} if (method[0].text == "Check") {
			$(".view_treatment_payment_check_info").show()
		}
	})

	viewTreatmentPayment = (id, type) => {
		$.ajax({
			url: apiURL + "inpatient_treatment_payment/find_one/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				console.log(data)
			  	$("html, body").animate({ scrollTop: 0 }, "slow");
				$("#full_payment_div_form").hide();
				$("#partial_payment_div_form").hide();
				$("#prescription_bill_div").hide();
				$("#room_bill_div").hide();
				$("#lab_request_bill_div").hide();
				$("#treatment_bill_div").hide();
				$("#surgery_bill_div").hide();
				$("#inpatient_payment_div").hide()
				$("#view_full_payment_div").hide()
				$("#view_prescription_payment_div").hide()
				$("#view_room_payment_div").hide()
				$("#view_request_payment_div").hide()
				$("#view_surgery_payment_div").hide()
				$("#view_receipt_prescription_payment_div").hide()
				$("#view_receipt_room_payment_div").hide()
				$("#view_receipt_request_payment_div").hide()
				$("#view_receipt_treatment_payment_div").hide()
				$("#view_receipt_surgery_payment_div").hide()
				$("#view_treatment_payment_div").show()
				$("#edit_treatment_payment_uuid").val(data.id)
				$("#view_treatment_payment_or").text(data.or_no)
				$("#view_treatment_payment_amount_paid").val(data.amount_paid)
				$("#view_treatment_payment_payment_date").val(data.date_of_payment)
				$("#view_treatment_payment_status").val(data.status)
				loadViewTreatmentBill()
				loadViewPaymentMethod()
				setTimeout(() => {
					$("#view_treatment_payment_treatment_bill_id").val(data.treatment_bill_id)
					$("#view_treatment_payment_treatment_bill_id").trigger("change")
					$("#view_treatment_payment_method").val(data.payment_method_id)
					$("#view_treatment_payment_method").trigger("change")
				}, 1000);
				
				if (data.in_treatment_payment_method.method_name == 'Cash') {
					$("#edit_t_patient_cash_payment_id").val(data.patient_cash_payment_id)
					$(".view_treatment_payment_check_info").hide()	
					
					console.log(data.in_treatment_payment_patient_cash.id)
					console.log(data.in_treatment_payment_patient_cash.amount)
				}else if (data.in_treatment_payment_method.method_name == 'Check') {
					$("#edit_t_patient_check_payment_id").val(data.patient_check_payment_id)
					$(".view_treatment_payment_check_info").show()
					$("#view_treatment_payment_bank_name").val(data.in_treatment_payment_patient_check.bank_name)
					$("#view_treatment_payment_bank_address").val(data.in_treatment_payment_patient_check.bank_address)
					$("#view_treatment_payment_check_no").val(data.in_treatment_payment_patient_check.check_no)
					$("#view_treatment_payment_check_date").val(data.in_treatment_payment_patient_check.check_date)
					//$("#view_treatment_payment_bank_name").val(data.in_treatment_payment_patient_check.id)
					$("#view_treatment_payment_acc_name").val(data.in_treatment_payment_patient_check.account_name)
					$("#view_treatment_payment_acc_no").val(data.in_treatment_payment_patient_check.account_no)
					$("#view_treatment_payment_rt_number").val(data.in_treatment_payment_patient_check.rt_number)
					$("#view_treatment_payment_check_amount").val(data.in_treatment_payment_patient_check.amount)
					$("#view_treatment_payment_check_description").val(data.in_treatment_payment_patient_check.description)
					$("#view_treatment_payment_payee_name").val(data.in_treatment_payment_patient_check.payee_name)
					$("#view_treatment_payment_check_status").val(data.in_treatment_payment_patient_check.check_status)
				}
			  
			},
			error: function (data) {
			  toastr.error(data.responseJSON.detail);
			},
		  });
		
		if (type == 0) {
			$("#cancel_edit_treatment_payment_button").text("Close")
			$("#view_treatment_payment_form :input").prop("disabled", true);
			$("#cancel_edit_treatment_payment_button").prop("disabled", false);
			$("#edit_treatment_payment_button").hide()
		}else if (type == 1) {
			$("#cancel_edit_treatment_payment_button").text("Cancel")
			$("#view_treatment_payment_form :input").prop("disabled", false);
			$("#edit_treatment_payment_button").show()
		}
	}

	$("#view_surgery_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var method = $("#view_surgery_payment_method").select2("data");
			if (method[0].text == "Cash") {
				$.ajax({
					url: apiURL + "inpatient_surgery_payment/update/"+ $("#edit_surgery_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						surgery_bill_id: $("#view_surgery_payment_surgery_bill_id").val(),
						amount_paid: $("#view_surgery_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_surgery_payment_method").val(),
						date_of_payment: $("#view_surgery_payment_payment_date").val(),
						status:$("#view_surgery_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_check_payment_id:$("#edit_s_patient_check_payment_id").val(),
						patient_cash_payment_id:$("#edit_s_patient_cash_payment_id").val(),
						patient_cash_payment: {
							amount: $("#view_surgery_payment_amount_paid").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Surgery payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if (method[0].text == "Check") {
				$.ajax({
					url: apiURL + "inpatient_surgery_payment/update/"+ $("#edit_surgery_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						surgery_bill_id: $("#view_surgery_payment_surgery_bill_id").val(),
						amount_paid: $("#view_surgery_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_surgery_payment_method").val(),
						date_of_payment: $("#view_surgery_payment_payment_date").val(),
						status:$("#view_surgery_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_cash_payment_id:$("#edit_s_patient_cash_payment_id").val(),
						patient_check_payment_id:$("#edit_s_patient_check_payment_id").val(),
						patient_check_payment: {
							check_no: $("#view_surgery_payment_check_no").val(),
							check_date: $("#view_surgery_payment_check_date").val(),
							account_name: $("#view_surgery_payment_acc_name").val(),
							account_no: $("#view_surgery_payment_acc_no").val(),
							rt_number: $("#view_surgery_payment_rt_number").val(),
							payee_name: $("#view_surgery_payment_payee_name").val(),
							amount: $("#view_surgery_payment_check_amount").val(),
							//amount_in_words: $("#view_surgery_payment_check_amount_in_words").val(),
							bank_name: $("#view_surgery_payment_bank_name").val(),
							bank_address: $("#view_surgery_payment_bank_address").val(),
							description: $("#view_surgery_payment_check_description").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Surgery payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			}
			setTimeout(() => {
				loadSurgeryBillPaymentTable();
				$("#view_surgery_payment_div").hide()
			}, 1000);
			
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

	loadViewSurgeryBill = () => {
		$.ajax({
			url: apiURL + "surgery_bill/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				$("#view_surgery_payment_surgery_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.surgery_bill_no +
						" | " +
						dataOptions.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
						" " +
						dataOptions.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name +
						"</option>";
					$("#view_surgery_payment_surgery_bill_id").append(options);
				});
				$("#view_surgery_payment_surgery_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#view_surgery_payment_method").on("change", function () {
		var method = $("#view_surgery_payment_method").select2("data");
		if (method[0].text == "Cash") {
			$(".view_surgery_payment_check_info").hide()
			$(".view_surgery_payment_check_info :input").val('')
		} if (method[0].text == "Check") {
			$(".view_surgery_payment_check_info").show()
		}
	})

	viewSurgeryPayment = (id, type) => {
		$.ajax({
			url: apiURL + "inpatient_surgery_payment/find_one/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				console.log(data)
			  	$("html, body").animate({ scrollTop: 0 }, "slow");
				$("#full_payment_div_form").hide();
				$("#partial_payment_div_form").hide();
				$("#prescription_bill_div").hide();
				$("#room_bill_div").hide();
				$("#lab_request_bill_div").hide();
				$("#treatment_bill_div").hide();
				$("#surgery_bill_div").hide();
				$("#inpatient_payment_div").hide()
				$("#view_full_payment_div").hide()
				$("#view_prescription_payment_div").hide()
				$("#view_room_payment_div").hide()
				$("#view_request_payment_div").hide()
				$("#view_treatment_payment_div").hide()
				$("#view_receipt_prescription_payment_div").hide()
				$("#view_receipt_room_payment_div").hide()
				$("#view_receipt_request_payment_div").hide()
				$("#view_receipt_treatment_payment_div").hide()
				$("#view_receipt_surgery_payment_div").hide()
				$("#view_surgery_payment_div").show()
				$("#edit_surgery_payment_uuid").val(data.id)
				$("#view_surgery_payment_or").text(data.or_no)
				$("#view_surgery_payment_amount_paid").val(data.amount_paid)
				$("#view_surgery_payment_payment_date").val(data.date_of_payment)
				$("#view_surgery_payment_status").val(data.status)
				loadViewSurgeryBill()
				loadViewPaymentMethod()
				setTimeout(() => {
					$("#view_surgery_payment_surgery_bill_id").val(data.surgery_bill_id)
					$("#view_surgery_payment_surgery_bill_id").trigger("change")
					$("#view_surgery_payment_method").val(data.payment_method_id)
					$("#view_surgery_payment_method").trigger("change")
				}, 1000);
				
				if (data.in_surgery_payment_method.method_name == 'Cash') {
					$("#edit_s_patient_cash_payment_id").val(data.patient_cash_payment_id)
					$(".view_surgery_payment_check_info").hide()	
					
					console.log(data.in_surgery_payment_patient_cash.id)
					console.log(data.in_surgery_payment_patient_cash.amount)
				}else if (data.in_surgery_payment_method.method_name == 'Check') {
					$("#edit_s_patient_check_payment_id").val(data.patient_check_payment_id)
					$(".view_surgery_payment_check_info").show()
					$("#view_surgery_payment_bank_name").val(data.in_surgery_payment_patient_check.bank_name)
					$("#view_surgery_payment_bank_address").val(data.in_surgery_payment_patient_check.bank_address)
					$("#view_surgery_payment_check_no").val(data.in_surgery_payment_patient_check.check_no)
					$("#view_surgery_payment_check_date").val(data.in_surgery_payment_patient_check.check_date)
					//$("#view_surgery_payment_bank_name").val(data.in_surgery_payment_patient_check.id)
					$("#view_surgery_payment_acc_name").val(data.in_surgery_payment_patient_check.account_name)
					$("#view_surgery_payment_acc_no").val(data.in_surgery_payment_patient_check.account_no)
					$("#view_surgery_payment_rt_number").val(data.in_surgery_payment_patient_check.rt_number)
					$("#view_surgery_payment_check_amount").val(data.in_surgery_payment_patient_check.amount)
					$("#view_surgery_payment_check_description").val(data.in_surgery_payment_patient_check.description)
					$("#view_surgery_payment_payee_name").val(data.in_surgery_payment_patient_check.payee_name)
					$("#view_surgery_payment_check_status").val(data.in_surgery_payment_patient_check.check_status)
				}
			  
			},
			error: function (data) {
			  toastr.error(data.responseJSON.detail);
			},
		  });
		
		if (type == 0) {
			$("#cancel_edit_surgery_payment_button").text("Close")
			$("#view_surgery_payment_form :input").prop("disabled", true);
			$("#cancel_edit_surgery_payment_button").prop("disabled", false);
			$("#edit_surgery_payment_button").hide()
		}else if (type == 1) {
			$("#cancel_edit_surgery_payment_button").text("Cancel")
			$("#view_surgery_payment_form :input").prop("disabled", false);
			$("#edit_surgery_payment_button").show()
		} 
	}


	viewORPrintreceipt = (id, type) => {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$("#partial_payment_div_form").hide();
		switch (type) {
			case 0:
				console.log("Inpatient Receipt")
				$.ajax({
					url: apiURL + "inpatient_payment/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						console.log(data)
						$("#ip_receipt_table tbody").empty()
						$("#inpatient_payment_div").show()
						$("#ip_or_no").text(data.or_no)
						$("#ip_date_of_billing").text(moment(data.inpatient_payment_inpatient_bill.date_of_billing).format("MMMM D, YYYY"))
						$("#ip_date_of_payment").text(moment(data.date_of_payment).format("MMMM D, YYYY"))
						$("#ip_inpatient_name").text(data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name + ", " +
							data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name + " " +
							data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.middle_name
							)
						$("#ip_inpatient_address").text(data.inpatient_payment_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address)
						$("#ip_remaining_balance").text(data.inpatient_payment_inpatient_bill.remaining_balance)
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<th colspan='4'>LAB REQUESTS</th>" +
									"</tr>"
							);
						var request_subtotal =0
						$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_request_bill, function (i, requestBillData) {
							request_subtotal += requestBillData.request_bill_lab_request.lab_request_lab_test_type.fee
							$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td>&emsp;"+ moment(requestBillData.request_bill_lab_request.created_at).format("MMM D, YYYY") +" - "+ requestBillData.request_bill_lab_request.lab_request_lab_test_type.name +"</td>" +
									"<td></td>" +
									"<td class='text-right'>₱"+ requestBillData.request_bill_lab_request.lab_request_lab_test_type.fee.toLocaleString() +"</td>" +
									"<td class='text-right'>₱"+ requestBillData.request_bill_lab_request.lab_request_lab_test_type.fee.toLocaleString() +"</td>" +
								"</tr>"
							);
						})
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
									"<th class='text-right'>₱"+ request_subtotal.toLocaleString()  +"</th>" +
								"</tr>"
							);
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td colspan='4'>ROOMS</td>" +
									"</tr>"
							);
			
						var room_subtotal = 0
						$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_room_bill, function (i, roomBillData) {
							room_subtotal += (roomBillData.no_of_days * roomBillData.room_bill_room_admission.room_admission_room.room_room_type.fee)
							$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td>&emsp;"+ moment(roomBillData.room_bill_room_admission.created_at).format("MMM D, YYYY") +" - "+ roomBillData.room_bill_room_admission.room_admission_room.room_number + " ("+ (roomBillData.no_of_days).toString() +" Days)</td>" +
									"<td></td>" +
									"<td class='text-right'>₱"+ roomBillData.room_bill_room_admission.room_admission_room.room_room_type.fee.toLocaleString() +"</td>" +
									"<td class='text-right'>₱"+ (roomBillData.no_of_days * roomBillData.room_bill_room_admission.room_admission_room.room_room_type.fee).toLocaleString() +"</td>" +
								"</tr>"
							);
						})
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
									"<th class='text-right'>₱"+ room_subtotal.toLocaleString()  +"</th>" +
								"</tr>"
							);
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td colspan='4'>MEDICINES</td>" +
									"</tr>"
							);
						
						var medicine_subtotal = 0
						$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_prescription_bill, function (i, prescriptionBillData) {
							$.each(prescriptionBillData.prescription_bill_inpatient.inpatient_prescription, function (i, prescriptionData) {
								$.each(prescriptionData.prescription_medicine_prescription, function (i, medicinePrescriptionData) {
									medicine_subtotal += medicinePrescriptionData.medicine_prescription_medicine.med_unit_price * medicinePrescriptionData.quantity - medicinePrescriptionData.medicine_prescription_medicine.med_tax
									$("#ip_receipt_table")
										.find("tbody")
										.append(
											"<tr>" +
												"<td>&emsp;"+ moment(medicinePrescriptionData.medicine_prescription_medicine.created_at).format("MMM D, YYYY") + " - " + medicinePrescriptionData.medicine_prescription_medicine.med_product_name +"</td>" +
												"<td class='text-right'>"+ (medicinePrescriptionData.quantity).toString() +"</td>" +
												"<td class='text-right'>₱"+ (medicinePrescriptionData.medicine_prescription_medicine.med_unit_price +"(₱"+ medicinePrescriptionData.medicine_prescription_medicine.med_tax +")").toLocaleString() +"</td>" + 
												"<td class='text-right'>₱"+ (medicinePrescriptionData.medicine_prescription_medicine.med_unit_price * medicinePrescriptionData.quantity - medicinePrescriptionData.medicine_prescription_medicine.med_tax).toLocaleString()  +"</td>" +
											"</tr>"
										);
								})
							})
						})
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
									"<th class='text-right'>₱"+ medicine_subtotal.toLocaleString()  +"</th>" +
								"</tr>"
							);
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td colspan='4'>MEDICIAL SUPPLIES</td>" +
									"</tr>"
							);
						
						var medical_subtotal =0
						$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_prescription_bill, function (i, prescriptionBillData) {
							$.each(prescriptionBillData.prescription_bill_inpatient.inpatient_prescription, function (i, prescriptionData) {
								$.each(prescriptionData.prescription_medical_prescription, function (i, medicalPrescriptionData) {
									medical_subtotal += medicalPrescriptionData.medical_prescription_medical.ms_unit_price * medicalPrescriptionData.quantity - medicalPrescriptionData.medical_prescription_medical.ms_tax
									$("#ip_receipt_table")
										.find("tbody")
										.append(
											"<tr>" +
												"<td>&emsp;"+ moment(medicalPrescriptionData.medical_prescription_medical.created_at).format("MMM D, YYYY") + " - " + medicalPrescriptionData.medical_prescription_medical.ms_product_name +"</td>" +
												"<td class='text-right'>"+ (medicalPrescriptionData.quantity).toString() +"</td>" +
												"<td class='text-right'>₱"+ (medicalPrescriptionData.medical_prescription_medical.ms_unit_price +"(₱"+ medicalPrescriptionData.medical_prescription_medical.ms_tax +")").toLocaleString() +"</td>" + 
												"<td class='text-right'>₱"+ (medicalPrescriptionData.medical_prescription_medical.ms_unit_price * medicalPrescriptionData.quantity - medicalPrescriptionData.medical_prescription_medical.ms_tax).toLocaleString()  +"</td>" +
											"</tr>"
										);
								})
							})
						})
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
									"<th class='text-right'>₱"+ medical_subtotal.toLocaleString()  +"</th>" +
								"</tr>"
							);
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td colspan='4'>TREATMENTS</td>" +
									"</tr>"
							);
			
						var treatment_subtotal =0
						$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_treatment_bill, function (i, treatmentBillData) {
							treatment_subtotal += treatmentBillData.treatment_bill_treatment.treatment_treatment_type.fee
							$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td>&emsp;"+ moment(treatmentBillData.treatment_bill_treatment.created_at).format("MMM D, YYYY") +" - "+ treatmentBillData.treatment_bill_treatment.treatment_treatment_type.name +"</td>" +
									"<td></td>" +
									"<td class='text-right'>₱"+ treatmentBillData.treatment_bill_treatment.treatment_treatment_type.fee.toLocaleString() +"</td>" +
									"<td class='text-right'>₱"+ treatmentBillData.treatment_bill_treatment.treatment_treatment_type.fee.toLocaleString() +"</td>" +
								"</tr>"
							);
						})
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
									"<th class='text-right'>₱"+ treatment_subtotal.toLocaleString()  +"</th>" +
								"</tr>"
							);
						
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td colspan='4'>TREATMENT PROFESSIONAL FEE</td>" +
									"</tr>"
							);
			
						var treatment_in_charge_subtotal =0
						$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_treatment_bill, function (i, treatmentBillData) {
							$.each(treatmentBillData.treatment_bill_treatment.treatment_treatment_in_charge, function (i, inChargeData) {
								treatment_in_charge_subtotal += inChargeData.professional_fee
								$("#ip_receipt_table")
									.find("tbody")
									.append(
										"<tr>" +
											"<td>&emsp;"+ moment(inChargeData.created_at).format("MMM D, YYYY") +" - "+ inChargeData.treatment_in_charge_employee.last_name + ", " +
											inChargeData.treatment_in_charge_employee.first_name + " " + inChargeData.treatment_in_charge_employee.middle_name + " (" + 
											inChargeData.treatment_in_charge_employee.job.job_title +")</td>" +
											"<td></td>" +
											"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
											"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
										"</tr>"
									);
							})
						})
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
									"<th class='text-right'>₱"+ treatment_in_charge_subtotal.toLocaleString()  +"</th>" +
								"</tr>"
							);
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td colspan='4'>SURGERIES</td>" +
									"</tr>"
							);
						
						var surgery_subtotal=0
						$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_surgery_bill, function (i, surgeryBillData) {
							surgery_subtotal += surgeryBillData.surgery_bill_surgery.surgery_surgery_type.fee
							$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td>&emsp;"+ moment(surgeryBillData.surgery_bill_surgery.created_at).format("MMM D, YYYY") +" - "+ surgeryBillData.surgery_bill_surgery.surgery_surgery_type.name +"</td>" +
									"<td></td>" +
									"<td class='text-right'>₱"+ surgeryBillData.surgery_bill_surgery.surgery_surgery_type.fee.toLocaleString() +"</td>" +
									"<td class='text-right'>₱"+ surgeryBillData.surgery_bill_surgery.surgery_surgery_type.fee.toLocaleString() +"</td>" +
								"</tr>"
							);
						})
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
									"<th class='text-right'>₱"+ surgery_subtotal.toLocaleString()  +"</th>" +
								"</tr>"
							);
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<td colspan='4'>SURGERIES PROFESSIONAL FEE</td>" +
									"</tr>"
							);
			
						var surgery_in_charge_subtotal =0
						$.each(data.inpatient_payment_inpatient_bill.inpatient_bill_surgery_bill, function (i, surgeryBillData) {
							$.each(surgeryBillData.surgery_bill_surgery.surgery_surgery_in_charge, function (i, inChargeData) {
								surgery_in_charge_subtotal += inChargeData.professional_fee
								$("#ip_receipt_table")
									.find("tbody")
									.append(
										"<tr>" +
											"<td>&emsp;"+ moment(inChargeData.created_at).format("MMM D, YYYY") +" - "+ inChargeData.surgery_in_charge_employee.last_name + ", " +
											inChargeData.surgery_in_charge_employee.first_name + " " + inChargeData.surgery_in_charge_employee.middle_name + " (" + 
											inChargeData.surgery_in_charge_employee.job.job_title +")</td>" +
											"<td></td>" +
											"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
											"<td class='text-right'>₱"+ inChargeData.professional_fee.toLocaleString() +"</td>" +
										"</tr>"
									);
							})
						})
			
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<th colspan='3' class='text-right'>SUB-TOTAL</th>" +
									"<th class='text-right'>₱"+ surgery_in_charge_subtotal.toLocaleString()  +"</th>" +
								"</tr>"
							);
						var total_hospital_charges = (request_subtotal + room_subtotal + medical_subtotal +
							medicine_subtotal + treatment_subtotal + treatment_in_charge_subtotal + surgery_subtotal + surgery_in_charge_subtotal)
						$("#ip_receipt_table")
							.find("tbody")
							.append(
								"<tr>" +
									"<th colspan='3' class='text-right'>TOTAL</th>" +
									"<th class='text-right'>₱"+ total_hospital_charges.toLocaleString()  +"</th>" +
								"</tr>"
							);
						
						$("#ip_cash_amount").text(
							"₱" + total_hospital_charges.toLocaleString()
						);
						$("#ip_total_paid").text(
							"₱" + total_hospital_charges.toLocaleString()
						);
			
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});
				break;
			case 1:
				console.log("Prescription Receipt")
				$.ajax({
					url: apiURL + "inpatient_prescription_payment/find_one/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						$("#view_receipt_prescription_payment_div").show()
						$("#view_rec_pres_or_no").text(data.or_no);

						$("#view_rec_pres_date_of_billing").text(
							moment(
								data.in_prescription_payment_in_prescription_bill.billing_date
							).format("MMMM D, YYYY")
						);
						$("#view_rec_pres_date_of_payment").text(
							moment(data.date_of_payment).format("MMMM D, YYYY")
						);
						var inpatient_name =
							data.in_prescription_payment_in_prescription_bill
								.prescription_bill_inpatient.inpatient_patient.first_name +
							" " +
							data.in_prescription_payment_in_prescription_bill
								.prescription_bill_inpatient.inpatient_patient.last_name;
						$("#view_rec_pres_inpatient_name").text(inpatient_name);
						$("#view_rec_pres_remaining_balance").text(
							"₱" +
								data.in_prescription_payment_in_prescription_bill.prescription_bill_inpatient_bill.remaining_balance.toLocaleString()
						);
						var inpatient_bill_no =
							data.in_prescription_payment_in_prescription_bill
								.prescription_bill_inpatient_bill.inpatient_bill_no;
						$("#view_rec_pres_inpatient_bill_no").text(inpatient_bill_no);
						$("#view_rec_pres_bill_no").text(
							data.in_prescription_payment_in_prescription_bill
								.prescription_bill_no
						);

						var medical_row = "";
						var medicine_row = "";
						
						$("#pres_view_receipt_table tbody").empty();
						$("#pres_view_receipt_table tbody").append(
							"<tr>"+
								"<td colspan='4'>Medical Supplies</td>"+
							"</tr>"
						);
						$.each(
							data.in_prescription_payment_in_prescription_bill
								.prescription_bill_inpatient.inpatient_prescription,
							function (i, dataOptions) {
								$.each(
									dataOptions.prescription_medical_prescription,
									function (i, medicalOptions) {
										
										medical_row += "<tr>"+
										"<td>"+ (moment(medicalOptions.created_at).format("MMMM D, YYYY") + " " +medicalOptions.medical_prescription_medical.ms_product_name).toString() +"</td>"+
										"<td class='text-right'>"+ (medicalOptions.quantity).toString()+"</td>"+
										"<td class='text-right'>₱"+ (medicalOptions.medical_prescription_medical.ms_unit_price).toString() +"</td>"+
										"<td class='text-right'>₱"+ (medicalOptions.quantity * medicalOptions.medical_prescription_medical.ms_unit_price - medicalOptions.medical_prescription_medical.ms_tax).toString() +"</td>"+
										"</tr>";

									}
								);

								$.each(
									dataOptions.prescription_medicine_prescription,
									function (i, medicineOptions) {
										medicine_row += "<tr>"+
										"<td>" + (moment(medicineOptions.created_at).format("MMMM D, YYYY") + " " + medicineOptions.medicine_prescription_medicine.med_product_name).toString() +"</td>"+
										"<td class='text-right'>"+ (medicineOptions.quantity).toString() +"</td>"+
										"<td class='text-right'>₱"+ (medicineOptions.medicine_prescription_medicine.med_unit_price).toLocaleString() +"</td>"+
										"<td class='text-right'>₱"+ (medicineOptions.quantity * medicineOptions.medicine_prescription_medicine.med_unit_price - medicineOptions.medicine_prescription_medicine.med_tax).toLocaleString() +"</td>"+
										"</tr>";
									}
								);
							}
						);
						$("#pres_view_receipt_table tbody").append(medical_row);
						$("#pres_view_receipt_table tbody").append(
							"<tr>"+
								"<td colspan='4'>Medicines</td>"+
							"</tr>"
						);
						$("#pres_view_receipt_table tbody").append(medicine_row);
						$("#pres_view_receipt_table tbody").append(
							"<tr>"+
								"<th colspan='2'></th>"+
								"<th class='text-right'>Total Amount</th>"+
								"<th class='text-right'>₱"+ (data.in_prescription_payment_in_prescription_bill.total_amount).toLocaleString()+"</th>"+
							"</tr>"
						);

						$("#view_rec_pres_medicine_amount").text(
							"₱" +
								data.in_prescription_payment_in_prescription_bill.medicine_amount.toLocaleString()
						);
						$("#view_rec_pres_medical_amount").text(
							"₱" +
								data.in_prescription_payment_in_prescription_bill.medical_amount.toLocaleString()
						);
						$("#view_rec_pres_total_amount").text(
							"₱" +
								data.in_prescription_payment_in_prescription_bill.total_amount.toLocaleString()
						);
						if (data.in_prescription_payment_method.method_name == 'Cash') {
							$("#view_rec_pres_cash_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
						}
						else{
							$("#view_rec_pres_check_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
						}
						
						
						$("#view_rec_pres_total_paid").text(
							"₱" + data.amount_paid.toLocaleString()
						);
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});
						
				break;
			case 2:
				console.log("Room Receipt")
				$.ajax({
					url: apiURL + "inpatient_room_payment/find_one/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						$("#view_receipt_room_payment_div").show()

						$("#view_rec_room_or_no").text(data.or_no);

						$("#view_rec_room_date_of_billing").text(
							moment(
								data.in_room_payment_in_room_bill.room_bill_inpatient_bill.date_of_billing
							).format("MMMM D, YYYY")
						);
						$("#view_rec_room_date_of_payment").text(
							moment(data.date_of_payment).format("MMMM D, YYYY")
						);
						var inpatient_name =
							data.in_room_payment_in_room_bill
								.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
							" " +
							data.in_room_payment_in_room_bill
								.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
						var inpatient_address = data.in_room_payment_in_room_bill
						.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
						$("#view_rec_room_inpatient_name").text(inpatient_name);
						$("#view_rec_room_inpatient_address").text(inpatient_address);
						
						$("#view_rec_room_remaining_balance").text(
							"₱" +
								data.in_room_payment_in_room_bill.room_bill_inpatient_bill.remaining_balance.toLocaleString()
						);
						var inpatient_bill_no =
							data.in_room_payment_in_room_bill
								.room_bill_inpatient_bill.inpatient_bill_no;
						$("#view_rec_room_inpatient_bill_no").text(inpatient_bill_no);
						$("#view_rec_room_bill_no").text(
							data.in_room_payment_in_room_bill
								.room_bill_no
						);

						var description = "";
						
						$("#room_view_receipt_table tbody").empty();

						description += "<tr>"+
										"<td>" + (data.in_room_payment_in_room_bill.room_bill_room_admission.admission_date+ " to " + 
										data.in_room_payment_in_room_bill.room_bill_room_admission.admission_date + " " +
										data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_number + " " +
										data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_room_type.name).toString() +"</td>"+
										"<td class='text-right'>"+ (data.in_room_payment_in_room_bill.no_of_days).toString() +"</td>"+
										"<td class='text-right'>₱"+ (data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_room_type.fee).toLocaleString() +"</td>"+
										"<td class='text-right'>₱"+ (data.in_room_payment_in_room_bill.no_of_days * data.in_room_payment_in_room_bill.room_bill_room_admission.room_admission_room.room_room_type.fee).toLocaleString() +"</td>"+
										"</tr>";
						$("#room_view_receipt_table tbody").append(description);
						$("#room_view_receipt_table tbody").append(
							"<tr>"+
								"<th colspan='2'></th>"+
								"<th class='text-right'>Total Amount</th>"+
								"<th class='text-right'>₱"+ data.in_room_payment_in_room_bill.total_amount.toLocaleString()+"</th>"+
							"</tr>"
						);

						if (data.in_room_payment_method.method_name == 'Cash') {
							$("#view_rec_room_cash_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
						}
						else{
							$("#view_rec_room_check_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
						}
						
						$("#view_rec_room_total_paid").text(
							"₱" + data.amount_paid.toLocaleString()
						);
						
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});
				break;	
			case 3:
				console.log("Lab Receipt")
				$.ajax({
					url: apiURL + "inpatient_lab_request_payment/find_one/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						$("#view_receipt_request_payment_div").show()
						$("#view_rec_lab_request_or_no").text(data.or_no);

						$("#view_rec_lab_request_date_of_billing").text(
							moment(
								data.in_request_payment_in_request_bill.request_bill_inpatient_bill.date_of_billing
							).format("MMMM D, YYYY")
						);
						$("#view_rec_lab_request_date_of_payment").text(
							moment(data.date_of_payment).format("MMMM D, YYYY")
						);
						var inpatient_name =
							data.in_request_payment_in_request_bill
								.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
							" " +
							data.in_request_payment_in_request_bill
								.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
						var inpatient_address = data.in_request_payment_in_request_bill
						.request_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
						$("#view_rec_lab_request_inpatient_name").text(inpatient_name);
						$("#view_rec_lab_request_inpatient_address").text(inpatient_address);
						
						$("#view_rec_lab_request_remaining_balance").text(
							"₱" +
								data.in_request_payment_in_request_bill.request_bill_inpatient_bill.remaining_balance.toLocaleString()
						);
						var inpatient_bill_no =
							data.in_request_payment_in_request_bill
								.request_bill_inpatient_bill.inpatient_bill_no;
						$("#view_rec_lab_request_inpatient_bill_no").text(inpatient_bill_no);
						$("#view_rec_lab_request_bill_no").text(
							data.in_request_payment_in_request_bill
								.lab_request_bill_no
						);

						var description = "";
						
						$("#lab_request_view_receipt_table tbody").empty();
						description += "<tr>"+
										"<td>" + (moment(data.in_request_payment_in_request_bill.request_bill_lab_request.created_at).format("MMMM D, YYYY")+ " " +
										data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_no + " " +
										data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_lab_test_type.name).toString() +"</td>"+
										"<td class='text-right'>₱"+ (data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_lab_test_type.fee).toLocaleString() +"</td>"+
										"</tr>";
						$("#lab_request_view_receipt_table tbody").append(description);
						$("#lab_request_view_receipt_table tbody").append(
							"<tr>"+
								"<th>Total Amount</th>"+
								"<th class='text-right'>₱"+ data.in_request_payment_in_request_bill.request_bill_lab_request.lab_request_lab_test_type.fee.toLocaleString()+"</th>"+
							"</tr>"
						);
						if (data.in_request_payment_method.method_name == 'Cash') {
							$("#view_rec_lab_request_cash_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
						}else{
							$("#view_rec_lab_request_check_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
						}
						
						$("#view_rec_lab_request_total_paid").text(
							"₱" + data.amount_paid.toLocaleString()
						);
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});
				break;
			case 4:
				console.log("Treatment Receipt")
				$.ajax({
					url: apiURL + "inpatient_treatment_payment/find_one/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						$("#view_receipt_treatment_payment_div").show()
						$("#view_rec_treatment_or_no").text(data.or_no);

						$("#view_rec_treatment_date_of_billing").text(
							moment(
								data.in_treatment_payment_in_treatment_bill.treatment_bill_inpatient_bill.date_of_billing
							).format("MMMM D, YYYY")
						);
						$("#view_rec_treatment_date_of_payment").text(
							moment(data.date_of_payment).format("MMMM D, YYYY")
						);
						var inpatient_name =
							data.in_treatment_payment_in_treatment_bill
								.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
							" " +
							data.in_treatment_payment_in_treatment_bill
								.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
						var inpatient_address = data.in_treatment_payment_in_treatment_bill
						.treatment_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
						$("#view_rec_treatment_inpatient_name").text(inpatient_name);
						$("#view_rec_treatment_inpatient_address").text(inpatient_address);
						
						$("#view_rec_treatment_remaining_balance").text(
							"₱" +
								data.in_treatment_payment_in_treatment_bill.treatment_bill_inpatient_bill.remaining_balance.toLocaleString()
						);
						var inpatient_bill_no =
							data.in_treatment_payment_in_treatment_bill
								.treatment_bill_inpatient_bill.inpatient_bill_no;
						$("#view_rec_treatment_inpatient_bill_no").text(inpatient_bill_no);
						$("#view_rec_treatment_bill_no").text(
							data.in_treatment_payment_in_treatment_bill
								.treatment_bill_no
						);

						var description = "";
						
						$("#treatment_view_receipt_table tbody").empty();
						description += "<tr>"+
										"<td>" + (moment(data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.created_at).format("MMMM D, YYYY")+ " " +
										data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_no + " " +
										data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_type.name).toString() +"</td>"+
										"<td class='text-right'>₱"+ (data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_type.fee).toLocaleString() +"</td>"+
										"</tr>";
						$("#treatment_view_receipt_table tbody").append(description);
						$("#treatment_view_receipt_table tbody").append(
						"<tr>"+
						"<th colspan='2'>Professional Fee</th>"+
						"</tr>");

						var prof_fee_total = 0
						$.each(data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_in_charge, function (i, dataOptions) {
							prof_fee_total = prof_fee_total +  dataOptions.professional_fee
							$("#treatment_view_receipt_table tbody").append(
								"<tr>"+
								"<td>"+ dataOptions.treatment_in_charge_employee.first_name + " " + dataOptions.treatment_in_charge_employee.last_name +"</td>"+
								"<td class='text-right'>₱"+ dataOptions.professional_fee +"</td>"+
								"</tr>");
						})

						$("#treatment_view_receipt_table tbody").append(
							"<tr>"+
								"<th>Total Amount</th>"+
								"<th class='text-right'>₱"+ 
								(prof_fee_total + data.in_treatment_payment_in_treatment_bill.treatment_bill_treatment.treatment_treatment_type.fee).toLocaleString() +
								"</th>"+
							"</tr>"
						);
						
						if (data.in_treatment_payment_method.method_name == 'Cash') {
							$("#view_rec_treatment_cash_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
						}else{
							$("#view_rec_treatment_check_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
						}
						
						$("#view_rec_treatment_total_paid").text(
							"₱" + data.amount_paid.toLocaleString()
						);
					},
					error: function ({ responseJSON }) {
						// toastr.error(data.responseJSON.detail);
					},
				});
				break;
			case 5:
				console.log("Surgery Receipt")
				$.ajax({
					url: apiURL + "inpatient_surgery_payment/find_one/"+id,
					dataSrc: "",
					type: "GET",
					success: function (data) {
						$("#view_receipt_surgery_payment_div").show()
						$("#view_rec_surgery_or_no").text(data.or_no);

						$("#view_rec_surgery_date_of_billing").text(
							moment(
								data.in_surgery_payment_in_surgery_bill.surgery_bill_inpatient_bill.date_of_billing
							).format("MMMM D, YYYY")
						);
						$("#view_rec_surgery_date_of_payment").text(
							moment(data.date_of_payment).format("MMMM D, YYYY")
						);
						var inpatient_name =
							data.in_surgery_payment_in_surgery_bill
								.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
							" " +
							data.in_surgery_payment_in_surgery_bill
								.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
						var inpatient_address = data.in_surgery_payment_in_surgery_bill
						.surgery_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.address
						$("#view_rec_surgery_inpatient_name").text(inpatient_name);
						$("#view_rec_surgery_inpatient_address").text(inpatient_address);
						
						$("#view_rec_surgery_remaining_balance").text(
							"₱" +
								data.in_surgery_payment_in_surgery_bill.surgery_bill_inpatient_bill.remaining_balance.toLocaleString()
						);
						var inpatient_bill_no =
							data.in_surgery_payment_in_surgery_bill
								.surgery_bill_inpatient_bill.inpatient_bill_no;
						$("#view_rec_surgery_inpatient_bill_no").text(inpatient_bill_no);
						$("#view_rec_surgery_bill_no").text(
							data.in_surgery_payment_in_surgery_bill
								.surgery_bill_no
						);

						var description = "";
						
						$("#surgery_view_receipt_table tbody").empty();
						description += "<tr>"+
										"<td>" + (moment(data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.created_at).format("MMMM D, YYYY")+ " " +
										data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_no + " " +
										data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_type.name).toString() +"</td>"+
										"<td class='text-right'>₱"+ (data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_type.fee).toLocaleString() +"</td>"+
										"</tr>";
						$("#surgery_view_receipt_table tbody").append(description);
						$("#surgery_view_receipt_table tbody").append(
						"<tr>"+
						"<th colspan='2'>Professional Fee</th>"+
						"</tr>");

						var prof_fee_total = 0
						$.each(data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_in_charge, function (i, dataOptions) {
							prof_fee_total = prof_fee_total +  dataOptions.professional_fee
							$("#surgery_view_receipt_table tbody").append(
								"<tr>"+
								"<td>"+ dataOptions.surgery_in_charge_employee.first_name + " " + dataOptions.surgery_in_charge_employee.last_name +"</td>"+
								"<td class='text-right'>₱"+ dataOptions.professional_fee +"</td>"+
								"</tr>");
						})

						$("#surgery_view_receipt_table tbody").append(
							"<tr>"+
								"<th>Total Amount</th>"+
								"<th class='text-right'>₱"+ 
								(prof_fee_total + data.in_surgery_payment_in_surgery_bill.surgery_bill_surgery.surgery_surgery_type.fee).toLocaleString() +
								"</th>"+
							"</tr>"
						);
						
						if (data.in_surgery_payment_method.method_name == 'Cash') {
							$("#view_rec_surgery_cash_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
						}else{
							$("#view_rec_surgery_check_amount").text(
								"₱" + data.amount_paid.toLocaleString()
							);
						}
						
						$("#view_rec_surgery_total_paid").text(
							"₱" + data.amount_paid.toLocaleString()
						);
						stepper.next();
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

	$("#view_receipt_prescription_payment_receipt_btn").printPreview({
		obj2print: "#view_receipt_prescription_payment_receipt",
		width: "810",
	});
	$("#view_receipt_room_payment_receipt_btn").printPreview({
		obj2print: "#view_receipt_room_payment_receipt",
		width: "810",
	});
	$("#view_receipt_request_payment_receipt_btn").printPreview({
		obj2print: "#view_receipt_request_payment_receipt",
		width: "810",
	});
	$("#view_receipt_treatment_payment_receipt_btn").printPreview({
		obj2print: "#view_receipt_treatment_payment_receipt",
		width: "810",
	});
	$("#view_receipt_surgery_payment_receipt_btn").printPreview({
		obj2print: "#view_receipt_surgery_payment_receipt",
		width: "810",
	});
});
