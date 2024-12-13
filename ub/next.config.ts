import type { NextConfig } from "next"
import { join, resolve } from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: resolve(__dirname, '../.env') })

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  outputFileTracingRoot: join(__dirname, '../../'),
  /* ...(process.env.NODE_ENV === "development"
    ? { outputFileTracingRoot: join(__dirname, "../") }
    : null) */
};

export default nextConfig;
