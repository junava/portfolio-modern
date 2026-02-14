    // ==================== CONSTANTS ====================
    const COLS = 10;
    const VISIBLE_ROWS = 20;
    const BUFFER_ROWS = 20;
    const TOTAL_ROWS = VISIBLE_ROWS + BUFFER_ROWS; // 40
    const BLOCK_SIZE = 30;

    const COLORS = [
        '#00FFFF', // I
        '#0000FF', // J
        '#FF8000', // L
        '#FFFF00', // O
        '#00FF00', // S
        '#800080', // T
        '#FF0000'  // Z
    ];

    const PIECES = [
        // I (type 0)
        [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
        // J (type 1)
        [[2,0,0],[2,2,2],[0,0,0]],
        // L (type 2)
        [[0,0,3],[3,3,3],[0,0,0]],
        // O (type 3)
        [[4,4],[4,4]],
        // S (type 4)
        [[0,5,5],[5,5,0],[0,0,0]],
        // T (type 5)
        [[0,6,0],[6,6,6],[0,0,0]],
        // Z (type 6)
        [[7,7,0],[0,7,7],[0,0,0]]
    ];

    // Official Tetris gravity table (ms per line)
    const GRAVITY_TABLE = [
        1000, // level 1: 1.000 sec
        793,  // level 2: 0.793 sec
        618,  // level 3: 0.618 sec
        473,  // level 4: 0.473 sec
        355,  // level 5: 0.355 sec
        262,  // level 6: 0.262 sec
        190,  // level 7: 0.190 sec
        135,  // level 8: 0.135 sec
        94,   // level 9: 0.094 sec
        64,   // level 10: 0.064 sec
        43,   // level 11: 0.043 sec
        28,   // level 12: 0.028 sec
        18,   // level 13: 0.018 sec
        11,   // level 14: 0.011 sec
        7     // level 15: 0.007 sec
    ];
   // ==================== SRS KICK TABLES (including 180) ====================
const SRS_KICKS = {
    I: {
        '0->R': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
        'R->0': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
        'R->2': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
        '2->R': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
        '2->L': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
        'L->2': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
        'L->0': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
        '0->L': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
        // 180
        '0->2': [[0,0], [1,0], [2,0], [1,1], [2,1]],
        '2->0': [[0,0], [-1,0], [-2,0], [-1,-1], [-2,-1]],
        'R->L': [[0,0], [1,0], [2,0], [1,-1], [2,-1]],
        'L->R': [[0,0], [-1,0], [-2,0], [-1,1], [-2,1]]
    },
    JLSTZ: {
        '0->R': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
        'R->0': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
        'R->2': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
        '2->R': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
        '2->L': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
        'L->2': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
        'L->0': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
        '0->L': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
        // 180 (extended) – these are the standard 180 kicks, not the extended ones
        '0->2': [[0,0], [1,0], [2,0], [1,1], [2,1], [-1,0], [-2,0], [-1,1], [-2,1], [0,1], [3,0], [-3,0]],
        '2->0': [[0,0], [-1,0], [-2,0], [-1,-1], [-2,-1], [1,0], [2,0], [1,-1], [2,-1], [0,-1], [-3,0], [3,0]],
        'R->L': [[0,0], [1,0], [2,0], [1,-1], [2,-1], [-1,0], [-2,0], [-1,-1], [-2,-1], [0,-1], [3,0], [-3,0]],
        'L->R': [[0,0], [-1,0], [-2,0], [-1,1], [-2,1], [1,0], [2,0], [1,1], [2,1], [0,1], [-3,0], [3,0]]
    },
    O: {
        '0->R': [[0,0]], 'R->0': [[0,0]], 'R->2': [[0,0]], '2->R': [[0,0]],
        '2->L': [[0,0]], 'L->2': [[0,0]], 'L->0': [[0,0]], '0->L': [[0,0]],
        '0->2': [[0,0]], '2->0': [[0,0]], 'R->L': [[0,0]], 'L->R': [[0,0]]
    }
};
    // Scoring
    const LINE_SCORES = [0, 100, 300, 500, 800];
    const TSPIN_SCORES = {
        none: 0,
        mini: 100,
        miniSingle: 200,
        spin: 400,
        single: 800,
        double: 1200,
        triple: 1600
    };

    // Key names for UI
    const KEY_NAMES = {
        8:'Backspace',9:'Tab',13:'Enter',16:'Shift',17:'Ctrl',18:'Alt',27:'Esc',
        32:'Space',33:'PgUp',34:'PgDn',35:'End',36:'Home',37:'←',38:'↑',39:'→',40:'↓',
        45:'Insert',46:'Delete',48:'0',49:'1',50:'2',51:'3',52:'4',53:'5',54:'6',55:'7',56:'8',57:'9',
        65:'A',66:'B',67:'C',68:'D',69:'E',70:'F',71:'G',72:'H',73:'I',74:'J',75:'K',76:'L',77:'M',
        78:'N',79:'O',80:'P',81:'Q',82:'R',83:'S',84:'T',85:'U',86:'V',87:'W',88:'X',89:'Y',90:'Z'
    };

    // Default controls (your requested layout)
    const DEFAULT_CONTROLS = {
        MOVE_LEFT: 65,   // A
        MOVE_RIGHT: 68,  // D
        SOFT_DROP: 83,   // S
        HARD_DROP: 87,   // W
        ROTATE_CW: 39,   // Right Arrow
        ROTATE_CCW: 37,  // Left Arrow
        ROTATE_180: 40,  // Down Arrow
        HOLD: 16,        // Left Shift
        PAUSE: 71        // G
    };

    // ==================== TETRIS GAME CLASS ====================
    class Tetris {
        constructor() {
            // Load settings first so controls are set before reset
            this.loadSettings();
            this.reset();          // this no longer touches this.controls
            this.initUI();
            this.setupEvents();
        }

        reset() {
            this.board = Array(TOTAL_ROWS).fill().map(() => Array(COLS).fill(0));
            this.score = 0;
            this.lines = 0;
            this.level = 1;
            this.time = 0;
            this.piecesPlaced = 0;
            this.active = false;
            this.paused = false;
            this.over = false;
            this.ghost = true;
            this.bag = [];
            this.current = null;
            this.next = null;
            this.hold = null;
            this.canHold = true;
            this.previewQueue = [];
            this.combo = 0;
            this.b2b = 0;
            this.lastClearWasBig = false;
            this.lockDelay = 500;
            this.landTime = 0;
            this.lockTimer = 0;
            this.lockPiece = null;
            this.dropCounter = 0;
            this.speed = 1000;
            this.lastTime = 0;
            this.lastSecond = 0;
            this.rotationState = 0;
            this.maxCombo = 0;
            this.placing = false;
            // DAS/ARR values come from settings, not reset
            this.keys = {};
            this.dasTimers = {};
            this.arrTimers = {};
            this.landTime = 0;
            this.gameEnded = false;
            // DO NOT reset controls here – they remain from loadSettings
            // soft drop factor can be adjusted based on level or set to a constant multiplier of gravity
        this.softDropActive = false;
this.soundBasePath = 'sounds/'; // common base folder
this.soundFiles = {
    rotate: 'rotate.wav',
    hardDrop: 'harddrop.wav',
    lineClear: 'lineclear.wav',
    tetris: 'tetris.wav',
    tSpin: 'tspin.wav',
    hold: 'hold.wav',
    gameOver: 'gameover.wav',
    win: 'win.wav'
};


       this.muted = false;
    this.soundVolume = 1;
    this.softDropLandedSoundPlayed = false;


            
        }

        loadSettings() {
        const savedControls = localStorage.getItem('tetris-controls');
        if (savedControls) this.controls = JSON.parse(savedControls);
        else this.controls = { ...DEFAULT_CONTROLS };
        
        const das = localStorage.getItem('tetris-das');
        if (das) this.DAS = parseInt(das);
        else this.DAS = 100;
        
        const arr = localStorage.getItem('tetris-arr');
        if (arr) this.ARR = parseInt(arr);
        else this.ARR = 16;
        
        const sdf = localStorage.getItem('tetris-sdf');
        if (sdf) this.softDropFactor = parseFloat(sdf);
        else this.softDropFactor = 20;
        
        const sonic = localStorage.getItem('tetris-sonic');
        if (sonic) this.sonicDrop = sonic === 'true';
        else this.sonicDrop = false;

        const soundPack = localStorage.getItem('tetris-soundPack');
        if (soundPack) this.soundPack = soundPack;
    }

    saveSettings() {
        localStorage.setItem('tetris-controls', JSON.stringify(this.controls));
        localStorage.setItem('tetris-das', this.DAS);
        localStorage.setItem('tetris-arr', this.ARR);
    
        localStorage.setItem('tetris-sdf', this.softDropFactor);
        localStorage.setItem('tetris-sonic', this.sonicDrop);
        localStorage.setItem('tetris-soundPack', this.soundPack);
    }

        // ==================== PIECE GENERATION ====================
        newPiece() {
            if (this.bag.length === 0) {
                this.bag = [0,1,2,3,4,5,6];
                for (let i = this.bag.length-1; i>0; i--) {
                    const j = Math.floor(Math.random()*(i+1));
                    [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
                }
            }
            const type = this.bag.shift();
            return {
                type: type,
                x: Math.floor(COLS/2) - Math.floor(PIECES[type][0].length/2),
                y: type === 0 ? 19 : 20,
                matrix: PIECES[type].map(row => [...row]),
                rotation: 0
            };
        }

        updatePreviewQueue() {
            let tempBag = [...this.bag];
            let preview = [];
            for (let i=0; i<5; i++) {
                if (tempBag.length===0) {
                    tempBag = [0,1,2,3,4,5,6];
                    for (let j=tempBag.length-1; j>0; j--) {
                        const k = Math.floor(Math.random()*(j+1));
                        [tempBag[j], tempBag[k]] = [tempBag[k], tempBag[j]];
                    }
                }
                preview.push(tempBag.shift());
            }
            this.previewQueue = preview;
        }

        // ==================== COLLISION ====================
        collision(piece = this.current) {
            if (!piece) return true;
            for (let y=0; y<piece.matrix.length; y++) {
                for (let x=0; x<piece.matrix[y].length; x++) {
                    if (piece.matrix[y][x]) {
                        const boardY = y + piece.y;
                        const boardX = x + piece.x;
                        if (boardY >= TOTAL_ROWS || boardX < 0 || boardX >= COLS) return true;
                        if (boardY >= 0 && this.board[boardY] && this.board[boardY][boardX]) return true;
                    }
                }
            }
            return false;
        }

        // ==================== MOVEMENT ====================
        move(dir) {
            if (!this.active || this.paused || this.over) return;
            this.current.x += dir;
            if (this.collision()) this.current.x -= dir;
            else if (this.lockPiece) {
                this.lockPiece = {
                    matrix: this.current.matrix.map(r=>[...r]),
                    x: this.current.x,
                    y: this.current.y
                };
                this.lockTimer = this.lockDelay;
                this.landTime = 0;
            }   
            this.draw();
        }

        // ==================== ROTATION ====================
        rotate(dir) {
            if (!this.active || this.paused || this.over || !this.current) return;

            const oldMatrix = this.current.matrix.map(r=>[...r]);
            const oldX = this.current.x;
            const oldY = this.current.y;
            const oldRot = this.current.rotation;

            let newRot;
            if (dir === 1) newRot = (oldRot + 1) % 4;
            else if (dir === -1) newRot = (oldRot + 3) % 4;
            else if (dir === 2) newRot = (oldRot + 2) % 4;

            const size = this.current.matrix.length;
            const rotated = Array(size).fill().map(()=>Array(size).fill(0));
            for (let y=0; y<size; y++) {
                for (let x=0; x<size; x++) {
                    if (this.current.matrix[y][x]) {
                        if (dir === 1) rotated[x][size-1-y] = this.current.matrix[y][x];
                        else if (dir === -1) rotated[size-1-x][y] = this.current.matrix[y][x];
                        else if (dir === 2) rotated[size-1-y][size-1-x] = this.current.matrix[y][x];
                    }
                }
            }
            this.current.matrix = rotated;

            if (this.current.type !== 3) {
                const pieceType = this.current.type === 0 ? 'I' : 'JLSTZ';
                const stateNames = ['0','R','2','L'];
                const from = stateNames[oldRot];
                const to = stateNames[newRot];
                const trans = `${from}->${to}`;
                const kicks = SRS_KICKS[pieceType][trans];
                if (kicks) {
                    for (let [dx, dy] of kicks) {
                        this.current.x = oldX + dx;
                        this.current.y = oldY + dy;
                        if (this.current.x >= -2 && this.current.x + this.current.matrix[0].length <= COLS+2 && !this.collision()) {
                            this.current.rotation = newRot;
                            if (this.lockPiece) {
                                this.lockPiece = {
                                    matrix: this.current.matrix.map(r=>[...r]),
                                    x: this.current.x,
                                    y: this.current.y
                                };
                                this.lockTimer = this.lockDelay;
                            }
                            this.landTime = 0;
                            this.playSound('rotate');
                            this.draw();
                            return;
                        }
                    }
                }
            }

            // revert
            this.current.matrix = oldMatrix;
            this.current.x = oldX;
            this.current.y = oldY;
            this.current.rotation = oldRot;
            this.draw();
        }

        // ==================== DROP ====================
        drop() {
        if (!this.active || this.paused || this.over) return;

        // Sonic drop handling (if enabled)
        if (this.sonicDrop && this.keys[this.controls.SOFT_DROP]) {
            for (let i = 0; i < 10; i++) {
                const oldY = this.current.y;
                this.current.y++;
                if (this.collision()) {
                    this.current.y = oldY;
                    break;
                }
            }
            this.draw();
            return;
        }

        // Soft drop with factor
        if (this.keys[this.controls.SOFT_DROP] && this.softDropFactor > 0) {
            if (this.softDropFactor >= 100) {
                while (!this.collision()) this.current.y++;
                this.current.y--;
                // Play sound if soft drop key held
    if (this.softDropActive && !this.softDropLandedSoundPlayed) {
        this.playSound('softDrop');
        this.softDropLandedSoundPlayed = true;  
           }
                this.placePiece();
                this.landTime = 0;
                return;
            } else {
                const moves = Math.max(1, Math.floor(this.softDropFactor / 5));
                for (let i = 0; i < moves; i++) {
                    const oldY = this.current.y;
                    this.current.y++;
                    if (this.collision()) {
                        this.current.y = oldY;
                        break;
                    }
                }
                this.draw();
                return;
            }
        }

        // Normal gravity drop
        const oldY = this.current.y;
        this.current.y++;

        if (this.collision()) {
            this.current.y = oldY; // revert

             // Play soft drop sound if the key is held and we haven't played it for this landing
    if (this.softDropActive && !this.softDropLandedSoundPlayed) {
        
        this.playSound('softDrop');
        this.softDropLandedSoundPlayed = true;
    } else {
    // Piece is falling – clear landing state
    this.landTime = 0;
    this.lockPiece = null;
    this.softDropLandedSoundPlayed = false;   // ← add this
}
            // Piece has landed – start or reset lock timer
            const now = performance.now();
            if (this.landTime === 0) {
                // First time landing
                this.landTime = now;
            } else {
                // Check if piece moved since last landing
                const moved = this.current.x !== (this.lockPiece?.x ?? this.current.x) ||
                            this.current.y !== (this.lockPiece?.y ?? this.current.y) ||
                            JSON.stringify(this.current.matrix) !== JSON.stringify(this.lockPiece?.matrix);
                if (moved) {
                    this.landTime = now; // reset timer
                }
            }
            // Store current state for move detection
            this.lockPiece = {
                matrix: this.current.matrix.map(r => [...r]),
                x: this.current.x,
                y: this.current.y
            };
        } else {
            // Piece is falling – clear landing state
            this.landTime = 0;
            this.lockPiece = null;
        }
        this.draw();
    }

        hardDrop() {
        if (!this.active || this.paused || this.over) return;
        while (!this.collision()) this.current.y++;
        this.current.y--;
        this.placePiece();
        this.playSound('hardDrop');
        this.landTime = 0;
        this.lockPiece = null;
    }

        // ==================== PLACE PIECE & LINE CLEAR ====================
    placePiece() {
    if (this.placing) return;          // prevent re‑entrancy
    this.placing = true;


    // Merge current piece into the board
    for (let y = 0; y < this.current.matrix.length; y++) {
        for (let x = 0; x < this.current.matrix[y].length; x++) {
            if (this.current.matrix[y][x]) {
                const boardY = this.current.y + y;
                if (boardY >= 0 && boardY < TOTAL_ROWS) {
                    this.board[boardY][this.current.x + x] = this.current.type + 1;
                }
            }
        }
    }
    this.piecesPlaced++;

    this.clearLines();      // handles line detection, scoring, and sprint check
    this.resetPiece();

    this.placing = false;
}
        checkTSpin() {
        return this.checkTSpinType() !== 'none';
    }

    checkTSpinType() {
        if (this.current.type !== 5) return 'none'; // Only T piece
        
        // Get the four corners around the T piece
        const corners = [
            [this.current.x, this.current.y],           // top-left
            [this.current.x + 2, this.current.y],       // top-right
            [this.current.x, this.current.y + 2],       // bottom-left
            [this.current.x + 2, this.current.y + 2]    // bottom-right
        ];
        
        let filledCorners = 0;
        let frontCorners = 0;
        
        // Check each corner
        corners.forEach(([x, y], index) => {
            if (x < 0 || x >= COLS || y >= TOTAL_ROWS) {
                filledCorners++;
                // Count front corners based on rotation
                if (this.current.rotation === 0 && (index === 2 || index === 3)) frontCorners++;
                else if (this.current.rotation === 1 && (index === 0 || index === 2)) frontCorners++;
                else if (this.current.rotation === 2 && (index === 0 || index === 1)) frontCorners++;
                else if (this.current.rotation === 3 && (index === 1 || index === 3)) frontCorners++;
            } else if (y >= 0 && this.board[y] && this.board[y][x]) {
                filledCorners++;
                // Count front corners based on rotation
                if (this.current.rotation === 0 && (index === 2 || index === 3)) frontCorners++;
                else if (this.current.rotation === 1 && (index === 0 || index === 2)) frontCorners++;
                else if (this.current.rotation === 2 && (index === 0 || index === 1)) frontCorners++;
                else if (this.current.rotation === 3 && (index === 1 || index === 3)) frontCorners++;
            }
        });
        
        // T-Spin requires at least 3 corners filled
        if (filledCorners >= 3) {
            // Mini T-Spin if only 3 corners filled and specific pattern
            if (filledCorners === 3 && frontCorners === 2) {
                return 'mini';
            }
            return 'full';
        }
        
        return 'none';
    }
    clearLines() {
    let linesCleared = 0;
    for (let y = TOTAL_ROWS - 1; y >= TOTAL_ROWS - VISIBLE_ROWS; y--) {
        if (this.board[y].every(cell => cell !== 0)) {
            this.board.splice(y, 1);
            this.board.unshift(Array(COLS).fill(0));
            y++;
            linesCleared++;
            this.lines++;
        }
    }

    if (linesCleared > 0) {
        const isTSpin = this.checkTSpin();
        let baseScore = 0;
        if (isTSpin) {
            if (linesCleared === 0) baseScore = 400;
            else if (linesCleared === 1) baseScore = 800;
            else if (linesCleared === 2) baseScore = 1200;
            else if (linesCleared === 3) baseScore = 1600;
        } else {
            if (linesCleared === 1) baseScore = 100;
            else if (linesCleared === 2) baseScore = 300;
            else if (linesCleared === 3) baseScore = 500;
            else if (linesCleared === 4) baseScore = 800;
        }
        if (linesCleared === 4) {
        this.playSound('tetris');
        } else if (linesCleared > 0) {
        this.playSound('lineClear');
        }
        if (isTSpin) {
        this.playSound('tSpin');
        }

        let addScore = baseScore * this.level;

        const isBig = (linesCleared >= 4 || isTSpin);
        if (isBig && this.lastClearWasBig) {
            this.b2b++;
            addScore = Math.floor(addScore * 1.5);
        } else if (isBig) {
            this.b2b = 0;
        } else {
            this.b2b = 0;
        }
        this.lastClearWasBig = isBig;

        this.combo = (this.combo || 0) + 1;
        addScore += this.combo * 10;
        this.maxCombo = Math.max(this.maxCombo || 0, this.combo);

        this.score += addScore;

        this.level = Math.floor(this.lines / 10) + 1;
        const tableIndex = Math.min(this.level, 15) - 1;
        this.speed = GRAVITY_TABLE[tableIndex];

        // SPRINT CHECK
        if (this.mode === 'sprint' && this.lines >= 40) {
            console.log("SPRINT FINISHED! Calling endGame(true)");
            this.lines = 40;
            this.endGame(true);
            return; // stop further execution
        }
    } else {
        this.combo = 0;
    }
    this.updateUI();
}

        resetPiece() {
            this.current = this.next;
            this.next = this.newPiece();
            this.canHold = true;
            if (this.current) this.current.rotation = 0;
            this.updatePreviewQueue();
            if (this.collision()) this.endGame();
            this.draw();
            this.drawNext();
            this.drawHold();
            this.drawPreview();
            this.softDropLandedSoundPlayed = false;
        }

        holdPiece() {
        if (!this.active || this.paused || this.over || !this.canHold || !this.current) return;
        
        // Store the current piece type
        const currentType = this.current.type;
        
        if (this.hold === null) {
            // First hold - store current and get next piece
            this.hold = currentType;
            this.current = this.next;
            this.next = this.newPiece();
        } else {
            // Swap hold with current
            const tempHold = this.hold;
            this.hold = currentType;
            this.current.type = tempHold;
            this.current.matrix = PIECES[tempHold].map(row => [...row]);
            this.current.x = Math.floor(COLS/2) - Math.floor(PIECES[tempHold][0].length/2);
            this.current.y = tempHold === 0 ? 19 : 20; // I piece spawns higher
            this.current.rotation = 0;
        }
        
        // Check if the new piece collides immediately
        if (this.collision()) {
            this.endGame();
            return;
        }
        
        this.canHold = false;
        this.drawHold();
        this.draw();
    }

        // ==================== GAME CONTROL ====================
        start() {
        if (this.active && !this.over) return;
        if (this.over) this.reset(); // Reset if game was over
        
        this.active = true;
        this.paused = false;
        this.over = false;
        this.current = this.newPiece();
        this.next = this.newPiece();
        this.updatePreviewQueue();
        this.drawNext();
        this.drawHold();
        this.drawPreview();
        this.updateUI();
        this.lastTime = performance.now();
        this.lastSecond = performance.now();
        this.gameLoop();
    }

        pause() {
            if (!this.active || this.over) return;
            this.paused = !this.paused;
            if (!this.paused) {
                this.lastTime = performance.now();
                this.lastSecond = performance.now();
                this.gameLoop();
            }
            this.updateUI();
        }

        endGame(isWin = false) {
        // Prevent multiple calls
        if (this.gameEnded) return;
        this.gameEnded = true;
        
        this.active = false;
        this.over = true;
        this.lockPiece = null;
        this.lockTimer = 0;
        this.landTime = 0;

        const status = document.getElementById('status');
        if (!status) return;

        if (isWin) {
            const minutes = Math.floor(this.time / 60);
            const seconds = Math.floor(this.time % 60);
            const ms = Math.floor((this.time * 1000) % 1000);
            const timeStr = `${minutes}:${seconds.toString().padStart(2,'0')}.${ms.toString().padStart(3,'0')}`;
            const avgPPS = this.time > 0 ? (this.piecesPlaced / this.time).toFixed(2) : '0.00';
            const maxCombo = this.maxCombo || 0;

            status.innerHTML = `SPRINT FINISHED! <br> Time: ${timeStr} PPS: ${avgPPS} Max Combo: ${maxCombo}`;
            status.style.whiteSpace = 'pre-line';
            status.style.lineHeight = '1.5';
            status.style.textAlign = 'center';
        } else {
            status.textContent = 'GAME OVER';
        }
        status.className = 'game-status gameover';

        this.updateUI();
    }
        gameLoop(time = 0) {
        // CRITICAL: Check game over state FIRST
        if (!this.active || this.over) return;

        // DAS update
        const now = time;
        [this.controls.MOVE_LEFT, this.controls.MOVE_RIGHT].forEach((key, idx) => {
            if (this.keys[key]) {
                if (!this.dasTimers[key]) {
                    this.dasTimers[key] = now;
                    this.move(idx === 0 ? -1 : 1);
                }
                const held = now - this.dasTimers[key];
                if (held >= this.DAS) {
                    if (!this.arrTimers[key]) this.arrTimers[key] = now;
                    const arrHeld = now - this.arrTimers[key];
                    if (arrHeld >= this.ARR) {
                        this.move(idx === 0 ? -1 : 1);
                        this.arrTimers[key] = now;
                    }
                }
            } else {
                delete this.dasTimers[key];
                delete this.arrTimers[key];
            }
        });

        const delta = time - this.lastTime;
        this.lastTime = time;

        if (!this.paused) {
            if (time - this.lastSecond >= 10) {
                this.time += (time - this.lastSecond) / 1000;
                this.lastSecond = time;
                this.updateUI();
            }

            // Lock delay: if piece has been on ground too long, place it
if (this.landTime !== 0) {
    const now = performance.now();
    if (now - this.landTime >= this.lockDelay) {
        this.placePiece();
        this.landTime = 0;
        this.lockPiece = null;
        if (this.over) return;
    }
}
    // Gravity: always try to move the piece down
    this.dropCounter += delta;
    if (this.dropCounter > this.speed) {
        // Only attempt drop if piece exists and game is active
        if (this.current) {
            const oldY = this.current.y;
            this.current.y++;
            if (this.collision()) {
                this.current.y = oldY; // revert
                // When collision occurs, start lock timer if not already
                if (this.landTime === 0) {
                    this.landTime = performance.now();
                    this.lockPiece = {
                        matrix: this.current.matrix.map(r=>[...r]),
                        x: this.current.x,
                        y: this.current.y
                    };
                }
            } else {
                // Successfully moved down – clear any lock state
                console.log('Gravity moved piece to y=', this.current.y);
                this.landTime = 0;
                this.lockPiece = null;
            }
        }
        this.dropCounter = 0;
    }


            if (this.keys[this.controls.SOFT_DROP]) {
                this.drop();
                // Check after soft drop
                if (this.over) return;
            }

            this.draw();
        }

        requestAnimationFrame(t => this.gameLoop(t));
    }

        // ==================== DRAWING ====================
        draw() {
            const canvas = document.getElementById('game');
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000';
            ctx.fillRect(0,0,canvas.width,canvas.height);

            const visibleStart = TOTAL_ROWS - VISIBLE_ROWS;

            // board
            for (let y=0; y<VISIBLE_ROWS; y++) {
                for (let x=0; x<COLS; x++) {
                    const boardY = visibleStart + y;
                    if (this.board[boardY] && this.board[boardY][x]) {
                        ctx.fillStyle = COLORS[this.board[boardY][x]-1];
                        ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        ctx.fillStyle = '#ffffff33';
                        ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE-1, 2);
                        ctx.fillRect(x*BLOCK_SIZE, y*BLOCK_SIZE, 2, BLOCK_SIZE-1);
                        ctx.strokeStyle = '#00000040';
                        ctx.strokeRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    }
                }
            }

            // ghost (only if active and not over)
            if (this.ghost && this.current && this.active && !this.over) {
                const ghost = {
                    x: this.current.x,
                    y: this.current.y,
                    matrix: this.current.matrix.map(r=>[...r])
                };
                while (!this.collision(ghost)) ghost.y++;
                ghost.y--;
                if (ghost.y >= visibleStart - 4) {
                    ctx.strokeStyle = '#ffffff80';
                    ctx.lineWidth = 2;
                    for (let y=0; y<ghost.matrix.length; y++) {
                        for (let x=0; x<ghost.matrix[y].length; x++) {
                            if (ghost.matrix[y][x]) {
                                const screenY = (ghost.y + y - visibleStart) * BLOCK_SIZE;
                                if (screenY < canvas.height) {
                                    ctx.strokeRect(
                                        (ghost.x + x) * BLOCK_SIZE + 1,
                                        screenY + 1,
                                        BLOCK_SIZE - 2,
                                        BLOCK_SIZE - 2
                                    );
                                }
                            }
                        }
                    }
                }
            }

            // current piece (only if active and not over)
            if (this.current && this.active && !this.over) {
                for (let y=0; y<this.current.matrix.length; y++) {
                    for (let x=0; x<this.current.matrix[y].length; x++) {
                        if (this.current.matrix[y][x]) {
                            const screenY = (this.current.y + y - visibleStart) * BLOCK_SIZE;
                            if (screenY >= -BLOCK_SIZE && screenY < canvas.height) {
                                ctx.fillStyle = COLORS[this.current.type];
                                ctx.fillRect((this.current.x + x) * BLOCK_SIZE, screenY, BLOCK_SIZE, BLOCK_SIZE);
                                ctx.fillStyle = '#ffffff30';
                                ctx.fillRect((this.current.x + x) * BLOCK_SIZE, screenY, BLOCK_SIZE-1, 2);
                                ctx.fillRect((this.current.x + x) * BLOCK_SIZE, screenY, 2, BLOCK_SIZE-1);
                                ctx.strokeStyle = '#00000040';
                                ctx.strokeRect((this.current.x + x) * BLOCK_SIZE, screenY, BLOCK_SIZE, BLOCK_SIZE);
                            }
                        }
                    }
                }
            }

            // grid
            ctx.strokeStyle = '#ffffff1a';
            ctx.lineWidth = 0.5;
            for (let x=0; x<=COLS; x++) {
                ctx.beginPath();
                ctx.moveTo(x*BLOCK_SIZE, 0);
                ctx.lineTo(x*BLOCK_SIZE, VISIBLE_ROWS*BLOCK_SIZE);
                ctx.stroke();
            }
            for (let y=0; y<=VISIBLE_ROWS; y++) {
                ctx.beginPath();
                ctx.moveTo(0, y*BLOCK_SIZE);
                ctx.lineTo(COLS*BLOCK_SIZE, y*BLOCK_SIZE);
                ctx.stroke();
            }

            // Buffer zone indicator (semi‑transparent overlay)
const bufferHeight = visibleStart * BLOCK_SIZE; // rows above the visible area
ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';   // very faint white
ctx.fillRect(0, 0, canvas.width, bufferHeight);

// Optional: draw a dashed line at the skyline (already have the green line)
// You can also add a subtle pattern:
ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
ctx.lineWidth = 1;
ctx.setLineDash([5, 5]);
for (let y = 0; y < bufferHeight; y += BLOCK_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
}
ctx.setLineDash([]);
            // vanish zone line
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(COLS*BLOCK_SIZE,0);
            ctx.stroke();
        }

        drawNext() {
            const canvas = document.getElementById('next');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if (this.next) this.drawPiecePreview(ctx, this.next);
        }

        drawHold() {
            const canvas = document.getElementById('hold');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if (this.hold !== null) {
                const piece = { type: this.hold, matrix: PIECES[this.hold] };
                this.drawPiecePreview(ctx, piece);
            } else {
                // Optionally draw empty state
            }
        }

        drawPreview() {
            const canvas = document.getElementById('preview-queue');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = '#888';
            ctx.font = '12px monospace';
            ctx.fillText('NEXT', 10, 20);
            const blockSize = 20;
            const pieceHeight = 80;
            for (let i=0; i<Math.min(5, this.previewQueue.length); i++) {
                const type = this.previewQueue[i];
                const matrix = PIECES[type];
                const color = COLORS[type];
                const startY = 40 + i * pieceHeight;
                const offX = (canvas.width - matrix[0].length * blockSize) / 2;
                const offY = startY + (pieceHeight - matrix.length * blockSize) / 2;
                ctx.fillStyle = '#666';
                ctx.font = '10px monospace';
                ctx.fillText(`${i+1}.`, 5, startY + 15);
                for (let y=0; y<matrix.length; y++) {
                    for (let x=0; x<matrix[y].length; x++) {
                        if (matrix[y][x]) {
                            ctx.fillStyle = color;
                            ctx.fillRect(offX + x*blockSize, offY + y*blockSize, blockSize, blockSize);
                            ctx.fillStyle = '#ffffff30';
                            ctx.fillRect(offX + x*blockSize, offY + y*blockSize, blockSize-1, 2);
                            ctx.fillRect(offX + x*blockSize, offY + y*blockSize, 2, blockSize-1);
                            ctx.strokeStyle = '#00000040';
                            ctx.strokeRect(offX + x*blockSize, offY + y*blockSize, blockSize, blockSize);
                        }
                    }
                }
            }
        }

        drawPiecePreview(ctx, piece) {
            const matrix = piece.matrix;
            const color = COLORS[piece.type];
            const blockSize = 25;
            const w = ctx.canvas.width, h = ctx.canvas.height;
            const offX = (w - matrix[0].length * blockSize) / 2;
            const offY = (h - matrix.length * blockSize) / 2;
            for (let y=0; y<matrix.length; y++) {
                for (let x=0; x<matrix[y].length; x++) {
                    if (matrix[y][x]) {
                        ctx.fillStyle = color;
                        ctx.fillRect(offX + x*blockSize, offY + y*blockSize, blockSize, blockSize);
                        ctx.strokeStyle = '#00000040';
                        ctx.strokeRect(offX + x*blockSize, offY + y*blockSize, blockSize, blockSize);
                    }
                }
            }
        }

        updateUI() {
        // Helper to safely set text content
        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        const setStyle = (id, prop, value) => {
            const el = document.getElementById(id);
            if (el) el.style[prop] = value;
        };

        setText('score', this.score);
        setText('lines', this.lines);
        setText('level', this.level);
        
        // Format time with milliseconds
        const minutes = Math.floor(this.time / 60);
        const seconds = Math.floor(this.time % 60);
        const milliseconds = Math.floor((this.time * 1000) % 1000);
        setText('time', `${minutes}:${seconds.toString().padStart(2,'0')}.${milliseconds.toString().padStart(3,'0')}`);
        
        if (this.time > 0) {
            setText('pps', (this.piecesPlaced / this.time).toFixed(2));
        } else {
            setText('pps', '0.00');
        }
        
        setStyle('progress', 'width', `${Math.min(100, (this.lines/40)*100)}%`);
        setText('combo', this.combo);
        setText('b2b', this.b2b);

        // Don't override status if game is over (handled in endGame)
        if (!this.over) {
            const status = document.getElementById('status');
            if (status) {
                if (this.paused) {
                    status.textContent = 'PAUSED';
                    status.className = 'game-status paused';
                } else if (this.active) {
                    status.textContent = 'PLAYING';
                    status.className = 'game-status playing';
                } else {
                    status.textContent = 'READY';
                    status.className = 'game-status';
                }
            }
        }
    }
    playSound(name) {
    if (this.muted) return;
    const filename = this.soundFiles[name];
    if (!filename) return;

    const path = `${this.soundBasePath}${this.soundPack}/${filename}`;
    console.log('Playing sound from:', path);
    const audio = new Audio(path);
    audio.volume = this.soundVolume ?? 0.5;
        audio.play().catch(err => console.error('Audio play error:', err));
    }
        initUI() {
            this.draw();
            this.drawNext();
            this.drawHold();
            this.drawPreview();
            this.updateUI();
        }

        setupEvents() {
        document.getElementById('start-btn').addEventListener('click', ()=>this.start());
        document.getElementById('pause-btn').addEventListener('click', ()=>this.pause());
        document.getElementById('reset-btn').addEventListener('click', ()=>{
            this.reset();
            this.draw();
            this.drawNext();
            this.drawHold();
            this.drawPreview();
            this.updateUI();
        });

        document.getElementById('mode-endless').addEventListener('click', ()=>{
            this.mode = 'endless';
            document.getElementById('mode-endless').classList.add('active');
            document.getElementById('mode-sprint').classList.remove('active');
        });
        
        document.getElementById('mode-sprint').addEventListener('click', ()=>{
            this.mode = 'sprint';
            document.getElementById('mode-sprint').classList.add('active');
            document.getElementById('mode-endless').classList.remove('active');
        });

        document.getElementById('controls-btn').addEventListener('click', ()=>this.showControls());
        document.getElementById('close-controls').addEventListener('click', ()=>this.hideControls());
        document.getElementById('save-controls').addEventListener('click', ()=>{
            this.saveSettings();
            this.hideControls();
        });
        
        document.getElementById('reset-defaults').addEventListener('click', ()=>{
            this.controls = {...DEFAULT_CONTROLS};
            this.DAS = 100;
            this.ARR = 16;
            this.softDropFactor = 20;  // Reset SDF
            this.sonicDrop = false;     // Reset sonic drop
            this.saveSettings();
            this.showControls();
        });

        // DAS/ARR sliders - these exist in the HTML from the start
        const dasSlider = document.getElementById('das-slider');
        if (dasSlider) {
            dasSlider.addEventListener('input', (e)=>{
                this.DAS = parseInt(e.target.value);
                document.getElementById('das-value').textContent = this.DAS;
            });
        }

        const arrSlider = document.getElementById('arr-slider');
        if (arrSlider) {
            arrSlider.addEventListener('input', (e)=>{
                this.ARR = parseInt(e.target.value);
                document.getElementById('arr-value').textContent = this.ARR;
            });
        }

        // REMOVED: The SDF and sonic checkbox listeners from here
        // They will be added dynamically in showControls()

        // Keyboard
        document.addEventListener('keydown', (e)=>{
            // Prevent default for all game control keys
            if (Object.values(this.controls).includes(e.keyCode) || 
                (this.isListening && e.keyCode !== 27)) {
                e.preventDefault();
            }

            if (this.isListening) {
    e.preventDefault();
    if (e.keyCode === 27) { // ESC
        this.isListening = false;
        this.showControls();
        return;
    }
    // Remove this key from any other action
    for (let act in this.controls) {
        if (this.controls[act] === e.keyCode) {
            this.controls[act] = 0; // mark as unassigned
        }
    }
    // Assign to current action
    this.controls[this.listeningAction] = e.keyCode;
    this.saveSettings();
    this.isListening = false;
    this.showControls(); // refresh modal
    return;
}
            
            if (e.keyCode === this.controls.SOFT_DROP) {
        this.softDropActive = true;
    }

            this.keys[e.keyCode] = true;
            if (e.keyCode === this.controls.ROTATE_CW) this.rotate(1);
            else if (e.keyCode === this.controls.ROTATE_CCW) this.rotate(-1);
            else if (e.keyCode === this.controls.ROTATE_180) this.rotate(2);
            else if (e.keyCode === this.controls.HARD_DROP) this.hardDrop();
            else if (e.keyCode === this.controls.HOLD) this.holdPiece();
            else if (e.keyCode === this.controls.PAUSE) this.pause();
            // left/right handled via DAS in gameLoop
        });

        document.addEventListener('keyup', (e)=>{
            if (e.keyCode === this.controls.SOFT_DROP) {
    this.softDropActive = false;
}
this.keys[e.keyCode] = false;
        });
    }
        showControls() {
        const modal = document.getElementById('controls-modal');
        const list = document.getElementById('controls-list');
        const controls = [
            {key:'MOVE_LEFT', label:'Move Left'},
            {key:'MOVE_RIGHT', label:'Move Right'},
            {key:'SOFT_DROP', label:'Soft Drop'},
            {key:'HARD_DROP', label:'Hard Drop'},
            {key:'ROTATE_CW', label:'Rotate CW'},
            {key:'ROTATE_CCW', label:'Rotate CCW'},
            {key:'ROTATE_180', label:'Rotate 180°'},
            {key:'HOLD', label:'Hold'},
            {key:'PAUSE', label:'Pause'}
        ];
        
        // Build only the controls grid HTML (not the sliders)
        let html = '';
        controls.forEach(c => {
            html += `
    <div class="control-row">
        <span class="control-label">${c.label}</span>
        <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="control-key" id="key-${c.key}">${this.controls[c.key] === 0 ? '—' : (KEY_NAMES[this.controls[c.key]] || this.controls[c.key])}</span>
            <button class="control-change" data-action="${c.key}">Change</button>
        </div>
    </div>
`;
        });
        list.innerHTML = html;

        // Add change button listeners
        document.querySelectorAll('.control-change').forEach(btn => {
            btn.addEventListener('click', (e)=>{
                this.listeningAction = e.target.dataset.action;
                this.isListening = true;
                e.target.textContent = 'Press key...';
            });
        });

        // Set DAS/ARR slider values (they already exist in the modal)
        document.getElementById('das-slider').value = this.DAS;
        document.getElementById('arr-slider').value = this.ARR;
        document.getElementById('das-value').textContent = this.DAS;
        document.getElementById('arr-value').textContent = this.ARR;

        // ============ NEW: Soft Drop Factor slider (add to existing slider row) ============
        const sliderRow = document.querySelector('.slider-row');
        if (sliderRow) {
            // Check if SDF slider already exists to avoid duplicates
            if (!document.getElementById('sdf-slider')) {
                // Create new slider group for Soft Drop Factor
                const sdfGroup = document.createElement('div');
                sdfGroup.className = 'slider-group';
                sdfGroup.innerHTML = `
                    <label>Soft Drop Factor: <span id="sdf-value">${this.softDropFactor}</span>x</label>
                    <input type="range" id="sdf-slider" min="1" max="200" value="${this.softDropFactor}" step="1">
                    <small style="color:#888; display:block; margin-top:4px;">Higher = faster (200 ≈ instant)</small>
                `;
                sliderRow.appendChild(sdfGroup);
            } else {
                // Just update values if it already exists
                document.getElementById('sdf-slider').value = this.softDropFactor;
                document.getElementById('sdf-value').textContent = this.softDropFactor;
            }
        }
const modalButtons = document.querySelector('.modal-buttons');
        // ============ NEW: Sonic Drop checkbox ============
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            // Check if sonic checkbox already exists
            if (!document.getElementById('sonic-checkbox')) {
                const sonicContainer = document.createElement('div');
                sonicContainer.style.margin = '15px 0 10px 0';
                sonicContainer.style.textAlign = 'left';
                sonicContainer.innerHTML = `
                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                        <input type="checkbox" id="sonic-checkbox" ${this.sonicDrop ? 'checked' : ''}>
                        <span style="color:#ccc;">Sonic Drop (∞ mode) - instant soft drop without locking</span>
                    </label>
                `;
                // Insert before the modal buttons
                const modalButtons = document.querySelector('.modal-buttons');
                modalContent.insertBefore(sonicContainer, modalButtons);
            } else {
                // Just update checkbox state
                document.getElementById('sonic-checkbox').checked = this.sonicDrop;
            }
        }
// ============ Sound Pack Selector ============
if (modalButtons) {
    // Remove old sound pack container if it exists
    const oldContainer = document.getElementById('sound-pack-container');
    if (oldContainer) oldContainer.remove();

    const soundPackHTML = `
        <div id="sound-pack-container" style="margin:1rem 0;">
            <label style="display:block; font-family:var(--mono); color:var(--accent); margin-bottom:0.5rem;">
                Sound Pack
            </label>
            <div style="display:flex; gap:1.5rem;">
                <label style="display:flex; align-items:center; gap:0.3rem;">
                    <input type="radio" name="soundPack" value="glitch" ${this.soundPack === 'glitch' ? 'checked' : ''}>
                    <span>Glitch</span>
                </label>
                <label style="display:flex; align-items:center; gap:0.3rem;">
                    <input type="radio" name="soundPack" value="hardstyle" ${this.soundPack === 'hardstyle' ? 'checked' : ''}>
                    <span>DISTORTIOOOOOON</span>
                </label>
            </div>
        </div>
    `;
    modalButtons.insertAdjacentHTML('beforebegin', soundPackHTML);

    // Add event listeners to the new radios
    document.querySelectorAll('input[name="soundPack"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            this.soundPack = e.target.value;
            this.saveSettings();
        });
    });
}
        // Add event listeners for new controls (remove old ones first to avoid duplicates)
        const oldSdfSlider = document.getElementById('sdf-slider');
        if (oldSdfSlider) {
            const newSdfSlider = oldSdfSlider.cloneNode(true);
            oldSdfSlider.parentNode.replaceChild(newSdfSlider, oldSdfSlider);
            newSdfSlider.addEventListener('input', (e) => {
                this.softDropFactor = parseInt(e.target.value);
                document.getElementById('sdf-value').textContent = this.softDropFactor;
            });
        }

        const oldSonicCheck = document.getElementById('sonic-checkbox');
        if (oldSonicCheck) {
            const newSonicCheck = oldSonicCheck.cloneNode(true);
            oldSonicCheck.parentNode.replaceChild(newSonicCheck, oldSonicCheck);
            newSonicCheck.addEventListener('change', (e) => {
                this.sonicDrop = e.target.checked;
            });
        }

        modal.style.display = 'flex';
    }
        

        hideControls() {
            document.getElementById('controls-modal').style.display = 'none';
            this.isListening = false;
        }
    }

    // Initialize game

    const game = new Tetris();


