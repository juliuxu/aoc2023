import chalk from 'chalk'
import dedent from 'dedent'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'

import { fetchInput } from './api.ts'

export async function scaffold(day: number, year: number) {
  const name = `${day}`.padStart(2, '0')

  const directory = new URL(`../src/${name}/`, import.meta.url)

  if (existsSync(directory)) return

  console.log(`📂 Setting up day ${day} of ${year}`)

  await mkdir(directory)

  const solution = dedent`
  export const TEST_MODE = true

  export function parse(input: string) {
    return input
  }
  
  export function partOne(input: ReturnType<typeof parse>) {
    return -1
  }

  export function partOneTests(exampleInput: ReturnType<typeof parse>) {
    const result = partOne(exampleInput)
    const expected = -1
  
    return [[result, expected], result === expected]
  }

  export function partTwo(input: ReturnType<typeof parse>) {}

  export function partTwoTests(exampleInput: ReturnType<typeof parse>) {
    const result = partTwo(exampleInput)
    const expected = -1
  
    return [[result, expected], result === expected]
  }
  `

  console.log(`📂 Fetching your input`)

  const input = await fetchInput({ day, year }).catch(() => {
    console.log(
      chalk.red.bold(
        '📂 Fetching your input have failed, empty file will be created.'
      )
    )
  })

  await Bun.write(new URL(`${name}.ts`, directory.href), solution)
  await Bun.write(new URL(`input.txt`, directory.href), input ?? '')
  await Bun.write(new URL(`example.txt`, directory.href), '')

  console.log('📂 You all set up, have fun!')
}
