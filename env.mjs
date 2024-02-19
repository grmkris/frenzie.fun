import { z } from 'zod'

const server = z.object({
  // Iron session requires a secret of at least 32 characters
  NODE_ENV: z.enum(['development', 'test', 'production']),
})

const client = z.object({
  NEXT_PUBLIC_CERAMIC_URL: z.string().optional(),
  NEXT_PUBLIC_WC_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ENV: z.string().optional().describe("The Environment that the app is deployed and running on. The value can be either production, preview, or development."),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional().describe("The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol scheme https://. NOTE: This Variable cannot be used in conjunction with Standard Deployment Protection. See Migrating to Standard Protection."),
  NEXT_PUBLIC_VERCEL_BRANCH_URL: z.string().optional().describe("The domain name of the generated Git branch URL. Example: *-git-*.vercel.app. The value does not include the protocol scheme https://."),
  NEXT_PUBLIC_VERCEL_AUTOMATION_BYPASS_SECRET: z.string().optional().describe("The Protection Bypass for Automation value, if the secret has been generated in the project's Deployment Protection settings."),
  NEXT_PUBLIC_VERCEL_GIT_PROVIDER: z.string().optional().describe("The Git Provider the deployment is triggered from. Example: github."),
  NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG: z.string().optional().describe("The origin repository the deployment is triggered from. Example: my-site."),
  NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER: z.string().optional().describe("The account that owns the repository the deployment is triggered from. Example: acme."),
  NEXT_PUBLIC_VERCEL_GIT_REPO_ID: z.string().optional().describe("The ID of the repository the deployment is triggered from. Example: 117716146."),
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF: z.string().optional().describe("The git branch of the commit the deployment was triggered by. Example: improve-about-page."),
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: z.string().optional().describe("The git SHA of the commit the deployment was triggered by. Example: fa1eade47b73733d6312d5abfad33ce9e4068081."),
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE: z.string().optional().describe("The message attached to the commit the deployment was triggered by. Example: Update about page."),
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN: z.string().optional().describe("The username attached to the author of the commit that the project was deployed by. Example: johndoe."),
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME: z.string().optional().describe("The name attached to the author of the commit that the project was deployed by. Example: John Doe."),
  NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID: z.string().optional().describe("The pull request id the deployment was triggered by. If a deployment is created on a branch before a pull request is made, this value will be an empty string. Example: 23.")
})

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
}

const merged = server.merge(client)

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = process.env

if (!!process.env.SKIP_ENV_VALIDATION === false) {
  const isServer = typeof window === 'undefined'

  const parsed = isServer
    ? merged.safeParse(processEnv) // on server we can validate all env vars
    : client.safeParse(processEnv) // on client we can only validate the ones that are exposed

  if (parsed.success === false) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables')
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
        throw new Error(
          process.env.NODE_ENV === 'production'
            ? '❌ Attempted to access a server-side environment variable on the client'
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        )
      return target[/** @type {keyof typeof target} */ (prop)]
    },
  })
}

export { env }

export const APP_URL = env.NEXT_PUBLIC_VERCEL_URL ? `https://${env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000";
