Agentic DND

Concept
Agentic AI that let the AI as DM decide what to do. System will provide multiple choices of tools that AI can use. For example: create new item, generate map, get item list (with filter), create monster, etc. With that set of tools, AI choose whatever tool that suits current condition and state of the gameplay. Example : Player entering shop, AI will check item list that it can provide to player. If AI feels the item list is not enough, it can create more item and later add it to the shop item list.

The agentic system only caters narrative mode, while combat mode implement different logic. there will be a state inside “campaign” (master) table that hold the “mode” value  

Flow
On generate campaign, AI will generate:
- world map, some areas, and necessary point of interest, complete with its lore etc. (ASCII format)
- Classes with its progression
- Races with its traits
- NPCs
- Some items?
- Some monsters?
- Some spells?
- Some factions?
Agentic system will implemented inside the campaign. Instead of passing the whole agentic history (like previous turn tool calling and data from it), each turn is a brand new start. Each turn here means each user prompt.
Each turn it will constantly pass the pre loop builded context that contains:
- the instructions
- Campaign context
- summary of current chapter (that updated each turn)
- Current scene state
- latest conversations
- all necessary tools
The instructions will consist of:
- persona
- narrative tone
- Rules
- Tool usage policy
Campaign context will consist of:
- World information
- Party level
- in game time
- In game weather 
The summary will consist of:
- Narrative summary (text)
- player decision
Current scene state will consist of:
- Locations (current area, and PoI, also nearby PoI)
- monsters (position, health, etc)
- Npc’s (position, health, etc)
- Items (position, hidden or shown, etc)
- player’s data (position, health, etc)

Agent reply to user based on the builded response from data retrieved along the process.
After agent finish a turn, it will update the summary (appending), current state.

At the end of the chapter (the AI decide) the summary will be stored in DB and add vector into the narrative summary, become RAG searchable. The data row also contains metadata such as previous and next chapter, item, monsters, spells, npc, locations, etc related with the chapter, as well as the state like player decisions (anything inside “summary”).

Notes
- NPC got state saved (first met, disposition(with players), tags(extra info that related with player’s party like owes favor, hate player, stolen from player))
- If player get items (either from purchasing or looting) by talking to the agent, show confirmation containing list of item player receive
- There will be modifier from agent (like status effect or temporary boost) and will included in stat calculation. So instead of directly modifying the actual stat it will be added in character_stat_modifier or character_effect_modifier
- Item modify the stat, but not direct change into the stat as well. It will be added into character_stat_modifier (can be flat or override bonus) and will affect character stat calculation.
- for item with type armor and weapon will got weapon_properties and armor_properties
- on create area or poi, also create lore as optional

Extra Features
- companion (player party companion. got npc like combat profile). companion can be from npc (with max 3 companion in 1 party)

list of the tools (not finalized)
- Recall past events (RAG search to previous chapter)
- Get item list (with filter)
- Create item
- Get class list (with filter)
- Create class (still considering it)
- Get race list (with filter)
- Create race (still considering it)
- Get npc list (with filter)
- Create npc
- Update npc memory (anything happens between them and player)
- Update npc status (health, etc)
- Get monster list (with filter)
- Create monster
- Get spell list (with filter)
- Create spell
- Get quest list (with filter)
- Create quest
- Update quest
- get lore list
- get related lore (RAG)
- create lore
- create area
- get area (with filter)
- create PoI
- get PoI (with filter)
- update PoI (like status)
- Get factions (with filter)
- Create faction
- Update faction (the view towards player)

Things user can open
- inventory
- equipment
- spells
- feature and traits
- character details
- actions

DB Tables
accounts
- id
- username
- email
- password
- created_at
- updated_at
campaign
- id
- account_id
- name
campaign_game_state
- id
- campaign_id
- party_level
- short_rest_count
- in_game_time
- in_game_weather
- current_poi_id
- chapter_summary
- position (array of object “object (player | companion | any other (just set as string))”, “object_id (player id or companion id”, “position (x y position)”)
- updated_at
world
- id
- campaign_id
- name
- description
- currency_name
map
- id
- world_id
- descriptive_overview
area
- id
- map_id
- parent_area_id : nullable, self-FK. null = top-level
- depth : 0 = continent, 1 = kingdom, 2 = duchy, etc. 
- path : materialized path, e.g. "1/4/9" (ancestor ids)
- level_type : "continent" | "kingdom" | "duchy" | "region" | ... (flexible label, not enforced)
- nam
- description
- descriptive_overview
- descriptive_location
- factions (list of faction array)
poi
- id
- area_id
- name
- description
- descriptive_overview
- descriptive_location
- map (ASCII)
poi_item
- id
- poi_id
- item_id
- count
- is_hidden
- container (nullable)
- position
poi_npc
- id
- poi_id
- npc_id
- position
poi_monster_instance
- id
- poi_id
- monster_instance_id
- position
character
- id
- campaign_id
- name
- level (supposed to be align with “party_level” under campaign_game_state)
- race_id
- class_id
- alignment
- max_hp
- hp
- ac
- speed
- stat (object)
- skills (array of object “name” and “proficient” (bool))
- balance
- languages
- appearance
- personality
- backstory
- mannerism
character_feat_traits
- id
- character_id
- name
- description
- source (race | class)
- source_name (ex: Elf, Knight)
- level (if source class) (nullable)
character_resources
- id
- character_id
- name
- source (race | class)
- max
- current_value
character_spellcasting
- id
- character_id
- max_cantrip
- max_spell
- spell_source (array of object “level” and “available”)
character_spells
- id
- character_id
- spell_id
- is_prepared (only can be false if spellcasting preparation_type “prepared”)
character_stat_modifier
- Id
- character_id
- modifier (hp, ac, str, dex, …)
- value
- ttl (how long it persist) (nullable)
- source (equipment | effect)
- source_slug (mostly for equipment slug)
- type (override | flat)
character_effect_modifier
- id
- character_id
- type (immunities | resistances | vulnerabilities | condition_immunities)
- effect
inventory
- id
- character_id
- item_id
- count
- source ("loot" | "purchase" | "quest_reward" | "crafted” | etc…)
- equipped (bool) (nullable)
item
- id
- campaign_id
- name
- slug
- description
- appearance
- type (gear | armor | weapon)
- category (follows fables gg)
- rarity (follows fables gg)
- equip slot (optional) (follow fables gg)
- cost
- weight
- weapon_properties (object of “damage” and “properties”) (nullable)
- armor_properties (object of “strRequirement”, “ac”, “stealthDisadventage (bool)”) (nullable)
- flat_bonus (array of object “modifier (str, int, ac, etc…)”, and “value”) (nullable)
- override_bonus (array of object “modifier (str, int, ac, etc…)”, and “value”) (nullable)
class
- id
- campaign_id
- name
- description
- hit_die (follow fables.gg)
- features (array of object “name”, “description”, “level”, “type (passive | active)”)
- spellcasting_properties - spellcastingAbility (str | dex | int | …) - preparationType (prepared | known | pact_magic) - spellcastingType (full | half | third | pact_magic) - maxCantripKnown (array of object “level” and “value”) - maxSpellKnown (array of object “level” and “value”) - preparedLevelBonus (0 | 50 | 100 in percent)
class_resources
- id
- class_id
- name
- description
- max_per_level (array of object “level”, “value”)
- resource_recovery (object “short”, “long”. and each got “value”, “type (percentage | flat)”)
class_spells
- id
- class_id
- spell_id
race
- id
- campaign_id
- name
- description
- speed
- languages
- traits (array of object “name”, “description”, “type (passive | active)”)
npc
- id
- campaign_id
- name
- alignment
- appearance
- personality
- backstory
- mannerism
- memory (array of memories)
- npc_relationship (array of object “npcId (other npc)” and “relationshipLevel”)
- player_relationship (array of object “characterId”, “relationshipLevel”, “firstMetChapterId”, and “tags (array)”) (if character_id found, add to the prompt telling player has already met this npc. else  prompt first met)
- is_companion (bool default false)
npc_combat_profile
- id
- npc_id
- ac
- max_hp
- hp
- stat (same as player stat)
- speed
- actions (array, same shape as monster actions)
- cr_equivalent (nullable) (optional for balancing)
monster
- id
- campaign_id
- name
- description
- appearance
- languages
- alignment (follow fables.gg)
- size (follow fables.gg)
- type (follow fables.gg)
- min_hp
- max_hp
- ac
- cr
- stat (object)
- speed (follow fables.gg)
- senses (follow fables.gg)
- additional_properties (follow fables.gg)
- actions (array of object “name” and “description”)
monster_instance
- id
- campaign_id
- monster_id
- max_hp
- hp
- status (alive | dead | fled | unconscious | etc)
spell
- id
- campaign_id
- name
- description
- level
- range
- school
- attack_properties (object of “requiresRangedAttackRoll” and “damages (array of damages)”
- spell_save_properties (object of “savingThrowStat”, “onSuccessDamagePercentage” and “onFailDamagePercentage”)
quest
- id
- campaign_id
- name
- description
- gm_instruction
- quest_giver (npc_id)
- quest_location (poi_id) (set at quest giver location)
- quest_difficulty (easy | medium | hard)
- quest_tag (follow fables.gg)
- quest_prerequisites (object of “levelReq”, “questReq (other quest must be done before this quest)”)
- status (open | in_progress | complete | failed)
lore
- id
- campaign_id
- source_id
- source_type (area | poi)
- title
- content
faction
- id
- campaign_id
- name
- description
- reputation (evil | very bad | bad | less bad | neutral | towards good | good | very good | angel)
- influence (0 - 100)
conversation
- id
- campaign_id
- role
- content
- turn_number
- created_at
chapters
- id
- campaign_id
- chapter_number
- title
- narrative_summary
- player_decisions
- narrative_summary_embedding
- prev_chapter_id (pointing to other chapter data)
- next_chapter_id (pointing to other chapter data) (nullable)
- related_npc (array of npc_id)
- related_monsters (array of monster_id)
- related_item
- related_poi
- related_faction
- related_quest