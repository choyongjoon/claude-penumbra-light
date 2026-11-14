import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { PENUMBRA_SCENE } from './penumbra-scene.ts'

const SCENE = 'penumbra'

// Penumbra Light: warm "sun" surfaces, neutral "shade" text,
// and the perceptually balanced Penumbra accents.
const { theme, problems } = makeColors({
  label: 'Penumbra Light',
  only: 'light',
  roles: {
    accent: '#6e8dd5', // blue
    danger: '#ca7081', // red
    success: '#3ea57b', // green
    warning: '#c27d40', // orange
    pro: '#ac78bd', // purple
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#fff7ed', // Sun
        'surface-1': '#fffaf4',
        'surface-2': '#fffdfb', // Sun+
        'text-primary': '#24272b', // Shade-
        'text-secondary': '#3e4044', // Shade+
        'text-muted': '#636363', // Sky-
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'light',
  backdrop: { scene: SCENE, glass: { blur: 20, tint: '#fff7ed', opacity: 0.7 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    try {
      const set = await $.theme.set(LOOK)

      if (!set.isDrawn) {
        $.ui.status(set.reason)
      }
    } catch {
      // A host with no theme support draws nothing.
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== SCENE) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={PENUMBRA_SCENE} alt="A soft eclipse shadow on warm light, and a faint color arc" isInteractive />
  })
}
