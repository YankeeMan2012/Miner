class GameField {
  constructor(params) {
    Object.assign(this, params);

    this.field = [];
    this.startFlag = 1;
    this.WinFlag = 0;
    this.timerId = 0;
    this.minesCounter = +this.mines;
    this.randomMinesFields = this.randomMinesFields.bind(this);
    this.counterMines = this.counterMines.bind(this);
    this.render = this.render.bind(this);
    this.leftClick = this.leftClick.bind(this);
    this.rightClick = this.rightClick.bind(this);
    this.changeType = this.changeType.bind(this);
    this.timer = this.timer.bind(this);
    this.minesCount = this.minesCount.bind(this);
    this.isVictory = this.isVictory.bind(this);
    this.endGame = this.endGame.bind(this);
    this.winChange = this.winChange.bind(this);
    this.render();
  }

  render() {
    for (let i = 1; i <= this.height; i++) {
      for (let j = 1; j <= this.width; j++) {
        const element = document.createElement('DIV');
        element.setAttribute('data-row', i);
        element.setAttribute('data-column', j);
        element.classList.add('field-item');
        element.classList.add('free');
        element.onclick = this.leftClick;
        element.oncontextmenu = this.rightClick;
        if (!this.field[i]) {
          this.field[i] = [];
        }
        this.field[i][j] = element;
        this.rootElement.appendChild(element);
      }
      this.rootElement.appendChild(document.createElement('BR'));
    }
    this.minesNumber.innerHTML = this.mines;
  }

  leftClick(e) {
    if (this.WinFlag) return false;
    const element = e.target;
    const raw = element.getAttribute('data-row');
    const column = element.getAttribute('data-column');
    if (this.startFlag) {
      this.randomMinesFields(element);
      this.timer();
    }
    if (element.classList.contains('flag')) return false;
    this.changeType(element, raw, column);
    if (this.isVictory()) this.endGame(true);
    return 'ok';
  }

  rightClick(e) {
    e.preventDefault();
    if (this.WinFlag) return false;
    const element = e.target;
    if (element.classList.contains('free')) {
      element.classList.add('flag');
      element.classList.remove('free');
      this.minesCount(-1);
    } else if (element.classList.contains('flag')) {
      element.classList.add('free');
      element.classList.remove('flag');
      this.minesCount(1);
    }
    return 'ok';
  }

  randomMinesFields(element) {
    let counter = this.mines;
    while (counter > 0) {
      const random1 = 1 + Math.round(Math.random() * (this.height - 1));
      const random2 = 1 + Math.round(Math.random() * (this.width - 1));
      if (
            !this.field[random1][random2].classList.contains('mine')
            && this.field[random1][random2] !== element
          ) {
        this.field[random1][random2].classList.add('mine');
        counter--;
      }
    }
    this.counterMines();
    this.startFlag = 0;
  }

  counterMines() {
    for (let i = 1; i <= this.height; i++) {
      for (let j = 1; j <= this.width; j++) {
        let counter = 0;
        for (let x = i - 1; x < i + 2; x++) {
          for (let y = j - 1; y < j + 2; y++) {
            if (x > 0 && x <= this.height && y > 0 && y <= this.width) {
              if (this.field[x][y].classList.contains('mine')) {
                counter++;
              }
            }
          }
        }
        if (!this.field[i][j].classList.contains('mine')) {
          this.field[i][j].classList.add(`number${counter}`);
        }
      }
    }
  }

  changeType(element, raw, column) {
    if (element.classList.contains('mine')) {
      for (let i = 1; i <= this.height; i++) {
        for (let j = 1; j <= this.width; j++) {
          if (this.field[i][j].classList.contains('mine')) {
            this.field[i][j].classList.remove('free');
          }
          element.classList.add('target');
          this.endGame(false);
        }
      }
    } else if (element.classList.contains('number0')) {
      for (let i = +raw - 1; i < +raw + 2; i++) {
        for (let j = +column - 1; j < +column + 2; j++) {
          element.classList.remove('free');
          if (
                i > 0 && i <= this.height && j > 0 && j <= this.width
                && this.field[i][j].classList.contains('free')
              ) {
            this.changeType(this.field[i][j], i, j);
          }
        }
      }
    } else {
      element.classList.remove('free');
    }
  }

  timer() {
    let timer = 1;
    this.timerId = setInterval(() => {
      this.gameTimer.innerHTML = timer;
      timer++;
    }, 1000);
  }

  minesCount(mine) {
    this.minesCounter += mine;
    this.minesNumber.innerHTML = this.minesCounter;
  }

  isVictory() {
    let counter = 0;
    for (let i = 1; i < this.field.length; i++) {
      for (let j = 1; j < this.field[i].length; j++) {
        if (
              this.field[i][j].classList.contains('free')
              || this.field[i][j].classList.contains('flag')
            ) {
          counter++;
        }
      }
    }
    if (counter !== +this.mines) {
      return false;
    }
    return true;
  }

  endGame(win) {
    let endText;
    let endClass;
    if (win) {
      endText = 'You Win!';
      endClass = 'victory-popup';
      this.winChange();
    } else {
      endText = 'You Lose!';
      endClass = 'lose-popup';
    }
    this.popup.innerHTML = endText;
    this.popup.classList.add(endClass);
    this.popup.classList.remove('hidden');
    clearInterval(this.timerId);
    this.WinFlag = 1;
  }

  winChange() {
    for (let i = 1; i < this.field.length; i++) {
      for (let j = 1; j < this.field[i].length; j++) {
        if (this.field[i][j].classList.contains('mine', 'flag')) {
          this.field[i][j].classList.remove('mine', 'flag');
          this.field[i][j].classList.add('winMine');
        }
      }
    }
    this.minesNumber.innerHTML = 0;
  }

}

const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const minesInput = document.getElementById('mines');
const startButton = document.getElementById('start');
const rootElement = document.getElementById('root');
const info = document.getElementById('infoField');
const gameTimer = document.getElementById('timer');
const minesNumber = document.getElementById('minesCounter');
const popup = document.getElementById('popup');

function getChar(event) {
  if (event.which == null) {
    if (event.keyCode < 32) return null;
    return String.fromCharCode(event.keyCode);
  }
  if (event.which !== 0 && event.charCode !== 0) {
    if (event.which < 32) return null;
    return String.fromCharCode(event.which);
  }
  return null;
}

const numberOnly = (e) => {
  const chr = getChar(e);
  if (e.ctrlKey || e.altKey || e.metaKey || chr == null) return true;
  if (chr < '0' || chr > '9') {
    return false;
  }
  return true;
};

widthInput.onkeypress = numberOnly;
heightInput.onkeypress = numberOnly;
minesInput.onkeypress = numberOnly;

function isValidate() {
  let valid = true;
  const width = widthInput.value;
  const height = heightInput.value;
  const mines = minesInput.value;
  if (width < 1 && width > 20) {
    valid = false;
    widthInput.value = '';
  } else if (height < 1 && height > 40) {
    valid = false;
    heightInput.value = '';
  } else if (mines > width * height - 1 || mines < 1) {
    valid = false;
    minesInput.value = '';
  }
  return valid;
}

function initialize() {
  if (!isValidate()) return false;
  const width = widthInput.value;
  const height = heightInput.value;
  const mines = minesInput.value;
  const gameSettings = document.getElementById('gameSettings');

  const params = {
    width,
    height,
    mines,
    gameTimer,
    minesNumber,
    rootElement,
    popup,
  };

  gameSettings.classList.add('hidden');
  rootElement.classList.remove('hidden');
  info.classList.remove('hidden');

  const gf = new GameField(params);
  return gf;
}

startButton.onclick = initialize;
