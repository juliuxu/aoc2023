import {
  Pos,
  getAdjecentPositions,
  isInBounds,
  product,
  sum,
  typedBoolean
} from '@/utils'

export const TEST_MODE = false

export function parse(input: string) {
  return input.split('\n')
}

export function partOne(input: ReturnType<typeof parse>) {
  const parts = []
  for (let y = 0; y < input.length; y++) {
    const matches = input[y]?.matchAll(/\d+/g)
    if (!matches) continue
    for (let match of matches) {
      const number = match[0]
      const xPositions = number.split('').map((_, i) => i + match.index!)

      const positionsToCheck = xPositions.flatMap(x =>
        getAdjecentPositions([x, y], true).filter(pos => isInBounds(input)(pos))
      )

      const isPart = positionsToCheck.some(([x, y]) => {
        const value = input[y]![x]!
        return ![
          '.',
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9'
        ].includes(value)
      })

      if (isPart) parts.push(number)
    }
  }
  return sum(parts.map(Number))
}

export function partOneTests(exampleInput: ReturnType<typeof parse>) {
  const result = partOne(exampleInput)
  const expected = 4361

  return [[result, expected], result === expected]
}

export function partTwo(input: ReturnType<typeof parse>) {
  function isDigit(value: string) {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value)
  }

  function getWholeNumberAndRangePos([x, y]: Pos) {
    if (!isDigit(input[y]![x]!)) return undefined

    let startX = x
    let endX = x

    while (startX > -1 && isDigit(input[y]![startX - 1]!)) {
      startX -= 1
    }

    while (endX < input[y]!.length && isDigit(input[y]![endX + 1]!)) {
      endX += 1
    }

    return [input[y]?.slice(startX, endX + 1), [y, startX, endX]]
  }

  const gears = []
  for (let y = 0; y < input.length; y++) {
    const matches = input[y]?.matchAll(/\*/g)
    if (!matches) continue
    for (let match of matches) {
      const positionsToCheck = getAdjecentPositions(
        [match.index!, y],
        true
      ).filter(pos => isInBounds(input)(pos))

      const numbers = {}
      positionsToCheck
        .map(getWholeNumberAndRangePos)
        .filter(typedBoolean)
        .forEach(([number, [yPos, startX, endX]]) => {
          numbers[`${yPos}_${startX}_${endX}`] = number
        })
      const parts = Object.values(numbers).map(Number)
      if (parts.length === 2) {
        console.log('found a gear', parts)
        gears.push(product(parts))
      }
    }
  }

  return sum(gears)
}

export function partTwoTests(exampleInput: ReturnType<typeof parse>) {
  const result = partTwo(exampleInput)
  const expected = 467835

  return [[result, expected], result === expected]
}
