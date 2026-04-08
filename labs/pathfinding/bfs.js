const rows = 20;
const cols = 20;

let grid = [];
let start = [0, 0];
let end = [19, 19];

const board = document.getElementById("board");

// CREATE GRID
for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        cell.addEventListener("click", () => {
            cell.classList.toggle("wall");
        });

        board.appendChild(cell);
        row.push(cell);
    }
    grid.push(row);
}

// MARK START & END
grid[start[0]][start[1]].classList.add("active");
grid[end[0]][end[1]].classList.add("path");

// BFS
async function runBFS() {
    let queue = [[...start]];
    let visited = new Set();
    let parent = {};

    visited.add(start.toString());

    while (queue.length > 0) {
        let [r, c] = queue.shift();

        if (r === end[0] && c === end[1]) break;

        let directions = [
            [1,0],[-1,0],[0,1],[0,-1]
        ];

        for (let [dr, dc] of directions) {
            let nr = r + dr;
            let nc = c + dc;

            if (
                nr >= 0 && nc >= 0 &&
                nr < rows && nc < cols &&
                !visited.has([nr,nc].toString()) &&
                !grid[nr][nc].classList.contains("wall")
            ) {
                queue.push([nr,nc]);
                visited.add([nr,nc].toString());
                parent[[nr,nc]] = [r,c];

                grid[nr][nc].classList.add("visited");
                await sleep(20);
            }
        }
    }

    // DRAW PATH
    let cur = end;
    while (cur && cur.toString() !== start.toString()) {
        let [r,c] = cur;
        grid[r][c].classList.add("path");
        cur = parent[cur];
        await sleep(30);
    }
}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}