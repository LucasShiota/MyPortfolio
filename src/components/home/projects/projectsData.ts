export type Project = {
  id: string;
  title: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  body: string;
  condensedBody: string;
  previewImage: string;
  previewVideo?: string;
  tags: string[];
  descriptorTags?: string[];
  previewButton: {
    text: string;
    href: string;
    ariaLabel: string;
  };
};

export const projects: Project[] = [
  {
    id: "1",
    title: "Destructively Expressive Icons",
    thumbnailSrc: "/svg/sidebar/projects.svg",
    thumbnailAlt: "Destructively Expressive Icons thumbnail",
    body: "A visual mod replacing default class icons with stylized vector art.",
    condensedBody: "Custom stylized vector icons for DRG.",
    previewImage: "/images/headshot.webp",
    tags: ["Mod"],
    descriptorTags: ["Vector Art", "UI Design"],
    previewButton: { text: "Mod Page", href: "#", ariaLabel: "Open mod page" },
  },
  {
    id: "2",
    title: "Baraliot Fantasia",
    thumbnailSrc: "/svg/sidebar/about.svg",
    thumbnailAlt: "Baraliot Fantasia thumbnail",
    body: "A tabletop system prototype focused on deckbuilding combat.",
    condensedBody: "Deckbuilding TRPG combat prototype.",
    previewImage: "/images/headshot.webp",
    tags: ["TRPG"],
    descriptorTags: ["System Design", "Game Balance"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "3",
    title: "Koth_Billabong",
    thumbnailSrc: "/svg/sidebar/contact.svg",
    thumbnailAlt: "Koth Billabong thumbnail",
    body: "A TF2 map project focused on layout flow and readability.",
    condensedBody: "TF2 map with optimized layout flow.",
    previewImage: "/images/headshot.webp",
    tags: ["Level", "Mod"],
    descriptorTags: ["Level Design", "Source Engine"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "4",
    title: "Tokyo Grunge",
    thumbnailSrc: "/images/headshot.webp",
    thumbnailAlt: "Tokyo Grunge thumbnail",
    body: "A visual study of urban textures and graffiti in Tokyo.",
    condensedBody: "Photography of Tokyo's urban textures.",
    previewImage: "/images/headshot.webp",
    tags: ["Misc"],
    descriptorTags: ["Photography", "Visual Study"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "5",
    title: "Portfolio Website",
    thumbnailSrc: "/logo/crazyblender.webp",
    thumbnailAlt: "Portfolio Website thumbnail",
    body: "Built with custom UI and animation behavior.",
    condensedBody: "Custom-built portfolio without frameworks.",
    previewImage: "/images/headshot.webp",
    tags: ["Misc"],
    descriptorTags: ["Web Dev", "UX/UI"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "6",
    title: "Personal Blog",
    thumbnailSrc: "/logo/crazyblender.svg",
    thumbnailAlt: "Personal Blog thumbnail",
    body: "Long-form writing about game design and player experience.",
    condensedBody: "Essays on game design and player UX.",
    previewImage: "/images/headshot.webp",
    tags: ["Misc"],
    descriptorTags: ["Writing", "Analysis"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
];

export const filterTags = Array.from(
  new Set(projects.flatMap((project) => project.tags).filter((tag) => tag !== "all"))
);
