---
id: "2"
title: "Immune Defense"
subtitle: "Design & Product Documentation"
thumbnailSrc: "/images/baraliotlogo.webp"
thumbnailAlt: "Immune Defense"
previewImage: "/images/baraliot.webp"
heroImage: "/images/baraliot.webp"
logo: ""
filterTags: ["Video Game"]
descriptorTags: ["System Design", "UI/UX", "Mobile"]
descriptorTagColors: { "System Design": "green", "UI/UX": "purple", "Mobile": "blue" }
previewButton: { text: "View Case Study", href: "/immune-defense", ariaLabel: "Open immune defense project details" }
summary: "A strategic mobile experience focused on biological defense mechanisms. Designing complex systems for a casual but deep gameplay loop."
sections:
  - id: "details"
    label: "Details"
    component: "Title"
    props:
      title: "Project Details"
      icon: "fa-solid fa-circle-info"
    subsections:
      - component: "Text"
        options: { barColor: "transparent", compact: true }
        props: 
          title: "Size"
          icon: "fa-solid fa-people-group"
          content: "Solo"
      - component: "Tags"
        options: { barColor: "transparent", compact: true }
        props: { title: "Tools", icon: "fa-solid fa-pen-ruler", color: "purple", tags: ["Unity"] }
      - component: "Tags"
        options: { barColor: "transparent", compact: true }
        props: { title: "Skills", icon: "fa-solid fa-palette", color: "green", tags: ["Game Systems", "Narrative", "Editing"] }
      - component: "Tags"
        options: { barColor: "transparent", compact: true }
        props: { title: "Genre", icon: "fa-solid fa-tag", color: "red", tags: ["Macro Strategy", "Top Down", "Team Based Shooter", "Casual"] }
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
            The modern MOBA and hero shooter landscape has become increasingly unaccommodating to the average player due to extreme skill ceilings and unbudging design molds. This creates a polarized player base where the performance gap between casual and elite tiers results in awful matchmaking and toxicity, while development cycles prioritize FOMO-driven monetization and retention methods.
      - component: "Text"
        props:
          title: "Vision"
          icon: "fa-solid fa-compass"
          content: |
            A charmingly unserious topdown shooter that reimagines what a big picture objective based multiplayer can be. An intuitive and expressive multiplayer thats easy to learn and fun to master. Prioritizing frictionless casual experience for mass audience appeal and reliable fun.
      - component: "CardList"
        props: 
          title: "Goals"
          icon: "fa-solid fa-bullseye"
          items:
            - "Prioritize instinctive skill expression over mechanics while ensuring a skill ceiling that doesnt exponentially increase skill delta"
            - "Lower match friction and play fatigue by delivering humor, unserious visuals, and "
            - "Create new challenges, variables, and assymetrical contributions to let players tackle the classic team battle formula in fresh different ways"
            - "Respect players time and accomodate them in matchmaking and reward systems despite skill or retention"
            - ""

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
            I am currently compiling the full documentation. This section will eventually include deeper dives into the system design, mechanics, and process.
---
