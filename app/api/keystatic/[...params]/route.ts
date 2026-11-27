// Keystatic's server side: GitHub login and saving content (as commits) when you edit at /keystatic.
// Until the one-time GitHub App setup is done (keys added in Vercel, see KEYSTATIC.md), the editor just says
// "not set up yet" instead of breaking the build, so the rest of the site always deploys.
import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

const needsGithubKeys = config.storage.kind === "github";
const hasKeys = !!(process.env.KEYSTATIC_GITHUB_CLIENT_ID && process.env.KEYSTATIC_GITHUB_CLIENT_SECRET && process.env.KEYSTATIC_SECRET);

const notReady = () =>
  new Response("The content editor isn't connected to GitHub yet. Follow KEYSTATIC.md to finish the one-time setup.", {
    status: 503,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });

const handlers = !needsGithubKeys || hasKeys ? makeRouteHandler({ config }) : { GET: notReady, POST: notReady };

export const GET = handlers.GET;
export const POST = handlers.POST;
