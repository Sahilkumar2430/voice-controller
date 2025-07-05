const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const output = document.getElementById('output');

let recognition;

if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  alert('Your browser does not support Speech Recognition. Please use Chrome or Edge.');
} else {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    status.textContent = '🎧 Listening... Speak now!';
    startBtn.disabled = true;
  };

  recognition.onend = () => {
    status.textContent = 'Click "Start Listening" and speak commands';
    startBtn.disabled = false;
  };

  recognition.onerror = (event) => {
    status.textContent = 'Error occurred: ' + event.error;
    startBtn.disabled = false;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    output.textContent = `You said: "${transcript}"`;
    handleCommand(transcript);
  };
}

startBtn.addEventListener('click', () => {
  recognition.start();
});

async function handleCommand(command) {
  // Background color commands
  if (command.includes('background red')) {
    document.body.style.background = 'linear-gradient(135deg, #1a1a1a, #b30000)';
    output.textContent += '\nBackground changed to red!';
  } else if (command.includes('background blue')) {
    document.body.style.background = 'linear-gradient(135deg, #1a1a1a, #0033cc)';
    output.textContent += '\nBackground changed to blue!';
  } else if (command.includes('background green')) {
    document.body.style.background = 'linear-gradient(135deg, #1a1a1a, #009933)';
    output.textContent += '\nBackground changed to green!';
  }

  // Alert command
  else if (command.includes('show alert')) {
    alert('🚨 Alert triggered by voice command!');
    output.textContent += '\nAlert shown!';
  }

  // Open google command
  else if (command.includes('open google')) {
    window.open('https://www.google.com', '_blank');
    output.textContent += '\nOpening Google...';
  }

   else if (command.includes('open youtube')) {
    window.open('https://www.youtube.com', '_blank');
    output.textContent += '\nOpening youtube...';
  }

  // Fetch current date command
  else if (command.includes('what date is it') || command.includes('current date')) {
    const now = new Date();
    const dateString = now.toDateString();
    output.textContent += `\nToday's date is: ${dateString}`;
  }

  // Fetch random joke command (from API)
  else if (command.includes('tell me a joke') || command.includes('joke')) {
    output.textContent += '\nFetching a joke...';
    try {
      const res = await fetch('https://official-joke-api.appspot.com/jokes/random');
      const joke = await res.json();
      output.textContent += `\nJoke: ${joke.setup} - ${joke.punchline}`;
    } catch (e) {
      output.textContent += '\nFailed to fetch joke.';
    }
  }

  // Unknown command
  else {
    output.textContent += '\nSorry, command not recognized.';
  }
}
