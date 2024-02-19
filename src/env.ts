import { parseEnv } from "znv";
import { z } from "zod";

export const env = parseEnv(process.env, {
    NEXT_PUBLIC_CERAMIC_URL: z.string().min(1),
    NEXT_PUBLIC_WC_PROJECT_ID: z.string().min(1),
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
});

export const APP_URL = env.NEXT_PUBLIC_VERCEL_URL ? `https://${env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000";
