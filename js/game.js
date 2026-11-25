
const villages = [
  "NAYABASTI",
  "PATIHANI",
  "JAGATPUR",
  "MANGALPUR",
  "BHARATPUR-24",
  "BHARATPUR",
  "NARAYANGHAT"
];

export function renderGame() {
  return `
    <section class="chitwan-game" id="chitwanGame">
      <style>
        .chitwan-game{width:100%;color:#fff;font-family:inherit}
        .chitwan-game .cg-top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:15px 0}
        .chitwan-game .cg-stat{background:#101d25;border:1px solid #29404b;border-radius:12px;padding:10px 14px;flex:1;min-width:85px}
        .chitwan-game .cg-stat small{display:block;color:#91aab4;font-size:10px;letter-spacing:1px}
        .chitwan-game .cg-stat strong{font-size:20px;color:#b9f5c8}
        .chitwan-game .cg-stage{font-size:12px;letter-spacing:2px;color:#b9f5c8;margin:12px 0}
        .chitwan-game .cg-screen{position:relative;width:100%;overflow:hidden;border-radius:16px;border:1px solid #35505b;background:#8bc7df;touch-action:none}
        .chitwan-game canvas{display:block;width:100%;height:auto;aspect-ratio: 9 / 13}
        .chitwan-game .cg-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#06131dcc;text-align:center;padding:20px}
        .chitwan-game .cg-overlay[hidden]{display:none}
        .chitwan-game .cg-panel{max-width:290px}
        .chitwan-game .cg-panel h2{font-size:27px;margin:0 0 10px;color:#c6ffd2}
        .chitwan-game .cg-panel p{font-size:13px;line-height:1.6;color:#d6e5e9}
        .chitwan-game button{border:0;border-radius:12px;padding:13px 18px;font-weight:800;cursor:pointer;touch-action:manipulation}
        .chitwan-game .cg-main{background:#a8f0b8;color:#10221a}
        .chitwan-game .cg-controls{display:flex;justify-content:center;gap:12px;margin:14px 0}
        .chitwan-game .cg-controls button{background:#18303b;color:#fff;border:1px solid #46616b;min-width:75px;font-size:20px}
        .chitwan-game .cg-controls button:active{background:#a8f0b8;color:#10221a;transform:scale(.96)}
        .chitwan-game .cg-hint{text-align:center;font-size:11px;color:#9db5bd;line-height:1.6}
        .chitwan-game .cg-progress{height:7px;background:#20333c;border-radius:10px;overflow:hidden;margin:8px 0 15px}
        .chitwan-game .cg-progress span{display:block;height:100%;width:0;background:#a8f0b8;transition:width .2s}
      </style>

      <div class="eyebrow">INTERACTIVE CHITWAN ROAD ADVENTURE / 06</div>
      <h1>NAYABASTI <span>TO NARAYANGHAT.</span></h1>
      <p class="lead">Run through the villages of Chitwan. Avoid obstacles, collect coins and reach Narayanghat!</p>

      <div class="cg-top">
        <div class="cg-stat"><small>SCORE</small><strong id="cgScore">0</strong></div>
        <div class="cg-stat"><small>COINS</small><strong id="cgCoins">0</strong></div>
        <div class="cg-stat"><small>BEST</small><strong id="cgBest">0</strong></div>
      </div>

      <div class="cg-stage" id="cgVillage">📍 NAYABASTI</div>
      <div class="cg-progress"><span id="cgProgress"></span></div>

      <div class="cg-screen">
        <canvas id="cgCanvas" width="540" height="780" aria-label="Chitwan village road runner game"></canvas>
        <div class="cg-overlay" id="cgOverlay">
          <div class="cg-panel">
            <h2 id="cgTitle">CHITWAN RUNNER</h2>
            <p id="cgMessage">Nayabasti बाट यात्रा सुरु गर! बाटोमा आउने अवरोध छल्दै Narayanghat पुग।</p>
            <button class="cg-main" id="cgStart">START GAME ▶</button>
          </div>
        </div>
      </div>

      <div class="cg-controls">
        <button id="cgLeft" aria-label="Move left">◀</button>
        <button id="cgJump" aria-label="Jump">⬆ JUMP</button>
        <button id="cgRight" aria-label="Move right">▶</button>
      </div>
      <p class="cg-hint">मोबाइल: ◀ ▶ थिचेर बाटो बदल, JUMP थिचेर उफ्र।<br>Computer: ← → Arrow keys र Spacebar प्रयोग गर।</p>
    </section>
  `;
}

export function initGame() {
  const root = document.getElementById("chitwanGame");
  if (!root) return;

  if (window.__chitwanGameCleanup) {
    window.__chitwanGameCleanup();
  }

  const $ = id => root.querySelector("#" + id);
  const canvas = $("cgCanvas");
  const ctx = canvas.getContext("2d");

  const scoreEl = $("cgScore");
  const coinsEl = $("cgCoins");
  const bestEl = $("cgBest");
  const villageEl = $("cgVillage");
  const progressEl = $("cgProgress");
  const overlay = $("cgOverlay");
  const titleEl = $("cgTitle");
  const messageEl = $("cgMessage");

  let running = false;
  let dead = false;
  let raf = 0;
  let lastTime = 0;
  let elapsed = 0;
  let distance = 0;
  let score = 0;
  let coins = 0;
  let lane = 1;
  let jump = 0;
  let jumpVelocity = 0;
  let speed = 0.34;
  let spawnTimer = 0;
  let coinTimer = 0;
  let roadOffset = 0;
  let obstacles = [];
  let pickups = [];
  let scenery = [];
  let best = 0;

  try {
    best = Number(localStorage.getItem("chitwanRunnerBest") || 0);
  } catch (e) {}
  bestEl.textContent = best;

  const W = canvas.width;
  const H = canvas.height;
  const horizon = 220;
  const roadBottom = 760;
  const roadTopWidth = 80;
  const roadBottomWidth = 470;

  function villageIndex() {
    return Math.min(villages.length - 1, Math.floor(distance / 1000));
  }

  function updateHUD() {
    scoreEl.textContent = Math.floor(score);
    coinsEl.textContent = coins;
    villageEl.textContent = "📍 " + villages[villageIndex()];
    progressEl.style.width = Math.min(100, distance / 7000 * 100) + "%";
    bestEl.textContent = best;
  }

  function roadWidthAt(y) {
    const t = Math.max(0, Math.min(1, (y - horizon) / (roadBottom - horizon)));
    return roadTopWidth + (roadBottomWidth - roadTopWidth) * t;
  }

  function roadCenterAt(y) {
    const t = Math.max(0, Math.min(1, (y - horizon) / (roadBottom - horizon)));
    return W / 2 + 8 * t;
  }

  function laneX(l, y) {
    const width = roadWidthAt(y);
    const center = roadCenterAt(y);
    return center + (l - 1) * width * 0.29;
  }

  function polygon(points, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fill();
  }

  function drawCloud(x, y, scale) {
    ctx.fillStyle = "#ffffffb8";
    ctx.beginPath();
    ctx.arc(x, y, 18 * scale, 0, Math.PI * 2);
    ctx.arc(x + 22 * scale, y - 8 * scale, 23 * scale, 0, Math.PI * 2);
    ctx.arc(x + 48 * scale, y, 17 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTree(x, y, s) {
    ctx.fillStyle = "#68452c";
    ctx.fillRect(x - 5 * s, y - 38 * s, 10 * s, 40 * s);
    ctx.fillStyle = "#276c39";
    ctx.beginPath();
    ctx.arc(x, y - 48 * s, 24 * s, 0, Math.PI * 2);
    ctx.arc(x - 14 * s, y - 34 * s, 17 * s, 0, Math.PI * 2);
    ctx.arc(x + 15 * s, y - 33 * s, 17 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawHouse(x, y, s, color) {
    ctx.fillStyle = "#a77c50";
    ctx.fillRect(x - 27 * s, y - 36 * s, 54 * s, 36 * s);
    polygon([
      [x - 34 * s, y - 34 * s],
      [x, y - 62 * s],
      [x + 34 * s, y - 34 * s]
    ], color || "#8c4935");
    ctx.fillStyle = "#392d25";
    ctx.fillRect(x - 7 * s, y - 22 * s, 14 * s, 22 * s);
    ctx.fillStyle = "#d8c28c";
    ctx.fillRect(x - 21 * s, y - 25 * s, 10 * s, 9 * s);
  }

  function drawCow(x, y, s, buffalo = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = buffalo ? "#302b2b" : "#f0e8d8";
    ctx.fillRect(-22, -28, 44, 23);
    ctx.fillStyle = "#40352e";
    ctx.fillRect(12, -35, 17, 17);
    ctx.fillStyle = "#28221e";
    ctx.fillRect(-16, -8, 6, 15);
    ctx.fillRect(11, -8, 6, 15);
    ctx.fillStyle = "#f0e8d8";
    ctx.fillRect(22, -34, 8, 4);
    ctx.restore();
  }

  function drawScenery() {
    ctx.fillStyle = "#86c9e2";
    ctx.fillRect(0, 0, W, H);

    drawCloud(90, 80, 0.8);
    drawCloud(365, 105, 0.65);

    polygon([[0, horizon + 35], [90, 145], [180, horizon + 35]], "#5c9660");
    polygon([[150, horizon + 40], [280, 135], [420, horizon + 40]], "#6da36a");
    polygon([[350, horizon + 30], [470, 155], [540, horizon + 30]], "#558d5c");

    ctx.fillStyle = "#65a74f";
    ctx.fillRect(0, horizon, W, H - horizon);

    const leftEdgeTop = W / 2 - roadTopWidth / 2;
    const rightEdgeTop = W / 2 + roadTopWidth / 2;
    const leftEdgeBottom = W / 2 - roadBottomWidth / 2;
    const rightEdgeBottom = W / 2 + roadBottomWidth / 2;

    polygon([
      [leftEdgeTop, horizon],
      [rightEdgeTop, horizon],
      [rightEdgeBottom, roadBottom],
      [leftEdgeBottom, roadBottom]
    ], "#9b7955");

    polygon([
      [leftEdgeTop - 5, horizon],
      [leftEdgeTop, horizon],
      [leftEdgeBottom, roadBottom],
      [leftEdgeBottom - 13, roadBottom]
    ], "#d1b17b");

    polygon([
      [rightEdgeTop, horizon],
      [rightEdgeTop + 5, horizon],
      [rightEdgeBottom + 13, roadBottom],
      [rightEdgeBottom, roadBottom]
    ], "#d1b17b");

    for (let i = 0; i < 14; i++) {
      const y = horizon + ((i * 55 + roadOffset * 220) % (roadBottom - horizon));
      const t = (y - horizon) / (roadBottom - horizon);
      const x1 = W / 2 - roadWidthAt(y) * 0.16;
      const x2 = W / 2 + roadWidthAt(y) * 0.16;
      const h = 2 + t * 13;
      ctx.fillStyle = "#d4b78c";
      ctx.fillRect(x1 - h / 2, y, h, h * 1.8);
      ctx.fillRect(x2 - h / 2, y, h, h * 1.8);
    }

    for (let i = 0; i < 8; i++) {
      const y = horizon + ((i * 85 + roadOffset * 180) % (roadBottom - horizon));
      const t = (y - horizon) / (roadBottom - horizon);
      const s = 0.35 + t * 0.85;
      const leftX = 35 + t * 70 + (i % 2) * 35;
      const rightX = W - 35 - t * 70 - (i % 2) * 35;
      if (i % 3 === 0) {
        drawHouse(leftX, y, s, "#a34f36");
        drawTree(rightX, y, s);
      } else if (i % 3 === 1) {
        drawTree(leftX, y, s);
        drawHouse(rightX, y, s, "#8c593a");
      } else {
        drawTree(leftX, y, s * 0.8);
        drawTree(rightX, y, s * 0.9);
      }
    }

    ctx.fillStyle = "#f1dfad";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("CHITWAN • NEPAL", 15, 25);
  }

  function drawPlayer() {
    const y = 660 - jump * 0.65;
    const x = laneX(lane, 660);
    const shadowScale = Math.max(0.45, 1 - jump / 100);
    ctx.fillStyle = "#00000035";
    ctx.beginPath();
    ctx.ellipse(x, 688, 28 * shadowScale, 9 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    const runningLeg = running && !dead ? Math.sin(elapsed * 0.018) * 8 : 0;

    ctx.strokeStyle = "#202b34";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-8, -24);
    ctx.lineTo(-12 + runningLeg, -2);
    ctx.moveTo(8, -24);
    ctx.lineTo(12 - runningLeg, -2);
    ctx.stroke();

    ctx.fillStyle = "#2467a0";
    ctx.fillRect(-17, -62, 34, 40);
    ctx.fillStyle = "#e8b58b";
    ctx.beginPath();
    ctx.arc(0, -76, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#24201d";
    ctx.fillRect(-15, -91, 30, 8);
    ctx.fillRect(-10, -98, 20, 9);

    ctx.strokeStyle = "#e8b58b";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-14, -54);
    ctx.lineTo(-24, -34 + runningLeg);
    ctx.moveTo(14, -54);
    ctx.lineTo(24, -34 - runningLeg);
    ctx.stroke();
    ctx.restore();
  }

  function drawObstacle(o) {
    const y = o.y;
    const x = laneX(o.lane, y);
    const scale = 0.25 + ((y - horizon) / (roadBottom - horizon)) * 0.85;
    if (o.type === "cow" || o.type === "buffalo") {
      drawCow(x, y, scale, o.type === "buffalo");
    } else if (o.type === "rock") {
      ctx.fillStyle = "#66645d";
      ctx.beginPath();
      ctx.ellipse(x, y - 10 * scale, 20 * scale, 15 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#d8b66d";
      ctx.fillRect(x - 15 * scale, y - 35 * scale, 30 * scale, 35 * scale);
      ctx.fillStyle = "#62452d";
      ctx.fillRect(x - 9 * scale, y - 25 * scale, 18 * scale, 18 * scale);
    }
  }

  function drawCoin(c) {
    const x = laneX(c.lane, c.y);
    const scale = 0.35 + ((c.y - horizon) / (roadBottom - horizon)) * 0.8;
    ctx.fillStyle = "#ffcf36";
    ctx.beginPath();
    ctx.arc(x, c.y - 18 * scale, 10 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff2a3";
    ctx.lineWidth = 3 * scale;
    ctx.stroke();
  }

  function spawnObstacle() {
    const types = ["cow", "buffalo", "rock", "cart"];
    obstacles.push({
      lane: Math.floor(Math.random() * 3),
      y: horizon + 5,
      type: types[Math.floor(Math.random() * types.length)]
    });
  }

  function spawnCoins() {
    const l = Math.floor(Math.random() * 3);
    for (let i = 0; i < 4; i++) {
      pickups.push({ lane: l, y: horizon - i * 36 });
    }
  }

  function moveLeft() {
    if (running && !dead) lane = Math.max(0, lane - 1);
  }

  function moveRight() {
    if (running && !dead) lane = Math.min(2, lane + 1);
  }

  function doJump() {
    if (running && !dead && jump <= 0) jumpVelocity = 13;
  }

  function endGame() {
    running = false;
    dead = true;
    titleEl.textContent = "GAME OVER!";
    messageEl.textContent = "तिम्रो Score: " + Math.floor(score) + " | Coins: " + coins + ". फेरि प्रयास गर!";
    $("cgStart").textContent = "PLAY AGAIN ↻";
    overlay.hidden = false;

    if (score > best) {
      best = Math.floor(score);
      try {
        localStorage.setItem("chitwanRunnerBest", best);
      } catch (e) {}
    }
    updateHUD();
  }

  function winGame() {
    running = false;
    dead = false;
    titleEl.textContent = "YOU MADE IT!";
    messageEl.textContent = "बधाई छ! तिमी Nayabasti बाट Narayanghat पुग्यौ। Score: " + Math.floor(score) + " | Coins: " + coins;
    $("cgStart").textContent = "PLAY AGAIN ↻";
    overlay.hidden = false;
    if (score > best) {
      best = Math.floor(score);
      try {
        localStorage.setItem("chitwanRunnerBest", best);
      } catch (e) {}
    }
    updateHUD();
  }

  function resetGame() {
    score = 0;
    coins = 0;
    distance = 0;
    elapsed = 0;
    lane = 1;
    jump = 0;
    jumpVelocity = 0;
    speed = 0.34;
    spawnTimer = 0;
    coinTimer = 0;
    roadOffset = 0;
    obstacles = [];
    pickups = [];
    dead = false;
    running = true;
    lastTime = 0;
    overlay.hidden = true;
    updateHUD();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function update(dt) {
    elapsed += dt;
    distance += speed * dt;
    score += speed * dt * 0.08;
    speed = Math.min(0.62, 0.34 + distance / 28000);
    roadOffset = (roadOffset + speed * dt / 1000) % 1;

    if (jump > 0 || jumpVelocity > 0) {
      jump += jumpVelocity;
      jumpVelocity -= 0.65;
      if (jump <= 0) {
        jump = 0;
        jumpVelocity = 0;
      }
    }

    spawnTimer += dt;
    coinTimer += dt;

    if (spawnTimer > Math.max(650, 1450 - distance / 12)) {
      spawnObstacle();
      spawnTimer = 0;
    }
    if (coinTimer > 1900) {
      spawnCoins();
      coinTimer = 0;
    }

    obstacles.forEach(o => o.y += speed * dt * 0.48);
    pickups.forEach(c => c.y += speed * dt * 0.48);

    obstacles = obstacles.filter(o => o.y < 810);
    pickups = pickups.filter(c => c.y < 810);

    for (const o of obstacles) {
      if (o.lane === lane && o.y > 610 && o.y < 705 && jump < 48) {
        endGame();
        return;
      }
    }

    pickups = pickups.filter(c => {
      if (c.lane === lane && c.y > 610 && c.y < 700) {
        coins++;
        score += 25;
        return false;
      }
      return true;
    });

    if (distance >= 7000) {
      distance = 7000;
      winGame();
      return;
    }

    updateHUD();
  }

  function draw() {
    drawScenery();
    pickups.forEach(drawCoin);
    obstacles.forEach(drawObstacle);
    drawPlayer();

    if (!running && !dead) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("READY FOR THE ROAD?", W / 2, 720);
      ctx.textAlign = "left";
    }
  }

  function loop(time) {
    if (!running) return;
    if (!lastTime) lastTime = time;
    const dt = Math.min(40, time - lastTime);
    lastTime = time;
    update(dt);
    draw();
    if (running) raf = requestAnimationFrame(loop);
  }

  function keyHandler(e) {
    if (["ArrowLeft", "ArrowRight", " ", "ArrowUp"].includes(e.key)) e.preventDefault();
    if (e.key === "ArrowLeft") moveLeft();
    if (e.key === "ArrowRight") moveRight();
    if (e.key === " " || e.key === "ArrowUp") doJump();
  }

  const on = (id, fn) => {
    const el = $(id);
    el.addEventListener("pointerdown", fn);
    return () => el.removeEventListener("pointerdown", fn);
  };

  const removeLeft = on("cgLeft", moveLeft);
  const removeRight = on("cgRight", moveRight);
  const removeJump = on("cgJump", doJump);
  const startHandler = () => resetGame();
  $("cgStart").addEventListener("click", startHandler);
  window.addEventListener("keydown", keyHandler);

  draw();
  updateHUD();

  window.__chitwanGameCleanup = () => {
    cancelAnimationFrame(raf);
    removeLeft();
    removeRight();
    removeJump();
    $("cgStart").removeEventListener("click", startHandler);
    window.removeEventListener("keydown", keyHandler);
    window.__chitwanGameCleanup = null;
  };
}

