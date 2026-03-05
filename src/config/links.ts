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
  [key: string]: any; // Allow nested properties for specific project links
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
    immunedefense: LinkInfo;
    tf2: LinkInfo;
  };
  contact: {
    email: string;
    discord: string;
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
      url: "/baraliot",
      label: "View Baraliot Project",
      title: "Baraliot",
      productPage: {
        url: "https://baraliot.com/demo",
        label: "View Product Page",
        title: "Product Page"
      },
      gdd: {
        url: "https://docs.google.com/baraliot-gdd",
        label: "Read GDD PDF",
        title: "GDD PDF"
      }
    },
    immunedefense: {
      url: "/immune-defense",
      label: "View Immune Defense Project",
      title: "Immune Defense"
    },
    tf2: {
      url: "/projects/tf2map",
      label: "View TF2 Map Project",
      title: "TF2 Map"
    }
  },
  contact: {
    email: "hello@lucasshiota.com",
    discord: "ryuukazu"
  }
};

