import React from 'react';
import logo from './logo.svg';
import './App.css';

// {
//    "id":"133hggm555l67k989",
//    "account":"savings",
//    "goals":[
//       {
//          "id":"55jgkgjkrffgj9908",
//          "name":"Rainy Day",
//          "icon":"☔",
//          "currentSavedCents":449821
//       },
//       {
//          "id":"55jgkgjkrffgj3586",
//          "name":"Vacation",
//          "icon":"🌴",
//          "currentSavedCents":16804,
//          "goalTarget":{
//             "amountCents":350000
//          }
//       },
//       {
//          "id":"55jgkgjkrffgj3396",
//          "name":"Tattoo",
//          "icon":"💀",
//          "currentSavedCents":21773,
//          "goalTarget":{
//             "amountCents":30000,
//             "date":"2018-05-01"
//          }
//       }
//    ]
// }

function App() {
  const [account, setAccount] = React.useState(null);
  React.useEffect(() => {
    fetch('http://www.mocky.io/v2/5eb421880e00005000081991', {
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((data) => {
        if (data) {
          return data.json();
        }
      })
      .then((parsedData) => {
        if (parsedData) {
          setAccount(parsedData)
        }
      })
  }, [setAccount]);
  const addGoal = React.useCallback((goal) => {
    setAccount({
      ...account,
      goals: [...account.goals, goal],
    });
  }, [account, setAccount]);
  const shiftGoals = React.useCallback((direction) => {
    const numGoals =  account.goals.length;
    const currGoals = account.goals;
    const topGoal = account.goals[0];
    const bottomGoal = account.goals[numGoals - 1];
    let newGoals;
    if (numGoals === 0 || numGoals === 1) {
      return;
    }
    if (direction === 'up') {
      newGoals = [
        ...currGoals.slice(1),
        topGoal,
      ];
    } else if (direction === 'down') {
      newGoals = [
        bottomGoal,
        ...currGoals.slice(0, numGoals - 1),
      ];
    }
    setAccount({
      ...account,
      goals: newGoals,
    });
  }, [account, setAccount]);

  return (
    <div className="App">
      { account ? <Account account={account} /> : null }
      <button onClick={shiftGoals.bind(this, 'up')}>UP</button>
      <button onClick={shiftGoals.bind(this, 'down')}>DOWN</button>
      <GoalCreateForm addGoal={addGoal} />
    </div>
  );
}

function Account({
  account,
}) {
  return (
    <div>
      <h3>{account.account}</h3>
      {account.goals.map(goal => <Goal goal={goal} key={goal.id} />)}
    </div>
  );
}

function Goal({
  goal,
}) {
  let goalPercentageReached = null;
  if (goal.goalTarget && goal.goalTarget.amountCents) {
    goalPercentageReached = goal.currentSavedCents / goal.goalTarget.amountCents;
    goalPercentageReached *= 100;
    console.log({
      current: goal.currentSavedCents,
      target: goal.goalTarget.amountCents,
      goalPercentageReached,
    })
  }

  return (
    <div>
    <div style={styles.row}>
      <div>
        <p>{goal.name}</p>
        { goal.goalTarget && goal.goalTarget.date ? (
          <p>
            {goal.goalTarget.date}
          </p>
        ) : null}
        <p>${goal.currentSavedCents / 100}</p>
      </div>
      <div>
        <p>{goal.icon}</p>
        { goal.goalTarget ? (
          <p>
            ${goal.goalTarget.amountCents / 100}
          </p>
        ) : null}
      </div>
    </div>
    {goalPercentageReached !== null ? (
        <div style={styles.barContainer}>
          <div style={{ ...styles.bar, width: `${goalPercentageReached}%` }} />
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    border: '1px solid grey',
    padding: '24px'
  },
  barContainer: {
    flex: 1,
    height: '20px',
    background: 'grey',
  },
  bar: {
    height: '20px',
    background: 'blue',
  }
}

function GoalCreateForm({
  addGoal,
}) {
  const [name, setName] = React.useState('');
  const onChange = React.useCallback(e => {
    setName(e.target.value);
  }, [setName]);
  const submit = React.useCallback((e) => {
    e.preventDefault();
    if (!name) {
      return;
    }
    const newGoal = { name };
    addGoal(newGoal);
    setName('');
  }, [name, setName, addGoal]);


  return (
    <form onSubmit={submit}>
      <label>Name:</label>
      <input value={name} onChange={onChange} type="text" />
      <input type="submit" style={{ display: 'none' }} />
    </form>
  )
}

export default App;
















