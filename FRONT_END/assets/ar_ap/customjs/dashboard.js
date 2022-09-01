// PO Chart
var label1 = new Array()
var data1 = new Array()


$.ajax({
  url: apiURL + "purchase_order/find_all",
  type: "GET", // post, put, delete, get
  dataType: "json",
  contentType: false,
  processData: false,
  cache: false,
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + $.cookie("TOKEN"),
  },
  success: function (data) {
    console.log(data)
  },
  error: function (data) {
    toastr.error(data.responseJSON.detail);
  },
});

const createChart = () =>{

  let status_array = ['Active', 'Approved','Inactive'];
  let status_values_array = [0,0,0];
  let all_ctr = 0;
  let approve_ctr = 0;
  let active_ctr = 0;
  let inactive_ctr = 0;

    $.ajax({
        url: apiURL+`purchase_order/datatable`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + $.cookie("TOKEN"),
        },
        dataType: "json",
        contentType: "application/json",
        success: (data)=>{
          if(data.length == 0){
            status_values_array[0] = 0; 
            status_values_array[1] = 0;
            status_values_array[2] = 0;
              //chart
              var donutChartCanvas = $('#po_chart').get(0).getContext('2d')
              var donutData = {
                labels: status_array,
                datasets:[
                  {
                    data: status_values_array,
                    backgroundColor: ['#f39c12', '#00a65a', '#f56954'],
                  }
                ]
              }
              var donutOptions = {
                maintainAspectRatio : false,
                responsive : true,
                /*legend: {
                  display: false
                }*/
              }
              //Create pie or douhnut chart
              // You can switch between pie and douhnut using the method below.
              new Chart(donutChartCanvas, {
                type: 'doughnut',
                data: donutData,
                options: donutOptions
              })
              //chart:end
          }else{

            console.log(data)

            data.map((val)=>{
                
            if(val.status == "Active"){
              status_values_array[0] += 1;
              all_ctr++;
              active_ctr++;
            }
            else if(val.status == "Inactive"){
              status_values_array[2] += 1;
              all_ctr++;
              inactive_ctr++;
            }
            else if(val.status == "Approved"){
              status_values_array[1] += 1;
              all_ctr++;
              approve_ctr++;
              
            }
            
            });

            $('#all_po').html(all_ctr);
            $('#active_po').html(active_ctr);
            $('#inactive_po').html(inactive_ctr);
            $('#approve_po').html(approve_ctr);


            status_array[0] += '(' + status_values_array[0].toString() + ')'; 
            status_array[1] += '(' + status_values_array[1].toString() + ')'; 
            status_array[2] += '(' + status_values_array[2].toString() + ')';
            var donutChartCanvas = $('#po_chart').get(0).getContext('2d')
            var donutData = {
              labels: status_array,
              datasets: [
                {
                  data: status_values_array,
                  backgroundColor : ['#f39c12', '#00a65a', '#f56954'],
                }
              ]
            }
            var donutOptions = {
              maintainAspectRatio : false,
              responsive : true,
              /*legend: {
                display: false
              }*/
            }
            //Create pie or douhnut chart
            // You can switch between pie and douhnut using the method below.
            new Chart(donutChartCanvas, {
              type: 'doughnut',
              data: donutData,
              options: donutOptions
            })
        }
      }
    });

}
createChart();



// U Chart
var label2 = new Array()
var data2 = new Array()


$.ajax({
  url: apiURL + "utilities/find_all",
  type: "GET", // post, put, delete, get
  dataType: "json",
  contentType: false,
  processData: false,
  cache: false,
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + $.cookie("TOKEN"),
  },
  success: function (data) {
    console.log(data)
  },
  error: function (data) {
    toastr.error(data.responseJSON.detail);
  },
});

const createChart2 = () =>{

  let status_array = ['Active', 'Approved','Inactive'];
  let status_values_array = [0,0,0];

    $.ajax({
        url: apiURL+`utilities/datatable`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + $.cookie("TOKEN"),
        },
        dataType: "json",
        contentType: "application/json",
        success: (data)=>{
          if(data.length == 0){
            status_values_array[0] = 0; 
            status_values_array[1] = 0;
            status_values_array[2] = 0;
              //chart
              var donutChartCanvas = $('#u_chart').get(0).getContext('2d')
              var donutData = {
                labels: status_array,
                datasets:[
                  {
                    data: status_values_array,
                    backgroundColor: ['#f39c12', '#00a65a', '#f56954'],
                  }
                ]
              }
              var donutOptions = {
                maintainAspectRatio : false,
                responsive : true,
                /*legend: {
                  display: false
                }*/
              }
              //Create pie or douhnut chart
              // You can switch between pie and douhnut using the method below.
              new Chart(donutChartCanvas, {
                type: 'doughnut',
                data: donutData,
                options: donutOptions
              })
              //chart:end
          }else{

            console.log(data)

            data.map((val)=>{
                
            if(val.status == "Active"){
              status_values_array[0] += 1;
            }
            else if(val.status == "Inactive"){
              status_values_array[2] += 1;
            }
            else if(val.status == "Approved"){
              status_values_array[1] += 1;
              
            }

            });

            status_array[0] += '(' + status_values_array[0].toString() + ')'; 
            status_array[1] += '(' + status_values_array[1].toString() + ')'; 
            status_array[2] += '(' + status_values_array[2].toString() + ')';
            var donutChartCanvas = $('#u_chart').get(0).getContext('2d')
            var donutData = {
              labels: status_array,
              datasets: [
                {
                  data: status_values_array,
                  backgroundColor : ['#f39c12', '#00a65a', '#f56954'],
                }
              ]
            }
            var donutOptions = {
              maintainAspectRatio : false,
              responsive : true,
              /*legend: {
                display: false
              }*/
            }
            //Create pie or douhnut chart
            // You can switch between pie and douhnut using the method below.
            new Chart(donutChartCanvas, {
              type: 'doughnut',
              data: donutData,
              options: donutOptions
            })
        }
      }
    });

}
createChart2();


// Bill Chart
var label3 = new Array()
var data3 = new Array()


$.ajax({
  url: apiURL + "inpatient_bills/find_all",
  type: "GET", // post, put, delete, get
  dataType: "json",
  contentType: false,
  processData: false,
  cache: false,
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + $.cookie("TOKEN"),
  },
  success: function (data) {
    console.log(data)
  },
  error: function (data) {
    toastr.error(data.responseJSON.detail);
  },
});

const createChart3 = () =>{

  let status_array = ['Fully paid', 'Pending', 'Not yet fully paid'];
  let status_values_array = [0,0,0];
  let paid_ctr = 0;
  let unpaid_ctr = 0;

    $.ajax({
        url: apiURL+`inpatient_bills/datatable`,
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + $.cookie("TOKEN"),
        },
        dataType: "json",
        contentType: "application/json",
        success: (data)=>{
          if(data.length == 0){
            status_values_array[0] = 0; 
            status_values_array[1] = 0;
            status_values_array[2] = 0;
              //chart
              var donutChartCanvas = $('#bill_chart').get(0).getContext('2d')
              var donutData = {
                labels: status_array,
                datasets:[
                  {
                    data: status_values_array,
                    backgroundColor: ['#f39c12', '#00a65a', '#f56954'],
                  }
                ]
              }
              var donutOptions = {
                maintainAspectRatio : false,
                responsive : true,
                legend: {
                  display: false
                }
              }
              //Create pie or douhnut chart
              // You can switch between pie and douhnut using the method below.
              new Chart(donutChartCanvas, {
                type: 'bar',
                data: donutData,
                options: donutOptions
              })
              //chart:end
          }else{

            console.log(data)

            data.map((val)=>{
                
            if(val.status == "Fully paid"){
              status_values_array[0] += 1;
              paid_ctr++;
            }
            else if(val.status == "Pending"){
              status_values_array[1] += 1;
            }
            else if(val.status == "Not yet fully paid"){
              status_values_array[2] += 1;
              unpaid_ctr++;
            }

            });

            $('#fully_paid').html(paid_ctr);
            $('#not_fully_paid').html(unpaid_ctr);

            status_array[0] += '(' + status_values_array[0].toString() + ')'; 
            status_array[1] += '(' + status_values_array[1].toString() + ')'; 
            status_array[2] += '(' + status_values_array[2].toString() + ')';
            var donutChartCanvas = $('#bill_chart').get(0).getContext('2d')
            var donutData = {
              labels: status_array,
              datasets: [
                {
                  data: status_values_array,
                  backgroundColor : ['#f39c12', '#00a65a', '#f56954'],
                }
              ]
            }
            var donutOptions = {
              maintainAspectRatio : false,
              responsive : true,
              legend: {
                display: false
              }
            }
            //Create pie or douhnut chart
            // You can switch between pie and douhnut using the method below.
            new Chart(donutChartCanvas, {
              type: 'bar',
              data: donutData,
              options: donutOptions
            })
        }
      }
    });

}
createChart3();


var balance1 = 0;
var balance2 = 0;

$.ajax({
  url: apiURL + "inpatient_bills/datatable",
  type: "GET", // post, put, delete, get
  dataType: "json",
  contentType: false,
  processData: false,
  cache: false,
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + $.cookie("TOKEN"),
  },
  success: function (data) {
    console.log(data)
    data.map((val) => {
      if(val.status == "Fully paid"){
        balance1 == parseFloat(val.inpatient_bill_total)
      }
      else if(val.status == "Not yet fully paid"){
        balance2 == parseFloat(val.inpatient_bill_total)
      }
    })
    $("#paid_balance").html(balance1)
    $("#unpaid_balance").html(balance2)
  },
  error: function (data) {
    toastr.error(data.responseJSON.detail);
  },
});

