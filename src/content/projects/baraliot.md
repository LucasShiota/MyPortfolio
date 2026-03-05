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
descriptorTagColors: { "Game System": "green", "Typography": "purple", "Writing": "purple", "Layout": "purple" }
previewButton: { text: "Learn more in depth", href: "/baraliot", ariaLabel: "Open project details" }
summary: |
  An NSR TRPG blending deckbuilding gameplay and deep character fantasy. Embracing improv, mixing, and synergy. A high-variety system players can easily jump into and get lost in.
sections:
  - id: "details"
    label: "Details"
    component: "Title"
    props:
      title: "Project Details"
      icon: "fa-solid fa-circle-info"
    subsections:
      - component: "Tags"
        options: { barColor: "transparent", compact: true }
        props: { title: "Tools", icon: "fa-solid fa-pen-ruler", color: "purple", tags: ["Affinity", "FontForge"] }
      - component: "Tags"
        options: { barColor: "transparent", compact: true }
        props: { title: "Skills", icon: "fa-solid fa-palette", color: "green", tags: ["Game Systems", "Narrative", "Editing"] }
      - component: "Tags"
        options: { barColor: "transparent", compact: true }
        props: { title: "Genre", icon: "fa-solid fa-tag", color: "red", tags: ["Tabletop", "Card Game", "Deckbuilder", "Role Playing Game"] }
      - component: "Button"
        options: { barColor: "transparent", compact: true }
        props:
          title: "Links"
          icon: "fa-solid fa-link"
          buttons: [
            { text: "Product Page", href: "projects.baraliot.productPage.url", icon: "fa-solid fa-arrow-up-right-from-square" },
            { text: "GDD PDF", href: "projects.baraliot.gdd.url", icon: "fa-solid fa-arrow-up-right-from-square" }
          ]

  - id: "core"
    label: "Core Design"
    component: "Title"
    props:
      title: "Core Design"
      icon: "fa-solid fa-star"
    subsections:
      - component: "Text"
        props:
          title: "Problem"
          icon: "fa-solid fa-circle-question"
          content: |
            Players seeking strong fantasy fullfillment are often forced to compromise on their wants: narrative systems that lack the mechanical foundation to build their character on, or crunchy games with linear progression that offer too few and complex tools to build with.
      - component: "Text"
        props:
          title: "Vision"
          icon: "fa-solid fa-compass"
          content: |
            An NSR TRPG blending deckbuilding gameplay and deep character fantasy. Embracing improv, mixing, and synergy. A high-variety system players can easily jump into and get lost in.
      - component: "CardList"
        props: 
          title: "Goals"
          icon: "fa-solid fa-bullseye"
          items:
            - "Use the gameplay potential of card and deckbuilding mechanics to their fullest"
            - "Evoke a sense of satisfaction in players realizing their character fantasy"
            - "Streamline rules and rulebook to lower the barrier of entry and the cost of play"
            - "Excite players with many choices and freedom without overwhelming them"
            - "A high-density, low-complexity approach to the overarching rules package"

  - id: "work-in-progress"
    label: "Work In Progress"
    component: "Title"
    props:
      title: "Work in Progress"
      icon: "fa-solid fa-helmet-safety"
    subsections:
      - component: "Text"
        options: { barColor: "transparent"}
        props:
          content: |
            An NSR TRPG blending deckbuilding gameplay and deep character fantasy. Embracing improv, mixing, and synergy. A high-variety system players can easily jump into and get lost in.

---
