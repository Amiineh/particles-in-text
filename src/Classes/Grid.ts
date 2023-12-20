export class Grid<T = any> {
  readonly array: Array<T | null>
  readonly colWidth: number
  readonly rowLength: number
  constructor(cols: number, rows: number){
    this.array = Array(cols * rows).fill(null)
    this.colWidth = cols
    this.rowLength = rows
  }

  getIndex = (col: number, row: number) => {
    return (row * this.colWidth) + col
  }

  insert = (col: number, row: number, value: T) => {
    this.array[this.getIndex(col, row)] = value
  }

  remove = (col: number ,row: number) => {
    this.array[this.getIndex(col, row)] = null
  }

  get = (col: number, row: number) => {
    return this.array[this.getIndex(col, row)]
  } 

}