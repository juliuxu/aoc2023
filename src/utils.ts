export const sum = (numbers: number[]) => numbers.reduce((acc, x) => acc + x, 0)
export const product = (numbers: number[]) =>
  numbers.reduce((acc, x) => acc * x, 1)

export function memo<A, B>(f: (...args: A[]) => B): (args: A) => B {
  const d: Record<string, B> = {}
  return (...args: A[]) => {
    const key = JSON.stringify(args)
    if (!(key in d)) d[key] = f(...args)
    return d[key]!
  }
}

export type Pos = [x: number, y: number]
export const isOutOfBounds = ([x, y]: Pos, grid: string[] | number[][]) =>
  y >= grid.length || y < 0 || x >= grid[y]!.length || x < 0

export const isInBounds = (grid: string[] | number[][]) => (pos: Pos) =>
  !isOutOfBounds(pos, grid)

// No diagonal
export const getAdjecentPositions = ([x, y]: Pos, diagonal = false): Pos[] => {
  const result = [
    [x + 1, y],
    [x, y + 1],
    [x - 1, y],
    [x, y - 1]
  ] as Pos[]

  if (diagonal) {
    result.push([x + 1, y + 1], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1])
  }

  return result
}

export const getAdjecentLines = (
  [x, y]: Pos,
  [[minX, minY], [maxX, maxY]]: [Pos, Pos]
): Pos[][] => {
  return [
    new Array(maxX - x).fill(0).map((_, i) => [x + i + 1, y]),
    new Array(maxY - y).fill(0).map((_, i) => [x, y + i + 1]),
    new Array(x - minX).fill(0).map((_, i) => [x - i - 1, y]),
    new Array(y - minY).fill(0).map((_, i) => [x, y - i - 1])
  ]
}

export function intersect<T extends number[] | string[] | string>(
  A: T,
  B: T
): T {
  const setB = new Set([...B])
  const intersection = [...new Set([...A].filter(element => setB.has(element)))]
  if (typeof A === 'string' && typeof B === 'string')
    return (intersection as any).join('')
  return intersection as T
}

export function chunked<T>(l: T[], chunkSize: number) {
  const result: T[][] = []
  const copy = l.slice()
  while (copy.length > 0) {
    result.push(copy.splice(0, chunkSize))
  }

  return result
}

export function typedBoolean<T>(
  value: T
): value is Exclude<T, '' | 0 | false | null | undefined> {
  return Boolean(value)
}
