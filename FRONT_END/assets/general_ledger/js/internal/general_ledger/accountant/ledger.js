'use strict';

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
    //loadTable();
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
    //loadTable();
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

  
  
    
   
     
      
      
    
    
  


  

  
  

  
  
  
  
    
    
  
  
   
     
    
    
  
  
  

    
  
    
    
  
    

    
});