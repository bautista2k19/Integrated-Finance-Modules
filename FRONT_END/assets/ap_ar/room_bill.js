$(document).ready(function () {
	loadRoomBillTable = () => {
		$("#room_bill_table").dataTable().fnClearTable();
		$("#room_bill_table").dataTable().fnDraw();
		$("#room_bill_table").dataTable().fnDestroy();
		$("#room_bill_table").dataTable({
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
					data: "room_bill_no",
					name: "room_bill_no",

					searchable: true,
				},
				{
					data: "room_bill_room_admission.room_admission_room.room_number",
					name: "room_bill_room_admission.room_admission_room.room_number",

					searchable: true,
				},
				{
					data: "room_bill_room_admission.room_admission_room.room_room_type.name",
					name: "room_bill_room_admission.room_admission_room.room_room_type.name",

					searchable: true,
				},
				{
					data: "room_bill_inpatient_bill.inpatient_bill_no",
					name: "room_bill_inpatient_bill.inpatient_bill_no",

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let inpatient_full_name = "";

						inpatient_full_name =
							aData.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
							" " +
							aData.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;
						return inpatient_full_name;
					},

					searchable: true,
				},
				{
					data: null,
					render: function (aData, type, row) {
						let total_amount = "";

						total_amount += "??? " + aData.total_amount.toLocaleString();

						return total_amount;
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
				url: apiURL + "room_bill/datatable",
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
					aData.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.first_name +
					" " +
					aData.room_bill_inpatient_bill.inpatient_bill_inpatient.inpatient_patient.last_name;

				let total_amount = "";

				total_amount += "??? " + aData.total_amount.toLocaleString();

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

						
				$("td:eq(0)", nRow).html(aData["room_bill_no"]);
				$("td:eq(1)", nRow).html(aData["room_bill_room_admission.room_admission_room.room_number"]);
				$("td:eq(2)", nRow).html(aData["room_bill_room_admission.room_room_type.name"]);
				$("td:eq(3)", nRow).html(aData["room_bill_inpatient_bill.inpatient_bill_no"]);
				$("td:eq(4)", nRow).html(inpatient_full_name);
				$("td:eq(5)", nRow).html(total_amount);
				$("td:eq(6)", nRow).html(status);
			},
			drawCallback: function (settings) {},
		});
	};
	loadRoomBillTable();

	$(window).resize(function () {
		$("table.dataTable").resize();
	});
});
