const round = document.getElementById('round');
const reset = document.getElementById('resetBtn');
const clearAll = document.getElementById('deleteBtn');
const titleBox = document.querySelector('.title-box');
const displayTime = document.getElementById('display');
const startPause = document.getElementById('startPause');

let session = JSON.parse(localStorage.getItem('session'));

  if(!session){
    session = {
        s: 0,
        m: 25,
        roundCopl: 0,
        breakTimeM: 5,
        workTimeM:  25,
        isRunning: '',
        curentPhase: 'Work',
      }
  }

let IntervalId;

startPause.addEventListener('click', ()=> {

  if (session.isRunning === 'Completed') {
    resetHalf();
  } else if(session.isRunning === 'running'){
    session.isRunning = 'paused';
    clearInterval(IntervalId);
  } else if(session.isRunning === 'paused'){
    session.isRunning = 'running';
    runCountDown();
  } else{
    session.isRunning = 'ready';
    runCountDown();
  }

  renderInpage();
});

runCountDown();

function runCountDown(){
  clearInterval(IntervalId);

  if(session.isRunning === 'ready' || session.isRunning === 'running'){
    IntervalId = setInterval(()=> {

      if(session.curentPhase === 'Work' && session.isRunning === 'ready'){
        session.m = session.workTimeM;

      } if(session.curentPhase === 'Break' && session.isRunning === 'ready'){
        session.m = session.breakTimeM;
        session.isRunning = 'running';
      }
      
      if(session.s === 0){
        if(session.m === 0 && session.s === 0){

          if(session.curentPhase === 'Work' && session.isRunning === 'running'){
            session.curentPhase = 'Break';
            session.isRunning = 'ready';

          } else{
            session.isRunning = 'Completed';
            session.roundCopl += 1;
            clearInterval(IntervalId);
          }

        } else{
          session.m -= 1;
          session.s = 60;
        }
      }
      
      if(session.m > 0 || session.s > 0){
        session.s--;
      } 

      renderInpage();
    } ,1000);

    session.isRunning = 'running';
  }
}

renderInpage();

function renderInpage(){
  round.innerText = session.roundCopl;

  titleBox.innerText = session.curentPhase;

  displayTime.innerText = `${session.m < 10 ? '0'+session.m : session.m}:${session.s < 10 ? '0'+session.s : session.s}`;

  startPause.style.color = 'var(--text)';
  if(session.isRunning === ''){
    startPause.innerText = 'Start';
  } else if(session.isRunning === 'running'){
    startPause.innerText = 'Pause';
  } else if(session.isRunning === 'paused'){
    startPause.innerText = 'Resume';
  } else if(session.isRunning === 'Completed'){
    startPause.innerText = 'Completed';
    startPause.style.color = 'forestgreen';
  }
  
  localStorage.setItem('session', JSON.stringify(session));
}

reset.addEventListener('click', ()=> {
  resetHalf();
});

clearAll.addEventListener('click', ()=> {
  session.roundCopl = 0;
  resetHalf();
});

function resetHalf(){
  session.m = 25;
  session.s = 0;
  session.breakTimeM = 5;
  session.workTimeM = 25;
  session.isRunning = '';
  session.curentPhase = 'Work';

  clearInterval(IntervalId);
  renderInpage();
}

document.querySelector('.detail').addEventListener('click', ()=> {
  document.querySelector('.info').classList.toggle('hidden');
});