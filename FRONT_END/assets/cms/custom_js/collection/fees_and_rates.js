$(document).ready(function () {
  $(window).resize(function () {
    $("table.dataTable").resize();
  });
  //TREATEMENT TYPE TABLE
  loadTreatmentTypesTable = () => {
    $("#treatment_types_table").dataTable().fnClearTable();
    $("#treatment_types_table").dataTable().fnDraw();
    $("#treatment_types_table").dataTable().fnDestroy();
    $("#treatment_types_table").dataTable({
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
                columns: [0, 1, 2, 3],
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
          data: "name",
          name: "name",

          searchable: true,
        },
        {
          data: "description",
          name: "description",

          searchable: true,
        },
        {
          data: null,
          render: function (aData, type, row) {
            let fee = "";

            fee += "₱ " + aData.fee.toLocaleString();

            return fee;
          },

          searchable: true,
        },
        {
          data: null,
          render: function (aData, type, row) {
            let status = "";

            if (aData.status != "Inactive") {
              status +=
                '<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Active</span>';
            } else {
              status +=
                '<span class="badge badge-danger p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Inactive</span>';
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
                '<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
                aData["id"] +
                "',0)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-edit mr-1 "></i>' +
                "</div>" +
                "<div>Edit Treatment Type</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" id="delete_data_button" onClick="return deleteData(\'' +
                aData["id"] +
                "',0)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-trash-alt mr-1 "></i>' +
                "</div>" +
                "<div>Delete Treatment Type</div>" +
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
        url: apiURL + "treatment_type/datatable",
        dataSrc: "",
        type: "GET",
        error: function (xhr, error, code) {
          // console.log(xhr);
          // console.log(code);
        },
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        let fee = "";

        fee += "₱ " + aData.fee.toLocaleString();

        let status = "";
        if (aData.status != "Inactive") {
          status += '<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Active</span>';
        } else {
          status +=
            '<span class="badge badge-danger p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Inactive</span>';
        }

        let buttons = "";
        if (aData.status != "Inactive") {
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
            '<i class="fas fa-edit mr-1"></i>' +
            "</div>" +
            "<div>Edit Treatment Type</div>" +
            "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-trash-alt mr-1"></i>' +
            "</div>" +
            "<div>Delete Treatment Type</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        } else if (aData.status == "Inactive") {
          buttons += "<i>No available action</i>";
        }
        $("td:eq(0)", nRow).html(aData["name"]);
        $("td:eq(1)", nRow).html(aData["description"]);
        $("td:eq(2)", nRow).html(fee);
        $("td:eq(3)", nRow).html(status);
        $("td:eq(4)", nRow).html(buttons);
      },
      drawCallback: function (settings) {},
    });
  };
  loadTreatmentTypesTable();

  //SURGERY TYPE TABLE
  loadSurgeryTypesTable = () => {
    $("#surgery_types_table").dataTable().fnClearTable();
    $("#surgery_types_table").dataTable().fnDraw();
    $("#surgery_types_table").dataTable().fnDestroy();
    $("#surgery_types_table").dataTable({
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
                columns: [0, 1, 2, 3],
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
          data: "name",
          name: "name",

          searchable: true,
        },
        {
          data: "description",
          name: "description",

          searchable: true,
        },
        {
          data: null,
          render: function (aData, type, row) {
            let fee = "";

            fee += "₱ " + aData.fee.toLocaleString();

            return fee;
          },

          searchable: true,
        },
        {
          data: null,
          render: function (aData, type, row) {
            let status = "";

            if (aData.status != "Inactive") {
              status +=
                '<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Active</span>';
            } else {
              status +=
                '<span class="badge badge-danger p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Inactive</span>';
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
                '<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
                aData["id"] +
                "',1)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-edit mr-1"></i>' +
                "</div>" +
                "<div>Edit Surgery Type</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
                aData["id"] +
                "',1)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-trash-alt mr-1"></i>' +
                "</div>" +
                "<div>Delete Surgery Type</div>" +
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
        url: apiURL + "surgery_type/datatable",
        dataSrc: "",
        type: "GET",
        error: function (xhr, error, code) {
          // console.log(xhr);
          // console.log(code);
        },
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        let fee = "";

        fee += "₱ " + aData.fee.toLocaleString();

        let status = "";
        if (aData.status != "Inactive") {
          status += '<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Active</span>';
        } else {
          status +=
            '<span class="badge badge-danger p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Inactive</span>';
        }

        let buttons = "";
        if (aData.status != "Inactive") {
          buttons +=
            '<div class="text-center dropdown">' +
            '<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i>' +
            "</div>" +
            '<div class="dropdown-menu dropdown-menu-right">' +
            '<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-edit mr-1"></i>' +
            "</div>" +
            "<div>Edit Surgery Type</div>" +
            "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-trash-alt mr-1"></i>' +
            "</div>" +
            "<div>Delete Surgery Type</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        } else if (aData.status == "Inactive") {
          buttons += "<i>No available action</i>";
        }
        $("td:eq(0)", nRow).html(aData["name"]);
        $("td:eq(1)", nRow).html(aData["description"]);
        $("td:eq(2)", nRow).html(fee);
        $("td:eq(3)", nRow).html(status);
        $("td:eq(4)", nRow).html(buttons);
      },
      drawCallback: function (settings) {},
    });
  };
  loadSurgeryTypesTable();

  //LAB TEST TYPE TABLE
  loadLabTestTypesTable = () => {
    $("#lab_test_types_table").dataTable().fnClearTable();
    $("#lab_test_types_table").dataTable().fnDraw();
    $("#lab_test_types_table").dataTable().fnDestroy();
    $("#lab_test_types_table").dataTable({
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
                columns: [0, 1, 2, 3],
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
          data: "name",
          name: "name",

          searchable: true,
        },
        {
          data: "description",
          name: "description",

          searchable: true,
        },
        {
          data: null,
          render: function (aData, type, row) {
            let fee = "";

            fee += "₱ " + aData.fee.toLocaleString();

            return fee;
          },

          searchable: true,
        },
        {
          data: null,
          render: function (aData, type, row) {
            let status = "";

            if (aData.status != "Inactive") {
              status +=
                '<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Active</span>';
            } else {
              status +=
                '<span class="badge badge-danger p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Inactive</span>';
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
                '<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
                aData["id"] +
                "',2)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-edit mr-1"></i>' +
                "</div>" +
                "<div>Edit Lab Test Type</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
                aData["id"] +
                "',2)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-trash-alt mr-1"></i>' +
                "</div>" +
                "<div>Delete Lab Test Type</div>" +
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
        url: apiURL + "lab_test_type/datatable",
        dataSrc: "",
        type: "GET",
        error: function (xhr, error, code) {
          // console.log(xhr);
          // console.log(code);
        },
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        let fee = "";

        fee += "₱ " + aData.fee.toLocaleString();

        let status = "";
        if (aData.status != "Inactive") {
          status += '<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Active</span>';
        } else {
          status +=
            '<span class="badge badge-danger p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Inactive</span>';
        }

        let buttons = "";
        if (aData.status != "Inactive") {
          buttons +=
            '<div class="text-center dropdown">' +
            '<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i>' +
            "</div>" +
            '<div class="dropdown-menu dropdown-menu-right">' +
            '<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
            aData["id"] +
            "',2)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-edit mr-1"></i>' +
            "</div>" +
            "<div>Edit Lab Test Type</div>" +
            "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
            aData["id"] +
            "',2)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-trash-alt mr-1"></i>' +
            "</div>" +
            "<div>Delete Lab Test Type</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        } else if (aData.status == "Inactive") {
          buttons += "<i>No available action</i>";
        }
        $("td:eq(0)", nRow).html(aData["name"]);
        $("td:eq(1)", nRow).html(aData["description"]);
        $("td:eq(2)", nRow).html(fee);
        $("td:eq(3)", nRow).html(status);
        $("td:eq(4)", nRow).html(buttons);
      },
      drawCallback: function (settings) {},
    });
  };
  loadLabTestTypesTable();

  //ROOM TYPE TABLE
  loadRoomTypesTable = () => {
    $("#room_types_table").dataTable().fnClearTable();
    $("#room_types_table").dataTable().fnDraw();
    $("#room_types_table").dataTable().fnDestroy();
    $("#room_types_table").dataTable({
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
                columns: [0, 1, 2, 3],
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
          data: "name",
          name: "name",

          searchable: true,
        },
        {
          data: "description",
          name: "description",

          searchable: true,
        },
        {
          data: null,
          render: function (aData, type, row) {
            let fee = "";

            fee += "₱ " + aData.fee.toLocaleString();

            return fee;
          },

          searchable: true,
        },
        {
          data: null,
          render: function (aData, type, row) {
            let status = "";

            if (aData.status != "Inactive") {
              status +=
                '<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Active</span>';
            } else {
              status +=
                '<span class="badge badge-danger p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Inactive</span>';
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
                '<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
                aData["id"] +
                "',3)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-edit mr-1"></i>' +
                "</div>" +
                "<div>Edit Room Type</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
                aData["id"] +
                "',3)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-trash-alt mr-1"></i>' +
                "</div>" +
                "<div>Delete Room Type</div>" +
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
        url: apiURL + "room_type/datatable",
        dataSrc: "",
        type: "GET",
        error: function (xhr, error, code) {
          // console.log(xhr);
          // console.log(code);
        },
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        let fee = "";

        fee += "₱ " + aData.fee.toLocaleString();

        let status = "";
        if (aData.status != "Inactive") {
          status += '<span class="badge badge-success p-2 w-100"><i class="nav-icon fas fa-check mr-1"></i>Active</span>';
        } else {
          status +=
            '<span class="badge badge-danger p-2 w-100"><i class="nav-icon fas fa-times mr-1"></i>Inactive</span>';
        }

        let buttons = "";
        if (aData.status != "Inactive") {
          buttons +=
            '<div class="text-center dropdown">' +
            '<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i>' +
            "</div>" +
            '<div class="dropdown-menu dropdown-menu-right">' +
            '<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
            aData["id"] +
            "',3)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-edit mr-1"></i>' +
            "</div>" +
            "<div>Edit Room Type</div>" +
            "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
            aData["id"] +
            "',3)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-trash-alt mr-1"></i>' +
            "</div>" +
            "<div>Delete Room Type</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        } else if (aData.status == "Inactive") {
          buttons += "<i>No available action</i>";
        }
        $("td:eq(0)", nRow).html(aData["name"]);
        $("td:eq(1)", nRow).html(aData["description"]);
        $("td:eq(2)", nRow).html(fee);
        $("td:eq(3)", nRow).html(status);
        $("td:eq(4)", nRow).html(buttons);
      },
      drawCallback: function (settings) {},
    });
  };
  loadRoomTypesTable();

  $("#new_record").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $("#treatment_types_form")[0].reset();
    $("#surgery_types_form")[0].reset();
    $("#lab_test_types_form")[0].reset();
    $("#room_types_form")[0].reset();
    $("#div_edit_treatment_type").hide();
    $("#div_edit_surgery_type").hide();
    $("#div_edit_lab_test_type").hide();
    $("#div_edit_room_type").hide();
    $("#div_form").show();
  });

  $(".cancel_type_form").on("click", function () {
    $("#treatment_types_form").validate().resetForm();
    $("#surgery_types_form").validate().resetForm();
    $("#lab_test_types_form").validate().resetForm();
    $("#room_types_form").validate().resetForm();
    $("#div_edit_treatment_type").hide();
    $("#div_edit_surgery_type").hide();
    $("#div_edit_lab_test_type").hide();
    $("#div_edit_room_type").hide();
    $("#div_form").hide();
  });

  // new room type validation
  $("#treatment_types_form").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      $.ajax({
        url: apiURL + "treatment_type/",
        type: "POST", // post, put, delete, get
        data: JSON.stringify({
          name: $("#treatment_type_name").val(),
          fee: $("#treatment_fee").val(),
          description: $("#treatment_description").val(),
          created_by: localStorage.USER_ID,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          toastr.success("New treatment type has been created.");
          $("#treatment_types_form").validate().resetForm();
          $("#treatment_types_form")[0].reset();
          loadTreatmentTypesTable();
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

  // new surgery type validation
  $("#surgery_types_form").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      $.ajax({
        url: apiURL + "surgery_type/",
        type: "POST", // post, put, delete, get
        data: JSON.stringify({
          name: $("#surgery_type_name").val(),
          fee: $("#surgery_fee").val(),
          description: $("#surgery_description").val(),
          created_by: localStorage.USER_ID,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          toastr.success("New surgery type has been created.");
          $("#surgery_types_form").validate().resetForm();
          $("#surgery_types_form")[0].reset();
          loadSurgeryTypesTable();
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

  // new lab test type validation
  $("#lab_test_types_form").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      $.ajax({
        url: apiURL + "lab_test_type/",
        type: "POST", // post, put, delete, get
        data: JSON.stringify({
          name: $("#lab_test_type_name").val(),
          fee: $("#lab_test_fee").val(),
          description: $("#lab_test_description").val(),
          created_by: localStorage.USER_ID,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          toastr.success("New lab test type has been created.");
          $("#lab_test_types_form").validate().resetForm();
          $("#lab_test_types_form")[0].reset();
          loadLabTestTypesTable();
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

  // new lab test type validation
  $("#room_types_form").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      $.ajax({
        url: apiURL + "room_type/",
        type: "POST", // post, put, delete, get
        data: JSON.stringify({
          name: $("#room_type_name").val(),
          fee: $("#room_fee").val(),
          description: $("#room_description").val(),
          created_by: localStorage.USER_ID,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          toastr.success("New room type has been created.");
          $("#room_types_form").validate().resetForm();
          $("#room_types_form")[0].reset();
          loadRoomTypesTable();
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


  //view type
  viewData = (id, type) => {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $(".cancel_type_form").trigger("click");
    if (type == 0) {
      $("#div_edit_surgery_type").hide();
      $("#div_edit_lab_test_type").hide();
      $("#div_edit_room_type").hide();
      $("#div_edit_treatment_type").show();

      $.ajax({
        url: apiURL + "treatment_type/" + id,
        type: "GET", // post, put, delete, get
        dataType: "json",
        success: function (data) {
          $("#treatment_type_uuid").val(data.id);
          $("#edit_treatment_type_name").val(data.name);
          $("#edit_treatment_type_fee").val(data.fee);
          $("#edit_treatment_type_description").val(data.description);
        },
        error: function (data) {
          toastr.error(data.responseJSON.detail);
        },
      });
    }
    if (type == 1) {
      $("#div_edit_lab_test_type").hide();
      $("#div_edit_room_type").hide();
      $("#div_edit_treatment_type").hide();
      $("#div_edit_surgery_type").show();
      $.ajax({
        url: apiURL + "surgery_type/" + id,
        type: "GET", // post, put, delete, get
        dataType: "json",
        success: function (data) {
          $("#surgery_type_uuid").val(data.id);
          $("#edit_surgery_type_name").val(data.name);
          $("#edit_surgery_type_fee").val(data.fee);
          $("#edit_surgery_type_description").val(data.description);
        },
        error: function (data) {
          toastr.error(data.responseJSON.detail);
        },
      });
    }
    if (type == 2) {
      $("#div_edit_room_type").hide();
      $("#div_edit_treatment_type").hide();
      $("#div_edit_surgery_type").hide();
      $("#div_edit_lab_test_type").show();
      $.ajax({
        url: apiURL + "lab_test_type/" + id,
        type: "GET", // post, put, delete, get
        dataType: "json",
        success: function (data) {
          $("#lab_test_type_uuid").val(data.id);
          $("#edit_lab_test_type_name").val(data.name);
          $("#edit_lab_test_type_fee").val(data.fee);
          $("#edit_lab_test_type_description").val(data.description);
        },
        error: function (data) {
          toastr.error(data.responseJSON.detail);
        },
      });
    }
    if (type == 3) {
      $("#div_edit_treatment_type").hide();
      $("#div_edit_surgery_type").hide();
      $("#div_edit_lab_test_type").hide();
      $("#div_edit_room_type").show();
      $.ajax({
        url: apiURL + "room_type/" + id,
        type: "GET", // post, put, delete, get
        dataType: "json",
        success: function (data) {
          $("#room_type_uuid").val(data.id);
          $("#edit_room_type_name").val(data.name);
          $("#edit_room_type_fee").val(data.fee);
          $("#edit_room_type_description").val(data.description);
        },
        error: function (data) {
          toastr.error(data.responseJSON.detail);
        },
      });
    }
  };

  //update type
  $("#form_edit_treatment_type").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      $.ajax({
        url: apiURL + "treatment_type/" + $("#treatment_type_uuid").val(),
        type: "PUT", // post, put, delete, get
        data: JSON.stringify({
          name: $("#edit_treatment_type_name").val(),
          fee: $("#edit_treatment_type_fee").val(),
          description: $("#edit_treatment_type_description").val(),
          updated_by: localStorage.USER_ID,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          toastr.success(data);
          loadTreatmentTypesTable();
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

  $("#form_edit_surgery_type").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      $.ajax({
        url: apiURL + "surgery_type/" + $("#surgery_type_uuid").val(),
        type: "PUT", // post, put, delete, get
        data: JSON.stringify({
          name: $("#edit_surgery_type_name").val(),
          fee: $("#edit_surgery_type_fee").val(),
          description: $("#edit_surgery_type_description").val(),
          updated_by: localStorage.USER_ID,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          toastr.success(data);
          loadSurgeryTypesTable();
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

  $("#form_edit_lab_test_type").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      $.ajax({
        url: apiURL + "lab_test_type/" + $("#lab_test_type_uuid").val(),
        type: "PUT", // post, put, delete, get
        data: JSON.stringify({
          name: $("#edit_lab_test_type_name").val(),
          fee: $("#edit_lab_test_type_fee").val(),
          description: $("#edit_lab_test_type_description").val(),
          updated_by: localStorage.USER_ID,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          toastr.success(data);
          loadLabTestTypesTable();
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

  $("#form_edit_room_type").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      $.ajax({
        url: apiURL + "room_type/" + $("#room_type_uuid").val(),
        type: "PUT", // post, put, delete, get
        data: JSON.stringify({
          name: $("#edit_room_type_name").val(),
          fee: $("#edit_room_type_fee").val(),
          description: $("#edit_room_type_description").val(),
          updated_by: localStorage.USER_ID,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
          toastr.success(data);
          loadRoomTypesTable();
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

  var type_url
  //delete type
  deleteData = (id, type) => {
    $("#delete_uuid").val(id);
   
    $("#modal_delete").modal("show");
    if (type == 0) {
      type_url = "treatment_type/";
      console.log(type_url)
    } else if (type == 1) {
      type_url = "surgery_type/";
      console.log(type_url)
    } else if (type == 2) {
      type_url = "lab_test_type/";
    } else if (type == 3) {
      type_url = "room_type/";
    }
    
  };

  $("#form_delete").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();
      $.ajax({
        url:
          apiURL +
          type_url +
          $("#delete_uuid").val() +
          "/" +
          localStorage.USER_ID,
        type: "DELETE", // post, put, delete, get
        dataType: "json",
        success: function (data) {
          toastr.success(data);
          $("#delete_uuid").val("");
          $("#modal_delete").modal("hide");
          loadTreatmentTypesTable();
          loadSurgeryTypesTable();
          loadLabTestTypesTable();
          loadRoomTypesTable();
        },
        error: function (data) {
          toastr.error(data.responseJSON.detail);
        },
      });
    },
  });
});
