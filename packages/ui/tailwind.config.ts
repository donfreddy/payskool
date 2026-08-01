import type { Config } from 'tailwindcss'
import { baseConfig } from '@payskool/config-tailwind/base'

const config: Config = {
  presets: [baseConfig],
  content: [
    './src/**/*.{ts,tsx}',
  ],
}

export default config
