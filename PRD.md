# Agentic DND — Product Requirements Document (PRD)

## 1. Overview

### 1.1 Product Vision
Agentic DND is a solo text-based RPG experience where an AI acts as a fully autonomous Dungeon Master. Rather than following scripted paths, the AI dynamically generates narrative, manages world state, and makes creative decisions using a set of tools — creating NPCs, items, quests, and lore on-the-fly as the story demands.

### 1.2 Problem Statement
Traditional AI-powered RPG chatbots suffer from context loss, inconsistent world state, and shallow gameplay. They treat each prompt as an isolated conversation rather than maintaining a persistent, evolving game world with mechanical depth.

### 1.3 Solution
An agentic system where the AI DM is given structured tools to query and mutate a persistent game database. Every entity (NPC, item, quest, location) exists as a real record. The AI doesn't hallucinate inventory — it queries it. It doesn't forget an NPC's grudge — it reads the relationship state. Each turn, the AI receives fresh context built from the actual database state, ensuring consistency across sessions.

### 1.4 Out of Scope (Current Phase)
- Combat mode & turn-based combat system
- Dice rolling system / randomness mechanics
- Multiplayer / party system
- Authentication & account management (use simple placeholder)
- Mobile app
- Voice input/output
- Real-time collaboration

---

## 2. User Personas

### 2.1 Solo RPG Player
- Wants a rich, immersive D&D experience without needing a group
- Values narrative depth, meaningful choices, and world consistency
- Expects their actions to have lasting consequences
- Wants to manage their character (inventory, spells, equipment) with a proper UI

---

## 3. User Stories

### 3.1 Campaign Creation
- **US-001**: As a player, I want to create a new campaign so that a unique world is generated for me to explore.
- **US-002**: As a player, I want to create my character by choosing a name, race, and class so that I have a personalized avatar in the world.
- **US-003**: As a player, I want the AI to generate a world with areas, points of interest, NPCs, items, factions, and lore so that I have a rich world to explore from the start.

### 3.2 Narrative Gameplay
- **US-004**: As a player, I want to type free-form actions and have the AI DM respond narratively so that I feel like I'm playing a real tabletop RPG.
- **US-005**: As a player, I want the AI to remember past events and reference them so that the world feels alive and consistent.
- **US-006**: As a player, I want NPCs to remember our past interactions and react accordingly so that relationships feel meaningful.
- **US-007**: As a player, I want to explore different locations and discover new points of interest so that exploration is rewarding.
- **US-008**: As a player, I want the AI to create new content (NPCs, items, quests) dynamically when the story calls for it so that the world never feels empty.

### 3.3 Inventory & Equipment
- **US-009**: As a player, I want to view my inventory so that I know what items I'm carrying.
- **US-010**: As a player, I want to equip and unequip items so that my character's stats reflect my gear choices.
- **US-011**: As a player, I want to see a confirmation when I receive items (from purchases, loot, rewards) so that I know exactly what I got.
- **US-012**: As a player, I want item bonuses to be reflected in my character stats automatically so that I don't have to manually calculate.

### 3.4 Character Management
- **US-013**: As a player, I want to view my character sheet (stats, skills, appearance, backstory) so that I understand my character.
- **US-014**: As a player, I want to view my known spells and prepared spells so that I can manage my magical abilities.
- **US-015**: As a player, I want to view my features and traits (from race and class) so that I know my character's abilities.
- **US-016**: As a player, I want to view my available actions so that I know what I can do.
- **US-017**: As a player, I want to see my effective stats (base + equipment modifiers + effect modifiers) so that I have an accurate picture.

### 3.5 Quest System
- **US-018**: As a player, I want to receive quests from NPCs so that I have goals to pursue.
- **US-019**: As a player, I want to view my active, completed, and failed quests so that I can track my progress.

### 3.6 Companion System
- **US-020**: As a player, I want to recruit NPCs as companions (max 3) so that I have allies in my adventures.
- **US-021**: As a player, I want companions to have combat profiles so that they can participate in encounters.

### 3.7 Chapter & Memory System
- **US-022**: As a player, I want the AI to organize my adventure into chapters so that the story has structure.
- **US-023**: As a player, I want the AI to recall relevant past events when they matter to the current situation so that continuity is maintained.

---

## 4. Functional Requirements

### 4.1 Campaign Generation

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | System shall generate a world with name, description, and currency | P0 |
| FR-002 | System shall generate a world map with hierarchical areas (continent → kingdom → duchy → region) | P0 |
| FR-003 | System shall generate points of interest within areas, each with ASCII maps | P0 |
| FR-004 | System shall generate initial classes with features, spellcasting properties, and resources | P0 |
| FR-005 | System shall generate initial races with traits | P0 |
| FR-006 | System shall generate initial NPCs with personalities, backstories, and mannerisms | P0 |
| FR-007 | System shall generate initial factions with reputation and influence | P1 |
| FR-008 | System shall generate initial items, monsters, and spells | P1 |
| FR-009 | System shall generate lore entries for areas and points of interest | P1 |
| FR-010 | System shall initialize campaign game state (party level, time, weather, starting location) | P0 |

### 4.2 Agentic Turn Loop

| ID | Requirement | Priority |
|---|---|---|
| FR-020 | Each turn shall build fresh context from: instructions, campaign context, chapter summary, scene state, recent conversations, and tool definitions | P0 |
| FR-021 | AI shall select and invoke appropriate tools based on the current situation | P0 |
| FR-022 | AI shall construct its narrative response using data retrieved from tool calls | P0 |
| FR-023 | After each turn, system shall update the chapter summary (append) | P0 |
| FR-024 | After each turn, system shall update the current scene state | P0 |
| FR-025 | Conversation history shall be stored with role, content, and turn number | P0 |
| FR-026 | Context shall include: persona, narrative tone, rules, and tool usage policy | P0 |
| FR-027 | Context shall include: world information, party level, in-game time, in-game weather | P0 |

### 4.3 Chapter System

| ID | Requirement | Priority |
|---|---|---|
| FR-030 | AI shall determine when a chapter ends based on narrative progression | P0 |
| FR-031 | On chapter end, narrative summary shall be stored with vector embedding for RAG | P0 |
| FR-032 | Chapter record shall include metadata: related NPCs, monsters, items, POIs, factions, quests | P0 |
| FR-033 | Chapter record shall include player decisions | P0 |
| FR-034 | Chapters shall maintain linked-list navigation (prev/next) | P1 |

### 4.4 NPC System

| ID | Requirement | Priority |
|---|---|---|
| FR-040 | NPCs shall maintain memory of interactions with the player | P0 |
| FR-041 | NPCs shall track relationship level and tags per player character | P0 |
| FR-042 | NPC relationship tags shall include contextual info (e.g., "owes favor", "stolen from") | P0 |
| FR-043 | NPCs shall track first-met chapter ID; AI prompt shall differ for first vs. return encounters | P0 |
| FR-044 | NPCs shall maintain inter-NPC relationships | P1 |
| FR-045 | NPCs can become companions (max 3 per party) with combat profiles | P1 |

### 4.5 Item & Modifier System

| ID | Requirement | Priority |
|---|---|---|
| FR-050 | Items shall not directly modify character base stats | P0 |
| FR-051 | Equipped items shall create `character_stat_modifier` entries (flat or override) | P0 |
| FR-052 | Status effects shall create `character_stat_modifier` or `character_effect_modifier` entries | P0 |
| FR-053 | Character stat calculation shall aggregate: base stats + flat modifiers + override modifiers | P0 |
| FR-054 | `character_effect_modifier` shall support: immunities, resistances, vulnerabilities, condition immunities | P0 |
| FR-055 | Stat modifiers shall support optional TTL (turn-based expiry) | P1 |
| FR-056 | Weapons shall have `weapon_properties` (damage, properties) | P0 |
| FR-057 | Armor shall have `armor_properties` (STR requirement, AC, stealth disadvantage) | P0 |

### 4.6 RAG / Memory Recall

| ID | Requirement | Priority |
|---|---|---|
| FR-060 | System shall support vector similarity search over chapter narrative summaries | P0 |
| FR-061 | AI shall have a "recall past events" tool that performs RAG search | P0 |
| FR-062 | AI shall have a "get related lore" tool that performs RAG search over lore entries | P1 |

### 4.7 Player-Facing UI Panels

| ID | Requirement | Priority |
|---|---|---|
| FR-070 | Player shall be able to open an Inventory panel showing all carried items with counts and sources | P0 |
| FR-071 | Player shall be able to open an Equipment panel showing equipped items per slot | P0 |
| FR-072 | Player shall be able to open a Spells panel showing known/prepared spells | P0 |
| FR-073 | Player shall be able to open a Features & Traits panel showing race and class abilities | P0 |
| FR-074 | Player shall be able to open a Character Details panel (stats, skills, appearance, backstory) | P0 |
| FR-075 | Player shall be able to open an Actions panel showing available actions | P1 |
| FR-076 | Player shall see effective stats (base + all modifiers applied) in character panels | P0 |

---

## 5. Non-Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-001 | AI response time should be under 15 seconds for a standard narrative turn | P1 |
| NFR-002 | Database shall persist all game state; no data loss on server restart | P0 |
| NFR-003 | System shall support resuming a campaign from where the player left off | P0 |
| NFR-004 | LLM provider shall be abstracted behind a switchable interface | P0 |
| NFR-005 | API shall follow RESTful conventions | P0 |
| NFR-006 | Frontend shall be responsive (desktop-first, mobile-friendly) | P1 |
| NFR-007 | System shall handle tool-call failures gracefully (retry or fallback response) | P1 |

---

## 6. AI Tool Catalog

These are the tools available to the AI DM during the narrative turn loop. The AI autonomously selects which tools to call based on the current game situation.

### 6.1 World & Location Tools
| Tool | Description |
|---|---|
| `get_area_list` | Retrieve areas with optional filters |
| `create_area` | Create a new area (with optional lore) |
| `get_poi_list` | Retrieve points of interest with optional filters |
| `create_poi` | Create a new point of interest (with optional lore, ASCII map) |
| `update_poi` | Update a POI's status or contents |

### 6.2 Entity Tools
| Tool | Description |
|---|---|
| `get_npc_list` | Retrieve NPCs with optional filters |
| `create_npc` | Create a new NPC with full profile |
| `update_npc_memory` | Append to an NPC's memory (player interactions) |
| `update_npc_status` | Update NPC state (health, location, disposition) |
| `get_monster_list` | Retrieve monsters with optional filters |
| `create_monster` | Create a new monster template |

### 6.3 Item Tools
| Tool | Description |
|---|---|
| `get_item_list` | Retrieve items with optional filters (type, rarity, cost range) |
| `create_item` | Create a new item with full properties |

### 6.4 Magic Tools
| Tool | Description |
|---|---|
| `get_spell_list` | Retrieve spells with optional filters (level, school, class) |
| `create_spell` | Create a new spell |

### 6.5 Quest Tools
| Tool | Description |
|---|---|
| `get_quest_list` | Retrieve quests with optional filters (status, difficulty, tag) |
| `create_quest` | Create a new quest |
| `update_quest` | Update quest status or details |

### 6.6 Lore & Memory Tools
| Tool | Description |
|---|---|
| `get_lore_list` | Retrieve lore entries |
| `get_related_lore` | RAG search for lore relevant to a query |
| `create_lore` | Create a new lore entry |
| `recall_past_events` | RAG search over chapter summaries for relevant past events |

### 6.7 Faction Tools
| Tool | Description |
|---|---|
| `get_faction_list` | Retrieve factions with optional filters |
| `create_faction` | Create a new faction |
| `update_faction` | Update faction reputation or influence toward the player |

### 6.8 Class & Race Tools
| Tool | Description |
|---|---|
| `get_class_list` | Retrieve classes with optional filters |
| `get_race_list` | Retrieve races with optional filters |

---

## 7. User Flows

### 7.1 New Campaign Flow
```
Player opens app
  → Clicks "New Campaign"
  → Enters campaign name
  → AI generates world (areas, POIs, lore, classes, races, NPCs, factions, items, monsters, spells)
  → Player creates character (name, race, class, appearance, backstory, stats)
  → Campaign initializes (game state, starting location, chapter 1)
  → Player enters the narrative
```

### 7.2 Narrative Turn Flow
```
Player types action / dialogue
  → System builds context (instructions + campaign state + summary + scene + conversation + tools)
  → AI receives context + player input
  → AI decides which tools to call (0 to many)
  → AI executes tool calls (query DB, create entities, update state)
  → AI crafts narrative response using retrieved/created data
  → Response displayed to player
  → System updates: chapter summary (append), scene state, conversation log
  → If AI decides chapter is complete:
      → Store chapter with summary + embedding + metadata
      → Start new chapter
```

### 7.3 Item Acquisition Flow
```
Player interacts with shop / loot / quest reward
  → AI calls get_item_list or create_item
  → AI determines items to give
  → System shows confirmation modal: "You received: [item list with details]"
  → Player confirms
  → Items added to inventory with source tag
  → If equippable, player can equip from inventory panel
  → On equip: character_stat_modifier entries created from item bonuses
```

### 7.4 NPC Interaction Flow
```
Player approaches NPC
  → AI checks NPC's player_relationship
  → If first meeting: prompt includes "first encounter" instructions
  → If returning: prompt includes relationship history, memory, and tags
  → AI role-plays NPC based on personality, mannerism, disposition
  → After interaction: AI calls update_npc_memory with interaction summary
  → Relationship level and tags updated as appropriate
```

---

## 8. UI/UX Overview

### 8.1 Main Game Screen
- **Chat area**: Primary interaction area — player input at bottom, narrative responses scrolling up
- **Side panels**: Slide-out panels for character management (inventory, equipment, spells, etc.)
- **Header bar**: Campaign name, current location, in-game time, weather

### 8.2 Character Panels
All panels are read-only views of the database state (mutations happen through AI interaction or explicit equip/unequip actions).

| Panel | Content |
|---|---|
| **Inventory** | All items with count, rarity indicator, source tag. Equip/unequip actions for gear. |
| **Equipment** | Visual slot layout (head, chest, hands, legs, feet, rings, weapon, shield). Shows equipped item stats. |
| **Spells** | Known spells grouped by level. Prepared toggle for "prepared" casters. Spell slots remaining. |
| **Features & Traits** | Grouped by source (Race / Class). Shows level acquired for class features. |
| **Character Details** | Full stat block with effective values, skills with proficiency markers, languages, appearance, personality, backstory. |
| **Actions** | Available actions based on class, race, and equipment. |

### 8.3 Confirmation Modals
- **Item acquisition**: Shows item name, rarity, type, and quantity with accept/decline
- **Quest received**: Shows quest name, description, difficulty, and objectives

---

## 9. Glossary

| Term | Definition |
|---|---|
| **Turn** | One player prompt + one AI response cycle |
| **Chapter** | A narrative segment determined by the AI. Stored with RAG-searchable summary on completion. |
| **Scene State** | The current snapshot of entities at the player's location (NPCs, monsters, items, positions) |
| **Chapter Summary** | Running text summary of narrative events and player decisions within the current chapter |
| **Tool** | A function the AI can invoke to read or write game data |
| **Flat Bonus** | A modifier that adds a fixed value to a stat |
| **Override Bonus** | A modifier that sets a stat to a specific value (takes precedence) |
| **POI** | Point of Interest — a specific location within an area (shop, dungeon, tavern, etc.) |
| **RAG** | Retrieval-Augmented Generation — searching past chapter summaries by semantic similarity |
| **Companion** | An NPC recruited to the player's party with a combat profile |
