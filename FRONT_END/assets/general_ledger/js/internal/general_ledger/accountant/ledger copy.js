





            
              
             






   










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
      doc.text(`${totalDebitAmount == 0 ?`P `:``}${formatAmount(debit.toString())}`, pageWidth-245, y, {align: 'right'});
      totalDebitAmount += parseFloat(debit);
    } else {
      doc.text(`${totalCreditAmount == 0 ?`P `:``}${formatAmount(credit.toString())}`, pageWidth-65, y, {align: 'right'});
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
  doc.text(`P ${formatAmount(totalDebitAmount.toString())}`, pageWidth-245, y, {align: 'right'});
  doc.text(`P ${formatAmount(totalCreditAmount.toString())}`, pageWidth-65, y, {align: 'right'});
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
    if (item.account_number >= 401 && item.account_number <= 599) revenuesAndExpenses.push(item);
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
        if (item.account_number < 500) {
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
        doc.text(`${firstCode != prevFirstCode ?`P `:``}${formatAmount(debit.toString())}`, pageWidth-245, y, {align: 'right'});
        totalDebitAmount += parseFloat(debit);
        if ( firstCode != revenuesAndExpenses[i+1]?.account_number.toString()[0] ) {

          // total_expense_amount
          total_expense_amount = `P ${formatAmount(totalDebitAmount.toString())}`;

          doc.text(`(-) P ${formatAmount(totalDebitAmount.toString())}`, pageWidth-65, y, {align: 'right'});
          doc.line(pageWidth-385, (y+25)-(25/2), pageWidth-65, (y+25)-(25/2));
          y += 25; 
          leftHeight -= 25;
        }
      } else {
        doc.text(`${firstCode != prevFirstCode ?`P `:``}${formatAmount(credit.toString())}`, pageWidth-245, y, {align: 'right'});
        totalCreditAmount += parseFloat(credit);
        if ( firstCode != revenuesAndExpenses[i+1].account_number.toString()[0] ) {

          // total_revenue_amount
          total_revenue_amount = `P ${formatAmount(totalCreditAmount.toString())}`;
          
          doc.text(`P ${formatAmount(totalCreditAmount.toString())}`, pageWidth-65, y, {align: 'right'});
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
    total_profit_amount = (profitOrLoss > 0 ?`P ${formatAmount(Math.abs(profitOrLoss).toString())}` : `P 0.00`);

    doc.setFont('courier', 'normal', 'bold');
    doc.setFontSize(12);
    doc.text(`${(profitOrLoss >= 0)?`Profit`:`Loss`}`, 50, y);
    doc.setFont('courier', 'normal', 'normal');

    doc.text(`P ${formatAmount(Math.abs(profitOrLoss).toString())}`, pageWidth-65, y, {align: 'right'});
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
    if ( item.account_number >= 301 && item.account_number <= 399 ) {
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
    doc.text(`${formatAmount(Math.abs(profitOrLoss).toString())}`, pageWidth-245, y, {align: 'right'});
    doc.text(`${formatAmount(Math.abs(profitOrLoss).toString())}`, pageWidth-65, y, {align: 'right'});
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
  doc.text(`${formatAmount(Math.abs(total).toString())}`, pageWidth-65, y, {align: 'right'});
      
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
    doc.text(`${formatAmount(Math.abs(profitOrLoss).toString())}`, pageWidth-245, y, {align: 'right'});
    less = Math.abs(profitOrLoss) + parseFloat(debit.replace(',',''));
    doc.text(`(-) ${formatAmount(Math.abs(less).toString())}`, pageWidth-65, y, {align: 'right'});
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
  doc.text(`P ${formatAmount(total_capital.toString())}`, pageWidth-65, y, {align: 'right'});
   
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
    if (item.account_number >= 101 && item.account_number <= 199) assets.push(item);
    else if (item.account_number >= 601 && item.account_number <= 699) contra_assets.push(item);
    else if (item.account_number >= 201 && item.account_number <= 299) liabilities.push(item);
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
          doc.text(`${total_current_assets == 0 ?`P `:``}${formatAmount(debit.toString())}`, pageWidth-245, y, {align: 'right'});
          total_current_assets += parseFloat(debit);
        } else {
          doc.text(`${total_current_assets == 0 ?`P `:``}${formatAmount(credit.toString())}`, pageWidth-245, y, {align: 'right'});
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
      doc.text(`P ${formatAmount(Math.abs(total_current_assets).toString())}`, pageWidth-65, y, {align: 'right'});
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
        }${formatAmount(debit.toString())}`, pageWidth-245, y, {align: 'right'});
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
         }${formatAmount(credit.toString())}`, pageWidth-245, y, {align: 'right'});
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
    doc.text(`${total_current_assets == 0 ?`P `:``}${formatAmount(Math.abs(total_non_current_assets).toString())}`, pageWidth-65, y, {align: 'right'});
  }
 }

  // Total assets
  y += 25;
  leftHeight -= 25 + (16 * 1);
  doc.setFont('courier', 'normal', 'normal');
  doc.text('Total Assets', 50, y);
  if ( total_current_assets != 0 || total_non_current_assets != 0 ) doc.line(pageWidth-230, y-15, pageWidth-65, y-15);
  doc.text(`P ${formatAmount(Math.abs(total_current_assets+total_non_current_assets).toString())}`, pageWidth-65, y, {align: 'right'});
  doc.line(pageWidth-230, y+5, pageWidth-65, y+5);
  doc.line(pageWidth-230, y+10, pageWidth-65, y+10);

  // total_asset_amount
  total_asset_amount = `P ${formatAmount(Math.abs(total_current_assets+total_non_current_assets).toString())}`;

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
          doc.text(`${total_liabilities == 0 ?`P `:``}${formatAmount(debit.toString())}`, pageWidth-245, y, {align: 'right'});
          total_liabilities += parseFloat(debit);
        } else {
          doc.text(`${total_liabilities == 0 ?`P `:``}${formatAmount(credit.toString())}`, pageWidth-245, y, {align: 'right'});
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
      doc.text(`P ${formatAmount(Math.abs(total_liabilities).toString())}`, pageWidth-65, y, {align: 'right'});
    }
  }

  // Ending capital
  y += 35;
  leftHeight -= 35 + (16 * 1);
  doc.setFont('courier', 'normal', 'normal');
  doc.text(ending_capital_title, 50, y);
  doc.text(`${total_liabilities == 0 ?`P `:``}${formatAmount(Math.abs(total_capital).toString())}`, pageWidth-65, y, {align: 'right'});
  
  // Total liabilities & equity
  y += 25;
  leftHeight -= 25 + (16 * 1);
  doc.setFont('courier', 'normal', 'normal');
  doc.text('Total Liabilities & Owner`s Equity', 50, y);

  doc.line(pageWidth-230, y-15, pageWidth-65, y-15);
  doc.text(`P ${formatAmount(Math.abs(total_liabilities+total_capital).toString())}`, pageWidth-65, y, {align: 'right'});
  doc.line(pageWidth-230, y+5, pageWidth-65, y+5);
  doc.line(pageWidth-230, y+10, pageWidth-65, y+10);


  total_liability_amount = `P ${formatAmount(Math.abs(total_liabilities).toString())}`;
  total_equity_amount = `P ${formatAmount(Math.abs(total_capital).toString())}`;


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


