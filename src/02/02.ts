import { sum } from '@/utils'

export const TEST_MODE = false

type Line = {
  game: number
  hands: { n: string; color: 'red' | 'green' | 'blue' }[][]
}
type Input = Line[]

export function parse(input: string) {
  return [...input.matchAll(/Game (?<game>\d+): (?<hands>.+)/g)]
    .map(line => line.groups)
    .map(({ game, hands }) => ({
      game: parseInt(game),
      hands: hands
        .split(';')
        .map(hand => [...hand.matchAll(/(?<n>\d+) (?<color>red|blue|green)/g)])
        .map(hand => hand.map(({ groups }) => groups))
    })) as Input
}

export function partOne(input: ReturnType<typeof parse>) {
  // 12 red cubes, 13 green cubes, and 14 blue cubes
  function isGamePossible(game: Line) {
    for (const hand of game.hands) {
      const handObject = hand.reduce(
        (acc, { n, color }) => {
          acc[color] = parseInt(n)
          return acc
        },
        { red: 0, green: 0, blue: 0 }
      )
      if (
        handObject.red > 12 ||
        handObject.green > 13 ||
        handObject.blue > 14
      ) {
        return false
      }
    }

    return true
  }

  return sum(input.filter(isGamePossible).map(x => x.game))
}
export function partOneTests(exampleInput: ReturnType<typeof parse>) {
  const result = partOne(exampleInput)
  const expected = 8

  return [[result, expected], result === expected]
}

export function partTwo(input: ReturnType<typeof parse>) {
  function minimumSetForGame(game: Line) {
    const result = {
      red: 0,
      green: 0,
      blue: 0
    }

    for (const hand of game.hands) {
      const handObject = hand.reduce(
        (acc, { n, color }) => {
          acc[color] = parseInt(n)
          return acc
        },
        { red: 0, green: 0, blue: 0 }
      )
      if (handObject.red > result.red) {
        result.red = handObject.red
      }
      if (handObject.green > result.green) {
        result.green = handObject.green
      }
      if (handObject.blue > result.blue) {
        result.blue = handObject.blue
      }
    }

    return result
  }
  return sum(input.map(minimumSetForGame).map(x => x.red * x.green * x.blue))
}
export function partTwoTests(exampleInput: ReturnType<typeof parse>) {
  const result = partTwo(exampleInput)
  const expected = 2286

  return [[result, expected], result === expected]
}
