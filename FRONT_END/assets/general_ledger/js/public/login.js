
( function ($) {
  'use strict';

  $(function () {
    localStorage.clear();

    //Disable form elements
    const disableFormElements = ({isLoading}) => {
      username.setAttribute('disabled', 'true');
      password.setAttribute('disabled', 'true');
      rememberMe.setAttribute('disabled', 'true');
      submitButton.setAttribute('disabled', 'true');
      if ( isLoading ) {
        submitButton.children[0].textContent = '';
        submitButton.children[1].className = 'fas fa-1x fa-sync-alt fa-spin';
      }
      links.forEach((link) => { link.setAttribute('style', 'pointer-events:none;cursor:not-allowed;color:#acb3b7;'); });
    };

    //Reset form elements
    const resetFormElements = () => {
      username.value = password.value = "";
      username.removeAttribute('disabled');
      password.removeAttribute('disabled');
      rememberMe.removeAttribute('disabled');
      submitButton.removeAttribute('disabled');
      submitButton.children[0].textContent = 'Log In';
      submitButton.children[1].className = 'fas fa-sign-in-alt ml-1';
      links.forEach((link) => { link.removeAttribute('style'); });
    };

    //Create error
    const createError = (elementError) => {
      const error = document.createElement('SPAN');
      error.id = elementError;
      error.className = 'error invalid-feedback';
      return error;
    };

    //Display error
    const displayError = (element, elementError, text, closest) => {
      element.classList.add('is-invalid');
      elementError.classList.add('d-block');
      elementError.textContent = text;
      element.closest(closest).appendChild(elementError);
    };

    //Options for fetch
    const options = {
      'method': 'post',
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      },
      'mode': 'same-origin',
      'credentials': 'same-origin',
      'cache': 'no-store',
      'redirect': 'manual',
      'referrer': '',
      'referrerPolicy': 'no-referrer',
      'keepalive': false
    };

    //Make fetch
    var fetchable = true;
    const makeFetch = (resource, init, thenCallback, catchCallback, finallyCallback) => {
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
          toastr['error'](error);
          if ( catchCallback ) catchCallback();
        }).finally(() => {
          fetchable = true;
          if ( finallyCallback ) finallyCallback();
        });
      }
    };

    //Go to landing page
    const goToLandingPage = (responseData) => {
      //localStorage.setItem('USER_PROFILE_PIC', responseData.user_profile_pic);
      localStorage.setItem('USER_ID', responseData.USER_ID);
      localStorage.setItem('EMP_ID', responseData.EMP_ID);
      localStorage.setItem('EMP_NAME', responseData.EMP_NAME);
      localStorage.setItem('USER_TYPE', responseData.USER_TYPE);
      localStorage.setItem('DEPARTMENT', responseData.DEPARTMENT);
      //console.log(baseUrl,'=', responseData.endpoint)
      window.location.replace(baseUrl + responseData.endpoint);
    };

    //Form elements
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const rememberMe = document.getElementById('rememberMe');
    const submitButton = document.querySelector('#form button[type="submit"]');
    const links = document.querySelectorAll('div > a');

    //Errors
    const usernameError = createError('usernameError');
    const passwordError = createError('passwordError');

    //Position toastr
    toastr.options = {
      'positionClass': 'toast-top-center',
    };

    //Base url
    const baseUrl = (((window.location.href.replace(/\/(?!\/)/,' ')).replace(/\/(?!\s)/, '/ ')).replace(' ','/')).split(' ')[0];

    //Token error message
    const url = window.location.href.replace(/(\+|%20)/g,' ');
    try {
      const start = url.lastIndexOf('=')+1;
      const type = url.slice(url.indexOf('=')+1, start-8);
      const detail = url.slice(start);
      document.getElementById('toast-container')?.remove();
      toastr[type](detail);
      disableFormElements({isLoading: false});
      setTimeout(() => {
        window.location.replace(baseUrl+"login");
      }, 3000);
    } catch {}

    //Input event listeners
    username.addEventListener('input', () => {
      if ( username.classList.contains('is-invalid') ) {
        username.parentElement.previousElementSibling.classList.remove('text-danger');
        username.classList.remove('is-invalid');
        usernameError.remove();
      }
    });
    password.addEventListener('input', () => {
      if ( password.classList.contains('is-invalid') ) {
        password.parentElement.previousElementSibling.classList.remove('text-danger');
        password.classList.remove('is-invalid');
        passwordError.remove();
      }
    });

    //Submit event listener for #form
    document.getElementById('form').addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        //Validate password
        if ( password.value === '' ) {
          if ( !password.classList.contains('is-invalid') ) {
            password.parentElement.previousElementSibling.classList.add('text-danger');
            displayError(password, passwordError, 'Password is required.', '.col');
          }
          password.focus();
        }
        //Validate username
        if ( username.value === '' ) {
          if ( !username.classList.contains('is-invalid') ) {
            username.parentElement.previousElementSibling.classList.add('text-danger');
            displayError(username, usernameError, 'Email Address is required.', '.col');
          }
          username.focus();
        }

        //If no error then submit
        if ( username.value != ""
          && password.value != "" 
        ) {
          //Disable form elements
          disableFormElements({isLoading: true});

          //Make fetch
          options['body'] = JSON.stringify({
            'username': username.value,
            'password': password.value
          });
          username.value = password.value = "";
          const interval = setInterval(() => {
            if ( fetchable ) {
              clearInterval(interval);
              makeFetch(
                '../login', 
                options,
                //thenCallback
                ((responseData) => {
                  document.getElementById('toast-container')?.remove();
                  toastr[responseData.type](responseData.detail);
                  if ( responseData.endpoint ) {
                    setTimeout(() => {
                      goToLandingPage(responseData);
                    }, 2000);
                  } else {
                    resetFormElements();
                  }
                }),
                //catchCallback
                (() => { resetFormElements(); })
              );
            }
          }, 1000);
        }
      }
    );

  });
}(jQuery) );
