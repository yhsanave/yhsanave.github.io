onmessage = async function (e) {
    for (let i = 1; i <= e.data.rows; i++) {
        await new Promise(r => setTimeout(r, e.data.speed)) // Delay
        moveDrop(i, e.data.col);
    }
}

function moveDrop(row, col) {
    self.postMessage({col: col, row: row});
}