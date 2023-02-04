import { useState } from 'react';
import './App.css';
import IncomeCard from './components/IncomeCard/IncomeCard';

function App() {
  const [incomes, setIncomes] = useState([]);
  const [incomeName, setIncomeName] = useState("");
  const [incomeValue, setIncomeValue] = useState(0);

  function addIncome(e) {
    e.preventDefault();
    if (incomeName.length && incomeValue > 0) {
      setIncomes(prev => {
        const income = { name: incomeName, value: parseFloat(incomeValue) };
        setIncomeName("");
        setIncomeValue(0);
        return ([...prev, income])
      });
    } else {
      alert('Please fill the income name and value!');
    }
  }

  return (
    <div className="container">
      <h1>Budgeting app</h1>
      <form onSubmit={addIncome}>
        <input type="text" placeholder='Income Name' value={incomeName} onChange={(e) => setIncomeName(e.target.value.trim())} />
        <input type="text" placeholder='Income Amount' value={incomeValue} onChange={(e) => setIncomeValue(e.target.value.trim())} />
        <button type='submit'>Add Income</button>
      </form>

      {incomes.map(income => <IncomeCard {...income} />)}
      
    </div>
  );
}

export default App;
