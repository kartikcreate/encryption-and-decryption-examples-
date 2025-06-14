function caesarCipher(str, shift, mode = 'encrypt') {
  if (mode === 'decrypt') shift = (26 - shift) % 26;

  return str.split('').map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const base = code >= 65 && code <= 90 ? 65 : 97;
      return String.fromCharCode((code - base + shift) % 26 + base);
    }
    return char; // Non-alphabetic characters unchanged
  }).join('');
}

function encrypt() {
  const text = document.getElementById("inputText").value;
  const shift = parseInt(document.getElementById("shift").value) % 26;
  const result = caesarCipher(text, shift, 'encrypt');
  document.getElementById("output").textContent = result;
}

function decrypt() {
  const text = document.getElementById("inputText").value;
  const shift = parseInt(document.getElementById("shift").value) % 26;
  const result = caesarCipher(text, shift, 'decrypt');
  document.getElementById("output").textContent = result;
}
