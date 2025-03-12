/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

const wordsArray = [
  "apple",
  "banana",
  "grape",
  "orange",
  "peach",
  "plum",
  "cherry",
  "melon",
  "kiwi",
  "lemon",
];

function App() {
  const [words, setWords] = useState(() => {
    const savedWords = JSON.parse(localStorage.getItem("words"));
    return savedWords || shuffle(wordsArray);
  });

  const [currentWord, setCurrentWord] = useState(words[0] || "");
  const [scrambledWord, setScrambledWord] = useState(
    currentWord ? shuffle(currentWord) : ""
  );
  const [input, setInput] = useState("");
  const [points, setPoints] = useState(
    () => parseInt(localStorage.getItem("points")) || 0
  );
  const [strikes, setStrikes] = useState(
    () => parseInt(localStorage.getItem("strikes")) || 0
  );
  const [passes, setPasses] = useState(() => {
    const savedPasses = localStorage.getItem("passes");
    // Checking for null because if the guest uses all his passes
    // refreshing the page will not keep the saved passes
    return savedPasses !== null ? parseInt(savedPasses) : 3;
  });
  const [message, setMessage] = useState({ text: "", color: "" });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    localStorage.setItem("words", JSON.stringify(words));
    localStorage.setItem("points", points);
    localStorage.setItem("strikes", strikes);
    localStorage.setItem("passes", passes);
  }, [words, points, strikes, passes]);

  const handleGuess = (e) => {
    e.preventDefault();
    if (input.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      setMessage({ text: "Correct. Next word.", color: "green" });
      nextWord();
    } else {
      setStrikes(strikes + 1);
      setMessage({ text: "Wrong. Try again.", color: "red" });
      if (strikes + 1 >= 3) {
        endGame("You lost", "red");
        return;
      }
    }
    setInput("");
  };

  const nextWord = () => {
    const newWords = words.slice(1);
    setWords(newWords);
    if (newWords.length === 0) {
      endGame("You won!", "green");
      return;
    }
    const newWord = newWords[0];
    setCurrentWord(newWord);
    setScrambledWord(shuffle(newWord));
  };

  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      setMessage({ text: "Word skipped. Next word.", color: "orange" });
      nextWord();
    } else {
      setMessage({ text: "No passes remaining.", color: "red" });
    }
  };

  const endGame = (text, color) => {
    setGameOver(true);
    setMessage({ text, color });
    setScrambledWord("");
    localStorage.clear();
  };

  const resetGame = () => {
    const shuffledWords = shuffle(wordsArray);
    setWords(shuffledWords);
    setCurrentWord(shuffledWords[0]);
    setScrambledWord(shuffle(shuffledWords[0]));
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setMessage({ text: "", color: "" });
    setGameOver(false);
    setInput("");
    localStorage.clear();
  };

  return (
    <div className="text-center font-sans p-10 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to Scramble.</h1>
      {message.text && (
        <div className={`text-white p-2 mb-4 rounded bg-${message.color}-900`}>
          {message.text}
        </div>
      )}
      <p className="text-lg">Scrambled Word</p>
      <p className="text-[30px] mb-4">
        <strong>{scrambledWord?.toUpperCase()}</strong>
      </p>
      <form onSubmit={handleGuess} className="flex justify-between mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2 w-full"
        />
        <button
          type="submit"
          disabled={gameOver || !scrambledWord}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Guess
        </button>
      </form>
      <button
        onClick={handlePass}
        disabled={passes === 0 || gameOver}
        style={
          passes === 0 || gameOver
            ? { opacity: "0.5", cursor: "not-allowed" }
            : {}
        }
        className="bg-yellow-500 text-white p-2 rounded mb-4"
      >
        Pass ({passes} remaining)
      </button>
      <p className="text-sm">
        Points: {points} | Strikes: {strikes}
      </p>
      {gameOver && (
        <button
          onClick={resetGame}
          className="bg-red-500 text-white p-2 rounded mt-4"
        >
          Play Again?
        </button>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.body);
