// script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const expenseForm = document.querySelector('#addExpense');
    const saleForm = document.querySelector('#addSale');
    const salesTableBody = document.querySelector('#salesTable tbody');
    
    // Financial Summary Elements
    const totalExpenditureEl = document.querySelector('#totalExpenditure');
    const totalSalesEl = document.querySelector('#totalsale');
    const totalRemainderEl = document.querySelector('#totalRemainder');
    
    // Data Stores
    let expenses = [];
    let sales = [];
    
    // Initialize Chart
    let salesChart;
    initializeChart();
    
    // Event Listeners
    expenseForm.addEventListener('click', addExpense);
    saleForm.addEventListener('click', addSale);
    
    // Load any saved data from localStorage
    loadSavedData();
    updateFinancialSummary();
    
    // Functions
    function addExpense(e) {
      e.preventDefault();
      
      const description = document.querySelector('#expense').value.trim();
      const amount = parseFloat(document.querySelector('#amount').value);
      
      if (!description || isNaN(amount) || amount <= 0) {
        alert('Please enter valid expense details');
        return;
      }
      
      const expense = {
        id: Date.now(),
        description,
        amount,
        date: new Date().toISOString().split('T')[0]
      };
      
      expenses.push(expense);
      saveData();
      updateFinancialSummary();
      clearExpenseForm();
    }
    
    function addSale(e) {
      e.preventDefault();
      
      const date = document.querySelector('#Saledate').value;
      const product = document.querySelector('#products').value;
      const quantity = parseInt(document.querySelector('#quantitySold').value);
      const price = parseFloat(document.querySelector('#price').value);
      
      if (!date || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
        alert('Please enter valid sale details');
        return;
      }
      
      const sale = {
        id: Date.now(),
        date,
        product,
        quantity,
        price,
        total: quantity * price
      };
      
      sales.push(sale);
      saveData();
      updateSalesTable();
      updateFinancialSummary();
      updateChart();
      clearSaleForm();
    }
    
    function updateSalesTable() {
      salesTableBody.innerHTML = '';
      
      sales.forEach(sale => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${formatDate(sale.date)}</td>
          <td>${capitalizeFirstLetter(sale.product)}</td>
          <td>${sale.quantity}</td>
          <td>$${sale.price.toFixed(2)}</td>
          <td>$${sale.total.toFixed(2)}</td>
          <td><button class="delete-btn" data-id="${sale.id}">Delete</button></td>
        `;
        
        salesTableBody.appendChild(row);
      });
      
      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = parseInt(this.getAttribute('data-id'));
          sales = sales.filter(sale => sale.id !== id);
          saveData();
          updateSalesTable();
          updateFinancialSummary();
          updateChart();
        });
      });
    }
    
    function updateFinancialSummary() {
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.total, 0);
      const remainder = totalSalesAmount - totalExpenses;
      
      totalExpenditureEl.textContent = `Total Expenditure: $${totalExpenses.toFixed(2)}`;
      totalSalesEl.textContent = `Total Sales: $${totalSalesAmount.toFixed(2)}`;
      totalRemainderEl.textContent = `Remainder: $${remainder.toFixed(2)}`;
      
      // Color coding for remainder
      if (remainder < 0) {
        totalRemainderEl.style.color = 'red';
      } else {
        totalRemainderEl.style.color = 'green';
      }
    }
    
    function initializeChart() {
      const ctx = document.getElementById('salesChart').getContext('2d');
      
      salesChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Cake', 'Cookies', 'Pastry'],
          datasets: [{
            label: 'Sales by Product',
            data: [0, 0, 0],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    
    function updateChart() {
      const cakeSales = sales.filter(s => s.product === 'cake').reduce((sum, sale) => sum + sale.quantity, 0);
      const cookiesSales = sales.filter(s => s.product === 'cookies').reduce((sum, sale) => sum + sale.quantity, 0);
      const pastrySales = sales.filter(s => s.product === 'pastry').reduce((sum, sale) => sum + sale.quantity, 0);
      
      salesChart.data.datasets[0].data = [cakeSales, cookiesSales, pastrySales];
      salesChart.update();
    }
    
    function saveData() {
      localStorage.setItem('bakeryExpenses', JSON.stringify(expenses));
      localStorage.setItem('bakerySales', JSON.stringify(sales));
    }
    
    function loadSavedData() {
      const savedExpenses = localStorage.getItem('bakeryExpenses');
      const savedSales = localStorage.getItem('bakerySales');
      
      if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
      }
      
      if (savedSales) {
        sales = JSON.parse(savedSales);
        updateSalesTable();
        updateChart();
      }
    }
    
    function clearExpenseForm() {
      document.querySelector('#expense').value = '';
      document.querySelector('#amount').value = '';
    }
    
    function clearSaleForm() {
      document.querySelector('#Saledate').value = '';
      document.querySelector('#quantitySold').value = '';
      document.querySelector('#price').value = '';
    }
    
    // Helper functions
    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  });
