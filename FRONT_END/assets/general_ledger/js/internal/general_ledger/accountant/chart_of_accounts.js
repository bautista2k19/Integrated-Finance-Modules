'use strict';
  
var accessType = 0, code; 

//------------------------- FORM ELEMENTS -------------------------
const elements = {
  'uuid': document.getElementById('uuid'),
  'account_title': document.getElementById('account_title'),
  'account_number': document.getElementById('account_number'),
  'description': document.getElementById('description'),
  'submitButton': document.getElementById('submitButton'),
  'account_titleError': createError('account_titleError'),
  'account_typeError': createError('account_typeError'),
  'account_numberError': createError('account_numberError')
};

//------------------------- LOAD TABLE W/ INIT -------------------------
var table;
const loadTable = () => {
  if ( table ) table.clear().draw().destroy();
    
  table = $('#table').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
      "url": "../accountant/chart_of_accounts/datatable",
      "method": "post",
      "contentType": "application/json; charset=UTF-8;",
      "dataType": "json",
      "data": function ( data ) {
        return JSON.stringify(data);
      },
      "dataSrc": function ( response ) {
        for (const responseData of response.data) {
          //status
          responseData.status = 
            `<div class="badge badge-success p-2 w-100">  
              <i class="fas fa-check mr-1" aria-hidden="true"></i>
              ${responseData.status}  
            </div>`;
          //actions
          responseData.id = 
            `<div class="text-center dropdown">
              <a class="btn btn-sm btn-default" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-ellipsis-v"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right p-0" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item " onclick="getData('${responseData.id}', 1);"><i class="fas fa-list mr-1" style="width: 2rem;"></i><span>View</span></a>
                <a class="dropdown-item " onclick="getData('${responseData.id}', 0);"><i class="fas fa-edit mr-1" style="width: 2rem;"></i><span>Edit</span></a>
                <div class="dropdown-divider m-0"></div>
                <a class="dropdown-item " onclick="confirmToDo('${responseData.id}', 0, deleteData, 'delete');"><i class="fas fa-trash-alt mr-1" style="width: 2rem;"></i><span>Delete</span></a>
              </div>
            </div>`;
        }
        return response.data;
      }
    },
    "columns": [
      { 
        'data': 'account_number',
        'name': 'account_number',
        'width': '0%',
      },
      { 
        'data': 'account_title',
        'name': 'account_title',
        'width': '20%',
      },
      { 
        'data': 'account_type',
        'name': 'account_type',
        'width': '10%',
      },
      { 
        'data': 'description',
        'name': 'description',
        'width': '20%',
        'searchable': false,
        'orderable': false,
      },
      { 
        'data': 'status',
        'name': 'status',
        'width': '0%',
        'searchable': false,
        'orderable': true,
      },
      {
        'data': 'id',
        'name': 'id',
        'width': '0%',
        'searchable': false,
        'orderable': false,
      },
    ],
    "deferRender": true,    
    "responsive": true,
    "autoWidth": false,
    "ordering": true,
    "order": [[ 0, 'asc' ]],
    "lengthChange": true,
    "lengthMenu": [ 10, 25, 50, 75, 100 ],
    "searching": true,
    "info": true,
    "paging": true, 
    "language": {
      "zeroRecords": "No result found",
            "info": "Showing _START_ to _END_ of _TOTAL_ accounts",
      "emptyTable": "No available accounts.",
      "paginate": {
        "next": '<i class="fas fa-caret-right"></i>',
        "previous": '<i class="fas fa-caret-left"></i>',
      }
    },
    dom: 'Bfrtip',
    buttons: [
        {
            extend: 'collection',
            className: 'custom-html-collection',
            autoClose: true,
            text: 'Options',
            buttons: [
              {
                extend: 'pageLength',
                exportOptions: {
                  columns: ':visible'
                }
              },
              'colvis',
              {
                extend: 'excel',
                text: '<i class="far fa-file-excel mr-2"></i><span>&nbsp;Excel</span>',
                exportOptions: {
                  columns: ':visible'
                }
              },
              {
                extend: 'pdf',
                text: '<i class="far fa-file-pdf mr-2"></i><span>&nbsp;PDF</span>',
                exportOptions: {
                  stripHtml: false,
                  columns: ':visible'
                }
              },
              {
                extend: 'print',
                text: '<i class="fa fa-print mr-2"></i><span>&nbsp;Print</span>',
                exportOptions: {
                    stripHtml: false,
                    columns: ':visible'
                },
              },
            ]
        }
    ],
    "drawCallback": function( settings ) {
      //Count total accounts
      countTotalAccounts();
    },
    'initComplete': function () {
      table.buttons().container().prependTo('#table_filter').parent().addClass('d-flex justify-content-between'); 
    },
  });
};

//Load account types
const loadAccountTypes = (type) => {
  const interval = setInterval(() => {
    if( fetchable ) {
      clearInterval(interval);
      options['method'] = 'get';
      makeFetch(
        '../accountant/account_types',
        options,
        ((responseData) => {
          const isAccountTypeActive = ((responseData.filter((item) => item.text == type?.name)).length > 0);
          $('#account_type').empty().append('<option></option>');
          for (const data of responseData) {
            //Set default value
            if ( type != undefined 
              && type?.code < data.code 
              && !isAccountTypeActive
            ) {
              $('#account_type').append(
                `<option value="${type.code}" selected><span>${
                  type.name
                }</span><input type="hidden" value="${
                  type.id
                }" /></option>`
              );
              type = undefined;
            }
            //Append account_type
            $('#account_type').append(
              `<option value="${data.code}"><span>${
                data.text
              }</span><input type="hidden" value="${
                data.id
              }" /></option>`
            );
          }
          //Set default value
          if ( type != undefined ) {
            $('#account_type').val(type.code).trigger('change');
          }
        })
      );
    }
  }, 100);
};

//------------------------- CALLBACK FOR VALIDATION RESULT -------------------------
const displayValidationResult = (responseData) => {
  //Display error for validation if column has constraint issue
  if ( responseData.has_error ) {
    const element = responseData.element;
    elements[element].focus();
    elements[element].previousElementSibling.classList.add('text-danger');
    displayError(
      elements[element], 
      elements[element+'Error'], 
      responseData.detail.replace(/_/g, ' '), 
      responseData.closest
    );
  }
};

//------------------------- CALLBACK FOR -------------------------
//------------------------- CREATION, UPDATE & DELETE -------------------------
const forNotEditOrViewCallback = (responseData) => {
  loadTable();
  const detail = responseData.detail;
  if ( !detail.includes('Deleted') ) {
    $('#form_modal').modal('hide');
  }
  document.getElementById('toast-container')?.remove();
  toastr[responseData.type](detail);
};

//------------------------- FINALLY CALLBACK -------------------------
const finallyCallback = () => {
  setTimeout(() => {
    enableFormElements();
  }, 500);
  //Reset options for creation/update
  delete options.body;
  delete options.headers['Content-Type'];
  options['cache'] = 'no-cache';
};

//------------------------- CALLBACK FOR VIEWING/EDITING DATA -------------------------
var prevAccountNumber;
const forEditOrViewCallback = (responseData) => {
  //For viewing
  if ( accessType == 1 ) {
    const viewModal = `
      <div class="modal fade" id="view_modal">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title"><i class="fas fa-list mr-3 text-secondary"></i>Chart of Accounts</h4>
              <button type="button" class="btn btn-sm btn-default" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true"><i class="fas fa-times"></i></span>
              </button>
            </div>
            <div class="modal-body pb-0">

              <div class="row">
                <div class="col">
                  <div class="alert alert-dismissible border p-0">
                    <div class="card-header">
                      <h3 class="card-title">
                        <i class="icon fas fa-info-circle text-info"></i>
                        Details about account
                      </h3>
                    </div>
                    <!-- /card-header -->
                    <div class="card-body pb-0">
                      <dl class="row">
                        <dt class="col-sm-2">Account Title:</dt>
                        <dd class="col-sm-10">${
                          //account_title
                          responseData.account_title
                        }</dd>
                        <dt class="col-sm-2">Account Type:</dt>
                        <dd class="col-sm-10">${
                          //account_type
                          responseData.ca_account_type.name
                        }</dd>
                        <dt class="col-sm-2">Account No.:</dt>
                        <dd class="col-sm-10">${
                          //account_number
                          responseData.account_number
                        }</dd>
                        ${ //description
                          responseData.description != ""
                          ? `<dt class="col-sm-2">Description:</dt>
                            <dd class="col-sm-10">${responseData.description}</dd>`
                          : ``
                        }
                        <dt class="col-sm-2">Status:</dt>
                        <dd class="col-sm-10">${
                          //status
                          responseData.status
                        }</dd>
                        <div class="col-12">
                          <div class="row">
                            <dt class="col-sm-2">Created At:</dt>
                            <dd class="col-sm-4">${
                              //created_at
                              formatDate(responseData.created_at)
                            }</dd>
                            <dt class="col-sm-2">Created By:</dt>
                            <dd class="col-sm-4">${
                              //created_by
                              formatName(responseData.ca_created_by.employee)
                            }</dd>
                          </div>
                        </div>
                        ${ //Updated
                          responseData.ca_updated_by != undefined
                          ? `<div class="col-12">
                              <div class="row">
                                <dt class="col-sm-2">Updated At:</dt>
                                <dd class="col-sm-4">${
                                  //updated_at
                                  formatDate(responseData.updated_at)
                                }</dd>
                                <dt class="col-sm-2">Updated By:</dt>
                                <dd class="col-sm-4">${
                                  //updated_by
                                  formatName(responseData.ca_updated_by.employee)
                                }</dd>
                              </div>
                            </div>`
                          : ``
                        }
                      </dl>
                    </div>
                    <!-- /card-body -->
                  </div>
                </div>
              </div>

            </div>
            <!-- /modal-body -->
            <div class="modal-footer text-right">
              <button type="button" class="btn btn-sm btn-default mr-2" data-dismiss="modal">Cancel</button>
            </div>
            <!-- /modal-footer -->
          </div>
          <!-- /modal-content -->
        </div>
        <!-- /modal-dialog -->
      </div>
      <!-- /modal -->`;
      document.body.insertAdjacentHTML('beforeend', viewModal);
      $('#view_modal').on('hidden.bs.modal', function () { this.remove(); });
      $('#view_modal').modal({
        'backdrop': 'static',
        'keyboard': true,
        'focus': true,
        'show': true
      });
  //For editing
  } else {
    elements.uuid.value = responseData.id;
    elements.account_title.value = responseData.account_title;
    loadAccountTypes(responseData.ca_account_type);
    elements.account_number.value = responseData.account_number;
    prevAccountNumber = {
      'code': responseData.ca_account_type.code,
      'account_number': responseData.account_number
    };
    elements.description.value = responseData.description;
   
    const additionalDetails = 
      `<div class="form-group row" id="additionalDetails">
        <div class="col">
          <div class="alert alert-dismissible border p-0">
            <div class="card-header">
              <h3 class="card-title">
                <i class="icon fas fa-info-circle text-info"></i>
                Additional details
              </h3>
            </div>
            <!-- /card-header -->
            <div class="card-body pb-0">
              
              <dl class="row">
                <dt class="col-sm-2">Status:</dt>
                <dd class="col-sm-10">${
                  //status
                  responseData.status
                }</dd>
                <div class="col-12">
                  <div class="row">
                    <dt class="col-sm-2">Created At:</dt>
                    <dd class="col-sm-4">${
                      //created_at
                      formatDate(responseData.created_at)
                    }<input type="hidden" id="created_at" value="${responseData.created_at}" /></dd>
                    <dt class="col-sm-2">Created By:</dt>
                    <dd class="col-sm-4">${
                      //created_by
                      formatName(responseData.ca_created_by.employee)
                    }<input type="hidden" id="created_by" value="${responseData.created_by}" /></dd>
                  </div>
                </div>
                ${ //Updated
                  responseData.ca_updated_by != undefined
                  ? `<div class="col-12">
                      <div class="row">
                        <dt class="col-sm-2">Updated At:</dt>
                        <dd class="col-sm-4">${
                          //updated_at
                          formatDate(responseData.updated_at)
                        }</dd>
                        <dt class="col-sm-2">Updated By:</dt>
                        <dd class="col-sm-4">${
                          //updated_by
                          formatName(responseData.ca_updated_by.employee)
                        }</dd>
                      </div>
                    </div>`
                  : ``
                }
              </dl>

            </div>
            <!-- /card-body -->
          </div>
        </div>
      </div>`;
    form.insertAdjacentHTML('beforeend', additionalDetails);

    elements.submitButton.firstElementChild.textContent = 'Update';
    //Show modal
    $('#form_modal').modal({
      'backdrop': 'static',
      'keyboard': true,
      'focus': true,
      'show': true
    });
  }
};

//Count total accounts
const countTotalAccounts = () => {
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'get';
      makeFetch(`../accountant/chart_of_accounts/total_accounts`, 
        options, 
        ((responseData) => {
          document.getElementById('total_assets').textContent = responseData.total_assets ?? 0;
          document.getElementById('total_contra_assets').textContent = responseData.total_contra_assets ?? 0;
          document.getElementById('total_revenues').textContent = responseData.total_revenues ?? 0;
          document.getElementById('total_equities').textContent = responseData.total_equities ?? 0;
          document.getElementById('total_liabilities').textContent = responseData.total_liabilities ?? 0;
          document.getElementById('total_expenses').textContent = responseData.total_expenses ?? 0;
        })
      );
    }
  }, 100);
};

//Get last account_number
const getLastAccountNumber = (el) => {
  code = parseInt(el.value);
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'get';
      makeFetch(
        `../accountant/chart_of_accounts/get_last_account_no?code=${code}`,
        options,
        ((responseData) => {
          //Remove error if any
          if ( elements.account_number.classList.contains('is-invalid') ) {
            removeAccountNumberError();
          }
          //Set new last account number
          if ( responseData.account_number % 1000 != 0 ) {
            elements.account_number.value = responseData.account_number;
          //Display error if the maximum account number for account type is reached
          } else {
            elements.account_number.value = "";
            addAccountNumberError(
              `No available account number for the ${$(el).find(':selected').text().toLowerCase()} account already.`
            );
          }
        }),
      );
    }
  }, 100);
};

//Add account type error
const addAccountTypeError = () => {
  const el = document.getElementById('account_type');
  $(`span[aria-labelledby="select2-${el.id}-container"]`)?.addClass('is-invalid');
  $(el).prev().addClass('text-danger');
  displayError(
    el, 
    elements[`${el.id}Error`], 
    'Account type is required.', 
    '.col'
  );
};
//Remove account type error
const removeAccountTypeError = () => {
  const el = document.getElementById('account_type');
  $(`span[aria-labelledby="select2-${el.id}-container"]`)?.removeClass('is-invalid');
  $(el).removeClass('is-invalid')
    .prev().removeClass('text-danger');
  elements[`${el.id}Error`].remove();
};

//Add account number error
const addAccountNumberError = (text) => {
  elements.account_number.previousElementSibling.classList.add('text-danger');
  displayError(
    elements.account_number,
    elements.account_numberError,
    text,
    '.col'
  );
};
//Remove account number error
const removeAccountNumberError = () => {
  elements.account_number.previousElementSibling.classList.remove('text-danger');
  elements.account_number.classList.remove('is-invalid');
  elements.account_numberError.remove();
};

//------------------------- READY FUNCTION -------------------------
$(function () {
  //Count total accounts
  countTotalAccounts();
  //Load table w/ init
  loadTable();

  //Init account_type
  $('#account_type').select2({
    'dropdownParent': $('#form_modal'),
    'placeholder': 'Select account type',
    'language': { 
      'noResults': () => 'No available account types',
    },
  })
  //Autofocus
  .on('select2:open', function () {
    setTimeout(() => document.querySelector('.select2-search__field')?.focus(), 100);
  })
  //Listen select event of account_type
  .on('select2:select', function () {
    //Remove error if any
    if ( $(this).hasClass('is-invalid') ) {
      removeAccountTypeError();
    }
    //Get last account_number
    if ( this.value != prevAccountNumber?.code ) getLastAccountNumber(this);
    else elements.account_number.value = prevAccountNumber.account_number;
  }).on('select2:close', function () {
    //Display error if empty
    if ( this.value == "" && !$(this).hasClass('is-invalid') ) {
      addAccountTypeError();
    }
  });

  //------------------------- FORM ELEMENTS VALIDATION -------------------------
  //account_title
  elements.account_title.addEventListener('input', function (e) {
    //Remove error if any
    if ( this.classList.contains('is-invalid') ) {
      this.previousElementSibling.classList.remove('text-danger');
      this.classList.remove('is-invalid');
      elements[`${this.id}Error`].remove();
    }
    //Display error if empty
    if ( this.value == "" ) {
      this.previousElementSibling.classList.add('text-danger');
      displayError(
        this, 
        elements[`${this.id}Error`], 
        'Account title is required.', 
        '.col'
      );
    //Make fetch for server-side validation
    } else {
      const interval = setInterval(() => {
        if ( fetchable ) {
          clearInterval(interval);
          options['method'] = 'get';
          makeFetch(
            `../accountant/chart_of_accounts/validate_input?id=${elements.uuid.value}&column=${this.id}&value=${this.value}&closest=.col`, 
            options, 
            displayValidationResult
          );
        }
      }, 100);
    }
  });

  //------------------------- LISTEN SUBMIT EVENT -------------------------
  form.addEventListener(
    'submit',
    function (e) {
      e.preventDefault();
      validateFormElements();
    }
  );

  //Autofocus account_title
  $('#form_modal').on('shown.bs.modal', function () { elements.account_title.focus(); });

  //------------------------- RESET MODAL FORM -------------------------
  $('#form_modal').on('hidden.bs.modal', function () { 
    form.reset();
    //account_title
    elements.account_title.previousElementSibling.classList.remove('text-danger');
    elements.account_title.classList.remove('is-invalid');
    elements.account_titleError.remove();
    //account_type
    removeAccountTypeError();
    //account_number
    removeAccountNumberError();
    prevAccountNumber = undefined;
    //Remove additional details
    document.getElementById('additionalDetails')?.remove();
    //submitButton
    elements.submitButton.firstElementChild.textContent = 'Submit';
    elements.submitButton.removeAttribute('disabled');
  });

  //------------------------- ENABLE CONFIRM MODAL BUTTONS -------------------------
  $('#confirm-modal').on('hidden.bs.modal', function () {
    confirmDismiss.forEach((dismiss) => { dismiss.removeAttribute('disabled'); });
    confirmSubmit.removeAttribute('disabled');
  });
});

//------------------------- VALIDATE FORM ELEMENTS -------------------------
const validateFormElements = () => {
  elements.submitButton.setAttribute('disabled', 'true');

  //account_number
  if ( elements.account_number.classList.contains('is-invalid') ) {
    elements.submitButton.removeAttribute('disabled');
  } else if ( elements.account_number.value == "" ) {
    elements.submitButton.removeAttribute('disabled');
    addAccountNumberError(`Account number is required.`);
  }
  
  //account_type
  if ( $('#account_type').hasClass('is-invalid') ) {
    elements.submitButton.removeAttribute('disabled');
  } else if ( $('#account_type').val() == "" ) {
    elements.submitButton.removeAttribute('disabled');
    $('#account_type').trigger('select2:close');
  }
  
  //account_title
  if ( elements.account_title.classList.contains('is-invalid') ) {
    elements.submitButton.removeAttribute('disabled');
    elements.account_title.focus();
  } else if ( elements.account_title.value == "" ) {
    elements.submitButton.removeAttribute('disabled');
    elements.account_title.focus();
    elements.account_title.dispatchEvent(new Event('input'));
  }
  
  //If no error, then submit
  if ( !elements.account_number.classList.contains('is-invalid')
    && !$('#account_type').hasClass('is-invalid')
    && !elements.account_title.classList.contains('is-invalid') 
  ) {
    disableFormElements();
    setTimeout(() => { prepareAndSendData(); }, 2000);
  }
};

//------------------------- PREPARE & SEND DATA -------------------------
const prepareAndSendData = () => {
  trimTextFields();
  //Set url
  const url = (
    elements.uuid.value == "" 
    ? '../accountant/chart_of_accounts'
    : `../accountant/chart_of_accounts/${elements.uuid.value}`
  );
  //Get input data
  const body = {
    account_title: elements.account_title.value,
    account_type: $($($('#account_type').find(':selected')).children()[1]).val(),
    account_number: elements.account_number.value,
    description: elements.description.value
  };
  if ( elements.uuid.value != "" ) {
    body['created_at'] = document.getElementById('created_at').value;
    body['created_by'] = document.getElementById('created_by').value;
  }
  //Modify options
  options['method'] = 'post';
  options['cache'] = 'no-store';
  options.headers['Content-Type'] = 'application/json; charset=UTF-8';
  options['body'] = JSON.stringify(body);
  //Make fetch for creation / update
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      makeFetch(url, 
        options, 
        forNotEditOrViewCallback,
        finallyCallback
      );
    }
  }, 100);
};

//------------------------- FUNCTION FOR GETTING DATA -------------------------
const getData = (id, accessTypeArg) => {
  accessType = accessTypeArg;
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'get';
      makeFetch(`../accountant/chart_of_accounts/${id}`, 
        options, 
        forEditOrViewCallback
      );
    }
  }, 100);
};

//------------------------- FUNCTION FOR DELETING DATA -------------------------
function deleteData () {
  disableConfirmModalButtons();
  $('#confirm-modal').modal('hide');
  const id = this.id;
  const operation_type = this.operation_type;
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'delete';
      makeFetch(`../accountant/chart_of_accounts/${id}?operation_type=${operation_type}`, 
        options, 
        forNotEditOrViewCallback
      );
    }
  }, 100);
};

//------------------------- DISABLE FORM ELEMENTS -------------------------
const disableFormElements = () => {
  const formElements = document.querySelectorAll(`
    #form input:not([id="uuid"], [id="account_number"]), 
    #form select,
    #form textarea,
    #form button,
    [form="form"]
  `);
  formElements.forEach((el) => { el.setAttribute('disabled','true'); });
  elements.submitButton.firstElementChild.textContent = '';
  elements.submitButton.lastElementChild.className = 'fas fa-1x fa-sync-alt fa-spin';
};

//------------------------- ENABLE FORM ELEMENTS -------------------------
const enableFormElements = () => {
  const formElements = document.querySelectorAll(`
    #form input:not([id="uuid"], [id="account_number"]), 
    #form select,
    #form textarea,
    #form button,
    [form="form"]
  `);
  formElements.forEach((el) => { el.removeAttribute('disabled'); });
  if ( elements.uuid.value == "" ) elements.submitButton.firstElementChild.textContent = 'Submit';
  else elements.submitButton.firstElementChild.textContent = 'Update';
  elements.submitButton.lastElementChild.className = 'fas fa-check ml-2';
  elements.submitButton.removeAttribute('disabled');
};