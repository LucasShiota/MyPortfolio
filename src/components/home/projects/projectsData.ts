export type Project = {
  id: string;
  title: string;
  description: string;
  preview: string;
  tags: string[];
  previewButton: {
    text: string;
    href: string;
    ariaLabel: string;
  };
};

export const projects: Project[] = [
  {
    id: "0",
    title: "My\nProjects:",
    description: "Intro",
    preview: "Select a project from the list to view details.",
    tags: ["all"],
    previewButton: { text: "View", href: "#", ariaLabel: "Project intro" },
  },
  {
    id: "1",
    title: "Destructively\nExpressive Icons",
    description: "Deep Rock Galactic Visual Mod",
    preview: "A visual mod replacing default class icons with stylized vector art.",
    tags: ["modding", "ui"],
    previewButton: { text: "Mod Page", href: "#", ariaLabel: "Open mod page" },
  },
  {
    id: "2",
    title: "Baraliot Fantasia",
    description: "Deckbuilding Fantasy TRPG",
    preview: "A tabletop system prototype focused on deckbuilding combat.",
    tags: ["game-design"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "3",
    title: "Koth_Billabong",
    description: "Team Fortress 2 Map",
    preview: "A TF2 map project focused on layout flow and readability.",
    tags: ["level-design"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "4",
    title: "Tokyo Grunge",
    description: "Photo Series of Paint and Vinyl",
    preview: "A visual study of urban textures and graffiti in Tokyo.",
    tags: ["photography"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "5",
    title: "Portfolio Website",
    description: "No Website Builders, just Pure Code",
    preview: "Built with custom UI and animation behavior.",
    tags: ["web", "frontend"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "6",
    title: "Personal Blog",
    description: "Video Game Topics I'm Passionate About",
    preview: "Long-form writing about game design and player experience.",
    tags: ["writing"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
];

export const filterTags = Array.from(
  new Set(projects.flatMap((project) => project.tags).filter((tag) => tag !== "all"))
);
