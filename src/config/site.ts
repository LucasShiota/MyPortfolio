export const SITE_TITLE = 'Lucas Shiota';
export const SITE_DESCRIPTION = 'Project Manager & Game Developer Portfolio';

export const CONTACT = {
  email: "hi@lucasshiota.com",
  discord: "lucas_shiota",
  discordDisplay: "@lucas_shiota",
  github: "https://github.com/LucasShiota",
  linkedin: "https://www.linkedin.com/in/lucasshiota/",
};

export interface LinkInfo {
  url: string;
  label: string;
  title: string;
  [key: string]: any; 
}

export interface SiteConfig {
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
    discordDisplay: string;
  };
}

export const LINKS: SiteConfig = {
  homepage: {
    url: "/",
    label: "Return to homepage",
    title: "Homepage"
  },
  linkedin: {
    url: CONTACT.linkedin,
    label: "Find me on LinkedIn",
    title: "LinkedIn"
  },
  github: {
    url: CONTACT.github,
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
    email: CONTACT.email,
    discord: CONTACT.discord,
    discordDisplay: CONTACT.discordDisplay,
  }
};
