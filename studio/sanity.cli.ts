import {defineCliConfig} from 'sanity/cli'

/* The hosted Studio lives at https://4else.sanity.studio (studioHost).
   The website redirects /studio there, see next.config.mjs. */
export default defineCliConfig({
  api: {
    projectId: '6e5n16nr',
    dataset: 'production',
  },
  studioHost: '4else',
  deployment: {
    /* The hosted Studio picks up new Sanity releases by itself. */
    autoUpdates: true,
  },
})
