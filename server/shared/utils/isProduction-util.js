import { env } from '../../config/env-config.js'

export const isProduction = () => env.NODE_ENV === 'production'
