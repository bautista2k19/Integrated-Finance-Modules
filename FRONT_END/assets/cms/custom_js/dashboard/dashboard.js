$(document).ready(function () {
	$.ajax({
		url: apiURL + "dashboard/sum_inpatient_payment",
		type: "GET", // post, put, delete, get
		dataType: "json",
		success: function (data) {
			$("#sum_inpatient_payment").text("₱" + data.toLocaleString());
		},
		error: function (data) {
			toastr.error(data.responseJSON.detail);
		},
	});

	$.ajax({
		url: apiURL + "dashboard/sum_outpatient_payment",
		type: "GET", // post, put, delete, get
		dataType: "json",
		success: function (data) {
			$("#sum_outpatient_payment").text("₱" + data.toLocaleString());
		},
		error: function (data) {
			toastr.error(data.responseJSON.detail);
		},
	});

	$.ajax({
		url: apiURL + "dashboard/total_collection",
		type: "GET", // post, put, delete, get
		dataType: "json",
		success: function (data) {
			$("#total_collection").text("₱" + data.toLocaleString());
		},
		error: function (data) {
			toastr.error(data.responseJSON.detail);
		},
	});

	$.ajax({
		url: apiURL + "dashboard/total_disbursement",
		type: "GET", // post, put, delete, get
		dataType: "json",
		success: function (data) {
			$("#total_disbursement").text("₱" + data.toLocaleString());
		},
		error: function (data) {
			toastr.error(data.responseJSON.detail);
		},
	});

  var ci_month = []
  var co_month = []
  var month1 = 0
  for (let month = 0; month <= 11; month++) {
    month1 += 1
    $.ajax({
        url: apiURL + "dashboard/cash_flow/"+ month1,
        type: "GET", // post, put, delete, get
        dataType: "json",
        success: function (data) {
          ci_month[month] = data.cash_in
          co_month[month] = data.cash_out
        },
        error: function (data) {
            toastr.error(data.responseJSON.detail);
        },
        });
  }
      
      /* Chart.js Charts */
  // Sales chart
  var cashInChartCanvas = document.getElementById('cash-in-chart-canvas').getContext('2d')

  // This will get the first returned node in the jQuery collection.
  // eslint-disable-next-line no-unused-vars
  var cashInChart = new Chart(cashInChartCanvas, { // lgtm[js/unused-local-variable]
    type: 'line',
    data: { 
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Collection',
        backgroundColor: 'rgb(0, 100, 0)',
        borderColor: 'rgba(0, 100, 0,0.5)',
        data: ci_month
      }
    ]},
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Monthly Collection'
        }
      }
    },
  })



  var cashOutChartCanvas = document.getElementById('cash-out-chart-canvas').getContext('2d')
  var cashOutChart = new Chart(cashOutChartCanvas, { 
    type: 'line',
    data: { 
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Disbursement',
        backgroundColor: 'rgb(200, 0, 0)',
        borderColor: 'rgba(200, 0, 0,0.5)',
        data: co_month
      }
    ]},
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Monthly Disbursement'
        }
      }
    },
  })


  var compareChartCanvas = document.getElementById('compare-chart-canvas').getContext('2d')
  var compareChart = new Chart(compareChartCanvas, { // lgtm[js/unused-local-variable]
    data: { 
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        type: 'line',
        label: 'Collection',
        backgroundColor: 'rgb(0, 100, 0)',
        borderColor: 'rgba(0, 100, 0,0.5)',
        data: ci_month
      },
      {
        type: 'line',
        label: 'Disbursement',
        backgroundColor: 'rgb(200, 0, 0)',
        borderColor: 'rgba(200, 0, 0,0.5)',
        data: co_month
      }
    ]},
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Monthly Cash Flow'
        }
      }
    },
  })


  setTimeout(() => {
    $("#cash-out-tab").trigger('click')
    $("#cash-in-tab").trigger('click')
  }, 500);


  var profit_month = []
  var loss_month = []
  var month1 = 0
  for (let month = 0; month <= 11; month++) {
    month1 += 1
    $.ajax({
        url: apiURL + "dashboard/profit_loss/"+ month1,
        type: "GET", // post, put, delete, get
        dataType: "json",
        success: function (data) {
          if(data > 0){ 
            profit_month[month] = data
            loss_month[month] = 0
          }else if(data < 0){
            profit_month[month] = 0
            loss_month[month] = data
          }else if(data == 0){
            profit_month[month] = 0
            loss_month[month] = 0
          }
          
        },
        error: function (data) {
            toastr.error(data.responseJSON.detail);
        },
        });
  }

  setTimeout(() => {
    

  var profitlosstChartCanvas = document.getElementById('profit-loss-canvas').getContext('2d')
  var profitlossChart = new Chart(profitlosstChartCanvas, { 
    type: 'bar',
    data: { 
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Profit',
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235,0.5)',
        data: profit_month
      },
      {
        label: 'Loss',
        backgroundColor: 'rgb(200, 0, 0)',
        borderColor: 'rgba(200, 0, 0,0.5)',
        data: loss_month
      }
    ]},
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Monthly Profit/Loss'
        }
      }
    },
  })

}, 1000);

  $.ajax({
		url: apiURL + "dashboard/sum_receivable",
		type: "GET", // post, put, delete, get
		dataType: "json",
		success: function (data) {
     var receivableChartCanvas = document.getElementById('accounts-receivable-canvas').getContext('2d')
     var receivableChart = new Chart(receivableChartCanvas, { // lgtm[js/unused-local-variable]
       type: 'doughnut',
       data: { 
       labels: ['Received','Pending/Incomplete'],
       datasets: [
         {
          
           label: 'Accounts Payabale',
           backgroundColor: [
             'rgb(0, 150, 0)',
             'rgb(54, 162, 235)',
           ],
           data: [data.paid_bill,data.unpaid_bill],
           hoverOffset: 4,
         }
       ]
      },
     })
		},
		error: function (data) {
			toastr.error(data.responseJSON.detail);
		},
	});

  $.ajax({
		url: apiURL + "dashboard/sum_payable",
		type: "GET", // post, put, delete, get
		dataType: "json",
		success: function (data) {
     var payableChartCanvas = document.getElementById('accounts-payable-canvas').getContext('2d')
     var payableableChart = new Chart(payableChartCanvas, { // lgtm[js/unused-local-variable]
       type: 'doughnut',
       data: { 
       labels: ['Paid','Pending/Incomplete'],
       datasets: [
         {
           label: 'Accounts Payabale',
           backgroundColor: [
             'rgb(0, 150, 0)',
             'rgb(54, 162, 235)',
           ],
           data: [data.paid_bill,data.unpaid_bill],
           hoverOffset: 4,
         }
       ]
      },
     })
		},
		error: function (data) {
			toastr.error(data.responseJSON.detail);
		},
	});

 
});
