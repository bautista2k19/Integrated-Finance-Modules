'use strict';
  
var accessType = 0; 

//------------------------- FORM ELEMENTS -------------------------
const elements = {
  'uuid': document.getElementById('uuid'),
  'name': document.getElementById('name'),
  'description': document.getElementById('description'),
  'submitButton': document.getElementById('submitButton'),
  'nameError': createError('nameError'),
  'codeError': createError('codeError')
};

//------------------------- LOAD TABLE W/ INIT -------------------------
var table;
const loadTable = () => {
  if ( table ) table.clear().draw().destroy();
    
  table = $('#table').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
      "url": "../accountant/account_type/datatable",
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
      //code
      { 
        'data': 'code',
        'name': 'code',
        'width': '0%',
      },
      //name
      { 
        'data': 'name',
        'name': 'name',
        'width': '20%',
      },
      //description
      { 
        'data': 'description',
        'name': 'description',
        'width': 'auto',
        'searchable': false,
        'orderable': false,
      },
      //status
      { 
        'data': 'status',
        'name': 'status',
        'width': '15%',
        'searchable': false,
        'orderable': true,
      },
      //id
      { 
        'data': 'id',
        'name': 'id',
        'width': '10%',
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
            "info": "Showing _START_ to _END_ of _TOTAL_ types",
      "emptyTable": "No available types.",
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
    "drawCallback": function( settings ) {},
    'initComplete': function () {
      table.buttons().container().prependTo('#table_filter').parent().addClass('d-flex justify-content-between'); 
    },
  });
};

//Load codes
const loadCodes = (code) => {
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'get';
      makeFetch(
        `../accountant/account_type/codes`,
        options,
        ((responseData) => {
          if ( code != undefined ) {
            responseData.push(code);
            responseData.sort();
          }
          $('#code').empty().append('<option></option>');
          for(const availableCode of responseData) {
            $('#code').append(
              `<option value="${availableCode}" ${code === availableCode ? 'selected':''}>${availableCode}</option>`
            );
          }
        }),
      );
    }
  }, 100);
};

//------------------------- CALLBACK FOR VALIDATION RESULT -------------------------
const displayValidationResultForName = (responseData) => {
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
const displayValidationResultForCode = (responseData) => {
  //Display error for validation if column has constraint issue
  if ( responseData.has_error ) {
    const formElement = responseData.element;
    $(`span[aria-labelledby="select2-${formElement}-container"]`)?.addClass('is-invalid disabled');
    const jQueryElement = $(`#${formElement}`);
    jQueryElement
      .prop('disabled', true)
      .prev().addClass('text-danger');
    displayError(
      document.getElementById(formElement), 
      elements[`${formElement}Error`], 
      responseData.detail.replace(/_/g, ' '),
      responseData.closest
    );
    setTimeout(() => {
      $(`span[aria-labelledby="select2-${formElement}-container"]`)?.removeClass('disabled'); 
      jQueryElement
        .prop('disabled', false)
        .find('option:selected')?.remove();
      document.getElementById(`${formElement}Error`).textContent = `Code is required.`;
    }, 2000);
  }
};

//------------------------- CALLBACK FOR VIEWING/EDITING DATA -------------------------
const forEditOrViewCallback = (responseData) => {console.log(responseData)
  //For viewing
  if ( accessType == 1 ) {
    const viewModal = `
      <div class="modal fade" id="view_modal">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title"><i class="fas fa-sitemap mr-3 text-secondary"></i>Account Type</h4>
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
                        Details about account type
                      </h3>
                    </div>
                    <!-- /card-header -->
                    <div class="card-body pb-0">
                      <dl class="row">
                        <dt class="col-sm-2">Name:</dt>
                        <dd class="col-sm-10">${
                          //name
                          responseData.name
                        }</dd>
                        <dt class="col-sm-2">Code:</dt>
                        <dd class="col-sm-10">${
                          //code
                          responseData.code
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
                              formatName(responseData.at_created_by.employee)
                            }</dd>
                          </div>
                        </div>
                        ${ //Updated
                          responseData.at_updated_by != undefined
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
                                  formatName(responseData.at_updated_by.employee)
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
    elements.name.value = responseData.name;
    //Append code
    loadCodes(responseData.code);
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
                      formatName(responseData.at_created_by.employee)
                    }<input type="hidden" id="created_by" value="${responseData.created_by}" /></dd>
                  </div>
                </div>
                ${ //Updated
                  responseData.at_updated_by != undefined
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
                          formatName(responseData.at_updated_by.employee)
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

//------------------------- READY FUNCTION -------------------------
$(function () {
  loadTable();
    
  //------------------------- FORM ELEMENTS VALIDATION -------------------------
  //name
  elements.name.addEventListener('input', function (e) {
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
        'Name is required.', 
        '.col'
      );
    //Make fetch for server-side validation
    } else {
      const interval = setInterval(() => {
        if ( fetchable ) {
          clearInterval(interval);
          options['method'] = 'get';
          makeFetch(
            `../accountant/account_type/validate_input?id=${elements.uuid.value}&column=${this.id}&value=${this.value}&closest=.col`, 
            options, 
            displayValidationResultForName
          );
        }
      }, 100);
    }
  });

  //code
  $('#code')
    //Init select2
    .select2({
      'dropdownParent': $('#form_modal'),
      'placeholder': 'Select a code',
      'language': {
        'noResults': () => 'No available codes',
      },
    })
    //Autofocus
    .on('select2:open', function () {
      setTimeout(() => document.querySelector('.select2-search__field')?.focus(), 100);
    })
    //Listen select event of code
    .on('select2:select', function () {
      //Remove error if any
      if ( $(this).hasClass('is-invalid') ) {
        $(`span[aria-labelledby="select2-${this.id}-container"]`)?.removeClass('is-invalid');
        $(this).removeClass('is-invalid')
          .prev().removeClass('text-danger');
        elements[`${this.id}Error`].remove();
      }
      //Make fetch for server-side validation
      const interval = setInterval(() => {
        if ( fetchable ) {
          clearInterval(interval);
          options['method'] = 'get';
          makeFetch(
            `../accountant/account_type/validate_input?id=${elements.uuid.value}&column=${this.id}&value=${this.value}&closest=.col`, 
            options, 
            displayValidationResultForCode
          );
        }
      }, 100);
    })
    //Display error if empty
    .on('select2:close', function () {
      if ( this.value == "" 
        && !$(this).hasClass('is-invalid') 
      ) {
        $(`span[aria-labelledby="select2-${this.id}-container"]`)?.addClass('is-invalid');
        $(this).prev().addClass('text-danger');
        displayError(
          this, 
          elements[`${this.id}Error`], 
          'Code is required.', 
          '.col'
        );
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
  
  //Autofocus name
  $('#form_modal').on('shown.bs.modal', function () { elements.name.focus(); });

  //------------------------- RESET MODAL FORM -------------------------
  $('#form_modal').on('hidden.bs.modal', function () { 
    form.reset();
    //name
    elements.name.previousElementSibling.classList.remove('text-danger');
    elements.name.classList.remove('is-invalid');
    elements.nameError.remove();
    //code
    $('span[aria-labelledby="select2-code-container"]')?.removeClass('is-invalid');
    $('#code')
      .removeClass('is-invalid')
      .prev().removeClass('text-danger');
    elements.codeError.remove();
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
  
  //code
  if ( $('#code').hasClass('is-invalid') ) {
    elements.submitButton.removeAttribute('disabled');
  } else if ( $('#code').val() == "" ) {
    elements.submitButton.removeAttribute('disabled');
    $('#code').trigger('select2:close');
  }

  //name
  if ( elements.name.classList.contains('is-invalid') ) {
    elements.submitButton.removeAttribute('disabled');
    elements.name.focus();
  } else if ( elements.name.value == "" ) {
    elements.submitButton.removeAttribute('disabled');
    elements.name.focus();
    elements.name.dispatchEvent(new Event('input'));
  }

  //If no error, then submit
  if ( !$('#code').hasClass('is-invalid')
    && !elements.name.classList.contains('is-invalid')
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
    ? '../accountant/account_type'
    : `../accountant/account_type/${elements.uuid.value}`
  );
  //Get input data
  const body = {
    name: elements.name.value,
    code: $('#code').val(),
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
      makeFetch(`../accountant/account_type/${id}`, 
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
      makeFetch(`../accountant/account_type/${id}?operation_type=${operation_type}`, 
        options, 
        forNotEditOrViewCallback
      );
    }
  }, 100);
};

//------------------------- DISABLE FORM ELEMENTS -------------------------
const disableFormElements = () => {
  const formElements = document.querySelectorAll(`
    #form input:not([id="uuid"]), 
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
    #form input:not([id="uuid"]), 
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