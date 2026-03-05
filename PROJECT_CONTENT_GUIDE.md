# Project Content Configuration Guide (.md Format)

This project uses a "Blueprint & Factory" system. The `.md` files in `src/content/projects/` are the **Blueprints** (Structured Data), while the `.astro` files are the **Factory** (Layout & Logic).

---

## 🏗️ The File Structure

Each project file is split into two halves by triple-dashes (`---`).

1.  **Frontmatter (YAML)**: The top section. This is a structured database defining the page layout, components, and props.
2.  **Body (Markdown)**: The bottom section. Used for free-form long-form text (Case studies, Essays).

---

## 📊 The "Smart Logic" System (Navigation & Numbering)

The presence of `id` and `label` in a section or subsection automatically determines its behavior.

| Configuration | Behavioral Result |
| :--- | :--- |
| **No ID / No Label** | **Anonymous Section**: No number (1.1), hidden from Sidebar, no URL anchor. |
| **ID only** | **Anchor Section**: Hidden from sidebar and numbering, but has a linkable URL (e.g., `#research`). |
| **ID + Label** | **Formal Section**: Appears in the Sidebar, receives a number (1, 1.1), and is linkable. |

---

## 🎨 Styling Options (`options:`)

Apply these inside any section or subsection:

*   **`compact: true`**: Reduces vertical padding. Ideal for "Tools," "Genre," or small text blocks.
*   **`barColor: "transparent" | "#color"`**: Sets the color of the vertical hierarchy bar on the left.
*   **`excludeFromOrder: true`**: Manually force-hides a section from the sidebar even if it has a label.

---

## 🧱 Component Registry

Use these values for the `component:` field:

### 1. `Title`
A large header block. Often used as a "Parent" to group multiple subsections.
*   **Props**: `title`, `icon`.

### 2. `Text`
Standard text blocks.
*   **Props**: `content` (supports multiline `|` syntax), `title` (optional), `icon` (optional).

### 3. `Tags`
Displays a set of chips/pills.
*   **Props**: 
    -   `tags`: `["Tag 1", "Tag 2"]`
    -   `color`: `"green" | "purple" | "red" | "blue"`
    -   `title` (optional), `icon` (optional)

### 4. `Overview`
A metadata block for project info.
*   **Props**: `title`, `icon`.

### 5. `Goals`
A grid of high-level project objectives.
*   **Props**: `title`, `icon`, `items: ["Goal 1", "Goal 2"]`.

### 6. `Button`
Displays one or more CTA buttons.
*   **Props**: 
    -   `buttons`: List of objects with `text`, `href`, and optional `icon` (e.g., `fa-solid fa-download`).
    -   `title` (optional), `icon` (optional)

---

## 🤖 Instructions for AI Agents

When editing or creating content:
1.  **Minimize Redundancy**: If a section is "Anonymous" (extra details), do not provide an `id` or `label`.
2.  **Headerless Sections**: If you want content to sit directly in the card without a header, omit both `title` and `icon` from the `props`.
3.  **Hierarchy**: Use `subsections:` to group related items under a common `Title` component. This automatically applies the "Hierarchy Bar" and indentation.
4.  **Multiline Text**: Use the YAML pipe `content: |` for long text blocks to preserve line breaks and readability.

---

## 📝 Example Snippet

```yaml
- id: "details"
  label: "Project Details"
  component: "Title"
  props:
    title: "Details"
    icon: "fa-solid fa-info"
  subsections:
    - component: "Tags"      # Anonymous: No number, No sidebar
      options:
        compact: true
      props:
        tags: ["React", "Astro"]
        color: "blue"
```
