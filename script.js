let timerInc = 0;
let timerName = null;
let timer = null;
const elTimer = document.getElementById('timer');
const elAddTimer = document.getElementById('addTimer');
const elTimerName = document.getElementById('timerName');

function TimerContainer(name) { // Start timer
  let timerName = name;
  setTimeout(function() {
    const elForm = document.getElementById('form' + incrementor(timerInc));
    const elMin = document.getElementById('minute' + incrementor(timerInc));
    const elSec = document.getElementById('second' + incrementor(timerInc));
    const elIncMin = document.getElementById('incMin' + incrementor(timerInc));
    const elDecMin = document.getElementById('decMin' + incrementor(timerInc));
    const elStart = document.getElementById('start' + incrementor(timerInc));
    const elPause = document.getElementById('pause' + incrementor(timerInc));
    const elReset = document.getElementById('reset' + incrementor(timerInc));
    const elDelete = document.getElementById('delete' + incrementor(timerInc));
    const elStopAlarm = document.getElementById('stopAlarm' + incrementor(timerInc));
    let pause = false;
    let notification = new Audio('./mp3/notify.mp3');
    let timer = new Timer({
      tick: 1,
      ontick: function(sec) {
        elMin.value = Math.floor(sec/60000);
        elSec.value = (Math.round(sec/1000)) - (60 * elMin.value);
      },
      onend: function() {
        elMin.value = 0;
        elSec.value = 0;
        elStopAlarm.setAttribute('style', 'display: inline-block;');
        elForm.setAttribute('style', 'border-color: #dc3545;');
        elPause.setAttribute('style', 'display: none;');
        notification.loop = true;
        notification.play();
      }
    });

    function initTimer() {
      let time = null;
      setTimeout(function() { // Generic debounce..
        timer.stop();
        time = +elMin.value * 60;
        elSec.value =  0;
        timer.start(time);
      },500);
    }

    function showEl(el) {
      el.setAttribute('style', 'display: inline-block;');
    }

    function hideEl(el) {
      el.setAttribute('style', 'display: none;');
    }

    elIncMin.addEventListener('click', function(e) {
      e.preventDefault();
      if (elSec.value > 0 && !pause) {
        initTimer();
      }
      elMin.value = incrementor(elMin.value);
    });
    elDecMin.addEventListener('click', function(e) {
      e.preventDefault();
      if (elSec.value > 0 && !pause) {
        initTimer();
        elMin.value = decrementor(++elMin.value);
        return;
      }
      elMin.value = decrementor(elMin.value);
    });

    elStart.addEventListener('click', function(e) {
      e.preventDefault();
      hideEl(this);
      showEl(elPause);
      elMin.setAttribute('readonly', 'readonly');
      if (pause) {
        timer.start();
        return;
      }
      initTimer();
    });
    elPause.addEventListener('click', function(e) {
      e.preventDefault();
      pause = true;
      hideEl(this);
      showEl(elStart);
      elMin.removeAttribute('readonly');
      timer.pause();
    });
    elReset.addEventListener('click', function(e) {
      e.preventDefault();
      showEl(elStart);
      hideEl(elPause);
      elMin.removeAttribute('readonly');
      pause = false;
      elMin.value = 0;
      elSec.value = 0;
      timer.stop();
    });
    elDelete.addEventListener('click', function(e) {
      e.preventDefault();
      timer.stop();
      notification.pause();
      elForm.remove();
    });
    elStopAlarm.addEventListener('click', function(e) {
      e.preventDefault();
      notification.pause();
      hideEl(this);
      showEl(elStart);
      elMin.removeAttribute('readonly');
      elForm.removeAttribute('style');
    });
  });
  
  let html = '<form id="form' + incrementor(timerInc) + '" class="bg-light form-control mb-4">' +
              '<div class="row">' +
                '<div class="col">' +
                  '<h5><i class="fi-clock"></i> ' + timerName + '</h5>' +
                '</div>' +
                '<div class="col">' +
                  '<i id="delete' + incrementor(timerInc) +'" class="fi-x float-right"></i>' +
                '</div>' +
              '</div>' +
              '<div class="row">' +
                '<div class="col">' +
                  '<div class="form-group">' +
                    '<label class="control-label">Minutes</label>' +
                    '<input type="text" id="minute' + incrementor(timerInc) +'" class="form-control text-right" value="0">' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<button id="incMin' + incrementor(timerInc) +'" class="btn btn-primary btn-sm"><i class="fi-plus"></i></button>&nbsp;' +
                    '<button id="decMin' + incrementor(timerInc) +'" class="btn btn-primary btn-sm"><i class="fi-minus"></i></button>&nbsp;' +
                  '</div>' +
                '</div>' +
                '<div class="col">' +
                  '<div class="form-group">' +
                    '<label class="control-label">Seconds</label>' +
                    '<input type="text" id="second' + incrementor(timerInc) +'" class="form-control text-right" value="0" readonly>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="row mb-10">' +
                '<div class="col-8">' +
                  '<button id="start' + incrementor(timerInc) +'" class="btn btn-sm btn-primary"><i class="fi-play"></i> Start</button>' +
                  '<button id="pause' + incrementor(timerInc) +'" class="btn btn-sm btn-secondary" style="display:none;"><i class="fi-pause"></i> Pause</button>' +
                  '&nbsp;<button id="reset' + incrementor(timerInc) +'" class="btn btn-sm btn-danger"><i class="fi-x"></i> Reset</button>' +
                '</div>' +
                '<div class="col-4">' +
                  '<button id="stopAlarm' + incrementor(timerInc) +'" class="btn btn-sm btn-danger float-right" style="display: none"><i class="fi-stop"></i> Stop Alarm</button>&nbsp;' +
                '</div>' +
              '</div>' +
            '</form>';

  let elTimerWrap = document.createElement('div');
  elTimerWrap.innerHTML = html;

  while(elTimerWrap.firstChild) {
    elTimer.appendChild(elTimerWrap.firstChild);
  }
} // End timer

elAddTimer.addEventListener('click', function(e) {
  e.preventDefault();
  ++timerInc;
  timerName = elTimerName.value;
  timer = new TimerContainer(timerName);
  elTimerName.value = '';
});

function incrementor(inc) {
  return ++inc;
}

function decrementor(dec) {
  if (+dec === 0) {
   return 0;
  }
  return --dec;
}
