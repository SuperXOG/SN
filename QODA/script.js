// Set up Speech Recognition API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

recognition.onstart = () => {
  console.log('Voice recognition started...');
};

recognition.onerror = (event) => {
  alert('Error with voice recognition: ' + event.error);
};

recognition.onresult = (event) => {
  const spokenWord = event.results[0][0].transcript.trim();
  document.getElementById('word-input').value = spokenWord;
  fetchDefinition();
};

// Function to start voice recognition
function startVoiceRecognition() {
  recognition.start();
}

// Function to fetch word definition
async function fetchDefinition() {
  const word = document.getElementById('word-input').value.trim();
  if (word === "") {
    alert("Please enter or speak a word.");
    return;
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();

    if (data.title === "No Definitions Found") {
      document.getElementById('definition-box').style.display = 'none';
      alert("Word not found!");
    } else {
      const wordData = data[0];
      const meaning = wordData.meanings[0];
      
      document.getElementById('word-title').innerText = wordData.word;
      document.getElementById('part-of-speech').innerText = `Part of Speech: ${meaning.partOfSpeech}`;
      document.getElementById('definition').innerText = `Definition: ${meaning.definitions[0].definition}`;
      document.getElementById('example').innerText = meaning.definitions[0].example ? `Example: "${meaning.definitions[0].example}"` : '';

      document.getElementById('definition-box').style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    alert("Error fetching data, please try again later.");
  }
}
