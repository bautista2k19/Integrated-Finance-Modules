$(document).ready(function () {
	var stepper = new Stepper($(".bs-stepper")[0]);
});
$(document).ready(function () {
	stepper = new Stepper($('.bs-stepper')[0])


	newRecord = (type) =>{
		$("#lab_request_payment_form").validate().resetForm();
		$("#lab_request_payment_form")[0].reset();
		$("#treatment_payment_form").validate().resetForm();
		$("#treatment_payment_form")[0].reset();
		$("html, body").animate({ scrollTop: 0 }, "slow");
		if (type == "Lab") {
			$("#treatment_div").hide()
			$("#lab_request_div").show()
			$("#treatment_payment_stepper").removeClass("bs-stepper")
			$("#lab_request_payment_stepper").addClass("bs-stepper")
			stepper = new Stepper($('.bs-stepper')[0])
		}else if (type == "Treatment") {
			$("#lab_request_div").hide()
			$("#treatment_div").show()
			$("#lab_request_payment_stepper").removeClass("bs-stepper")
			$("#treatment_payment_stepper").addClass("bs-stepper")
			stepper = new Stepper($('.bs-stepper')[0])
			$("#treatment_id").trigger("change");
		}
		
	}

	hideDiv = () =>{
		$("#lab_request_div").hide()
		$("#treatment_div").hide()
		$("#view_request_payment_div").hide()
		$("#view_treatment_payment_div").hide()
		$("#view_receipt_request_payment_div").hide()
		$("#view_receipt_treatment_payment_div").hide()
		
	}

    //OUTPATIENT LAB REQUEST PAYMENT
	loadLabRequestPaymentTable = () => {
		$("#lab_request_payments_table").dataTable().fnClearTable();
		$("#lab_request_payments_table").dataTable().fnDraw();
		$("#lab_request_payments_table").dataTable().fnDestroy();
		$("#lab_request_payments_table").dataTable({
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
					data: "out_request_payment_out_request.lab_request_no",
					name: "out_request_payment_out_request.lab_request_no",
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let outpatient_full_name = "";

						outpatient_full_name =
							aData.out_request_payment_out_request
								.lab_request_outpatient
								.outpatient_patient.first_name +
							" " +
							aData.out_request_payment_out_request
								.lab_request_outpatient
								.outpatient_patient.last_name;
						return outpatient_full_name;
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
								"',0)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 "></i>' +
								"</div>" +
								"<div>Print Receipt</div>" +
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
				url: apiURL + "outpatient_lab_request_payment/datatable",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				let outpatient_full_name = "";

				outpatient_full_name =
					aData.out_request_payment_out_request
						.lab_request_outpatient
						.outpatient_patient.first_name +
					" " +
					aData.out_request_payment_out_request
						.lab_request_outpatient
						.outpatient_patient.last_name;

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
						"',0)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 "></i>' +
						"</div>" +
						"<div>Print Receipt</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(
					aData[
						"out_request_payment_out_request.lab_request_no"
					]
				);
				$("td:eq(2)", nRow).html(outpatient_full_name);
				$("td:eq(3)", nRow).html(amount_paid);
				$("td:eq(4)", nRow).html(date_of_payment);
				$("td:eq(5)", nRow).html(payment_method);
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
	loadLabRequestPaymentTable();

    //OUTPATIENT TREATMENT PAYMENT
	loadTreatmentPaymentTable = () => {
		$("#treatment_payments_table").dataTable().fnClearTable();
		$("#treatment_payments_table").dataTable().fnDraw();
		$("#treatment_payments_table").dataTable().fnDestroy();
		$("#treatment_payments_table").dataTable({
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
					data: "out_treatment_payment_out_treatment.treatment_no",
					name: "out_treatment_payment_out_treatment.treatment_no",
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let outpatient_full_name = "";

						outpatient_full_name =
							aData.out_treatment_payment_out_treatment
								.treatment_outpatient
								.outpatient_patient.first_name +
							" " +
							aData.out_treatment_payment_out_treatment
								.treatment_outpatient
								.outpatient_patient.last_name;
						return outpatient_full_name;
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
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 "></i>' +
								"</div>" +
								"<div>Print Receipt</div>" +
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
				url: apiURL + "outpatient_treatment_payment/datatable",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				let outpatient_full_name = "";

				outpatient_full_name =
					aData.out_treatment_payment_out_treatment
						.treatment_outpatient
						.outpatient_patient.first_name +
					" " +
					aData.out_treatment_payment_out_treatment
						.treatment_outpatient
						.outpatient_patient.last_name;

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
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 "></i>' +
						"</div>" +
						"<div>Print Receipt</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(
					aData[
						"out_treatment_payment_out_treatment.treatment_no"
					]
				);
				$("td:eq(2)", nRow).html(outpatient_full_name);
				$("td:eq(3)", nRow).html(amount_paid);
				$("td:eq(4)", nRow).html(date_of_payment);
				$("td:eq(5)", nRow).html(payment_method);
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
	loadTreatmentPaymentTable();

	loadLabRequest = () => {
		$.ajax({
			url: apiURL + "lab_request/find_all_out_pending",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#lab_request_id").empty();
				
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.lab_request_no +
						" | " +
						dataOptions.lab_request_outpatient.outpatient_patient.first_name +
						" " +
						dataOptions.lab_request_outpatient.outpatient_patient.last_name +
						"</option>";
					$("#lab_request_id").append(options);

				});
				$("#lab_request_id").trigger("change");

			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadLabRequest();

	loadTreatment = () => {
		$.ajax({
			url: apiURL + "treatment/find_all_out_pending",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				$("#treatment_id").empty();
				
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.treatment_no +
						" | " +
						dataOptions.treatment_outpatient.outpatient_patient.first_name +
						" " +
						dataOptions.treatment_outpatient.outpatient_patient.last_name +
						"</option>";
					$("#treatment_id").append(options);

				});
				$("#treatment_id").trigger("change");

			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadTreatment();

	loadPaymentMethod = () => {
		$.ajax({
			url: apiURL + "payment_method/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#lab_request_payment_method_id").empty();
				$("#treatment_payment_method_id").empty();
				$("#view_request_payment_method").empty();
				$("#view_treatment_payment_method").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.method_name +
						"</option>";
					$("#lab_request_payment_method_id").append(options);
					$("#treatment_payment_method_id").append(options);
					$("#view_request_payment_method").append(options);
					$("#view_treatment_payment_method").append(options);

				});
				$("#lab_request_payment_method_id").trigger("change");
				$("#treatment_payment_method_id").trigger("change");
				$("#view_request_payment_method").trigger("change");
				$("#view_treatment_payment_method").trigger("change");

			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadPaymentMethod();

	loadPaymentTerm = () => {
		$.ajax({
			url: apiURL + "payment_term/find_by_name/Full payment",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#payment_term_id").val(data.id);
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadPaymentTerm();

    $("#lab_request_id").change(function () {
		$.ajax({
			url:
				apiURL +
				"lab_request/" +$("#lab_request_id").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				if (data != null){
					$("#td_lab_request_no").text(data.lab_request_no);
				$("#td_lab_request_date_of_request").text(moment(data.created_at).format(
					"MMMM D, YYYY"
				));
				$("#td_lab_test_type").text(data.lab_request_lab_test_type.name);
				$("#td_lab_request_total_amount").text(data.lab_request_lab_test_type.fee);
				$("#lab_request_payment_method_id").trigger("change");
				}
				
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	});

	$("#lab_request_payment_method_id").change(function () {
		var method = $("#lab_request_payment_method_id").select2("data");
		if (method[0].text == "Cash") {
			$(".lab_request_payment_check").hide();
			$(".lab_request_payment_cash").show();
			$("#lab_request_payment_cash_tendered").attr("min", $("#td_lab_request_total_amount").text());
			$("#lab_request_payment_cash_tendered").attr(
				"data-msg-min",
				"Cash tendered is not enough."
			);
			$("#lab_request_payment_cash_tendered").keyup(function () {
				var change =
					$("#lab_request_payment_cash_tendered").val() -
					parseFloat($("#td_lab_request_total_amount").text());
				if (change >= 0) {
					$("#lab_request_payment_change").text(change);
				} else {
					$("#lab_request_payment_change").text("0");
				}
			});
		} else if (method[0].text == "Check") {
			$(".lab_request_payment_cash").hide();
			$(".lab_request_payment_check").show();

			$("#lab_request_payment_check_amount").attr("min", $("#td_lab_request_total_amount").text());
			$("#lab_request_payment_check_amount").attr(
				"data-msg-min",
				"Check amount is not enough."
			);
			$("#lab_request_payment_check_amount").attr("max", $("#td_lab_request_total_amount").text());
			$("#lab_request_payment_check_amount").attr(
				"data-msg-max",
				"Check amount exceeded the required amount."
			);
		} else {
			$(".lab_request_payment_cash").hide();
			$(".lab_request_payment_check").hide();
		}
	});

	$("#lab_request_payment_check_amount").change(function(){
		$('#lab_request_payment_check_amount_in_words').moneyinwords($("#lab_request_payment_check_amount").val().toLocaleString(),'PH','PHP');
		$('#lab_request_payment_check_amount_in_words').text($('#lab_request_payment_check_amount_in_words').text().toUpperCase())
	})


	$("#lab_request_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$("#modal_submit_confirmation").modal('show')
			$("#confirm_submit").on("click", function () {
				var method = $("#lab_request_payment_method_id").select2("data");
				if (method[0].text == "Cash") {
					$.ajax({
						url: apiURL + "outpatient_lab_request_payment/create_outpatient_lab_request_payment",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							lab_request_id: $("#lab_request_id").val(),
							amount_paid: parseFloat($("#td_lab_request_total_amount").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#lab_request_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_cash_payment: {
								amount: parseFloat($("#td_lab_request_total_amount").text()),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Lab Request has been paid.");
							console.log("cash payment")
							$("#lab_request_payment_form").validate().resetForm();
							$("#lab_request_payment_form")[0].reset();
							loadLabRequestPaymentTable();
						
							$("#rec_lab_request_or_no").text(data.or_no);

							$("#rec_lab_request_date_of_request").text(
								moment(
									data.out_request_payment_out_request.created_at
								).format("MMMM D, YYYY")
							);
							$("#rec_lab_request_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var outpatient_name =
								data.out_request_payment_out_request
									.lab_request_outpatient.outpatient_patient.first_name +
								" " +
								data.out_request_payment_out_request
									.lab_request_outpatient.outpatient_patient.last_name;

							var outpatient_address = data.out_request_payment_out_request
							.lab_request_outpatient.outpatient_patient.address
							$("#rec_lab_request_outpatient_name").text(outpatient_name);
							$("#rec_lab_request_outpatient_address").text(outpatient_address);
							
							$("#rec_lab_request_no").text(
								data.out_request_payment_out_request
									.lab_request_no
							);

							var description = "";
							
							$("#lab_request_receipt_table tbody").empty();
							description += "<tr>"+
											"<td>" +
											data.out_request_payment_out_request.lab_request_lab_test_type.name +"</td>"+
											"<td class='text-right'>₱"+ (data.out_request_payment_out_request.lab_request_lab_test_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#lab_request_receipt_table tbody").append(description);
							$("#lab_request_receipt_table tbody").append(
								"<tr>"+
									"<th>Total Amount</th>"+
									"<th class='text-right'>₱"+ data.out_request_payment_out_request.lab_request_lab_test_type.fee.toLocaleString()+"</th>"+
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
					console.log("check")
					$.ajax({
						url: apiURL + "outpatient_lab_request_payment/create_outpatient_lab_request_payment",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							lab_request_id: $("#lab_request_id").val(),
							amount_paid: parseFloat($("#td_lab_request_total_amount").text()),
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
								//amount_in_words: $("#lab_request_payment_check_amount_in_words").val(),
								bank_name: $("#lab_request_payment_bank_name").val(),
								bank_address: $("#lab_request_payment_bank_address").val(),
								description: $("#lab_request_payment_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Lab Request has been paid.");
							$("#lab_request_payment_form").validate().resetForm();
							$("#lab_request_payment_form")[0].reset();
							loadLabRequestPaymentTable();
							$("#rec_lab_request_or_no").text(data.or_no);

							$("#rec_lab_request_date_of_request").text(
								moment(
									data.out_request_payment_out_request.created_at
								).format("MMMM D, YYYY")
							);
							$("#rec_lab_request_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var outpatient_name =
								data.out_request_payment_out_request
									.lab_request_outpatient.outpatient_patient.first_name +
								" " +
								data.out_request_payment_out_request
									.lab_request_outpatient.outpatient_patient.last_name;

							var outpatient_address = data.out_request_payment_out_request
							.lab_request_outpatient.outpatient_patient.address
							$("#rec_lab_request_outpatient_name").text(outpatient_name);
							$("#rec_lab_request_outpatient_address").text(outpatient_address);
							
							$("#rec_lab_request_no").text(
								data.out_request_payment_out_request
									.lab_request_no
							);

							var description = "";
							
							$("#lab_request_receipt_table tbody").empty();
							description += "<tr>"+
											"<td>" +
											data.out_request_payment_out_request.lab_request_lab_test_type.name +"</td>"+
											"<td class='text-right'>₱"+ (data.out_request_payment_out_request.lab_request_lab_test_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#lab_request_receipt_table tbody").append(description);
							$("#lab_request_receipt_table tbody").append(
								"<tr>"+
									"<th>Total Amount</th>"+
									"<th class='text-right'>₱"+ data.out_request_payment_out_request.lab_request_lab_test_type.fee.toLocaleString()+"</th>"+
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
				$("#lab_request_div").hide()
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

	$("#lab_request_payment_receipt_btn").printPreview({
		obj2print: "#lab_request_payment_receipt",
		width: "810",
	});

	$("#treatment_id").change(function () {
		$.ajax({
			url:
				apiURL +
				"treatment/" +$("#treatment_id").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				if (data != null){
					$("#td_treatment_no").text(data.treatment_no);
				$("#td_treatment_date_of_treatment").text(moment(data.created_at).format(
					"MMMM D, YYYY"
				));
				$("#td_treatment_type").text(data.treatment_treatment_type.name);
				$("#td_treatment_amount").text(data.treatment_treatment_type.fee);
				var	total_prof_fee = 0
				$.each(data.treatment_treatment_in_charge, function (i, dataOptions) {
					total_prof_fee += dataOptions.professional_fee
				});
				
				
				$("#td_treatment_prof_fee").text(total_prof_fee);
				$("#td_treatment_total_amount").text(data.treatment_treatment_type.fee + total_prof_fee);
				$("#treatment_payment_method_id").trigger("change")
				}
				
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	});

	$("#treatment_payment_method_id").change(function () {
		var method = $("#treatment_payment_method_id").select2("data");
		if (method[0].text == "Cash") {
			$(".treatment_payment_check").hide();
			$(".treatment_payment_cash").show();
			$("#treatment_payment_cash_tendered").attr("min", $("#td_treatment_total_amount").text());
			$("#treatment_payment_cash_tendered").attr(
				"data-msg-min",
				"Cash tendered is not enough."
			);
			$("#treatment_payment_cash_tendered").keyup(function () {
				var change =
					$("#treatment_payment_cash_tendered").val() -
					parseFloat($("#td_treatment_total_amount").text());
				if (change >= 0) {
					$("#treatment_payment_change").text(change);
				} else {
					$("#treatment_payment_change").text("0");
				}
			});
		} else if (method[0].text == "Check") {
			$(".treatment_payment_cash").hide();
			$(".treatment_payment_check").show();

			$("#treatment_payment_check_amount").attr("min", $("#td_treatment_total_amount").text());
			$("#treatment_payment_check_amount").attr(
				"data-msg-min",
				"Check amount is not enough."
			);
			$("#treatment_payment_check_amount").attr("max", $("#td_treatment_total_amount").text());
			$("#treatment_payment_check_amount").attr(
				"data-msg-max",
				"Check amount exceeded the required amount."
			);
		} else {
			$(".treatment_payment_cash").hide();
			$(".treatment_payment_check").hide();
		}
	});

	$("#treatment_payment_check_amount").change(function(){
		$('#treatment_payment_check_amount_in_words').moneyinwords($("#treatment_payment_check_amount").val().toLocaleString(),'PH','PHP');
		$('#treatment_payment_check_amount_in_words').text($('#treatment_payment_check_amount_in_words').text().toUpperCase())
	})


	$("#treatment_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$("#modal_submit_confirmation").modal('show')
			$("#confirm_submit").on("click", function () {
				var method = $("#treatment_payment_method_id").select2("data");
				if (method[0].text == "Cash") {
					$.ajax({
						url: apiURL + "outpatient_treatment_payment/create_outpatient_treatment_payment",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							treatment_id: $("#treatment_id").val(),
							amount_paid: parseFloat($("#td_treatment_total_amount").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#treatment_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							patient_cash_payment: {
								amount: parseFloat($("#td_treatment_total_amount").text()),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Treatment has been paid.");
							console.log("cash payment")
							$("#treatment_payment_form").validate().resetForm();
							$("#treatment_payment_form")[0].reset();
							loadTreatmentPaymentTable();
							$("#rec_treatment_or_no").text(data.or_no);

							$("#rec_treatment_date_of_treatment").text(
								moment(
									data.out_treatment_payment_out_treatment.created_at
								).format("MMMM D, YYYY")
							);
							$("#rec_treatment_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var outpatient_name =
								data.out_treatment_payment_out_treatment
									.treatment_outpatient.outpatient_patient.first_name +
								" " +
								data.out_treatment_payment_out_treatment
									.treatment_outpatient.outpatient_patient.last_name;

							var outpatient_address = data.out_treatment_payment_out_treatment
							.treatment_outpatient.outpatient_patient.address
							$("#rec_treatment_outpatient_name").text(outpatient_name);
							$("#rec_treatment_outpatient_address").text(outpatient_address);
							
							$("#rec_treatment_no").text(
								data.out_treatment_payment_out_treatment
									.treatment_no
							);

							var description = "";
							
							$("#treatment_receipt_table tbody").empty();
							description += "<tr>"+
											"<td>" +
											data.out_treatment_payment_out_treatment.treatment_treatment_type.name +"</td>"+
											"<td class='text-right'>₱"+ (data.out_treatment_payment_out_treatment.treatment_treatment_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#treatment_receipt_table tbody").append(description);
							var	total_prof_fee = 0
							$.each(data.out_treatment_payment_out_treatment.treatment_treatment_in_charge, function (i, dataOptions) {
								total_prof_fee += dataOptions.professional_fee
								
							});
							$("#treatment_receipt_table tbody").append(
								"<tr>"+
								"<td> Professional Fee</td>"+
								"<td class='text-right'>₱"+ (total_prof_fee).toLocaleString() +"</td>"+
								"</tr>"
							);
							
							$("#treatment_receipt_table tbody").append(
								"<tr>"+
									"<th>Total Amount</th>"+
									"<th class='text-right'>₱"+ (total_prof_fee + data.out_treatment_payment_out_treatment.treatment_treatment_type.fee).toLocaleString()+"</th>"+
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
						url: apiURL + "outpatient_treatment_payment/create_outpatient_treatment_payment",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							treatment_id: $("#treatment_id").val(),
							amount_paid: parseFloat($("#td_treatment_total_amount").text()),
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
								//amount_in_words: $("#treatment_payment_check_amount_in_words").val(),
								bank_name: $("#treatment_payment_bank_name").val(),
								bank_address: $("#treatment_payment_bank_address").val(),
								description: $("#treatment_payment_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("Treatment has been paid.");
							$("#treatment_payment_form").validate().resetForm();
							$("#treatment_payment_form")[0].reset();
							loadTreatmentPaymentTable();
							$("#rec_treatment_or_no").text(data.or_no);

							$("#rec_treatment_date_of_treatment").text(
								moment(
									data.out_treatment_payment_out_treatment.created_at
								).format("MMMM D, YYYY")
							);
							$("#rec_treatment_date_of_payment").text(
								moment(data.date_of_payment).format("MMMM D, YYYY")
							);
							var outpatient_name =
								data.out_treatment_payment_out_treatment
									.treatment_outpatient.outpatient_patient.first_name +
								" " +
								data.out_treatment_payment_out_treatment
									.treatment_outpatient.outpatient_patient.last_name;

							var outpatient_address = data.out_treatment_payment_out_treatment
							.treatment_outpatient.outpatient_patient.address
							$("#rec_treatment_outpatient_name").text(outpatient_name);
							$("#rec_treatment_outpatient_address").text(outpatient_address);
							
							$("#rec_treatment_no").text(
								data.out_treatment_payment_out_treatment
									.treatment_no
							);

							var description = "";
							
							$("#treatment_receipt_table tbody").empty();
							description += "<tr>"+
											"<td>" +
											data.out_treatment_payment_out_treatment.treatment_treatment_type.name +"</td>"+
											"<td class='text-right'>₱"+ (data.out_treatment_payment_out_treatment.treatment_treatment_type.fee).toLocaleString() +"</td>"+
											"</tr>";
							$("#treatment_receipt_table tbody").append(description);

							var	total_prof_fee = 0
							$.each(data.out_treatment_payment_out_treatment.treatment_treatment_in_charge, function (i, dataOptions) {
								total_prof_fee += dataOptions.professional_fee
								
							});
							$("#treatment_receipt_table tbody").append(
								"<tr>"+
								"<td> Professional Fee</td>"+
								"<td class='text-right'>₱"+ (total_prof_fee).toLocaleString() +"</td>"+
								"</tr>"
							);

							$("#treatment_receipt_table tbody").append(
								"<tr>"+
									"<th>Total Amount</th>"+
									"<th class='text-right'>₱"+ (total_prof_fee + data.out_treatment_payment_out_treatment.treatment_treatment_type.fee).toLocaleString()+"</th>"+
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
				$("#treatment_div").hide()
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
	$("#treatment_payment_receipt_btn").printPreview({
		obj2print: "#treatment_payment_receipt",
		width: "810",
	});

	$("#view_request_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var method = $("#view_request_payment_method").select2("data");
			var update_type
			if (method[0].text == "Cash") {
				$.ajax({
					url: apiURL + "outpatient_lab_request_payment/update_outpatient_lab_request_payment/"+ $("#edit_outpatient_request_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						lab_request_id: $("#view_request_payment_request_id").val(),
						amount_paid: $("#view_request_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_request_payment_method").val(),
						date_of_payment: $("#view_request_payment_payment_date").val(),
						status:$("#view_request_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_check_payment_id:$("#edit_patient_check_payment_id").val(),
						patient_cash_payment_id:$("#edit_patient_cash_payment_id").val(),
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
					url: apiURL + "outpatient_lab_request_payment/update_outpatient_lab_request_payment/"+ $("#edit_outpatient_request_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						lab_request_id: $("#view_request_payment_request_id").val(),
						amount_paid: $("#view_request_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_request_payment_method").val(),
						date_of_payment: $("#view_request_payment_payment_date").val(),
						status:$("#view_request_payment_status").val(),
						updated_by: localStorage.USER_ID,
						patient_cash_payment_id:$("#edit_patient_cash_payment_id").val(),
						patient_check_payment_id:$("#edit_patient_check_payment_id").val(),
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
						console.log("EQWEQWEWW")
						toastr.success("Lab Request payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			}
			setTimeout(() => {
				loadLabRequestPaymentTable();
				$("#view_request_payment_div").hide()
			}, 1000)
			
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

	loadViewLabRequest = () => {
		$.ajax({
			url: apiURL + "lab_request/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#view_request_payment_request_id").empty();
				
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.lab_request_no +
						" | " +
						dataOptions.lab_request_outpatient.outpatient_patient.first_name +
						" " +
						dataOptions.lab_request_outpatient.outpatient_patient.last_name +
						"</option>";
					$("#view_request_payment_request_id").append(options);

				});
				$("#view_request_payment_request_id").trigger("change");

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
			url: apiURL + "outpatient_lab_request_payment/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				console.log(data)
				$("html, body").animate({ scrollTop: 0 }, "slow");
				$("#view_request_payment_div").show()
				$("#edit_outpatient_request_uuid").val(data.id)
				$("#view_request_payment_or").text(data.or_no)
				$("#view_request_payment_amount_paid").val(data.amount_paid)
				$("#view_request_payment_payment_date").val(data.date_of_payment)
				$("#view_request_payment_status").val(data.status)
				loadViewLabRequest()
				loadPaymentMethod()
				setTimeout(() => {
					$("#view_request_payment_request_id").val(data.lab_request_id)
					$("#view_request_payment_request_id").trigger("change")
					$("#view_request_payment_method").val(data.payment_method_id)
					$("#view_request_payment_method").trigger("change")
				}, 1000);
				
				if (data.out_request_payment_method.method_name == 'Cash') {
					$("#edit_patient_cash_payment_id").val(data.patient_cash_payment_id)
					$(".view_request_payment_check_info").hide()	
					
					console.log(data.out_request_payment_patient_cash.id)
					console.log(data.out_request_payment_patient_cash.amount)
				}else if (data.out_request_payment_method.method_name == 'Check') {
					$("#edit_patient_check_payment_id").val(data.patient_check_payment_id)
					$(".view_request_payment_check_info").show()
					$("#view_request_payment_bank_name").val(data.out_request_payment_patient_check.bank_name)
					$("#view_request_payment_bank_address").val(data.out_request_payment_patient_check.bank_address)
					$("#view_request_payment_check_no").val(data.out_request_payment_patient_check.check_no)
					$("#view_request_payment_check_date").val(data.out_request_payment_patient_check.check_date)
					//$("#view_request_payment_bank_name").val(data.out_request_payment_patient_check.id)
					$("#view_request_payment_acc_name").val(data.out_request_payment_patient_check.account_name)
					$("#view_request_payment_acc_no").val(data.out_request_payment_patient_check.account_no)
					$("#view_request_payment_rt_number").val(data.out_request_payment_patient_check.rt_number)
					$("#view_request_payment_check_amount").val(data.out_request_payment_patient_check.amount)
					$("#view_request_payment_check_description").val(data.out_request_payment_patient_check.description)
					$("#view_request_payment_payee_name").val(data.out_request_payment_patient_check.payee_name)
					$("#view_request_payment_check_status").val(data.out_request_payment_patient_check.check_status)
				}
			  
			},
			error: function (data) {
			  toastr.error(data.responseJSON.detail);
			},
		  });
		if (type == 0) {
			$("#cancel_edit_op_request_payment_button").text("Close")
			$("#view_request_payment_form :input").prop("disabled", true);
			$("#cancel_edit_op_request_payment_button").prop("disabled", false);
			$("#edit_op_request_payment_button").hide()
		}else if (type == 1) {
			$("#cancel_edit_op_request_payment_button").text("Cancel")
			$("#view_request_payment_form :input").prop("disabled", false);
			$("#edit_op_request_payment_button").show()
		}
		
	}

	$("#view_treatment_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var method = $("#view_treatment_payment_method").select2("data");
			if (method[0].text == "Cash") {
				$.ajax({
					url: apiURL + "outpatient_treatment_payment/update_outpatient_treatment_payment/"+ $("#edit_outpatient_treatment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						treatment_id: $("#view_treatment_payment_treatment_id").val(),
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
				console.log($("#edit_t_patient_check_payment_id").val())
				$.ajax({
					url: apiURL + "outpatient_treatment_payment/update_outpatient_treatment_payment/"+ $("#edit_outpatient_treatment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						treatment_id: $("#view_treatment_payment_treatment_id").val(),
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
				loadTreatmentPaymentTable();
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


	loadViewTreatment = () => {
		$.ajax({
			url: apiURL + "treatment/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				console.log(data)
				$("#view_treatment_payment_treatment_id").empty();
				
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.treatment_no +
						" | " +
						dataOptions.treatment_outpatient.outpatient_patient.first_name +
						" " +
						dataOptions.treatment_outpatient.outpatient_patient.last_name +
						"</option>";
					$("#view_treatment_payment_treatment_id").append(options);

				});
				$("#view_treatment_payment_treatment_id").trigger("change");

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
			url: apiURL + "outpatient_treatment_payment/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				console.log(data)
			  	$("html, body").animate({ scrollTop: 0 }, "slow");
				$("#view_treatment_payment_div").show()
				$("#edit_outpatient_treatment_uuid").val(data.id)
				$("#view_treatment_payment_or").text(data.or_no)
				$("#view_treatment_payment_amount_paid").val(data.amount_paid)
				$("#view_treatment_payment_payment_date").val(data.date_of_payment)
				$("#view_treatment_payment_status").val(data.status)
				loadViewTreatment()
				loadPaymentMethod()
				setTimeout(() => {
					$("#view_treatment_payment_treatment_id").val(data.treatment_id)
					$("#view_treatment_payment_treatment_id").trigger("change")
					$("#view_treatment_payment_method").val(data.payment_method_id)
					$("#view_treatment_payment_method").trigger("change")
				}, 1000);
				
				if (data.out_treatment_payment_method.method_name == 'Cash') {
					$("#edit_t_patient_cash_payment_id").val(data.patient_cash_payment_id)
					$(".view_treatment_payment_check_info").hide()	
					
					console.log(data.out_treatment_payment_patient_cash.id)
					console.log(data.out_treatment_payment_patient_cash.amount)
				}else if (data.out_treatment_payment_method.method_name == 'Check') {
					$("#edit_t_patient_check_payment_id").val(data.patient_check_payment_id)
					$(".view_treatment_payment_check_info").show()
					$("#view_treatment_payment_bank_name").val(data.out_treatment_payment_patient_check.bank_name)
					$("#view_treatment_payment_bank_address").val(data.out_treatment_payment_patient_check.bank_address)
					$("#view_treatment_payment_check_no").val(data.out_treatment_payment_patient_check.check_no)
					$("#view_treatment_payment_check_date").val(data.out_treatment_payment_patient_check.check_date)
					//$("#view_treatment_payment_bank_name").val(data.out_treatment_payment_patient_check.id)
					$("#view_treatment_payment_acc_name").val(data.out_treatment_payment_patient_check.account_name)
					$("#view_treatment_payment_acc_no").val(data.out_treatment_payment_patient_check.account_no)
					$("#view_treatment_payment_rt_number").val(data.out_treatment_payment_patient_check.rt_number)
					$("#view_treatment_payment_check_amount").val(data.out_treatment_payment_patient_check.amount)
					$("#view_treatment_payment_check_description").val(data.out_treatment_payment_patient_check.description)
					$("#view_treatment_payment_payee_name").val(data.out_treatment_payment_patient_check.payee_name)
					$("#view_treatment_payment_check_status").val(data.out_treatment_payment_patient_check.check_status)
				}
			  
			},
			error: function (data) {
			  toastr.error(data.responseJSON.detail);
			},
		  });
		
		if (type == 0) {
			$("#cancel_edit_op_treatment_payment_button").text("Close")
			$("#view_treatment_payment_form :input").prop("disabled", true);
			$("#cancel_edit_op_treatment_payment_button").prop("disabled", false);
			$("#edit_op_treatment_payment_button").hide()
		}else if (type == 1) {
			$("#cancel_edit_op_treatment_payment_button").text("Cancel")
			$("#view_treatment_payment_form :input").prop("disabled", false);
			$("#edit_op_treatment_payment_button").show()
		}
	}

	$("#view_receipt_request_payment_receipt_btn").printPreview({
		obj2print: "#view_receipt_request_payment_receipt",
		width: "810",
	});
	
	$("#view_receipt_treatment_payment_receipt_btn").printPreview({
		obj2print: "#view_receipt_treatment_payment_receipt",
		width: "810",
	});

	viewORPrintreceipt = (id, type) => {
		if (type == 0) {
			console.log("lab")
			$.ajax({
				url: apiURL + "outpatient_lab_request_payment/"+id,
				dataSrc: "",
				type: "GET",
				success: function (data) {
					$("#view_receipt_request_payment_div").show()
					$("#view_rec_lab_request_or_no").text(data.or_no);

					$("#view_rec_lab_request_date_of_request").text(
						moment(
							data.out_request_payment_out_request.created_at
						).format("MMMM D, YYYY")
					);
					$("#view_rec_lab_request_date_of_payment").text(
						moment(data.date_of_payment).format("MMMM D, YYYY")
					);
					var outpatient_name =
						data.out_request_payment_out_request
							.lab_request_outpatient.outpatient_patient.first_name +
						" " +
						data.out_request_payment_out_request
							.lab_request_outpatient.outpatient_patient.last_name;

					var outpatient_address = data.out_request_payment_out_request
					.lab_request_outpatient.outpatient_patient.address
					$("#view_rec_lab_request_outpatient_name").text(outpatient_name);
					$("#view_rec_lab_request_outpatient_address").text(outpatient_address);
					
					$("#view_rec_lab_request_no").text(
						data.out_request_payment_out_request
							.lab_request_no
					);

					var description = "";
					
					$("#lab_request_view_receipt_table tbody").empty();
					description += "<tr>"+
									"<td>" +
									data.out_request_payment_out_request.lab_request_lab_test_type.name +"</td>"+
									"<td class='text-right'>₱"+ (data.out_request_payment_out_request.lab_request_lab_test_type.fee).toLocaleString() +"</td>"+
									"</tr>";
					$("#lab_request_view_receipt_table tbody").append(description);
					$("#lab_request_view_receipt_table tbody").append(
						"<tr>"+
							"<th>Total Amount</th>"+
							"<th class='text-right'>₱"+ data.out_request_payment_out_request.lab_request_lab_test_type.fee.toLocaleString()+"</th>"+
						"</tr>"
					);

					if (data.out_request_payment_method.method_name == 'Cash') {
						$("#view_rec_lab_request_cash_amount").text(
							"₱" + data.amount_paid.toLocaleString()
						);
					} else {
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
		} else if (type == 1) {
			console.log("treatment")
			$.ajax({
				url: apiURL + "outpatient_treatment_payment/"+id,
				dataSrc: "",
				type: "GET",
				success: function (data) {
					$("#view_receipt_treatment_payment_div").show()
					$("#view_rec_treatment_or_no").text(data.or_no);

					$("#view_rec_treatment_date_of_treatment").text(
						moment(
							data.out_treatment_payment_out_treatment.created_at
						).format("MMMM D, YYYY")
					);
					$("#view_rec_treatment_date_of_payment").text(
						moment(data.date_of_payment).format("MMMM D, YYYY")
					);
					var outpatient_name =
						data.out_treatment_payment_out_treatment
							.treatment_outpatient.outpatient_patient.first_name +
						" " +
						data.out_treatment_payment_out_treatment
							.treatment_outpatient.outpatient_patient.last_name;

					var outpatient_address = data.out_treatment_payment_out_treatment
					.treatment_outpatient.outpatient_patient.address
					$("#view_rec_treatment_outpatient_name").text(outpatient_name);
					$("#view_rec_treatment_outpatient_address").text(outpatient_address);
					
					$("#view_rec_treatment_no").text(
						data.out_treatment_payment_out_treatment
							.treatment_no
					);

					var description = "";
					
					$("#treatment_view_receipt_table tbody").empty();
					description += "<tr>"+
									"<td>" +
									data.out_treatment_payment_out_treatment.treatment_treatment_type.name +"</td>"+
									"<td class='text-right'>₱"+ (data.out_treatment_payment_out_treatment.treatment_treatment_type.fee).toLocaleString() +"</td>"+
									"</tr>";
					$("#treatment_view_receipt_table tbody").append(description);
					var	total_prof_fee = 0
					$.each(data.out_treatment_payment_out_treatment.treatment_treatment_in_charge, function (i, dataOptions) {
						total_prof_fee += dataOptions.professional_fee
						
					});
					$("#treatment_view_receipt_table tbody").append(
						"<tr>"+
						"<td> Professional Fee</td>"+
						"<td class='text-right'>₱"+ (total_prof_fee).toLocaleString() +"</td>"+
						"</tr>"
					);
					
					$("#treatment_view_receipt_table tbody").append(
						"<tr>"+
							"<th>Total Amount</th>"+
							"<th class='text-right'>₱"+ (total_prof_fee + data.out_treatment_payment_out_treatment.treatment_treatment_type.fee).toLocaleString()+"</th>"+
						"</tr>"
					);

					
					if (data.out_treatment_payment_method.method_name == 'Cash') {
						$("#view_rec_treatment_cash_amount").text(
							"₱" + data.amount_paid.toLocaleString()
						);
					}
					else{
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
		}
	}
})  