'use strict';
  
//------------------------- GLOBAL VARIABLES ------------------------- 
var accessType = 0, entryType = 'Initial',
  accountToAdjust;
  
 

//------------------------- ACCOUNTING PERIOD ------------------------- 
const yearEstablished = 2015,
  dateNow = new Date();
var currentPeriod, currentDate, lastDay,
  currentMonth = dateNow.getMonth(), 
  currentYear = dateNow.getFullYear();
//Accounting period - month
const apMonths = [
  { id: 0,  text: 'January' },
  { id: 1,  text: 'February' },
  { id: 2,  text: 'March' },
  { id: 3,  text: 'April' },
  { id: 4,  text: 'May' },
  { id: 5,  text: 'June' },
  { id: 6,  text: 'July' },
  { id: 7,  text: 'August' },
  { id: 8,  text: 'September' },
  { id: 9,  text: 'October' },
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
  elements.date.min = currentPeriod + '-01';
  elements.date.max = currentPeriod + '-' + lastDay;
  elements.date.value = currentDate = currentPeriod + '-' + (dateNow.toString().slice(8,10));
  localStorage.setItem('AP_MONTH', currentMonth-1);
  localStorage.setItem('AP_YEAR', currentYear);
};









//------------------------- FORM ELEMENTS -------------------------
const elements = {
  'uuid': document.getElementById('uuid'),
  'iframePlaceholder': document.getElementById('iframePlaceholder'),
  'imgPlaceholder': document.getElementById('imgPlaceholder'),
  'source_document_filename': document.getElementById('source_document_filename'),
  'source_document': document.getElementById('source_document'),
  'date': document.getElementById('date'),
  'explanation': document.getElementById('explanation'),
  'status': document.getElementById('status'),
  'submitButton': document.getElementById('submitButton'),
  'source_document_filenameError': createError('source_document_filenameError'),
  'dateError': createError('dateError'),
  'debit_accountError': createError('debit_accountError'),
  'credit_accountError': createError('credit_accountError')
};

//Reset modal form
const resetModalForm = () => {
  $('#data_source').val(null).trigger('change');
  document.getElementById('source-data-table')?.closest('div.row')?.remove();
  document.getElementById('source-data')?.remove();

  document.getElementById('displayedEntry')?.remove();

  form.reset();

  //Show source document
  elements.iframePlaceholder.closest('div.form-group').style.display = 'block';
  elements.source_document_filename.closest('div.form-group').style.display = 'block';

  removeSourceDocument();
  
  $('#entry_type').prop('disabled', false);

  // elements.date.previousElementSibling.classList.remove('text-danger');
  // elements.date.classList.remove('is-invalid');
  elements.date.value = currentDate;
  // elements.dateError.remove();
  
  //Enable date
  //elements.date.removeAttribute('disabled');

  //Enable debit & credit accounts
  $('#debit_account').prop('disabled', false);
  $('#credit_account').prop('disabled', false);
  
  clearError();

  if ( formTable ) formTable.clear().draw();

  $('#is_adjustable').prop({'disabled': true, 'checked': false})
      .trigger('change');
      
  //Remove additional details
  document.getElementById('additionalDetails')?.remove();

  elements.submitButton.firstElementChild.textContent = 'Submit';
  elements.submitButton.removeAttribute('disabled');
};




//------------------------- LOAD TABLE W/ INIT -------------------------
var table, prevStatus = 'Posted';
const loadTable = ({status, type}) => {
  if ( status ) prevStatus = status;
  else status = prevStatus;
  
  if ( type ) entryType = type;
  else type = entryType;
  
  if ( table ) table.clear().draw().destroy();
    
  table = $('#table').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
      "url": "../accountant/general_journal/datatable",
      "method": "post",
      "contentType": "application/json; charset=UTF-8;",
      "dataType": "json",
      "data": function ( data ) {
        data['period'] = currentPeriod;
        data['status'] = status;
        data['type'] = type;
        return JSON.stringify(data);
      },
      "dataSrc": function ( response ) {
        const entryCounter = response.data.length;
        const entries = [];
        let prevEntry, entry;
        response.data.forEach(function (responseData, i) {
          if ( responseData.id != prevEntry ) {
            let status = responseData.status;
            status = 
              `<div class="badge ${
                  status.toLowerCase() == 'journalized' 
                  ? 'badge-warning' 
                  : ( status.toLowerCase() == 'posted'
                      ? 'badge-primary'
                      : ''
                    )
                } p-2 w-100">  
                <i class="fas fa-check mr-1" aria-hidden="true"></i>
                ${status}  
              </div>`;
            const id = responseData.id;
            const action = 
              `<div class="text-center dropdown">
                <a class="btn btn-sm btn-default" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="fas fa-ellipsis-v"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right p-0" aria-labelledby="dropdownMenuLink">
                  <a class="dropdown-item " onclick="getData('${id}', 1);"><i class="fas fa-list mr-1" style="width: 2rem;"></i><span>View</span></a>
                  <a class="dropdown-item " onclick="getData('${id}', ${(
                    (
                      responseData.entry_type == 'Adjusting' 
                      && /^(interest expense|interest payable)$/i.test(responseData.account_title)
                    ) ? -3 : 0
                  )});"><i class="fas fa-edit mr-1" style="width: 2rem;"></i><span>Edit</span></a>
                  ${
                    responseData.status.toLowerCase() != 'posted'
                    ? `<a class="dropdown-item " onclick="confirmToDo('${id}', 2, toDo, 'post', false);"><i class="fas fa-undo mr-1" style="width: 2rem;"></i><span>Post</span></a>`
                    : `<a class="dropdown-item " onclick="confirmToDo('${id}', 3, toDo, 'unpost', ${responseData.hasAdjustment});"><i class="fas fa-redo mr-1" style="width: 2rem;"></i><span>Unpost</span></a>`
                  }
                  ${
                    ( responseData.status.toLowerCase() == 'posted'
                      && responseData.is_adjustable )
                    ? `<a class="dropdown-item " onclick="getData('${id}', -1);"><i class="fas fa-edit mr-1" style="width: 2rem;"></i><span>Adjust</span></a>`
                    : ``
                  }
                  <div class="dropdown-divider m-0"></div><a class="dropdown-item " onclick="confirmToDo('${id}', 0, toDo, 'delete', ${responseData.hasAdjustment});"><i class="fas fa-trash-alt mr-1" style="width: 2rem;"></i><span>Delete</span></a>
                </div>
              </div>`; 
            entry = {
              date: responseData.date.slice(-2),
              explanation: responseData.explanation,
              entry_type: responseData.entry_type,
              is_adjustable: (responseData.is_adjustable ? 'Yes':'No'),
              status: status,
              action: action
            };
            accounts = 
              `<div class="table-responsive">
                <table class="table table-borderless account-table">
                  <thead class="border-bottom">
                    <tr class="text-info">
                      <th>Account Title</th>
                      <th>P.R.</th>
                      <th>Debit</th>
                      <th>Credit</th>
                    </tr>
                  </thead>
                  <tbody>`;
            totalDebitAmount = totalCreditAmount = 0;
          }
          accounts += 
            `<tr class="border-bottom">
              <td class="${responseData.debit == 0 ? 'pl-4' : ''}">${responseData.account_title}</td>
              <td>${responseData.pr}</td>
              <td>${responseData.debit == 0 ? "" : formatAmount(responseData.debit)}</td>
              <td>${responseData.credit == 0 ? "" : formatAmount(responseData.credit)}</td>
            </tr>`;
          totalDebitAmount += responseData.debit;
          totalCreditAmount += responseData.credit;
          if ( entryCounter == i+1 || (responseData.id != response.data[i+1].id ) ) {
            accounts += 
                  `</tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2"></td>
                      <td class="text-right">
                        <div>
                          <strong>${formatAmount(totalDebitAmount)}</strong>
                          <hr class="my-0" />
                          <hr class="mt-1 mb-0" />
                        </div>
                      </td>
                      <td class="text-right">
                        <div>
                          <strong>${formatAmount(totalCreditAmount)}</strong>
                          <hr class="my-0" />
                          <hr class="mt-1 mb-0" />
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>`; 
            entry['accounts'] = accounts;
            entries.push(entry);
          }
          prevEntry = responseData.id;
        }); 
        return entries;
      }
    },
    "columns": [
      { 
        'data': 'date',
        'name': 'date',
        'width': 'auto',
      },
      { 
        'data': 'accounts',
        'name': 'accounts',
        'searchable': false,
        'orderable': false,
        'width': '75%',
      },
      { 
        'data': 'explanation',
        'name': 'explanation',
        'searchable': false,
        'orderable': false,
        'width': '25%',
      },
      { 
        'data': 'entry_type',
        'name': 'entry_type',
        'searchable': false,
        'orderable': false,
        'width': 'auto',
      },
      { 
        'data': 'is_adjustable',
        'name': 'is_adjustable',
        'searchable': false,
        'orderable': true,
        'width': 'auto',
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
            "info": "Showing _START_ to _END_ of _TOTAL_ entries",
      "emptyTable": "No entries available for the period.",
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
    "drawCallback": function( settings ) {
      //Count total accounts
      countTotalAccounts();
    },
    'initComplete': function () {
      $(`<div class="dropdown mx-2" id="typeDropdown">
          <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" id="typeDropdownMenuButton" aria-haspopup="true" aria-expanded="false">Show by Type</button>
          <div class="dropdown-menu" aria-labelledby="typeDropdownMenuButton">
            <a class="dropdown-item ${type.toLowerCase()=='initial'?'active':''}" onclick="loadTable({type:'Initial'});">Initial Entry</a>
            <a class="dropdown-item ${type.toLowerCase()=='adjusting'?'active':''}" onclick="loadTable({type:'Adjusting'});">Adjusting Entry</a>
            <a class="dropdown-item ${type.toLowerCase()=='closing'?'active':''}" onclick="loadTable({type:'Closing'});">Closing Entry</a>
            <a class="dropdown-item ${type.toLowerCase()=='reversing'?'active':''}" onclick="loadTable({type:'Reversing'});">Reversing Entry</a>
          </div>
        </div>
      `).insertAfter('button.buttons-collection');
      $(`<div class="dropdown">
          <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" id="statusDropdownMenuButton" aria-haspopup="true" aria-expanded="false">Show by Status</button>
          <div class="dropdown-menu" aria-labelledby="statusDropdownMenuButton">
            <a class="dropdown-item ${status.toLowerCase()=='journalized'?'active':''}" onclick="loadTable({status:'Journalized'});">Journalized</a>
            <a class="dropdown-item ${status.toLowerCase()=='posted'?'active':''}" onclick="loadTable({status:'Posted'});">Posted</a>
          </div>
        </div>
      `).insertAfter('#typeDropdown');
      table.buttons().container().prependTo('#table_filter')
        .parent().addClass('d-flex justify-content-between');
        /* .children()[1]
        .querySelector('input').classList.add('w-100'); */
    },
  });
};

//Load data sources
const loadDataSources = () => {
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'get';
      makeFetch(
        '../accountant/data_sources',
        options,
        ((responseData) => {
          $('#data_source').empty().append('<option></option>');
          for (const dataSource of responseData) {
            $('#data_source').append(`<option value=${dataSource.id}>${dataSource.text}</option>`);
          }
        })
      );
    }
  }, 100);
};
//Load account titles
const accountTypes = ['Assets','Liabilities','Equities','Revenues','Expenses','Contra Assets'];
const loadAccountTitles = () => {
  loadDataSources();
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'get';
      makeFetch(
        `../accountant/chart_accounts`,
        options,
        ((responseData) => {
          $('#debit_account').empty().append('<option></option>');
          $('#credit_account').empty().append('<option></option>');
          let prevFirstCode = 0, debitOptgroups = '', creditOptgroups = '';
          for (const accountTitle of responseData) {
            const firstCode = parseInt(accountTitle.id.slice(37,38));
            //Opening tags
            if ( firstCode > prevFirstCode ) {
              if ( firstCode != 6 ) {
                debitOptgroups += `<optgroup label="${accountTypes[firstCode-1]}">`;
              }
              creditOptgroups += `<optgroup label="${accountTypes[firstCode-1]}">`;
            }
            //Exclude contra asset & capital accounts
            if ( firstCode != 6 
              && !accountTitle.text.includes('Capital') 
            ) {
              debitOptgroups += `<option value="${accountTitle.id}&Debit">${accountTitle.text}</option>`;
            }
            //Exclude drawing / withdrawal account
            if ( !accountTitle.text.includes('Drawing')
              && !accountTitle.text.includes('Withdrawal')
            ) {
              creditOptgroups +=  `<option value="${accountTitle.id}&Credit">${accountTitle.text}</option>`;
            }
            //Closing tags
            if ( firstCode > prevFirstCode 
              && prevFirstCode != 0 
            ) {
              if ( firstCode != 6 ) {
                debitOptgroups += `</optgroup>`;
              }
              creditOptgroups += `</optgroup>`;
            }
            prevFirstCode = firstCode;
          }
          document.getElementById('debit_account').insertAdjacentHTML('afterbegin', debitOptgroups);
          document.getElementById('credit_account').insertAdjacentHTML('afterbegin', creditOptgroups);
        }),
      );
    }
  }, 100);
};

//Load accounts can be adjusted
const loadAccountsCanBeAdjusted = (selectedItems) => {
  $('#accounts').empty().append('<option></option>');
  for (const accountId in accounts) {
    
    //Filter options
    const dataParts = accountId.split('&');
    const pr = dataParts[1];
    const debitOrCredit = dataParts[2];

    //Filter out unadjustable accounts
    if ( 
      ( debitOrCredit == 'Debit' && ( (pr > 1000 && pr < 2000) || (pr > 5000 && pr < 6000) ) ) 
    || ( debitOrCredit == 'Credit' && ( (pr > 2000 && pr < 3000) || (pr > 4000 && pr < 5000) ) )
    ) {
      $('#accounts').append(
        `<option value="${accountId}"><span>${
          document.getElementById(accountId).textContent
        }</span> <span>(${
          debitOrCredit
        })</span></option>`
      );
    }
  }
  if ( selectedItems != undefined ) setTimeout(() => $('#accounts').val(selectedItems).trigger('change'), 100);
};
//Enable is_adjustable & append account
const enableAdjustableAndAppendAccount = (length) => {
  if ( length == 1 ) {
    $('#is_adjustable').prop('disabled', false);
  } else if ( $('#is_adjustable').val() ) {//TOBECHECKED
    const values = $('#accounts').val();
    loadAccountsCanBeAdjusted(values);
  }
};
//Disable is_adjustable & remove account
const disableAdjustableAndRemoveAccount = (length, accountId) => {
  if ( length == 0 ) {
    $('#is_adjustable').prop({'disabled': true, 'checked': false})
      .trigger('change');
  } else if ( $('#is_adjustable').val() ) {//TOBECHECKED
    const values = $('#accounts').val();
    values.splice(values.indexOf(accountId), 1);
    loadAccountsCanBeAdjusted(values);
  }
};

//Setup fields for interest / depreciation
var adjusted_account;
const setupFieldsForInterestOrDepreciation = (method) => {
  //account
  const accountTitle = document.getElementById(adjusted_account).firstElementChild.textContent;
  $('#account').empty().append(`<option value="${adjusted_account}">${
    accountTitle
  } (${adjusted_account.split('&')[2]})</option>`).prop('disabled',true);

  //Get current balance, monthly & total amount
  let [currentBalance, monthlyAmount, totalAmount] = document.getElementById(adjusted_account).lastElementChild.value.split('|');
  //balance
  const balanceInput = document.getElementById('balance');
  if ( method == 'Depreciation' ) {
    balanceInput.closest('div.input-group').previousElementSibling.textContent = 'Current Depreciation';
  } else {
    balanceInput.closest('div.input-group').previousElementSibling.textContent = 'Current Interest';
  }
  if ( accessType < -1 ) {
    currentBalance = (parseFloat(currentBalance) - parseFloat(monthlyAmount)).toLocaleString('en', {'maximumFractionDigits': 2, 'useGrouping': false});
  }
  balanceInput.value = currentBalance;
  
  //method
  document.getElementById('method').value = method;

  //Hide source document
  elements.iframePlaceholder.closest('div.form-group').style.display = 'none';
  elements.source_document_filename.closest('div.form-group').style.display = 'none';

  //Disable date
  //elements.date.setAttribute('disabled', true);

  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);

      let adjustingEntryAccountTitle;

      //Get interest expense for interest
      //Or get dep. expense for depreciation
      adjustingEntryAccountTitle = 
        method == 'Depreciation'
        ? `Dep. Exp.\u2013${accountTitle}`
        : 'Interest Expense';
      const debitAccount = $(`#debit_account option:contains(${adjustingEntryAccountTitle})`)?.val();
      if ( debitAccount != undefined ) {
        addAccount(
          debitAccount,
          adjustingEntryAccountTitle,
          debitAccount.split('&')[1],
          true,
          monthlyAmount
        );
      }
      
      //Get interest payable for interest
      //Or get accumulated dep. for depreciation
      adjustingEntryAccountTitle = 
        method == 'Depreciation'
        ? `Acc. Dep. \u2013 ${accountTitle}`
        : 'Interest Payable';
      const creditAccount = $(`#credit_account option:contains(${adjustingEntryAccountTitle})`)?.val();
      if ( creditAccount != undefined ) {
        addAccount(
          creditAccount,
          adjustingEntryAccountTitle,
          creditAccount.split('&')[1],
          false,
          monthlyAmount
        );
      }
      
      if ( debitAccount != undefined && creditAccount != undefined ) {
        //Disable debit & credit account inputs
        const debitAccountInput = document.getElementById(`input-debit-${debitAccount}`);
        const creditAccountInput = document.getElementById(`input-credit-${creditAccount}`);
        debitAccountInput.setAttribute('disabled', true);
        creditAccountInput.setAttribute('disabled', true);

        //Hide dropdown menu buttons
        debitAccountInput.closest('tr').lastElementChild.firstElementChild.style.display = 'none';
        creditAccountInput.closest('tr').lastElementChild.firstElementChild.style.display = 'none';
      }
    }
  }, 100);
};
//Setup fields for asset / liability
const setupFieldsForAssetOrLiability = (method, adjusted_balance) => {
  //account
  $('#account').empty().append(
    `<option value="${adjusted_account}">${
      document.getElementById(adjusted_account).firstElementChild.textContent
    } (${adjusted_account.split('&')[2]})</option>`
  ).prop('disabled', true);
 
  //balance
  let balance = parseFloat(document.getElementById(adjusted_account).lastElementChild.value);
  balance = (balance + adjusted_balance).toLocaleString('en', {'maximumFractionDigits': 2, 'useGrouping': false});
  document.getElementById('balance').value = balance;
  
  //method
  document.getElementById('method').value = method;
};
//Append accounts
const appendAccounts = () => {
  $('#account').empty().append('<option></option>');
  for (const item of accountToAdjust) {
    $('#account').append(
      `<option value="${item}">${
        document.getElementById(item).firstElementChild.textContent
      } (${item.split('&')[2]})</option>`
    );
  }
};





//------------------------- CALLBACK FOR -------------------------
//------------------------- CREATION, UPDATE & DELETE -------------------------
const forNotEditOrViewCallback = (responseData) => {
  const detail = responseData.detail;
  if ( /(journalized|adjusted|updated)/gi.test(detail) ) {
    loadTable({
      status: (
        elements.status.checked
        ? 'Posted'
        : elements.status.value != 'Inactive'
          ? 'Journalized'
          : 'Inactive'
      )
    });
    $('#form_modal').modal('hide');
  } else {
    loadTable({});
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



//------------------------- LOAD ACCOUNTS VIEW TABLE FOR journal, adjusting & originating entry -------------------------
const loadAccountsViewTable = (nthTable, accounts, input) => {
  totalDebitAmount = totalCreditAmount = 0;
  const appliedDepreciationData = new Set();
  const appliedInterestData = new Set();
  let accountsViewTable = 
    `<hr />
    <div class="text-info mt-3 mb-2"><strong>Accounts</strong></div>
    <div class="row">
      ${input}
      <div class="col-auto table-responsive">
        <table id="table-${nthTable}" class="table table-bordered nowrap">
          <thead>
            <tr>
              <th>Account Title</th>
              <th>Type</th>
              <th>P.R.</th>
              <th class="text-right">Debit</th>
              <th class="text-right">Credit</th>
            </tr>
          </thead>
          <tbody>`;
  accounts.forEach((account) => {
    let monthlyAmount, totalAmount;

    //Check if theres any depreciation applied
    const hasAppliedDepreciation = (
      account.salvage_value > 0 &&
      account.useful_life > 0
    );
    //Then collect all accounts with depreciation applied
    if ( hasAppliedDepreciation ) {
      appliedDepreciationData.add(account);
      //Get monthly & total amount
      monthlyAmount = parseFloat(
        ((account.debit - account.salvage_value) / account.useful_life)
          .toLocaleString('en', {'maximumFractionDigits': 2, 'useGrouping': false})
      );
      totalAmount = parseFloat(
        (account.debit - account.salvage_value)
          .toLocaleString('en', {'maximumFractionDigits': 2, 'useGrouping': false})
      );
    }
    
    //Check if theres any interest applied
    const hasAppliedInterest = (
      account.rate > 0 &&
      account.month_no > 0
    );
    //Then collect all accounts with interest applied
    if ( hasAppliedInterest ) {
      appliedInterestData.add(account);
      //Get monthly & total amount
      monthlyAmount = parseFloat(
        (account.credit * (account.rate/100) * (1/12))
          .toLocaleString('en', {'maximumFractionDigits': 2, 'useGrouping': false})
      );
      totalAmount = parseFloat(
        (account.credit * (account.rate/100) * (account.month_no/12))
          .toLocaleString('en', {'maximumFractionDigits': 2, 'useGrouping': false})
      );
    }
    
    //Make temporary & specialized id for each account
    const id = `${account.id}&${account.pr}&${account.debit>0?'Debit':'Credit'}&${
      ( hasAppliedDepreciation
        ? 'Depreciation'
        : (account.is_interest_adjustable || accessType == -3)
          ? 'PRT'
          : (
              /^(Asset|Expense)$/.test(account.ja_account_title.ca_account_type.name)
              ? 'Asset'
              : 'Liability'
            )
      )
    }`;
    
    //Collect all adjustable accounts
    if ( account.is_adjustable && accessType < 0 ) accountToAdjust.add(id);
    accountsViewTable +=
      `<tr>
        <td>
          <div id="${id}">
            <span>${
              //account_title
              account.ja_account_title.account_title
            }</span>
            ${
              hasAppliedDepreciation
              ? `<input type="hidden" class="acct_depreciation" value="${
                  account.balance}|${monthlyAmount}|${totalAmount}" />`
              : (account.is_interest_adjustable || accessType == -3)
                ? `<input type="hidden" class="acct_interest" value="${
                    account.interest}|${monthlyAmount}|${totalAmount}" />`
                : `<input type="hidden" class="acct_balance" value="${account.balance}" />`
            }
          </div>
        </td>
        <td>${
          //account_type
          account.ja_account_title.ca_account_type.name
        }</td>
        <td>${
          //pr
          account.pr
        }</td>
        <td>${
          //debit
          (account.debit == 0 ? '': formatAmount(account.debit))
        }</td>
        <td>${
          //credit
          (account.credit == 0 ? '': formatAmount(account.credit))
        }</td>
      </tr>`;
    totalDebitAmount += account.debit;
    totalCreditAmount += account.credit;
  });
  accountsViewTable += 
          `</tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right text-muted small">Total:</td>
              <td class="text-right">
                <div>
                  <strong>${formatAmount(totalDebitAmount)}</strong>
                  <hr class="my-0" />
                  <hr class="mt-1 mb-0" />
                </div>
              </td>
              <td class="text-right">
                <div>
                  <strong>${formatAmount(totalCreditAmount)}</strong>
                  <hr class="my-0" />
                  <hr class="mt-1 mb-0" />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <!-- /col -->
    </div>
    <!-- /row -->`;
  totalDebitAmount = totalCreditAmount = 0;
  if ( appliedDepreciationData.size > 0 ) accountsViewTable += loadAppliedDepreciationOrInterestViewTable(true, [...appliedDepreciationData]);
  if ( appliedInterestData.size > 0 ) accountsViewTable += loadAppliedDepreciationOrInterestViewTable(false, [...appliedInterestData]);
  return accountsViewTable;
};

//------------------------- LOAD APPLIED DEPRECIATION / INTEREST VIEW TABLE FOR journal, adjusting & originating entry -------------------------
const loadAppliedDepreciationOrInterestViewTable = (isDepreciation, accounts) => {
  let appliedDepreciationOrInterestViewTable = 
    `<hr />
    <div class="text-info mt-3 mb-2"><strong>${(isDepreciation ? 'Depreciation' : 'Interest')} Applied</strong></div>
    <div class="row">
      <div class="col-auto table-responsive">
        <table id="applied-${(isDepreciation ? 'depreciation' : 'interest')}-table" class="table table-bordered nowrap">
          <thead>
            <tr>
              <th>Account Title</th>
              <th class="text-right">${(isDepreciation ? 'Salvage Value' : 'Rate')}</th>
              <th class="text-right">${(isDepreciation ? 'Useful Life (No. of Month)' : 'No. of Month')}</th>
            </tr>
          </thead>
          <tbody>`;
  accounts.forEach((account) => {
    appliedDepreciationOrInterestViewTable += 
      `<tr>
        <td>${account.ja_account_title.account_title}</td>
        <td>${(isDepreciation ? account.salvage_value : (account.rate.toString() + '%'))}</td>
        <td>${(isDepreciation ? account.useful_life : account.month_no)}</td>
      </tr>`;
  });
  appliedDepreciationOrInterestViewTable +=
          `</tbody>
        </table>
      </div>
      <!-- /col -->
    </div>
    <!-- /row -->`;
  return appliedDepreciationOrInterestViewTable;
};

//------------------------- CALLBACK FOR VIEWING/EDITING DATA -------------------------
const forEditOrViewCallback = (responseData) => {console.log(responseData)
  let entry;
  //For viewing adjusting entry w/ originating entry
  if ( accessType == 1 
    && responseData.je_originating_entry != undefined 
  ) { 
    entry = responseData.je_originating_entry;
    delete responseData.je_originating_entry;
    accessType = 3;
  //For all entry types
  } else {
    entry = responseData;
    if ( accessType == 1 && entry.entry_type == 'Adjusting' ) accessType = 2;
    else if ( accessType == 0 && entry.je_originating_entry != undefined ) accessType = -2;
  }
  
  //For viewing
  if ( accessType > 0 ) {
    const viewModal = `
      <div class="modal fade" id="view_modal">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title"><i class="fas fa-book mr-3 text-secondary"></i>${accessType == 1 ? 'Journal Entry':'Adjusting Entry'}</h4>
              <button type="button" class="btn btn-sm btn-default" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true"><i class="fas fa-times"></i></span>
              </button>
            </div>
            <div class="modal-body pb-0">
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
      $('#view_modal').on('show.bs.modal', function () {
        displayEntry(entry, 1);
        if ( accessType == 3 ) {
          accessType = 2;
          displayEntry(responseData, 2);
        } 
      });
      $('#view_modal').on('hidden.bs.modal', function () { this.remove(); });
      $('#view_modal').modal({
        'backdrop': 'static',
        'keyboard': true,
        'focus': true,
        'show': true
      });
  //For editing
  } else {
    $('#form_modal').modal({
      'backdrop': 'static',
      'keyboard': true,
      'focus': true,
      'show': true
    });
    loadAccountTitles();
    //For adjusting entry w/ originating entry
    if ( accessType < 0 ) {
      $('#entry_type').val('Adjusting').trigger('change').prop('disabled', true);
      accountToAdjust = new Set();
      //For creating adjusting entry w/ originating entry
      if ( accessType == -1 ) {
        //Display originating entry
        displayEntry(entry, 1);
        //Check if theres any interest applied then setup fields
        adjusted_account = document.querySelector('input.acct_interest')?.parentElement.id;
        if ( adjusted_account != undefined ) {
          setupFieldsForInterestOrDepreciation('P * R * T');
        } else {
          //Check if theres any depreciation applied then setup fields
          adjusted_account = document.querySelector('input.acct_depreciation')?.parentElement.id;
          if ( adjusted_account != undefined ) {
            setupFieldsForInterestOrDepreciation('Depreciation');
          //Append accounts
          } else {
            appendAccounts();
          }
        }
      //For editing adjusting entry w/ originating entry
      } else {
        //Display originating entry
        displayEntry(entry.je_originating_entry, 1);
        //Check if theres any interest applied then setup fields
        adjusted_account = document.querySelector('input.acct_interest')?.parentElement.id;
        if ( adjusted_account != undefined ) {
          setupFieldsForInterestOrDepreciation('P * R * T');
        } else {
          //Check if theres any depreciation applied then setup fields
          adjusted_account = document.querySelector('input.acct_depreciation')?.parentElement.id;
          if ( adjusted_account != undefined ) {
            setupFieldsForInterestOrDepreciation('Depreciation');
          //Setup fields for asset | liability
          } else {
            const method = 
              /^(Asset|Expense)$/.test(entry.adjusted_account.ja_account_title.ca_account_type.name)
              ? 'Asset'
              : 'Liability';
            adjusted_account = `${entry.adjusted_account.id}&${entry.adjusted_account.pr}&${(
              entry.adjusted_account.debit > 0 ? 'Debit' : 'Credit'
            )}&${method}`;
            setupFieldsForAssetOrLiability(method, entry.adjusted_balance);
          }
        }
        distributeData(entry);
      }
    //For editing initial, adjusting entry w/o originating entry
    } else {
      distributeData(entry);
    }
  }
};

//Display entry
const displayEntry = (entry, nthTable) => {
  const displayedEntry = `
  <div id="displayedEntry">
  <div class="row">
  <div class="col">
    <div class="alert alert-dismissible border p-0">
      <div class="card-header">
        <h3 class="card-title">
          <i class="icon fas fa-info-circle text-info"></i>
          Details about 
          ${ 
            accessType == 1
            ? 'journal entry'
            : (
              accessType == 2
              ? 'adjusting entry'
              : 'originating entry'
            )
          }
        </h3>
      </div>
      <!-- /card-header -->
      <div class="card-body pb-0">
        ${(//source_document_path
          entry.source_document_path != undefined
          ? `<div class="form-group row">
              <div class="col d-flex justify-content-center align-items-center img-thumbnail">
                <iframe 
                  src="${baseUrl}${entry.source_document_path}"
                  class="w-100 h-100"
                  frameborder="0"
                  title="Source Document"
                  allowfullscreen="true"
                  scrolling="auto"
                ></iframe>
              </div>
            </div>`
          : ``
        )}
        <dl class="row">
          ${(//Source document filename
            entry.source_document_path != undefined
            ? `<dt class="col-sm-3">Source Document:</dt>
              <dd class="col-sm-9">${entry.source_document_path.slice(entry.source_document_path.lastIndexOf("\/")+1)}</dd>`
            : ``
          )}
          <dt class="col-sm-2">Entry Type:</dt>
          <dd class="col-sm-10">${
            //entry_type
            entry.entry_type
          }</dd>
          <dt class="col-sm-2">Date:</dt>
          <dd class="col-sm-10">${
            //date
            entry.date
          }</dd>
          ${
            //is_adjustable
            entry.entry_type === 'Initial'
            ? `<dt class="col-sm-2">Adjustable:</dt>
              <dd class="col-sm-10">${
                entry.is_adjustable
                ? 'Yes'
                : 'No'
              }</dd>`
            : ``
          }
          <dt class="col-sm-2">Status:</dt>
          <dd class="col-sm-10">${
            //status
            entry.status
          }</dd>
          <div class="col-12">
            <div class="row">
              <dt class="col-sm-2">Journal. At:</dt>
              <dd class="col-sm-4">${
                //journalized_at
                formatDate(entry.journalized_at)
              }</dd>
              <dt class="col-sm-2">Journal. By:</dt>
              <dd class="col-sm-4">${
                //journalized_by
                formatName(entry.je_journalized_by.employee)
              }</dd>
            </div>
          </div>
          ${ //POSTED
            entry.je_posted_by != undefined
            ? `<div class="col-12">
                <div class="row">
                  <dt class="col-sm-2">Posted At:</dt>
                  <dd class="col-sm-4">${
                    //posted_at
                    formatDate(entry.posted_at)
                  }</dd>
                  <dt class="col-sm-2">Posted By:</dt>
                  <dd class="col-sm-4">${
                    //posted_by
                    formatName(entry.je_posted_by.employee)
                  }</dd>
                </div>
              </div>`
            : ``
          }
          ${ //UPDATED
            entry.je_updated_by != undefined
            ? `<div class="col-12">
                <div class="row">
                  <dt class="col-sm-2">Updated At:</dt>
                  <dd class="col-sm-4">${
                    //updated_at
                    formatDate(entry.updated_at)
                  }</dd>
                  <dt class="col-sm-2">Updated By:</dt>
                  <dd class="col-sm-4">${
                    //updated_by
                    formatName(entry.je_updated_by.employee)
                  }</dd>
                </div>
              </div>`
            : ``
          }
          ${ //explanation
            entry.explanation != ""
            ? `<dt class="col-sm-2">Explanation:</dt>
              <dd class="col-sm-10">${entry.explanation}</dd>`
            : ``
          }
        </dl>
        ${
          //Load accounts view table
          loadAccountsViewTable(
            nthTable, 
            entry.je_journal_accounts,
            ( //For adjusting entry w/ originating entry
              accessType < 0
              ? `<input type="hidden" class="originating-entry" id="${entry.id}" />` 
              : ``
            )
          )
        }
      </div>
      <!-- /card-body -->
    </div>
  </div>
  </div>
  ${//For adjusting entry w/ originating entry
    accessType < 0
    ? `<hr />
      <div class="text-info text-center my-4" id="adjusting-entry"><strong>Adjusting Entry</strong></div>
      <div class="form-group row justify-content-end">
        <div class="col-md-6">
          <label for="balance">Current Balance</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">&#8369;</span>
            </div>
            <input type="text" class="form-control" id="balance" disabled />
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <label for="account">Account<span> *</span></label>
          <select class="form-control" id="account" autocomplete="off" style="width: 100%;">
            <option></option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="method">Method</label>
          <input type="text" class="form-control" id="method" disabled />
        </div>
      </div>`
    : ``
  }</div>`;

  //For adjusting entry w/ originating entry
  if ( accessType < 0 ) {
    form.insertAdjacentHTML('beforebegin', displayedEntry);
    setupAccountSelect();
    //For creating
    if ( accessType == -1 ) {
      elements.submitButton.firstElementChild.textContent = 'Adjust';
    }
  //For viewing
  } else {
    document.querySelector('#view_modal .modal-body').insertAdjacentHTML('beforeend', displayedEntry);
  }
};

//Setup account select
const setupAccountSelect = () => {
  $('#account').select2({
    'dropdownParent': $('#form_modal'),
    'placeholder': 'Select account to adjust',
    'language': {'noResults': () => 'No available accounts',},
  })
  .on('select2:open', function () {
    setTimeout(() => document.querySelector('input[aria-activedescendant*="account"]')?.focus(), 100);
  })
  .on('select2:select', function () {
    //Remove error message?
    document.getElementById('errorMessage')?.remove();

    //adjusted_account
    adjusted_account = this.value;
    
    //balance
    document.getElementById('balance').value = document.getElementById(adjusted_account).lastElementChild.value;

    //method
    document.getElementById('method').value = adjusted_account.split('&')[3];

    //Clear form table
    if ( formTable ) {
      $('#debit_account').prop('disabled', false);
      $('#credit_account').prop('disabled', false);
      clearError();
      formTable.clear().draw();
      accounts = {};
      totalDebitAmount = totalCreditAmount = 0;
    }
  });
};

//Distribute data
var saved_filename;
const distributeData = (data) => {
  //entry_type
  if ( accessType == 0 ) $('#entry_type').val(data.entry_type).trigger('change');
  //id
  elements.uuid.value = data.id;
  //source_document_path
  if ( data.source_document_path != undefined ) {
    elements.imgPlaceholder.classList.add('d-none');
    elements.iframePlaceholder.classList.remove('d-none');
    elements.iframePlaceholder.src = `${baseUrl}${data.source_document_path}`;
    saved_filename = data.source_document_path.substring(data.source_document_path.lastIndexOf("\/") + 1).toLowerCase();
    elements.source_document_filename.value = saved_filename;
    document.getElementById('source_document_file_cancel').classList.remove('d-none');
  }
  //date
  elements.date.value = data.date;
  //explanation
  elements.explanation.value = data.explanation;
  //status
  elements.status.value = data.status;
  elements.status.checked = (data.status === 'Posted' ? true:false);
  //Traverse each journal account
  const adjustableAccounts = [];
  for (const account of data.je_journal_accounts) {
    const isDebit = (account.debit > 0 ? true : false);
    const accountId = account.ja_account_title.id + '&' + account.pr + '&' + (isDebit ? 'Debit' : 'Credit');
    //Add account
    addAccount(
      accountId,
      account.ja_account_title.account_title,
      account.pr, 
      isDebit, 
      (isDebit?account.debit:account.credit)
    );
    if ( entryType == 'Initial' ) {
      //Collect all adjustable accounts
      if ( account.is_adjustable ) adjustableAccounts.push(accountId);
      //Apply depreciation
      if ( account.salvage_value > 0
        && account.useful_life > 0 
      ) {
        applyDepreciationOrInterest('depreciation', accountId);
        document.getElementById(`salvage_value-${accountId}`).value = account.salvage_value;
        document.getElementById(`useful_life-${accountId}`).value = account.useful_life;
      }
      //Apply interest
      else if ( account.rate > 0
        && account.month_no > 0   
      ) {
        applyDepreciationOrInterest('interest', accountId);
        document.getElementById(`rate-${accountId}`).value = account.rate;
        document.getElementById(`month_no-${accountId}`).value = account.month_no;
      }
    }
  }
  if ( entryType == 'Initial' ) {
    //is_adjustable
    $('#is_adjustable').prop('disabled', false);
    if ( adjustableAccounts.length ) {
      $('#is_adjustable').prop('checked',true).trigger('change');
      //Select all adjustable accounts
      setTimeout(() => $('#accounts').val(adjustableAccounts).trigger('change') , 100);
    } else {
      $('#is_adjustable').prop('checked',false).trigger('change');
    }
  }
  
  //Additional details
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
              <div class="col-12">
                <div class="row">
                  <dt class="col-sm-2">Journal. At:</dt>
                  <dd class="col-sm-4">${
                    //journalized_at
                    formatDate(data.journalized_at)
                  }<input type="hidden" id="journalized_at" value="${data.journalized_at}" /></dd>
                  <dt class="col-sm-2">Journal. By:</dt>
                  <dd class="col-sm-4">${
                    //journalized_by
                    formatName(data.je_journalized_by.employee)
                  }<input type="hidden" id="journalized_by" value="${data.je_journalized_by.id}" /></dd>
                </div>
              </div>
              ${ //POSTED
                data.je_posted_by != undefined
                ? `<div class="col-12">
                    <div class="row">
                      <dt class="col-sm-2">Posted At:</dt>
                      <dd class="col-sm-4">${
                        //posted_at
                        formatDate(data.posted_at)
                      }<input type="hidden" id="posted_at" value="${data.posted_at}" /></dd>
                      <dt class="col-sm-2">Posted By:</dt>
                      <dd class="col-sm-4">${
                        //posted_by
                        formatName(data.je_posted_by.employee)
                      }<input type="hidden" id="posted_by" value="${data.je_posted_by.id}" /></dd>
                    </div>  
                  </div>`
                : ``
              }
              ${ //UPDATED
                data.je_updated_by != undefined
                ? `<div class="col-12">
                    <div class="row">
                      <dt class="col-sm-2">Updated At:</dt>
                      <dd class="col-sm-4">${
                        //updated_at
                        formatDate(data.updated_at)
                      }</dd>
                      <dt class="col-sm-2">Updated By:</dt>
                      <dd class="col-sm-4">${
                        //updated_by
                        formatName(data.je_updated_by.employee)
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
};







//------------------------- FORM TABLE FOR JOURNAL ENTRY -------------------------
var formTable, 
  accounts, totalDebitAmount, totalCreditAmount;
//Load form table
const loadFormTable = () => {
  accounts = {}, totalDebitAmount = totalCreditAmount = 0;
  if ( formTable ) formTable.destroy();
  formTable = $('#form_table').DataTable({
    //"scrollY": "40px", 
    //"scrollX": true,
    "searching": false,
    "order": [],
    "info": false,
    "paging": false,
    "language": {
      "emptyTable": "Please enter debit and the corresponding credit accounts."
    },
    "autoWidth": false,
    "columns": [
      //account_title
      { 
        'name': 'account_title',
        'orderable': false, 
        "width": "30%",
      },
      //pr
      { 
        'name': 'pr',
        'orderable': false, 
        "width": "10%",
      },
      //debit 
      { 
        'name': 'debit',
        'orderable': false, 
        "width": "25%",
      },
      //credit
      { 
        'name': 'credit',
        'orderable': false, 
        "width": "25%",
      },
      //action
      { 
        'name': 'action',
        'orderable': false, 
        "width": "10%",
        "class": 'text-center',
      },
    ],
  });
};
//Add account
const addAccount = (accountId, accountTitle, pr, isDebit, value='') => {
  if ( accounts.hasOwnProperty(accountId) ) return;

  //Disable debit|credit account select
  //if entry type is adjusting 
  //and at least one debit|credit account added
  if ( entryType == 'Adjusting' ) {
    if ( isDebit && totalDebitAmount == 0 ) $('#debit_account').prop('disabled', true);
    else if ( !isDebit && totalCreditAmount == 0 ) $('#credit_account').prop('disabled', true);
  }
  
  accounts[accountId] = { isBlank: true };

  const row = formTable.row.add([
    //account_title
    `<div id="${accountId}">${accountTitle}</div>`,
    //pr
    pr,
    //debit
    (isDebit) ? `<input 
      type="text" 
      class="form-control form-control-sm" 
      id="input-debit-${accountId}" 
      name="input-debit-${accountId}"
      value="${value}"
      onfocus="setPrevAmount(this.value)" 
      oninput="computeTotalDebitOrCredit(this, ${isDebit}, '${accountId}');"
      autocomplete="off" />` : null,
    //credit
    (!isDebit) ? `<input 
      type="text" 
      class="form-control form-control-sm" 
      id="input-credit-${accountId}" 
      name="input-credit-${accountId}"
      value="${value}"
      onfocus="setPrevAmount(this.value)" 
      oninput="computeTotalDebitOrCredit(this, ${isDebit}, '${accountId}');"
      autocomplete="off" />` : null,
    //action
    `<div class="text-center dropdown">
      <a class="btn btn-sm btn-default" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-v"></i>
      </a>
      <div class="dropdown-menu dropdown-menu-right p-0" aria-labelledby="dropdownMenuLink2">
        ${
          entryType == 'Initial'
          ? `<a class="dropdown-item ${(!isDebit && !accountTitle.toLowerCase().includes('revenue') && pr >= 2001 && pr <= 2999) ? '':'disabled'}" 
              onclick="applyDepreciationOrInterest('interest', '${accountId}');">
              <i class="fas fa-plus mr-1" style="width: 2rem;"></i><span>Apply Interest</span>
            </a>
            <a class="dropdown-item ${(isDebit && pr >= 1001 && pr <= 1999) ? '':'disabled'}" 
              onclick="applyDepreciationOrInterest('depreciation', '${accountId}');">
              <i class="fas fa-plus mr-1" style="width: 2rem;"></i><span>Apply Depreciation</span>
            </a>
            <div class="dropdown-divider m-0"></div>`
          : ``
        }
        <a class="dropdown-item " onclick="removeAccount(this.closest('td'), ${isDebit}, '${accountId}');"><i class="fas fa-trash-alt mr-1" style="width: 2rem;"></i><span>Remove Account</span></a>
      </div>
    </div>` 
  ]).draw(false);
  const input = $($(row.node()).children()[(isDebit?2:3)]).children()[0];
  //For edit
  if ( value != "" ) {
    prevAmount = 0;
    notParsedPrevAmount = '0';
    computeTotalDebitOrCredit(
      input,
      isDebit,
      accountId
    );
  } else {
    input.focus();
    document.getElementById('errorMessage')?.remove();
  }
  //Enable is_adjustable & append account
  if ( entryType == 'Initial' ) {
    enableAdjustableAndAppendAccount(Object.keys(accounts).length);
  }
};
//Remove account
const removeAccount = (action, isDebit, accountId) => {
  const row = action.parentElement;
  if ( isDebit ) {
    const debit = row.children[2].firstElementChild.value;
    totalDebitAmount -= isNaN(parseFloat(debit)) ? 0 : parseFloat(debit);
  } else {
    const credit = row.children[3].firstElementChild.value;
    totalCreditAmount -= isNaN(parseFloat(credit)) ? 0 : parseFloat(credit);
  } 
  formTable.row(row).remove().draw();
  delete accounts[accountId];
  const debitOrCredit = accountId.split('&')[2];
  if ( hasNoBlank(debitOrCredit) ) clearError(debitOrCredit.toLowerCase());
  //Disable is_adjustable & remove account
  if ( entryType == 'Initial' ) {
    disableAdjustableAndRemoveAccount(Object.keys(accounts).length, accountId);
    removeDepreciationOrInterest(`applied&${(isDebit?'depreciation':'interest')}`, accountId);
  }

  //Enable debit|credit account select
  //if entry type is adjusting
  //and no debit|credit account
  if ( entryType == 'Adjusting' ) {
    if ( isDebit && totalDebitAmount == 0 ) $('#debit_account').prop('disabled', false);
    else if ( !isDebit && totalCreditAmount == 0 ) $('#credit_account').prop('disabled', false);
  }
};
//Set previous amount
var prevAmount, notParsedPrevAmount;
const setPrevAmount = (amount) => {
  if ( isNaN(parseFloat(amount)) ) {
    prevAmount = 0;
    notParsedPrevAmount = '0';
  } else {
    prevAmount = parseFloat(amount);
    notParsedPrevAmount = amount;
  }
};
//Compute total debit/credit
const computeTotalDebitOrCredit = (accountInput, isDebit, accountId) => {
  let amount = accountInput.value;
  if ( (/^([1-9]{1,1}\d{0,12}|0)(\.(\d{0,2}))?$/.test(amount)) ) {
    notParsedPrevAmount = amount;
    amount = parseFloat(amount);
    if ( amount > prevAmount ) {
      if ( isDebit ) totalDebitAmount += amount - prevAmount;
      else totalCreditAmount += amount - prevAmount;
    } else if ( amount < prevAmount ) {
      if ( isDebit ) totalDebitAmount -= prevAmount - amount;
      else totalCreditAmount -= prevAmount - amount; 
    }
    prevAmount = amount;
    accounts[accountId].isBlank = false;
    const debitOrCredit = accountId.split('&')[2];
    if ( hasNoBlank(debitOrCredit) ) clearError(debitOrCredit.toLowerCase());
  } else if ( amount != "" ) {
    accountInput.value = (notParsedPrevAmount == '0' ? "" : notParsedPrevAmount);
  } else {
    if ( isDebit ) totalDebitAmount -= prevAmount;
    else totalCreditAmount -= prevAmount;
    prevAmount = 0;
    notParsedPrevAmount = '0';
    accounts[accountId].isBlank = true;
  }
};
//Check if no blank fields
const hasNoBlank = (debitOrCredit) => {
  let noBlank = true;
  for (const accountId in accounts) { 
    if ( accounts[accountId].isBlank 
      && (
        debitOrCredit != undefined
        ? (debitOrCredit == accountId.split('&')[2])
        : true )
    ) { 
      noBlank = false; 
      break; 
    } 
  }
  return noBlank;
};





//------------------------- APPLY DEPRECIATION / INTEREST -------------------------
var appliedDepreciationContainer, appliedInterestContainer;
//Apply depreciation / interest
const applyDepreciationOrInterest = (toBeApplied, accountId) => {
  //Exit if already applied
  if ( document.getElementById(`applied&${toBeApplied}&${accountId}`) != null ) return;
  
  //Update selected accounts
  const values = $('#accounts').val();
  values.push(accountId);
  $('#is_adjustable').prop('checked',true).trigger('change');
  $('#accounts').val(values).trigger('change');
  
  //Is depreciation ?
  const isDepreciation = toBeApplied == 'depreciation';

  if ( document.querySelector(`.applied-${toBeApplied}`) == null ) {
    if ( isDepreciation ) {
      document.getElementById('adjustableRow').insertAdjacentHTML(
        'afterend',
        `<div class="applied-depreciation">
          <hr />
          <div class="text-info text-center mt-3 mb-2"><strong>Depreciation</strong></div>
          <div class="form-group row mx-0 py-2 border">
            <div class="col"></div>
          </div>
        </div>`
      );
      appliedDepreciationContainer = document.querySelector('div.applied-depreciation > div.form-group > div');
    } else {
      document.getElementById('explanation').closest('div.form-group').insertAdjacentHTML(
        'beforebegin',
        `<div class="applied-interest">
          <hr />
          <div class="text-info text-center mt-3 mb-2"><strong>Interest</strong></div>
          <div class="form-group row mx-0 py-2 border">
            <div class="col"></div>
          </div>
        </div>`
      )
      appliedInterestContainer = document.querySelector('div.applied-interest > div.form-group > div');
    }
    prevValues[toBeApplied] = ['0','0'];
  } else {
    prevValues[toBeApplied].push('0','0');
  }

  const container = (isDepreciation ? appliedDepreciationContainer : appliedInterestContainer);
  container.insertAdjacentHTML(
      'beforeend',
      `<div id="applied&${toBeApplied}&${accountId}">
        <div class="row mb-2">
          <div class="col-6">
            <div class="row">
              <div class="col-auto">Apply to: </div>
              <div class="col text-left"><strong>${
                document.getElementById(accountId).textContent
              }</strong></div>
            </div>
          </div>
          <div class="col-6 text-right">
            <button 
              type="button" 
              class="btn m-n2" 
              onclick="removeDepreciationOrInterest('applied&${toBeApplied}', '${accountId}');" 
              form="form"
            >
              <span aria-hidden="true"><i class="fas fa-times-circle"></i></span>
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label for="${isDepreciation?'salvage_value':'rate'}-${accountId}">${isDepreciation?'Salvage Value':'Rate'}</label>
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                id="${isDepreciation?'salvage_value':'rate'}-${accountId}"
                name="${isDepreciation?'salvage_value':'rate'}-${accountId}" 
                autocomplete="off" 
                value="0"
                onfocus="emptyField(this);"
                onblur="fillField(this);"
                oninput="validateField(this, '${toBeApplied}', ${
                  ( isDepreciation
                    ? /^[1-9]{1,1}\d{0,12}(\.(\d{0,2}))?$/
                    : /^[1-9]{1,1}[0-9]{0,1}$/
                  )
                }, ${prevValues[toBeApplied].length-2});" 
              />
              <div class="input-group-append">
                <span class="input-group-text">${isDepreciation?'&#x20B1;':'&percnt;'}</span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <label for="${isDepreciation?'useful_life':'month_no'}-${accountId}">${isDepreciation?'Useful Life (No. of Month)':'No. of Month'}</label>
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                id="${isDepreciation?'useful_life':'month_no'}-${accountId}" 
                name="${isDepreciation?'useful_life':'month_no'}-${accountId}"
                autocomplete="off" 
                value="0"
                onfocus="emptyField(this);"
                onblur="fillField(this);"
                oninput="validateField(this, '${toBeApplied}', /^[1-9]{1,1}[0-9]{0,3}$/, ${prevValues[toBeApplied].length-1});" 
              />
              <div class="input-group-append">
                <span class="input-group-text"><i class="far fa-clock"></i></span>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>`
    );
  toggleScrollableAndHrs(toBeApplied);
};
//Toggle scrollable & hrs
const toggleScrollableAndHrs = (toBeApplied) => {
  const hrs = document.querySelectorAll(`div.applied-${toBeApplied} > div.form-group hr`);
  const length = hrs.length;
  if ( length == 1 ) {
    if ( toBeApplied == 'depreciation' ) appliedDepreciationContainer.parentElement.classList.remove('scrollable');
    else appliedInterestContainer.parentElement.classList.remove('scrollable');
    hrs[0].classList.add('d-none');
  } else {
    if ( toBeApplied == 'depreciation' ) appliedDepreciationContainer.parentElement.classList.add('scrollable');
    else appliedInterestContainer.parentElement.classList.add('scrollable');
    hrs.forEach((hr, i) => {
      if ( i+1 != length ) hr.classList.remove('d-none');
      else hr.classList.add('d-none');
    });
  }
};
//Remove depreciation / interest
const removeDepreciationOrInterest = (appliedDepreciationOrInterest, accountId) => { 
  document.getElementById(`${appliedDepreciationOrInterest}&${accountId}`)?.remove();
  //Remove the container
  const toBeApplied = appliedDepreciationOrInterest.split('&')[1];
  if ( toBeApplied == 'depreciation' ) {
    if ( !appliedDepreciationContainer?.childElementCount ) appliedDepreciationContainer?.closest('div.applied-depreciation')?.remove();
    else toggleScrollableAndHrs(toBeApplied);
  } else {
    if ( !appliedInterestContainer?.childElementCount ) appliedInterestContainer?.closest('div.applied-interest')?.remove();
    else toggleScrollableAndHrs(toBeApplied);
  }
  //Remove the selected account
  const values = $('#accounts').val();
  const idx = values.indexOf(accountId);
  if ( idx > -1 ) {
    values.splice(idx, 1);
    $('#accounts').val(values).trigger('change');
  }
};
//Empty field w/ default value
const emptyField = (el) => { return el.value = (el.value === '0' ? '' : el.value); };
//Fill field w/ default value
const fillField = (el) => { return el.value = (el.value === '' ? '0' : el.value); };
//Validate field
var prevValues = {
  'depreciation': [],
  'interest': []
};
const validateField = (el, toBeApplied, pattern, idx) => {
  const value = el.value;
  if ( pattern.test(value) ) prevValues[toBeApplied][idx] = value;
  else if ( value != "" ) el.value = (value.length == 1 ? '' : prevValues[toBeApplied][idx]);
  if ( el.value == '' ) prevValues[toBeApplied][idx] = '0';
};






//Count total accounts
const countTotalAccounts = () => {
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      options['method'] = 'get';
      makeFetch(`../accountant/general_journal/total_entries`, 
        options, 
        ((responseData) => {
          document.getElementById('total_entries').textContent = responseData.total_entries ?? 0;
          document.getElementById('total_journalized').textContent = responseData.total_journalized ?? 0;
          document.getElementById('total_posted').textContent = responseData.total_posted ?? 0;
        })
      );
    }
  }, 100);
};

//View source data
const viewSourceData = (data=JSON.parse(data), isAdded=false) => {
  document.getElementById('source-data-table').closest('div.row').style.display = 'none';
  const sourceData = 
    `<div class="form-group row" id="source-data">
      <div class="col">
        <div class="alert alert-dismissible border p-0">
          <div class="card-header">
            <h3 class="card-title">
              <i class="icon fas fa-info-circle text-info"></i>
              Source Data
            </h3>
          </div>
          <!-- /card-header -->
          <div class="card-body pb-0">
            ${(//source_document
              data.source_document != undefined
              ? `<div class="form-group row">
                  <div class="col d-flex justify-content-center align-items-center img-thumbnail">
                    <iframe 
                      src="${baseUrl}${data.source_document}"
                      class="w-100 h-100"
                      frameborder="0"
                      title="Source Document"
                      allowfullscreen="true"
                      scrolling="auto"
                    ></iframe>
                  </div>
                </div>`
              : ``
            )}
            <dl class="row">
              ${(//Source document filename
                data.source_document != undefined
                ? `<dt class="col-sm-3">Source Document:</dt>
                  <dd class="col-sm-9">${data.source_document.slice(data.source_document.lastIndexOf("\/")+1)}</dd>`
                : ``
              )}
              <dt class="col-sm-2">Date:</dt>
              <dd class="col-sm-10">${
                //date
                data.date
              }</dd>
              <dt class="col-sm-2">Amount:</dt>
              <dd class="col-sm-10">${
                //amount
                formatAmount(data.amount)
              }</dd>
              <dt class="col-sm-2">Description:</dt>
              <dd class="col-sm-10">${
                //description
                data.description
              }</dd>
              <dt class="col-sm-2">Status:</dt>
              <dd class="col-sm-10">${
                //status
                data.status
              }</dd>
            </dl>
            <input id="data_source_id" type="hidden" value="${data.id}" />
            <input id="data_source_date" type="hidden" value="${data.updated_at}" />
            <input id="data_source_status" type="hidden" value="${data.status}" />
            <input id="data_source_status2" type="hidden" value="${data.status2}" />
            <input id="data_source_table_name" type="hidden" value="${data.table_name}" />
            <input id="data_source_entry_type" type="hidden" value="${data.entry_type}" />
            <input id="data_source_is_adjustable" type="hidden" value="${data.is_adjustable}" />
          </div>
          <!-- /card-body -->
            <div class="text-right" style="background-color:rgba(0,0,0,.03);border-top:0 solid rgba(0,0,0,.125);padding:0.5rem 0.75rem;">
              <button 
                type="button" 
                class="btn btn-sm btn-default" 
                onclick="(() => {
                  if ( document.querySelectorAll('#source-data button').length == 1 ) {
                    //$('#data_source').val(null).trigger('change');
                    removeSourceDocument();
                    elements.date.value = currentDate;
                    if ( formTable ) formTable.clear().draw();
                    loadFormTable();
                    elements.explanation.value = '';
                  }
                  document.getElementById('source-data')?.remove();
                  const sourceDataTable = document.getElementById('source-data-table');
                  if ( sourceDataTable != undefined ) {
                    sourceDataTable.closest('div.row').style.display='block';
                  }
                })();" 
                form="form"
              >Cancel</button>
              ${
                isAdded
                ? ``
                : `<button 
                    type="button" 
                    class="btn btn-sm btn-primary ml-2" 
                    onclick="addSourceData(${JSON.stringify(data).replaceAll('\"','\'')});" 
                    form="form"
                  >
                    <span>Add</span><i class="fas fa-plus ml-2"></i>
                  </button>`
              }
            </div>
        </div>
        <hr />
      </div>
    </div>`;
  document.getElementById('data_source').closest('div.form-group').insertAdjacentHTML('afterend', sourceData);
};
//Add source data
const addSourceData = (data, isViewed=true) => {
  if ( !isViewed ) viewSourceData(data, true);
  else document.querySelector('#source-data button:last-of-type').remove();
  //source_document
  if ( data.source_document != undefined ) {
    elements.imgPlaceholder.classList.add('d-none');
    elements.iframePlaceholder.classList.remove('d-none');
    elements.iframePlaceholder.src = `${baseUrl}${data.source_document}`;
    saved_filename = data.source_document.substring(data.source_document.lastIndexOf("\/") + 1).toLowerCase();
    elements.source_document_filename.value = saved_filename;
    document.getElementById('source_document_file_cancel').classList.remove('d-none');
    removeSourceDocumentError();
  }
  //date
  elements.date.value = `${data.date.slice(6)}-${data.date.slice(0,2)}-${data.date.slice(3,5)}`;

  //Reset form table
  if ( formTable ) formTable.clear().draw();
  loadFormTable();

  //debit
  console.log(data.debit_account_title)
  const debitAccount = $(`#debit_account option:contains(${data.debit_account_title})`).val();
  console.log(debitAccount)
  addAccount(
    debitAccount,
    data.debit_account_title,
    debitAccount.split('&')[1],
    true,
    data.amount
  );

  //credit
  const creditAccount = $(`#credit_account option:contains(${data.credit_account_title})`).val();
  console.log(creditAccount)
  addAccount(
    creditAccount,
    data.credit_account_title,
    creditAccount.split('&')[1],
    false,
    data.amount
  );
  
  //explanation
  elements.explanation.value = data.description;
};

//------------------------- SOURCE DOCUMENT -------------------------
//Upload file
var noUploadedFile;
const uploadFile = (inputFileArg) => {
  const inputFile = inputFileArg.files[0];
  const url = inputFileArg.value;
  removeSourceDocument(true);
	
  const filename = url.substring(url.lastIndexOf("\\") + 1).toLowerCase();
	const ext = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
  
  //Display error if empty
  if ( url == "" ) {
    addSourceDocumentError('Source document is required.');
  //Display error if media type is not supported
  } else if ( !/^(jpg|jpeg|pdf)$/i.test(ext) ) {
    addSourceDocumentError('Media type is not supported.');
  //Display error if media size is > 5 mb
  } else if ( inputFile.size > 5000000 ) {
    addSourceDocumentError('Media size is up to 5 MB only.');
  //Upload the file
  } else {
    try {
      const reader = new FileReader();
      reader.onload = function (e) {
        elements.imgPlaceholder.classList.add('d-none');
        elements.iframePlaceholder.classList.remove('d-none');
        elements.iframePlaceholder.src = `${e.target.result}`;
        /* if ( elements.uuid.value == "" ) {
          elements.iframePlaceholder.src = `${e.target.result}`;
        } else {
          elements.iframePlaceholder.src = `${baseUrl}${e.target.result}`;
        } */
        elements.source_document_filename.value = filename;
        document.getElementById('source_document_file_cancel').classList.remove('d-none');
        saved_filename = undefined;
      };
      reader.readAsDataURL(inputFile);
    } catch {}
	}
};
//Add source document error
const addSourceDocumentError = (text) => {
  elements.source_document_filename.parentElement.classList.add('border-is-invalid');
  elements.source_document_filename.parentElement.previousElementSibling.classList.add('text-danger');
  displayError(
    elements.source_document_filename,
    elements.source_document_filenameError,
    text,
    '.col'
  );
};
//Remove source document error
const removeSourceDocumentError = () => {
  elements.source_document_filename.parentElement.classList.remove('border-is-invalid');
  elements.source_document_filename.parentElement.previousElementSibling.classList.remove('text-danger');
  elements.source_document_filename.classList.remove('is-invalid');
  elements.source_document_filenameError.remove();
};
//Remove source document
const removeSourceDocument = (skip) => {
  removeSourceDocumentError();
  elements.source_document_filename.value = "";
  if ( !skip ) elements.source_document.value = "";
  document.getElementById('source_document_file_cancel').classList.add('d-none');
  elements.iframePlaceholder.classList.add('d-none');
  elements.imgPlaceholder.classList.remove('d-none');
};






//------------------------- READY FUNCTION ------------------------- 
$(function () {
  //Count total accounts
  countTotalAccounts();

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
  //Set current_month to its new value
  $('#ap_month').on('change', function () { 
    currentMonth = parseInt(this.value) + 1;
    setDateRange();
    loadTable({});
  });
  //Load ap_year
  $('#ap_year').select2({
    'data': apYears,
    'language': {'noResults': () => 'No available years',},
  })
  //Set current_year to its new value
  .on('change', function () { 
    currentYear = this.value; 
    setDateRange();
    loadTable({});
  })
  //Set year to its default value
  .val(localStorage.getItem('AP_YEAR') ?? currentYear).trigger('change');

  //data_source
  $('#data_source').select2({
    'dropdownParent': $('#form_modal'),
    'placeholder': 'Select a data source',
    'language': {'noResults': () => 'No available data sources',},
  }).on('select2:select', function () {
    const interval = setInterval(() => {
      if ( fetchable ) {
        clearInterval(interval);
        options['method'] = 'get';
        makeFetch(
          this.value,
          options,
          ((responseData) => {console.log(responseData)
            document.getElementById('source-data-table')?.closest('div.row')?.remove();
            document.getElementById('errorMessage')?.remove();
            document.getElementById('source-data')?.remove();
            if ( responseData != null && responseData.length ) {
              //Reset form table
              if ( formTable ) formTable.clear().draw();
              loadFormTable();
              
              let sourceDataTable = 
                `<div class="row">
                  <div class="col-auto table-responsive">
                    <table id="source-data-table" class="table table-bordered nowrap">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Source Document</th>
                          <th>Amount</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>`;
              const tableName = this.value.substring(this.value.lastIndexOf('\/')+1).toLowerCase();
              responseData.forEach((data) => {
                let date, amount, description = '';

                //For bills
                if ( /bill/gi.test(tableName) ) {
                  date = (
                    tableName == "purchase_order_vendor_bill"
                    ? data.date_of_billing
                    : (
                        tableName == "prescription_bill"
                        ? data.billing_date
                        : data.created_at
                    )
                  );
                  amount = (
                    tableName == "purchase_order_vendor_bill"
                    ? data.total_vendor_bill
                    : (
                        tableName == "purchase_order_bill"
                        ? data.total_bill
                        : data.total_amount
                      )
                  );
                  if ( tableName == "purchase_order_vendor_bill" ) {
                    description = `Due date is ${data.due_date}`;
                  }
                }

                //For payments
                else if ( /payment/gi.test(tableName) ) {
                  date = data.date_of_payment;
                  amount = (
                    tableName == "purchase_order_vendor_payment"
                    ? data.total_amount_paid
                    : data.amount_paid
                  );
                }

                //For other transactions
                else {
                  date = (
                    tableName == "sales"
                    ? data.date
                    : tableName == "deposit"
                      ? data.date_of_deposit
                      : tableName == "withdrawal"
                        ? data.date_of_withdrawal
                        : data.created_at
                  ); 
                  amount = (
                    tableName == "sales"
                    ? data.total_amount
                    : tableName == "ar_utilities"
                      ? data.utility_bill
                      : data.amount
                  );
                  if ( tableName == "ar_utilities" ) {
                    description = data.notes;
                  } else if ( /(deposit|withdrawal)/gi.test(tableName) ) {
                    description = data.description;
                  }
                }

                if ( date.lastIndexOf('T') > -1 ) {
                  date = date.substring(0, date.lastIndexOf('T'));
                }

                const [date_year, date_month, date_day] = date.split('-');
              
                data = {
                  id: data.id,
                  //date: `${date_month}/${date_day}/${date_year}`,
                  date: `09/${date_day}/${date_year}`,
                  source_document: data.source_document,
                  amount: amount,
                  status: data.status,
                  status2: data.status2,
                  description: description,
                  updated_at: data.updated_at
                };

                //purchase_order_bill
                if ( /(purchase_order_vendor_bill|purchase_order_bill)/gi.test(tableName) ) {
                  if ( /(pending|active|approved|incomplete|incompleted|not complete|not completed)/gi.test(data.status) ) {
                    data.credit_account_title = 'Purchase Orders Payable';
                    data.debit_account_title = 'Purchase Order Expense';
                    data.entry_type = 'Initial';
                    data.is_adjustable = true;
                  } else {
                    data.credit_account_title = 'Cash';
                    data.debit_account_title = 'Purchase Orders Payable';
                    data.entry_type = 'Adjusting';
                    data.is_adjustable = false;
                  }
                  if ( tableName == "purchase_order_vendor_bill" ) data.table_name = 'purchase_order_vendor_bills';
                  else data.table_name = 'purchase_order_bills';
                //purchase_order_payment
                } else if ( /(purchase_order_vendor_payment|purchase_order_payment)/gi.test(tableName) ) {
                  data.credit_account_title = 'Cash';
                  data.debit_account_title = 'Purchase Orders Payable';
                  data.entry_type = 'Adjusting';
                  data.is_adjustable = false;
                  if ( tableName == "purchase_order_vendor_payment" ) data.table_name = 'purchase_order_vendor_payments';
                  else data.table_name = 'purchase_order_payments';
                //treatment_bill
                } else if ( tableName == "treatment_bill" ) {
                  if ( /(pending|active|approved|incomplete|incompleted|not complete|not completed)/gi.test(data.status) ) {
                    data.debit_account_title = 'Accounts Receivable';
                    data.credit_account_title = 'Treatment Fee';
                    data.entry_type = 'Initial';
                    data.is_adjustable = true;
                  } else {
                    data.debit_account_title = 'Cash';
                    data.credit_account_title = 'Accounts Receivable';
                    data.entry_type = 'Adjusting';
                    data.is_adjustable = false;
                  }
                  data.table_name = 'treatment_bills';
                //surgery_bill
                } else if ( tableName == 'surgery_bill' ) {
                  if ( /(pending|active|approved|incomplete|incompleted|not complete|not completed)/gi.test(data.status) ) {
                    data.debit_account_title = 'Accounts Receivable';
                    data.credit_account_title = 'Surgery Fee';
                    data.entry_type = 'Initial';
                    data.is_adjustable = true;
                  } else {
                    data.debit_account_title = 'Cash';
                    data.credit_account_title = 'Accounts Receivable';
                    data.entry_type = 'Adjusting';
                    data.is_adjustable = false;
                  }
                  data.table_name = 'surgery_bills';
                //room_bill
                } else if ( tableName == 'room_bill' ) {
                  if ( /(pending|active|approved|incomplete|incompleted|not complete|not completed)/gi.test(data.status) ) {
                    data.debit_account_title = 'Accounts Receivable';
                    data.credit_account_title = 'Room Fee';
                    data.entry_type = 'Initial';
                    data.is_adjustable = true;
                  } else {
                    data.debit_account_title = 'Cash';
                    data.credit_account_title = 'Accounts Receivable';
                    data.entry_type = 'Adjusting';
                    data.is_adjustable = false;
                  }
                  data.table_name = 'room_bills';
                //lab_request_bill
                } else if ( tableName == 'lab_request_bill' ) {
                  if ( /(pending|active|approved|incomplete|incompleted|not complete|not completed)/gi.test(data.status) ) {
                    data.debit_account_title = 'Accounts Receivable';
                    data.credit_account_title = 'Laboratory Fee';
                    data.entry_type = 'Initial';
                    data.is_adjustable = true;
                  } else {
                    data.debit_account_title = 'Cash';
                    data.credit_account_title = 'Accounts Receivable';
                    data.entry_type = 'Adjusting';
                    data.is_adjustable = false;
                  }
                  data.table_name = 'lab_request_bills';
                //prescription_bill
                } else if ( tableName == 'prescription_bill' ) {
                  if ( /(pending|active|approved|incomplete|incompleted|not complete|not completed)/gi.test(data.status) ) {
                    data.debit_account_title = 'Accounts Receivable';
                    data.credit_account_title = 'Prescription Fee';
                    data.entry_type = 'Initial';
                    data.is_adjustable = true;
                  } else {
                    data.debit_account_title = 'Cash';
                    data.credit_account_title = 'Accounts Receivable';
                    data.entry_type = 'Adjusting';
                    data.is_adjustable = false;
                  }
                  data.table_name = 'prescription_bills';
                //inpatient_prescription_payment
                } else if ( tableName == "inpatient_prescription_payment" ) {
                  data.credit_account_title = 'Prescription Fee';
                  data.debit_account_title = 'Cash';
                  data.entry_type = 'Adjusting';
                  data.is_adjustable = false;
                  data.table_name = 'inpatient_prescription_payments';
                //inpatient_surgery_payment
                } else if ( tableName == "inpatient_surgery_payment" ) {
                  data.credit_account_title = 'Surgery Fee';
                  data.debit_account_title = 'Cash';
                  data.entry_type = 'Adjusting';
                  data.is_adjustable = false;
                  data.table_name = 'inpatient_surgery_payments';
                //inpatient_room_payment
                } else if ( tableName == "inpatient_room_payment" ) {
                  data.credit_account_title = 'Room Fee';
                  data.debit_account_title = 'Cash';
                  data.entry_type = 'Adjusting';
                  data.is_adjustable = false;
                  data.table_name = 'inpatient_room_payments';
                //lab_request_payment
                } else if ( /(inpatient_lab_request_payment|outpatient_lab_request_payment)/gi.test(tableName) ) {
                  data.credit_account_title = 'Laboratory Fee';
                  data.debit_account_title = 'Cash';
                  data.entry_type = 'Adjusting';
                  data.is_adjustable = false;
                  if ( tableName == "inpatient_lab_request_payment" ) data.table_name = 'inpatient_lab_request_payments';
                  else data.table_name = 'outpatient_lab_request_payments';
                //treatment_payment
                } else if ( /(inpatient_treatment_payment|outpatient_treatment_payment)/gi.test(tableName) ) {
                  data.credit_account_title = 'Treatment Fee';
                  data.debit_account_title = 'Cash';
                  data.entry_type = 'Adjusting';
                  data.is_adjustable = false;
                  if ( tableName == "inpatient_treatment_payment" ) data.table_name = 'inpatient_treatment_payments';
                  else data.table_name = 'outpatient_treatment_payments';
                //deposit
                } else if ( tableName == "deposit" ) {
                  data.credit_account_title = 'Homies, Capital';
                  data.debit_account_title = 'Cash';
                  data.entry_type = 'Initial';
                  data.is_adjustable = false;
                  data.table_name = 'deposits';
                //withdrawal
                } else if ( tableName == "withdrawal" ) {
                  data.credit_account_title = 'Cash';
                  data.debit_account_title = 'Homies, Withdrawal';
                  data.entry_type = 'Initial';
                  data.is_adjustable = false;
                  data.table_name = 'withdrawals';
                //ar_utilities
                } else if ( tableName == "ar_utilities" ) {
                  if ( /(pending|active|approved|incomplete|incompleted|not complete|not completed)/gi.test(data.status) ) {
                    data.credit_account_title = 'Utilities Payable';
                    data.debit_account_title = 'Utilities Expense';
                    data.entry_type = 'Initial';
                    data.is_adjustable = true;
                  } else {
                    data.credit_account_title = 'Cash';
                    data.debit_account_title = 'Utilities Payable';
                    data.entry_type = 'Adjusting';
                    data.is_adjustable = false;
                  }
                  data.table_name = 'ar_utilities';
                }
              
                sourceDataTable += 
                  `<tr>
                    <td>${data.date}</td>
                    <td>${(data.source_document!=undefined?'<i class="fas fa-file"></i>':'')}</td>
                    <td>${formatAmount(data.amount)}</td>
                    <td>${data.description}</td>
                    <td>${data.status}</td>
                    <td class="text-center">
                      <div class="dropdown">
                        <a class="btn btn-sm btn-default" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right p-0" aria-labelledby="dropdownMenuLink2">
                          <a class="dropdown-item" onclick="viewSourceData(${JSON.stringify(data).replaceAll('\"','\'')});">
                            <i class="fas fa-list mr-1" style="width: 2rem;"></i><span>View Data</span>
                          </a>
                          <a class="dropdown-item" onclick="addSourceData(${JSON.stringify(data).replaceAll('\"','\'')}, false);">
                            <i class="fas fa-plus mr-1" style="width: 2rem;"></i><span>Add Data</span>
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>`;
              });
              sourceDataTable +=
                      `</tbody>
                    </table>
                    <hr />
                  </div>
                </div>`;
              document.getElementById('data_source').closest('div.form-group').insertAdjacentHTML('afterend', sourceDataTable);
            //Error message
            } else {
              errorMessageText.textContent = 'No available transactions for the selected data source.';
              document.getElementById('data_source').closest('div.form-group').insertAdjacentElement('afterend', errorMessage);
              formModalBody.animate({scrollTop: document.getElementById('errorMessage').offsetTop-10}, 'slow');
            }
          }),
          (() => {
            if ( document.querySelector('.toast.toast-error') != null ) {
              document.getElementById('source-data-table')?.closest('div.row')?.remove();
              document.getElementById('errorMessage')?.remove();
              document.getElementById('source-data')?.remove();
            }
          })
        );
      }
    }, 100);
  });

  //------------------------- FORM ELEMENTS -------------------------
  //SOURCE DOCUMENT
  window.addEventListener('focus', function () {
    setTimeout(() => {
      if ( noUploadedFile 
        && elements.source_document_filename.value == ""
        && !elements.source_document_filename.classList.contains('is-invalid')
        && $('#data_source').val() == ""
      ) {
        noUploadedFile = undefined;
        addSourceDocumentError('Source document is required.');
      }
    }, 500);
  });
  elements.source_document_filename.addEventListener('click', function () {
    elements.source_document.click();
  });
  elements.source_document.addEventListener('click', function () {
    noUploadedFile = true;
    removeSourceDocumentError();
  });
  document.getElementById('source_document_file_cancel').addEventListener('click', function () {
    removeSourceDocument();
    if ( $('#data_source').val() == "" ) addSourceDocumentError('Source document is required.');
  });
  
  
  //ENTRY TYPE
  $('#entry_type').select2({
    'dropdownParent': $('#form_modal'),
    'data': ['Initial','Adjusting'],
    'language': {'noResults': () => 'No available entry types',},
  })
  //Toggle is_adjustable
  .on('change', function () {
    entryType = this.value;
    if ( entryType == 'Initial' ) {
      document.getElementById('adjustableRow').classList.remove('d-none');
    } else if ( entryType == 'Adjusting' ) {
      document.getElementById('adjustableRow').classList.add('d-none');
    }
    resetModalForm();
    $('#entry_type').val(entryType);
    loadFormTable();
  });

  //DATE
  elements.date.addEventListener('change', function () {
    //Remove error if any
    if ( this.classList.contains('is-invalid') ) {
      this.previousElementSibling.classList.remove('text-danger');
      this.classList.remove('is-invalid');
      elements.dateError.remove();
    } 
    //Display error if invalid
    if ( this.value == "" ) {
      this.previousElementSibling.classList.add('text-danger');
      displayError(this, elements.dateError, 'Date is invalid.', ('.' + this.parentElement.className));
    }
  });

  //DEBIT ACCOUNT
  $('#debit_account').select2({
    'dropdownParent': $('#form_modal'),
    'placeholder': 'Select debit account',
    'language': {'noResults': () => 'No available debit accounts',},
  });
  //CREDIT ACCOUNT
  $('#credit_account').select2({
    'dropdownParent': $('#form_modal'),
    'placeholder': 'Select credit account',
    'language': {'noResults': () => 'No available credit accounts',},
  });

  //debit_account & credit_account
  for (let select of ['debit_account', 'credit_account']) {
    //Listen select2 select event
    $(`#${select}`).on('select2:select', function () {
      select = this.id;
      const closest = '.' + this.parentElement.className;
      //Remove error if any
      if ( $(this).hasClass('is-invalid') ) {
        removeAccountError(select);
      } 
      //Display error if account is not selectable
      if ( !hasNoBlank(select=='debit_account'?'Debit':'Credit') ) {
        addAccountError(
          select,
          `Unable to add new account due to blank ${select=='debit_account'?'debit':'credit'} field.`,
          closest
        );
      //Add account
      } else if ( this.value != "" ) {
        const accountTitle = $(this).find(':selected').text();
        const [ignoreThis, pr, debitOrCredit] = this.value.split('&');
        addAccount(
          this.value,
          accountTitle, 
          pr, 
          (debitOrCredit.toLowerCase()=='debit')
        );
      }
      $(this).val(null).trigger("change");
    })//Listen select2 close event
    .on('select2:close', function () {
      select = this.id;
      const closest = '.' + this.parentElement.className;
      //Display error if no debit_account & credit_account
      if ( !$(this).hasClass('is-invalid') 
        && hasNoBlank(select=='debit_account'?'Debit':'Credit')
        && ( (select == 'debit_account'
           && totalDebitAmount == 0)
          || (select == 'credit_account'
           && totalCreditAmount == 0) )
      ) {
        addAccountError(
          select,
          `${select=='debit_account'?'Debit':'Credit'} account is required.`,
          closest
        );
      } 
    });
  }
  
  //ADJUSTABLE
  $('#is_adjustable').on('change', function () {
    if ( this.checked ) {
      $('#accounts').prop('disabled', false);
      loadAccountsCanBeAdjusted();
    } else {
      $('#accounts').prop('disabled', true)
        .empty().append('<option></option>');
      document.querySelector('div.applied-depreciation')?.remove();
      document.querySelector('div.applied-interest')?.remove();
    }
  });
  
  //ACCOUNTS
  $('#accounts').select2({
    'dropdownParent': $('#form_modal'),
    'placeholder': 'Select accounts can be adjusted',
    'language': 'No available accounts',
    'disabled': true,
    'multiple': true,
  })//Remove added interest if unselected
  .on('select2:unselect', function (e) {
    const accountId = e.params.data.id;
    removeDepreciationOrInterest(`applied&${(accountId.split('&')[2]=='Debit'?'depreciation':'interest')}`, accountId);
  });

  //For edit: set posted_at & posted_by to '' to remove default value
  elements.status.addEventListener('change', function () {
    if ( document.getElementById('posted_at')
     && !this.checked 
    ) {
      document.getElementById('posted_at').closest('div.col-12')?.remove();
    }
  });
  
  //Autofocus all select2 elements
  for (const select of ['ap_month','ap_year','entry_type','debit_account','credit_account','accounts']) {
    $(`#${select}`).on('select2:open', function () {
      setTimeout(() => document.querySelector(`input[aria-activedescendant*="${select}"]`)?.focus(), 100);
    });
  }
  
  //------------------------- LISTEN SUBMIT EVENT -------------------------
  form.addEventListener(
    'submit',
    function (e) {
      e.preventDefault();
      validateFormElements(new FormData(form));
    }
  );
    
  //Load form_table
  $('#form_modal').on('show.bs.modal', function () { 
    $('#entry_type').val((
      $('#typeDropdown a[class~="active"]').text().replace(/ entry/gi, '')
      ) == 'Adjusting' 
      ? 'Adjusting'
      : 'Initial'
    ).trigger('change');
  });
  //Reset modal form
  $('#form_modal').on('hidden.bs.modal', function () { 
    entryType = (
      $('#typeDropdown a[class~="active"]').text().replace(/ entry/gi, '')
      ) == 'Adjusting' 
      ? 'Adjusting'
      : 'Initial';
    resetModalForm();
  });

  //------------------------- ENABLE CONFIRM MODAL BUTTONS -------------------------
  $('#confirm-modal').on('hidden.bs.modal', function () {
    confirmDismiss.forEach((dismiss) => { dismiss.removeAttribute('disabled'); });
    confirmSubmit.removeAttribute('disabled');
  });
});

//------------------------- VALIDATE FORM ELEMENTS -------------------------
const formModalBody = $('#form_modal .modal-body');
const errorMessage = document.createElement('DIV');
errorMessage.id = 'errorMessage';
errorMessage.className = 'row';
errorMessage.insertAdjacentHTML(
  'afterbegin',
  `<div class="col">
    <div class="alert alert-danger alert-dismissible">
      <h5><i class="icon fas fa-exclamation-triangle"></i>&nbsp;Error!</h5>
      <div id="errorMessageText"></div>
    </div>
  </div>`
);
const errorMessageText = errorMessage.querySelector('#errorMessageText');
var validationResult, rows;
//Validate form elements
const validateFormElements = (formData) => {
  validationResult = {'hasError': false};
  document.getElementById('errorMessage')?.remove();
  elements.submitButton.setAttribute('disabled', 'true');
  
  //Display error if no selected account can be adjusted.
  if ( $('#account')?.val() == "" ) {
    errorMessageText.textContent = 'No selected account can be adjusted.';
    document.getElementById('adjusting-entry').insertAdjacentElement('afterend', errorMessage);
    validationResult['hasError'] = true;
    validationResult['scrollTop'] = document.getElementById('errorMessage').offsetTop-10;
  }

  //Keep error if debit_account is invalid
  if ( $('#debit_account').hasClass('is-invalid') ) {
    validationResult['hasError'] = true;
    validationResult['scrollTop'] = document.getElementById('debit_account').offsetTop-10;
  //Display error if any debit account input value is invalid
  } else if ( Array.from(document.querySelectorAll('input[id*="input-debit-"]'))
    ?.some((input) => parseFloat(input.value) == 0) 
  ) {
      errorMessageText.textContent = 'Zero (0) value from debit account input is invalid.';
      form.insertAdjacentElement('beforebegin', errorMessage);
      validationResult['hasError'] = true;
      validationResult['scrollTop'] = document.getElementById('errorMessage').offsetTop-10;
  //Display error if no debit_account
  } else if ( totalDebitAmount == 0 
    && hasNoBlank('Debit')
  ) {
    addAccountError(
      'debit_account',
      `Debit account is required.`,
      '.col-md-6'
    );
    validationResult['hasError'] = true;
    validationResult['scrollTop'] = document.getElementById('debit_account').offsetTop-10;
  }

  //Keep error if credit_account is invalid
  if ( $('#credit_account').hasClass('is-invalid') ) {
    validationResult['hasError'] = true;
    validationResult['scrollTop'] = document.getElementById('credit_account').offsetTop-10;
  //Display error if any credit account input value is invalid
  } else if ( Array.from(document.querySelectorAll('input[id*="input-credit-"]'))
    ?.some((input) => parseFloat(input.value) == 0) 
  ) {
    errorMessageText.textContent = 'Zero (0) value from credit account input is invalid.';
    form.insertAdjacentElement('beforebegin', errorMessage);
    validationResult['hasError'] = true;
    validationResult['scrollTop'] = document.getElementById('errorMessage').offsetTop-10;
  //Display error if no credit_account
  } else if ( totalCreditAmount == 0 
    && hasNoBlank('Credit')
  ) {
    addAccountError(
      'credit_account',
      `Credit account is required.`,
      '.col-md-6'
    );
    validationResult['hasError'] = true;
    validationResult['scrollTop'] = document.getElementById('credit_account').offsetTop-10;
  } 
  
  //Display error if total debit & credit amounts are not equal
  if ( totalDebitAmount != totalCreditAmount 
    && totalDebitAmount != 0
    && totalCreditAmount != 0
    && hasNoBlank('Debit')
    && hasNoBlank('Credit')
  ) {
    errorMessageText.textContent = 'The total debit & credit amounts are not equal.';
    form.insertAdjacentElement('beforebegin', errorMessage);
    validationResult['hasError'] = true;
    validationResult['scrollTop'] = document.getElementById('errorMessage').offsetTop-10;
  //Display error if there`s any blank field
  } else if ( !hasNoBlank('Debit')
    || !hasNoBlank('Credit')
  ) {
    errorMessageText.textContent = 'Unable to proceed due to blank field/s.';
    form.insertAdjacentElement('beforebegin', errorMessage);
    validationResult['hasError'] = true;
    validationResult['scrollTop'] = document.getElementById('errorMessage').offsetTop-10;
  }

  //date
  if ( elements.date.classList.contains('is-invalid') ) {
    elements.date.focus();
    validationResult['hasError'] = true;
    validationResult['scrollTop'] = elements.date.offsetTop-10;
  } else if ( elements.date.value == "" ) {
    elements.date.focus();
    elements.date.dispatchEvent(new Event('change'));
    validationResult['hasError'] = true;
    validationResult['scrollTop'] = elements.date.offsetTop-10;
  }

  //source_document
  if ( !/^(Depreciation|P \* R \* T)$/i.test(document.getElementById('method')?.value) 
    && $('#data_source').val() == ""
  ) {console.log('here')
    if ( elements.source_document_filename.classList.contains('is-invalid') ) {
      validationResult['hasError'] = true;
      validationResult['scrollTop'] = elements.source_document_filename.offsetTop-10;
    } else if ( elements.source_document_filename.value == "" ) {
      addSourceDocumentError('Source document is required.');
      validationResult['hasError'] = true;
      validationResult['scrollTop'] = elements.source_document_filename.offsetTop-10;
    }
  }
  
  //If no error, then validate each applied depreciation & interest
  if ( !validationResult['hasError'] ) {
    rows = document.querySelectorAll('#form_table > tbody > tr');
    for (const row of rows) {
      const id = row.children[0].firstElementChild.id;
      let debit;
      try { debit = row.children[2].firstElementChild.value; } catch { debit = 0; }
      const salvage_value = document.getElementById(`salvage_value-${id}`)?.value;
      const useful_life = document.getElementById(`useful_life-${id}`)?.value;
      const rate = document.getElementById(`rate-${id}`)?.value;
      const month_no = document.getElementById(`month_no-${id}`)?.value;
      //depreciation inputs
      if ( parseFloat(salvage_value) > parseFloat(debit) ) {
        errorMessageText.textContent = 'The salvage value must not be greater than the asset cost.';
        form.insertAdjacentElement('beforebegin', errorMessage);
        validationResult['hasError'] = true;
        validationResult['scrollTop'] = document.getElementById('errorMessage').offsetTop-10;
        break;
      } else if ( salvage_value === '0' || useful_life === '0' ) {
        errorMessageText.textContent = 'Invalid value from depreciation input/s';
        form.insertAdjacentElement('beforebegin', errorMessage);
        validationResult['hasError'] = true;
        validationResult['scrollTop'] = document.getElementById('errorMessage').offsetTop-10;
        break;
      } 
      //interest inputs
      else if ( rate === '0' || month_no === '0' ) {
        errorMessageText.textContent = 'Invalid value from interest input/s';
        form.insertAdjacentElement('beforebegin', errorMessage);
        validationResult['hasError'] = true;
        validationResult['scrollTop'] = document.getElementById('errorMessage').offsetTop-10;
        break;
      }
    }
  }

  //If no error, then submit
  if ( !validationResult['hasError'] ) {
    if ( entryType == 'Initial' && elements.uuid.value != "" ) {
      confirmToCreateOrUpdate(
        'Once you update the entry, its adjustments will be removed.',
        formData
      );
    } else {
      disableFormElements();
      setTimeout(() => { prepareAndSendData(formData); }, 2000);
    }
  } else {
    elements.submitButton.removeAttribute('disabled');
    formModalBody.animate({scrollTop: validationResult['scrollTop']}, 'slow');
  }
};

//Confirm to create/update 
const confirmToCreateOrUpdate = (text, formData) => {
  //Update confirm modal
  confirmTitleIcon.className = `fas fa-exclamation-triangle text-secondary mr-3`;
  confirmTitle.textContent = 'Confirmation';
  confirmText.innerHTML = 
    `<div class="d-flex justify-content-between">
      <div class="mr-2"><i><b>Warning: </b></i></div>
      <div>${text}</div>
    </div>
    <div><br />Are you sure you want to update it now?</div>`;
  confirmSubmit.className = `btn btn-sm btn-primary`;
  confirmSubmitText.textContent = `Yes, update it!`;
  confirmSubmitIcon.className = 'fas fa-check ml-2';
  
  //Update attached event
  confirmSubmit.removeEventListener('click', eventCallbackOk);
  eventCallbackOk = () => {
    disableConfirmModalButtons();
    $('#confirm-modal').modal('hide');
    disableFormElements();
    setTimeout(() => { prepareAndSendData(formData); }, 2000);
  };
  confirmSubmit.addEventListener('click', eventCallbackOk);

  //Update attached event
  confirmDismiss.forEach((dismiss) => {
    if ( eventCallbackCancel != undefined ) dismiss.removeEventListener('click', eventCallbackCancel);
    eventCallbackCancel = () => elements.submitButton.removeAttribute('disabled');
    dismiss.addEventListener('click', eventCallbackCancel);
  });

  //Show modal
  $('#confirm-modal').modal({
    'backdrop': 'static',
    'keyboard': true,
    'focus': true,
    'show': true
  });
};

// Prepare & send data
const prepareAndSendData = (formData) => {
  //Get & calculate the data for adjusting entry w/ originating entry
  const originating_entry = {'id': document.querySelector('input.originating-entry')?.id};
  if ( originating_entry.id != undefined ) {
    //method
    const method = document.getElementById('method').value;

    //Calculation for depreciation & interest
    if ( /^(Depreciation|P \* R \* T)$/i.test(method) ) {
      //Get balance, monthly, total amount & convert them
      let [balance, adjusted_balance, totalAmount] = 
        document.querySelector(`input.acct_${(method == 'Depreciation' ? 'depreciation' : 'interest')}`).value.split('|');
      balance = parseFloat(balance);
      adjusted_balance = parseFloat(adjusted_balance);
      totalAmount = parseFloat(totalAmount);

      if ( elements.uuid.value == "" ) {
        if ( (balance + adjusted_balance) <= totalAmount ) {
          balance += adjusted_balance;
          balance = parseFloat(balance.toLocaleString('en', {'maximumFractionDigits': 2, 'useGrouping': false}));
        }
      }console.log(
        'totalAmount:', totalAmount, 
        'sample floating:', parseFloat('3.01'), parseFloat(3.01), parseFloat('3.33'), parseFloat(3.33),
        'what:', parseFloat(3.33) + parseFloat(7.01)
      )

      formData.set('adjusted_balance', adjusted_balance);

      //account
      if ( method == 'Depreciation' ) {
        originating_entry['account'] = {
          'balance': balance,
          //Set is_adjustable to false if total amount is met otherwise true
          'is_adjustable': (balance == totalAmount ? false : true)
        };
      } else {
        originating_entry['account'] = {
          'interest': balance,
          //Set is_interest_adjustable to false if total amount is met otherwise true
          'is_interest_adjustable': (balance == totalAmount ? false : true)
        };
      }
    //Calculation for asset & liability
    } else {
      //balance
      let balance = parseFloat(document.getElementById('balance').value);
      
      //adjusted_balance
      const adjusted_balance = totalDebitAmount;
      
      if ( adjusted_balance <= balance ) {
        balance -= adjusted_balance;
        balance = parseFloat(balance.toLocaleString('en', {'maximumFractionDigits': 2, 'useGrouping': false}));

        formData.set('adjusted_balance', adjusted_balance);

        //account
        originating_entry['account'] = {
          'balance': balance,
          //Set is_adjustable to false if balance is zero otherwise true
          'is_adjustable': (balance == 0 ? false : true)
        };
      //Display error
      } else {
        //Enable form elements
        enableFormElements(
          `#form select:not(
            [id="entry_type"],
            [id="debit_account"],
            [id="credit_account"]
          ),`
        );
        //Error message
        errorMessageText.textContent = 'The adjusted balance must not be greater than the balance.';
        form.insertAdjacentElement('beforebegin', errorMessage);
        return formModalBody.animate({scrollTop: document.getElementById('errorMessage').offsetTop-10}, 'slow');
      }
    }
    formData.set('entry_type', entryType);
    formData.set('originating_entry', JSON.stringify(originating_entry));
    formData.set('adjusted_account', adjusted_account.split('&')[0]);
  }
  
  //is_adjustable
  const adjustableAccounts = $('#accounts').val();
  if ( adjustableAccounts.length ) formData.set('is_adjustable', true);

  //status
  formData.set('status', (
    elements.status.checked
    ? 'Posted'
    : (
        elements.status.value != 'Inactive'
        ? 'Journalized'
        : 'Inactive'
      )
  ));

  //Get form table data
  const new_accounts = [];
  for (const row of rows) {
    const id = row.children[0].firstElementChild.id;
    const account = {};
    account['account_title'] = id.split('&')[0];
    account['pr'] = row.children[1].textContent;
    try { 
      account['debit'] = account['balance'] = row.children[2].firstElementChild.value;
      account['credit'] = 0;
    } catch {
      account['debit'] = 0;
      account['credit'] = account['balance'] = row.children[3].firstElementChild.value;
    }
    account['is_adjustable'] = (adjustableAccounts.indexOf(id) > -1 ? true:false);
    //Get the salvage value & useful life for depreciation
    account['salvage_value'] = (document.getElementById(`salvage_value-${id}`)?.value ?? 0);
    account['useful_life'] = (document.getElementById(`useful_life-${id}`)?.value ?? 0);
    //Get the rate & month_no for interest
    account['rate'] = (document.getElementById(`rate-${id}`)?.value ?? 0);
    account['month_no'] = (document.getElementById(`month_no-${id}`)?.value ?? 0);
    
    //For depreciation
    //balance must be 0 & is_adjustable is true
    if ( account['salvage_value'] > 0 && account['useful_life'] > 0 ) {
      account['balance'] = 0;
      account['is_adjustable'] = true;
    }

    //For interest
    //interest must be 0 & is_interest_adjustable is true
    account['interest'] = 0;
    if ( account['rate'] > 0 && account['month_no'] > 0 ) account['is_interest_adjustable'] = true;
    else account['is_interest_adjustable'] = false;
    
    //Collect all accounts
    new_accounts.push(account);
  }
  formData.set('new_accounts', JSON.stringify(new_accounts));
  
  let url;
  //For create
  if ( elements.uuid.value == "" ) {
    url = '../accountant/general_journal';
  //For edit
  } else {
    url = `../accountant/general_journal/${elements.uuid.value}`;
    formData.set('journalized_at', document.getElementById('journalized_at').value);
    formData.set('journalized_by', document.getElementById('journalized_by').value);
    if ( document.getElementById('posted_at') ) formData.set('posted_at', document.getElementById('posted_at').value);
    if ( document.getElementById('posted_by') ) formData.set('posted_by', document.getElementById('posted_by').value);
    if ( saved_filename != undefined ) formData.set('saved_filename', saved_filename);
  }

  //For data source
  if ( document.querySelectorAll('#source-data button').length == 1 ) {
    formData.set('data_source', document.getElementById('data_source_id').value);
    formData.set('data_source_date',  document.getElementById('data_source_date').value);
    formData.set('data_source_status', document.getElementById('data_source_status').value);
    formData.set('data_source_status2', document.getElementById('data_source_status2').value);
    formData.set('data_source_table_name', document.getElementById('data_source_table_name').value);
    formData.set('entry_type', document.getElementById('data_source_entry_type').value);
    formData.set('is_adjustable', document.getElementById('data_source_is_adjustable').value);
  }

  for(const data of formData.entries()) {
    console.log(data[0],"",data[1])
  }
  
  //------------------------- AJAX REQUEST -------------------------
  //Modify options
  options['method'] = 'post';
  options['cache'] = 'no-store';
  options['body'] = formData;
  //Make a fetch for creation / update
  makeFetch(url, 
    options, 
    forNotEditOrViewCallback, 
    finallyCallback
  );
};






//------------------------- DISABLE FORM ELEMENTS -------------------------
const disableFormElements = () => {
  const formElements = document.querySelectorAll(`
    #form input:not([id="uuid"]), 
    #form select,
    #form textarea,
    #form button,
    #form a,
    [form="form"]
  `);
  formElements.forEach((el) => { el.setAttribute('disabled','true'); });
  elements.submitButton.firstElementChild.textContent = '';
  elements.submitButton.lastElementChild.className = 'fas fa-1x fa-sync-alt fa-spin';
};

//------------------------- ENABLE FORM ELEMENTS -------------------------
const enableFormElements = (selectedElements='#form select,') => {
  const formElements = document.querySelectorAll(`
    #form input:not([id="uuid"]), 
    ${selectedElements}
    #form textarea,
    #form button,
    #form a,
    [form="form"]
  `);
  formElements.forEach((el) => { el.removeAttribute('disabled'); });
  if ( entryType == 'Initial' ) {
    if ( elements.uuid.value == "" ) elements.submitButton.firstElementChild.textContent = 'Submit';
    else elements.submitButton.firstElementChild.textContent = 'Update';
  } else if ( entryType == 'Adjusting' ) {
    if ( elements.uuid.value == "" ) elements.submitButton.firstElementChild.textContent = 'Adjust';
    else elements.submitButton.firstElementChild.textContent = 'Update';
  }
  elements.submitButton.lastElementChild.className = 'fas fa-check ml-2';
  elements.submitButton.removeAttribute('disabled');
};





//Add account error
const addAccountError = (el, text, closest) => {
  $(`span[aria-labelledby="select2-${el}-container"]`)?.addClass('is-invalid');
  $(`#${el}`).prev().addClass('text-danger');
  displayError(
    document.getElementById(el),
    elements[`${el}Error`],
    text,
    closest
  );
};
//Remove account error
const removeAccountError = (el) => {
  $(`span[aria-labelledby="select2-${el}-container"]`)?.removeClass('is-invalid');
  $(`#${el}`).removeClass('is-invalid')
    .prev().removeClass('text-danger');
  elements[`${el}Error`].remove();
};
//Clear error
const clearError = (debitOrCredit) => {
  //Remove error message
  document.getElementById('errorMessage')?.remove();
  //Remove account error
  if ( debitOrCredit == 'debit' || debitOrCredit == undefined ) {
    $('#debit_account').val(null).trigger('change');
    removeAccountError('debit_account');
  }
  if ( debitOrCredit == 'credit' || debitOrCredit == undefined ) {
    $('#credit_account').val(null).trigger('change');
    removeAccountError('credit_account');
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
        `../accountant/general_journal/${id}`,
        options,
        forEditOrViewCallback
      );
    }
  }, 100);
};


//------------------------- FUNCTION FOR POSTING, UNPOSTING & DELETING DATA -------------------------
function toDo () {
  disableConfirmModalButtons();
  $('#confirm-modal').modal('hide');
  const id = this.id;
  const operation_type = this.operation_type;
  const interval = setInterval(() => {
    if ( fetchable ) {
      clearInterval(interval);
      if ( operation_type == 0 ) {
        options['method'] = 'delete';
      } else {
        options['method'] = 'put';
        options['cache'] = 'no-store';
      }
      makeFetch(
        `../accountant/general_journal/${id}?operation_type=${operation_type}${(operation_type==0?`&entry_type=${entryType}`:``)}`,
        options,
        forNotEditOrViewCallback
      );
    }
  }, 100);
}