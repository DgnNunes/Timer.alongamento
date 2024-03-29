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
      console.log('O timer está ativo. Aguarde até que o timer seja concluído para exibir o exercício de alongamento.');
      return;
    }
  
    let type = 'stretching';
    
    fetch('https://api.api-ninjas.com/v1/exercises?type=' + type, {
      method: 'GET',
      headers: { 'X-Api-Key': 'r39tgCKGIcWEgPClOnD1JeiydHJa5Kug2hP41Khp'},
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Erro ao buscar os dados da API');
      }
      return res.json();
    })
    .then((data) => {
      if (data && data.length > 0) {
        const exercise = data[Math.floor(Math.random() * data.length)];
        displayExercise(exercise);
        document.getElementById('completeExerciseBtn').style.display = 'block'; 
      } else {
        console.log('Nenhum exercício retornado pela API.');
        const exerciseContainer = document.getElementById('exercise');
        exerciseContainer.innerHTML = ''; 
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Não há nenhum alongamento disponível no momento. Tente novamente mais tarde.';
        exerciseContainer.appendChild(errorMessage);
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar os dados da API:', error);
      const exerciseContainer = document.getElementById('exercise');
      exerciseContainer.innerHTML = ''; 
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Não foi possível carregar o alongamento. Tente novamente mais tarde.';
      exerciseContainer.appendChild(errorMessage);
    });
  }

  function displayExercise(exercise) {
    const exerciseContainer = document.getElementById('exercise');
    exerciseContainer.innerHTML = ''; 
  
    console.log('Dados do exercício:', exercise); 
  
    if (exercise && exercise.name && exercise.description) {
      const exerciseName = document.createElement('h2');
      exerciseName.textContent = 'Nome: ${exercise.name}';
  
      const exerciseDescription = document.createElement('p');
      exerciseDescription.textContent = 'Descrição: ${exercise.description}';
  
      exerciseContainer.appendChild(exerciseName);
      exerciseContainer.appendChild(exerciseDescription);
    } else {
   
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Os dados do exercício estão incompletos ou inválidos.';
      exerciseContainer.appendChild(errorMessage);
    }
  }
  
function completeExercise() {
  document.getElementById('exercise').innerHTML = ''; 
  document.getElementById('completeExerciseBtn').style.display = 'none'; 
} 




  
