---
title: "Immune Defense"
subtitle: "Design & Product Documentation"
thumbnailSrc: "../../assets/projects/baraliotlogo.webp"
thumbnailAlt: "Immune Defense"
previewImage: "../../assets/projects/baraliot.webp"
heroImage: "../../assets/projects/baraliot.webp"
logo: ""
filterTags: ["Video Game"]
descriptorTags: ["System Design", "UI/UX", "Mobile"]
descriptorTagColors: { "System Design": "green", "UI/UX": "purple", "Mobile": "blue" }
previewButton:
  {
    text: "View Case Study",
    href: "/projectPages/immune-defense",
    ariaLabel: "Open immune defense project details",
  }
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
        props:
          {
            title: "Skills",
            icon: "fa-solid fa-palette",
            color: "green",
            tags: ["Game Systems", "Narrative", "Editing"],
          }
      - component: "Tags"
        options: { barColor: "transparent", compact: true }
        props:
          {
            title: "Genre",
            icon: "fa-solid fa-tag",
            color: "red",
            tags: ["Macro Strategy", "Top Down", "Team Based Shooter", "Casual"],
          }
      - component: "Button"
        options: { barColor: "transparent", compact: true }
        props:
          title: "Links"
          icon: "fa-solid fa-link"
          buttons:
            [
              {
                text: "Product Page",
                href: "projects.baraliot.productPage.url",
                icon: "fa-solid fa-arrow-up-right-from-square",
              },
              {
                text: "GDD PDF",
                href: "projects.baraliot.gdd.url",
                icon: "fa-solid fa-arrow-up-right-from-square",
              },
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
            The modern MOBA and hero shooter landscape has become increasingly unaccommodating to the average player due to extreme skill ceilings and unbudging design molds. This creates a polarized player base where the performance gap between casual and elite tiers results in unbalanced matchmaking and toxicity while being subjected to FOMO-driven monetization and retention methods. This leaves the target audience exhausted in engaging the genre they love.
      - component: "Text"
        props:
          title: "Vision"
          icon: "fa-solid fa-compass"
          content: |
            A charmingly unserious topdown shooter that reimagines what a big picture objective based multiplayer can be. An intuitive and expressive team shooter thats easy to learn and fun to master. Prioritizing frictionless casual experience for mass audience appeal and reliable fun.
      - component: "List"
        props:
          title: "Goals"
          icon: "fa-solid fa-bullseye"
          entries:
            - [
                "Game Sense over Execution",
                "Prioritize horizontal skill expression over a mechanics-heavy vertical ceiling.",
              ]
            - [
                "Cheerful Style, Cheerful Matches",
                "Lower match friction and play fatigue by delivering humor, lighthearted visuals, and a low-pressure atmosphere.",
              ]
            - [
                "New Axes of Play",
                "Introduce new variables and asymmetrical roles to let players tackle the classic team battle formula in fresh ways.",
              ]
            - [
                "Reliable Fun",
                "Respect players' time and accommodate them in matchmaking and rewards regardless of skill or retention levels.",
              ]

  - id: "work-in-progress"
    label: "Work In Progress"
    component: "Title"
    props:
      title: "Work in Progress"
      icon: "fa-solid fa-helmet-safety"
    subsections:
      - component: "Text"
        options: { barColor: "transparent" }
        props:
          content: |
            I am currently compiling the full documentation. This section will eventually include deeper dives into the system design, mechanics, and process.
---
