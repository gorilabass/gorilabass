class Gorila {
  constructor() {
    this.hp = 100;
    this.maxHp = 100;
    this.stamina = 40;
    this.maxStamina = 40;
    this.defending = false;
    this.humans = Array(100).fill(true); // true = vivo
  }

  attack() {
    if (this.stamina < 8) {
      log('Stamina insuficiente para atacar!');
      return false;
    }
    const kills = Math.floor(Math.random() * 5) + 1;
    let mortos = 0;
    for (let i = 0; i < this.humans.length && mortos < kills; i++) {
      if (this.humans[i]) {
        this.humans[i] = false;
        mortos++;
      }
    }
    this.stamina -= 8;
    log(`Gorila atacou e matou ${mortos} humano(s)!`);
    this.defending = false;
    return true;
  }

  defend() {
    if (this.stamina < 5) {
      log('Stamina insuficiente para defender!');
      return false;
    }
    this.stamina -= 5;
    this.defending = true;
    log('Gorila está se defendendo (dano reduzido no próximo turno).');
    return true;
  }

  rest() {
    const rec = 12;
    this.stamina = Math.min(this.stamina + rec, this.maxStamina);
    log(`Gorila descansou e recuperou ${rec} de stamina.`);
    this.defending = false;
    return true;
  }

  humanosRestantes() {
    return this.humans.filter(x => x).length;
  }

  isOver() {
    if (this.hp <= 0) return 'lose';
    if (this.humanosRestantes() === 0) return 'win';
    return null;
  }

  // Turno dos humanos
  humanosAtacam() {
    const vivos = this.humanosRestantes();
    let dano = 0;
    for (let i = 0; i < vivos; i++) {
      if (Math.random() < 0.06) dano++;
    }
    if (this.defending) dano = Math.floor(dano / 2);
    this.hp = Math.max(0, this.hp - dano);
    if (dano === 0) {
      log(`Os humanos atacaram, mas não acertaram o gorila.`);
    } else {
      log(`Humanos atacaram e causaram ${dano} de dano ao gorila.`);
    }
    this.defending = false;
  }
}

// ----- Funções utilitárias -----
const hpEl = document.getElementById('hp');
const staminaEl = document.getElementById('stamina');
const humansEl = document.getElementById('humans');
const logEl = document.getElementById('log');
const btnAttack = document.getElementById('btn-attack');
const btnDefend = document.getElementById('btn-defend');
const btnRest = document.getElementById('btn-rest');
const btnRestart = document.getElementById('btn-restart');
let game;

function log(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
}

function render() {
  hpEl.textContent = game.hp + ' / ' + game.maxHp;
  staminaEl.textContent = game.stamina + ' / ' + game.maxStamina;
  humansEl.textContent = game.humanosRestantes();
}

function turno(actionFn) {
  if (!actionFn()) return;
  render();
  const status = game.isOver();
  if (status) return end(status);
  setTimeout(() => {
    game.humanosAtacam();
    render();
    const s2 = game.isOver();
    if (s2) end(s2);
  }, 500);
}

function end(status) {
  if (status === 'win') log('Parabéns! O gorila derrotou todos os humanos!');
  else log('O gorila foi derrotado! Fim de jogo.');
  btnAttack.disabled = btnDefend.disabled = btnRest.disabled = true;
}

function start() {
  game = new Gorila();
  logEl.innerHTML = '';
  btnAttack.disabled = btnDefend.disabled = btnRest.disabled = false;
  log('Novo jogo iniciado!');
  render();
}

btnAttack.onclick = () => turno(() => game.attack());
btnDefend.onclick = () => turno(() => game.defend());
btnRest.onclick = () => turno(() => game.rest());
btnRestart.onclick = start;

document.addEventListener("DOMContentLoaded", () => {
  const btnAtacar = document.getElementById("btn-attack");
  const somAtaque = document.getElementById("som-ataque");

  btnAtacar.addEventListener("click", () => {
    somAtaque.currentTime = 0; // reinicia o som se já estiver tocando
    somAtaque.play();
  });
});


window.onload = start;
