document.addEventListener('DOMContentLoaded', () => {
    const keyboardContainer = document.getElementById('keyboard');
    const scoreDisplay = document.getElementById('score');
    let score = 0;

    // Define the Morse Code keys and their corresponding sounds
    const morseKeys = [
        { key: 'A', sound: 'sounds/a.mp3' },
        { key: 'B', sound: 'sounds/b.mp3' },
        { key: 'C', sound: 'sounds/c.mp3' },
        // Add more keys as needed
    ];

    // Create the keyboard
    morseKeys.forEach(key => {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.textContent = key.key;
        keyElement.addEventListener('click', () => playSound(key.sound));
        keyboardContainer.appendChild(keyElement);
    });

    // Function to play a sound
    function playSound(soundUrl) {
        const audio = new Audio(soundUrl);
        audio.play();
    }

    // Update the score display
    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }
});
