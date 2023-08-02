const seedColorInput = document.getElementById('head');
const colorModeSelect = document.getElementById('select-color');
const generateBtn = document.getElementById('color-btn');
const colorSchemeSection = document.getElementById('color-scheme-section');

generateBtn.addEventListener('click', generateColorScheme);

async function generateColorScheme() {
  const seedColor = seedColorInput.value.slice(1);
  const colorMode = colorModeSelect.value;

  const apiUrl = `https://www.thecolorapi.com/scheme?hex=${seedColor}&mode=${colorMode.toLowerCase()}&count=5`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (data.colors && Array.isArray(data.colors)) {
      const colors = data.colors.map((colorObj) => colorObj.hex.value);
      displayColorScheme(colors);
      changeBackground(colors);
    } else {
      throw new Error('Invalid data received from the API');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to fetch data. Please try again later.');
  }
}

//change the color of body background to gradient when color is generated following the color data api

function changeBackground(colors) {
  const body = document.querySelector('body');

  //looping colors array to get the colors
  let color1 = '';
  let color2 = '';
  let color3 = '';
  let color4 = '';
  let color5 = '';

  for (let i = 0; i < colors.length; i++) {
    if (i === 0) {
      color1 = colors[i];
    } else if (i === 1) {
      color2 = colors[i];
    } else if (i === 2) {
      color3 = colors[i];
    } else if (i === 3) {
      color4 = colors[i];
    } else if (i === 4) {
      color5 = colors[i];
    }
  }

  //setting the gradient background
  body.style.background = `linear-gradient(80deg, ${color1} 0%, ${color2} 34%, ${color3} 58%, ${color4} 100%, ${color5} 5%) no-repeat center center fixed`;
}

function displayColorScheme(colors) {
  colorSchemeSection.innerHTML = '';
  colors.forEach((color) => {
    const colorsBarDiv = document.createElement('div');
    colorsBarDiv.classList.add('colors-bar-div');

    const stripeSection = document.createElement('div');
    stripeSection.style.backgroundColor = color;
    stripeSection.classList.add('stripe-section');

    const hexcodeSection = document.createElement('div');
    hexcodeSection.textContent = color;
    hexcodeSection.classList.add('hexcode-section');

    colorsBarDiv.appendChild(stripeSection);
    colorsBarDiv.appendChild(hexcodeSection);
    colorSchemeSection.appendChild(colorsBarDiv);
  });
}

colorSchemeSection.addEventListener('click', copyToClipboard);

function copyToClipboard(event) {
  if (event.target.classList.contains('hexcode-section')) {
    const hexValue = event.target.textContent;
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = hexValue;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert(`Copied ${hexValue} to clipboard!`);
  } else if (event.target.classList.contains('stripe-section')) {
    const hexValue = event.target.style.backgroundColor;
    const rgbValue = hexValue
      .slice(4, -1)
      .split(',')
      .map((value) => parseInt(value));
    const hex = rgbToHex(...rgbValue);
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = hex.toUpperCase();
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert(`Copied ${hex.toUpperCase()} to clipboard!`);
  }
}

function rgbToHex(r, g, b) {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
}
