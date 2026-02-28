export type Project = {
  id: string;
  title: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  description: string;
  preview: string;
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
    id: "0",
    title: "My Projects:",
    thumbnailSrc: "/logo/crazyblender-sm.webp",
    thumbnailAlt: "Projects overview thumbnail",
    description: "Intro",
    preview: "Select a project from the list to view details.",
    tags: ["all"],
    descriptorTags: ["Portfolio"],
    previewButton: { text: "View", href: "#", ariaLabel: "Project intro" },
  },
  {
    id: "1",
    title: "Destructively\nExpressive Icons",
    thumbnailSrc: "/svg/sidebar/projects.svg",
    thumbnailAlt: "Destructively Expressive Icons thumbnail",
    description: "Deep Rock Galactic Visual Mod",
    preview: "A visual mod replacing default class icons with stylized vector art.",
    tags: ["Mod"],
    descriptorTags: ["Vector Art", "UI Design"],
    previewButton: { text: "Mod Page", href: "#", ariaLabel: "Open mod page" },
  },
  {
    id: "2",
    title: "Baraliot Fantasia",
    thumbnailSrc: "/svg/sidebar/about.svg",
    thumbnailAlt: "Baraliot Fantasia thumbnail",
    description: "Deckbuilding Fantasy TRPG",
    preview: "A tabletop system prototype focused on deckbuilding combat.",
    tags: ["TRPG"],
    descriptorTags: ["System Design", "Game Balance"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "3",
    title: "Koth_Billabong",
    thumbnailSrc: "/svg/sidebar/contact.svg",
    thumbnailAlt: "Koth Billabong thumbnail",
    description: "Team Fortress 2 Map",
    preview: "A TF2 map project focused on layout flow and readability.",
    tags: ["Level", "Mod"],
    descriptorTags: ["Level Design", "Source Engine"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "4",
    title: "Tokyo Grunge",
    thumbnailSrc: "/images/headshot.webp",
    thumbnailAlt: "Tokyo Grunge thumbnail",
    description: "Photo Series of Paint and Vinyl",
    preview: "A visual study of urban textures and graffiti in Tokyo.",
    tags: ["Misc"],
    descriptorTags: ["Photography", "Visual Study"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "5",
    title: "Portfolio Website",
    thumbnailSrc: "/logo/crazyblender.webp",
    thumbnailAlt: "Portfolio Website thumbnail",
    description: "No Website Builders, just Pure Code",
    preview: "Built with custom UI and animation behavior.",
    tags: ["Misc"],
    descriptorTags: ["Web Dev", "UX/UI"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "6",
    title: "Personal Blog",
    thumbnailSrc: "/logo/crazyblender.svg",
    thumbnailAlt: "Personal Blog thumbnail",
    description: "Video Game Topics I'm Passionate About",
    preview: "Long-form writing about game design and player experience.",
    tags: ["Misc"],
    descriptorTags: ["Writing", "Analysis"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "7",
    title: "Personal Blog",
    thumbnailSrc: "/logo/crazyblender.svg",
    thumbnailAlt: "Personal Blog thumbnail",
    description: "Video Game Topics I'm Passionate About",
    preview: "Long-form writing about game design and player experience.",
    tags: ["Misc"],
    descriptorTags: ["Writing", "Analysis"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "8",
    title: "Personal Blog",
    thumbnailSrc: "/logo/crazyblender.svg",
    thumbnailAlt: "Personal Blog thumbnail",
    description: "Video Game Topics I'm Passionate About",
    preview: "Long-form writing about game design and player experience.",
    tags: ["Misc"],
    descriptorTags: ["Writing", "Analysis"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "9",
    title: "Personal Blog",
    thumbnailSrc: "/logo/crazyblender.svg",
    thumbnailAlt: "Personal Blog thumbnail",
    description: "Video Game Topics I'm Passionate About",
    preview: "Long-form writing about game design and player experience.",
    tags: ["Misc"],
    descriptorTags: ["Writing", "Analysis"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "10",
    title: "Personal Blog",
    thumbnailSrc: "/logo/crazyblender.svg",
    thumbnailAlt: "Personal Blog thumbnail",
    description: "Video Game Topics I'm Passionate About",
    preview: "Long-form writing about game design and player experience.",
    tags: ["Misc"],
    descriptorTags: ["Writing", "Analysis"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
];

export const filterTags = Array.from(
  new Set(projects.flatMap((project) => project.tags).filter((tag) => tag !== "all"))
);
