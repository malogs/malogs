import { useState } from 'react';

function Expense({name, value, milestones, deleteExpense, deleteMilestone, expId, incomId, addMilestone, currency="USD", isComplete, completeExpense}) {
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const [milestoneName, setMilestoneName] = useState("");
  const [milestoneValue, setMilestoneValue] = useState(0);

  function triggerMilestoneForm() {
    setShowMilestoneForm(prev => !prev);
  }

  function handleExpSubmit(e) {
    e.preventDefault(); 
    if (name.trim().length && value > 0) {
      const id = 'milestone-' + milestones.length + 1;
      addMilestone(id, milestoneName, milestoneValue, expId, incomId);
      setMilestoneName("");
      setMilestoneValue(0);
      triggerMilestoneForm();
    } else alert('Please fill the milestone name and value!');
  }
  
  let isCompleted = isComplete;
  const completionCondition = ((parseFloat(value) + (-1 * milestones.map(m => m.value).reduce((a, b) => parseFloat(a) + parseFloat(b), 0))) <= 0);

  // if( completionCondition && !isComplete) {
  //   isCompleted = true;
  //   completeExpense(incomId, expId);
  // }

  return (<>
        <input type="checkbox" name="isComplete" value={isComplete} checked={isComplete} onChange={() => completeExpense(incomId, expId)} />
      <div className="incomecard__summary">
        <div className={'incomecard__summary-income' + (isCompleted ? ' completed' : '')}>
          <span className="name">{name}:</span>
          <span className="value">{(parseFloat(value) + (showMilestones ? (-1 * milestones.map(m => m.value).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)) : 0) ).toLocaleString('en-US', {style: 'currency', currency})}</span>
          {milestones.length > 0 && !showMilestones && 
            <span className='set-milestones'>
              ({
                (-1 * milestones.map(m => m.value)
                  .reduce((a, b) => parseFloat(a) + parseFloat(b), 0))
                  .toLocaleString('en-US', {style: 'currency', currency})
              })
            </span>}
        </div>
        <div className="incomecard__actions-milestone">
          {milestones.length > 0 && <button onClick={() => setShowMilestones(prev => !prev)}>{showMilestones ? 'Hide' : 'Show'} Millestones</button>}
          {!isCompleted && !completionCondition && <button className='add' onClick={triggerMilestoneForm}>{showMilestoneForm ? 'Close ' : ''}Add Millestone</button>}
          {milestones.length < 1 && <button className='delete' onClick={() => deleteExpense(incomId, expId)}>Delete Expense</button>}
        </div>
      </div>

      {showMilestoneForm && <form onSubmit={handleExpSubmit}>
        <input type="text" placeholder='Milestone Name' value={milestoneName} onChange={(e) => setMilestoneName(e.target.value)} />
        <input type="text" placeholder='Milestone Amount' value={milestoneValue} onChange={(e) => setMilestoneValue(e.target.value.trim())} />
        <button type='submit'>Submit Milestone</button>
      </form>}

      <div className={showMilestones && "incomecard__expenses-milestones-wrapper"}>
        {/* {milestones.length && showMilestones ? <h4 className='incomecard__expenses-milestones-header'>Milestones</h4> : ""} */}
        <ul className='incomecard__expenses-milestones'>
          {showMilestones && milestones.map(exp => <li className='incomecard__summary'>
            <div><span className="name">{exp.name}: </span><span className="value">{parseFloat(exp.value).toLocaleString('en-US', {style: 'currency', currency})}</span></div>
            <div className="actions-milestone">
              <button className='delete' onClick={() => deleteMilestone(incomId, expId, exp.id)}>Delete Milestone</button>
            </div>
          </li>)}
        </ul>
      </div>
    </>);
}

export default Expense