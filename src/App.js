import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import './App.css';
import IncomeCard from './components/IncomeCard/IncomeCard';
import Expense from './components/Expense/Expense';

function App() {
  const [incomes, setIncomes] = useState([]); 
  const [lastDate, setLastDate] = useState(dayjs(new Date()).format('DD MMMM YYYY'));
  const [incomeName, setIncomeName] = useState("");
  const [incomeValue, setIncomeValue] = useState(0);
  const [incomeMonth, setIncomeMonth] = useState(null);
  const [dirty, setDirty] = useState(true);
  const currency = 'USD';

  function addIncome(e) {
    e.preventDefault();
    if (incomeName.trim().length && incomeValue > 0 && incomeMonth) {
      setIncomes(prev => {
        const income = { id: "income-" + prev.length + 1, name: incomeName.trim(), value: parseFloat(incomeValue), date: incomeMonth, expenses: [] };
        setIncomeName("");
        setIncomeValue(0);
        return ([...prev, income])
      });
    } else {
      alert('Please fill the income name and value!');
    }
  }

  function addExpense(id, name, value, expId) {
    setIncomes(prev => {
      let continueProcess = true;
      const foundIncome = prev.find(inc => inc.id === id);
      const totExpenses = foundIncome ? foundIncome.expenses.map(exp => exp.value).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) : 0;
      if (parseFloat(value) + totExpenses > parseFloat(foundIncome.value)) {
        continueProcess = window.confirm('The entered amount makes expenses higher than income! Do you wish to proceed anyways?')
      }

      if (continueProcess) {
        const expense = { name, value, id: expId, milestones: [] };
        return prev.map(incom => {
          if (incom.id === id) return {...incom, expenses: [...incom.expenses, expense]};
          else return incom;
        });
      } else return prev;
    });
  }

  function addMilestone(id, name, value, expId, incomeId) {
    setIncomes(prev => {
      const milestone = { name, value, id, date: dayjs(new Date()).format('YYYY-MM-DD') };
      return prev.map(incom => {
        if (incom.id === incomeId) return {
            ...incom,
            expenses: incom.expenses.map(exp => 
              (exp.id === expId)?
              {...exp, milestones: [...exp.milestones, milestone]}
              : exp
            ),
          };
        else return incom;
      });
    });
  }

  function deleteOne(id) {
    if (id) {
      const sol = window.confirm('Are you sure you want to remove income?');
      if (sol) setIncomes(prev => prev.filter(incom => incom.id !== id));
    }
  }

  function deleteExpense(id, expId) {
    const sol = window.confirm('Are you sure you want to remove expense?');
    if (sol) setIncomes(prev => prev.map(incom => {
      if (incom.id === id) {
        const toRemove = incom.expenses.find(m => m.id === expId);

        if (toRemove.milestones.length > 0) {
          alert('You can not delete an expense with existing milestones');
          return incom;
        } else {
          const expIncom = {
            ...incom,
            expenses: incom.expenses.filter(exp => exp.id !== expId),
          };
          return expIncom;
        }
      } else return incom;
    }));
  }

  function deleteMilestone(incomeId, expId, id) {
    if (id && expId && incomeId) {
      const sol = window.confirm('Are you sure you want to remove Milestone?');
      if (sol) setIncomes(prev => prev.map(incom => {
        if (incom.id === incomeId) {
          return {
            ...incom,
            expenses: incom.expenses.map(exp => {
              if (exp.id === expId){
                const outExp = {
                  ...exp,
                  milestones: exp.milestones.filter(mil => mil.id !== id)
                };
                console.log(exp, outExp);
                return outExp;
              }
              else return exp;
            }),
          };
        } else return incom;
      }));
    }
  }

  function persistData() {
    localStorage.setItem("Incomes", JSON.stringify(incomes));
    setDirty(false);
  }
  
  function retrieveData() {
    setDirty(true);
    let prevIncomes = localStorage.getItem("Incomes");
    if (prevIncomes) setIncomes(JSON.parse(prevIncomes));
  }

  function completeExpense(incomeId, expId) {
    if (expId && incomeId) {
      const sol = window.confirm('Are you sure you want to change expense completion?');
      if (sol) setIncomes(prev => prev.map(incom => {
        if (incom.id === incomeId) {
          return {
            ...incom,
            expenses: incom.expenses.map(exp => {
              if (exp.id === expId){
                const outExp = {
                  ...exp,
                  isComplete: !exp.isComplete,
                };
                return outExp;
              }
              else return exp;
            }),
          };
        } else return incom;
      }));
    }
  }

  useEffect(() => {
    incomes.sort((a, b) => a.date > b.date);
    incomes && setLastDate(incomes[incomes.length - 1]?.date);
  }, [incomes]);
  
  useEffect(function () {
    window.onbeforeunload = function () {
      if (dirty) return "Have you saved the changes?";
    }
  }, [dirty, incomes]);

  useEffect(function () {
    retrieveData();
  }, []);

  return (
    <div className="container">
      <div className="incomecard__summary">
        <h1>Budgeting app</h1>
        <div>
          {/* <button className='add' onClick={retrieveData}>Sync</button> */}
          <button style={{marginLeft: '6px'}} onClick={persistData}>Save</button>
        </div>
      </div>
      <form onSubmit={addIncome}>
        <input type="text" placeholder='Income Name' value={incomeName} onChange={(e) => setIncomeName(e.target.value)} />
        <input type="text" placeholder='Income Amount' value={incomeValue} onChange={(e) => setIncomeValue(e.target.value.trim())} />
        <input type="date" placeholder='Income Month' value={incomeMonth} onChange={(e) => setIncomeMonth(e.target.value)} />
        <button type='submit'>Add expense</button>
      </form>

      <div className="incomecard__wrapper">
        {incomes.map(income => <IncomeCard {...income} completeExpense={completeExpense} addMilestone={addMilestone} addExpense={addExpense} deleteOne={deleteOne} deleteExpense={deleteExpense} deleteMilestone={deleteMilestone} />)}
      </div>

      <div className="total-summary">
        <ul>
          <li><b>Total Income: </b><span className='value' style={{color: 'green'}}>{incomes.map(inc => parseFloat(inc.value)).reduce((a, b) => a + b, 0).toLocaleString('en-US', {style: 'currency', currency})}</span></li>
          <li><b>Total Expenses (Planned): </b><span className='value' style={{color: 'crimson'}}>{incomes.map(inc => parseFloat(inc.expenses.map(exp => parseFloat(exp.value)).reduce((a, b) => a + b, 0))).reduce((a, b) => a + b, 0).toLocaleString('en-US', {style: 'currency', currency})}</span></li>
          <li><b>Total Income (Remaining until {dayjs(lastDate).format("MMMM YYYY")}): </b><span className='value' style={{color: 'green'}}>{incomes.map(inc => parseFloat(inc.value) - parseFloat(inc.expenses.map(exp => parseFloat(exp.value)).reduce((a, b) => a + b, 0))).reduce((a, b) => a + b, 0).toLocaleString('en-US', {style: 'currency', currency})}</span></li>
          {/* <li><b>Total Expenses (Completed): </b><span className='value'></span></li> */}
        </ul>
      </div>
    </div>
  );
}

export default App;
