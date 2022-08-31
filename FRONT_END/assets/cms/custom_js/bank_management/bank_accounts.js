$(document).ready(function () { 
  var current_date = new Date();
	current_date = current_date.toISOString().split("T")[0];
	$("#date_of_deposit").attr("max", current_date);
	$("#date_of_withdrawal").attr("max", current_date);

  // new bank account validation
  $("#form_id").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();
      
      if ($("#uuid").val() == "") {
        var form = $('#form_id').serializeJSON()
        form["created_by"] = localStorage.USER_ID

        $.ajax({
          url: apiURL + "bank_account/",
          type: "POST", // post, put, delete, get
          data: JSON.stringify(form),
          dataType: "json",
          contentType: "application/json",
          success: function (data) {
            toastr.success("New bank account has been created.");
            formReset("hide", "");
            loadBankAccountTable();
          },
          error: function (data) {
            toastr.error(data.responseJSON.detail);
          },
        });
      } else {

        var form = $('#form_id').serializeJSON()
        form["updated_by"] = localStorage.USER_ID

        $.ajax({
          url: apiURL + "bank_account/" + $("#uuid").val(),
          type: "PUT", // post, put, delete, get
          data: JSON.stringify(form),
          contentType: "application/json",
          success: function (data) {
            toastr.success("Bank Account has been updated.");
            formReset("hide", "");
            loadBankAccountTable();
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
  loadBankAccountTable = () => {
    $("#bank_accounts_table").dataTable().fnClearTable();
    $("#bank_accounts_table").dataTable().fnDraw();
    $("#bank_accounts_table").dataTable().fnDestroy();
    $("#bank_accounts_table").dataTable({
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
                columns: [0, 1, 2, 3, 4, 5, 6],
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
						let account = "";
						
            account += aData.account_name + ", " + aData.account_no

						return account;
					},

          searchable: true,
        },
        
        {
          data: null,
          render: function (aData, type, row) {
						let bank = "";
						
            bank += aData.bank_name + ", " + aData.bank_address

						return bank;
					},

          searchable: true,
        },
        {
					data: "initial_amount",
					render: function (aData, type, row) {
						let initial_amount = "";
						initial_amount = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return initial_amount;
					},

					searchable: true,
				},
        {
					data: "remaining_amount",
					render: function (aData, type, row) {
						let remaining_amount = "";
						remaining_amount = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return remaining_amount;
					},

					searchable: true,
				},
        {
					data: null,
					render: function (aData, type, row) {
            let total_deposit = 0; 
            $.each(aData.bank_account_deposit, function (i, depositData) {
              total_deposit += depositData.amount
            })
					
						total_deposit = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(total_deposit);

						return total_deposit;
					},

					searchable: true,
				},
        {
					data: null,
					render: function (aData, type, row) {
						let total_withdrawal = 0;
            $.each(aData.bank_account_withdrawal, function (i, withdrawalData) {
              total_withdrawal += withdrawalData.amount
            })
						total_withdrawal = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(total_withdrawal);

						return total_withdrawal;
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
                "<div>Edit Bank Account</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return depositData(\'' +
                aData["id"] +
                "','"+ aData["account_name"] + "','"+ aData["account_no"] + "','"+ aData["bank_name"] + "','"+ aData["bank_address"] +  "','"+ aData["remaining_amount"] + "')\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-donate mr-1"></i>' +
                "</div>" +
                "<div>Deposit</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return withdrawData(\'' +
                aData["id"] +
                "','"+ aData["account_name"] + "','"+ aData["account_no"] + "','"+ aData["bank_name"] + "','"+ aData["bank_address"] +  "','"+ aData["remaining_amount"] + "')\">" +
                '<div style="width: 2rem">' +
                '<i class="	fas fa-money-bill-wave mr-1"></i>' +
                "</div>" +
                "<div>Withdraw</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
                aData["id"] +
                "',0)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-trash-alt mr-1"></i>' +
                "</div>" +
                "<div>Delete Bank Account</div>" +
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
        url: apiURL + "bank_account/datatable",
        dataSrc: "",
        type: "GET",
        error: function (xhr, error, code) {
          // console.log(xhr);
          // console.log(code);
        },
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        let account =""
        account += aData.account_name + ", " + aData.account_no

        let bank =""
        bank += aData.bank_name + ", " + aData.bank_address

        let initial_amount = "";

				initial_amount = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.initial_amount);

        let remaining_amount = "";

				remaining_amount = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.remaining_amount);

        let total_deposit = 0;

				$.each(aData.bank_account_deposit, function (i, depositData) {
          total_deposit += depositData.amount
        })
      
        total_deposit = $.fn.dataTable.render
          .number(",", ".", 2, "₱")
          .display(total_deposit);
        
        let total_withdrawal = 0;

				$.each(aData.bank_account_withdrawal, function (i, withdrawalData) {
          total_withdrawal += withdrawalData.amount
        })
        total_withdrawal = $.fn.dataTable.render
          .number(",", ".", 2, "₱")
          .display(total_withdrawal);

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
            "<div>Edit Bank Account</div>" +
            "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return depositData(\'' +
                aData["id"] +
                "','"+ aData["account_name"] + "','"+ aData["account_no"] + "','"+ aData["bank_name"] + "','"+ aData["bank_address"] +  "','"+ aData["remaining_amount"] + "')\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-donate mr-1"></i>' +
                "</div>" +
                "<div>Deposit</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return withdrawData(\'' +
                aData["id"] +
                "','"+ aData["account_name"] + "','"+ aData["account_no"] + "','"+ aData["bank_name"] + "','"+ aData["bank_address"] +  "','"+ aData["remaining_amount"] + "')\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-money-bill-wave mr-1"></i>' +
                "</div>" +
                "<div>Withdraw</div>" +
                "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-trash-alt mr-1"></i>' +
            "</div>" +
            "<div>Delete Bank Account</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        } else if (aData.status == "Inactive") {
          buttons += "<i>No available action</i>";
        }
        $("td:eq(0)", nRow).html(account);
        $("td:eq(1)", nRow).html(bank);
        $("td:eq(2)", nRow).html(initial_amount);
        $("td:eq(3)", nRow).html(remaining_amount);
        $("td:eq(4)", nRow).html(total_deposit);
        $("td:eq(5)", nRow).html(total_withdrawal);
        $("td:eq(6)", nRow).html(status);
        $("td:eq(7)", nRow).html(buttons);
      },
      drawCallback: function (settings) {},
    });
  };
  loadBankAccountTable();

  loadDepositTable = () => {
    $("#deposits_table").dataTable().fnClearTable();
    $("#deposits_table").dataTable().fnDraw();
    $("#deposits_table").dataTable().fnDestroy();
    $("#deposits_table").dataTable({
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
                columns: [0, 1, 2, 3, 4, 5, 6],
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
          data: "deposit_no",
          name: "deposit_no",

          searchable: true,
        },
        {
          data: "deposit_bank_account.account_name",
          name: "deposit_bank_account.account_name",

          searchable: true,
        },
        {
          data: "deposit_bank_account.bank_name",
          name: "deposit_bank_account.bank_name",

          searchable: true,
        },
        {
					data: "amount",
					render: function (aData, type, row) {
						let amount = "";
						amount = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return amount;
					},

					searchable: true,
				},
        {
          data: "description",
          name: "description",

          searchable: true,
        },
        {
					data: "date_of_deposit",
					render: function (aData, type, row) {
						let date_of_deposit = "";
						date_of_deposit += moment(aData.date_of_deposit).format(
							"MMMM D, YYYY"
						);
						return date_of_deposit;
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
                '<div class="dropdown-item d-flex" role="button" onClick="return viewDeposit(\'' +
                aData["id"] +
                "',1)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-edit mr-1"></i>' +
                "</div>" +
                "<div>Edit Deposit</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
                aData["id"] +
                "',1)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-trash-alt mr-1"></i>' +
                "</div>" +
                "<div>Delete Deposit</div>" +
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
        url: apiURL + "deposit/datatable",
        dataSrc: "",
        type: "GET",
        error: function (xhr, error, code) {
          // console.log(xhr);
          // console.log(code);
        },
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        let amount = "";

				amount = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.amount);


        let date_of_deposit = "";
        date_of_deposit += moment(aData.date_of_deposit).format(
          "MMMM D, YYYY"
        );


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
            '<div class="dropdown-item d-flex" role="button" onClick="return viewDeposit(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-edit mr-1"></i>' +
            "</div>" +
            "<div>Edit Deposit</div>" +
            "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-trash-alt mr-1"></i>' +
            "</div>" +
            "<div>Delete Deposit</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        } else if (aData.status == "Inactive") {
          buttons += "<i>No available action</i>";
        }
        $("td:eq(0)", nRow).html(aData["deposit_no"]);
        $("td:eq(1)", nRow).html(aData["deposit_bank_account.account_name"]);
        $("td:eq(2)", nRow).html(aData["deposit_bank_account.bank_name"]);
        $("td:eq(3)", nRow).html(amount);
        $("td:eq(4)", nRow).html(aData["description"]);
        $("td:eq(5)", nRow).html(date_of_deposit);
        $("td:eq(6)", nRow).html(status);
        $("td:eq(7)", nRow).html(buttons);
      },
      drawCallback: function (settings) {},
    });
  };
  loadDepositTable();

  loadWithdrawalTable = () => {
    $("#withdrawals_table").dataTable().fnClearTable();
    $("#withdrawals_table").dataTable().fnDraw();
    $("#withdrawals_table").dataTable().fnDestroy();
    $("#withdrawals_table").dataTable({
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
                columns: [0, 1, 2, 3, 4, 5, 6],
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
          data: "withdrawal_no",
          name: "withdrawal_no",

          searchable: true,
        },
        {
          data: "withdrawal_bank_account.account_name",
          name: "withdrawal_bank_account.account_name",

          searchable: true,
        },
        {
          data: "withdrawal_bank_account.bank_name",
          name: "withdrawal_bank_account.bank_name",

          searchable: true,
        },
        {
					data: "amount",
					render: function (aData, type, row) {
						let amount = "";
						amount = $.fn.dataTable.render
							.number(",", ".", 2, "₱")
							.display(aData);

						return amount;
					},

					searchable: true,
				},
        {
          data: "description",
          name: "description",

          searchable: true,
        },
        {
					data: "date_of_withdrawal",
					render: function (aData, type, row) {
						let date_of_withdrawal = "";
						date_of_withdrawal += moment(aData.date_of_withdrawal).format(
							"MMMM D, YYYY"
						);
						return date_of_withdrawal;
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
                '<div class="dropdown-item d-flex" role="button" onClick="return viewWithdrawal(\'' +
                aData["id"] +
                "',1)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-edit mr-1"></i>' +
                "</div>" +
                "<div>Edit Withdrawal</div>" +
                "</div>" +
                '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
                aData["id"] +
                "',2)\">" +
                '<div style="width: 2rem">' +
                '<i class="fas fa-trash-alt mr-1"></i>' +
                "</div>" +
                "<div>Delete Withdrawal</div>" +
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
        url: apiURL + "withdrawal/datatable",
        dataSrc: "",
        type: "GET",
        error: function (xhr, error, code) {
          // console.log(xhr);
          // console.log(code);
        },
      },
      fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        let amount = "";

				amount = $.fn.dataTable.render
					.number(",", ".", 2, "₱")
					.display(aData.amount);


        let date_of_withdrawal = "";
        date_of_withdrawal += moment(aData.date_of_withdrawal).format(
          "MMMM D, YYYY"
        );


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
            '<div class="dropdown-item d-flex" role="button" onClick="return viewWithdrawal(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-edit mr-1"></i>' +
            "</div>" +
            "<div>Edit Bank Account</div>" +
            "</div>" +
            '<div class="dropdown-item d-flex" role="button" onClick="return deleteData(\'' +
            aData["id"] +
            "',2)\">" +
            '<div style="width: 2rem">' +
            '<i class="fas fa-trash-alt mr-1"></i>' +
            "</div>" +
            "<div>Delete Bank Account</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        } else if (aData.status == "Inactive") {
          buttons += "<i>No available action</i>";
        }
        $("td:eq(0)", nRow).html(aData["withdrawal_no"]);
        $("td:eq(1)", nRow).html(aData["withdrawal_bank_account.account_name"]);
        $("td:eq(2)", nRow).html(aData["withdrawal_bank_account.bank_name"]);
        $("td:eq(3)", nRow).html(amount);
        $("td:eq(4)", nRow).html(aData["description"]);
        $("td:eq(5)", nRow).html(date_of_withdrawal);
        $("td:eq(6)", nRow).html(status);
        $("td:eq(7)", nRow).html(buttons);
      },
      drawCallback: function (settings) {},
    });
  };
  loadWithdrawalTable();

  $("#bank_accounts_menu").on("click", function () {
		$("#deposits_div").hide()
    $("#withdrawals_div").hide()
		$("#bank_accounts_div").show()
		$("#deposits_menu").removeClass("active")
    $("#withdrawals_menu").removeClass("active")
		$("#bank_accounts_menu").addClass("active")
    loadBankAccountTable()
	})

	$("#deposits_menu").on("click", function () {
    $("#withdrawals_div").hide()
		$("#bank_accounts_div").hide()
		$("#deposits_div").show()
		$("#bank_accounts_menu").removeClass("active")
    $("#withdrawals_menu").removeClass("active")
		$("#deposits_menu").addClass("active")
    loadDepositTable()
	})

  $("#withdrawals_menu").on("click", function () {
		$("#bank_accounts_div").hide()
		$("#deposits_div").hide()
    $("#withdrawals_div").show()
		$("#bank_accounts_menu").removeClass("active")
		$("#deposits_menu").removeClass("active")
    $("#withdrawals_menu").addClass("active")
    loadWithdrawalTable()
	})

  //hide card
  hideCard = (type) => {
    $("#withdrawal_div").hide()
    $("#deposit_div").hide()
  }

  $(window).resize(function () {
    $("table.dataTable").resize();
  });

  //New Data
  $("#new_record").on("click", function () {
    $("#withdrawal_div").hide()
    $("#deposit_div").hide()
    formReset("new", "New Bank Account");
  });

  //update info
  viewData = (id, type) => {
    $.ajax({
      url: apiURL + "bank_account/" + id,
      type: "GET", // post, put, delete, get
      dataType: "json",
      success: function (data) {
        if (type == 1) {
          formReset("update", "Update Bank Account");
          $("#uuid").val(data.id);
          $("#account_name").val(data.account_name);
          $("#account_no").val(data.account_no);
          $("#bank_name").val(data.bank_name);
          $("#bank_address").val(data.bank_address);
          $("#remaining_amount").val(data.remaining_amount);
          $("#initial_amount").val(data.initial_amount);
        }
      },
      error: function (data) {
        toastr.error(data.responseJSON.detail);
      },
    });
  };

  //view and update deposit
  viewDeposit = (id, type) => {
    $.ajax({
      url: apiURL + "deposit/" + id,
      type: "GET", // post, put, delete, get
      dataType: "json",
      success: function (data) {
        if (type == 1) {
          $("html, body").animate({ scrollTop: 0 }, "slow");
          $("#uuidDeposit").val(data.id)
          $("#withdrawal_div").hide()
          $("#deposit_div").show()
          $("#deposit_div_card_title").text("Update Deposit")
          console.log(data)
          $("#bank_account_id").val(data.bank_account_id)
          $("#deposit_account_name").text(data.deposit_bank_account.account_name.toUpperCase())
          $("#deposit_account_number").text(data.deposit_bank_account.account_no.toUpperCase())
          $("#deposit_bank_name").text(data.deposit_bank_account.bank_name.toUpperCase())
          $("#deposit_bank_address").text(data.deposit_bank_account.bank_address.toUpperCase())
          $("#deposit_remaining_amount").text("₱"+data.deposit_bank_account.remaining_amount.toLocaleString())
          $("#date_of_deposit").val(data.date_of_deposit);
          $("#amount").val(data.amount);
          $("#description").val(data.description);
        }
      },
      error: function (data) {
        toastr.error(data.responseJSON.detail);
      },
    });
  };

  //view and update withdrawal
  viewWithdrawal = (id, type) => {
    $.ajax({
      url: apiURL + "withdrawal/" + id,
      type: "GET", // post, put, delete, get
      dataType: "json",
      success: function (data) {
        if (type == 1) {
          $("html, body").animate({ scrollTop: 0 }, "slow");
          $("#uuidWithdrawal").val(data.id)
          $("#deposit_div").hide()
          $("#withdrawal_div").show()
          $("#withdrawal_div_card_title").text("Update Withdrawal")
          console.log(data)
          $("#bank_account_id").val(data.bank_account_id)
          $("#withdrawal_account_name").text(data.withdrawal_bank_account.account_name.toUpperCase())
          $("#withdrawal_account_number").text(data.withdrawal_bank_account.account_no.toUpperCase())
          $("#withdrawal_bank_name").text(data.withdrawal_bank_account.bank_name.toUpperCase())
          $("#withdrawal_bank_address").text(data.withdrawal_bank_account.bank_address.toUpperCase())
          $("#withdrawal_remaining_amount").text("₱"+data.withdrawal_bank_account.remaining_amount.toLocaleString())
          $("#date_of_withdrawal").val(data.date_of_withdrawal);
          $("[name='amount']").val(data.amount);
          $("[name='description']").val(data.description);
        }
      },
      error: function (data) {
        toastr.error(data.responseJSON.detail);
      },
    });
  };


  //deposit
  depositData = (id, account_name, account_number,bank_name,bank_address,remaining_amount) => {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $("#deposit_form").validate().resetForm();
    $("#deposit_form")[0].reset();
    $("#uuidDeposit").val("")
    $("#withdrawal_div").hide()
    $("#deposit_div").show()
    $("#deposit_div_card_title").text("Bank Deposit")
    $("#bank_account_id").val(id)
    $("#deposit_account_name").text(account_name.toUpperCase())
    $("#deposit_account_number").text(account_number.toUpperCase())
    $("#deposit_bank_name").text(bank_name.toUpperCase())
    $("#deposit_bank_address").text(bank_address.toUpperCase())
    $("#deposit_remaining_amount").text("₱"+remaining_amount.toLocaleString())
  };

  $("#deposit_form").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();

      if ($("#uuidDeposit").val() == "") {
      
        var form = $('#deposit_form').serializeJSON()
        form["bank_account_id"] = $("#bank_account_id").val()
        form["created_by"] = localStorage.USER_ID

        $.ajax({
          url: apiURL + "deposit/",
          type: "POST", // post, put, delete, get
          data: JSON.stringify(form),
          dataType: "json",
          contentType: "application/json",
          success: function (data) {
            toastr.success("New deposit has been created.");
            loadBankAccountTable()
            loadDepositTable();
          },
          error: function (data) {
            toastr.error(data.responseJSON.detail);
          },
        });
      }else{
        var form = $('#deposit_form').serializeJSON()
        form["bank_account_id"] = $("#bank_account_id").val()
        form["updated_by"] = localStorage.USER_ID

        $.ajax({
          url: apiURL + "deposit/"+ $("#uuidDeposit").val(),
          type: "PUT", // post, put, delete, get
          data: JSON.stringify(form),
          dataType: "json",
          contentType: "application/json",
          success: function (data) {
            toastr.success("Deposit has been updated.");
            loadBankAccountTable()
            loadDepositTable();
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

  withdrawData = (id, account_name, account_number,bank_name,bank_address,remaining_amount) => {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $("#withdrawal_form").validate().resetForm();
    $("#withdrawal_form")[0].reset();
    $("#uuidWithdrawal").val("")
    $("#deposit_div").hide()
    $("#withdrawal_div").show()
    $("#withdrawal_div_card_title").text("Bank Withdrawal")
    $("#bank_account_id").val(id)
    $("#withdrawal_account_name").text(account_name.toUpperCase())
    $("#withdrawal_account_number").text(account_number.toUpperCase())
    $("#withdrawal_bank_name").text(bank_name.toUpperCase())
    $("#withdrawal_bank_address").text(bank_address.toUpperCase())
    $("#withdrawal_remaining_amount").text("₱"+remaining_amount.toLocaleString())
  };

  $("#withdrawal_form").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();
      
      if ($("#uuidWithdrawal").val() == "") {
        var form = $('#withdrawal_form').serializeJSON()
        form["bank_account_id"] = $("#bank_account_id").val()
        form["created_by"] = localStorage.USER_ID

        $.ajax({
          url: apiURL + "withdrawal/",
          type: "POST", // post, put, delete, get
          data: JSON.stringify(form),
          dataType: "json",
          contentType: "application/json",
          success: function (data) {
            toastr.success("New withdrawal has been created.");
            loadBankAccountTable()
            loadWithdrawalTable();
          },
          error: function (data) {
            toastr.error(data.responseJSON.detail);
          },
        });
      }else{
        var form = $('#withdrawal_form').serializeJSON()
        form["bank_account_id"] = $("#bank_account_id").val()
        form["updated_by"] = localStorage.USER_ID

        $.ajax({
          url: apiURL + "withdrawal/"+ $("#uuidWithdrawal").val(),
          type: "PUT", // post, put, delete, get
          data: JSON.stringify(form),
          dataType: "json",
          contentType: "application/json",
          success: function (data) {
            toastr.success("Withdrawal has been updated.");
            loadBankAccountTable()
            loadWithdrawalTable();
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

  // deleteData = (id) => {
  //   $("#modal_delete").modal("show");
  //   $("#form_delete").validate({
  //     submitHandler: function (form, e) {
  //       e.preventDefault();
  //       trimInputFields();
  //       $.ajax({
  //         url:
  //           apiURL +
  //           "bank_account/" +
  //           id +
  //           "/" +
  //           $.cookie("USER_ID"),
  //         type: "DELETE", // post, put, delete, get
  //         dataType: "json",
  //         success: function (data) {
  //           toastr.success("Record has been deactivated.");
  //           $("#modal_delete").modal("hide");
  //           loadBankAccountTable();
  //         },
  //         error: function (data) {
  //           toastr.error(data.responseJSON.detail);
  //         },
  //       });
  //     },
  //   });
  // };
  
  var delete_url

  deleteData = (id, type) => {
    $("#delete_uuid").val(id);
    $("#modal_delete").modal("show");
    if (type == 0) {
      delete_url = "bank_account/";
    } else if (type == 1) {
      delete_url = "deposit/";
    } else if (type == 2) {
      delete_url = "withdrawal/";
    }
    
  };

  $("#form_delete").validate({
    submitHandler: function (form, e) {
      e.preventDefault();
      trimInputFields();
      $.ajax({
        url:
          apiURL +
          delete_url +
          $("#delete_uuid").val() +
          "/" +
          localStorage.USER_ID,
        type: "DELETE", // post, put, delete, get
        dataType: "json",
        success: function (data) {
          toastr.success(data);
          $("#delete_uuid").val("");
          $("#modal_delete").modal("hide");
          loadDepositTable();
          loadBankAccountTable();
          loadWithdrawalTable();
        },
        error: function (data) {
          toastr.error(data.responseJSON.detail);
        },
      });
    },
  });

});
