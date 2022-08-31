'use strict';

//------------------------- GLOBAL VARIABLES -------------------------
var accessType = 0;

//------------------------- FORM ELEMENTS -------------------------
const elements = {
  uuid: document.getElementById('uuid'),
  name: document.getElementById('name'),
  endpoint: document.getElementById('endpoint'),
  description: document.getElementById('description'),
  submitButton: document.getElementById('submitButton'),
  nameError: createError('nameError'),
  endpointError: createError('endpointError')
};

//Reset modal form
const resetModalForm = () => {
  form.reset();

  //For viewing, enable form elements
  if ( accessType == 1 ) {
    enableFormElements({forViewing: true});
    elements.submitButton.style.display = 'block';
  }

  //For removing errors
  accessType = undefined;
  
  //name
  elements.name.dispatchEvent(new Event('input'));
  //endpoint
  elements.endpoint.dispatchEvent(new Event('input'));

  //Remove additional details
  document.getElementById('additionalDetails')?.remove();

  //submitButton
  elements.submitButton.children[0].textContent = 'Submit';
  elements.submitButton.removeAttribute('disabled');

  //Set back to its default
  accessType = 0;
};

//------------------------- INIT & LOAD TABLE -------------------------
var table;
const initLoadTable = () => {
  if ( table ) table.clear().draw().destroy();

  table = $('#table').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
      "url": "../accountant/data_source/datatable",
      "method": "post",
      "contentType": "application/json; charset=UTF-8;",
      "dataType": "json",
      "data": function ( data ) {
        return JSON.stringify(data);
      },
      "dataSrc": function ( response ) {
        for (const responseData of response.data) {
          //status
          const status = responseData.status;
          responseData.status = 
            `<div class="badge ${
              status.toLowerCase() == 'active'
              ? 'badge-primary'
              : 'badge-dark'
            } p-2 w-100">
              ${status.toLowerCase() == 'active'
                ? '<i class="fas fa-check mr-1" aria-hidden="true"></i>'
                : '<i class="fas fa-times mr-1" aria-hidden="true"></i>'
              }
              ${status}
            </div>`;
          //actions
          responseData.id = 
          `<div class="text-center dropdown">
            <a class="btn btn-sm btn-default" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fas fa-ellipsis-v"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right p-0" aria-labelledby="dropdownMenuLink">
              <a class="dropdown-item" onclick="getData('${responseData.id}', 1);"><i class="fas fa-list mr-1" style="width: 2rem;"></i><span>View</span></a>
              <a class="dropdown-item" onclick="getData('${responseData.id}', 0);"><i class="fas fa-edit mr-1" style="width: 2rem;"></i><span>Edit</span></a>
              <div class="dropdown-divider m-0"></div>
              ${
                status.toLowerCase() != 'inactive'
                ? `<a class="dropdown-item" onclick="confirmToDo('${responseData.id}', 0, deActivateData, 'deactivate');"><i class="fas fa-trash-alt mr-1" style="width: 2rem;"></i><span>Deactivate</span></a>`
                : `<a class="dropdown-item" onclick="confirmToDo('${responseData.id}', 1, deActivateData, 'activate');"><i class="fas fa-trash-restore-alt mr-1" style="width: 2rem;"></i><span>Activate</span></a>`
              }
            </div>
          </div>`;
        }
        return response.data;
      },
    },
    "columns": [
      //name
      {
        'data': 'name',
        'name': 'name',
        'width': '20%',
      },
      //endpoint
      {
        'data': 'endpoint',
        'name': 'endpoint',
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
        'width': '0%',
        'searchable': false,
        'orderable': true,
      },
      //id
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
    "order": [[0, 'asc']],
    "lengthChange": true,
    "lengthMenu": [ 10, 25, 50, 75, 100 ],
    "searching": true,
    "info": true,
    "paging": true,
    "language": {
      "zeroRecords": "No result found",
      "info": "Showing _START_ to _END_ of _TOTAL_ data sources",
      "emptyTable": "No available data.",
      "paginate": {
        "next": '<i class="fas fa-caret-right"></i>',
        "previous": '<i class="fas fa-caret-left"></i>',
      },
    },
    "dom": "Bfrtip",
    "buttons": [{
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
      ],
    }],
    "drawCallback": function ( settings ) {},
    "initComplete": function () {
      table.buttons().container().prependTo('#table_filter')
        .parent().addClass('d-flex justify-content-between');
        // .children()[1]
        // .querySelector('input').classList.add('w-100');
    },
  });
};

//------------------------- CALLBACK FOR VIEWING/EDITING DATA -------------------------
const forEditOrViewCallback = (responseData) => {//console.log(responseData)
  //name
  elements.name.value = responseData.name;
  //endpoint
  elements.endpoint.value = responseData.endpoint;
  //description
  elements.description.value = responseData.description;

  //For viewing
  if ( accessType == 1 ) {
    disableFormElements({forViewing: true});
    elements.submitButton.style.display = 'none';
  //For editing
  } else {
    elements.uuid.value = responseData.id;
    elements.submitButton.children[0].textContent = 'Update';
  }

  //Additional details
  const additionalDetails = 
    `<div class="form-group row" id="additionalDetails">
      <div class="col">
        <div class="alert alert-dismissible border p-0">
          <div class="card-header">
            <h3 class="card-title">
              <i class="icon fas fa-info-circle text-info"></i>
              Additional Details
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
              ${ //CREATED
                responseData.ds_created_by != undefined
                ? `<div class="col-12">
                    <div class="row">
                      <dt class="col-sm-2">Created At:</dt>
                      <dd class="col-sm-4">${
                        //created_at
                        formatDate(responseData.created_at)
                      }</dd>
                      <dt class="col-sm-2">Created By:</dt>
                      <dd class="col-sm-4">${
                        //created_by
                        formatName(responseData.ds_created_by.employee)
                      }</dd>
                    </div>
                  </div>`
                : ``
              }
              ${ //UPDATED
                responseData.ds_updated_by != undefined
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
                        formatName(responseData.ds_updated_by.employee)
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

  //Show modal
  $('#form_modal').modal({
    'backdrop': 'static',
    'keyboard': true,
    'focus': true,
    'show': true
  });
};

//------------------------- CALLBACK FOR -------------------------
//------------------------- CREATION, UPDATE, DEACTIVATE & ACTIVATE -------------------------
const notificationCallback = (responseData) => {
  initLoadTable();
  const detail = responseData.detail;
  if ( !/(activated|deactivated)/gi.test(detail) ) {
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
  //Init & load table
  initLoadTable();

  //------------------------- SETUP FORM ELEMENTS & THEIR VALIDATION ------------------------- 
  //NAME
  elements.name.addEventListener('input', function (e) {
    //Remove error if any
    if ( this.classList.contains('is-invalid') ) {
      this.previousElementSibling.classList.remove('text-danger');
      this.classList.remove('is-invalid');
      elements.nameError.remove();
    }
    
    //Return for reset modal form
    if ( accessType == undefined ) return;
    
    //Display error if empty
    if ( this.value == "" ) {
      this.previousElementSibling.classList.add('text-danger');
      displayError(
        this, 
        elements.nameError, 
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
            `../accountant/data_source/validate_input?id=${elements.uuid.value}&column=${this.id}&value=${this.value}&closest=.col`, 
            options, 
            ((responseData) => {
              //Display error if the column has constraint issue
              if ( responseData.has_error ) {
                this.previousElementSibling.classList.add('text-danger');
                displayError(
                  this,
                  elements.nameError,
                  responseData.detail.replace(/_/g, ' '),
                  '.col'
                );
              }              
            })
          );
        }
      }, 100);
    }
  });

  //ENDPOINT
  elements.endpoint.addEventListener('input', function (e) {
    //Remove error if any
    if ( this.classList.contains('is-invalid') ) {
      this.previousElementSibling.classList.remove('text-danger');
      this.classList.remove('is-invalid');
      elements.endpointError.remove();
    }
    
    //Return for reset modal form
    if ( accessType == undefined ) return;
    
    //Display error if empty
    if ( this.value == "" ) {
      this.previousElementSibling.classList.add('text-danger');
      displayError(
        this, 
        elements.endpointError, 
        'Endpoint is required.', 
        '.col'
      );
    //Display error if invalid
    } else if (/[^a-z\d_\-]/gi.test(this.value) ) {
      this.previousElementSibling.classList.add('text-danger');
      displayError(
        this, 
        elements.endpointError, 
        'Endpoint is invalid.', 
        '.col'
      );
    //Make fetch for server-side validation
    } else {
      const interval = setInterval(() => {
        if ( fetchable ) {
          clearInterval(interval);
          options['method'] = 'get';
          makeFetch(
            `../accountant/data_source/validate_input?id=${elements.uuid.value}&column=${this.id}&value=${this.value}&closest=.col`, 
            options, 
            ((responseData) => {
              //Display error if the column has constraint issue
              if ( responseData.has_error ) {
                this.previousElementSibling.classList.add('text-danger');
                displayError(
                  this,
                  elements.endpointError,
                  responseData.detail.replace(/_/g, ' '),
                  '.col'
                );
              }              
            })
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

  //Autofocus name
  $('#form_modal').on('shown.bs.modal', function () { elements.name.focus(); });

  //Reset modal form on hide
  $('#form_modal').on('hidden.bs.modal', function () { resetModalForm(); });

  //------------------------- ENABLE CONFIRM MODAL BUTTONS -------------------------
  $('#confirm-modal').on('hidden.bs.modal', function () {
    confirmDismiss.forEach((dismiss) => { 
      dismiss.style.display = 'block';
      dismiss.removeAttribute('disabled'); 
    });
    confirmSubmit.removeAttribute('disabled');
  });
});

//------------------------- VALIDATE FORM ELEMENTS -------------------------
const validateFormElements = () => {
  elements.submitButton.setAttribute('disabled', 'true');

  //endpoint
  if ( elements.endpoint.classList.contains('is-invalid') ) {
    elements.endpoint.focus();
  } else if ( elements.endpoint.value == "" ) {
    elements.endpoint.focus();
    elements.endpoint.dispatchEvent(new Event('input'));
  }
  
  //name
  if ( elements.name.classList.contains('is-invalid') ) {
    elements.name.focus();
  } else if ( elements.name.value == "" ) {
    elements.name.focus();
    elements.name.dispatchEvent(new Event('input'));
  }

  //If no error, then submit
  if ( !elements.endpoint.classList.contains('is-invalid')
    && !elements.name.classList.contains('is-invalid')
  ) {
    disableFormElements();
    setTimeout(() => { prepareAndSendData(); }, 2000);
  } else {
    elements.submitButton.removeAttribute('disabled');
  }
};

//------------------------- PREPARE & SEND DATA -------------------------
const prepareAndSendData = () => {
  trimTextFields();

  let url;
  //For create
  if ( elements.uuid.value == "" ) {
    url = '../accountant/data_source';
  //For edit
  } else {
    url = `../accountant/data_source/${elements.uuid.value}`;
  }

  //For debugging purposes
  // for (const data of formData.entries()) {
  //   console.log(data[0], ':', data[1]);
  // }

  //------------------------- AJAX REQUEST -------------------------
  //Modify options
  options['method'] = 'post';
  options['cache'] = 'no-store';
  options.headers['Content-Type'] = 'application/json; charset=UTF-8';
  options['body'] = JSON.stringify({
    name: elements.name.value,
    endpoint: elements.endpoint.value,
    description: elements.description.value
  });
  //Make fetch for creation / update
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      makeFetch(
        url,
        options,
        notificationCallback,
        finallyCallback
      );
    }
  }, 100);
};

//------------------------- DISABLE FORM ELEMENTS -------------------------
const disableFormElements = (forViewing=false) => {
  const formElements = document.querySelectorAll(`
    #form input:not([id="uuid"]), 
    #form select,
    #form textarea,
    #form button,
    #form a
    ${(!forViewing ? ',[form="form"]' : '')}
  `);
  formElements.forEach((el) => { el.setAttribute('disabled','true'); });
  if ( !forViewing ) {
    elements.submitButton.children[0].textContent = '';
    elements.submitButton.children[1].className = 'fas fa-1x fa-sync-alt fa-spin';
  }
};

//------------------------- ENABLE FORM ELEMENTS -------------------------
const enableFormElements = (forViewing=false) => {
  const formElements = document.querySelectorAll(`
    #form input:not([id="uuid"]), 
    #form select,
    #form textarea,
    #form button,
    #form a
    ${(!forViewing ? ',[form="form"]' : '')}
  `);
  formElements.forEach((el) => { el.removeAttribute('disabled'); });
  if ( !forViewing ) {
    if ( elements.uuid.value == "" ) elements.submitButton.children[0].textContent = 'Submit';
    else elements.submitButton.children[0].textContent = 'Update';
    elements.submitButton.children[1].className = 'fas fa-check ml-2';
    elements.submitButton.removeAttribute('disabled');
  }
};

//------------------------- FUNCTION FOR GETTING DATA -------------------------
const getData = (id, accessTypeArg) => {
  accessType = accessTypeArg;
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'get';
      makeFetch(
        `../accountant/data_source/${id}`,
        options,
        forEditOrViewCallback
      );
    }
  }, 100);
};

//------------------------- FUNCTION FOR DEACTIVATING / ACTIVATING DATA -------------------------
function deActivateData () {
  disableConfirmModalButtons();
  $('#confirm-modal').modal('hide');
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'delete';
      makeFetch(
        `../accountant/data_source/${this.id}?status=${(this.operation_type==0?'Inactive':'Active')}`,
        options,
        notificationCallback
      );
    }
  }, 100);
}