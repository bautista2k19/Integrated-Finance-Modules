// computes net charges
const computeNetCharges = (cancel_return) => {
	let cancel_return_amount = cancel_return.value;
	if ( cancel_return_amount != '' && parseFloat(cancel_return_amount) > 0 ) {
	  cancel_return_amount = parseFloat(cancel_return_amount);
	  const charge = parseFloat($(cancel_return).parent().prev().find('label').text());
	  const net_charge = charge - cancel_return_amount;
	  //const net = $(cancel_return).parent().next().find('label').text(net_charge)
	  console.log(net_charge)
	  return $(cancel_return).parent().next().find('label').text(net_charge); 
	} 
	return;
};

$(document).ready(function () {

	
	// function to load all room number occupied
	if ($("#room_number").val() == null){
	loadRoomNumberIfOccupied = () => {
		$.ajax({
		url: apiURL + "rooms/find_all",
		dataSrc: "",
		type: "GET",
		success: function (data) {
			$("#room_number").empty();
			$.each(data, function (i, dataOptions) {
				var options = "";
				options =
					"<option value='" +
					dataOptions.room_id +
					"'>" +
					" " +
					dataOptions.room_number;
				("</option>");
				$("#room_number").append(options);
			});

			$("#room_number").append('<option value="" selected>Select Room</option>');
		},
		
		error: function(data) {toastr.warning(data.responseJSON.detail)},
		});
	};
	loadRoomNumberIfOccupied();
	}

	// load patient name when room number changes 	
	$("#room_number").change(function () {
		$("#patient_full_name").empty()
		$.ajax({
			url: 
			apiURL + 
			"inpatients/room_number/"+ 
			$("#room_number").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				$("#patient_full_name").empty();
				$.each(data, function (i, dataOptions) {
				var options = "";
				console.log(data)
	
				if (dataOptions.patient_info.middle_name == null) {
					dataOptions.patient_info.middle_name = "";
				} else {
					dataOptions.patient_info.middle_name= dataOptions.patient_info.middle_name;}
				
				options =
					"<option value='" +
					dataOptions.admission_id +
					"'>" +
					" " +
					dataOptions.patient_info.first_name +" "+dataOptions.patient_info.middle_name + " "+dataOptions.patient_info.last_name;
				("</option>");
				$("#patient_full_name").append(options);
				
				});
	
				$("#patient_full_name").append('<option value="" selected>Select Patient Name</option>');
			},
		error: function(data) {toastr.warning(data.responseJSON.detail)},
		});
	});
	
	// function to load all patient (name) admissions INPATIENTS find_all_patient_without_bill  SELECTED ADMISSION_ID
	loadInpatientsNoBill = () => {
		$.ajax({
		url: apiURL + "inpatients/find_all",
		dataSrc: "",
		type: "GET",
		success: function (data) {
			$("#patient_full_name").empty();
			$.each(data, function (i, dataOptions) {
			var options = "";
			console.log(data)

			if (dataOptions.patient_info.middle_name == null) {
				dataOptions.patient_info.middle_name = "";
			} else {
				dataOptions.patient_info.middle_name= dataOptions.patient_info.middle_name;}
			
			options =
				"<option value='" +
				dataOptions.admission_id +
				"'>" +
				" " +
				dataOptions.patient_info.first_name +" "+dataOptions.patient_info.middle_name + " "+dataOptions.patient_info.last_name;
			("</option>");
			$("#patient_full_name").append(options);
			
			});

			$("#patient_full_name").append('<option value="" selected>Select Patient Name</option>');
		},
		
		error: function(data) {toastr.warning(data.responseJSON.detail)},
		});
	};
	loadInpatientsNoBill();

	// room rate
	$("#patient_full_name").change(function () {
		$("#room_rate").empty();
		$.ajax({
			url: 
			apiURL + 
			"inpatients/"+ 
			$("#patient_full_name").val(),
			dataSrc: "",
			type: "GET",
			success: function (data) {
				if (data.room_transfer_id ==""||data.room_transfer_id == null){
				$("#room_rate").text(data.room.room_number);
				console.log(data)
				}
				else{
					$("#room_rate").text(data.room_transfer_info.room_number_info.room_number);
					console.log(data)
				}
			},
			error: function(data) {toastr.warning(data.responseJSON.detail)},
		});
	});
	

	// Initialize Select2
	$('#room_number').select2();

	// Set option selected onchange
	$('#patient_full_name').change(function(){
		var value = $(this).val();

		// Set selected
		$('#room_number').val(value);
		$('#room_number').select2().trigger('change');
	});
 
   

	// //button subtotal particulars
	myFunction= () => {
	    // get all rows of myTable
		const rows1 = $('#tableParticulars tbody > tr');
		// traverse each row
		sum = 0;
		for (row of rows1) {
			const net_charge = $(row).children('td:last-of-type').children('label').text()
			sum = sum + Number(net_charge);
			
		}
		console.log(sum)
		$("#subtotalParticulars").val(sum) 
    }

	// Particulars
	$("#date_admitted").change(function () {
		// $("#room_rate").empty();
		patient_id = "a1b1932f-4bab-48a2-a75f-cf73cd6d4965"
		date_admitted = "2022-01-04"
		upto = "2022-01-10"
		type = 0;
		$.ajax({
			url: apiURL + "hospital_charges/find_hospital_charges/" +patient_id +"/"+ date_admitted +"/"+upto,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {	
				// console.log(data)			
				if (type == 0) {	
					//hospital charges
					let hospital_charges_length = data.length;
					let hospital_charges = "";
					
					let service_type="";
					let hc_department ="";
					let hc_date ="";
					let hc_quantity="";
					let hc_description="";
					let hc_unit_price="";
					let hc_amount="";
					let hc_types ="";
					let hc_types1 ="";
					for (let i = 0; i < hospital_charges_length; i++) {
						hc_department += data[i].TreatmentDepartment.treatment_department_name+ "<br>" ;
						service_type += data[i].TreatmentServiceTypes.treatment_service_type+ "<br>" ;
						hc_date += data[i].HospitalCharges.date+"<br>" ;
						hc_quantity += data[i].HospitalCharges.quantity+"<br>" ;
						hc_description += data[i].TreatmentServices.description_name+"<br>" ;
						hc_unit_price += data[i].HospitalCharges.unit_price+"<br>" ;
						hc_amount +=data[i].HospitalCharges.amount+"<br>" ;

						hc_types+= data[i].TreatmentServiceTypes.treatment_service_type+"<br>";

						hc_types1 =data[i].TreatmentServiceTypes.treatment_service_type;
						//console.log(hc_description)

				
					//===================================================//	
					$(function() {  
						//Created By: Brij Mohan
						//Website: https://techbrij.com
						function groupTable($rows, startIndex, total){
						if (total === 0){
						return;
						}
						var i , currentIndex = startIndex, count=1, lst=[];
						var tds = $rows.find('td:eq('+ currentIndex +')');
						var ctrl = $(tds[0]);
						lst.push($rows[0]);
						for (i=1;i<=tds.length;i++){
						if (ctrl.text() ==  $(tds[i]).text()){
						count++;
						$(tds[i]).addClass('deleted');
						lst.push($rows[i]);
						}
						else{
						if (count>1){
						ctrl.attr('rowspan',count);
						groupTable($(lst),startIndex+1,total-1)
						}
						count=1;
						lst = [];
						ctrl=$(tds[i]);
						lst.push($rows[i]);
						}
						}
						}
						groupTable($('#myTable tr:has(td)'),0,3);
						$('#myTable .deleted').remove();
						});

					}

					//===================================================//
					let hospital_charges_lengths = data.length;
					var hcArray = [];
					var tsArray = [];            //Treatment Services
					var deptArray = [];
					var types_servicesArray = [];
					for (let i = 0; i < hospital_charges_lengths; i++) {
						var hc_h_charges = data[i].HospitalCharges;
						hcArray.push(hc_h_charges);
						var hc_t_services = data[i].TreatmentServices;
						tsArray.push(hc_t_services);
						var hc_types_services = data[i].TreatmentServiceTypes;
						types_servicesArray.push(hc_types_services);
						var hc_departments = data[i].TreatmentDepartment;
						deptArray.push(hc_departments);
					}
					const hc_all = hcArray.map((e,i) => [e,tsArray[i] , types_servicesArray[i], deptArray[i]])
					//console.log(hc_all)
					//===================================================//
			
					//===================================================//
					//correct
					var array1 = [];
					for (let i = 0; i < hospital_charges_length; i++) {
						var arr1 = hc_all[i][0];
						var arr2 = hc_all[i][1];
						var arr3 = hc_all[i][2];
						var arr4 = hc_all[i][3];
						let hc_combined = Object.assign(arr1,arr2,arr3,arr4);
						array1.push(hc_combined);	
					}
					console.log(array1);
					//===================================================//
	
					//===================================================//	
					const countsAndSums = new Map();
					for (const {treatment_department_name, amount} of array1) {
						const entry = countsAndSums.get(treatment_department_name);
						if (!entry) {
							// Haven't seen this treatment_department_name before
							countsAndSums.set(treatment_department_name, {treatment_department_name, count: 1, sum: amount});
						} else {
							// Update the count and sum for this treatment_department_name
							++entry.count;
							entry.sum += amount;
						}
					}
					// Now you can build the array
					const result = [...countsAndSums.values()].map(({treatment_department_name, count, sum}) => ({treatment_department_name, average: sum }));
					console.log(result);
					//===================================================//
					//===================================================//	
					const Sums = new Map();
					for (const {patient_id, amount} of array1) {
						const entry = Sums.get(patient_id);
						if (!entry) {
							// Haven't seen this patient_id before
							Sums.set(patient_id, {patient_id, count: 1, sum: amount});
						} else {
							// Update the count and sum for this patient_id
							++entry.count;
							entry.sum += amount;
						}
					}
					// Now you can build the array
					const subtotal = [...Sums.values()].map(({patient_id, count, sum}) => ({patient_id, subtotal: sum }));
					console.log(subtotal);
					//===================================================//		

					let result_length = result.length;
					let department_sum ="";
					let particular_dept_name ="";
					let particular_dept_sum ="";
					for (let i = 0; i < result_length; i++) {
						department_sum += 
							"<tr>"+ 
							// "<tr id='"+result.bill_surgeries[i].id+"'>"+
							// surgery_type_name
							"<td class='col-md-6 mb-6'>"+
								"<label style='font-weight: normal;'"+ 
									"class='form-control'>"+
									result[i].treatment_department_name+
								"</label>"+
							"</td>"+
							// charge
							"<td class='col-md-2 mb-2' style='text-align:right'>"+
								"<label style='font-weight: normal;'"+ 
									"class='form-control'>"+
									result[i].average+
								"</label>"+
							"</td>"+
							// cancellation amount
							"<td class='col-md-2 mb-2' style='text-align:right'>"+
								"<input class='form-control' type='text' id='"+
									// data.bill_surgeries[i].surgery_type_info.id+
									"' oninput='return computeNetCharges(this);' placeholder='00'>"+
							"</td>"+
							// net charged
							"<td class='col-md-2 mb-2' style='text-align:right'>"+
								"<label style='font-weight: normal; '"+
									"class='label_sum form-control'>"+
									result[i].average+
								"</label>"+
							"</td>"+
						"</tr>";
						particular_dept_name += result[i].treatment_department_name +"<br>";
						particular_dept_sum += result[i].average+"<br>";
					}
					//===================================================//	
					for (let i = 0; i < hospital_charges_length; i++) {
						hospital_charges += 
                            "<tr id='"+   "'>"+
							 	// surgery_type_name
                                "<td '>"+
                                    data[i].TreatmentDepartment.treatment_department_name+
                                "</td>"+
                                // surgery_type_name
                                "<td '>"+
                                    data[i].TreatmentServiceTypes.treatment_service_type+
                                "</td>"+
                                // charge
                                "<td '>"+
										data[i].HospitalCharges.date+
                                "</td>"+
                                // cancellation amount
                                "<td class='col-md-3 mb-3'>"+
                                        data[i].TreatmentServices.description_name+
                                "</td>"+
                                // net charged
                                "<td 'style='text-align:right'>"+
                                   data[i].HospitalCharges.quantity+
                                "</td>"+
								"<td 'style='text-align:right'>"+
                                   data[i].HospitalCharges.unit_price+
                                "</td>"+
								"<td 'style='text-align:right'>"+
                                   data[i].HospitalCharges.amount+
                                "</td>"+
                            "</tr>";
					}

					formParticulars("show");
					// $("#uuid").val("899e62e3-42ea-4afe-92d9-1d3c8527c329")
					$(".view_div").empty();
					$("#save_button").show()
					$("#form_card_body").append(
						
						"<div class='row view_div'>"+ 
							"<div class='col-md-12'>"+ 
								"<h5 class='text-info'>"+
								"Particulars"+
								"</h5>"+ 
							"</div>"+ 
							"<div class='col-md-12'>"+ 
									
								//////////////////////////////////////////////////////
								"<div class='row invoice-info'>"+	
								"<table class='table table-bordered' id='myTable'>"+
									"<thead>"+
										"<tr>"+
											"<th class='col-md-1 mb-1'>Department</th>"+
											"<th class='col-md-1 mb-1'>Type</th>"+
											"<th class='col-md-2 mb-2'>Date</th>"+
											"<th class='col-md-3 mb-3'>Description</th>"+
											"<th class='col-md-1 mb-1' style='text-align:right'>Quantity</th>"+
											"<th class='col-md-2 mb-2' style='text-align:right'>Unit Price</th>"+
											"<th class='col-md-2 mb-2'style='text-align:right'>Amount</th>"+
										"</tr>"+
									"</thead>"+
									"<tbody class='tbodyclass'>"+
										hospital_charges+
										"<tr>"+
											"<td>"+
											"</td>"+
											"<td>"+
											"</td>"+
											"<td>"+
											"</td>"+
											"<td>"+
											"</td>"+
											"<td>"+
											"</td>"+
											"<td>"+
											"<b>"+
											"Subtotal"+
											"</b>"+
											"</td>"+
											"<td 'style='text-align:right'>"+
											"<b>"+
											subtotal[0].subtotal+
											"</b>"+
											"</td>"+							
										"</tr>"+
									"</tbody>"+
								"</table>"+
								"</div>"+
							
								///////////////////////////////////////////////////////////////////
								//////////////////////////////////////////////////////////////////

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
														// data.bill_registration.first_name +
														" " +
														// data.bill_registration.middle_name +
														" " +
														// data.bill_registration.last_name +
														" " +
														// data.bill_registration.extension_name + "<br> "+
														"Address: " +
														// data.bill_registration.pt_house_number +
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
														"Age: <br> " +
														"Attending Physician: <br><br> " +
													"</div>" +
												
													"<div class='col-sm-4 invoice-col'>" +
														"<b>Inpatient Statement Account</b> <br>" +
														"Date: " + 	
														// current_date+  "<br>" +
														"Bill No: "+ 
														// data.temp_bill_no + "<br><br>" +
			
														"Room No: "+
														//  pt_room_type_name +
														"Room Rate: "+ 
														// pt_room_rate +
														"Date and Time Admittted: "+ 
														// pt_admitted +
														"Date and Time Discharged: 2/22/2014<br><br> " +
													"</div>" +
												"</div>" +
												"<!-- /.row -->" +

												//////////////////////////////////////////////////////
												"<div class='row invoice-info'>"+	
												"<table class='table table-bordered' id='tableParticulars'>"+
													"<thead>"+
														"<tr>"+
															"<th class='col-md-1 mb-1'>Particulars</th>"+
															"<th class='col-md-1 mb-1'style='text-align:right'>Charges</th>"+
															"<th class='col-md-1 mb-1'style='text-align:right'>Cancellation/Return</th>"+
															"<th class='col-md-1 mb-1'style='text-align:right'>Net Charges</th>"+
														"</tr>"+
													"</thead>"+
													"<tbody class='tbodyclass'>"+
														department_sum+ 
													"<tr>"+
														"<td class='col-md-1 mb-1'>"+
														"</td>"+
														"<td class='col-md-1 mb-1'>"+
														"</td>"+
														"<td class='col-md-1 mb-1' style='text-align:right'>"+
														"Subtotal"+
														"</td>"+
														"<td class='col-md-1 mb-1'>"+
															"<input class='form-control' style='text-align:right' type='text' id='subtotalParticulars' name='subtotalParticulars' disabled>"+
															"</input>"+
														"</td>"+							
													"</tr>"+
													"</tbody>"+
												"</table>"+
												"</div>"+

												
												"<button type='button' id='compute' onclick='myFunction()'>Compute</button>"+
											//////////////////////////////////////////////////////
											"<div class='row invoice-info'>"+	
											"<table class='table table-bordered' id='tableParticulars'>"+
												"<thead>"+
													"<tr>"+
														"<th class='col-md-1 mb-1'>Particulars</th>"+
														"<th class='col-md-1 mb-1'style='text-align:right'>Charges</th>"+
														"<th class='col-md-1 mb-1'style='text-align:right'>Cancellation/Return</th>"+
														"<th class='col-md-1 mb-1'style='text-align:right'>Net Charges</th>"+
													"</tr>"+
												"</thead>"+
												"<tbody class='tbodyclass'>"+
													department_sum+ 
												"<tr>"+
													"<td class='col-md-1 mb-1'>"+
													"</td>"+
													"<td class='col-md-1 mb-1'>"+
													"</td>"+
													"<td class='col-md-1 mb-1' style='text-align:right'>"+
													"Subtotal"+
													"</td>"+
													"<td class='col-md-1 mb-1'>"+
													"</td>"+							
												"</tr>"+
												"</tbody>"+
											"</table>"+
											"</div>"+

											
											"<button type='button' id='compute' onclick='myFunction()'>Compute</button>"+
										
										///////////////////////////////////////////////////////////////////
										    ///////////////////////////////////////////////////////////////////
											/////////////////////////////////////////// CANCELLATION RETURN
			
											// VIEW INPATIENT BILL
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
													// doctor_name+ 
												"</div>" +
												"<div class='col-sm-2 invoice-col'  style='text-align:right !important;'>" +
													// doctor_fees+
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
													// doctor_fees+
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
													// total_bill_doctor_fee +
												"</div>" +
												"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
													"00.00" +
												"</div>" +
												"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
													"00.00" +
												"</div>" +
												"<div class='col-sm-2 invoice-col' style='text-align:right !important;'>" +
													// total_bill_doctor_fee +
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
													"<b> "+
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
													//surgeries_name1+
												"</tbody>"+
											"</table>"+
										"</div>"+
								////////////////////////////////////////////////////////////////////
							"</div>"+ 
						"</div>"
						////////////////////////////////////////////////////
					);
				}
			},
			error: function (data) {
				toastr.error(data.responseJSON.detail);
			},
		});
	});
	
	//date attribute
	//get current date to restrict input of future dates
	var current_date = new Date();
	current_date = current_date.toISOString().split("T")[0];
	$("#hire_date").attr("max", current_date);
	$("#birthdate").attr("max", current_date);

	// new bill validation
	$("#form_id").validate({
		submitHandler: function (form, e) {
			e.preventDefault();
			trimInputFields();
			var form_data = new FormData(form);

			if ($("#uuid").val() == "") {
				form_data.append("created_by", localStorage.USER_ID);
				$.ajax({
					url: apiURL + "hospital_bill/",
					type: "POST", // post, put, delete, get
					data: form_data,
					dataType: "json",
					contentType: false,
					processData: false,
					cache: false,
					success: function (data) {
						toastr.success("New Bill has been created.");
						formReset("hide", "");
						resetFileInput();
						loadBillTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			} else {
				form_data.append("updated_by", localStorage.USER_ID);
				if ($("#photo").val() == "") {
					form_data.delete("photo");
				}
				$.ajax({
					url: apiURL + "employee/" + $("#uuid").val(),
					type: "PUT", // post, put, delete, get
					data: form_data,
					dataType: "json",
					contentType: false,
					processData: false,
					cache: false,
					success: function (data) {
						toastr.success("Bill has been updated.");
						formReset("hide", "");
						resetFileInput();
						loadBillTable();
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
						console.log(aData)
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
					data: "bill_registration.patient_admission[0].room_type.room_type_name",
					name: "bill_registration.patient_admission[0].room_type.room_type_name",
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
				url: apiURL + "inpatients/datatable",
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



	$(window).resize(function () {
		$("table.dataTable").resize();
	});

	//New Data
	$("#new_record").on("click", function () {
		formReset("new", "New Bill");
	});

	//view info
	viewData = (id, type) => {
		$.ajax({
			url: apiURL + "employee/" + id,
			type: "GET", // post, put, delete, get
			dataType: "json",
			success: function (data) {
				if (data.middle_name == null) {
					var middle_name = "";
				} else {
					var middle_name = data.middle_name;
				}
				if (data.extension_name == null) {
					var extension_name = " ";
				} else {
					var extension_name = data.extension_name;
				}
				if (data.house_number == null) {
					var house_number = " ";
				} else {
					var house_number = data.house_number;
				}
				if (data.street == null) {
					var street = " ";
				} else {
					var street = data.street;
				}
				if (type == 0) {
					formReset("show", "View Bill Information");
					$(".view_div").empty();
					$("#form_card_body").append(
						"<div class='row view_div'>" +
							"<div class='col-md-4 text-center'>" +
							"<div class='card'>" +
							"<div class='card-body'>" +
							"<img src='http://localhost:8000/assets/ar_ap/" +
							data.photo +
							"'class='rounded-circle' width='150'></img><br>" +
							"<label>" +
							data.first_name +
							" " +
							data.last_name +
							"</label>" +
							"<p>" +
							data.job +
							"</p>" +
							"</div>" +
							"</div>" +
							"</div>" +
							"<div class='col-md-8'>" +
							"<div class='col-md-12'>" +
							"<h5 class='text-info'>Particulars</h5>" +
							"</div>" +
							"<div class='col-md-12'>" +
							"<table class='table table-borderless view-info-table'>" +
							"<tr>" +
							"<th>Full Name</th>" +
							"<td>" +
							data.first_name +
							" " +
							middle_name +
							" " +
							data.last_name +
							" " +
							extension_name +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Gender</th>" +
							"<td>" +
							data.gender +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Birthdate</th>" +
							"<td>" +
							moment(data.birthdate).format("MMMM D, YYYY") +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Birthplace</th>" +
							"<td>" +
							data.birthplace +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Phone Number</th>" +
							"<td>" +
							data.contact_number +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Email Address</th>" +
							"<td>" +
							data.email +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Civil Status</th>" +
							"<td>" +
							data.civil_status +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Address</th>" +
							"<td>" +
							house_number +
							" " +
							street +
							" " +
							data.barangay +
							" " +
							data.city +
							" " +
							data.province +
							" " +
							data.country +
							" " +
							"</td>" +
							"</tr>" +
							"</table>" +
							"</div>" +
							"<div class='col-md-12'>" +
							"<h5 class='text-info'>Job Information</h5>" +
							"</div>" +
							"<div class='col-md-12'>" +
							"<table class='table table-borderless view-info-table'>" +
							"<tr>" +
							"<th>Department</th>" +
							"<td>" +
							data.department +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Job</th>" +
							"<td>" +
							data.job +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Manager</th>" +
							"<td>" +
							data.manager +
							"</td>" +
							"</tr>" +
							"<tr>" +
							"<th>Hired Date</th>" +
							"<td>" +
							moment(data.hire_date).format("MMMM D, YYYY") +
							"</td>" +
							"</tr>" +
							"</table>" +
							"</div>" +
							"</div>" +
							"</div>"
					);
				} else if (type == 1) {
					formReset("update", "Update Bill Information");
					$("#uuid").val(data.id);
					$("#photo_path_placeholder").attr("src", baseURL + data.photo);
					$('[for="photo"]').removeClass("form-required-field");
					$("#photo").removeAttr("required");
					$("#first_name").val(data.first_name);
					$("#middle_name").val(middle_name);
					$("#last_name").val(data.last_name);
					$("#extension_name").val(extension_name);
					$("#birthdate").val(data.birthdate);
					$("#birthplace").val(data.birthplace);
					$("#gender").val(data.gender);
					$("#civil_status").val(data.civil_status);
					$("#house_number").val(data.house_number);
					$("#street").val(data.street);
					$("#barangay").val(data.barangay);
					$("#city").val(data.city);
					$("#province").val(data.province);
					$("#country").val(data.country);
					$("#contact_number").val(data.contact_number);
					$("#email").val(data.email);
					$("#department").val(data.department);
					$("#job").val(data.job);
					$("#manager").val(data.manager);
					$("#hire_date").val(data.hire_date);
				}
			},
			error: function (data) {
				toastr.error(data.responseJSON.detail);
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
					url: apiURL + "employee/" + id + "/" + localStorage.USER_ID,
					type: "DELETE", // post, put, delete, get
					dataType: "json",
					success: function (data) {
						toastr.success("Record has been deactivated.");
						$('#modal_delete').modal('hide')
						loadBillTable();
					},
					error: function (data) {
						toastr.error(data.responseJSON.detail);
					},
				});
			},
		});

	};

	
	

});
