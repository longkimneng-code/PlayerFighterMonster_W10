import {useState} from "react";
import "../index.css";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random values in the range {min, max}
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Create an attack log
function createLogAttack(isHero, damage) {
  return {
    isHero: isHero,
    isDamage: true,
    text: ` takes ${damage} damages`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isHero: true,
    isDamage: false,
    text: ` heal ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------
  const [heroHealth, setHeroHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [logs, setLogs] = useState([]);
  const [GameOver, setGameOver] = useState(false);
  const [count, setCount] = useState(0);

  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  function Attack(){
    const heroDmg = getRandomValue(5,12);
    const monsterDmg = getRandomValue(5,12);

    if(heroHealth - monsterDmg < 0){
      setHeroHealth(0);
      setMonsterHealth(prev => prev - heroDmg);
    }else if(monsterHealth - heroDmg < 0){
      setMonsterHealth(0);
      setHeroHealth(prev => prev - monsterDmg);
    }else {
      setHeroHealth(prev => prev - heroDmg);
      setMonsterHealth(prev => prev - monsterDmg);

    }
    

    setLogs(prev => [
      createLogAttack(true, heroDmg),
      createLogAttack(false, monsterDmg),
      ...prev,
    ]);
    setCount(prev => prev + 1);

  }

  function SpecialAttack(){
      if(count != 3) return;
      const heroDmg = getRandomValue(8,25);
      const monsterDmg = getRandomValue(8,25);

      setHeroHealth(prev => prev - heroDmg);
      setMonsterHealth(prev => prev - monsterDmg);
      setLogs(prev => [
        createLogAttack(true, heroDmg),
        createLogAttack(false, monsterDmg),
        ...prev,
      ]);
      setCount(0);

  }

    function Heal(){
      const heroHeal = getRandomValue(8,15);
      const monsterDmg = getRandomValue(5,12);
      if (heroHealth == 100){
        return(
          setHeroHealth(prev => prev - monsterDmg),
          setLogs(prev => [
            createLogAttack(true, monsterDmg),
            ...prev
          ]),
          setCount(prev => prev + 1)
        )    
      }
      if (heroHealth + heroHeal > 100){
        setHeroHealth(100);
      } else {
        setHeroHealth(prev => prev + heroHeal);
      }
      setHeroHealth(prev => prev - monsterDmg);

      setLogs(prev => [
        createLogHeal(heroHeal),
        createLogAttack(true, monsterDmg),
        ...prev
      ])
      
      setCount(prev => prev + 1);
    }

    function killSelf(){
      setHeroHealth(0);
    }
  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  function renderGameOver() {
    if (GameOver) {
      return null;
    }
    if (heroHealth <= 0 && monsterHealth <= 0) {
    setGameOver(true);
  }
    return (
      <section className="container">
        <h2>Game Over</h2>
        <h3>{heroHealth == 0 ? "Monster has won!" : "Hero has won!"}</h3>
        <button onClick={() => window.location.reload()}>New Game</button>
      </section>
    );
  }



  // ----------------------------------------------------------------------------------------------------------
  // MAIN  TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return <>
    <div>
          <section  className="container">
            <h2>Hero Health:</h2>
            <div className="healthbar"> <div className="healthbar__value" style={{width: `${heroHealth}%` }}>{heroHealth}</div></div>
          </section>
          <section  className="container">
            <h2>Monster Health:</h2>
            <div className="healthbar"><div className="healthbar__value" style={{ width: `${monsterHealth}%` }}>{monsterHealth}</div></div>
          </section>

           {
            (heroHealth > 0 && monsterHealth>0) ? 
            <section id="controls">
              <button onClick={Attack}>Attack</button>
              <button disabled={count < 3} onClick={SpecialAttack}>Special Attack</button>
              <button onClick={Heal}>Heal</button>
              <button onClick={killSelf}>Kill Your Self</button>
            </section> : renderGameOver()
           }

          <section id="log" className="container">
            <h2>Battle logs</h2>
            <ul >
              {logs.map((log, index) => (
                <li key={index} >
                  <span className={log.isHero ? "log--hero" : "log--monster"}>
                    {log.isHero ? "hero" : "Monster"}
                  </span>
                  <span className={log.isDamage ? "log--damage" : "log--heal"}>
                    {log.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>
    </div>
    </>;
}

export default Game;
