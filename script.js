document.addEventListener('DOMContentLoaded', () => {
    const keyboardContainer = document.getElementById('keyboard');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let audioContext;
    let oscillator;
    let gainNode;

    // Define the Morse Code keys and their corresponding frequencies
    const morseKeys = [
        { key: 'A', frequency: 800 },
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

    // Function to generate a random tile
    function generateTile(track) {
        const tileTypes = ['dot', 'dash', 'space']; // Add 'space' to the array
        const tileType = tileTypes[Math.floor(Math.random() * tileTypes.length)];
        const tileDuration = (tileType === 'dot' | tileType === 'space') ? 1 : 3; 

        const tileElement = document.createElement('div');
        tileElement.classList.add(`tile`);
        track.prepend(tileElement);

        setTimeout(() => {
            tileElement.classList.add(tileType);
        }, 10); // Small delay to ensure the element is in the DOM

        setTimeout(() => {
            generateTile(track);
        }, tileDuration * 1000); // Generate a new tile once the last one has fully grown. 
    }

    // Function to start the tile generation
    function startTileGeneration() {
        const track = document.getElementById('track');

        generateTile(track); 
    }

    // Start generating tiles
    startTileGeneration();
});
