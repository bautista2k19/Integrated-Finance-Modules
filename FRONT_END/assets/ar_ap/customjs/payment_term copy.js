$(document).ready(function () {
  // new payment_term validation
  $("#form_id").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      if ($("#uuid").val() == "") {
        $.ajax({
          url: apiURL + "payment_term/",
          type: "POST", // post, put, delete, get
          data: JSON.stringify({
            term_name: $("#term_name").val(),
            description: $("#description").val(),
            created_by: $.cookie("USER_ID"),
          }),
          dataType: "json",
          contentType: "application/json",
          success: function (data) {
            toastr.success("New payment_term has been created.");
            formReset("hide", "");
            loadPaymentTermTable();
          },
          error: function (data) {
            toastr.error(data.responseJSON.detail);
          },
        });
      } else {
        $.ajax({
          url: apiURL + "payment_term/" + $("#uuid").val(),
          type: "PUT", // post, put, delete, get
          data: JSON.stringify({
            term_name: $("#term_name").val(),
            description: $("#description").val(),
            updated_by: $.cookie("USER_ID"),
          }),
          contentType: "application/json",
          success: function (data) {
            toastr.success("Payment Term has been updated.");
            formReset("hide", "");

            loadPaymentTermTable();
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
  loadPaymentTermTable = () => {
    $("#payment_term_table").dataTable().fnClearTable();
    $("#payment_term_table").dataTable().fnDraw();
    $("#payment_term_table").dataTable().fnDestroy();
    $("#payment_term_table").dataTable({
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
          data: "term_name",
          name: "term_name",

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
                '<div class="dropdown-menu dropdown-menu-right">' +
                '<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
                aData["id"] +
                "',1)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-edit mr-1"></i>' +
                "</div>" +
                "<div>Edit Payment Term</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
                aData["id"] +
                "')\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-trash-alt mr-1"></i>' +
                "</div>" +
                "<div>Delete Payment Term</div>" +
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
        url: apiURL + "payment_term/datatable",
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
          status += '<span class="badge badge-success p-2 w-100">Active</span>';
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
            '<div class="dropdown-menu dropdown-menu-right">' +
            '<div class="dropdown-item d-flex" role="button" onClick="return viewData(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-edit mr-1"></i>' +
            "</div>" +
            "<div>Edit Payment Term</div>" +
            "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
            aData["id"] +
            "')\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-trash-alt mr-1"></i>' +
            "</div>" +
            "<div>Delete Payment Term</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        } else if (aData.status == "Inactive") {
          buttons += "<i>No available action</i>";
        }
        $("td:eq(0)", nRow).html(aData["term_name"]);
        $("td:eq(1)", nRow).html(description);
        $("td:eq(2)", nRow).html(status);
        $("td:eq(3)", nRow).html(buttons);
      },
      drawCallback: function (settings) {},
    });
  };
  loadPaymentTermTable();

  $(window).resize(function () {
    $("table.dataTable").resize();
  });

  //New Data
  $("#new_record").on("click", function () {
    formReset("new", "New Payment Term");
  });

  //update info
  viewData = (id, type) => {
    $.ajax({
      url: apiURL + "payment_term/" + id,
      type: "GET", // post, put, delete, get
      dataType: "json",
      success: function (data) {
        if (type == 1) {
          formReset("update", "Update Payment Term");
          $("#uuid").val(data.id);
          $("#term_name").val(data.term_name);
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
    delete_id = id
    $("#modal_delete").modal("show");
   
  };

  $("#form_delete").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();
      $.ajax({
        url:
          apiURL +
          "payment_term/" +
          delete_id +
          "/" +
          $.cookie("USER_ID"),
        type: "DELETE", // post, put, delete, get
        dataType: "json",
        success: function (data) {
          toastr.success("Record has been deactivated.");
          $("#modal_delete").modal("hide");
          loadPaymentTermTable();
        },
        error: function (data) {
          toastr.error(data.responseJSON.detail);
        },
      });
    },
  });
});
