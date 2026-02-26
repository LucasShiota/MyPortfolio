/* 
1. Accessibility (aria-label)
For humans who can't see the screen. 
Screen readers read this label out loud so 
users know what an icon-only button does 
(otherwise, it would be silent/meaningless).

2. SEO (aria-label & title)
For search bots (Google). Bots are effectively
"blind" and can't see your icons; they use these
text labels to understand what your site is about
and how your links are connected to your brand.
*/

export interface LinkInfo {
  url: string;
  label: string;
  title: string;
}

interface LinksConfig {
  homepage: LinkInfo;
  linkedin: LinkInfo;
  github: LinkInfo;
  steam: LinkInfo;
  substack: LinkInfo;
  itchio: LinkInfo;
  projects: {
    drgmod: LinkInfo;
    baraliot: LinkInfo;
    tf2: LinkInfo;
  };
}

export const LINKS: LinksConfig = {
  homepage: {
    url: "https://lucasshiota.com",
    label: "Return to homepage",
    title: "Homepage"
  },
  linkedin: {
    url: "https://www.linkedin.com/in/lucasshiota/",
    label: "Find me on LinkedIn",
    title: "LinkedIn"
  },
  github: {
    url: "https://github.com/LucasShiota",
    label: "Check out my GitHub page",
    title: "GitHub"
  },
  steam: {
    url: "https://steamcommunity.com/id/ulsca",
    label: "My Steam Profile",
    title: "Steam"
  },
  substack: {
    url: "https://lucasshiota.substack.com/",
    label: "Take a gander at my Substack",
    title: "Substack"
  },
  itchio: {
    url: "https://lucasshiota.itch.io/",
    label: "Find my games on my Itch.io",
    title: "Itch.io"
  },
  projects: {
    drgmod: {
      url: "https://mod.io/g/drg/m/destrucively-expressive-icons#description",
      label: "View the DRG mod page in Mod.io",
      title: "DRG Mod"
    },
    baraliot: {
      url: "/projects/baraliot",
      label: "View Baraliot Project",
      title: "Baraliot"
    },
    tf2: {
      url: "/projects/tf2map",
      label: "View TF2 Map Project",
      title: "TF2 Map"
    }
  }
};

