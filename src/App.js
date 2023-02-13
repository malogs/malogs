import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import './App.css';
import IncomeCard from './components/IncomeCard/IncomeCard';

function App() {
  const [incomes, setIncomes] = useState([]); 
  const [incomeName, setIncomeName] = useState("");
  const [incomeValue, setIncomeValue] = useState(0);
  const [incomeMonth, setIncomeMonth] = useState(null);
  const [dirty, setDirty] = useState(true);

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
      const milestone = { name, value, id, date: dayjs(new Date()).format('DD MMMM YYYY') };
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

  useEffect(() => {
    incomes.sort((a, b) => a.date > b.date);
  }, [incomes]);
  
  useEffect(function () {
    window.onbeforeunload = function () {
      if (dirty) return "Have you saved the changes?";
    }
  }, [dirty, incomes])
  return (
    <div className="container">
      <div className="incomecard__summary">
        <h1>Budgeting app</h1>
        <div>
          <button className='add' onClick={retrieveData}>Sync</button>
          <button style={{marginLeft: '6px'}} onClick={persistData}>Save</button>
        </div>
      </div>
      <form onSubmit={addIncome}>
        <input type="text" placeholder='Income Name' value={incomeName} onChange={(e) => setIncomeName(e.target.value)} />
        <input type="text" placeholder='Income Amount' value={incomeValue} onChange={(e) => setIncomeValue(e.target.value.trim())} />
        <input type="date" placeholder='Income Month' value={incomeMonth} onChange={(e) => setIncomeMonth(e.target.value)} />
        <button type='submit'>Add Income</button>
      </form>

      {incomes.map(income => <IncomeCard {...income} addMilestone={addMilestone} addExpense={addExpense} deleteOne={deleteOne} deleteExpense={deleteExpense} deleteMilestone={deleteMilestone} />)}
      
    </div>
  );
}

export default App;
