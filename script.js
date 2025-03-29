document.addEventListener('DOMContentLoaded', () => {
    const keyboardContainer = document.getElementById('keyboard');
    const scoreDisplay = document.getElementById('score');
    let score = 0;

    // Define the Morse Code keys and their corresponding frequencies
    const morseKeys = [
        { key: 'A', frequency: 800 },
        // Add more keys as needed
    ];

    // Create the keyboard
    morseKeys.forEach(key => {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.textContent = key.key;
        keyElement.addEventListener('click', () => playTone(key.frequency));
        keyboardContainer.appendChild(keyElement);
    });

    // Function to play a tone
    function playTone(frequency) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect(audioContext.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 100); // Stop the tone after 100ms
    }

    // Update the score display
    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }
});
