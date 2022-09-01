$(document).ready(function () {
	//PATIENT BILLS DATATABLE
	// DataTable
	loadPatientBillingTable = () => {
		$("#patient_bills_table").dataTable().fnClearTable();
		$("#patient_bills_table").dataTable().fnDraw();
		$("#patient_bills_table").dataTable().fnDestroy();
		$("#patient_bills_table").dataTable({
			fixedHeader: true,
			orderCellsTop: true,
			responsive: true,
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
					data: "invoice_no",
					name: "invoice_no",

					searchable: true,
				},
				{
					data: "patient_id",
					name: "patient_id",
					searchable: true,
				},
				{
					data: "amount",
					// render: function (aData, type, row) {
					// 	let amount = "";

					// 	amount += "$" + aData.amount.toLocaleString();

					// 	return amount;
					// },
					render: function (aData, type) {
						var number = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return number;
					},
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let date_of_billing = "";
						date_of_billing +=
							moment(aData.date_of_billing).format("MMMM D, YYYY") 
						return date_of_billing;
					},
					searchable: true,
				},
				{
					data: null,
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

						if (aData.status == "Pending") {
							status +=
								'<span class="badge badge-info p-2 w-100"><i class="fas fa-clock mr-1"></i></i>Pending</span>';
						} else if (aData.status == "Incomplete") {
							status +=
								'<span class="badge badge-warning p-2 w-100"><i class="fas fa-times mr-1"></i>Incomplete</span>';
						} else if (aData.status == "Paid") {
							status +=
								'<span class="badge badge-success p-2 w-100"><i class="fas fa-check mr-1"></i>Paid</span>';
						} else if (aData.status == "Inactive") {
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
							"<div>View Patient Bill</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 text-info"></i>' +
								"</div>" +
								"<div>Edit Patient Bill</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" ' +
								"onClick=\"return deleteData('" +
								aData["id"] +
								"')\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-trash-alt mr-1 text-danger"></i>' +
								"</div>" +
								"<div>Delete Patient Bill</div>" +
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
				url: apiURL + "patient_billing/datatable",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				// let amount = "";

				// amount += "$" + aData.amount.toLocaleString();
				var number = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.amount);

				let date_of_billing = "";
				date_of_billing +=
					moment(aData.date_of_billing).format("MMMM D, YYYY") 

				let due_date = "";
				due_date += moment(aData.due_date).format("MMMM D, YYYY");

				let status = "";
				if (aData.status == "Pending") {
					status +=
						'<span class="badge badge-info p-2 w-100"><i class="fas fa-clock mr-1"></i></i>Pending</span>';
				} else if (aData.status == "Incomplete") {
					status +=
						'<span class="badge badge-warning p-2 w-100"><i class="fas fa-times mr-1"></i>Incomplete</span>';
				} else if (aData.status == "Paid") {
					status +=
						'<span class="badge badge-success p-2 w-100"><i class="fas fa-check mr-1"></i>Paid</span>';
				} else if (aData.status == "Inactive") {
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
					"<div>View Patient Bill</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 text-info"></i>' +
						"</div>" +
						"<div>Edit Patient Bill</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" ' +
						"onClick=\"return deleteData('" +
						aData["id"] +
						"')\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-trash-alt mr-1 text-danger"></i>' +
						"</div>" +
						"<div>Delete Patient Bill</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["invoice_no"]);
				$("td:eq(1)", nRow).html(aData["patient_id"]);
				$("td:eq(2)", nRow).html(number);
				$("td:eq(3)", nRow).html(date_of_billing);
				$("td:eq(4)", nRow).html(due_date);
				$("td:eq(5)", nRow).html(status);
				$("td:eq(6)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
			// initComplete: function () {
			// 	var api = this.api();

			// 	// For each column
			// 	api
			// 		.columns()
			// 		.eq(0)
			// 		.each(function (colIdx) {
			// 			// Set the header cell to contain the input element
			// 			if (colIdx != 6) {
			// 				var cell = $(".filters th").eq(
			// 					$(api.column(colIdx).header()).index()
			// 				);
			// 				var title = $(cell).text();
			// 				$(cell).html(
			// 					'<input class="form-control" type="text" placeholder="' +
			// 						title +
			// 						'" />'
			// 				);

			// 				// On every keypress in this input
			// 				$(
			// 					"input",
			// 					$(".filters th").eq($(api.column(colIdx).header()).index())
			// 				)
			// 					.off("keyup change")
			// 					.on("keyup change", function (e) {
			// 						e.stopPropagation();

			// 						// Get the search value
			// 						$(this).attr("title", $(this).val());
			// 						var regexr = "({search})"; //$(this).parents('th').find('select').val();

			// 						var cursorPosition = this.selectionStart;
			// 						// Search the column for that value
			// 						api
			// 							.column(colIdx)
			// 							.search(
			// 								this.value != ""
			// 									? regexr.replace("{search}", "(((" + this.value + ")))")
			// 									: "",
			// 								this.value != "",
			// 								this.value == ""
			// 							)
			// 							.draw();

			// 						$(this)
			// 							.focus()[0]
			// 							.setSelectionRange(cursorPosition, cursorPosition);
			// 					});
			// 			}
			// 		});
			// },
			initComplete: function () {
				var api = this.api();
				api.$('td:not(:last-child)').click( function () {
					api.search( this.innerText ).draw();
				} );
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

				// Total over all pages
				total = api
					.column(2)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total over this page
				pageTotal = api
					.column(2, { page: "current" })
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(0).footer()).html(
					"Page Total Bill: <b>₱" +
						pageTotal.toLocaleString() +
						"</b><br> Total Bill:  <b>₱" +
						total.toLocaleString() + "</b>"
				);
			},
		});
	};
	loadPatientBillingTable();

	// DataTable
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
					data: "or_no",
					name: "or_no",
					searchable: true,
				},
				{
					data: "inpatient_billing_info.invoice_no",
					searchable: true,
				},
				{
					data: "remaining_balance",
					render: function (aData, type, row) {
						let remaining_balance = "";
						remaining_balance = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return remaining_balance;
					},

					searchable: true,
				},
				{
					data: "amount",
					render: function (aData, type, row) {
						let amount = "";
						//FIXME OR separate amounts in table
						amount = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return amount;
					},

					searchable: true,
				},
				{
					data: "check_amount",
					render: function (aData, type, row) {
						let check_amount = "";
						check_amount = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return check_amount;
					},

					searchable: true,
				},
				{
					data: "online_payment_amount",
					render: function (aData, type, row) {
						let online_payment_amount = "";
						online_payment_amount = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return online_payment_amount;
					},

					searchable: true,
				},
				{
					data: "created_at",
					render: function (aData, type, row) {
						let date_of_payment = "";
						date_of_payment +=
							moment(aData).format("MMMM D, YYYY") 
						return date_of_payment;
					},
					searchable: true,
				},
				{
					data: "payment_payment_method.method_name",
					name: "payment_payment_method.method_name",
					searchable: true,
				},
				{
					data: "payment_payment_term.term_name",
					name: "payment_payment_term.term_name",
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
							"<div>View Patient Payment</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 text-info"></i>' +
								"</div>" +
								"<div>Edit Patient Payment</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
								aData["id"] +
								"','print')\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 text-info"></i>' +
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
				url: apiURL + "patient_payment/datatable/inpatient",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {

				let remaining_balance = "";

				remaining_balance = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.remaining_balance);

				let amount = "";

				amount = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(
						aData.amount
					);
			
				let check_amount = "";

				check_amount = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(
						aData.check_amount
					);
				
				let online_payment_amount = "";

				online_payment_amount = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(
						aData.online_payment_amount
					);

				let date_of_payment = "";
				date_of_payment +=
					moment(aData.created_at).format("MMMM D, YYYY") 

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
					"<div>View Patient Payment</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 text-info"></i>' +
						"</div>" +
						"<div>Edit Patient Payment</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
						aData["id"] +
						"','print')\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 text-info"></i>' +
						"</div>" +
						"<div>Print Receipt</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(aData["inpatient_billing_info.invoice_no"]);
				$("td:eq(2)", nRow).html(remaining_balance);
				$("td:eq(3)", nRow).html(amount);
				$("td:eq(4)", nRow).html(check_amount);
				$("td:eq(5)", nRow).html(online_payment_amount);
				$("td:eq(6)", nRow).html(date_of_payment);
				$("td:eq(7)", nRow).html(aData["payment_payment_method.method_name"]);
				$("td:eq(8)", nRow).html(aData["payment_payment_term.term_name"]);
				$("td:eq(9)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
			initComplete: function () {
				var api = this.api();
				api.$('td:not(:last-child)').click( function () {
					api.search( this.innerHTML ).draw();
				} );
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
				total_cash = api
					.column(3)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				page_total_cash = api
					.column(3, { page: "current" })
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				//check
				total_check = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				page_total_check = api
					.column(4, { page: "current" })
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				//online
				total_online = api
					.column(5)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				page_total_online = api
					.column(5, { page: "current" })
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
		
				//total
				total_page_payment = page_total_cash + page_total_check + page_total_online
				total_payment = total_cash + total_check + total_online
				$(api.column(0).footer()).html(
					"Page Cash: <b>₱" +
						page_total_cash.toLocaleString() +
						"</b>  (Total Cash:  <b>₱" +
						total_cash.toLocaleString() +
					"</b>)<br> Page Check: <b>₱" +
						page_total_check.toLocaleString() +
						"</b>  (Total Check:  <b>₱" +
						total_check.toLocaleString() +
					"</b>)<br> Page Online Payment: <b>₱" +
						page_total_check.toLocaleString() +
						"</b>  (Total Online Payment:  <b>₱" +
						total_check.toLocaleString() +
					"</b>)<br> Page Total Payment: <b>₱" +
					total_page_payment.toLocaleString() +
						"</b>  (Total Payment: <b>₱" +
						total_payment.toLocaleString() + "</b>)"
				);

			},
		});
	};
	loadInpatientPaymentTable();

	loadOutpatientPaymentTable = () => {
		$("#outpatient_payments_table").dataTable().fnClearTable();
		$("#outpatient_payments_table").dataTable().fnDraw();
		$("#outpatient_payments_table").dataTable().fnDestroy();
		$("#outpatient_payments_table").dataTable({
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
					data: "or_no",
					name: "or_no",
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let invoice = "";

						if (aData.inpatient_billing_info == null) {
							invoice += "<i>No invoice no.</i>";
						} else {
							invoice += aData.inpatient_billing_info.invoice_no;
						}

						return invoice;
					},
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let patient = "";

						if (aData.inpatient_billing_info == null) {
							patient += "<i>No patient name</i>";
						} else {
							patient +=
								aData.inpatient_billing_info.billing_inpatient_info
									.patient_name;
						}

						return patient;
					},
					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let total_bill = "";

						if (aData.inpatient_billing_info == null) {
							total_bill += "<i>No total bill</i>";
						} else {
							total_bill += "₱ " + aData.inpatient_billing_info.amount;
						}

						return total_bill;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let amount = "";

						amount +=
							"₱ " +
							(
								aData.check_amount +
								aData.amount +
								aData.online_payment_amount
							).toLocaleString();

						return amount;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let date_of_payment = "";
						date_of_payment +=
							moment(aData.created_at).format("MMMM D, YYYY") 
						return date_of_payment;
					},
					searchable: true,
				},
				{
					data: "payment_payment_method.method_name",
					name: "payment_payment_method.method_name",
					searchable: true,
				},
				{
					data: "payment_payment_term.term_name",
					name: "payment_payment_term.term_name",
					searchable: true,
				},
				// {
				// 	data: null,
				// 	render: function (aData, type, row) {
				// 		let status = "";

				// 		if (aData.status != "Inactive") {
				// 			status +=
				// 				'<span class="badge badge-success p-2 w-100">Active</span>';
				// 		} else {
				// 			status +=
				// 				'<span class="badge badge-danger p-2 w-100">Inactive</span>';
				// 		}
				// 		return status;
				// 	},

				// 	searchable: true,
				// },
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
							"<div>View Patient Payment</div>" +
							"</div>";
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 text-info"></i>' +
								"</div>" +
								"<div>Edit Patient Payment</div>" +
								"</div>";
						}
						if (aData.status != "Inactive") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
								aData["id"] +
								"','print')\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-print mr-1 text-info"></i>' +
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
				url: apiURL + "patient_payment/datatable/outpatient",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				let invoice = "";

				if (aData.inpatient_billing_info == null) {
					invoice += "<i>No invoice no.</i>";
				} else {
					invoice += aData.inpatient_billing_info.invoice_no;
				}
				let patient = "";

				if (aData.inpatient_billing_info == null) {
					patient += "<i>No patient name</i>";
				} else {
					patient +=
						aData.inpatient_billing_info.billing_inpatient_info.patient_name;
				}

				let total_bill = "";

				if (aData.inpatient_billing_info == null) {
					total_bill += "<i>No total bill</i>";
				} else {
					total_bill += "₱ " + aData.inpatient_billing_info.amount;
				}

				let amount = "";

				amount +=
					"₱ " +
					(
						aData.check_amount +
						aData.amount +
						aData.online_payment_amount
					).toLocaleString();

				let date_of_payment = "";
				date_of_payment +=
					moment(aData.created_at).format("MMMM D, YYYY") 

				// let status = "";
				// if (aData.status != "Inactive") {
				// 	status += '<span class="badge badge-success p-2 w-100">Active</span>';
				// } else {
				// 	status +=
				// 		'<span class="badge badge-danger p-2 w-100">Inactive</span>';
				// }

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
					"<div>View Patient Payment</div>" +
					"</div>";
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
						aData["id"] +
						"',1)\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-edit mr-1 text-info"></i>' +
						"</div>" +
						"<div>Edit Patient Payment</div>" +
						"</div>";
				}
				if (aData.status != "Inactive") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
						aData["id"] +
						"','print')\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-print mr-1 text-info"></i>' +
						"</div>" +
						"<div>Print Receipt</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";

				$("td:eq(0)", nRow).html(aData["or_no"]);
				$("td:eq(1)", nRow).html(invoice);
				$("td:eq(2)", nRow).html(patient);
				$("td:eq(3)", nRow).html(total_bill);
				$("td:eq(4)", nRow).html(amount);
				$("td:eq(5)", nRow).html(date_of_payment);
				$("td:eq(6)", nRow).html(aData["payment_payment_method.method_name"]);
				$("td:eq(7)", nRow).html(aData["payment_payment_term.term_name"]);
				// $("td:eq(6)", nRow).html(status);
				$("td:eq(8)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
		});
	};
	loadOutpatientPaymentTable();

	$(window).resize(function () {
		$("table.dataTable").resize();
	});

	//New Data
	$("#new_record").on("click", function () {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		$("#div_view_patient_payment").hide();
		$("#div_form").show();
		//$("#cash_tendered")[0].click();
		// loadInvoice();
		// loadPatient();
		// loadPaymentMethod();
		// loadPaymentTerm();
	});

	//hidecard
	hidePaymentCard = () => {
		$("#div_form").hide();
	};
	hideViewPaymentCard = () => {
		$("#div_view_patient_payment").hide();
	};

	loadInvoice = () => {
		$.ajax({
			url: apiURL + "patient_billing/find_all_not_paid",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#invoice_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.invoice_no +
						"</option>";
					$("#invoice_id").append(options);
				});
				$("#invoice_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadInvoice();

	loadAllInvoice = () => {
		$.ajax({
			url: apiURL + "patient_billing/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#edit_invoice_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.invoice_no +
						"</option>";
					$("#edit_invoice_id").append(options);
				});
				$("#edit_invoice_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadAllInvoice();

	$("#invoice_id").change(function () {
		// $("#uuidReservation").val($("#invoice_id").val());
		if ($("#invoice_id").val() != "") {
			$.ajax({
				url: apiURL + "patient_billing/" + $("#invoice_id").val(),
				dataSrc: "",
				type: "GET",
				dataType: "json",
				success: function (data) {
					$("#amount_to_paid").val(data.total_due);
					$("#check_amount").attr("max", $("#amount_to_paid").val());
					$("#online_payment_amount").attr("max", $("#amount_to_paid").val());
				},
				error: function ({ responseJSON }) {},
			});
		} else {
			$("#amount_to_paid").val("0");
		}
	});

	$("#payment_term_id").change(function () {
		// $("#uuidReservation").val($("#invoice_id").val());
		$.ajax({
			url: apiURL + "payment_term/" + $("#payment_term_id").val(),
			dataSrc: "",
			type: "GET",
			dataType: "json",
			success: function (data) {
				if (data.term_name == "Partial Payment") {
					$("#cash_tendered").attr("min", 1);
					$("#check_amount").attr("min", 1);
					$("#check_amount").attr("max", $("#amount_to_paid").val());
					$("#online_payment_amount").attr("min", 1);
					$("#online_payment_amount").attr("max", $("#amount_to_paid").val());
				} else if (data.term_name == "Full Payment") {
					$("#cash_tendered").attr("min", $("#amount_to_paid").val());
					$("#cash_tendered").attr(
						"data-msg-min",
						"Cash tendered is not enough."
					);
					$("#check_amount").attr("min", $("#amount_to_paid").val());
					$("#check_amount").attr(
						"data-msg-min",
						"Check amount is not enough."
					);
					$("#online_payment_amount").attr("min", $("#amount_to_paid").val());
					$("#online_payment_amount").attr(
						"data-msg-min",
						"Online payment amount is not enough."
					);
				}
			},
			error: function ({ responseJSON }) {},
		});
	});

	//compute change
	$("#cash_tendered").keyup(function () {
		var change = $("#cash_tendered").val() - $("#amount_to_paid").val();
		if (change >= 0) {
			$("#change").val(change);
		} else {
			$("#change").val("0");
		}
	});

	loadPatient = () => {
		$.ajax({
			url: apiURL + "patient/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#patient_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.patient_name +
						"</option>";
					$("#patient_id").append(options);
				});

				$("#patient_id").append(
					'<option value="" selected>Select Patient</option>'
				);
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadPatient();

	loadPaymentMethod = () => {
		$.ajax({
			url: apiURL + "payment_method/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#payment_method_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.method_name +
						"</option>";
					$("#payment_method_id").append(options);
				});
				$("#payment_method_id").trigger("change");

				$("#edit_payment_method_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.method_name +
						"</option>";
					$("#edit_payment_method_id").append(options);
				});
				$("#edit_payment_method_id").trigger("change");

				$("#out_payment_method_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.method_name +
						"</option>";
					$("#out_payment_method_id").append(options);
				});

				$("#out_payment_method_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadPaymentMethod();

	loadPaymentTerm = () => {
		$.ajax({
			url: apiURL + "payment_term/find_all",
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#payment_term_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.term_name +
						"</option>";
					$("#payment_term_id").append(options);
				});
				$("#payment_term_id").trigger("change");

				$("#edit_payment_term_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.term_name +
						"</option>";
					$("#edit_payment_term_id").append(options);
				});
				$("#edit_payment_term_id").trigger("change");

				$("#out_payment_term_id").empty();
				$.each(data, function (i, dataOptions) {
					var options = "";

					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.term_name +
						"</option>";
					$("#out_payment_term_id").append(options);
				});
				$("#out_payment_term_id").trigger("change");
			},
			error: function ({ responseJSON }) {
				// toastr.error(data.responseJSON.detail);
			},
		});
	};
	loadPaymentTerm();

	//inpatient
	$("#payment_method_id").change(function () {
		$.ajax({
			url: apiURL + "payment_method/" + $("#payment_method_id").val(),
			dataSrc: "",
			type: "GET",
			dataType: "json",
			success: function (data) {
				var method_name = data.method_name;
				if (method_name == "Cash") {
					$("#payment_method").val("Cash");
					$(".inpatient_check_method").hide();
					$(".inpatient_online_payment_method").hide();
					$(".inpatient_cash_method").show();
				} else if (method_name == "Check") {
					$("#payment_method").val("Check");
					$(".inpatient_cash_method").hide();
					$(".inpatient_online_payment_method").hide();
					$(".inpatient_check_method").show();
				} else if (method_name == "Online Payment") {
					$("#payment_method").val("Online Payment");
					$(".inpatient_cash_method").hide();
					$(".inpatient_check_method").hide();
					$(".inpatient_online_payment_method").show();
				} else {
					console.log("mixed");
				}
			},
			error: function ({ responseJSON }) {},
		});
	});

	$("#inpatient_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			if ($("#payment_method").val() == "Cash") {
				$.ajax({
					url: apiURL + "patient_payment/",
					type: "POST", // post, put, delete, get
					data: JSON.stringify({
						invoice_id: $("#invoice_id").val(),
						payment_method_id: $("#payment_method_id").val(),
						payment_term_id: $("#payment_term_id").val(),
						amount: $("#cash_tendered").val() - $("#change").val(),
						created_by: localStorage.USER_ID,
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("New patient payment has been created.");
						var form_payment_method_id = $("#payment_method_id").val();
						$("#inpatient_payment_form")[0].reset();
						$("#payment_method_id")
							.val(form_payment_method_id)
							.trigger("change");
						loadInvoice();
						loadInpatientPaymentTable();
						loadPatientBillingTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if ($("#payment_method").val() == "Check") {
				$.ajax({
					url: apiURL + "patient_payment/",
					type: "POST", // post, put, delete, get
					data: JSON.stringify({
						invoice_id: $("#invoice_id").val(),
						payment_method_id: $("#payment_method_id").val(),
						payment_term_id: $("#payment_term_id").val(),
						bank_name: $("#bank_name").val(),
						bank_address: $("#bank_address").val(),
						check_no: $("#check_no").val(),
						check_date: $("#check_date").val(),
						account_no: $("#account_no").val(),
						account_name: $("#account_name").val(),
						rt_number: $("#rt_number").val(),
						payee_name: $("#payee_name").val(),
						check_amount: $("#check_amount").val(),
						amount_in_words: $("#check_amount_in_words").val(),
						description: $("#check_description").val(),
						check_status: "Unclaimed",

						created_by: localStorage.USER_ID,
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("New patient payment has been created.");
						var form_payment_method_id = $("#payment_method_id").val();
						$("#inpatient_payment_form")[0].reset();
						$("#payment_method_id")
							.val(form_payment_method_id)
							.trigger("change");
						loadInvoice();
						loadInpatientPaymentTable();
						loadPatientBillingTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if ($("#payment_method").val() == "Online Payment") {
				$.ajax({
					url: apiURL + "patient_payment/",
					type: "POST", // post, put, delete, get
					data: JSON.stringify({
						invoice_id: $("#invoice_id").val(),
						payment_method_id: $("#payment_method_id").val(),
						payment_term_id: $("#payment_term_id").val(),
						phone_number: $("#phone_number").val(),
						email: $("#email").val(),
						reference_no: $("#reference_no").val(),
						online_payment_amount: $("#online_payment_amount").val(),
						online_payment_status: "To Cash",

						created_by: localStorage.USER_ID,
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("New patient payment has been created.");
						var form_payment_method_id = $("#payment_method_id").val();
						$("#inpatient_payment_form")[0].reset();
						$("#payment_method_id")
							.val(form_payment_method_id)
							.trigger("change");
						loadInvoice();
						loadInpatientPaymentTable();
						loadPatientBillingTable();
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

	//outpatient
	$("#out_payment_method_id").change(function () {
		$.ajax({
			url: apiURL + "payment_method/" + $("#out_payment_method_id").val(),
			dataSrc: "",
			type: "GET",
			dataType: "json",
			success: function (data) {
				if (data.method_name == "Cash") {
					$(".outpatient_cash_method").show();

					// new patient payment validation
					$("#outpatient_payment_form").validate({
						submitHandler: function (form, e) {
							e.preventDefault();
							trimInputFields();
							$.ajax({
								url: apiURL + "patient_payment/",
								type: "POST", // post, put, delete, get
								data: JSON.stringify({
									//lab_request_id: $("#out_lab_request_id").val(),
									payment_method_id: $("#out_payment_method_id").val(),
									payment_term_id: $("#out_payment_term_id").val(),
									amount: $("#out_cash_tendered").val(), //- $("#change").val(),
									amount_in_words: $("#out_amount_in_words").val(),

									created_by: localStorage.USER_ID,
								}),
								dataType: "json",
								contentType: "application/json",
								success: function (data) {
									toastr.success("New patient payment has been created.");
									//formReset("hide", "");
									//loadInpatientPaymentTable();
									loadPatientBillingTable();
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
				} else {
					$(".outpatient_cash_method").hide();
				}
			},
			error: function ({ responseJSON }) {},
		});
	});

	//view payment info
	viewData = (id, type) => {
		if (type == 0) {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			$("#div_form").hide();
			$("#edit_inpatient_payment_card_body").hide();
			$("#edit_inpatient_payment_button").hide();
			$("#view_payment_card_body").show();
			$("#div_view_patient_payment").show();
			$.ajax({
				url: apiURL + "patient_payment/" + id,
				type: "GET", // post, put, delete, get
				dataType: "json",
				success: function (data) {
					var previous_payment =
						data.inpatient_billing_info.amount - data.remaining_balance;
					if (previous_payment <= 0) {
						previous_payment = 0;
					}
					$("#view_inpatient_previous_payment").text(
						"₱ " + previous_payment.toLocaleString()
					);
					$("#view_inpatient_invoice_amount").text(
						"₱ " + data.inpatient_billing_info.amount.toLocaleString()
					);
					$("#view_inpatient_invoice_total_due").text(
						"₱ " + data.remaining_balance.toLocaleString()
					);
					$("#view_inpatient_payment_orno").text(data.or_no);
					$("#view_inpatient_billing_date").text(
						moment(data.inpatient_billing_info.date_of_billing).format(
							"MMMM D, YYYY"
						) +
							" - " +
							moment(data.inpatient_billing_info.due_date).format(
								"MMMM D, YYYY"
							)
					);
					$("#view_inpatient_payment_date").text(
						moment(data.created_at).format("MMMM D, YYYY")
					);
					$("#view_inpatient_name").text(
						data.inpatient_billing_info.billing_inpatient_info.patient_name
					);
					$("#view_inpatient_address").text(
						data.inpatient_billing_info.billing_inpatient_info.address
					);
					$("#view_inpatient_invoice_no").text(
						data.inpatient_billing_info.invoice_no
					);
					$("#view_inpatient_payment_term").text(
						data.payment_payment_term.term_name.toLowerCase()
					);
					$("#view_inpatient_cash_amount").text(
						"₱ " + data.amount.toLocaleString()
					);
					$("#view_inpatient_check_amount").text(
						"₱ " + data.check_amount.toLocaleString()
					);
					$("#view_inpatient_online_payment_amount").text(
						"₱ " + data.online_payment_amount.toLocaleString()
					);

					$("#view_inpatient_total_paid").text(
						"₱ " +
							(
								data.amount +
								data.check_amount +
								data.online_payment_amount
							).toLocaleString()
					);
				},
				error: function (data) {
					toastr.error(data.responseJSON.detail);
				},
			});
		}
		if (type == "print") {
			$("#div_view_patient_payment").hide();
			$.ajax({
				url: apiURL + "patient_payment/" + id,
				type: "GET", // post, put, delete, get
				dataType: "json",
				success: function (data) {
					var previous_payment =
						data.inpatient_billing_info.amount - data.remaining_balance;
					if (previous_payment <= 0) {
						previous_payment = 0;
					}
					$("#view_inpatient_previous_payment").text(
						"₱ " + previous_payment.toLocaleString()
					);
					$("#view_inpatient_invoice_amount").text(
						"₱ " + data.inpatient_billing_info.amount.toLocaleString()
					);
					$("#view_inpatient_invoice_total_due").text(
						"₱ " + data.remaining_balance.toLocaleString()
					);
					$("#view_inpatient_payment_orno").text(data.or_no);
					$("#view_inpatient_billing_date").text(
						moment(data.inpatient_billing_info.date_of_billing).format(
							"MMMM D, YYYY"
						) +
							" - " +
							moment(data.inpatient_billing_info.due_date).format(
								"MMMM D, YYYY"
							)
					);
					$("#view_inpatient_payment_date").text(
						moment(data.created_at).format("MMMM D, YYYY")
					);
					$("#view_inpatient_name").text(
						data.inpatient_billing_info.billing_inpatient_info.patient_name
					);
					$("#view_inpatient_address").text(
						data.inpatient_billing_info.billing_inpatient_info.address
					);
					$("#view_inpatient_invoice_no").text(
						data.inpatient_billing_info.invoice_no
					);

					$("#view_inpatient_payment_term").text(
						data.payment_payment_term.term_name.toLowerCase()
					);
					$("#view_inpatient_cash_amount").text(
						"₱ " + data.amount.toLocaleString()
					);
					$("#view_inpatient_check_amount").text(
						"₱ " + data.check_amount.toLocaleString()
					);
					$("#view_inpatient_online_payment_amount").text(
						"₱ " + data.online_payment_amount.toLocaleString()
					);

					$("#view_inpatient_total_paid").text(
						"₱ " +
							(
								data.amount +
								data.check_amount +
								data.online_payment_amount
							).toLocaleString()
					);

					setTimeout(() => {
						$("#btnPrint").trigger("click");
					}, 1000);
				},
				error: function (data) {
					toastr.error(data.responseJSON.detail);
				},
			});
		}
		if (type == 1) {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			$("#div_form").hide();
			$("#view_payment_card_body").hide();
			$("#edit_inpatient_payment_card_body").show();
			$("#div_view_patient_payment").show();
			$("#edit_inpatient_payment_button").show();

			$.ajax({
				url: apiURL + "patient_payment/" + id,
				type: "GET", // post, put, delete, get
				dataType: "json",
				success: function (data) {
					$("#inpatient_payment_uuid").val(id);
					$("#edit_payment_method_id")
						.val(data.payment_method_id)
						.trigger("change");
					$("#edit_payment_term_id")
						.val(data.payment_term_id)
						.trigger("change");
					$("#edit_invoice_id").val(data.invoice_id).trigger("change");
					$("#edit_remaining_balance").val(data.remaining_balance);
					$("#edit_amount_paid").val(data.amount);
					$("#edit_email").val(data.email);
					$("#edit_phone_number").val(data.phone_number);
					$("#edit_reference_no").val(data.reference_no);
					$("#edit_online_payment_amount").val(data.online_payment_amount);
					$("#edit_bank_name").val(data.bank_name);
					$("#edit_bank_address").val(data.bank_address);
					$("#edit_check_no").val(data.check_no);
					$("#edit_check_date").val(data.check_date);
					$("#edit_account_no").val(data.account_no);
					$("#edit_account_name").val(data.account_name);
					$("#edit_rt_number").val(data.rt_number);
					$("#edit_payee_name").val(data.payee_name);
					$("#edit_check_amount").val(data.check_amount);
					$("#edit_check_amount_in_words").val(data.amount_in_words);
					$("#edit_check_description").val(data.description);

					if (data.payment_payment_method.method_name == "Cash") {
						$("#edit_payment_method").val("Cash");
						$(".edit_inpatient_check_method").hide();
						$(".edit_inpatient_online_payment_method").hide();
						$(".edit_inpatient_cash_method").show();
					} else if (data.payment_payment_method.method_name == "Check") {
						$("#edit_payment_method").val("Check");
						$(".edit_inpatient_cash_method").hide();
						$(".edit_inpatient_online_payment_method").hide();
						$(".edit_inpatient_check_method").show();
					} else if (
						data.payment_payment_method.method_name == "Online Payment"
					) {
						$("#edit_payment_method").val("Online Payment");
						$(".edit_inpatient_cash_method").hide();
						$(".edit_inpatient_check_method").hide();
						$(".edit_inpatient_online_payment_method").show();
					}
				},
				error: function (data) {
					toastr.error(data.responseJSON.detail);
				},
			});
		}
	};

	$("#edit_inpatient_payment_form").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			if ($("#edit_payment_method").val() == "Cash") {
				$.ajax({
					url: apiURL + "patient_payment/" + $("#inpatient_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						invoice_id: $("#edit_invoice_id").val(),
						payment_method_id: $("#edit_payment_method_id").val(),
						payment_term_id: $("#edit_payment_term_id").val(),
						remaining_balance: $("#edit_remaining_balance").val(),
						amount: $("#edit_amount_paid").val(),
						updated_by: localStorage.USER_ID,
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Patient payment has been updated.");
						$("#div_view_patient_payment").hide();
						loadInpatientPaymentTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if ($("#edit_payment_method").val() == "Check") {
				$.ajax({
					url: apiURL + "patient_payment/" + $("#inpatient_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						invoice_id: $("#edit_invoice_id").val(),
						payment_method_id: $("#edit_payment_method_id").val(),
						payment_term_id: $("#edit_payment_term_id").val(),
						remaining_balance: $("#edit_remaining_balance").val(),
						bank_name: $("#edit_bank_name").val(),
						bank_address: $("#edit_bank_address").val(),
						check_no: $("#edit_check_no").val(),
						account_no: $("#edit_account_no").val(),
						account_name: $("#edit_account_name").val(),
						rt_number: $("#edit_rt_number").val(),
						payee_name: $("#edit_payee_name").val(),
						check_amount: $("#edit_check_amount").val(),
						amount_in_words: $("#edit_check_amount_in_words").val(),
						description: $("#edit_check_description").val(),
						//$("#edit_check_date").val(data.check_date)

						updated_by: localStorage.USER_ID,
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Patient payment has been updated.");
						$("#div_view_patient_payment").hide();
						loadInpatientPaymentTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else if ($("#edit_payment_method").val() == "Online Payment") {
				$.ajax({
					url: apiURL + "patient_payment/" + $("#inpatient_payment_uuid").val(),
					type: "PUT", // post, put, delete, get
					data: JSON.stringify({
						invoice_id: $("#edit_invoice_id").val(),
						payment_method_id: $("#edit_payment_method_id").val(),
						payment_term_id: $("#edit_payment_term_id").val(),
						remaining_balance: $("#edit_remaining_balance").val(),
						phone_number: $("#edit_phone_number").val(),
						email: $("#edit_email").val(),
						reference_no: $("#edit_reference_no").val(),
						online_payment_amount: $("#edit_online_payment_amount").val(),
						online_payment_status: "To Cash",
						amount: 0,
						check_amount: 0,
						updated_by: localStorage.USER_ID,
					}),
					dataType: "json",
					contentType: "application/json",
					success: function (data) {
						toastr.success("Patient payment has been updated.");
						$("#div_view_patient_payment").hide();
						loadInpatientPaymentTable();
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

	$(function () {
		$("#btnPrint").printPreview({
			obj2print: "#view_payment_card_body",
			width: "810",
		});
	});
	// deleteData = (id) => {
	// 	$("#modal_delete").modal("show");
	// 	$("#form_delete").on("submit", function (e) {
	// 		e.preventDefault();
	// 		$.ajax({
	// 			url:
	// 				apiURL +
	// 				"payment_method/" +
	// 				id +
	// 				"/" +
	// 				localStorage.USER_ID,
	// 			type: "DELETE", // post, put, delete, get
	// 			dataType: "json",
	// 			success: function (data) {
	// 				toastr.success("Record has been deactivated.");
	// 				$("#modal_delete").modal("hide");
	// 				loadInpatientPaymentTable();
	// 			},
	// 			error: function (data) {
	// 				toastr.error(data.responseJSON.detail);
	// 			},
	// 		});
	// 	});
	// };
});
