'use strict';

// create error
const createError = (elementError) => {
  const error = document.createElement('SPAN');
  error.id = elementError;
  error.className = 'error invalid-feedback';
  return error;
};

// display error
const displayError = (element, elementError, text, closest) => { 
  element.classList.add('is-invalid');
  elementError.classList.add('d-block');
  elementError.textContent = text;
  element.closest(closest).appendChild(elementError);
};

// Format name => Sur, Given Middle. Name
const formatName = (name) => {
  return (name.last_name + ", " + name.first_name + " ") +
    (
      name.middle_name
      ? (name.middle_name.charAt(0).toUpperCase()+".") 
      : ''
    );    
};    

// Format date => Week., Month. dd, yyyy hh:mm AM|PM
const formatDate = (date) => {
  date = new Date(date);
  const dateParts = date.toString().split(' ');
  let hour = parseInt(dateParts[4].slice(0,2));
  const amOrPm = hour < 12 ? 'AM' : 'PM';
  hour = hour > 12 ? (hour-12) : hour;
  hour = hour < 10 ? ('0'+hour) : hour; 
  date = `${dateParts[0]}., ${dateParts[1]}. ${dateParts[2]}, ${dateParts[3]} ${hour}${dateParts[4].slice(2,-3)} ${amOrPm}`;
  return date;
};

//Format amount
const formatAmount = (amount) => {
  amount = amount.toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false});
  let length = amount.length - 3;
  for(let i=0; true; i++) {
    if ( length > 3 ) {
      amount = `${amount.slice(0, length-3)},${amount.slice(length-3)}`;
      length = amount.length - (3 + ((i+1) * 4))
    } else {
      break;
    }
  }
  return amount;
};

// trim text fields
const trimTextFields = () => {
  const textFields = form.querySelectorAll(`
    input:not(
      [id="uuid"],
      [type="number"], 
      [type="password"], 
      [type="checkbox"], 
      [type="file"]
    ), 
    textarea
  `);
  for(const field of textFields) {
	  field.value = field.value.trim();
  }
};

var fetchable = true;
// fetch options
const options =  {
  headers: {
    'Accept': 'application/json'
  },
  mode: 'same-origin',
  credentials: 'same-origin',
  cache: 'no-cache',
  redirect: 'manual',
  referrer: '',
  referrerPolicy: 'no-referrer',
  keepAlive: false
};

// make a fetch
const makeFetch = (resource, init, thenCallback, finallyCallback) => {
  if ( fetchable ) {
    fetchable = false;
    fetch(resource, init)
    .then((response) => {
      if ( response.ok ) {
        return response.json();
      } else {
        return response.json().then((responseData) => { 
          throw new Error(responseData.detail);
        });
      }
    })
    .then((responseData) => {
      thenCallback(responseData);
    }).catch((error) => {
      document.getElementById('toast-container')?.remove();
      error = error.toString().replace('Error: ','');
      toastr["error"](error);
    }).finally(() => {
      if ( finallyCallback ) finallyCallback();
      fetchable = true;
    }); 
  } 
};

//Global variables
var eventCallbackOk, eventCallbackCancel;

//Confirm modal`s variables
const confirmTitleIcon = document.getElementById('confirm-title-icon');
const confirmTitle = document.getElementById('confirm-title');
const confirmText = document.getElementById('confirm-text');
const confirmSubmit = document.getElementById('confirm-submit');
const confirmSubmitText = document.getElementById('confirm-submit-text');
const confirmSubmitIcon = document.getElementById('confirm-submit-icon');
const confirmDismiss = document.querySelectorAll('#confirm-modal button[data-dismiss="modal"]');

//Confirm to do something 
const confirmToDo = (id, operation_type, callback, toDo, hasAdjustment) => {
  //Update confirm modal
  const color = (operation_type == 1 || operation_type == 2) ? 'primary': 'danger';
  confirmTitleIcon.className = `fas fa-exclamation-triangle text-secondary mr-3`;
  confirmTitle.textContent = 'Confirmation';
  if ( hasAdjustment ) {
    confirmText.innerHTML = 
      `<div class="d-flex justify-content-between">
        <div class="mr-2"><i><b>Warning: </b></i></div>
        <div>Once you ${toDo} the entry, its adjustments will ${(toDo=='delete'?'also ':'')}be deleted.</div>
      </div>
      <div><br />Are you sure you want to ${toDo} it now?</div>`;
  } else {
    confirmText.textContent = `Are you sure you want to ${toDo} it now?`;
  }
  confirmSubmit.className = `btn btn-sm btn-${color}`;
  confirmSubmitText.textContent = `Yes, ${toDo} it!`;
  confirmSubmitIcon.className = 'fas fa-check ml-2';
  //Update attached event
  confirmSubmit.removeEventListener('click', eventCallbackOk);
  eventCallbackOk = callback.bind({'id': id, 'operation_type': operation_type});
  confirmSubmit.addEventListener('click', eventCallbackOk);
  confirmDismiss.forEach((dismiss) => {
    if ( eventCallbackCancel != undefined ) dismiss.removeEventListener('click', eventCallbackCancel);
  });
  //Show modal
  $('#confirm-modal').modal({
    'backdrop': 'static',
    'keyboard': true,
    'focus': true,
    'show': true
  });
};

// confirm to logout
const confirmToLogout = () => {
  // update confirm modal
  confirmTitleIcon.className = 'fas fa-sign-out-alt mr-3 text-secondary';
  confirmTitle.textContent = 'Log out';
  confirmText.textContent = 'Are you sure you want to logout?';
  confirmSubmit.className = 'btn btn-sm btn-danger';
  confirmSubmitText.textContent = 'Log out';
  confirmSubmitIcon.className = 'fas fa-sign-out-alt ml-2';
  // update attached event
  confirmSubmit.removeEventListener('click', eventCallbackOk);
  eventCallbackOk = () => {
    disableConfirmModalButtons();
    confirmSubmitText.textContent = '';
    confirmSubmitIcon.className = 'fas fa-1x fa-sync-alt fa-spin';
    setTimeout(() => {
      window.location.replace(baseUrl+'login');
    }, 1000);
  };
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

//Disable confirm modal buttons
const disableConfirmModalButtons = () => {
  confirmDismiss.forEach((dismiss) => { dismiss.setAttribute('disabled','true'); });
  confirmSubmit.setAttribute('disabled','true');
};

// base url
const baseUrl = (((window.location.href.replace(/\/(?!\/)/,' ')).replace(/\/(?!\s)/, '/ ')).replace(' ','/')).split(' ')[0];
  
// set user attributes
setTimeout(() => {
  // const userImagePlaceholder = document.getElementById('userImagePlaceholder');
  // if ( localStorage.getItem('USER_PROFILE_PIC') != "null" ) {
  //   userImagePlaceholder.src = baseUrl+localStorage.getItem('USER_PROFILE_PIC');
  //   userImagePlaceholder.classList.remove('user-image-placeholder-content');
  // } else {
  //   userImagePlaceholder.src = '';
  //   userImagePlaceholder.classList.add('user-image-placeholder-content');
  // }
  document.getElementById('userFullName').textContent = localStorage.getItem('EMP_NAME');
  document.getElementById('userPosition').textContent = localStorage.getItem('USER_TYPE');
  document.getElementById('userDepartment').textContent = localStorage.getItem('DEPARTMENT');

}, 100);

// form
const form = document.getElementById('form');






