// script.js

function prepareText(text) {
  return text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
}

function generateMatrix(key) {
  let matrix = [];
  let used = {};
  key = prepareText(key);
  let combined = key + "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // J is merged with I

  for (let char of combined) {
    if (!used[char]) {
      matrix.push(char);
      used[char] = true;
    }
  }

  let grid = [];
  for (let i = 0; i < 25; i += 5) {
    grid.push(matrix.slice(i, i + 5));
  }

  return grid;
}

function findPosition(matrix, char) {
  for (let i = 0; i < 5; i++) {
    let j = matrix[i].indexOf(char);
    if (j !== -1) return [i, j];
  }
  return null;
}

function formatPairs(text) {
  let pairs = [];
  text = prepareText(text);
  for (let i = 0; i < text.length; i += 2) {
    let a = text[i];
    let b = text[i + 1] || 'X';
    if (a === b) {
      b = 'X';
      i--; // re-check b in next iteration
    }
    pairs.push([a, b]);
  }
  return pairs;
}

function encryptPair(matrix, a, b) {
  let [r1, c1] = findPosition(matrix, a);
  let [r2, c2] = findPosition(matrix, b);
  if (r1 === r2) {
    return matrix[r1][(c1 + 1) % 5] + matrix[r2][(c2 + 1) % 5];
  } else if (c1 === c2) {
    return matrix[(r1 + 1) % 5][c1] + matrix[(r2 + 1) % 5][c2];
  } else {
    return matrix[r1][c2] + matrix[r2][c1];
  }
}

function decryptPair(matrix, a, b) {
  let [r1, c1] = findPosition(matrix, a);
  let [r2, c2] = findPosition(matrix, b);
  if (r1 === r2) {
    return matrix[r1][(c1 + 4) % 5] + matrix[r2][(c2 + 4) % 5];
  } else if (c1 === c2) {
    return matrix[(r1 + 4) % 5][c1] + matrix[(r2 + 4) % 5][c2];
  } else {
    return matrix[r1][c2] + matrix[r2][c1];
  }
}

function encrypt() {
  let key = document.getElementById("key").value;
  let text = document.getElementById("plaintext").value;
  let matrix = generateMatrix(key);
  let pairs = formatPairs(text);
  let result = pairs.map(pair => encryptPair(matrix, pair[0], pair[1])).join("");
  document.getElementById("result").innerText = result;
}

function decrypt() {
  let key = document.getElementById("key").value;
  let text = document.getElementById("ciphertext").value;
  let matrix = generateMatrix(key);
  let pairs = formatPairs(text);
  let result = pairs.map(pair => decryptPair(matrix, pair[0], pair[1])).join("");
  document.getElementById("result").innerText = result;
}
