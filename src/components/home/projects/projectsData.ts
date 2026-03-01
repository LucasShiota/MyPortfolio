export type Project = {
  id: string;
  title: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  body: string;
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
    previewImage: "/images/headshot.webp",
    tags: ["Mod"],
    descriptorTags: ["Vector Art", "UI Design"],
    previewButton: { text: "Mod Page", href: "#", ariaLabel: "Open mod page" },
  },
  {
    id: "2",
    title: "Baraliot Fantasia",
    thumbnailSrc: "/images/baraliotlogo.webp",
    thumbnailAlt: "Baraliot Fantasia thumbnail",
    body: `<p>An NSR TRPG blending deckbuilding gameplay and deep character fantasy. Embracing improv, mixing, and synergy. A high-variety system players can easily jump into and get lost in.</p>
           <p>The 5 core design goals are:</p>
           <ul>
             <li>Use the gameplay potential of card and deckbuilding mechanics to their fullest</li>
             <li>Evoke a sense of satisfaction in players realizing their character fantasy</li>
             <li>Streamline rules and rulebook to lower the barrier of entry and the cost of play</li>
             <li>Excite players with many choices and freedom without overwhelming them</li>
             <li>A high-density, low-complexity approach to the overarching rules package</li>
           </ul>`,
    previewImage: "/images/baraliot.webp",
    tags: ["TRPG"],
    descriptorTags: ["Game System", "Typography", "Layout ", "Writing" ],
    previewButton: { text: "Learn more in depth", href: "/baraliot", ariaLabel: "Open project details" },
  },
  {
    id: "3",
    title: "Koth_Billabong",
    thumbnailSrc: "/svg/sidebar/contact.svg",
    thumbnailAlt: "Koth Billabong thumbnail",
    body: "A TF2 map project focused on layout flow and readability.",
    previewImage: "/images/headshot.webp",
    tags: ["Side Projects"],
    descriptorTags: ["Level Design", "Source Engine"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "4",
    title: "Tokyo Grunge",
    thumbnailSrc: "/images/headshot.webp",
    thumbnailAlt: "Tokyo Grunge thumbnail",
    body: "A visual study of urban textures and graffiti in Tokyo.",
    previewImage: "/images/headshot.webp",
    tags: ["Side Projects"],
    descriptorTags: ["Photography", "Visual Study"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "5",
    title: "Portfolio Website",
    thumbnailSrc: "/logo/crazyblender.webp",
    thumbnailAlt: "Portfolio Website thumbnail",
    body: "Built with custom UI and animation behavior.",
    previewImage: "/images/headshot.webp",
    tags: ["Side Projects"],
    descriptorTags: ["Web Dev", "UX/UI"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
  {
    id: "6",
    title: "Personal Blog",
    thumbnailSrc: "/logo/crazyblender.svg",
    thumbnailAlt: "Personal Blog thumbnail",
    body: "Long-form writing about game design and player experience.",
    previewImage: "/images/headshot.webp",
    tags: ["Side Projects"],
    descriptorTags: ["Writing", "Analysis"],
    previewButton: { text: "Details", href: "#", ariaLabel: "Open project details" },
  },
];

export const filterTags = Array.from(
  new Set(projects.flatMap((project) => project.tags).filter((tag) => tag !== "all"))
);
