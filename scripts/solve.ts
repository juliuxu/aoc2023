import { argv } from 'bun'
import chalk from 'chalk'
import { formatPerformance, withPerformance, isBetween } from './utils.ts'
import { scaffold } from './scaffold.ts'

const day = parseInt(argv[2] ?? '')
const year = parseInt(process.env.YEAR ?? new Date().getFullYear())

if (!isBetween(day, [1, 25])) {
  console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`)
  console.log(`🎅 To get started, try: ${chalk.cyan('bun solve 1')}`)
  process.exit(0)
}

await scaffold(day, year)

const name = `${day}`.padStart(2, '0')

const { default: actualInput } = await import(`@/${name}/input.txt`)
const { default: exampleInput } = await import(`@/${name}/example.txt`)
const { TEST_MODE, partOne, partOneTests, partTwo, partTwoTests, parse } =
  await import(`@/${name}/${name}.ts`)

let input = actualInput
let partOneFn = partOne
let partTwoFn = partTwo

if (TEST_MODE) {
  input = exampleInput
  partOneFn = partOneTests
  partTwoFn = partTwoTests
  console.log(`🧪 Running tests for day ${day} of ${year}`)
}

const [one, onePerformance] = withPerformance(() => partOneFn?.(parse(input)))
const [two, twoPerformance] = withPerformance(() => partTwoFn?.(parse(input)))

console.log(
  '🌲',
  'Part One:',
  chalk.green(one ?? '—'),
  one ? `(${formatPerformance(onePerformance)})` : ''
)
console.log(
  '🎄',
  'Part Two:',
  chalk.green(two ?? '—'),
  two ? `(${formatPerformance(twoPerformance)})` : ''
)
