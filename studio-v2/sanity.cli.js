import { defineCliConfig } from "sanity/cli";

// Deliberately no studioHost — this Studio is local-only until the v2 branch is
// signed off. Deploying it with studioHost "sansico" would replace the live
// Studio that the production site's editors use.
export default defineCliConfig({
  api: {
    projectId: "rvghw4zu",
    dataset: "v2",
  },
});
