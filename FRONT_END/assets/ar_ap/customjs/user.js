$(document).ready(function () {
  
  // new user validation
  $("#form_id").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      if ($("#uuid").val() == "") {
        console.log("creating")
        $.ajax({
          url: apiURL + "user/",
          type: "POST", // post, put, delete, get
          data: JSON.stringify({
            employee_id: $("#employee_id").val(),
            username: $("#username").val(),
            user_type: $("#user_type").val(),
            password: "P@ssword101",
            created_by: localStorage.USER_ID
          }),
          dataType: "json",
          contentType:"application/json",
          success: function (data) {
            toastr.success("New user has been created.");
            formReset("hide", "");
            
            loadUserTable();
          },
          error: function (data) {
            toastr.error(data.responseJSON.detail);
          },
        });
      } else {
        $.ajax({
          url: apiURL + "user/" + $("#uuid").val(),
          type: "PUT", // post, put, delete, get
          data: JSON.stringify({
            employee_id: $("#employee_id").val(),
            username: $("#username").val(),
            user_type: $("#user_type").val(),
            updated_by: localStorage.USER_ID
          }),
          contentType:"application/json",
          success: function (data) {
            toastr.success("User has been updated.");
            formReset("hide", "");
            
            loadUserTable();
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
  loadUserTable = () => {
    $("#user_table").dataTable().fnClearTable();
    $("#user_table").dataTable().fnDraw();
    $("#user_table").dataTable().fnDestroy();
    $("#user_table").dataTable({
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
                columns: [0, 1, 2, 3, 4, 5, 6, 7],
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
						full_name +=
							aData.employee_information.first_name + " " + aData.employee_information.last_name 
						return full_name;
					},
          
					searchable: true,
				},
        {
          data: "username",
          name: "username",
          
          searchable: true,
        },
        {
          data: "user_type",
          name: "user_type",
          
          searchable: true,
        },
        {
          data: null,
          render: function (aData, type, row) {
            let status = "";

            if (aData.status != "Inactive") {
              status +=
                '<span class="badge badge-success p-2 w-100">Active</span>';
            } else {
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
            
            if (aData.status != "Inactive") {
              buttons +=
                    '<div class="text-center dropdown">' +
                    '<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
                    '<i class="fas fa-ellipsis-v"></i>' +
                    "</div>" +
                    '<div class="dropdown-menu dropdown-menu-right">'+
                      '<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
                      aData["id"] +
                      "',1)\">" +
                      '<div style="width: 2rem">' +
                      '<i class="fas fa-edit mr-1 text-info"></i>' +
                      "</div>" +
                      "<div>Edit User</div>" +
                      "</div>"+
                      '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
                      aData["id"] +
                      "')\">" +
                      '<div style="width: 2rem">' +
                      '<i class="fas fa-trash-alt mr-1 text-danger"></i>' +
                      "</div>" +
                      "<div>Delete User</div>" +
                      "</div>"+
                  
                  "</div>" + "</div>"
                }
            else if(aData.status == "Inactive"){
              buttons += "<i>No available action</i>"
            }
            return buttons; // same class in i element removed it from a element
          },
          sortable: false
        },
      ],

      ajax: {
        url: apiURL + "user/datatable",
        dataSrc: "",
        type: "GET",
        error: function (xhr, error, code) {
					// console.log(xhr);
					// console.log(code);
				},
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        let full_name = "";
						full_name +=
							aData.employee_information.first_name + " " + aData.employee_information.last_name 

        let status = "";

        if (aData.status != "Inactive") {
          status +=
            '<span class="badge badge-success p-2 w-100">Active</span>';
        } else {
          status +=
            '<span class="badge badge-danger p-2 w-100">Inactive</span>';
        }

        let buttons = "";
        if (aData.status != "Inactive") {
        buttons +=
							'<div class="text-center dropdown">' +
							'<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
							'<i class="fas fa-ellipsis-v"></i>' +
							"</div>" +
							'<div class="dropdown-menu dropdown-menu-right">'+
								'<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
								aData["id"] +
								"',1)\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-edit mr-1 text-info"></i>' +
								"</div>" +
								"<div>Edit User</div>" +
								"</div>"+
								'<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
								aData["id"] +
								"')\">" +
								'<div style="width: 2rem">' +
								'<i class="fas fa-trash-alt mr-1 text-danger"></i>' +
								"</div>" +
								"<div>Delete User</div>" +
								"</div>"+
						
						"</div>" + "</div>"
          }
          else if(aData.status == "Inactive"){
            buttons += "<i>No available action</i>"
          }
        $("td:eq(0)", nRow).html(full_name);
        $("td:eq(1)", nRow).html(aData["username"]);
        $("td:eq(2)", nRow).html(aData["user_type"]);
        $("td:eq(3)", nRow).html(status);
        $("td:eq(4)", nRow).html(buttons);
      },
      drawCallback: function (settings) {},
    });
  };
  loadUserTable();

  $(window).resize(function () {
    $("table.dataTable").resize();
  });

  //New Data
  $("#new_record").on("click", function () {
    formReset("new", "New User");
    loadEmployee()
  });

  // function to load all employees
  loadEmployee = () => {
    $.ajax({
      url: apiURL + "employee/find_all",
      dataSrc: "",
      type: "GET",
      success: function (data) {
        $("#employee_id").empty();
        $.each(data, function (i, dataOptions) {
          var options = "";

          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.first_name +
            " " +
            dataOptions.last_name;
          ("</option>");
          $("#employee_id").append(options);
        });

        $("#employee_id").append('<option value="" selected>Select Employee</option>');
      },
      error: function ({ responseJSON }) {
        // toastr.error(data.responseJSON.detail);
      },
    });
  };
  loadEmployee();

  //update info
  viewData = (id, type) => {
    $.ajax({
      url: apiURL + "user/" + id,
      type: "GET", // post, put, delete, get
      dataType: "json",
      success: function (data) {
        if (type == 1) {
          formReset("update", "Update User Credentials");
          $("#uuid").val(data.id);
          $("#employee_id").val(data.employee_id).trigger("change");
          $("#username").val(data.username);
          $("#user_type").val(data.user_type);
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
          url: apiURL + "user/" + id + "/" + localStorage.USER_ID,
          type: "DELETE", // post, put, delete, get
          dataType: "json",
          success: function (data) {
            toastr.success("Record has been deactivated.");
            $('#modal_delete').modal('hide')
            loadUserTable();
          },
          error: function (data) {
            toastr.error(data.responseJSON.detail);
          },
        });
			},
		});
	};
});
