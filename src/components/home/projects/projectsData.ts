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
  }
];

export const filterTags = Array.from(
  new Set(projects.flatMap((project) => project.tags).filter((tag) => tag !== "all"))
);
