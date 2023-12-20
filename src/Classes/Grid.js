export class Grid {
    constructor(cols, rows) {
        Object.defineProperty(this, "array", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "colWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rowLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (col, row) => {
                return (row * this.colWidth) + col;
            }
        });
        Object.defineProperty(this, "insert", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (col, row, value) => {
                this.array[this.getIndex(col, row)] = value;
            }
        });
        Object.defineProperty(this, "remove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (col, row) => {
                this.array[this.getIndex(col, row)] = null;
            }
        });
        Object.defineProperty(this, "get", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (col, row) => {
                return this.array[this.getIndex(col, row)];
            }
        });
        this.array = Array(cols * rows).fill(null);
        this.colWidth = cols;
        this.rowLength = rows;
    }
}
