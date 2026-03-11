/**
 * ══════════════════════════════════════════════
 *  CHARACTER SHEET DATA (aboutData.ts)
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Data source and UI config for the character sheet.
 *
 * CRITICAL RULES:
 * - Content is stored in characterData.
 * - Tab structure and layouts are defined in aboutConfig.
 */

export interface Ability {
  name: string;
  label: string;
  value: number;
  mod: string;
}

export interface SkillProficiency {
  label: string;
  level: 1 | 2 | 3;
}

export interface LoreTrait {
  title: string;
  description: string;
}

// 📝 Lvl. 2 CUSTOMIZATION: THE WIDGET SYSTEM
export type WidgetType =
  | "Abilities"
  | "Skills"
  | "Talents"
  | "Inventory"
  | "Philosophy"
  | "Milestones"
  | "Traits"
  | "PartyRole";

export interface TabWidget {
  slot: "left" | "center" | "right" | "main" | "side";
  type: WidgetType;
  title?: string;
}

export interface TabConfig {
  id: string;
  label: string;
  layout: "3-col" | "2-col-asymmetric" | "tree-grid";
  widgets: TabWidget[];
}

export const aboutConfig: TabConfig[] = [
  {
    id: "STATS",
    label: "Character Sheet",
    layout: "3-col",
    widgets: [
      { slot: "left", type: "Abilities", title: "Core Attributes" },
      { slot: "center", type: "Skills", title: "Base Proficiencies" },
      { slot: "right", type: "Inventory", title: "Loot & Equipment" },
    ],
  },
  {
    id: "TALENTS",
    label: "Skill Tree",
    layout: "tree-grid",
    widgets: [{ slot: "main", type: "Talents" }],
  },
  {
    id: "LOGS",
    label: "Quest Log",
    layout: "2-col-asymmetric",
    widgets: [
      { slot: "main", type: "Philosophy" },
      { slot: "main", type: "Milestones" },
      { slot: "side", type: "PartyRole" },
      { slot: "side", type: "Traits" },
    ],
  },
];

export const characterData = {
  name: "Lucas Shiota",
  class: "Game Designer",
  race: "Multidisciplinary",
  alignment: "Creative Neutral",
  stats: {
    ac: 18,
    init: "+5",
    speed: "30ft",
    hp: {
      current: 92,
      max: 100,
    },
  },
  abilities: [
    { name: "EXE", label: "Execution", value: 18, mod: "+4" },
    { name: "FLW", label: "Flow", value: 16, mod: "+3" },
    { name: "ARC", label: "Architecture", value: 14, mod: "+2" },
    { name: "SYS", label: "Logic", value: 19, mod: "+4" },
    { name: "NAR", label: "Narrative", value: 15, mod: "+2" },
  ] as Ability[],
  skills: [
    { label: "Astro / Frameworks", level: 3 },
    { label: "SolidJS / Reactivity", level: 2 },
    { label: "GSAP / Motion", level: 3 },
    { label: "Shader Programming", level: 1 },
    { label: "UI / UX Design", level: 3 },
    { label: "System Math", level: 2 },
  ] as SkillProficiency[],
  talents: {
    systemic: [
      { label: "Economy Modeling", val: "Advanced" },
      { label: "Combat Feedback Loops", val: "Expert" },
      { label: "Game Balance (Spreadsheets)", val: "Expert" },
    ],
    technical: [
      { label: "Prototyping (Grayboxing)", val: "Advanced" },
      { label: "UI State Architecture", val: "Expert" },
      { label: "Particle Systems", val: "Standard" },
    ],
    narrative: [
      { label: "World-Building Lore", val: "Expert" },
      { label: "Quest Dependency Trees", val: "Advanced" },
      { label: "Linear vs Emergent Flow", val: "Expert" },
    ],
  },
  traits: [
    {
      title: "Mathematical Empathy",
      description:
        "I design economies that feel rewarding, not just balanced. I use spreadsheets to simulate player emotion and friction.",
    },
    {
      title: "System Architect",
      description:
        "Proven ability to refactor complex logic into modular components without breaking the project's build-pipe.",
    },
    {
      title: "Human-Centric Design",
      description:
        "I don't design for my ego; I design for the cognitive load and 'Aha!' moments of the player.",
    },
  ] as LoreTrait[],
  lore: {
    philosophy:
      "Complexity is a hidden cost; Simplicity is the primary currency. My goal is to build systems that players feel before they understand.",
    milestones: [
      "Level 01: Compiled my first C++ engine logic (The 'Old World').",
      "Level 04: Led a team to ship a high-retention mobile prototype.",
      "Level 08: Mastering the intersection of Physics, Reactivity, and WebGL.",
      "Level 12: Scaling systemic depth through modular UI and data-driven design.",
    ],
    partyRole:
      "The Bridge: Speaking the language of Engineers (Logic) while protecting the vision of Artists (Aesthetics).",
  },
  inventory: [
    "⚔️ Masterwork Mechanical Keyboard",
    "💎 Potion of Unlimited Coffee",
    "📖 Ancient Scroll of StackOverflow",
    "🛡️ Shield of Prettier & ESLint",
  ],
};
