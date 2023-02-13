import { useState } from 'react';
import datejs from 'dayjs';
import Card from '../Card';
import Expense from '../Expense/Expense';
import './styles.scss';

function IncomeCard({id, name, value, date, expenses, addExpense, deleteOne, deleteExpense, deleteMilestone, addMilestone}) {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseValue, setExpenseValue] = useState(0);
  const [currency] = useState("USD");
  // const [currency, setCurrency] = useState("USD");
  // const [currencyValue, setCurrencyValue] = useState("1105");

  function triggerExpenseForm() {
    setShowExpenseForm(prev => !prev);
  }

  function handleExpSubmit(e) {
    e.preventDefault(); 
    if (name.trim().length && value > 0) {
      const expId = 'expense-' + expenses.length + 1;
      addExpense(id, expenseName, expenseValue, expId);
      setExpenseName("");
      setExpenseValue(0);
      triggerExpenseForm();
    } else alert('Please fill the expense name and value!');
  }

  // function convertCurrency(e) {
  //   setCurrency(e.target.value);
  // }

  return (
    <div className={'incomecard'}>
      <Card>
        <span className='date'>{datejs(date).format('MMMM YYYY')}</span>
        <div className="incomecard__summary">
          <div className='incomecard__summary-income'>
            <span className='name'>{name}:</span>
            <span className='value'>{(parseFloat(value) + (showExpenses ? (-1 * expenses.map(m => m.value).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)) : 0)).toLocaleString('en-US', {style: 'currency', currency})}</span>
            {expenses.length > 0 && !showExpenses && <span className='set-expenses'>({(-1 * expenses.map(m => m.value).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)).toLocaleString('en-US', {style: 'currency', currency})})</span>}
          </div>
          <div className="incomecard__actions">
            {/* <input type="text" placeholder='Monthly Rate' value={currencyValue} onChange={(e) => setCurrencyValue(e.target.value.trim())} />
            <select onChange={convertCurrency}>
              <option value={"RWF"} selected>RWF</option>
              <option value={"USD"}>USD</option>
            </select> */}
            {expenses.length > 0 && <button onClick={() => setShowExpenses(prev => !prev)}>{showExpenses ? 'Hide' : 'View'} Expenses</button>}
            <button className='add' onClick={triggerExpenseForm}>{showExpenseForm ? 'Close ' : ''}Add Expense</button>
            {expenses.length < 1 && <button className='delete' onClick={() => deleteOne(id)}>Delete</button>}
          </div>
        </div>

        {showExpenseForm && <form onSubmit={handleExpSubmit}>
          <input type="text" placeholder='Expense Name' value={expenseName} onChange={(e) => setExpenseName(e.target.value)} />
          <input type="text" placeholder='Expense Amount' value={expenseValue} onChange={(e) => setExpenseValue(e.target.value.trim())} />
          <button type='submit'>Add Income</button>
        </form>}

        <div className={showExpenses && "incomecard__expenses-wrapper"}>
          {expenses.length && showExpenses ? <h3 className='incomecard__expenses-header'>Expenses</h3> : ""}
          <ul className='incomecard__expenses'>
            {showExpenses && expenses.map(exp => <li><Expense currency={currency} {...exp} addMilestone={addMilestone} incomId={id} expId={exp.id} deleteExpense={deleteExpense} deleteMilestone={deleteMilestone} /></li>)}
          </ul>
        </div>
      </Card>
    </div> 
  )
}

export default IncomeCard