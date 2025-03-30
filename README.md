# CW Piano

A piano's tiles kind of game to learn CW (aka morse code).

But actually, it was a trial for AI assisted code session. I mainly used [aider](https://aider.chat) and [continue](https://docs.continue.dev/).
Both were configured to use my locally deployed [Ollama](https://ollama.com/) models. I mainly used [qwen2.5:3b](https://ollama.com/library/qwen2.5)
because the `qwen2.5:7b` was too big for my NVIDIA GeForce RTX 3050 Laptop GPU and i5-11400H CPU. `:7b` was really better than `:3b` but much slower ...without surprise.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Serving the File

You can serve the file using a simple HTTP server by running:


```
python -m http.server 8000
```

This will start a local web server on port 8000. You can then open your browser and navigate to `http://localhost:8000` to view the game.


## Contributing

If you would like to contribute to this project, please open an issue or pull request.

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more details.
