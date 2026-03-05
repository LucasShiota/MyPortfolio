---
id: "1"
title: "Baraliot Fantasia"
subtitle: "Design & Product Documentation"
thumbnailSrc: "/images/baraliotlogo.webp"
thumbnailAlt: "Baraliot Fantasia thumbnail"
previewImage: "/images/baraliot.webp"
heroImage: "/images/baraliot.webp"
logo: ""
filterTags: ["TRPG"]
descriptorTags: ["Game System", "Typography", "Layout", "Writing"]
descriptorTagColors:
  "Game System": "green"
  "Typography": "purple"
  "Writing": "purple"
  "Layout" : "purple"
previewButton:
  text: "Learn more in depth"
  href: "/baraliot"
  ariaLabel: "Open project details"
summary: |
  An NSR TRPG blending deckbuilding gameplay and deep character fantasy. Embracing improv, mixing, and synergy. A high-variety system players can easily jump into and get lost in.
sections:
  - id: "core"
    label: "Core"
    component: "Text"
    props:
      title: "Core"
      icon: "fa-solid fa-circle-info"
      content: 
        " "
    subsections:
      - id: "problem"
        label: "Problem"
        component: "Text"
        props:
          title: "Problem"
          icon: "fa-solid fa-circle-question"
          content: |
            Players seeking strong fantasy fullfillment are often forced to compromise on their wants: narrative systems that lack the mechanical foundation to build their character on, or crunchy games with linear progression that offer too few and complex tools to build with.
      - id: "vision"
        label: "Vision"
        component: "Text"
        props:
          title: "Vision"
          icon: "fa-solid fa-compass"
          content: |
            An NSR TRPG blending deckbuilding gameplay and deep character fantasy. Embracing improv, mixing, and synergy. A high-variety system players can easily jump into and get lost in.
      - id: "goals"
        label: "Design Goals"
        component: "Goals"
        props: 
          goals:
            - "Use the gameplay potential of card and deckbuilding mechanics to their fullest"
            - "Evoke a sense of satisfaction in players realizing their character fantasy"
            - "Streamline rules and rulebook to lower the barrier of entry and the cost of play"
            - "Excite players with many choices and freedom without overwhelming them"
            - "A high-density, low-complexity approach to the overarching rules package"
      - id: "tags"
        label: "tags"
        component: Tags
        options: 
          excludeFromOrder: true
        props:
          title: "Technologies"
          icon: "fa-solid fa-code" # Optional
          color: "purple" # green, purple, or red
          tags: ["React", "Astro", "TypeScript", "Tailwind CSS"]
  - id: "coming-soon"
    label: "More Details"
    component: "ComingSoon"
    props: {}
---

The core design goals of Baraliot Fantasia focus on accessibility without sacrificing depth. By leveraging card-based mechanics, we create a tactile and highly synergistic experience that allows for rapid improvisation and character realization.
