// Alphabet and modulus for modulo 26 arithmetic (A-Z)
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MOD = 26;

// Ensure number is within 0 to 25 (modulo 26)
function mod(n, m) {
  return ((n % m) + m) % m;
}

// Find modular inverse of a number (for matrix inversion)
function modInverse(a) {
  for (let i = 1; i < MOD; i++) {
    if ((a * i) % MOD === 1) return i;
  }
  return null; // No inverse exists
}

// Calculate determinant of a 2x2 matrix
function determinant2x2(matrix) {
  return mod(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0], MOD);
}

// Calculate determinant of a 3x3 matrix
function determinant3x3(matrix) {
  let [a, b, c] = matrix[0];
  let [d, e, f] = matrix[1];
  let [g, h, i] = matrix[2];
  return mod(
    a * (e * i - f * h) -
    b * (d * i - f * g) +
    c * (d * h - e * g),
    MOD
  );
}

// Inverse of 2x2 or 3x3 matrix modulo 26
function inverseMatrix(matrix) {
  const size = matrix.length;
  let det = size === 2 ? determinant2x2(matrix) : determinant3x3(matrix);
  let detInv = modInverse(det);

  if (!detInv) return null; // Not invertible

  if (size === 2) {
    // Inverse of 2x2 matrix
    return [
      [mod(matrix[1][1] * detInv, MOD), mod(-matrix[0][1] * detInv, MOD)],
      [mod(-matrix[1][0] * detInv, MOD), mod(matrix[0][0] * detInv, MOD)]
    ];
  }

  // Inverse of 3x3 matrix
  let adjugate = [];
  for (let row = 0; row < 3; row++) {
    adjugate[row] = [];
    for (let col = 0; col < 3; col++) {
      // Get 2x2 minor
      let sub = [matrix[(row + 1) % 3], matrix[(row + 2) % 3]].map(r =>
        r.filter((_, j) => j !== col)
      );
      let minorDet = sub[0][0] * sub[1][1] - sub[0][1] * sub[1][0];
      // Cofactor with sign
      let sign = ((row + col) % 2 === 0) ? 1 : -1;
      adjugate[row][col] = mod(sign * minorDet, MOD);
    }
  }

  // Transpose and multiply by inverse of determinant
  let inverse = [];
  for (let i = 0; i < 3; i++) {
    inverse[i] = [];
    for (let j = 0; j < 3; j++) {
      inverse[i][j] = mod(adjugate[j][i] * detInv, MOD);
    }
  }

  return inverse;
}

// Generate the matrix input fields based on selected size
function generateMatrix() {
  const size = parseInt(document.getElementById("size").value);
  const matrixDiv = document.getElementById("matrix");
  matrixDiv.innerHTML = "";

  for (let i = 0; i < size * size; i++) {
    const input = document.createElement("input");
    input.id = "m" + i;
    input.type = "number";
    input.style.width = "40px";
    matrixDiv.appendChild(input);
    if ((i + 1) % size === 0) matrixDiv.appendChild(document.createElement("br"));
  }
}

// Read matrix from input fields
function getMatrix(size) {
  let matrix = [];
  for (let row = 0; row < size; row++) {
    let rowArray = [];
    for (let col = 0; col < size; col++) {
      const value = parseInt(document.getElementById("m" + (row * size + col)).value) || 0;
      rowArray.push(value);
    }
    matrix.push(rowArray);
  }
  return matrix;
}

// Convert input text to array of numbers (A=0, B=1, ..., Z=25)
function textToNumbers(text) {
  return text.toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .map(char => ALPHABET.indexOf(char));
}

// Convert array of numbers to text
function numbersToText(numbers) {
  return numbers.map(n => ALPHABET[n]).join("");
}

// Perform Hill Cipher encryption or decryption
function runCipher() {
  const size = parseInt(document.getElementById("size").value);
  const mode = document.getElementById("mode").value;
  const inputText = document.getElementById("text").value;
  let matrix = getMatrix(size);

  if (mode === "decrypt") {
    matrix = inverseMatrix(matrix);
    if (!matrix) {
      document.getElementById("output").textContent = "Error: Matrix is not invertible.";
      return;
    }
  }

  let numbers = textToNumbers(inputText);
  while (numbers.length % size !== 0) {
    numbers.push(ALPHABET.indexOf("X")); // Pad with X
  }

  let result = [];
  for (let i = 0; i < numbers.length; i += size) {
    const block = numbers.slice(i, i + size);
    const transformed = matrix.map(row =>
      mod(row.reduce((sum, val, j) => sum + val * block[j], 0), MOD)
    );
    result.push(...transformed);
  }

  document.getElementById("output").textContent = numbersToText(result);
}

// Initialize matrix input fields on load
generateMatrix();
