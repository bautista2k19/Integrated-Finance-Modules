$(document).ready(function () {
	var stepper = new Stepper($('.bs-stepper')[0])});
$(document).ready(function () {	
	stepper = new Stepper($('.bs-stepper')[0])
	showPovFormDiv = (term_name) => {
		$("html, body").animate({ scrollTop: 0 }, "slow");

		if (term_name == "Full Payment") {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			$("#po_form_div").hide();
			$("#pov_form_div").show();
			$("#pov_payment_form").validate().resetForm();
		}else if(term_name == "Partial Payment"){
			$("html, body").animate({ scrollTop: 0 }, "slow");
			$("#pov_form_div").hide();
			$("#po_form_div").show();
			$("#po_payment_form").validate().resetForm();
		}
		
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
	}
	hideDiv = () =>{
		$("#view_pov_payment_div").hide()
		$("#view_po_payment_div").hide()
		$("#pov_form_div").hide()
		$("#po_form_div").hide()
		$("#print_check_div").hide()
	}
	//PAYMENTS DATATABLE
	//HOSPITAL PAYMENT
	loadPOVPaymentTable = () => {
		$("#pov_payments_table").dataTable().fnClearTable();
		$("#pov_payments_table").dataTable().fnDraw();
		$("#pov_payments_table").dataTable().fnDestroy();
		$("#pov_payments_table").dataTable({
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
					data: "order_vendor_payment_order_vendor_bill.purchase_order_vendor_bill_no",
					name: "order_vendor_payment_order_vendor_bill.purchase_order_vendor_bill_no",
					searchable: true,
				},
				{
					data: "order_vendor_payment_order_vendor_bill.order_vendor_bill_vendor.vendor_name",
					name: "order_vendor_payment_order_vendor_bill.order_vendor_bill_vendor.vendor_name",
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
					data: "order_vendor_payment_payment_term.term_name",
					name: "order_vendor_payment_payment_term.term_name",
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
							'<div class="dropdown-item d-flex" role="button" onClick="return viewPOVPayment(\'' +
							aData["id"] +
							"',0)\">" +
							'<div style="width: 2rem">' +
							'<i class="fas fa-eye mr-1 "></i>' +
							"</div>" +
							"<div>View Payment</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewPOVPayment(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 "></i>' +
								"</div>" +
								"<div>Edit Payment</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintcheck(\'' +
								aData["id"] +
								"',0)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 "></i>' +
								"</div>" +
								"<div>Print Check</div>" +
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
				url: apiURL + "purchase_order_vendor_payment/datatable",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
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
					'<div class="dropdown-item d-flex" role="button" onClick="return viewPOVPayment(\'' +
					aData["id"] +
					"',0)\">" +
					'<div style="width: 2rem">' +
					'<i class="fas fa-eye mr-1 "></i>' +
					"</div>" +
					"<div>View POV Payment</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewPOVPayment(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 "></i>' +
						"</div>" +
						"<div>Edit POV Payment</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintcheck(\'' +
						aData["id"] +
						"',0)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 "></i>' +
						"</div>" +
						"<div>Print Check</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(
					aData["order_vendor_payment_order_vendor_bill.purchase_order_vendor_bill_no"]
				);
				$("td:eq(2)", nRow).html(aData["order_vendor_payment_order_vendor_bill.order_vendor_bill_vendor.vendor_name"]);
				$("td:eq(3)", nRow).html(total_amount_paid);
				$("td:eq(4)", nRow).html(
					aData["order_vendor_payment_payment_term.term_name"]
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
	loadPOVPaymentTable();

	loadPOPaymentTable = () => {
		$("#po_payments_table").dataTable().fnClearTable();
		$("#po_payments_table").dataTable().fnDraw();
		$("#po_payments_table").dataTable().fnDestroy();
		$("#po_payments_table").dataTable({
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
					data: "order_payment_order_bill.purchase_order_bill_no",
					name: "order_payment_order_bill.purchase_order_bill_no",
					searchable: true,
				},
				{
					data: "order_payment_order_bill.order_bill_order_vendor_bill.order_vendor_bill_vendor.vendor_name",
					name: "order_payment_order_bill.order_bill_order_vendor_bill.order_vendor_bill_vendor.vendor_name",
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
					data: "order_payment_method.method_name",
					name: "order_payment_method.method_name",
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
							'<div class="dropdown-item d-flex" role="button" onClick="return viewPOPayment(\'' +
							aData["id"] +
							"',0)\">" +
							'<div style="width: 2rem">' +
							'<i class="fas fa-eye mr-1 "></i>' +
							"</div>" +
							"<div>View Payment</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewPOPayment(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 "></i>' +
								"</div>" +
								"<div>Edit Payment</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintcheck(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 "></i>' +
								"</div>" +
								"<div>Print Check</div>" +
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
				url: apiURL + "purchase_order_payment/datatable",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				let amount_paid = "";

				amount_paid = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.amount_paid);

				let date_of_payment = "";
				date_of_payment += moment(aData.date_of_payment).format("MMMM D, YYYY");

				let buttons = "";

				buttons +=
					'<div class="text-center dropdown">' +
					'<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
					'<i class="fas fa-ellipsis-v"></i>' +
					"</div>" +
					'<div class="dropdown-menu dropdown-menu-right">' +
					'<div class="dropdown-item d-flex" role="button" onClick="return viewPOPayment(\'' +
					aData["id"] +
					"',0)\">" +
					'<div style="width: 2rem">' +
					'<i class="fas fa-eye mr-1 "></i>' +
					"</div>" +
					"<div>View Payment</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewPOPayment(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 "></i>' +
						"</div>" +
						"<div>Edit Payment</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewORPrintcheck(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 "></i>' +
						"</div>" +
						"<div>Print Check</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(
					aData["order_payment_order_bill.purchase_order_bill_no"]
				);
				$("td:eq(2)", nRow).html(aData["order_payment_order_bill.order_bill_order_vendor_bill.order_vendor_bill_vendor.vendor_name"]);
				$("td:eq(3)", nRow).html(amount_paid);
				$("td:eq(4)", nRow).html(
					aData["order_payment_method.method_name"]
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
	
	$("#pov_payment_menu").on("click", function () {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$("#po_payments_div").hide()
		$("#pov_payments_div").show()
		$("#po_payment_menu").removeClass("active")
		$("#pov_payment_menu").addClass("active")
		loadPOVPaymentTable();
	})

	$("#po_payment_menu").on("click", function () {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$("#pov_payments_div").hide()
		$("#po_payments_div").show()
		$("#pov_payment_menu").removeClass("active")
		$("#po_payment_menu").addClass("active")
		loadPOPaymentTable();
	})

	$(window).resize(function () {
		$("table.dataTable").resize();
	});

	loadPOVBill = () => {
		$.ajax({
			url: apiURL + "purchase_order_vendor_bill/find_all_pending",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#pov_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.purchase_order_vendor_bill_no +
						" | " +
						dataOptions.order_vendor_bill_vendor.vendor_name +
						"</option>";
					$("#pov_bill_id").append(options);
				});
				$("#pov_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadPOVBill();

	loadPaymentTerm = () => {
		$.ajax({
			url: apiURL + "payment_term/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#view_pov_payment_term").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.term_name +
						"</option>";
					$("#view_pov_payment_term").append(options);
				});
				$("#view_pov_payment_term").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	loadPaymentMethod = () => {
		$.ajax({
			url: apiURL + "payment_method/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#pov_payment_method_id").empty();
				$("#po_payment_method_id").empty();
				$("#view_pov_payment_method").empty();
				$("#view_po_payment_method").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.method_name +
						"</option>";
					$("#pov_payment_method_id").append(options);
					$("#po_payment_method_id").append(options);
					$("#view_pov_payment_method").append(options);
					$("#view_po_payment_method").append(options);
				});
				$("#pov_payment_method_id").trigger("change");
				$("#po_payment_method_id").trigger("change");
				$("#view_pov_payment_method").trigger("change");
				$("#view_po_payment_method").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadPaymentMethod();

	$("#pov_bill_id").change(function () {
		$.ajax({
			url:
				apiURL +
				"purchase_order_vendor_bill/find_purchase_order_vendor_bill/" +
				$("#pov_bill_id").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#product_total_bill").text(data.total_vendor_bill);
				$("#pov_bill_total_tax").text("0");
				$("#pov_bill_total_discount").text("0");
				$("#pov_total_bill").text(data.total_vendor_bill);
				$("#pov_payment_method_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	});

	$("#pov_payment_method_id").change(function () {
		var method = $("#pov_payment_method_id").select2("data");
		if (method[0].text == "Cash") {
			$(".pov_check_payment").hide();
			$(".pov_cash_payment").show();
			$("#pov_cash_tendered").attr("min", $("#pov_total_bill").text());
			$("#pov_cash_tendered").attr(
				"data-msg-min",
				"Cash tendered is not enough."
			);
			$("#pov_cash_tendered").keyup(function () {
				var change =
					$("#pov_cash_tendered").val() -
					parseFloat($("#pov_total_bill").text());
				if (change >= 0) {
					$("#pov_change").text(change);
				} else {
					$("#pov_change").text("0");
				}
			});
		} else if (method[0].text == "Check") {
			$(".pov_cash_payment").hide();
			$(".pov_check_payment").show();

			$("#pov_check_amount").attr("min", $("#pov_total_bill").text());
			$("#pov_check_amount").attr(
				"data-msg-min",
				"Check amount is not enough."
			);
			$("#pov_check_amount").attr("max", $("#pov_total_bill").text());
			$("#pov_check_amount").attr(
				"data-msg-max",
				"Check amount exceeded the required amount."
			);
		} else {
			$(".pov_cash_payment").hide();
			$(".pov_check_payment").hide();
		}
	});

	$("#pov_check_amount").change(function(){
		$('#pov_check_amount_in_words').moneyinwords($("#pov_check_amount").val().toLocaleString(),'PH','PHP');
		$('#pov_check_amount_in_words').text($('#pov_check_amount_in_words').text().toUpperCase())
	})

	$("#pov_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$("#modal_submit_confirmation").modal('show')
			$("#confirm_submit").on("click", function () {
				var method = $("#pov_payment_method_id").select2("data");
				if (method[0].text == "Cash") {
					$.ajax({
						url: apiURL + "purchase_order_vendor_payment/create_purchase_order_vendor_payment",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							purchase_order_vendor_bill_id: $("#pov_bill_id").val(),
							total_amount_paid: parseFloat($("#pov_total_bill").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#pov_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							hospital_cash_payment: {
								amount: parseFloat($("#pov_total_bill").text()),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success(data);
							console.log("cash payment")
							$("#pov_payment_form").validate().resetForm();
							$("#pov_payment_form")[0].reset();
							loadPOVPaymentTable();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				} else if (method[0].text == "Check") {
					$.ajax({
						url: apiURL + "purchase_order_vendor_payment/create_purchase_order_vendor_payment",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							purchase_order_vendor_bill_id: $("#pov_bill_id").val(),
							total_amount_paid: parseFloat($("#pov_total_bill").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#pov_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							hospital_check_payment: {
								check_no: $("#pov_check_no").val(),
								check_date: $("#pov_check_date").val(),
								account_name: $("#pov_account_name").val(),
								account_no: $("#pov_account_no").val(),
								rt_number: $("#pov_rt_number").val(),
								payee_name: $("#pov_payee_name").val(),
								amount: $("#pov_check_amount").val(),
								// amount_in_words: $("#pov_check_amount_in_words").val(),
								bank_name: $("#pov_bank_name").val(),
								bank_address: $("#pov_bank_address").val(),
								description: $("#pov_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success(data);
							console.log("print check")
							$("html, body").animate({ scrollTop: 0 }, "slow");
							$("#print_check_div").show();
							$("#print_check_no").text($("#pov_check_no").val())
							$("#print_check_date").text($("#pov_check_date").val())
							$("#print_payee_name").val($("#pov_payee_name").val())
							document.getElementById("print_payee_name").setAttribute("value", $("#pov_payee_name").val()); 
							$("#print_check_amount").val($("#pov_check_amount").val())
							document.getElementById("print_check_amount").setAttribute("value", $("#pov_check_amount").val());
							$("#print_amount_in_words").val($("#pov_check_amount_in_words").text())
							document.getElementById("print_amount_in_words").setAttribute("value",$('#pov_check_amount_in_words').text().toUpperCase());
							$("#print_bank_name").text($("#pov_bank_name").val())
							$("#print_bank_address").text($("#pov_bank_address").val())
							$("#print_description").val($("#pov_check_description").val())
							document.getElementById("print_description").setAttribute("value", $("#pov_check_description").val()); 
							$("#print_rt_number").text($("#pov_rt_number").val())
							$("#print_account_number").text($("#pov_account_no").val())
							$("#print_check_number1").text($("#pov_check_no").val())

							$("#pov_payment_form").validate().resetForm();
							$("#pov_payment_form")[0].reset();
							loadPOVPaymentTable();


							
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}
				$("#modal_submit_confirmation").modal('hide')
				$("#pov_form_div").hide()
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

	loadPOBill = () => {
		$.ajax({
			url: apiURL + "purchase_order_bill/find_all_pending",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#po_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.purchase_order_bill_no +
						" | " +
						dataOptions.order_bill_order_vendor_bill.order_vendor_bill_vendor.vendor_name +
						"</option>";
					$("#po_bill_id").append(options);
				});
				$("#po_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadPOBill();


	$("#po_payment_method_id").change(function () {
		var method = $("#po_payment_method_id").select2("data");
		if (method[0].text == "Cash") {
			$(".po_check_payment").hide();
			$(".po_cash_payment").show();
			$("#po_cash_tendered").attr("min", $("#td_po_total_amount").text());
			$("#po_cash_tendered").attr(
				"data-msg-min",
				"Cash tendered is not enough."
			);
			$("#po_cash_tendered").keyup(function () {
				var change =
					$("#po_cash_tendered").val() -
					parseFloat($("#td_po_total_amount").text());
				if (change >= 0) {
					$("#po_change").text(change);
				} else {
					$("#po_change").text("0");
				}
			});
		} else if (method[0].text == "Check") {
			$(".po_cash_payment").hide();
			$(".po_check_payment").show();

			$("#po_check_amount").attr("min", $("#td_po_total_amount").text());
			$("#po_check_amount").attr(
				"data-msg-min",
				"Check amount is not enough."
			);

			$("#po_check_amount").attr("max", $("#td_po_total_amount").text());
			$("#po_check_amount").attr(
				"data-msg-max",
				"Check amount exceeded the required amount."
			);
		} else {
			$(".po_cash_payment").hide();
			$(".po_check_payment").hide();
		}
	});

	$("#po_check_amount").change(function(){
		$('#po_check_amount_in_words').moneyinwords($("#po_check_amount").val().toLocaleString(),'PH','PHP');
		$('#po_check_amount_in_words').text($('#po_check_amount_in_words').text().toUpperCase())
	})

	$("#po_bill_id").change(function () {
		$.ajax({
			url:
				apiURL +
				"purchase_order_bill/" +
				$("#po_bill_id").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				
				$("#td_po_bill_no").text(data.purchase_order_bill_no);
				$("#td_po_date_of_billing").text(moment(data.created_at).format(
					"MMMM D, YYYY"
				));
				$("#td_po_product_amount").text(data.total_bill);
				$("#td_po_tax").text("0");
				$("#td_po_sub_total").text(data.total_bill);
				$("#td_po_total_amount").text(data.total_bill);
				
				$("#po_payment_method_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	});

	$("#po_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			$("#modal_submit_confirmation").modal('show')
			$("#confirm_submit").on("click", function () {
				var method = $("#po_payment_method_id").select2("data");
				if (method[0].text == "Cash") {
					$.ajax({
						url: apiURL + "purchase_order_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							purchase_order_bill_id: $("#po_bill_id").val(),
							amount_paid: parseFloat($("#td_po_total_amount").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#po_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							hospital_cash_payment: {
								amount: parseFloat($("#td_po_total_amount").text()),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success(data);
							$("#po_payment_form").validate().resetForm();
							$("#po_payment_form")[0].reset();
							loadPOPaymentTable();
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				} else if (method[0].text == "Check") {
					$.ajax({
						url: apiURL + "purchase_order_payment/create",
						type: "POST", // post, put, delete, get
						data: JSON.stringify({
							purchase_order_bill_id: $("#po_bill_id").val(),
							amount_paid: parseFloat($("#td_po_total_amount").text()),
							payment_term_id: $("#payment_term_id").val(),
							payment_method_id: $("#po_payment_method_id").val(),
							created_by: localStorage.USER_ID,
							hospital_check_payment: {
								check_no: $("#po_check_no").val(),
								check_date: $("#po_check_date").val(),
								account_name: $("#po_account_name").val(),
								account_no: $("#po_account_no").val(),
								rt_number: $("#po_rt_number").val(),
								payee_name: $("#po_payee_name").val(),
								amount: $("#po_check_amount").val(),
								//amount_in_words: $("#po_check_amount_in_words").val(),
								bank_name: $("#po_bank_name").val(),
								bank_address: $("#po_bank_address").val(),
								description: $("#po_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success(data);
							$("html, body").animate({ scrollTop: 0 }, "slow");
							$("#print_check_div").show();
							console.log("#@!#@!")
							$("#print_check_no").text($("#po_check_no").val())
							$("#print_check_date").text($("#po_check_date").val())
							$("#print_payee_name").val($("#po_payee_name").val())
							document.getElementById("print_payee_name").setAttribute("value", $("#po_payee_name").val()); 
							$("#print_check_amount").val($("#po_check_amount").val())
							document.getElementById("print_check_amount").setAttribute("value", $("#po_check_amount").val());
							$("#print_amount_in_words").val($("#po_check_amount_in_words").text())
							document.getElementById("print_amount_in_words").setAttribute("value",$('#po_check_amount_in_words').text().toUpperCase());
							$("#print_bank_name").text($("#po_bank_name").val())
							$("#print_bank_address").text($("#po_bank_address").val())
							$("#print_description").val($("#po_check_description").val())
							document.getElementById("print_description").setAttribute("value", $("#po_check_description").val()); 
							$("#print_rt_number").text($("#po_rt_number").val())
							$("#print_account_number").text($("#po_account_no").val())
							$("#print_check_number1").text($("#po_check_no").val())
							setTimeout(() => {
								$("#po_payment_form").validate().resetForm();
							$("#po_payment_form")[0].reset();
							}, 1000);
							
							loadPOPaymentTable();
							
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}
				$("#modal_submit_confirmation").modal('hide')
				$("#po_form_div").hide()
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

	$("#print_check_btn").printPreview({
		obj2print: "#print_check",
		width: "810",
	});

	loadViewPOVBill = () => {
		$.ajax({
			url: apiURL + "purchase_order_vendor_bill/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#view_pov_payment_pov_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.purchase_order_vendor_bill_no +
						" | " +
						dataOptions.order_vendor_bill_vendor.vendor_name +
						"</option>";
					$("#view_pov_payment_pov_bill_id").append(options);
				});
				$("#view_pov_payment_pov_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#view_pov_payment_term").on("change", function () {
		var term = $("#view_pov_payment_term").select2("data");
		var method = $("#view_pov_payment_method").select2("data");
		if (term[0].text == "Full Payment" && method[0].text == "Cash") {
			$(".view_pov_sub_payments").hide()
			$(".view_pov_payment_check_info").hide()
			$(".view_pov_payment_check_info :input").val('')
		} 
		else if (term[0].text == "Full Payment" && method[0].text == "Check") {
			$(".view_pov_sub_payments").hide()
			$(".view_pov_payment_check_info").show()

		}else if (term[0].text == "Partial Payment" && method[0].text == "Cash" ) {
			$(".view_pov_payment_check_info").hide()
			$(".view_pov_payment_check_info :input").val('')
		}
		else if (term[0].text == "Partial Payment" && method[0].text == "Check" ) {
			$(".view_pov_payment_check_info").hide()
			$(".view_pov_payment_check_info :input").val('')
		}
	})

	$("#view_pov_payment_method").on("change", function () {
		var term = $("#view_pov_payment_term").select2("data");
		var method = $("#view_pov_payment_method").select2("data");
		if (term[0].text == "Full Payment" && method[0].text == "Cash") {
			$(".view_pov_sub_payments").hide()
			$(".view_pov_payment_check_info").hide()
			$(".view_pov_payment_check_info :input").val('')
		} 
		else if (term[0].text == "Full Payment" && method[0].text == "Check") {
			$(".view_pov_sub_payments").hide()
			$(".view_pov_payment_check_info").show()

		}else if (term[0].text == "Partial Payment" && method[0].text == "Cash" ) {
			$(".view_pov_payment_check_info").hide()
			$(".view_pov_payment_check_info :input").val('')
		}
		else if (term[0].text == "Partial Payment" && method[0].text == "Check" ) {
			$(".view_pov_payment_check_info").hide()
			$(".view_pov_payment_check_info :input").val('')
		}
	})

	$("#view_pov_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var method2 = $("#view_pov_payment_method").select2("data");
			var term2 = $("#view_pov_payment_term").select2("data");
			if (method2[0].text == "Cash") {
				console.log("xxxx")
				$.ajax({
					url: apiURL + "purchase_order_vendor_payment/update_purchase_order_vendor_payment/"+ $("#edit_pov_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						purchase_order_vendor_bill_id: $("#view_pov_payment_pov_bill_id").val(),
						total_amount_paid: $("#view_pov_payment_amount_paid").val(),
						payment_term_id:$("#view_pov_payment_term").val(),
						payment_method_id: $("#view_pov_payment_method").val(),
						date_of_payment: $("#view_pov_payment_payment_date").val(),
						status:$("#view_pov_payment_status").val(),
						updated_by: localStorage.USER_ID,
						hospital_check_payment_id:$("#edit_pov_hospital_check_payment_id").val(),
						hospital_cash_payment_id:$("#edit_pov_hospital_cash_payment_id").val(),
						hospital_cash_payment: {
							amount: $("#view_pov_payment_amount_paid").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("POV payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if (method2[0].text == "Check") {
				console.log("xxcccc")
				if (term2[0].text == 'Partial Payment'){
					$.ajax({
						url: apiURL + "purchase_order_vendor_payment/update_purchase_order_vendor_payment/"+ $("#edit_pov_payment_uuid").val(),
						type: "PUT", // post, put, delete, get
						data: JSON.stringify({
							purchase_order_vendor_bill_id: $("#view_pov_payment_pov_bill_id").val(),
							total_amount_paid: $("#view_pov_payment_amount_paid").val(),
							payment_term_id:$("#view_pov_payment_term").val(),
							payment_method_id: $("#view_pov_payment_method").val(),
							date_of_payment: $("#view_pov_payment_payment_date").val(),
							status:$("#view_pov_payment_status").val(),
							updated_by: localStorage.USER_ID,
							hospital_check_payment_id:$("#edit_pov_hospital_check_payment_id").val(),
							hospital_cash_payment_id:$("#edit_pov_hospital_cash_payment_id").val(),
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("POV payment has been updated.");
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}else{
					$.ajax({
						url: apiURL + "purchase_order_vendor_payment/update_purchase_order_vendor_payment/"+ $("#edit_pov_payment_uuid").val(),
						type: "PUT", // post, put, delete, get
						data: JSON.stringify({
							purchase_order_vendor_bill_id: $("#view_pov_payment_pov_bill_id").val(),
							total_amount_paid: $("#view_pov_payment_amount_paid").val(),
							payment_term_id:$("#view_pov_payment_term").val(),
							payment_method_id: $("#view_pov_payment_method").val(),
							date_of_payment: $("#view_pov_payment_payment_date").val(),
							status:$("#view_pov_payment_status").val(),
							updated_by: localStorage.USER_ID,
							hospital_check_payment_id:$("#edit_pov_hospital_check_payment_id").val(),
							hospital_cash_payment_id:$("#edit_pov_hospital_cash_payment_id").val(),
							hospital_check_payment: {
								check_no: $("#view_pov_payment_check_no").val(),
								check_date: $("#view_pov_payment_check_date").val(),
								account_name: $("#view_pov_payment_acc_name").val(),
								account_no: $("#view_pov_payment_acc_no").val(),
								rt_number: $("#view_pov_payment_rt_number").val(),
								payee_name: $("#view_pov_payment_payee_name").val(),
								amount: $("#view_pov_payment_check_amount").val(),
								//amount_in_words: $("#view_pov_payment_check_amount_in_words").val(),
								bank_name: $("#view_pov_payment_bank_name").val(),
								bank_address: $("#view_pov_payment_bank_address").val(),
								description: $("#view_pov_payment_check_description").val(),
								created_by: localStorage.USER_ID,
							},
						}),
						dataType: "json",
						contentType: "application/json",
						success: function (data) {
							toastr.success("POV payment has been updated.");
						},
						error: function (data) {
							toastr.error(data.responseJSON.detail);
						},
					});
				}
				
			}
			setTimeout(() => {
				loadPOVPaymentTable();
				$("#view_pov_payment_div").hide()
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


	viewPOVPayment = (id, type) => {
		$.ajax({
			url: apiURL + "purchase_order_vendor_payment/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				console.log(data)
			  	$("html, body").animate({ scrollTop: 0 }, "slow");
				$("#view_pov_payment_div").show()
				$("#edit_pov_payment_uuid").val(data.id)
				$("#view_pov_payment_or").text(data.or_no)
				$("#view_pov_payment_amount_paid").val(data.total_amount_paid)
				$("#view_pov_payment_payment_date").val(data.created_at)
				$("#view_pov_payment_status").val(data.status)
				loadViewPOVBill()
				loadPaymentTerm()
				loadPaymentMethod()
				setTimeout(() => {
					$("#view_pov_payment_pov_bill_id").val(data.order_vendor_payment_order_vendor_bill.id)
					$("#view_pov_payment_pov_bill_id").trigger("change")
					$("#view_pov_payment_method").val(data.order_vendor_payment_method.id)
					$("#view_pov_payment_method").trigger("change")
					$("#view_pov_payment_term").val(data.order_vendor_payment_payment_term.id)
					$("#view_pov_payment_term").trigger("change")
				}, 1000);
				
				if (data.order_vendor_payment_payment_term.term_name == 'Full Payment') {
					
					$(".view_pov_sub_payments").hide()
	
					if (data.order_vendor_payment_method.method_name == 'Cash') {
						$("#edit_pov_hospital_cash_payment_id").val(data.hospital_cash_payment_id)
						$(".view_pov_payment_check_info").hide()	
						
						console.log(data.order_vendor_payment_hospital_cash.id)
						console.log(data.order_vendor_payment_hospital_cash.amount)
					}else if (data.order_vendor_payment_method.method_name == 'Check') {
						$("#edit_pov_hospital_check_payment_id").val(data.hospital_check_payment_id)
						setTimeout(() => {
						$(".view_pov_payment_check_info").show()
						$("#view_pov_payment_bank_name").val(data.order_vendor_payment_hospital_check.bank_name)
						$("#view_pov_payment_bank_address").val(data.order_vendor_payment_hospital_check.bank_address)
						$("#view_pov_payment_check_no").val(data.order_vendor_payment_hospital_check.check_no)
						$("#view_pov_payment_check_date").val(data.order_vendor_payment_hospital_check.check_date)
						//$("#view_pov_payment_bank_name").val(data.order_vendor_payment_hospital_check.id)
						$("#view_pov_payment_acc_name").val(data.order_vendor_payment_hospital_check.account_name)
						$("#view_pov_payment_acc_no").val(data.order_vendor_payment_hospital_check.account_no)
						$("#view_pov_payment_rt_number").val(data.order_vendor_payment_hospital_check.rt_number)
						$("#view_pov_payment_check_amount").val(data.order_vendor_payment_hospital_check.amount)
						$("#view_pov_payment_check_description").val(data.order_vendor_payment_hospital_check.description)
						$("#view_pov_payment_payee_name").val(data.order_vendor_payment_hospital_check.payee_name)
						$("#view_pov_payment_check_status").val(data.order_vendor_payment_hospital_check.check_status)
						}, 1000);
					}
					
				}else if (data.order_vendor_payment_payment_term.term_name == 'Partial Payment') {
					
					$(".view_pov_payment_check_info").hide()
					$(".view_pov_sub_payments").show()
					$("#view_sub_po_payment_table tbody").empty()	
					$(".view_sub_po_payment").show()
					
					$.each(data.order_vendor_payment_order_vendor_bill.order_vendor_bill_order_bill, function (i, orderBillData) {
							$.each(orderBillData.order_bill_order_payment, function (i, orderPaymentData) {
								console.log(orderPaymentData)
								$("#view_sub_po_payment_table")
									.find("tbody")
									.append(
										"<tr>" +
											"<td>"+ orderPaymentData.or_no +"</td>" +
											"<td>"+ orderPaymentData.purchase_order_bill_id +"</td>" +
											"<td class='text-right'>₱"+ orderPaymentData.amount_paid.toLocaleString() +"</td>" +
											"<td>"+ moment(orderPaymentData.date_of_payment).format("MMMM D, YYYY") +"</td>" +
											"<td>"+ orderPaymentData.order_payment_method.method_name +"</td>"+
										"</tr>"
									);
							})
							
						
					})
				}
			  
			},
			error: function (data) {
			  toastr.error(data.responseJSON.detail);
			},
		  });

		  if (type == 0) {
			$("#cancel_edit_pov_payment_button").text("Close")
			$("#view_pov_payment_form :input").prop("disabled", true);
			$("#cancel_edit_pov_payment_button").prop("disabled", false);
			$("#edit_pov_payment_button").hide()

		}else if (type == 1) {
			$("#cancel_edit_pov_payment_button").text("Cancel")
			$("#view_pov_payment_form :input").prop("disabled", false);
			$("#edit_pov_payment_button").show()
			setTimeout(() => {
				$(".view_pov_sub_payments").hide()
			}, 1000);
			
		}
	}


	$("#view_po_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var method = $("#view_po_payment_method").select2("data");
			if (method[0].text == "Cash") {
				$.ajax({
					url: apiURL + "purchase_order_payment/update/"+ $("#edit_po_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						purchase_order_bill_id: $("#view_po_payment_po_bill_id").val(),
						amount_paid: $("#view_po_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_po_payment_method").val(),
						date_of_payment: $("#view_po_payment_payment_date").val(),
						status:$("#view_po_payment_status").val(),
						updated_by: localStorage.USER_ID,
						hospital_check_payment_id:$("#edit_po_hospital_check_payment_id").val(),
						hospital_cash_payment_id:$("#edit_po_hospital_cash_payment_id").val(),
						hospital_cash_payment: {
							amount: $("#view_po_payment_amount_paid").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("PO payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if (method[0].text == "Check") {
				$.ajax({
					url: apiURL + "purchase_order_payment/update/"+ $("#edit_po_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						purchase_order_bill_id: $("#view_po_payment_po_bill_id").val(),
						amount_paid: $("#view_po_payment_amount_paid").val(),
						payment_term_id:"",
						payment_method_id: $("#view_po_payment_method").val(),
						date_of_payment: $("#view_po_payment_payment_date").val(),
						status:$("#view_po_payment_status").val(),
						updated_by: localStorage.USER_ID,
						hospital_check_payment_id:$("#edit_po_hospital_check_payment_id").val(),
						hospital_cash_payment_id:$("#edit_po_hospital_cash_payment_id").val(),
						hospital_check_payment: {
							check_no: $("#view_po_payment_check_no").val(),
							check_date: $("#view_po_payment_check_date").val(),
							account_name: $("#view_po_payment_acc_name").val(),
							account_no: $("#view_po_payment_acc_no").val(),
							rt_number: $("#view_po_payment_rt_number").val(),
							payee_name: $("#view_po_payment_payee_name").val(),
							amount: $("#view_po_payment_check_amount").val(),
							//amount_in_words: $("#view_po_payment_check_amount_in_words").val(),
							bank_name: $("#view_po_payment_bank_name").val(),
							bank_address: $("#view_po_payment_bank_address").val(),
							description: $("#view_po_payment_check_description").val(),
							created_by: localStorage.USER_ID,
						},
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("PO payment has been updated.");
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			}
			setTimeout(() => {
				loadPOPaymentTable();
				$("#view_po_payment_div").hide()
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


	loadViewPOBill = () => {
		$.ajax({
			url: apiURL + "purchase_order_bill/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#view_po_payment_po_bill_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.purchase_order_bill_no +
						" | " +
						dataOptions.order_bill_order_vendor_bill.order_vendor_bill_vendor.vendor_name +
						"</option>";
					$("#view_po_payment_po_bill_id").append(options);
				});
				$("#view_po_payment_po_bill_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};

	$("#view_po_payment_method").on("change", function () {
		var method = $("#view_po_payment_method").select2("data");
		if (method[0].text == "Cash") {
			$(".view_po_payment_check_info").hide()
			$(".view_po_payment_check_info :input").val('')
		} if (method[0].text == "Check") {
			$(".view_po_payment_check_info").show()
		}
	})

	viewPOPayment = (id, type) => {
		$.ajax({
			url: apiURL + "purchase_order_payment/find_one/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				console.log(data)
			  	$("html, body").animate({ scrollTop: 0 }, "slow");
				$("#view_po_payment_div").show()
				$("#edit_po_payment_uuid").val(data.id)
				$("#view_po_payment_or").text(data.or_no)
				$("#view_po_payment_amount_paid").val(data.amount_paid)
				$("#view_po_payment_payment_date").val(data.date_of_payment)
				$("#view_po_payment_status").val(data.status)
				loadViewPOBill()
				loadPaymentMethod()
				setTimeout(() => {
					$("#view_po_payment_po_bill_id").val(data.purchase_order_bill_id)
					$("#view_po_payment_po_bill_id").trigger("change")
					$("#view_po_payment_method").val(data.payment_method_id)
					$("#view_po_payment_method").trigger("change")
				}, 1000);
				
				if (data.order_payment_method.method_name == 'Cash') {
					$("#edit_po_hospital_cash_payment_id").val(data.hospital_cash_payment_id)
					$(".view_po_payment_check_info").hide()	
					
					console.log(data.order_payment_hospital_cash.id)
					console.log(data.order_payment_hospital_cash.amount)
				}else if (data.order_payment_method.method_name == 'Check') {
					$("#edit_po_hospital_check_payment_id").val(data.hospital_check_payment_id)
					$(".view_po_payment_check_info").show()
					$("#view_po_payment_bank_name").val(data.order_payment_hospital_check.bank_name)
					$("#view_po_payment_bank_address").val(data.order_payment_hospital_check.bank_address)
					$("#view_po_payment_check_no").val(data.order_payment_hospital_check.check_no)
					$("#view_po_payment_check_date").val(data.order_payment_hospital_check.check_date)
					//$("#view_po_payment_bank_name").val(data.order_payment_hospital_check.id)
					$("#view_po_payment_acc_name").val(data.order_payment_hospital_check.account_name)
					$("#view_po_payment_acc_no").val(data.order_payment_hospital_check.account_no)
					$("#view_po_payment_rt_number").val(data.order_payment_hospital_check.rt_number)
					$("#view_po_payment_check_amount").val(data.order_payment_hospital_check.amount)
					$("#view_po_payment_check_description").val(data.order_payment_hospital_check.description)
					$("#view_po_payment_payee_name").val(data.order_payment_hospital_check.payee_name)
					$("#view_po_payment_check_status").val(data.order_payment_hospital_check.check_status)
				}
			  
			},
			error: function (data) {
			  toastr.error(data.responseJSON.detail);
			},
		  });

		if (type == 0) {
			$("#cancel_edit_po_payment_button").text("Close")
			$("#view_po_payment_form :input").prop("disabled", true);
			$("#cancel_edit_po_payment_button").prop("disabled", false);
			$("#edit_po_payment_button").hide()
		}else if (type == 1) {
			$("#cancel_edit_po_payment_button").text("Cancel")
			$("#view_po_payment_form :input").prop("disabled", false);
			$("#edit_po_payment_button").show()
		} 
	}



	viewORPrintcheck = (id,type) =>{
		if(type ==  0){
			$.ajax({
				url: apiURL + "purchase_order_vendor_payment/"+id,
				dataSrc: "",
				type: "GET",
				success: function (data) {
					if (data.order_vendor_payment_hospital_check != null) {
						$("html, body").animate({ scrollTop: 0 }, "slow");
						$("#print_check_div").show();
							$("#print_check_no").text(data.order_vendor_payment_hospital_check.check_no)
							$("#print_check_date").text(data.order_vendor_payment_hospital_check.check_date)
							$("#print_payee_name").val(data.order_vendor_payment_hospital_check.payee_name)
							document.getElementById("print_payee_name").setAttribute("value", data.order_vendor_payment_hospital_check.payee_name); 
							$("#print_check_amount").val(data.order_vendor_payment_hospital_check.amount)
							document.getElementById("print_check_amount").setAttribute("value",data.order_vendor_payment_hospital_check.amount);
							$('#pov_check_amount_in_words').moneyinwords(data.order_vendor_payment_hospital_check.amount,'PH','PHP');
							$('#pov_check_amount_in_words').text($('#pov_check_amount_in_words').text().toUpperCase())
							$("#print_amount_in_words").val($("#pov_check_amount_in_words").text())
							document.getElementById("print_amount_in_words").setAttribute("value",$('#pov_check_amount_in_words').text().toUpperCase());
							$("#print_bank_name").text(data.order_vendor_payment_hospital_check.bank_name)
							$("#print_bank_address").text(data.order_vendor_payment_hospital_check.bank_address)
							$("#print_description").val(data.order_vendor_payment_hospital_check.description)
							document.getElementById("print_description").setAttribute("value", data.order_vendor_payment_hospital_check.description); 
							$("#print_rt_number").text(data.order_vendor_payment_hospital_check.rt_number)
							$("#print_account_number").text(data.order_vendor_payment_hospital_check.account_no)
							$("#print_check_number1").text(data.order_vendor_payment_hospital_check.check_no)
					} else {
						toastr.error("Check payment is not available.");
					}
				},
				error: function ({ responseJSON }) {
					// toastr.error(data.responseJSON.detail);
				},
			});
		}else{
			$.ajax({
				url: apiURL + "purchase_order_payment/find_one/"+id,
				dataSrc: "",
				type: "GET",
				success: function (data) {
					if (data.order_payment_hospital_check != null) {
						$("html, body").animate({ scrollTop: 0 }, "slow");
						$("#print_check_div").show();
							$("#print_check_no").text(data.order_payment_hospital_check.check_no)
							$("#print_check_date").text(data.order_payment_hospital_check.check_date)
							$("#print_payee_name").val(data.order_payment_hospital_check.payee_name)
							document.getElementById("print_payee_name").setAttribute("value", data.order_payment_hospital_check.payee_name); 
							$("#print_check_amount").val(data.order_payment_hospital_check.amount)
							document.getElementById("print_check_amount").setAttribute("value",data.order_payment_hospital_check.amount);
							$('#po_check_amount_in_words').moneyinwords(data.order_payment_hospital_check.amount,'PH','PHP');
							$('#po_check_amount_in_words').text($('#po_check_amount_in_words').text().toUpperCase())
							$("#print_amount_in_words").val($("#po_check_amount_in_words").text())
							document.getElementById("print_amount_in_words").setAttribute("value",$('#po_check_amount_in_words').text().toUpperCase());
							$("#print_bank_name").text(data.order_payment_hospital_check.bank_name)
							$("#print_bank_address").text(data.order_payment_hospital_check.bank_address)
							$("#print_description").val(data.order_payment_hospital_check.description)
							document.getElementById("print_description").setAttribute("value", data.order_payment_hospital_check.description); 
							$("#print_rt_number").text(data.order_payment_hospital_check.rt_number)
							$("#print_account_number").text(data.order_payment_hospital_check.account_no)
							$("#print_check_number1").text(data.order_payment_hospital_check.check_no)
					} else {
						toastr.error("Check payment is not available.");
					}
				},
				error: function ({ responseJSON }) {
					// toastr.error(data.responseJSON.detail);
				},
			});
		}
	}
});
