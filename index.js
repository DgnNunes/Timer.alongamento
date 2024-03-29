let timeLeft;
let timer;
let isRunning = false;

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('stopBtn').addEventListener('click', stopTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);
document.getElementById('testBtn').addEventListener('click', fetchAPI);
document.getElementById('completeExerciseBtn').addEventListener('click', completeExercise);

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    const timerDisplay = document.getElementById('timer');
    const time = timerDisplay.textContent.split(':');
    const minutes = parseInt(time[0], 10);
    const seconds = parseInt(time[1], 10);

    timeLeft = minutes * 60 + seconds;

    timer = setInterval(() => {
      const minutesLeft = Math.floor(timeLeft / 60);
      const secondsLeft = timeLeft % 60;

      timerDisplay.textContent = `${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        timerDisplay.textContent = "Time's up!";
        isRunning = false;
        if (timeLeft % 1500 === 0) {
          fetchAPI();
        }
      } else {
        timeLeft--;
      }
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  stopTimer();
  document.getElementById('timer').textContent = '25:00';
}

  function fetchAPI() {
    
    if (isRunning) {
      console.log('The timer is active. Wait until the timer completes to display the stretching exercise.');
      return;
    }
  
    let type = 'stretching';
    
    fetch('https://api.api-ninjas.com/v1/exercises?type=' + type, {
      method: 'GET',
      headers: { 'X-Api-Key': 'r39tgCKGIcWEgPClOnD1JeiydHJa5Kug2hP41Khp'},
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Error fetching data from API');
      }
      return res.json();
    })
    .then((data) => {
      if (data && data.length > 0) {
        const exercise = data[Math.floor(Math.random() * data.length)];
        displayExercise(exercise);
        document.getElementById('completeExerciseBtn').style.display = 'block'; 
      } else {
        console.log('No exercises returned by the API.');
        const exerciseContainer = document.getElementById('exercise');
        exerciseContainer.innerHTML = ''; 
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'There are no stretches available at this time. Try again later.';
        exerciseContainer.appendChild(errorMessage);
      }
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error);
      const exerciseContainer = document.getElementById('exercise');
      exerciseContainer.innerHTML = ''; 
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Unable to load stretch. Try again later.';
      exerciseContainer.appendChild(errorMessage);
    });
  }

  function displayExercise(exercise) {
    const exerciseContainer = document.getElementById('exercise');
    exerciseContainer.innerHTML = ''; 
  
    console.log('Exercise data:', exercise); 
  
    if (exercise && exercise.name && exercise.instructions) {
      const exerciseName = document.createElement('h2');
      exerciseName.textContent = `Name: ${exercise.name}`; 
  
      const exerciseDescription = document.createElement('p');
      exerciseDescription.textContent = `Description: ${exercise.instructions}`; 
  
      exerciseContainer.appendChild(exerciseName);
      exerciseContainer.appendChild(exerciseDescription);
    } else {
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Exercise data is incomplete or invalid.';
      exerciseContainer.appendChild(errorMessage);
    }
  }
  
function completeExercise() {
  document.getElementById('exercise').innerHTML = ''; 
  document.getElementById('completeExerciseBtn').style.display = 'none'; 
} 

