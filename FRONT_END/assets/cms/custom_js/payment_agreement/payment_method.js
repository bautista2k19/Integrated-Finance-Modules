$(document).ready(function () {
  // new payment method validation
  $("#form_id").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      if ($("#uuid").val() == "") {
        $.ajax({
          url: apiURL + "payment_method/",
          type: "POST", // post, put, delete, get
          data: JSON.stringify({
            method_name: $("#method_name").val(),
            description: $("#description").val(),
            created_by: localStorage.USER_ID,
          }),
          dataType: "json",
          contentType: "application/json",
          success: function (data) {
            toastr.success("New payment method has been created.");
            formReset("hide", "");
            loadPaymentMethodTable();
          },
          error: function (data) {
            toastr.error(data.responseJSON.detail);
          },
        });
      } else {
        $.ajax({
          url: apiURL + "payment_method/" + $("#uuid").val(),
          type: "PUT", // post, put, delete, get
          data: JSON.stringify({
            method_name: $("#method_name").val(),
            description: $("#description").val(),
            updated_by: localStorage.USER_ID,
          }),
          contentType: "application/json",
          success: function (data) {
            toastr.success("Payment Method has been updated.");
            formReset("hide", "");

            loadPaymentMethodTable();
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
  loadPaymentMethodTable = () => {
    $("#payment_method_table").dataTable().fnClearTable();
    $("#payment_method_table").dataTable().fnDraw();
    $("#payment_method_table").dataTable().fnDestroy();
    $("#payment_method_table").dataTable({
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
          data: "method_name",
          name: "method_name",

          searchable: true,
        },
        {
          data: null,
          render: function (aData, type, row) {
            let description = "";

            if (aData.description == "") {
              description += "<i>No description</i>";
            } else {
              description += aData.description;
            }
            return description;
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
                "<div>Edit Payment Method</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
                aData["id"] +
                "')\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-trash-alt mr-1"></i>' +
                "</div>" +
                "<div>Delete Payment Method</div>" +
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
        url: apiURL + "payment_method/datatable",
        dataSrc: "",
        type: "GET",
        error: function (xhr, error, code) {
          // console.log(xhr);
          // console.log(code);
        },
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        let description = "";

        if (aData.description == "") {
          description += "<i>No description</i>";
        } else {
          description += aData.description;
        }

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
            "<div>Edit Payment Method</div>" +
            "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
            aData["id"] +
            "')\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-trash-alt mr-1"></i>' +
            "</div>" +
            "<div>Delete Payment Method</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        } else if (aData.status == "Inactive") {
          buttons += "<i>No available action</i>";
        }
        $("td:eq(0)", nRow).html(aData["method_name"]);
        $("td:eq(1)", nRow).html(description);
        $("td:eq(2)", nRow).html(status);
        $("td:eq(3)", nRow).html(buttons);
      },
      drawCallback: function (settings) {},
    });
  };
  loadPaymentMethodTable();

  $(window).resize(function () {
    $("table.dataTable").resize();
  });

  //New Data
  $("#new_record").on("click", function () {
    formReset("new", "New Payment Method");
  });

  //update info
  viewData = (id, type) => {
    $.ajax({
      url: apiURL + "payment_method/" + id,
      type: "GET", // post, put, delete, get
      dataType: "json",
      success: function (data) {
        if (type == 1) {
          formReset("update", "Update Payment Method");
          $("#uuid").val(data.id);
          $("#method_name").val(data.method_name);
          $("#description").val(data.description);
        }
      },
      error: function (data) {
        toastr.error(data.responseJSON.detail);
      },
    });
  };

  var delete_id
  deleteData = (id) => {
    $("#modal_delete").modal("show");
    delete_id = id
    
  };

  $("#form_delete").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();
      $.ajax({
        url:
          apiURL +
          "payment_method/" +
          delete_id +
          "/" +
          localStorage.USER_ID,
        type: "DELETE", // post, put, delete, get
        dataType: "json",
        success: function (data) {
          toastr.success("Record has been deactivated.");
          $("#modal_delete").modal("hide");
          loadPaymentMethodTable();
        },
        error: function (data) {
          toastr.error(data.responseJSON.detail);
        },
      });
    },
  });
});
