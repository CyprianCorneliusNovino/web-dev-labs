// ============================================
// FIX WIRING - DRAG & DROP GAME ENGINE
// ============================================

// ----- GAME STATE -----
const gameState = {
    level: 1,
    score: 0,
    streak: 0,
    maxStreak: 0,
    timer: 30,
    timerInterval: null,
    isGameActive: false,
    isLevelComplete: false,
    correctConnections: 0,
    totalConnections: 4,
    wiresUsed: {
        red: false,
        yellow: false,
        green: false,
        blue: false
    },
    dropZones: {
        red: null,
        yellow: null,
        green: null,
        blue: null
    }
};

// ----- LEVEL CONFIGURATIONS -----
const levels = [
    {
        task: "RECONNECT WIRES TO RESTORE OFFICE POWER",
        location: "OFFICE BLOCK C",
        wires: ['red', 'yellow', 'green', 'blue'],
        timeLimit: 30
    },
    {
        task: "RECONNECT NETWORK CABLES FOR FLOOR 2",
        location: "FLOOR 2 - IT DEPT",
        wires: ['red', 'yellow', 'green', 'blue'],
        timeLimit: 25
    },
    {
        task: "FIX SERVER ROOM WIRING CONNECTIONS",
        location: "SERVER ROOM A",
        wires: ['red', 'yellow', 'green', 'blue'],
        timeLimit: 20
    }
];

// ----- DOM ELEMENTS -----
const elements = {
    levelBadge: document.getElementById('levelBadge'),
    taskDesc: document.getElementById('taskDesc'),
    locationDisplay: document.getElementById('locationDisplay'),
    timerDisplay: document.getElementById('timerDisplay'),
    scoreDisplay: document.getElementById('scoreDisplay'),
    streakDisplay: document.getElementById('streakDisplay'),
    feedbackText: document.getElementById('feedbackText'),
    feedbackBar: document.getElementById('feedbackBar'),
    powerPercent: document.getElementById('powerPercent'),
    powerFill: document.getElementById('powerFill'),
    checkBtn: document.getElementById('checkBtn'),
    resetBtn: document.getElementById('resetBtn'),
    nextBtn: document.getElementById('nextBtn'),
    continueBtn: document.getElementById('continueBtn'),
    successOverlay: document.getElementById('successOverlay'),
    finalScore: document.getElementById('finalScore'),
    finalTime: document.getElementById('finalTime'),
    dropZones: {
        red: document.getElementById('dropRed'),
        yellow: document.getElementById('dropYellow'),
        green: document.getElementById('dropGreen'),
        blue: document.getElementById('dropBlue')
    },
    wires: {
        red: document.getElementById('wireRed'),
        yellow: document.getElementById('wireYellow'),
        green: document.getElementById('wireGreen'),
        blue: document.getElementById('wireBlue')
    },
    equipStatus: {
        1: document.getElementById('equip1'),
        2: document.getElementById('equip2'),
        3: document.getElementById('equip3'),
        4: document.getElementById('equip4')
    }
};

// ----- DRAG & DROP SETUP -----
function setupDragDrop() {
    const wireItems = document.querySelectorAll('.wire-item');
    const dropSlots = document.querySelectorAll('.drop-slot');

    // Drag Start
    wireItems.forEach(wire => {
        wire.addEventListener('dragstart', (e) => {
            const color = wire.dataset.color;
            if (gameState.wiresUsed[color]) {
                e.preventDefault();
                return;
            }
            e.dataTransfer.setData('text/plain', color);
            wire.classList.add('dragging');
        });

        wire.addEventListener('dragend', (e) => {
            wire.classList.remove('dragging');
        });
    });

    // Drop Zone Events
    dropSlots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            const targetColor = slot.closest('.drop-zone').dataset.target;
            if (!gameState.dropZones[targetColor]) {
                slot.classList.add('dragover');
            }
        });

        slot.addEventListener('dragleave', (e) => {
            slot.classList.remove('dragover');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('dragover');
            
            const wireColor = e.dataTransfer.getData('text/plain');
            const targetColor = slot.closest('.drop-zone').dataset.target;
            
            // Check if this slot is already filled
            if (gameState.dropZones[targetColor]) {
                showFeedback('This slot is already filled!', 'error');
                return;
            }
            
            // Check if this wire is already used
            if (gameState.wiresUsed[wireColor]) {
                showFeedback('This wire is already used!', 'error');
                return;
            }
            
            // Place the wire
            placeWire(wireColor, targetColor, slot);
        });
    });
}

// ----- PLACE WIRE -----
function placeWire(wireColor, targetColor, slot) {
    // Check if colors match
    if (wireColor !== targetColor) {
        showFeedback(`❌ Wrong wire! You need the ${targetColor.toUpperCase()} wire here.`, 'error');
        // Flash the slot red
        slot.style.borderColor = '#ff4444';
        slot.style.background = 'rgba(255, 68, 68, 0.1)';
        setTimeout(() => {
            slot.style.borderColor = '';
            slot.style.background = '';
        }, 800);
        return;
    }

    // Correct placement!
    const wireElement = elements.wires[wireColor];
    wireElement.classList.add('used');
    
    // Fill the slot
    slot.textContent = '✅';
    slot.style.fontSize = '1.5rem';
    slot.classList.add('filled', `filled-${wireColor}`);
    
    // Update state
    gameState.wiresUsed[wireColor] = true;
    gameState.dropZones[targetColor] = wireColor;
    gameState.correctConnections++;
    
    // Update equipment status
    updateEquipmentStatus();
    
    // Update power percentage
    updatePowerPercentage();
    
    // Streak
    gameState.streak++;
    if (gameState.streak > gameState.maxStreak) {
        gameState.maxStreak = gameState.streak;
    }
    updateStats();
    
    // Score
    const points = 10 + (gameState.streak >= 3 ? 5 : 0);
    gameState.score += points;
    updateStats();
    
    showFeedback(`✅ Correct! +${points} points! ${gameState.correctConnections}/${gameState.totalConnections} connected`, 'success');
    
    // Check if all wires are placed
    if (gameState.correctConnections === gameState.totalConnections) {
        completeLevel();
    }
}

// ----- UPDATE EQUIPMENT STATUS -----
function updateEquipmentStatus() {
    const connected = gameState.correctConnections;
    const statuses = {
        1: { on: connected >= 1, label: '💻' },
        2: { on: connected >= 2, label: '🖨️' },
        3: { on: connected >= 3, label: '📞' },
        4: { on: connected >= 4, label: '📡' }
    };
    
    Object.keys(statuses).forEach(key => {
        const el = elements.equipStatus[key];
        if (statuses[key].on) {
            el.textContent = '🟢';
            el.className = 'equip-status on';
        } else {
            el.textContent = '🔴';
            el.className = 'equip-status off';
        }
    });
}

// ----- UPDATE POWER PERCENTAGE -----
function updatePowerPercentage() {
    const percent = Math.round((gameState.correctConnections / gameState.totalConnections) * 100);
    elements.powerPercent.textContent = percent + '%';
    elements.powerFill.style.width = percent + '%';
}

// ----- UPDATE STATS -----
function updateStats() {
    elements.scoreDisplay.textContent = gameState.score;
    elements.streakDisplay.textContent = gameState.streak;
}

// ----- SHOW FEEDBACK -----
function showFeedback(message, type = 'info') {
    elements.feedbackText.textContent = message;
    elements.feedbackBar.className = 'feedback-bar';
    if (type === 'success') {
        elements.feedbackBar.classList.add('success');
        elements.feedbackBar.querySelector('.fb-icon').textContent = '✅';
    } else if (type === 'error') {
        elements.feedbackBar.classList.add('error');
        elements.feedbackBar.querySelector('.fb-icon').textContent = '❌';
    } else {
        elements.feedbackBar.querySelector('.fb-icon').textContent = '💡';
    }
}

// ----- COMPLETE LEVEL -----
function completeLevel() {
    if (gameState.isLevelComplete) return;
    gameState.isLevelComplete = true;
    gameState.isGameActive = false;
    clearInterval(gameState.timerInterval);
    
    // Show success overlay
    elements.finalScore.textContent = gameState.score;
    elements.finalTime.textContent = (30 - gameState.timer) + 's';
    elements.successOverlay.classList.add('active');
    
    // Create celebration effect
    createCelebration();
    
    // Enable next button
    elements.nextBtn.disabled = false;
}

// ----- CELEBRATION EFFECT -----
function createCelebration() {
    const colors = ['#00d4ff', '#7b2ffc', '#ff6b6b', '#ffd93d', '#66ff99', '#ff9ff3'];
    const container = document.body;
    
    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 4}px;
            height: ${Math.random() * 10 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            left: ${Math.random() * 100}%;
            top: -10px;
            z-index: 999;
            animation: confettiFall ${Math.random() * 2 + 2}s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
            transform: rotate(${Math.random() * 360}deg);
        `;
        container.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
    }
}

// Add confetti animation style
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% { opacity: 1; transform: translateY(-10px) rotate(0deg) scale(1); }
        100% { opacity: 0; transform: translateY(100vh) rotate(720deg) scale(0.3); }
    }
`;
document.head.appendChild(confettiStyle);

// ----- TIMER -----
function startTimer() {
    gameState.timer = levels[gameState.level - 1].timeLimit;
    elements.timerDisplay.textContent = `00:${String(gameState.timer).padStart(2, '0')}`;
    gameState.isGameActive = true;
    
    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        elements.timerDisplay.textContent = `00:${String(gameState.timer).padStart(2, '0')}`;
        
        // Timer warning
        if (gameState.timer <= 5) {
            elements.timerDisplay.style.color = '#ff4444';
        }
        
        if (gameState.timer <= 0) {
            clearInterval(gameState.timerInterval);
            gameState.isGameActive = false;
            showFeedback('⏰ Time\'s up! Click RESET to try again.', 'error');
        }
    }, 1000);
}

// ----- LOAD LEVEL -----
function loadLevel(levelNum) {
    const level = levels[levelNum - 1];
    if (!level) {
        // All levels complete!
        showFeedback('🎉 Congratulations! You\'ve completed all levels!', 'success');
        return;
    }
    
    // Reset game state
    gameState.level = levelNum;
    gameState.correctConnections = 0;
    gameState.isLevelComplete = false;
    gameState.wiresUsed = { red: false, yellow: false, green: false, blue: false };
    gameState.dropZones = { red: null, yellow: null, green: null, blue: null };
    
    // Update UI
    elements.levelBadge.textContent = `LEVEL ${levelNum}`;
    elements.taskDesc.textContent = level.task;
    elements.locationDisplay.textContent = level.location;
    elements.nextBtn.disabled = true;
    elements.timerDisplay.style.color = '#ffffff';
    
    // Reset drop slots
    Object.keys(elements.dropZones).forEach(color => {
        const slot = elements.dropZones[color];
        slot.textContent = '';
        slot.className = 'drop-slot';
    });
    
    // Reset wires
    Object.keys(elements.wires).forEach(color => {
        elements.wires[color].classList.remove('used');
    });
    
    // Reset equipment
    Object.keys(elements.equipStatus).forEach(key => {
        elements.equipStatus[key].textContent = '⬜';
        elements.equipStatus[key].className = 'equip-status';
    });
    
    // Reset power
    elements.powerPercent.textContent = '0%';
    elements.powerFill.style.width = '0%';
    
    // Reset feedback
    showFeedback(`Level ${levelNum}: Drag each colored wire to its matching slot`, 'info');
    
    // Start timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    startTimer();
}

// ----- CHECK CONNECTIONS -----
function checkConnections() {
    if (gameState.isLevelComplete) {
        showFeedback('🎉 Level already complete! Click NEXT to continue.', 'success');
        return;
    }
    
    const placed = Object.values(gameState.dropZones).filter(v => v !== null).length;
    
    if (placed === 0) {
        showFeedback('⚠️ No wires connected yet! Drag wires to the slots.', 'error');
        return;
    }
    
    if (placed < gameState.totalConnections) {
        showFeedback(`⚠️ ${placed}/${gameState.totalConnections} connected. Keep going!`, 'error');
        return;
    }
    
    // All connected - check if correct
    let allCorrect = true;
    Object.keys(gameState.dropZones).forEach(color => {
        if (gameState.dropZones[color] !== color) {
            allCorrect = false;
        }
    });
    
    if (allCorrect) {
        completeLevel();
    } else {
        showFeedback('❌ Some wires are in the wrong slots! Check your connections.', 'error');
    }
}

// ----- RESET LEVEL -----
function resetLevel() {
    clearInterval(gameState.timerInterval);
    loadLevel(gameState.level);
}

// ----- NEXT LEVEL -----
function nextLevel() {
    elements.successOverlay.classList.remove('active');
    const next = gameState.level + 1;
    if (next <= levels.length) {
        loadLevel(next);
    } else {
        showFeedback('🎉 You\'ve completed ALL levels! You\'re a Wiring Master!', 'success');
        elements.nextBtn.disabled = true;
    }
}

// ----- EVENT LISTENERS -----
elements.checkBtn.addEventListener('click', checkConnections);
elements.resetBtn.addEventListener('click', resetLevel);
elements.nextBtn.addEventListener('click', nextLevel);
elements.continueBtn.addEventListener('click', nextLevel);

// Keyboard shortcut: Enter to check
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !gameState.isLevelComplete) {
        checkConnections();
    }
});

// ----- INITIALIZE -----
loadLevel(1);
setupDragDrop();

console.log('🔌 Fix Wiring Game Loaded!');
console.log('📚 Based on TUP-Manila ICT Student Research');
console.log('🎯 Drag wires to matching slots to restore power!');