import { Grid } from "./Grid"


describe('Grid', () => { 

  test('Should generate proper indexes', () => {
    const grid = new Grid<string>(4, 3)
    const index =grid.getIndex(2 ,1)
    expect(index).toBe(6)
  })

  test("Should Add element to proper position", () => {
    const grid = new Grid<string>(4, 3)
    grid.insert(2, 1, "Added")
    const elem = grid.get(2,1)
    expect(elem).toBe("Added")
    expect(grid.get(1,1)).toBe(null)
  })
})
