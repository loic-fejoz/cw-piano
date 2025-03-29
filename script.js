document.addEventListener('DOMContentLoaded', () => {
    const keyboardContainer = document.getElementById('keyboard');
    const speedInput = document.getElementById('speed-input');
    const scoreDisplay = document.getElementById('score');
    const messageInput = document.getElementById('message-input');
    let score = 0;
    let audioContext;
    let oscillator;
    let gainNode;
    let index = 0;
    let track = ['.'];
    let speed = 15; // Default speed in wpm

    // Declare convertButton
    const convertButton = document.getElementById('convert-button');

    // Define the Morse Code keys and their corresponding frequencies
    const morseKeys = [
        { key: 'A', frequency: 700 },
        // Add more keys as needed
    ];

    // Initialize the audio context, oscillator, and gain node
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (!oscillator) {
            oscillator = audioContext.createOscillator();
            oscillator.type = 'sine';
        }
        if (!gainNode) {
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            oscillator.connect(gainNode);
        }
        oscillator.start(); // Start the oscillator at the end of initAudio
    }

    // Create the keyboard
    morseKeys.forEach(key => {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.textContent = key.key;
        keyElement.addEventListener('mousedown', () => playTone(key.frequency));
        keyElement.addEventListener('mouseup', () => stopTone());
        keyboardContainer.appendChild(keyElement);
    });

    // Function to play a tone
    function playTone(frequency) {
        if (!audioContext || !oscillator || !gainNode) {
            initAudio();
        }
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Set gain to 1 (full volume)
    }

    // Function to stop the tone
    function stopTone() {
        if (oscillator && gainNode) {
            gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Set gain to 0 (mute)
        }
    }

    // Update the score display
    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Function to generate a random tile based on the track parameter
    function generateTile(trackElt) {
        const dit_duration_in_ms = 50000 / (60 * speed);
        const tileTypes = { '.': 'dot', '-': 'dash', '_': 'space' };

        const current = track[index];
        index = (index + 1) % track.length;
        tileType = tileTypes[current];

        const tileDuration = (tileType === 'dot' || tileType === 'space') ? 1 : 3;

        const tileElement = document.createElement('div');
        tileElement.classList.add(`tile`);
        trackElt.prepend(tileElement);

        setTimeout(() => {
            tileElement.classList.add(tileType, tileType + '-' + speed.toString() + 'wpm');
        }, 10); // Small delay to ensure the element is in the DOM

        setTimeout(() => {
            generateTile(trackElt);
        }, tileDuration * dit_duration_in_ms); // Generate a new tile once the last one has fully grown. 

        // Ensure the trackElt only contains the latest 10 tiles
        while (trackElt.children.length > 10) {
            if (trackElt.children.length > 10) {
                trackElt.removeChild(trackElt.lastChild);
            }
        }
    }

    // Default speed from URL if any
    let speedFromUrl = new URLSearchParams(window.location.search).get('speed');
    if (speedFromUrl) {
        speed = parseInt(speedFromUrl, 10);
    }

    console.log(`Speed set to ${speed} wpm`);
    speedInput.value = speed; // Update the input element with the new speed value
    updateDitDuration();

    // Symbols to play if any
    // Handle message query parameter conversion to track if any. Convert to track if present.
    if (window.location.search.includes('?')) {
        const urlParams = new URLSearchParams(window.location.search);
        track = urlParams.get('track');
    } else {
        console.warn('No track parameter found in the URL.');
        track = '-___.___._-_______-___.___._-______';
    }

    // Function to start the tile generation
    function startTileGeneration() {
        index = 0;
        const validChars = ['.', '-', '_'];
        track = track.split('');
        if (!track.every(char => validChars.includes(char))) {
            console.error('Invalid track parameter. Must be a string of exactly 3 characters, each being one of ".", "-", or "_"');
            return;
        }

        const trackElt = document.getElementById('track');
        generateTile(trackElt);
    }

    // Update the speed when the input changes
    speedInput.addEventListener('input', () => {
        speed = parseInt(speedInput.value, 10);
        console.log(`Speed set to ${speed} wpm`);
        updateDitDuration();
    });

    function updateDitDuration() {
        const dit_duration_in_ms = 50000 / (60 * speed);
        document.querySelectorAll('.dot').forEach(tile => tile.style.transitionDuration = `${dit_duration_in_ms}ms`);
        document.querySelectorAll('.dash').forEach(tile => tile.style.transitionDuration = `${dit_duration_in_ms * 3}ms`);
        document.querySelectorAll('.space').forEach(tile => tile.style.transitionDuration = `${dit_duration_in_ms}ms`);
    }


    // Convert a text message to CW track
    const asciiToMorseMap = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
        'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
        'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
        'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
        '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': ''
    };

    function convertMessageToCW(msg) {
        const words = msg.trim().split(' ');
        let encoded = '';
        words.forEach(word => {
            word.split('').forEach(char => {
                asciiToMorseMap[char.toUpperCase()].split('').forEach(s => {
                    encoded += s + '_';
                });
                encoded += '__'; // Add 3 unit space, but 1 was already put after character
            });
            encoded += '_______'; // Add a space between words
        });
        return encoded;
    }

    // Handle form submission
    convertButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message) {
            track = convertMessageToCW(message);
            console.log('New track: ' + track);
            startTileGeneration();
        } else {
            alert('Please enter a message to convert.');
        }
    });

    // Start generating tiles on button click
    document.getElementById('start-button').addEventListener('click', startTileGeneration);
});
