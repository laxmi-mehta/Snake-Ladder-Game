let tog = 1;
let rollingSound = new Audio("/assets/rolling-sound.mp3");
let winSound = new Audio("/assets/winner-sound.mp3");

let p1sum = 0;
let p2sum = 0;

const snakesAndLadders = {
    1: 38, 4: 14, 8: 30, 21: 42, 28: 76, 32: 10, 36: 6,
    48: 26, 50: 67, 62: 18, 71: 92, 80: 99, 88: 24, 95: 56, 97: 78
};

function getBoardPosition(pos) {
    let row = Math.floor((pos - 1) / 10);
    let col = (pos - 1) % 10;
    let left = row % 2 === 0 ? col * 62 : (9 - col) * 62;
    let top = -row * 62;
    return { left, top };
}

function moveStepByStep(player, start, end, correction, callback) {
    let currentPos = start;

    function step() {
        if (currentPos < end) {
            currentPos++;
        } else if (currentPos > end) {
            currentPos--;
        } else {
            if (snakesAndLadders[end]) {
                let finalPos = snakesAndLadders[end];
                let { left, top } = getBoardPosition(finalPos);
                setTimeout(() => {
                    document.getElementById(player).style.left = `${left}px`;
                    document.getElementById(player).style.top = `${top - correction}px`;
                    if (player === "p1") p1sum = finalPos;
                    if (player === "p2") p2sum = finalPos;
                }, 300);
                return;
            }
            if (player === "p1") p1sum = end;
            if (player === "p2") p2sum = end;
            if (end === 100) {
                winSound.play();
                alert(player === "p1" ? "Red Won !!" : "Yellow Won !!");
                location.reload();
            }
            if (callback) callback();
            return;
        }

        let { left, top } = getBoardPosition(currentPos);
        document.getElementById(player).style.left = `${left}px`;
        document.getElementById(player).style.top = `${top - correction}px`;

        setTimeout(step, 200);
    }

    step();
}

function play(player, num, correction) {
    let currentSum = player === "p1" ? p1sum : p2sum;
    let finalPos = currentSum + num;

    if (finalPos > 100) finalPos = currentSum;

    moveStepByStep(player, currentSum, finalPos, correction);
}

document.getElementById("diceBtn").addEventListener("click", function () {
    rollingSound.play();
    let num = Math.floor(Math.random() * 6) + 1;
    document.getElementById("dice").innerText = num;

    if (tog % 2 !== 0) {
        document.getElementById("tog").innerText = "Yellow's Turn : ";
        play("p1", num, 0);
    } else {
        document.getElementById("tog").innerText = "Red's Turn : ";
        play("p2", num, 55);
    }

    tog++;
});
