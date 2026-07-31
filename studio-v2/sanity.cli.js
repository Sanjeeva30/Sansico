import { defineCliConfig } from "sanity/cli";

// studioHost is pinned to "sansico-v2" so `sanity deploy` can never target the
// live Studio. The production Studio is "sansico" (sansico.sanity.studio) and
// serves the `production` dataset; this one serves `v2`. Do not change this
// value to "sansico" — it would overwrite the Studio the content team uses.
export default defineCliConfig({
  studioHost: "sansico-v2",
  deployment: { appId: "vi3csu39d0bb1t36l4og7w7h" },
  api: {
    projectId: "rvghw4zu",
    dataset: "v2",
  },
});
