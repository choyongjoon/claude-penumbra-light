import { expect, test } from 'claude-code/testing'

test('the session starts with the theme mod loaded', async ($, on) => {
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  const started = await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(started.cwd).toBe('/')
})
