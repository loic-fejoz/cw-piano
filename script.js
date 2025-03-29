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
        }
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
        oscillator.connect(gainNode);
        gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Set gain to 1 (full volume)
        oscillator.start();
    }

    // Function to stop the tone
    function stopTone() {
        if (oscillator && gainNode) {
            oscillator.disconnect(gainNode);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Set gain to 0 (mute)
            oscillator.stop();
        }
    }

    // Update the score display
    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Initialize audio context, oscillator, and gain node when the game starts
    initAudio();
});
