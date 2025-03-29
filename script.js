document.addEventListener('DOMContentLoaded', () => {
    const keyboardContainer = document.getElementById('keyboard');
    const speedInput = document.getElementById('speed-input');
    const scoreDisplay = document.getElementById('score');
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

    // Convert a text message to CW track
    function convertMessageToCW(msg) {
        const words = msg.split(' ');
        let encoded = '';
        words.forEach(word => {
            word.split('').forEach(char => {
                if (char === ' ') {
                    encoded += '_';
                } else {
                    encoded += morseKeys.find(key => key.key.toLowerCase() === char.toLowerCase()).morseCode;
                    encoded += ' ';
                }
            });
            encoded += '_______'; // Add a space between words
        });
        return encoded.trim();
    }

    // Handle form submission
    convertButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message) {
            track = convertMessageToCW(message);
            startTileGeneration();
        } else {
            alert('Please enter a message to convert.');
        }
    });

    // Start generating tiles on button click
    document.getElementById('start-button').addEventListener('click', startTileGeneration);
});
