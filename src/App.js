import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { click } from '@testing-library/user-event/dist/click';
import { Routes, Route } from 'react-router-dom';
import ImageSection from './jsxEntries/image-section/image-section';
import CheckoutForm from './stripe/v2/checkoutform';
import Payment from './stripe/v2/payment';
import Completion from './stripe/v2/completion';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DualBoard />} />
        <Route path="/is" element={<ImageSection />} />
        <Route path="/dual" element={<DualBoard />} />
        <Route path="/eae" element={<EaEBoard />} />
        <Route path="/mine" element={<MiniMineSweeper />} />
        <Route path="/pay" element={<Payment />} />
        <Route path='/completion' element={<Completion />} />
      </Routes>
    </div>
  );
}

function DualBoard()
{
  return(
    <div>
      <div className='leftside'>
        <h2>E-A-E board</h2>
        <EaEBoard />
      </div>
      <div className='rightside'>
        <h2>Mini Minesweeper board</h2>
        <MiniMineSweeper />
      </div>
    </div>
  );
}

function Tile({value , styleClass, onButtonClick})
{
  return <button className={styleClass} onClick={onButtonClick}>{value}</button>
}

function EaEBoard()
{
  const [tileStates,setTileStates] = useState(Array(9).fill(null));
  const [stylestates,setStyleStates] = useState(Array(9).fill("eclass"));
  const [isE,setIsE] = useState(true)

  function handleClick(i) {
    const tiles = tileStates.slice();
    const tileStyles = stylestates.slice();
    if(tiles[i]!=null || calculateWinner(tiles))
    {
      return;
    }
    var v = "E";
    var s = "eclass";
    if(!isE)
    {
      v = "A";
      s = "aclass";
    }
    tiles[i] = v;
    tileStyles[i] = s;
    setIsE(!isE)
    setTileStates(tiles);
    setStyleStates(tileStyles);
  }

  const winner = calculateWinner(tileStates);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Current player: " + (isE ? "E" : "A");
  }

  function resetGame()
  {
      setIsE(true);
      setTileStates(Array(9).fill(null));
      setStyleStates(Array(9).fill("eclass"));
  }

  return (
    <div>
      <div className="standard-divider">{status}</div>
      <div className='standard-divider'>
        <Button onClick={resetGame}>Reset game</Button>
      </div>
      <div className='defaultBoard standard-divider'>
        <div className='board-row'>
          <Tile value={tileStates[0]} styleClass={stylestates[0]} onButtonClick={()=> handleClick(0)}/>
          <Tile value={tileStates[1]} styleClass={stylestates[1]} onButtonClick={()=> handleClick(1)}/>
          <Tile value={tileStates[2]} styleClass={stylestates[2]} onButtonClick={()=> handleClick(2)}/>
        </div>

        <div className='board-row'>
          <Tile value={tileStates[3]} styleClass={stylestates[3]} onButtonClick={()=> handleClick(3)}/>
          <Tile value={tileStates[4]} styleClass={stylestates[4]} onButtonClick={()=> handleClick(4)}/>
          <Tile value={tileStates[5]} styleClass={stylestates[5]} onButtonClick={()=> handleClick(5)}/>
        </div>

        <div className='board-row'>
          <Tile value={tileStates[6]} styleClass={stylestates[6]} onButtonClick={()=> handleClick(6)}/>
          <Tile value={tileStates[7]} styleClass={stylestates[7]} onButtonClick={()=> handleClick(7)}/>
          <Tile value={tileStates[8]} styleClass={stylestates[8]} onButtonClick={()=> handleClick(8)}/>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(tiles) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      return tiles[a];
    }
  }
  return null;
}

function MineTile({value , styleClass, onButtonClick})
{
  return <button className={styleClass} onClick={onButtonClick}>{value}</button>
}

export function MiniMineSweeper()
{
  var isGameOver = false;
  const weak_point_count = 4; 
  const [spaces, setSpaces] = useState(generateNewGame());

  function generateNewGame()
  {
    console.log("Creating new game");
    var gs = Array(25).fill({show:" ", actual: 0, sytleExpression: 'uc', clicked : false});
    var weakpoints =[];
    var c=0;
    isGameOver = false;
    for(c=0;c<weak_point_count;c++)
    {
      var val = Math.floor(Math.random() * 25);
      console.log("RNG :"+val);
      weakpoints.push(val);
    }
    
    for(var wp in weakpoints)
    {
       gs[wp] = { show: " ", actual: 1};
    }
    
    for(var c=0;c<gs.length;c++)
    {
      console.log("IND : "+c);
      console.log("ST : "+gs[c].sytleExpression);
      console.log("V : "+gs[c].actual);
      console.log("CL : "+gs[c].clicked);
    }

    console.log("Game state");
    console.log(weakpoints);

    return gs;
  }

  function newGame()
  {
    setSpaces(generateNewGame());
  }

  function clickTing(i)
  {
    console.log("Clicked space : "+i);
    var spaceStateNew = spaces.slice()
    var space = spaceStateNew[i]
    
    if(space.clicked || isGameOver)
    {
      console.log("RETURNING STATE")
      return;
    }
    else
    {
      console.log("SET CLICKED")
      space.clicked = true;
    }

    if(space.actual == 1)
    {
      //game over
      console.log("MINE TRIP")
      space.sytleExpression = 'dac';
      isGameOver = true;
    }
    else
    {
      console.log("SAFE CLICK")
      space.sytleExpression = 'dic';
    }

    spaceStateNew[i] = space;
    setSpaces(spaceStateNew);
  }

  function getGameState(spaces)
  {
     if(isGameOver)
     {
      return false;
     }
     else
     {
      var clickedCount = 0;
      for(var c=0;c<spaces.length;c++)
      {
        if(spaces[c].clicked==true)
          {
            clickedCount++;
          }
      }
      if(clickedCount == 25)
      {
        return false;
      }
      else
      {
        return true;
      }
     }
  }

  var message = "";
  var state = getGameState(spaces);
  if(state)
  {
    message = "Playing";
  }
  else
  {
    message = "Game Over";
  }

  return (
    <div>
        <div>
          <div>State : {message}</div>
          <button onClick={newGame}>New Game</button>
        </div>

        <div className='board-row'>
          <MineTile value={spaces[0].show} className={spaces[0].sytleExpression} onClick={()=> clickTing(0)}/>
          <MineTile value={spaces[1].show} className={spaces[1].sytleExpression} onClick={()=> clickTing(1)}/>
          <MineTile value={spaces[2].show} className={spaces[2].sytleExpression} onClick={()=> clickTing(2)}/>
          <MineTile value={spaces[3].show} className={spaces[3].sytleExpression} onClick={()=> clickTing(3)}/>
          <MineTile value={spaces[4].show} className={spaces[4].sytleExpression} onClick={()=> clickTing(4)}/>
        </div>

        <div className='board-row'>
          <MineTile value={spaces[5].show} className={spaces[5].sytleExpression} onClick={()=> clickTing(5)}/>
          <MineTile value={spaces[6].show} className={spaces[6].sytleExpression} onClick={()=> clickTing(6)}/>
          <MineTile value={spaces[7].show} className={spaces[7].sytleExpression} onClick={()=> clickTing(7)}/>
          <MineTile value={spaces[8].show} className={spaces[8].sytleExpression} onClick={()=> clickTing(8)}/>
          <MineTile value={spaces[9].show} className={spaces[9].sytleExpression} onClick={()=> clickTing(9)}/>
        </div>

        <div className='board-row'>
          <MineTile value={spaces[10].show} className={spaces[10].sytleExpression} onClick={()=> clickTing(10)}/>
          <MineTile value={spaces[11].show} className={spaces[11].sytleExpression} onClick={()=> clickTing(11)}/>
          <MineTile value={spaces[12].show} className={spaces[12].sytleExpression} onClick={()=> clickTing(12)}/>
          <MineTile value={spaces[13].show} className={spaces[13].sytleExpression} onClick={()=> clickTing(13)}/>
          <MineTile value={spaces[14].show} className={spaces[14].sytleExpression} onClick={()=> clickTing(14)}/>
        </div>

        <div className='board-row'>
          <MineTile value={spaces[15].show} className={spaces[15].sytleExpression} onClick={()=> clickTing(15)}/>
          <MineTile value={spaces[16].show} className={spaces[16].sytleExpression} onClick={()=> clickTing(16)}/>
          <MineTile value={spaces[17].show} className={spaces[17].sytleExpression} onClick={()=> clickTing(17)}/>
          <MineTile value={spaces[18].show} className={spaces[18].sytleExpression} onClick={()=> clickTing(18)}/>
          <MineTile value={spaces[19].show} className={spaces[19].sytleExpression} onClick={()=> clickTing(19)}/>
        </div>

        <div className='board-row'>
          <MineTile value={spaces[20].show} className={spaces[20].sytleExpression} onClick={()=> clickTing(20)}/>
          <MineTile value={spaces[21].show} className={spaces[21].sytleExpression} onClick={()=> clickTing(21)}/>
          <MineTile value={spaces[22].show} className={spaces[22].sytleExpression} onClick={()=> clickTing(22)}/>
          <MineTile value={spaces[23].show} className={spaces[23].sytleExpression} onClick={()=> clickTing(23)}/>
          <MineTile value={spaces[24].show} className={spaces[24].sytleExpression} onClick={()=> clickTing(24)}/>
        </div>
    </div>
  );
}

export default App;
