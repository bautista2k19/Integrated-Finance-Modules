// list of Surgery Type Info that was modified
const modifiedSurgeryTypeInfos = [];

// computes net charges
const computeNetCharges = (cancel_return) => {
	let cancel_return_amount = cancel_return.value;
	if ( cancel_return_amount != '' && parseFloat(cancel_return_amount) > 0 ) {
	  cancel_return_amount = parseFloat(cancel_return_amount);
	  const charge = parseFloat($(cancel_return).parent().prev().find('label').text());
	  const net_charge = charge - cancel_return_amount;
	  return $(cancel_return).parent().next().find('label').text(net_charge); 
	} 
	return;
};


$(document).ready(function () {
	$("#add-row").click(function(){
		var particulars = $("#particulars").val();
		var charges = $("#charges").val();
		var cancel_return = $("#cancel_return").val();
		var net_charges = $("#net_charges").val();
		var markup = "<tr><td><input type='checkbox' name='record'></td><td>" 
		+ particulars + "</td><td>" 
		+ charges + "</td><td>" 
		+ cancel_return + "</td><td>" 
		+ net_charges + "</td></tr>";
		$(".tbodyclass").append(markup);
		//var particulars = $("#particulars").val("");
		var charges = $("#charges").val("");
		var cancel_return = $("#cancel_return").val("");
		var net_charges = $("#net_charges").val("");
	});

	// Find and remove selected table rows
	$("#delete-row").click(function(){
		$("table tbody").find('input[name="record"]').each(function(){
			if($(this).is(":checked")){
				$(this).parents("tr").remove();
			}
		});
	});

	//date attribute
	//get current date to restrict input of future dates
	var current_date = new Date();
	current_date = current_date.toISOString().split("T")[0];
	$("#hire_date").attr("max", current_date);
	$("#birthdate").attr("max", current_date);

	// new inpatient bill 
	$("#form_id").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var form_data = new FormData(form);
		
			if ($("#uuid").val() == "") {
				console.log($('#uuid').val())
				form_data.append("created_by", localStorage.USER_ID);
				$.ajax({
					url: apiURL + "surgerysdfsdfsdfdsfdsf/",
					type: "POST", // post, put, delete, get
					data: form_data,
					dataType: "json",
					contentType: false,
					processData: false,
					cache: false,
					success: function (data) {
						alert("I am an alert box!");
						toastr.success("Surgery bill has been created.");
						formReset("hide", "");
						loadInpatientBill();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else {
				// list of data
                var data_list = [];

                // get all rows of myTable
                const rows = $('#myTable tbody > tr');

                // traverse each row
				sum = 0;
                for (row of rows) {
                  const cancellation_return = $(row).find('input').val();
                  const net_charge = $(row).children('td:last-of-type').children('label').text()


				  sum = parseFloat(sum) + parseFloat(net_charge);
				  console.log(sum)
                  // data
                  const data = {
                    'id': row.id,
                    'cancellation_return': cancellation_return,
                    'net_charge': net_charge,
                    'updated_by': localStorage.USER_ID
                 };
                 // add data to data list
                 data_list.push(data);
                }
                
                // test
                console.log(data_list)
               
                data_list = JSON.stringify(data_list);
                
                // test
				console.log(data_list)
                console.log(typeof data_list)
							
				form_data.append("updated_by", localStorage.USER_ID);
				console.log(apiURL + "surgery/" + $("#uuid").val())			
				$.ajax({
					url: apiURL + "surgery/" + $("#uuid").val(),
					type: "POST", // post, put, delete, get
					data: data_list,
					dataType: "json",
					cache: false,
						success: function (data) {
						// alert("UPDATE ITOOOO!");
						toastr.success(" has been updated.");
						formReset("hide", "");
						loadInpatientBill();
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
	loadInpatientBill = () => {
		$("#employee_table").dataTable().fnClearTable();
		$("#employee_table").dataTable().fnDraw();
		$("#employee_table").dataTable().fnDestroy();
		$("#employee_table").dataTable({
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
						full_name += aData.bill_registration.first_name + " " + aData.bill_registration.last_name;
						return full_name;
					},
					searchable: true,
				},
				{
					data: "bill_registration.sex",
					name: "bill_registration.sex",
					searchable: true,
				},

				{
					data: "bill_registration.patient_admission[0].date_admitted",
					name: "bill_registration.patient_admission[0].date_admitted",
					searchable: true,
				},

				{
					data: "bill_registration.patient_admission[0].date_admitted",
					name: "bill_registration.patient_admission[0].date_admitted",
					searchable: true,
				},
				{
					data: "inpatient_bill_total",
					name: "inpatient_bill_total",
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
							aData["inpatient_bill_id"] +
							"',0)\">" +
							'<div style="width: 2rem">' +
							'<i class="fas fa-eye mr-1 text-secondary"></i>' +
							"</div>" +
							"<div>View bill</div>" +
							"</div>";
						if (aData.status != "Not yet fully paid") {
							buttons +=
								'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
								aData["inpatient_bill_id"] +
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
								aData["inpatient_bill_id"] +
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
				url: apiURL + "inpatient_bill/datatable",
				dataSrc: "",
				type: "GET",
				error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
			},
			fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				let full_name = "";
				full_name += aData.bill_registration.first_name + " " + aData.bill_registration.last_name;
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
					aData["inpatient_bill_id"] +
					"',0)\">" +
					'<div style="width: 2rem">' +
					'<i class="fas fa-eye mr-1 text-secondary"></i>' +
					"</div>" +
					"<div>View Bill</div>" +
					"</div>";
				if (aData.status != "Fully paid") {
					buttons +=
						'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
						aData["inpatient_bill_id"] +
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
						aData["inpatient_bill_id"] +
						"')\">" +
						'<div style="width: 2rem">' +
						'<i class="fas fa-trash-alt mr-1 text-danger"></i>' +
						"</div>" +
						"<div>Delete Employee</div>" +
						"</div>";
				}
				buttons += "</div>" + "</div>";
				$("td:eq(0)", nRow).html(full_name);
				$("td:eq(1)", nRow).html(aData["bill_registration.sex"]);
				$("td:eq(2)", nRow).html(aData["bill_registration.patient_admission.date_admitted"]);
				$("td:eq(3)", nRow).html(aData["bill_registration.patient_admission.room_number"]);
				$("td:eq(4)", nRow).html(aData["inpatient_bill_total"]);
				$("td:eq(5)", nRow).html(status);
				$("td:eq(6)", nRow).html(buttons);
			},
			drawCallback: function (settings) {},
		});
	};
	loadInpatientBill();


	// function to load all particulars per patient admission
	loadParticulars = () => {
		$("#particulars").empty();
		$.ajax({
		url: apiURL + "surgery/datatable",
		dataSrc: "",
		type: "GET",
		success: function (data) {
			$("#particulars").empty();
			$.each(data, function (i, dataOptions) {
			var options = "";
			console.log(data)

			options =
				"<option value='" +
				dataOptions.id +
				"'>" +
				" " +
				dataOptions.surgery_type_info.surgery_type_name;
			("</option>");
			$("#particulars").append(options);
			
			});

			$("#particulars").append('<option value="" selected>Select</option>');
			
		},
		
		error: function ({ responseJSON }) {
			// toastr.error(data.responseJSON.detail);
		},
		});
	};
	loadParticulars();


 	///////////////////////////////////////////////////////////////////////////////////////////////
	// function to load all patient admissions
	loadInpatientManagement = () => {
		$.ajax({
		url: apiURL + "patient_registration/datatable",
		dataSrc: "",
		type: "GET",
		success: function (data) {
			$("#patient_full_name").empty();
			$.each(data, function (i, dataOptions) {
			var options = "";
			console.log(data)

			if (data.middle_name == null) {
				data.middle_name = "";
			} else {
				data.middle_name = data.middle_name;}
			
			options =
				"<option value='" +
				dataOptions.patient_id +
				"'>" +
				" " +
				dataOptions.first_name +" "+data.middle_name + " "+dataOptions.last_name;
			("</option>");
			$("#patient_full_name").append(options);
			
			});

			$("#patient_full_name").append('<option value="" selected>Select Patient Name</option>');
		},
		
		error: function ({ responseJSON }) {
			// toastr.error(data.responseJSON.detail);
		},
		});
	};
	loadInpatientManagement();

	//////////////////////////////////////////////////////////////////////////////////////////////////
	// load setup
	$("#patient_full_name").change(function () {
		$("#birthdate").empty();
		$.ajax({
			url: 
			apiURL + 
			"inpatient_management/"+ 
			$("#patient_full_name").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#birthdate").text(data.patient_info.pt_birthdate);
			},
			error: function ({ responseJSON }) {},
		});
	});


	// room number
	$("#patient_full_name").change(function () {
		$("#room_number").empty();
		$.ajax({
			url: 
			apiURL + 
			"inpatient_management/"+ 
			$("#patient_full_name").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#room_number").text(data.room_number);
			},
			error: function ({ responseJSON }) {},
		});
	});


	// room rate
	$("#patient_full_name").change(function () {
		$("#room_rate").empty();
		$.ajax({
			url: 
			apiURL + 
			"inpatient_management/"+ 
			$("#patient_full_name").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#room_rate").text(data.room_number);
			},
			error: function ({ responseJSON }) {},
		});
	});

	// room rate na totoo
	$("#patient_full_name").change(function () {
		$("#room_rate").empty();
		$.ajax({
			url: 
			apiURL + 
			"inpatient_management/"+ 
			$("#patient_full_name").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#room_rate").text(data.room_number);
			},
			error: function ({ responseJSON }) {},
		});
	});
	//////////////////////////////////////////////////////////////////////////////////////////////////
	// load date admitted by patient id
	$("#patient_full_name").change(function () {
		$("#date_admitted").empty()
		$.ajax({
			url: 
			apiURL + 
			"patient_registration/"+ 
			$("#patient_full_name").val(),
			dataSrc: "",
			type: "GET",
			
			success:function (data) {
				let patient_admission_length = data.patient_admission.length;
				let patient_admission_name = "";
				for (let j = 0; j < patient_admission_length; j++) {
					console.log(j)
				 	patient_admission_name =  data.patient_admission[j].date_admitted;
					 options =
					 "<option value='" +
					 patient_admission_name +
					 "'>" +
					 " " +
					 patient_admission_name;
				 ("</option>");
				 $("#date_admitted").append(options);
				 }
				 $("#date_admitted").append('<option value="" selected>Select date admitted</option>');
			},
			error: function ({ responseJSON }) {},
		});
	});


	//////////////////////////////////////////////////////////////////////////////////////////////////
	// load date discharged by patient id
	$("#patient_full_name").change(function () {
		$("#date_discharged").empty()
		$.ajax({
			url: 
			apiURL + 
			"patient_registration/"+ 
			$("#patient_full_name").val(),
			dataSrc: "",
			type: "GET",
			
			success:function (data) {
				let patient_discharged_length = data.patient_discharged.length;
				let patient_discharged_name = "";
				for (let j = 0; j < patient_discharged_length; j++) {
					console.log(j)
				 	patient_discharged_name =  data.patient_discharged[j].date_discharged;
					 options =
					 "<option value='" +
					 patient_discharged_name +
					 "'>" +
					 " " +
					 patient_discharged_name;
				 ("</option>");
				 $("#date_discharged").append(options);
				 }
				 $("#date_discharged").append('<option value="" selected>Select date discharged</option>');
			},
			error: function ({ responseJSON }) {},
		});
	});



	// load address
	$("#patient_full_name").change(function () {
		$("#address").empty();
		$.ajax({
			url: 
			apiURL + 
			"inpatient_management/"+ 
			$("#patient_full_name").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {

				console.log(data)

				if (data.patient_info.pt_house_number == null) {
					data.patient_info.pt_house_number = "";
				} else {
					data.patient_info.pt_house_number = data.patient_info.pt_house_number;
				}
				if (data.patient_info.pt_street == null) {
					data.patient_info.pt_street = "";
				} else {
					data.patient_info.pt_street = data.patient_info.pt_street;
				}

				$("#address").text(data.patient_info.pt_house_number + " "+ data.patient_info.pt_street +" "+  data.patient_info.pt_barangay + " "+ data.patient_info.pt_city + " "+ data.patient_info.pt_province + " "+ data.patient_info.pt_country);
			},
			error: function ({ responseJSON }) {},
		});
	});


	$(window).resize(function () {
		$("table.dataTable").resize();
	});

	//New Data
	$("#new_record").on("click", function () {
		formReset("new", "New Patient Bill");
	});

	$('#mytable tr').each(function() {
		var customerId = $(this).find(".customerIDCell").html();    
	 });

	//view info
	viewData = (inpatient_bill_id, type) => {
		$.ajax({
			url: apiURL + "inpatient_bill/" + inpatient_bill_id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				var total_surgery_amount =0
				$.each(data.bill_surgeries, function (i, dataOptions) {
					total_surgery_amount = total_surgery_amount + dataOptions.surgery_type_info.amount
				  });

				var total_treatment =0
				$.each(data.bill_treatment, function (i, dataOptions) {
					total_treatment = total_treatment + dataOptions.treatment_type_info.amount
					});
					
				var total_lab_amount =0
				$.each(data.bill_lab_request, function (i, dataOptions) {
					total_lab_amount = total_lab_amount + dataOptions.lab_info.amount	
					});

				var total_services =0
					total_services = total_services + total_surgery_amount + total_treatment + total_lab_amount
					console.log (total_services)

				var total_pharmacy_amount = 0
				$.each(data.bill_pharmacy, function (i, dataOptions) {
					total_pharmacy_amount = total_pharmacy_amount + dataOptions.med_total				
					});
					console.log (total_pharmacy_amount)

				var total_bill_doctor_fee = 0
				$.each(data.bill_doctor_fee, function (i, dataOptions) {
					total_bill_doctor_fee = total_bill_doctor_fee + dataOptions.fee					
					});
				
				var total_particulars= 0
				    total_particulars = total_particulars + total_services + total_pharmacy_amount 				
				
				var total_bill_balance = 0
				let total_servicess = total_services
				    total_bill_balance = total_bill_balance + total_servicess + total_pharmacy_amount + total_bill_doctor_fee					
					
				if (data.bill_registration.middle_name == null) {
					data.bill_registration.middle_name = "";
				} else {
					data.bill_registration.middle_name = data.bill_registration.middle_name;
				}
				if (data.bill_registration.extension_name == null) {
					data.bill_registration.extension_name = " ";
				} else {
					data.bill_registration.extension_name = data.bill_registration.extension_name;
				}
				if (data.bill_registration.pt_house_number == null) {
					data.bill_registration.pt_house_number = "";
				} else {
					data.bill_registration.pt_house_number = data.bill_registration.pt_house_number;
				}
				if (data.bill_registration.pt_street == null) {
					data.bill_registration.pt_street = "";
				} else {
					data.bill_registration.pt_street = data.bill_registration.pt_street;
				}
				
				if (type == 0) {	
					//bill_pharmacy
					let fLen = data.bill_pharmacy.length;
					let text = "";
					let med_name = "";
					for (let i = 0; i < fLen; i++) {
						text +=  data.bill_pharmacy[i].med_total+ "<br>" ;
						med_name +=  data.bill_pharmacy[i].product_name+ "<br>" ;
					}
					//bill_lab_request
					let lab_length = data.bill_lab_request.length;
					let lab_name = "";
					let lab_amount ="";
					for (let i = 0; i < lab_length; i++) {
						lab_name +=  data.bill_lab_request[i].lab_info.lab_test_type_name + "<br>" ;
						lab_amount +=  data.bill_lab_request[i].lab_info.amount + "<br>" ;
					}
					//bill_surgeries
					let bill_surgeries_length = data.bill_surgeries.length;
					let surgeries_name = "";
					let surgery_amount ="";
					for (let i = 0; i < bill_surgeries_length; i++) {
						surgeries_name +=  data.bill_surgeries[i].surgery_type_info.surgery_type_name + "<br>" ;
						surgery_amount +=  data.bill_surgeries[i].surgery_type_info.amount + "<br>" ;
					}
					//bill_treatment
					let bill_treatment_length = data.bill_treatment.length;
					let treatment_name = "";
					let treatment_amount ="";
					for (let i = 0; i < bill_treatment_length; i++) {
						treatment_name +=  data.bill_treatment[i].treatment_type_info.treatment_type_name + "<br>" ;
						treatment_amount +=  data.bill_treatment[i].treatment_type_info.amount + "<br>" ;
					}
					//bill_doctor_fee
					let bill_doctorfee_length = data.bill_doctor_fee.length;
					let doctor_name = "";
					let doctor_fees ="";
					for (let i = 0; i < bill_doctorfee_length; i++) {
						doctor_name +=  data.bill_doctor_fee[i].dr_profile.dr_first_name + data.bill_doctor_fee[i].dr_profile.dr_last_name+"<br>" ;
						doctor_fees +=  data.bill_doctor_fee[i].fee + "<br>" ;
					}
					//patient_info  date_admitted, room_type, amount
					let pt_info_length = data.bill_registration.patient_admission.length;
					let pt_room_type = "";
					let pt_info_amount ="";
					let pt_room_type_name = "";
					let pt_room_rate = "";
					let pt_admitted ="";
					for (let i = 0; i < pt_info_length; i++) {
						pt_room_type +=  data.bill_registration.patient_admission[i].room_number + "<br>" ;
						pt_info_amount +=  data.bill_registration.patient_admission[i].date_admitted + "<br>" ;

						//pt_room_type_name +=  data.bill_registration.patient_admission[i].room_type.room_type_name + "<br>" ;

						//pt_room_rate +=  data.bill_registration.patient_admission[i].room_type.amount + "<br>" ;
						pt_admitted +=  data.bill_registration.patient_admission[i].date_admitted + "<br>" ;

					}
					console.log($('#surgery').val())
					//bill_surgeries
					let bill_surgeries_length1 = data.bill_surgeries.length;
					let surgeries_name1 = "";
					let net_charge_surgery ="";
					var surgery_all = [];
					for (let i = 0; i < bill_surgeries_length1; i++) {
						//net_charge_surgery =  30 ; 
						surgery_id_arr = data.bill_surgeries[i].id;

						surgery_type_ids = data.bill_surgeries[i].surgery_type_info.id;
						// console.log(surgery_type_ids)

						
						// const surgery_ids =[]		
						// surgery_ids.push(data.bill_surgeries[i].id)
						
						// console.log(surgery_id_arr)
						// console.log(data)
									
						surgeries_name1 += 
                            "<tr id='"+data.bill_surgeries[i].id+"'>"+
                                // surgery_type_name
                                "<td class='col-md-6 mb-6'>"+
                                    "<label style='font-weight: normal;'"+ 
                                        "class='form-control'>"+
                                        data.bill_surgeries[i].surgery_type_info.surgery_type_name+
                                    "</label>"+
                                "</td>"+
                                // charge
                                "<td class='col-md-2 mb-2'>"+
                                    "<label style='font-weight: normal;'"+ 
                                        "class='form-control'>"+
                                        data.bill_surgeries[i].surgery_type_info.amount+
                                    "</label>"+
                                "</td>"+
                                // cancellation amount
                                "<td class='col-md-2 mb-2'>"+
                                    "<input class='form-control' type='text' id='"+
                                        data.bill_surgeries[i].surgery_type_info.id+
                                        "' oninput='return computeNetCharges(this);' value='"+
										data.bill_surgeries[i].cancellation_return
										
										+"'>"+
                                "</td>"+
                                // net charged
                                "<td class='col-md-2 mb-2'>"+
                                    "<label style='font-weight: normal;'"+
                                        "class='form-control'>"+
										data.bill_surgeries[i].net_charge+
                                    "</label>"+
                                "</td>"+
                            "</tr>";

					}

					formReset("show","View Inpatient Bill Information");
					$("#uuid").val("899e62e3-42ea-4afe-92d9-1d3c8527c329")
					$(".view_div").empty();
					$("#save_button").show()
					$("#form_card_body").append(
						
						"<div class='row view_div'>"+ 
							"<div class='col-md-12'>"+ 
								"<h5 class='text-info'>Personal Information</h5>"+ 
							"</div>"+ 

							"<div class='col-md-12'>"+ 
								"<div class='invoice p-3 mb-3'>"+ 
									"<!-- title row --> "+
										"<div class='row'>"+ 
											"<h5><i class='fas fa-globe'></i> AdminLTE, Inc.	</h5>"+ 
										"</div>"+ 
									" <!-- /title row --> "+

									"<!-- info row -->" +
									"<div class='row invoice-info'>" +
										"<div class='col-sm-8 invoice-col'>" +
											"795 Folsom Ave, Suite 600 San Francisco, CA 94107<br>" +
											"Phone: (804) 123-5432<br>" +
											"Email: info@almasaeedstudio.com <br><br>" +
											"Name: " +
											data.bill_registration.first_name +
											" " +
											data.bill_registration.middle_name +
											" " +
											data.bill_registration.last_name +
											" " +
											data.bill_registration.extension_name + "<br> "+
											"Address: " +
											data.bill_registration.pt_house_number +
											" " +
											data.bill_registration.pt_street +
											" " +
											data.bill_registration.pt_barangay +
											" " +
											data.bill_registration.pt_city +
											" " +
											data.bill_registration.pt_province +
											" " +
											data.bill_registration.pt_country + "<br>"+
											"Age: <br> " +
											"Attending Physician: <br><br> " +
										"</div>" +
									
										"<div class='col-sm-4 invoice-col'>" +
											"<b>Inpatient Statement Account</b> <br>" +
											"Date: " + 	current_date+  "<br>" +
											"Bill No: "+ data.temp_bill_no + "<br><br>" +

											"Room No: "+ "pt_room_type_name" +
											"Room Rate: "+ pt_room_rate +
											"Date and Time Admittted: "+ pt_admitted +
											"Date and Time Discharged: 2/22/2014<br><br> " +
										"</div>" +
									"</div>" +
									"<!-- /.row -->" +
									

								// VIEW INPATIENT BILL
								"<!-- info row -->" +
								"<div class='row invoice-info'>" +
									"<div class='col-sm-6 invoice-col'>" +
										surgeries_name +  
										lab_name +
										treatment_name +
										med_name + 
									 
									"</div>" +
									
									
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
								
										surgery_amount +   
										lab_amount +
										treatment_amount+
										text+			
								
									"</div>" +
				
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
								
										// "00.00 <br>" +
										// "00.00 <br> "+
										// "00.00 <br> " +
										// "00.00 <br> " +
										// "00.00 <br> " +
									"</div>" +
				
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
										surgery_amount + 
										lab_amount +  
										treatment_amount + 
										 text+
									"</div>" +
								
								"</div>" +
								"<div class='line'  style='width:98%;border-top: 1px solid black;position: absolute; '></div>" +
								"<!-- /.row -->" +
				
								"<!-- info row -->" +
								"<div class='row invoice-info'>" +
									"<div class='col-sm-6 invoice-col'>" +
										"Subtotal" +
									"</div>" +
				
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
										total_particulars+
									"</div>" +
				
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										"00.00" +
									"</div>" +
				
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										total_particulars+
									"</div>" +
								"</div>" +
								"<br>" +
								"<!-- /.row -->" +
				
								"<!-- info row -->" +
								"<div class='row invoice-info'>" +
									"<div class='col-sm-6 invoice-col'>" +
										"<b>Total Hospital Deductions</b>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
									"</div>" +
								"</div>" +
								"<div class='line'  style='width:98%;border-top: 1px solid black;position: absolute; '></div>" +
								"<!-- /.row -->" +
							
								"<!-- info row -->" +
								"<div class='row invoice-info'>" +
									"<div class='col-sm-6 invoice-col'>" +
										"SENIOR CITIZEN<br>" +
										"PHILHEALTH <br>" +
										"CASH PAYMENT <br>" +
										"CREDIT CARD PAYMENT <br>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
										"00.00 <br>" +
										"00.00 <br>" +
										"00.00 <br>" +
										"00.00 <br>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
										"00.00 <br>" +
										"00.00 <br>" +
										"00.00 <br>" +
										"00.00 <br>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
										"00.00 <br>" +
										"00.00 <br>" +
										"00.00 <br>" +
										"00.00 <br>" +
									"</div>" +
								"</div>" +
								"<div class='line'  style='width:98%;border-top: 1px solid black;position: absolute; '></div>" +
								"<!-- /.row -->" +
				
								"<!-- info row -->" +
								"<div class='row invoice-info'>" +
									"<div class='col-sm-6 invoice-col'>" +
										"Subtotal" +
									"</div>" +
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
										"00" +
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										"00" +
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										"00 " +
									"</div>" +
								"</div>" +
								"<br> <br>" +
								"<!-- /.row -->" +
										
								"<!-- info row -->" +
								"<div class='row invoice-info'>" +
									"<div class='col-sm-4 invoice-col'>" +
										"<b>Professional Fees</b>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
										"<b>Gross</b>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										"<b>Philhealth</b>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										"<b>Discount</b>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										"<b>Patient Due</b>" +
									"</div>" +
								"</div>" +
								"<div class='line'  style='width:98%;border-top: 1px solid black;position: absolute; '></div>" +
								"<!-- /.row -->" +
								
								"<!-- info row -->" +
								"<div class='row invoice-info'>" +
									"<div class='col-sm-4 invoice-col'>" +
										doctor_name+ 
									"</div>" +
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
										doctor_fees+
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										"00.00 <br>" +
										"00.00 <br>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										"00.00 <br>" +
										"00.00 <br>" +
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										doctor_fees+
									"</div>" +
								"</div>" +
								"<div class='line'  style='width:98%;border-top: 1px solid black;position: absolute; '></div>" +
								"<!-- /.row -->" +
				
								"<!-- info row -->" +
								"<div class='row invoice-info'>" +
									"<div class='col-sm-4 invoice-col'>" +
										"Total PF Amount" +
									"</div>" +
									"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
										total_bill_doctor_fee +
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										"00.00" +
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										"00.00" +
									"</div>" +
									"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
										total_bill_doctor_fee +
									"</div>" +
								"</div>" +
								"<br> <br>" +
								"<!-- /.row -->" +
				
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
										"<b> "+ total_bill_balance+"</b>" +
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
								"<div class='row invoice-info'>"+	
								"<table class='table table-bordered' id='myTable'>"+
									"<thead>"+
										"<tr>"+
											"<th class='col-md-4 mb-4'>Particulars</th>"+
											"<th class='col-md-2 mb-2'>Charges</th>"+
											"<th class='col-md-2 mb-2'>Cancellation|Return</th>"+
											"<th class='col-md-2 mb-2'>Net Charges</th>"+
										"</tr>"+
									"</thead>"+
									"<tbody class='tbodyclass'>"+
										surgeries_name1+
									"</tbody>"+
								"</table>"+
							"</div>"+

						"<div class='row form_div'>"+
							"<input type='hidden' id='patient_id' name='patient_id'  value='4c5c4f6c-ea31-4ee5-8d9d-080923f1bf9f' />"+
						"</div>"+

						"<div class='row form_div'>"+
							"<input type='hidden' id='inpatient_bill_id' name='inpatient_bill_id'  value='296130e1-497a-4a3e-9854-dff6f1ff881a'/>"+
						"</div>"+

						"<div class='row form_div'>"+
							"<input type='hidden' id='surgery_type_id' name='surgery_type_id'  value='d0f59e0d-c6b8-4855-9f06-a127b6c21424' />"+
						"</div>"+

						"<div class='row form_div'>"+
							"<input type='hidden' id='date' name='date'  value='2021-01-02' />"+
						"</div>"+

						"<div class='row form_div'>"+
							"<input type='hidden' id='room' name='room'  value='RM 11/25/2021' />"+
						"</div>"+
						////////////////////////////////////////////////////

								"<!-- this row will not appear when printing -->"+ 
								"<div class='row no-print'>"+ 
									"<div class='col-12'>"+ 
										"<a href='invoice-print.html' rel='noopener' target='_blank' class='btn btn-default'><i class='fas fa-print'></i> Print</a>"+ 
								
										"<button type='button' class='btn btn-primary float-right' style='margin-right: 5px;'>"+ 
											"<i class='fas fa-download'></i> Generate PDF"+ 
										"</button>"+ 
									"</div>"+ 
								"</div>"+ 
							"</div>"+ 
							"<!-- /.invoice --> "+
						"</div>"
						////////////////////////////////////////////////////
					);
				}
			},
			error: function (data) {
				toastr.error(data.responseJSON.detail);
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