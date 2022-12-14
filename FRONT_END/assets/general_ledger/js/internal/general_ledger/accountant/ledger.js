'use strict';

//------------------------- GLOBAL VARIABLES -------------------------   
  var table, accountCounter,
  formTable, 
  totalDebitAmount, totalCreditAmount,
  totalDebitAmountForAdjustment, totalCreditAmountForAdjustment, 

  total_asset_amount,
  total_liability_amount, 
  total_equity_amount, 
  total_revenue_amount,
  total_expense_amount,
  total_profit_amount;

//------------------------- ACCOUNTING PERIOD ------------------------- 
const yearEstablished = 2015,
  dateNow = new Date();
var currentPeriod, lastDay,
  currentMonth = dateNow.getMonth(),
  currentYear = dateNow.getFullYear();
  // , currentDate
//Accounting period - month
const apMonths = [
  { id: 0, text: 'January' },
  { id: 1, text: 'February' },
  { id: 2, text: 'March' },
  { id: 3, text: 'April' },
  { id: 4, text: 'May' },
  { id: 5, text: 'June' },
  { id: 6, text: 'July' },
  { id: 7, text: 'August' },
  { id: 8, text: 'September' },
  { id: 9, text: 'October' },
  { id: 10, text: 'November' },
  { id: 11, text: 'December' }
];
//Accounting period - year
const apYears = [];
//Get all accounting period - year
const getAllAPYears = () => {
  for (let year = currentYear; year >= yearEstablished; year--) {
    apYears.push(year);
  }
};
//Set date range
const setDateRange = () => {
  currentPeriod = `${currentYear}-${currentMonth > 9 ? currentMonth : '0'+currentMonth}`;
  lastDay = new Date(currentYear, currentMonth, 0).getDate();
  localStorage.setItem('AP_MONTH', currentMonth-1);
  localStorage.setItem('AP_YEAR', currentYear);
};





  
    
  
    



  
    
 
    
     




  
  
  
    
    
 
  
//------------------------- LOAD TABLE W/ INITIALIZATION -------------------------
const loadTable = () => {
  if ( table ) table.clear().draw().destroy();
    
  table = $('#table').DataTable({


    // "drawCallback": function( settings ) {
    "fnDrawCallback" : function(oSettings) {console.log('ewe')
      total_asset_amount = 'P 0.00', 
      total_liability_amount = 'P 0.00', 
      total_equity_amount = 'P 0.00', 
      total_revenue_amount = 'P 0.00',
      total_expense_amount = 'P 0.00',
      total_profit_amount = 'P 0.00';
  
      const totalDisplayRecord = $("#table").DataTable().page.info().recordsDisplay;
      if ( totalDisplayRecord != 0) { 
        generateBalanceSheet(false);
      } 
  
      // document.getElementById('total_assets').textContent = `P ${formatAmount(parseFloat(total_asset_amount.replace('P ','')))}`;
      // document.getElementById('total_revenues').textContent = `P ${formatAmount(parseFloat(total_revenue_amount.replace('P ','')))}`;
      // document.getElementById('total_equities').textContent = `P ${formatAmount(parseFloat(total_equity_amount.replace('P ','')))}`;
      // document.getElementById('total_liabilities').textContent = `P ${formatAmount(parseFloat(total_liability_amount.replace('P ','')))}`;
      // document.getElementById('total_expenses').textContent = `P ${formatAmount(parseFloat(total_expense_amount.replace('P ','')))}`;
      // document.getElementById('total_profit').textContent = `P ${formatAmount(parseFloat(total_profit_amount.replace('P ','')))}`;   
      
      document.getElementById('total_assets').textContent = total_asset_amount;
      document.getElementById('total_revenues').textContent = total_revenue_amount;
      document.getElementById('total_equities').textContent = total_equity_amount;
      document.getElementById('total_liabilities').textContent = total_liability_amount;
      document.getElementById('total_expenses').textContent = total_expense_amount;
      document.getElementById('total_profit').textContent = total_profit_amount;
    },


    // "fnDrawCallback" : function(oSettings) {console.log('ewe')
     
    // },
    "processing": true,
    "serverSide": true,
    "ajax": {
      "url": "../accountant/ledger/datatable",
      "method": "post",
      "contentType": "application/json; charset=UTF-8;",
      "dataType": "json",
      "data": function ( data ) {
        data['period'] = currentPeriod;
        return JSON.stringify(data);
      },
      "dataSrc": function ( response ) {
        const accounts = [];
        accountCounter = response.data.length;
        let rowCounter = 0;
        let prevAccountNumber, account, account_parts;
        response.data.forEach(function (data, i) {        
          if ( data.account_number != prevAccountNumber ) {
            let status = data.status;
            status = 
              `<div class="badge badge-primary p-2 w-100">  
                <i class="fas fa-check mr-1" aria-hidden="true"></i>
                ${status}  
              </div>`;
            const action = 
              `<div class="text-center dropdown">
                <a class="btn btn-sm btn-default" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="fas fa-ellipsis-v"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right p-0" aria-labelledby="dropdownMenuLink">
                  <a class="dropdown-item " onclick="confirmToUnPost('${rowCounter++}');"><i class="fas fa-undo mr-1" style="width: 2rem;"></i><span>Unpost</span></a>
                </div>
              </div>`; 
            account = {
              account_number: data.account_number,
              account_title: data.account_title,
              status: status,
              action: action
            };
            account_parts = 
              `<div class="table-responsive">
                <table class="table table-borderless account-table">
                  <thead class="border-bottom">
                    <tr class="text-info">
                      <th>Date</th>
                      <th>Explanation</th>
                      <th>Debit</th>
                      <th>Credit</th>
                    </tr>
                  </thead>
                  <tbody>`;
            totalDebitAmount = totalCreditAmount = totalDebitAmountForAdjustment = totalCreditAmountForAdjustment = 0;
          }
          account_parts += 
            `<tr class="border-bottom ${data.entry}">
              <td>${data.date.slice(-2)}</td>
              <td>${data.explanation}</td>
              <td>${data.debit == 0 ? "" : formatAmount(data.debit)}</td>
              <td>${data.credit == 0 ? "" : formatAmount(data.credit)}</td>
            </tr>`;
          if ( data.entry_type == 'Adjusting' && data.date.slice(-2) == lastDay ) {
            totalDebitAmountForAdjustment += data.debit;
            totalCreditAmountForAdjustment += data.credit;
          } else {
            totalDebitAmount += data.debit;
            totalCreditAmount += data.credit;
          }
          if ( accountCounter == i+1 || (data.account_number != response.data[i+1].account_number ) ) {
            const balanceForTb2 = totalDebitAmountForAdjustment - totalCreditAmountForAdjustment;
            const balanceForTb1 = totalDebitAmount - totalCreditAmount;
            const balance = (totalDebitAmount+totalDebitAmountForAdjustment) - (totalCreditAmount+totalCreditAmountForAdjustment);
            account_parts += 
                  `</tbody>
                  <tfoot>
                    <tr>
                      ${
                        balance > 0 || balance == 0
                        ? `<td colspan="2" class="text-right text-muted small">Bal.:</td>`
                        : ``
                      }
                      <td class="text-right">
                        ${
                          balance > 0 
                          ? `<div>
                              <strong id="${data.account_number}-debit">${formatAmount(balance)}</strong>
                              <hr class="my-0" />
                              <hr class="mt-1 mb-0" />
                            </div>`
                          : balance == 0
                            ? `<div>
                                <strong id="${data.account_number}-debit">0.00</strong>
                                <hr class="my-0" />
                                <hr class="mt-1 mb-0" />
                              </div>`
                            : ``
                        }
                      </td>
                      ${
                        balance < 0
                        ? `<td colspan="2" class="text-right text-muted small">Bal.:</td>`
                        : ``
                      }
                      <td class="text-right">
                        ${
                          balance < 0 
                          ? `<div>
                              <strong id="${data.account_number}-credit">${formatAmount(Math.abs(balance))}</strong>
                              <hr class="my-0" />
                              <hr class="mt-1 mb-0" />
                            </div>`
                          : balance == 0
                            ? `<div>
                                <strong id="${data.account_number}-credit">0.00</strong>
                                <hr class="my-0" />
                                <hr class="mt-1 mb-0" />
                              </div>`
                            : ``
                        }
                      </td>
                    </tr>
                  </tfoot>
                </table>
                ${ 
                  balanceForTb1 != 0 
                  ? `<input type="hidden" id="${data.account_number}-${balanceForTb1>0?`debit`:`credit`}-1" value="${Math.abs(balanceForTb1)}" />`
                  : ``
                }
                ${ 
                  balanceForTb2 != 0 
                  ? `<input type="hidden" id="${data.account_number}-${balanceForTb2>0?`debit`:`credit`}-2" value="${Math.abs(balanceForTb2)}" />`
                  : ``
                }
              </div>`; 
            account['accounts'] = account_parts;
            accounts.push(account);
          }
          prevAccountNumber = data.account_number;
        }); 
       /*  // get available reports
        getAvailableReports(); */
        return accounts;
      }
    },
    "columns": [
      { 
        'data': 'account_number',
        'name': 'account_number',
        'width': '1%',
      },
      { 
        'data': 'account_title',
        'name': 'account_title',
        'width': '15%',
      },
      { 
        'data': 'accounts',
        'name': 'accounts',
        'searchable': false,
        'orderable': false,
        'width': '60%',
      },
      { 
        'data': 'status',
        'name': 'status',
        'searchable': false,
        'orderable': false,
        'width': 'auto',
      },
      { 
        'data': 'action',
        'name': 'action',
        'searchable': false,
        'orderable': false,
        'width': 'auto',
      },
    ],
    "deferRender": true,    
    "responsive": true,
    "autoWidth": false,
    "ordering": true,
    "order": [[ 0, 'asc' ]],
    "lengthChange": true,
    "lengthMenu": [ 100 ],
    "searching": true,
    "info": true,
    "paging": true, 
    "language": {
      "zeroRecords": "No result found",
            "info": "Showing _START_ to _END_ of _TOTAL_ accounts",
      "emptyTable": "No accounts have been posted yet for the period.",
      "paginate": {
        "next": '<i class="fas fa-caret-right"></i>',
        "previous": '<i class="fas fa-caret-left"></i>',
      },
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
    
    'initComplete': function () {
      $('div.dt-buttons').append(
        `<div class="dropdown ml-2">
          <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" id="reportDropdownMenuButton" aria-haspopup="true" aria-expanded="false">Report</button>
          <div class="dropdown-menu" aria-labelledby="reportDropdownMenuButton">
            <a class="dropdown-item " onclick="generateTrialBalance(1);">Trial Balance</a>
            <a class="dropdown-item " onclick="generateTrialBalance(2);">Adjustments</a>
            <a class="dropdown-item " onclick="generateTrialBalance(3);">Adjusted Trial Balance</a>
            <a class="dropdown-item " onclick="generateIncomeStatement(true);">Income Statement</a>
            <a class="dropdown-item " onclick="generateChangesInEquity(true);">Statement Of Changes In Equity</a>
            <a class="dropdown-item " onclick="generateBalanceSheet(true);">Balance Sheet</a>
          </div>
        </div>`
      );
      table.buttons().container().prependTo('#table_filter').parent().addClass('d-flex justify-content-between');

        /* // get available reports
    table.on('search.dt', function () { getAvailableReports(); }); */
    // table.buttons().container().prependTo('#table_filter').parent().css({'display':'flex', 'justify-content':'space-between'}); 
    },
    
  });

};



//------------------------- LOAD JOURNALIZED ENTRIES -------------------------
const loadJournalizedEntries = () => {
  $('#journal_entry').empty().append('<option></option>');
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'get';
      makeFetch(
        `../accountant/journal_entries?period=${currentPeriod}`,
        options,
        ((responseData) => {
          let prevEntry, prevId, entries = '', sameCounter = 1;
          responseData.forEach((data, i) => {
            if ( data.text == prevEntry ) {
              sameCounter++;
            } else if ( prevEntry && data.text != prevEntry ) {
              entries += `<option value="${prevId}">${prevEntry}${(sameCounter > 1 ? ' ('+ sameCounter +')' : '')}</option>`;
              sameCounter = 1;
            } 
            if ( i+1 == responseData.length ) {
              entries += `<option value="${data.id}">${data.text}${(sameCounter > 1 ? ' ('+ sameCounter +')' : '')}</option>`;
            }
            prevEntry = data.text;
            prevId = data.id;
          });
          document.getElementById('journal_entry').insertAdjacentHTML('afterbegin', entries);
        })
      );
    }
  }, 100);
};
  

//------------------------- VIEW TABLE FOR JOURNAL ENTRY -------------------------
const loadViewTable = (data) => {
  totalDebitAmount = totalCreditAmount = 0;
  $('#view_table').DataTable({
    "searching": false,
    "order": [],
    "info": false,
    "paging": false,
    "autoWidth": false,
    'responsive': true,
    "columns": [
      // account title
      { 
        'data': 'ja_account_title.account_title',
        'name': 'ja_account_title.account_title',
        'orderable': false, 
        "width": "35%",
        'render': function ( data, type, row ) {
          return `<div class="">${data}</div>`;
        }
      },
       // account_type
      { 
        'data': 'ja_account_title.ca_account_type.name',
        'name': 'ja_account_title.ca_account_type.name',
        'orderable': false, 
        "width": "15%",
      },
      // P.R.
      { 
        'data': 'pr',
        'name': 'pr',
        'orderable': false, 
        "width": "10%",
      },
      // debit 
      { 
        'data': 'debit',
        'name': 'debit',
        'orderable': false, 
        "width": "20%",
        'class': 'text-right',
        'render': function ( data, type, row ) {
          totalDebitAmount += parseFloat(data);
          return data == 0 ? "" : formatAmount(data);
        }
      },
      // credit
      { 
        'data': 'credit',
        'name': 'credit',
        'orderable': false, 
        "width": "20%",
        'class': 'text-right',
        'render': function ( data, type, row ) {
          totalCreditAmount += parseFloat(data);
          return data == 0 ? "" : formatAmount(data);
        }
      },
    ],
    'data': data,
  });
};


//------------------------- FOR EDIT/VIEW CALLBACK -------------------------
// Callback for edit / view process result
const showViewModal = (data) => {
  const viewModal = `
    <div class="modal fade" id="view_modal">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title"><i class="fas fa-book mr-3 text-secondary"></i>${data.entry_type == 'Initial' ? 'Journal Entry':'Adjusting Entry'}</h4>
            <button type="button" class="btn btn-sm btn-default" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><i class="fas fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
          </div>
          <!-- /.modal-body -->
          <div class="modal-footer text-right">
            <button type="button" class="btn btn-sm btn-default mr-2" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-sm btn-primary" id="${data.id}" onclick="post(this);"><span>Post</span><i class="fas fa-check ml-2"></i></button>
          </div>
          <!-- /.modal-footer -->
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->`;
document.body.insertAdjacentHTML('beforeend', viewModal);
$('#view_modal').on('show.bs.modal', function () { displayEntry(data); });
$('#view_modal').on('hidden.bs.modal', function () { this.remove(); });
$('#view_modal').modal({
  'backdrop': 'static',
  'keyboard': true,
  'focus': true,
  'show': true
});
};


// Display entry
const displayEntry = (entry) => {
  const displayedEntry = `
  <div class="row">
  <div class="col">
    <div class="alert alert-dismissible border p-0">
      <div class="card-header">
        <h3 class="card-title">
          <i class="icon fas fa-info-circle text-info"></i>
          Details about 
          ${ 
            entry.entry_type == 'Initial'
            ? 'journal entry'
            : 'adjusting entry'
          }
        </h3>
      </div>
      <!-- /.card-header -->
      <div class="card-body pb-0">
        <dl class="row">
          <dt class="col-sm-2">Entry Type</dt>
          <dd class="col-sm-10">${entry.entry_type}</dd>
          <dt class="col-sm-2">Date</dt>
          <dd class="col-sm-10">${entry.date}</dd>
          <dt class="col-sm-2">Status</dt>
          <dd class="col-sm-10">${entry.status}</dd>
          ${
            entry.entry_type == 'Initial'
            ? `<dt class="col-sm-2">Adjustable</dt>
              <dd class="col-sm-10">${entry.is_adjustable ? 'Yes':'No'}</dd>`
            : ``
          }
          <div class="col-12">
            <div class="row">
              <dt class="col-sm-2">Journal. At:</dt>
              <dd class="col-sm-4">${formatDate(entry.journalized_at)}</dd>
              <dt class="col-sm-2">Journal. By:</dt>
              <dd class="col-sm-4">${formatName(entry.je_journalized_by)}</dd>
            </div>
          </div>
          ${ // POSTED
            entry.je_posted_by != undefined
            ? `<div class="col-12">
                <div class="row">
                  <dt class="col-sm-2">Posted At:</dt>
                  <dd class="col-sm-4">${formatDate(entry.posted_at)}</dd>
                  <dt class="col-sm-2">Posted By:</dt>
                  <dd class="col-sm-4">${formatName(entry.je_posted_by)}</dd>
                </div>
              </div>`
            : ``
          }
          ${ // UPDATED
            entry.je_updated_by != undefined
            ? `<div class="col-12">
                <div class="row">
                  <dt class="col-sm-2">Updated At:</dt>
                  <dd class="col-sm-4">${formatDate(entry.updated_at)}</dd>
                  <dt class="col-sm-2">Updated By:</dt>
                  <dd class="col-sm-4">${formatName(entry.je_updated_by)}</dd>
                </div>
              </div>`
            : ``
          }
          ${ // EXPLANATION
            entry.explanation != ""
            ? `<dt class="col-sm-2">Explanation</dt>
              <dd class="col-sm-10">${entry.explanation}</dd>`
            : ``
          }
        </dl>
        <div class="text-info mt-3 mb-2"><strong>Accounts</strong></div>
        <div class="row">
          <div class="col-auto table-responsive">
            <table id="view_table" class="table table-bordered  nowrap" style="width: 100%;" >
              <thead>
              <tr>
                <th>Account Title</th>
                <th>Account Type</th>
                <th>P.R.</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
              </thead>
              <tbody>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-right text-muted small">Total:</td>
                  <td>
                    <div>
                      <strong id="totalDebitAmount"></strong>
                      <hr class="my-0" />
                      <hr class="mt-1 mb-0" />
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong id="totalCreditAmount"></strong>
                      <hr class="my-0" />
                      <hr class="mt-1 mb-0" />
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.card-body -->
    </div>
  </div>
  </div>`;
  document.querySelector('#view_modal .modal-body').insertAdjacentHTML('beforeend', displayedEntry);
  loadViewTable(entry.je_journal_accounts);
  totalDebitAmount = (totalDebitAmount/2).toString();
  totalCreditAmount = (totalCreditAmount/2).toString();
  document.getElementById(`totalDebitAmount`).textContent = formatAmount(parseFloat(totalDebitAmount));
  document.getElementById(`totalCreditAmount`).textContent = formatAmount(parseFloat(totalCreditAmount));
};



// Post
const post = (button) => {
  disableButtons();
  options['method'] = 'put';
  setTimeout(() => {
    makeFetch(
      `../accountant/ledger?id=${button.id}`,
      options,
      forNotEditOrViewCallback,
      finallyCallback
    );
  }, 2000);
};
  

// Unpost 
function unpost () {
  disableConfirmModalButtons();
  $('#confirm-modal').modal('hide');
  const rows = document.querySelectorAll('.account-table')[this.row].querySelectorAll('tbody > tr');
  const entries = new Set();
  rows.forEach((row) => { entries.add(row.classList[1]); });
  //------------------------- AJAX REQUEST -------------------------
  // Modify options
  options['method'] = 'post';
  options['cache'] = 'no-store';
  options.headers['Content-Type'] = 'application/json; charset=UTF-8';
  options['body'] = JSON.stringify([...entries]);
  // Make a fetch for creation / update
  makeFetch(
    `../accountant/ledger`, 
    options, 
    forNotEditOrViewCallback, 
    finallyCallback
  );
}


//------------------------- FOR NOT EDIT/VIEW CALLBACK -------------------------
// Callback for validation, creation, update, deactivation & activation process result
const forNotEditOrViewCallback = (data) => {
  loadTable();
  loadJournalizedEntries();
  const detail = data.detail;
  if ( detail.includes('Posted') ) {
    $('#view_modal').modal('hide');
    console.log('here')
  }
  document.getElementById('toast-container')?.remove();
  toastr[data.type](detail);
};

//------------------------- FINALLY CALLBACK -------------------------
const finallyCallback = () => {
  const buttons = document.querySelectorAll('#view_modal button');
  if ( buttons.length ) {
    setTimeout(() => {
      buttons.forEach((button) => { button.removeAttribute('disabled'); });
      buttons[2].firstElementChild.textContent = 'Post';
      buttons[2].lastElementChild.className = 'fas fa-check ml-2';
    }, 500);
  } else {
    // Reset options & submit button to their default
    // For creation & update
    delete options.body;
    delete options.headers['Content-Type'];
    options['cache'] = 'no-cache';
  }
};

  
    
   
  







  
  



//------------------------- INIT READY FUNCTION ------------------------- 
$(function () {
  //------------------------- ACCOUNTING PERIOD -------------------------
  //Get all accounting period - year
  getAllAPYears();
  //Load ap_month
  $('#ap_month').select2({
    'data': apMonths,
    'language': {'noResults': () => 'No available months',},
  });
  //Set month to its default value
  currentMonth = parseInt(localStorage.getItem('AP_MONTH') ?? currentMonth);
  $('#ap_month').val(currentMonth++).trigger('change');
  //Set current month to its new value
  $('#ap_month').on('change', function () {
    currentMonth = parseInt(this.value) + 1;
    setDateRange();
    loadTable();
    loadJournalizedEntries();
  });
  //Load ap_year
  $('#ap_year').select2({
    'data': apYears,
    'language': {'noResults': () => 'No available years',},
  })
  //Set current year to its new value
  .on('change', function () {
    currentYear = this.value;
    setDateRange();
    loadTable();
    loadJournalizedEntries();
  })
  //Set year to its default value
  .val(localStorage.getItem('AP_YEAR') ?? currentYear).trigger('change');

  //Load journal_entry
  $('#journal_entry').select2({
    'placeholder': 'Select a journal entry',
    'language': {'noResults': () => 'No available entries',},
  }).on('select2:select', function () {
    options['method'] = 'get';
    makeFetch(
      `../accountant/general_journal/${this.value}`,
      options,
      showViewModal
    );
    $(this).val(null).trigger('change');
  });

  // Enable confirm modal buttons
  $('#confirm-modal').on('hidden.bs.modal', function () {
    confirmDismiss.forEach((dismiss) => { dismiss.removeAttribute('disabled'); });
    confirmSubmit.removeAttribute('disabled');
  });
     
      
});




// confirm to unpost 
const confirmToUnPost = (row) => {
  // update confirm modal
  confirmTitleIcon.className = `fas fa-exclamation-triangle text-secondary mr-3`;
  confirmTitle.textContent = 'Confirmation';
  confirmText.innerHTML = 
    `<div class="d-flex justify-content-between">
      <div class="mr-2"><i><b>Warning: </b></i></div>
      <div>Other accounts may also be unposted due to entry relationship.</div>
    </div>
    <div><br />Are you sure you want to unpost it now?</div>`;
  confirmSubmit.className = `btn btn-sm btn-danger`;
  confirmSubmitText.textContent = `Yes, unpost it!`;
  confirmSubmitIcon.className = 'fas fa-undo ml-2';
  // update attached event
  confirmSubmit.removeEventListener('click', eventCallbackOk);
  eventCallbackOk = unpost.bind({'row': row});
  confirmSubmit.addEventListener('click', eventCallbackOk);
  confirmDismiss.forEach((dismiss) => {
    if ( eventCallbackCancel != undefined ) dismiss.removeEventListener('click', eventCallbackCancel);
  });
  // show modal
  $('#confirm-modal').modal({
    'backdrop': 'static',
    'keyboard': true,
    'focus': true,
    'show': true
  });
};






// Disable buttons
const disableButtons = () => {
  const buttons = document.querySelectorAll(`#view_modal button`);
  buttons.forEach((button) => { button.setAttribute('disabled','true'); });
  buttons[2].firstElementChild.textContent = '';
  buttons[2].lastElementChild.className = 'fas fa-1x fa-sync-alt fa-spin';
};





// Generate trial balance
const generateTrialBalance = (nthTB) => {
  // Get data from table
  const accountNumbers = table.column('account_number:name').data();
  const accountTitles = table.column('account_title:name').data();
  // Instantiate jsPDF w/ options
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'px',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
    hotfixes: ['px_scaling'],
    encryption: {
      userPermissions: ['print']
    },
  });
  // Get & set page settings
  const report = (
    nthTB == 1 
    ? 'Trial Balance'
    : nthTB == 2 
      ? 'Adjustments'
      : 'Adjusted Trial Balance'
  );
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  let leftHeight = pageHeight, y, pageNumber = 0, nextPage;
  // Set title
  y = 50;
  doc.setFont('courier', 'normal', 'bold');
  doc.setFontSize(14);
  doc.text(
    [
      'Homies', 
      report, 
      `${$('#ap_month').find(':selected').text()} ${lastDay}, ${currentYear}`
    ], 
    pageWidth / 2, 
    y, 
    {align: 'center'}
  );
  leftHeight -= 50 + (18.67 * 3);
  // Set column heading
  y += 100;
  doc.setFont('courier', 'normal', 'bold');
  doc.setFontSize(12);
  doc.text('Acct No.', 50, y);
  doc.text('Acct Title', 150, y);
  doc.text('Debit', pageWidth-290, y);
  doc.text('Credit', pageWidth-120, y);
  leftHeight -= 100 + (16 * 1);
  // Set all data for each column
  doc.setFont('courier', 'normal', 'normal');
  totalDebitAmount = totalCreditAmount = 0;
  const length = accountNumbers.length;
  let leftLength = length, counter = 0, 
  debit, credit, hasDebitOrCredit = false;
  for (let i=0; i<length; i++) {
    if ( nthTB == 3 ) {
      let debitTB1 = document.getElementById(`${accountNumbers[i]}-debit-1`)?.value ?? 0;
      let creditTB1 = document.getElementById(`${accountNumbers[i]}-credit-1`)?.value ?? 0;
      let debitTB2 = document.getElementById(`${accountNumbers[i]}-debit-2`)?.value ?? 0;
      let creditTB2 = document.getElementById(`${accountNumbers[i]}-credit-2`)?.value ?? 0;

      debitTB1 = parseFloat(debitTB1);
      creditTB1 = parseFloat(creditTB1);
      debitTB2 = parseFloat(debitTB2);
      creditTB2 = parseFloat(creditTB2);

      debit = debitTB1 + debitTB2 - creditTB2;
      credit = creditTB1 + creditTB2 - debitTB2;
      debit = (debit >= credit ? debit : 0);
      debit = Math.abs(debit);
      credit = Math.abs(credit);
     
     
    }else{
      debit = document.getElementById(`${accountNumbers[i]}-debit-${nthTB}`)?.value ?? 0;
      credit = document.getElementById(`${accountNumbers[i]}-credit-${nthTB}`)?.value ?? 0;
    }
    

    if ( debit != 0 || credit != 0 ) {
    if ( nextPage ) {
      counter++;
      nextPage = false;
      setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
      leftHeight = pageHeight - 50;
      y = 50;
    } else if ( nextPage == undefined ) {
      nextPage = false;
      setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
      y += 25; 
    } else {
      y += 25; 
    }
    doc.text(accountNumbers[i].toString(), 80, y, {align: 'left'});
    doc.text(accountTitles[i].toString(), 150, y, {align: 'left'});
    
    if ( !hasDebitOrCredit ) hasDebitOrCredit = true;
    if ( debit != 0 ) {
      doc.text(`${totalDebitAmount == 0 ?`P `:``}${formatAmount(debit)}`, pageWidth-245, y, {align: 'right'});
      totalDebitAmount += parseFloat(debit);
    } else {
      doc.text(`${totalCreditAmount == 0 ?`P `:``}${formatAmount(credit)}`, pageWidth-65, y, {align: 'right'});
      totalCreditAmount += parseFloat(credit);
    }
    leftHeight -= 25;
    if ( counter != leftLength && Math.floor(leftHeight) < 25 ) {
      doc.addPage();
      nextPage = true;
    }
    } else{
      leftLength--;
    }
  }
  if ( hasDebitOrCredit ) {
    
  
  if ( Math.floor(leftHeight) < 25 ) {
    doc.addPage();
    setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
    y = 50;
  } else {
    y += 25; 
  }
  doc.line(pageWidth-410, y-(25/2), pageWidth-245, y-(25/2));
  doc.line(pageWidth-230, y-(25/2), pageWidth-65, y-(25/2));
  doc.text(`P ${formatAmount(totalDebitAmount)}`, pageWidth-245, y, {align: 'right'});
  doc.text(`P ${formatAmount(totalCreditAmount)}`, pageWidth-65, y, {align: 'right'});
  doc.line(pageWidth-410, y+5, pageWidth-245, y+5);
  doc.line(pageWidth-230, y+5, pageWidth-65, y+5);
  doc.line(pageWidth-410, y+10, pageWidth-245, y+10);
  doc.line(pageWidth-230, y+10, pageWidth-65, y+10);
}
  // View pdf preview
  viewPdfPreview(doc, report);
};

// Generate income statement
var profitOrLoss;
const generateIncomeStatement = (viewable) => {
  // Get data from ledger
  const revenuesAndExpenses = [];
  table.rows().data().each((item) => {
    if (item.account_number >= 4001 && item.account_number <= 5999) revenuesAndExpenses.push(item);
  });

  // Instantiate an jsPDF instance
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'px',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
    hotfixes: ['px_scaling'],
    encryption: {
      userPermissions: ['print']
    },
  });

  // Get & set page settings
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  let leftHeight = pageHeight, y, pageNumber = 0, nextPage;

  // Set title
  y = 50;
  doc.setFont('courier', 'normal', 'bold');
  doc.setFontSize(14);
  doc.text(
    [
      'Homies', 
      'Income Statement', 
      `For the month ended ${$('#ap_month').find(':selected').text()} ${lastDay}, ${currentYear}`
    ], 
    pageWidth / 2, 
    y, 
    {align: 'center'}
  );
  leftHeight -= 50 + (18.67 * 3);

  // Set all data for each column
  totalDebitAmount = totalCreditAmount = 0;
  const length = revenuesAndExpenses.length; 
  let prevFirstCode, debit, credit, hasDebitOrCredit = false;
  revenuesAndExpenses.forEach((item, i) => {
    let debitTB1 = document.getElementById(`${item.account_number}-debit-1`)?.value ?? 0;
    let creditTB1 = document.getElementById(`${item.account_number}-credit-1`)?.value ?? 0;
    let debitTB2 = document.getElementById(`${item.account_number}-debit-2`)?.value ?? 0;
    let creditTB2 = document.getElementById(`${item.account_number}-credit-2`)?.value ?? 0;

    debitTB1 = parseFloat(debitTB1);
    creditTB1 = parseFloat(creditTB1);
    debitTB2 = parseFloat(debitTB2);
    creditTB2 = parseFloat(creditTB2);

    debit = debitTB1 + debitTB2 - creditTB2;
    credit = creditTB1 + creditTB2 - debitTB2;
    debit = (debit >= credit ? debit : 0);
    debit = Math.abs(debit);
    credit = Math.abs(credit);
      
    if ( debit != 0 || credit != 0 ) {
      const firstCode = item.account_number.toString()[0];
      if ( firstCode != prevFirstCode ) {
        if (item.account_number < 5000) {
          // Set revenue column heading
          y += 125;
          doc.setFont('courier', 'normal', 'bold');
          doc.setFontSize(12);
          doc.text('Revenues', 50, y);
          leftHeight -= 125 + (16 * 1);
          doc.setFont('courier', 'normal', 'normal');
        }else{
          // Set expenses heading
          y += 25;
          doc.setFont('courier', 'normal', 'bold');
          doc.setFontSize(12);
          doc.text('Expenses', 50, y);
          leftHeight -= 25 + (16 * 1);
          doc.setFont('courier', 'normal', 'normal');
        }
      }

      if ( nextPage ) {
        counter++;
        nextPage = false;
        setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
        leftHeight = pageHeight - 50;
        y = 50;
      } else if ( nextPage == undefined ) {
        nextPage = false;
        setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
        y += 25; 
      } else {
        y += 25; 
      }
      doc.text(item.account_title, 75, y, {align: 'left'});
      if ( !hasDebitOrCredit ) hasDebitOrCredit = true;
      if ( debit != 0 ) {
        doc.text(`${firstCode != prevFirstCode ?`P `:``}${formatAmount(debit)}`, pageWidth-245, y, {align: 'right'});
        totalDebitAmount += parseFloat(debit);
        if ( firstCode != revenuesAndExpenses[i+1]?.account_number.toString()[0] ) {

          // total_expense_amount
          total_expense_amount = `P ${formatAmount(totalDebitAmount)}`;

          doc.text(`(-) P ${formatAmount(totalDebitAmount)}`, pageWidth-65, y, {align: 'right'});
          doc.line(pageWidth-385, (y+25)-(25/2), pageWidth-65, (y+25)-(25/2));
          y += 25; 
          leftHeight -= 25;
        }
      } else {
        doc.text(`${firstCode != prevFirstCode ?`P `:``}${formatAmount(credit)}`, pageWidth-245, y, {align: 'right'});
        totalCreditAmount += parseFloat(credit);
        if ( firstCode != revenuesAndExpenses[i+1].account_number.toString()[0] ) {

          // total_revenue_amount
          total_revenue_amount = `P ${formatAmount(totalCreditAmount)}`;
          
          doc.text(`P ${formatAmount(totalCreditAmount)}`, pageWidth-65, y, {align: 'right'});
          doc.line(pageWidth-385, (y+25)-(25/2), pageWidth-65, (y+25)-(25/2));
          y += 25; 
          leftHeight -= 25;
        }
      }
      leftHeight -= 25;
      if ( i+1 != length && Math.floor(leftHeight) < 25 ) {
        doc.addPage();
        nextPage = true;
      }
      prevFirstCode = firstCode;
    } 
  });

  // Last part
  if ( hasDebitOrCredit ) {
    if ( Math.floor(leftHeight) < 25 ) {
      doc.addPage();
      setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
      y = 50;
    } else {
      y += 25; 
    }
    profitOrLoss = totalCreditAmount - totalDebitAmount;

    // total_profit_amount
    total_profit_amount = (profitOrLoss > 0 ?`P ${formatAmount(Math.abs(profitOrLoss))}` : `P 0.00`);

    doc.setFont('courier', 'normal', 'bold');
    doc.setFontSize(12);
    doc.text(`${(profitOrLoss >= 0)?`Profit`:`Loss`}`, 50, y);
    doc.setFont('courier', 'normal', 'normal');

    doc.text(`P ${formatAmount(Math.abs(profitOrLoss))}`, pageWidth-65, y, {align: 'right'});
    doc.line(pageWidth-230, y+5, pageWidth-65, y+5);
    doc.line(pageWidth-230, y+10, pageWidth-65, y+10);
  }

  // View pdf preview
  if (viewable) viewPdfPreview(doc, 'Income Statement');
};

// Generate statement of changes in equity
var total_capital, ending_capital_title;
const generateChangesInEquity = (viewable) => {
  // Get profit/loss
  generateIncomeStatement(false);
  // profitOrLoss = 0;
  // Get data from ledger
  let capital = 0, withdrawal = 0;
  table.rows().data().each((item) => {
    if ( item.account_number >= 3001 && item.account_number <= 3999 ) {
      if ( item.account_title.toLowerCase().includes('capital') ) {
        capital = item;
      } else if ( item.account_title.toLowerCase().includes('drawing') 
        || item.account_title.toLowerCase().includes('withdrawal')
      ) {
        withdrawal = item;
      }
    }
  });
  
  // Instantiate an jsPDF instance
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'px',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
    hotfixes: ['px_scaling'],
    encryption: {
      userPermissions: ['print']
    },
  });

  // Get & set page settings
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  let leftHeight = pageHeight, y;

  // Set title
  y = 50;
  leftHeight -= 50 + (18.67 * 3);
  doc.setFont('courier', 'normal', 'bold');
  doc.setFontSize(14);
  doc.text(
    [
      'Homies', 
      'Statement Of Changes In Equity', 
      `For the month ended ${$('#ap_month').find(':selected').text()} ${lastDay}, ${currentYear}`
    ], 
    pageWidth / 2, 
    y, 
    {align: 'center'}
  );
  doc.setFont('courier', 'normal', 'normal');
  doc.setFontSize(12);

  // Capital & withdrawals
  let debit = document.getElementById(`${withdrawal.account_number}-debit`)?.textContent ?? '0.00';
  let credit= document.getElementById(`${capital.account_number}-credit`)?.textContent ?? '0.00';
  
  // Capital Beginning
  y += 125;
  leftHeight -= 125 + (16 * 1);
  console.log(capital)
  doc.text(`${capital.account_title.replace(',', '')}, ${$('#ap_month').find(':selected').text()} 01, ${currentYear}`, 50, y);
  doc.text(`P ${credit}`, pageWidth-65, y, {align: 'right'});
  
  // Add:
  y += 25;
  leftHeight -= 25 + (16 * 1);
  doc.text('Add: Additional Investment', 50, y);
  doc.text(`P 0.00`, pageWidth-245, y, {align: 'right'});

  let add;
  // Profit
  if ( profitOrLoss >= 0 ) {
    y += 25;
    leftHeight -= 25 + (16 * 1);
    doc.text('Profit', 95, y);
    doc.text(`${formatAmount(Math.abs(profitOrLoss))}`, pageWidth-245, y, {align: 'right'});
    doc.text(`${formatAmount(Math.abs(profitOrLoss))}`, pageWidth-65, y, {align: 'right'});
    add = profitOrLoss;
  } else {
    doc.text(`0.00`, pageWidth-65, y, {align: 'right'});
    add = 0;
  }
  doc.line(pageWidth-385, (y+25)-(25/2), pageWidth-65, (y+25)-(25/2));
 
  // Total
  credit = parseFloat(credit.replace(',',''));
  const total = credit + add;
  y += 33;
  leftHeight -= 33 + (16 * 1);
  doc.text('Total', 50, y);
  doc.text(`${formatAmount(Math.abs(total))}`, pageWidth-65, y, {align: 'right'});
      
  // Less:
  y += 25;
  leftHeight -= 25 + (16 * 1);
  doc.text('Less: Withdrawals', 50, y);
  doc.text(`${debit}`, pageWidth-245, y, {align: 'right'});
  
  let less;
  // Loss
  if ( profitOrLoss < 0 ) {
    y += 25;
    leftHeight -= 25 + (16 * 1);
    doc.text('Loss', 95, y);
    doc.text(`${formatAmount(Math.abs(profitOrLoss))}`, pageWidth-245, y, {align: 'right'});
    less = Math.abs(profitOrLoss) + parseFloat(debit.replace(',',''));
    doc.text(`(-) ${formatAmount(Math.abs(less))}`, pageWidth-65, y, {align: 'right'});
  } else {
    less = parseFloat(debit.replace(',',''));
    doc.text(`(-) ${debit}`, pageWidth-65, y, {align: 'right'});
  }
  doc.line(pageWidth-385, (y+25)-(25/2), pageWidth-65, (y+25)-(25/2));
      
  // Capital Ending
  y += 33;
  leftHeight -= 33 + (16 * 1);
  ending_capital_title = `${capital.account_title.replace(',', '')}, ${$('#ap_month').find(':selected').text()} ${lastDay}, ${currentYear}`;
  total_capital = total-less;
  doc.text(ending_capital_title, 50, y);
  doc.text(`P ${formatAmount(total_capital)}`, pageWidth-65, y, {align: 'right'});
   
  doc.line(pageWidth-230, y+5, pageWidth-65, y+5);
  doc.line(pageWidth-230, y+10, pageWidth-65, y+10);
     
      
       
       
    
  setPageNumber(doc, 1, pageWidth, pageHeight);
      
   

  if (viewable) viewPdfPreview(doc, 'Statement Of Changes In Equity');
};

// Generate balance sheet
const generateBalanceSheet = (viewable) => {
  // Get profit/loss
  generateChangesInEquity(false);
  
  const assets = [], contra_assets = [], liabilities = [];
  table.rows().data().each((item) => {
    if (item.account_number >= 1001 && item.account_number <= 1999) assets.push(item);
    else if (item.account_number >= 6001 && item.account_number <= 6999) contra_assets.push(item);
    else if (item.account_number >= 2001 && item.account_number <= 2999) liabilities.push(item);
  });

  let idx, is_non_current_asset, current_assets = [], non_current_assets = [];
  assets.forEach((asset, i) => {
    is_non_current_asset = false;
    contra_assets.forEach((contra_asset, i) => {
      if ( contra_asset.account_title.toLowerCase().includes(asset.account_title.toLowerCase())){
        is_non_current_asset = true;
        idx = i;
      }
    });
    if (is_non_current_asset) {
      non_current_assets.push(asset);
      non_current_assets.push(contra_assets[idx]);
    } else {
      current_assets.push(asset);
    }
  });
  
  // Instantiate an jsPDF instance
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'px',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
    hotfixes: ['px_scaling'],
    encryption: {
      userPermissions: ['print']
    },
  });

  // Get & set page settings
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  let leftHeight = pageHeight, y, pageNumber = 0, nextPage;

  // Set title
  y = 50;
  leftHeight -= 50 + (18.67 * 3);
  doc.setFont('courier', 'normal', 'bold');
  doc.setFontSize(14);
  doc.text(
    [
      'Homies', 
      'Balance sheet', 
      `For the month ended ${$('#ap_month').find(':selected').text()} ${lastDay}, ${currentYear}`
    ], 
    pageWidth / 2, 
    y, 
    {align: 'center'}
  );
  doc.setFont('courier', 'normal', 'normal');
  doc.setFontSize(12);

  // Asset
  y += 100;
  leftHeight -= 100 + (16 * 1);
  doc.setFont('courier', 'normal', 'bold');
  doc.text('Assets', pageWidth / 2, y, {align: 'center'});
   
  // Current assets
  let total_current_assets = 0;
  if ( current_assets.length ) {
     // Current assets
    y += 40;
    leftHeight -= 40 + (16 * 1);
    doc.setFont('courier', 'normal', 'bold');
    doc.text('Current Assets:', 50, y);

    doc.setFont('courier', 'normal', 'normal');
    const length = current_assets.length; 
    let debit, credit, hasDebitOrCredit = false;
    current_assets.forEach((item, i) => {
      let debitTB1 = document.getElementById(`${item.account_number}-debit-1`)?.value ?? 0;
      let creditTB1 = document.getElementById(`${item.account_number}-credit-1`)?.value ?? 0;
      let debitTB2 = document.getElementById(`${item.account_number}-debit-2`)?.value ?? 0;
      let creditTB2 = document.getElementById(`${item.account_number}-credit-2`)?.value ?? 0;

      debitTB1 = parseFloat(debitTB1);
      creditTB1 = parseFloat(creditTB1);
      debitTB2 = parseFloat(debitTB2);
      creditTB2 = parseFloat(creditTB2);

      debit = debitTB1 + debitTB2 - creditTB2;
      credit = creditTB1 + creditTB2 - debitTB2;
      debit = (debit >= credit ? debit : 0);
      debit = Math.abs(debit);
      credit = Math.abs(credit);
        
      if ( debit != 0 || credit != 0 ) {
        if ( nextPage ) {
          counter++;
          nextPage = false;
          setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
          leftHeight = pageHeight - 50;
          y = 50;
          leftHeight -= 25;
        } else if ( nextPage == undefined ) {
          nextPage = false;
          setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
          y += 25; 
          leftHeight -= 25;
        } else {
          y += 25; 
          leftHeight -= 25;
        }
        doc.text(item.account_title, 70, y, {align: 'left'});
        if ( debit != 0 ) {
          doc.text(`${total_current_assets == 0 ?`P `:``}${formatAmount(debit)}`, pageWidth-245, y, {align: 'right'});
          total_current_assets += parseFloat(debit);
        } else {
          doc.text(`${total_current_assets == 0 ?`P `:``}${formatAmount(credit)}`, pageWidth-245, y, {align: 'right'});
          total_current_assets += parseFloat(credit);
        }
        if ( i+1 != length && Math.floor(leftHeight) < 25 ) {
          doc.addPage();
          nextPage = true;
        }
        if ( !hasDebitOrCredit ) hasDebitOrCredit = true;
      } 
    });

    if ( hasDebitOrCredit ) {
      if ( Math.floor(leftHeight) < 25 ) {
        doc.addPage();
        setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
        y = 50;
      } else {
        y += 25;
        leftHeight -= 25; 
      }
      doc.setFont('courier', 'normal', 'normal');
      doc.setFontSize(12);
      doc.text(`Total Current Assets`, 100, y);
      doc.line(pageWidth-385, (y)-(25/2), pageWidth-245, (y)-(25/2));
      y += 5;
      leftHeight -= 5; 
      doc.text(`P ${formatAmount(Math.abs(total_current_assets))}`, pageWidth-65, y, {align: 'right'});
    }
  }





  


  // Non-current assets
  let total_non_current_assets = 0;
  if ( non_current_assets.length ) {
    // Non-current assets
   y += 25;
   leftHeight -= 25 + (16 * 1);
   doc.setFont('courier', 'normal', 'bold');
   doc.text('Non-Current Assets:', 50, y);

   doc.setFont('courier', 'normal', 'normal');
   const length = non_current_assets.length; 
   let debit, credit, hasDebitOrCredit = false;
   non_current_assets.forEach((item, i) => {
     let debitTB1 = document.getElementById(`${item.account_number}-debit-1`)?.value ?? 0;
     let creditTB1 = document.getElementById(`${item.account_number}-credit-1`)?.value ?? 0;
     let debitTB2 = document.getElementById(`${item.account_number}-debit-2`)?.value ?? 0;
     let creditTB2 = document.getElementById(`${item.account_number}-credit-2`)?.value ?? 0;

     debitTB1 = parseFloat(debitTB1);
     creditTB1 = parseFloat(creditTB1);
     debitTB2 = parseFloat(debitTB2);
     creditTB2 = parseFloat(creditTB2);

     debit = debitTB1 + debitTB2 - creditTB2;
     credit = creditTB1 + creditTB2 - debitTB2;
     debit = (debit >= credit ? debit : 0);
     debit = Math.abs(debit);
     credit = Math.abs(credit);
       
     if ( debit != 0 || credit != 0 ) {
       if ( nextPage ) {
         counter++;
         nextPage = false;
         setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
         leftHeight = pageHeight - 50;
         y = 50;
         leftHeight -= 25;
       } else if ( nextPage == undefined ) {
         nextPage = false;
         setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
         y += 25; 
         leftHeight -= 25;
       } else {
         y += 25; 
         leftHeight -= 25;
       }
       const is_contra_asset = item.account_title.includes('Acc.');
       doc.text(`${is_contra_asset ? `Less: `:``}${item.account_title}`, 70, y, {align: 'left'});
       if ( debit != 0 ) {
         doc.text(`${
          (total_current_assets == 0 && total_non_current_assets == 0)
           ? `P `
           : is_contra_asset
             ? `(-)`
             : ``
        }${formatAmount(debit)}`, pageWidth-245, y, {align: 'right'});
         if ( is_contra_asset ) {
           total_non_current_assets -= parseFloat(debit);
         } else {
          total_non_current_assets += parseFloat(debit);
         }
       } else {
         doc.text(`${
          (total_current_assets == 0 && total_non_current_assets == 0)
          ? `P `
          : is_contra_asset
            ? `(-)`
            : ``
         }${formatAmount(credit)}`, pageWidth-245, y, {align: 'right'});
         if ( is_contra_asset ) {
           total_non_current_assets -= parseFloat(credit);
         } else {
          total_non_current_assets += parseFloat(credit);
         } 
       }

      
       if ( i+1 != length && Math.floor(leftHeight) < 25 ) {
         doc.addPage();
         nextPage = true;
       }
       if ( !hasDebitOrCredit ) hasDebitOrCredit = true;
     } 
   });

   if ( hasDebitOrCredit ) {
    if ( Math.floor(leftHeight) < 25 ) {
      doc.addPage();
      setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
      y = 50;
    } else {
      y += 25;
      leftHeight -= 25; 
    }
    doc.setFont('courier', 'normal', 'normal');
    doc.setFontSize(12);
    doc.text(`Total Non-Current Assets`, 100, y);
    doc.line(pageWidth-385, (y)-(25/2), pageWidth-245, (y)-(25/2));
    y += 5;
    leftHeight -= 5; 
    doc.text(`${total_current_assets == 0 ?`P `:``}${formatAmount(Math.abs(total_non_current_assets))}`, pageWidth-65, y, {align: 'right'});
  }
 }

  // Total assets
  y += 25;
  leftHeight -= 25 + (16 * 1);
  doc.setFont('courier', 'normal', 'normal');
  doc.text('Total Assets', 50, y);
  if ( total_current_assets != 0 || total_non_current_assets != 0 ) doc.line(pageWidth-230, y-15, pageWidth-65, y-15);
  doc.text(`P ${formatAmount(Math.abs(total_current_assets+total_non_current_assets))}`, pageWidth-65, y, {align: 'right'});
  doc.line(pageWidth-230, y+5, pageWidth-65, y+5);
  doc.line(pageWidth-230, y+10, pageWidth-65, y+10);

  // total_asset_amount
  total_asset_amount = `P ${formatAmount(Math.abs(total_current_assets+total_non_current_assets))}`;

  // Liability & equity
  y += 55;
  leftHeight -= 55 + (16 * 1);
  doc.setFont('courier', 'normal', 'bold');
  doc.text('Liabilities & Owner`s Equity', pageWidth / 2, y, {align: 'center'});
  
  // Current liabilities
  let total_liabilities = 0;
  if ( liabilities.length ) {
     // Current liabilities
    y += 40;
    leftHeight -= 40 + (16 * 1);
    doc.setFont('courier', 'normal', 'bold');
    doc.text('Current Liabilities:', 50, y);

    doc.setFont('courier', 'normal', 'normal');
    const length = liabilities.length; 
    let debit, credit, hasDebitOrCredit = false;
    liabilities.forEach((item, i) => {
      let debitTB1 = document.getElementById(`${item.account_number}-debit-1`)?.value ?? 0;
      let creditTB1 = document.getElementById(`${item.account_number}-credit-1`)?.value ?? 0;
      let debitTB2 = document.getElementById(`${item.account_number}-debit-2`)?.value ?? 0;
      let creditTB2 = document.getElementById(`${item.account_number}-credit-2`)?.value ?? 0;

      debitTB1 = parseFloat(debitTB1);
      creditTB1 = parseFloat(creditTB1);
      debitTB2 = parseFloat(debitTB2);
      creditTB2 = parseFloat(creditTB2);

      debit = debitTB1 + debitTB2 - creditTB2;
      credit = creditTB1 + creditTB2 - debitTB2;
      debit = (debit >= credit ? debit : 0);
      debit = Math.abs(debit);
      credit = Math.abs(credit);
        
      if ( debit != 0 || credit != 0 ) {
        if ( nextPage ) {
          counter++;
          nextPage = false;
          setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
          leftHeight = pageHeight - 50;
          y = 50;
          leftHeight -= 25;
        } else if ( nextPage == undefined ) {
          nextPage = false;
          setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
          y += 25; 
          leftHeight -= 25;
        } else {
          y += 25; 
          leftHeight -= 25;
        }
        doc.text(item.account_title, 70, y, {align: 'left'});
        if ( debit != 0 ) {
          doc.text(`${total_liabilities == 0 ?`P `:``}${formatAmount(debit)}`, pageWidth-245, y, {align: 'right'});
          total_liabilities += parseFloat(debit);
        } else {
          doc.text(`${total_liabilities == 0 ?`P `:``}${formatAmount(credit)}`, pageWidth-245, y, {align: 'right'});
          total_liabilities += parseFloat(credit);
        }
        if ( i+1 != length && Math.floor(leftHeight) < 25 ) {
          doc.addPage();
          nextPage = true;
        }
        if ( !hasDebitOrCredit ) hasDebitOrCredit = true;
      } 
    });

    if ( hasDebitOrCredit ) {
      if ( Math.floor(leftHeight) < 25 ) {
        doc.addPage();
        setPageNumber(doc, ++pageNumber, pageWidth, pageHeight);
        y = 50;
      } else {
        y += 25;
        leftHeight -= 25; 
      }
      doc.setFont('courier', 'normal', 'normal');
      doc.setFontSize(12);
      doc.text(`Total Current Liabilities`, 100, y);
      doc.line(pageWidth-385, (y)-(25/2), pageWidth-245, (y)-(25/2));
      y += 5;
      leftHeight -= 5; 
      doc.text(`P ${formatAmount(Math.abs(total_liabilities))}`, pageWidth-65, y, {align: 'right'});
    }
  }

  // Ending capital
  y += 35;
  leftHeight -= 35 + (16 * 1);
  doc.setFont('courier', 'normal', 'normal');
  doc.text(ending_capital_title, 50, y);
  doc.text(`${total_liabilities == 0 ?`P `:``}${formatAmount(Math.abs(total_capital))}`, pageWidth-65, y, {align: 'right'});
  
  // Total liabilities & equity
  y += 25;
  leftHeight -= 25 + (16 * 1);
  doc.setFont('courier', 'normal', 'normal');
  doc.text('Total Liabilities & Owner`s Equity', 50, y);

  doc.line(pageWidth-230, y-15, pageWidth-65, y-15);
  doc.text(`P ${formatAmount(Math.abs(total_liabilities+total_capital))}`, pageWidth-65, y, {align: 'right'});
  doc.line(pageWidth-230, y+5, pageWidth-65, y+5);
  doc.line(pageWidth-230, y+10, pageWidth-65, y+10);


  total_liability_amount = `P ${formatAmount(Math.abs(total_liabilities))}`;
  total_equity_amount = `P ${formatAmount(Math.abs(total_capital))}`;


  if (viewable ) viewPdfPreview(doc, 'Balance sheet');
};

// Set page number
const setPageNumber = (doc, pageNumber, pageWidth, pageHeight) => {
  doc.setPage(pageNumber);
  doc.setFontSize(8);
  doc.text(`Page ${pageNumber}`, pageWidth/2, pageHeight-5);
  doc.setFontSize(12);
};

// View pdf preview
const viewPdfPreview = (doc, report) => {
  // Get output from jsPDF instance
  const output = doc.output('blob');
  const reader = new FileReader();
  reader.readAsDataURL(output);
  reader.onloadend = function() { 
    const base64data = reader.result;
    // pdf_viewer_modal
    const pdfViewerModal = `
    <div class="modal fade" id="pdf_viewer_modal">
      <div class="modal-dialog modal-custom modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title"><i class="fas fa-file-pdf mr-3 text-secondary"></i>${report}</h4>
            <button type="button" class="btn btn-sm btn-default" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><i class="fas fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <iframe src="${base64data}" style="width: 100%; height: ${document.body.clientHeight}px; border: none;"></iframe>
          </div>
          <!-- /.modal-body -->
          <div class="modal-footer text-right">
            <button type="button" class="btn btn-sm btn-default mr-2" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-sm btn-primary" id="downloadButton">Download<i class="fas fa-download ml-2"></i></button>
          </div>
          <!-- /.modal-footer -->
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->`;
    document.body.insertAdjacentHTML('beforeend', pdfViewerModal);
    // Attach event
    const eventCallback = downloadPdf.bind({'doc': doc, 'name': `${report}-${currentYear}-${currentMonth}`});
    document.getElementById('downloadButton').addEventListener('click', eventCallback);
    $('#pdf_viewer_modal').on('hidden.bs.modal', function () { this.remove(); });
    $('#pdf_viewer_modal').modal({
      'backdrop': 'static',
      'keyboard': true,
      'focus': true,
      'show': true
    });
  };
};

// Download pdf
function downloadPdf () {
  $('#pdf_viewer_modal').modal('hide');
  this.doc.save(this.name);
};

