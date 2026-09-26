import {defineCliConfig} from 'sanity/cli'

/* The hosted Studio lives at https://fourelse.sanity.studio (studioHost).
   The website redirects /studio there, see next.config.mjs. */
export default defineCliConfig({
  api: {
    projectId: '6e5n16nr',
    dataset: 'production',
  },
  studioHost: 'fourelse',
  deployment: {
    /* Assigned by Sanity on the first deploy (2026-09-26); keeps later
       deploys from prompting. */
    appId: 'fgsmaqpzem3svgjti52x3p2r',
    /* The hosted Studio picks up new Sanity releases by itself. */
    autoUpdates: true,
  },
})
