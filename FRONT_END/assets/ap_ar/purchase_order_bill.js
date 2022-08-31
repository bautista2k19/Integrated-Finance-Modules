$(document).ready(function () {
	loadPurchaseOrderBillTable = () => {
		$("#purchase_order_bill_table").dataTable().fnClearTable();
		$("#purchase_order_bill_table").dataTable().fnDraw();
		$("#purchase_order_bill_table").dataTable().fnDestroy();
		$("#purchase_order_bill_table").dataTable({
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
					data: "purchase_order_bill_no",
					name: "purchase_order_bill_no",

					searchable: true,
				},
				{
					data: "order_bill_order_vendor_bill.purchase_order_vendor_bill_no",
					name: "order_bill_order_vendor_bill.purchase_order_vendor_bill_no",

					searchable: true,
				},
				{
					data: "order_bill_purchase_order.purchase_order_number",
					name: "order_bill_purchase_order.purchase_order_number",

					searchable: true,
				},
				{
					data: "order_bill_order_vendor_bill.order_vendor_bill_vendor.vendor_name",
					name: "order_bill_order_vendor_bill.order_vendor_bill_vendor.vendor_name",

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
						let status = "";

						if (aData.status == "Paid") {
                            status +=
								'<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Paid</span>';
							
						} else if(aData.status == "Pending"){
                            status +=
								'<span class="badge badge-danger p-2 w-100"><i class="nav-icon fas fa-clock mr-1"></i>Pending</span>';
                        } 
                        else if(aData.status == "Incomplete"){
							status +=
								'<span class="badge badge-warning p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Incomplete</span>';
						}
						return status;
					},

					searchable: true,
				},
			],

			ajax: {
				url: apiURL + "purchase_order_bill/datatable",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {

				let total_bill = "";

				total_bill += "₱ " + aData.total_bill.toLocaleString();

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
						
						
				$("td:eq(0)", nRow).html(aData["purchase_order_bill_no"]);
				$("td:eq(1)", nRow).html(aData["order_bill_order_vendor_bill.purchase_order_vendor_bill_no"]);
				$("td:eq(2)", nRow).html(aData["order_bill_purchase_order.purchase_order_number"]);
				$("td:eq(3)", nRow).html(aData["order_bill_order_vendor_bill.order_vendor_bill_vendor.vendor_name"]);
				$("td:eq(4)", nRow).html(total_bill);
				$("td:eq(5)", nRow).html(status);
			},
			drawCallback: function (settings) {},
		});
	};
	loadPurchaseOrderBillTable();

	$(window).resize(function () {
		$("table.dataTable").resize();
	});
});
