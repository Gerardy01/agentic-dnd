import sequelize from '@/config/database';

import Account from '@/models/account/account.model';
import Campaign from '@/models/campaign/campaign.model';
import CampaignGameState from '@/models/campaignGameState/campaignGameState.model';
import World from '@/models/world/world.model';
import Map from '@/models/map/map.model';
import Area from '@/models/area/area.model';
import POI from '@/models/poi/poi.model';
import POIItem from '@/models/poiItem/poiItem.model';
import POINPC from '@/models/poiNpc/poiNpc.model';
import POIMonsterInstance from '@/models/poiMonsterInstance/poiMonsterInstance.model';
import ClassModel from '@/models/class/class.model';
import ClassResource from '@/models/classResource/classResource.model';
import Race from '@/models/race/race.model';
import Spell from '@/models/spell/spell.model';
import ClassSpell from '@/models/classSpell/classSpell.model';
import Item from '@/models/item/item.model';
import Character from '@/models/character/character.model';
import CharacterFeatTrait from '@/models/characterFeatTrait/characterFeatTrait.model';
import CharacterResource from '@/models/characterResource/characterResource.model';
import CharacterSpellcasting from '@/models/characterSpellcasting/characterSpellcasting.model';
import CharacterSpell from '@/models/characterSpell/characterSpell.model';
import CharacterStatModifier from '@/models/characterStatModifier/characterStatModifier.model';
import CharacterEffectModifier from '@/models/characterEffectModifier/characterEffectModifier.model';
import Inventory from '@/models/inventory/inventory.model';
import NPC from '@/models/npc/npc.model';
import NPCCombatProfile from '@/models/npcCombatProfile/npcCombatProfile.model';
import Monster from '@/models/monster/monster.model';
import MonsterInstance from '@/models/monsterInstance/monsterInstance.model';
import Quest from '@/models/quest/quest.model';
import Lore from '@/models/lore/lore.model';
import Faction from '@/models/faction/faction.model';
import Conversation from '@/models/conversation/conversation.model';
import Chapter from '@/models/chapter/chapter.model';
import RefreshToken from '@/models/refreshToken/refreshToken.model';
import OtpAuth from '@/models/otpAuth/otpAuth.model';

// ==========================================
// Relationships / Associations
// ==========================================

// Account <-> Campaign & RefreshToken
Account.hasMany(Campaign, { foreignKey: 'account_id', as: 'campaigns', onDelete: 'CASCADE' });
Campaign.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });

Account.hasMany(RefreshToken, { foreignKey: 'account_id', as: 'refreshTokens', onDelete: 'CASCADE' });
RefreshToken.belongsTo(Account, { foreignKey: 'account_id', as: 'account' });

// Campaign <-> CampaignGameState
Campaign.hasOne(CampaignGameState, { foreignKey: 'campaign_id', as: 'gameState', onDelete: 'CASCADE' });
CampaignGameState.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// Campaign <-> World <-> Map <-> Area <-> POI
Campaign.hasOne(World, { foreignKey: 'campaign_id', as: 'world', onDelete: 'CASCADE' });
World.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

World.hasOne(Map, { foreignKey: 'world_id', as: 'map', onDelete: 'CASCADE' });
Map.belongsTo(World, { foreignKey: 'world_id', as: 'world' });

Map.hasMany(Area, { foreignKey: 'map_id', as: 'areas', onDelete: 'CASCADE' });
Area.belongsTo(Map, { foreignKey: 'map_id', as: 'map' });

Area.hasMany(Area, { foreignKey: 'parent_area_id', as: 'subAreas', onDelete: 'SET NULL' });
Area.belongsTo(Area, { foreignKey: 'parent_area_id', as: 'parentArea' });

Area.hasMany(POI, { foreignKey: 'area_id', as: 'pois', onDelete: 'CASCADE' });
POI.belongsTo(Area, { foreignKey: 'area_id', as: 'area' });

// POI Contents (Junctions)
POI.hasMany(POIItem, { foreignKey: 'poi_id', as: 'poiItems', onDelete: 'CASCADE' });
POIItem.belongsTo(POI, { foreignKey: 'poi_id', as: 'poi' });
Item.hasMany(POIItem, { foreignKey: 'item_id', as: 'poiItems', onDelete: 'CASCADE' });
POIItem.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

POI.hasMany(POINPC, { foreignKey: 'poi_id', as: 'poiNpcs', onDelete: 'CASCADE' });
POINPC.belongsTo(POI, { foreignKey: 'poi_id', as: 'poi' });
NPC.hasMany(POINPC, { foreignKey: 'npc_id', as: 'poiNpcs', onDelete: 'CASCADE' });
POINPC.belongsTo(NPC, { foreignKey: 'npc_id', as: 'npc' });

POI.hasMany(POIMonsterInstance, { foreignKey: 'poi_id', as: 'poiMonsterInstances', onDelete: 'CASCADE' });
POIMonsterInstance.belongsTo(POI, { foreignKey: 'poi_id', as: 'poi' });
MonsterInstance.hasMany(POIMonsterInstance, { foreignKey: 'monster_instance_id', as: 'poiMonsterInstances', onDelete: 'CASCADE' });
POIMonsterInstance.belongsTo(MonsterInstance, { foreignKey: 'monster_instance_id', as: 'monsterInstance' });

// Classes & Class Resources
Campaign.hasMany(ClassModel, { foreignKey: 'campaign_id', as: 'classes', onDelete: 'CASCADE' });
ClassModel.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

ClassModel.hasMany(ClassResource, { foreignKey: 'class_id', as: 'resources', onDelete: 'CASCADE' });
ClassResource.belongsTo(ClassModel, { foreignKey: 'class_id', as: 'class' });

// Races
Campaign.hasMany(Race, { foreignKey: 'campaign_id', as: 'races', onDelete: 'CASCADE' });
Race.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// Spells & Class Spells
Campaign.hasMany(Spell, { foreignKey: 'campaign_id', as: 'spells', onDelete: 'CASCADE' });
Spell.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

ClassModel.hasMany(ClassSpell, { foreignKey: 'class_id', as: 'classSpells', onDelete: 'CASCADE' });
ClassSpell.belongsTo(ClassModel, { foreignKey: 'class_id', as: 'class' });
Spell.hasMany(ClassSpell, { foreignKey: 'spell_id', as: 'classSpells', onDelete: 'CASCADE' });
ClassSpell.belongsTo(Spell, { foreignKey: 'spell_id', as: 'spell' });

// Items
Campaign.hasMany(Item, { foreignKey: 'campaign_id', as: 'items', onDelete: 'CASCADE' });
Item.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// Characters & Details
Campaign.hasMany(Character, { foreignKey: 'campaign_id', as: 'characters', onDelete: 'CASCADE' });
Character.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });
Character.belongsTo(Race, { foreignKey: 'race_id', as: 'race' });
Character.belongsTo(ClassModel, { foreignKey: 'class_id', as: 'class' });

Character.hasMany(CharacterFeatTrait, { foreignKey: 'character_id', as: 'featTraits', onDelete: 'CASCADE' });
CharacterFeatTrait.belongsTo(Character, { foreignKey: 'character_id', as: 'character' });

Character.hasMany(CharacterResource, { foreignKey: 'character_id', as: 'resources', onDelete: 'CASCADE' });
CharacterResource.belongsTo(Character, { foreignKey: 'character_id', as: 'character' });

Character.hasOne(CharacterSpellcasting, { foreignKey: 'character_id', as: 'spellcasting', onDelete: 'CASCADE' });
CharacterSpellcasting.belongsTo(Character, { foreignKey: 'character_id', as: 'character' });

Character.hasMany(CharacterSpell, { foreignKey: 'character_id', as: 'characterSpells', onDelete: 'CASCADE' });
CharacterSpell.belongsTo(Character, { foreignKey: 'character_id', as: 'character' });
Spell.hasMany(CharacterSpell, { foreignKey: 'spell_id', as: 'characterSpells', onDelete: 'CASCADE' });
CharacterSpell.belongsTo(Spell, { foreignKey: 'spell_id', as: 'spell' });

Character.hasMany(CharacterStatModifier, { foreignKey: 'character_id', as: 'statModifiers', onDelete: 'CASCADE' });
CharacterStatModifier.belongsTo(Character, { foreignKey: 'character_id', as: 'character' });

Character.hasMany(CharacterEffectModifier, { foreignKey: 'character_id', as: 'effectModifiers', onDelete: 'CASCADE' });
CharacterEffectModifier.belongsTo(Character, { foreignKey: 'character_id', as: 'character' });

// Inventory
Character.hasMany(Inventory, { foreignKey: 'character_id', as: 'inventory', onDelete: 'CASCADE' });
Inventory.belongsTo(Character, { foreignKey: 'character_id', as: 'character' });
Item.hasMany(Inventory, { foreignKey: 'item_id', as: 'inventories', onDelete: 'CASCADE' });
Inventory.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

// NPCs & Combat Profile
Campaign.hasMany(NPC, { foreignKey: 'campaign_id', as: 'npcs', onDelete: 'CASCADE' });
NPC.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

NPC.belongsTo(Race, { foreignKey: 'race_id', as: 'race' });
Race.hasMany(NPC, { foreignKey: 'race_id', as: 'npcs', onDelete: 'SET NULL' });

NPC.hasOne(NPCCombatProfile, { foreignKey: 'npc_id', as: 'combatProfile', onDelete: 'CASCADE' });
NPCCombatProfile.belongsTo(NPC, { foreignKey: 'npc_id', as: 'npc' });

// Monsters & Monster Instances
Campaign.hasMany(Monster, { foreignKey: 'campaign_id', as: 'monsters', onDelete: 'CASCADE' });
Monster.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

Campaign.hasMany(MonsterInstance, { foreignKey: 'campaign_id', as: 'monsterInstances', onDelete: 'CASCADE' });
MonsterInstance.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });
Monster.hasMany(MonsterInstance, { foreignKey: 'monster_id', as: 'instances', onDelete: 'CASCADE' });
MonsterInstance.belongsTo(Monster, { foreignKey: 'monster_id', as: 'monster' });

// Quests
Campaign.hasMany(Quest, { foreignKey: 'campaign_id', as: 'quests', onDelete: 'CASCADE' });
Quest.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });
Quest.belongsTo(NPC, { foreignKey: 'quest_giver', as: 'giver' });
Quest.belongsTo(POI, { foreignKey: 'quest_location', as: 'location' });

// Lore
Campaign.hasMany(Lore, { foreignKey: 'campaign_id', as: 'lore', onDelete: 'CASCADE' });
Lore.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// Factions
Campaign.hasMany(Faction, { foreignKey: 'campaign_id', as: 'factions', onDelete: 'CASCADE' });
Faction.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// Conversations
Campaign.hasMany(Conversation, { foreignKey: 'campaign_id', as: 'conversations', onDelete: 'CASCADE' });
Conversation.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// Chapters
Campaign.hasMany(Chapter, { foreignKey: 'campaign_id', as: 'chapters', onDelete: 'CASCADE' });
Chapter.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });
Chapter.belongsTo(Chapter, { foreignKey: 'prev_chapter_id', as: 'prevChapter' });
Chapter.belongsTo(Chapter, { foreignKey: 'next_chapter_id', as: 'nextChapter' });

// CampaignGameState <-> Current POI
CampaignGameState.belongsTo(POI, { foreignKey: 'current_poi_id', as: 'currentPoi' });

export {
  sequelize,
  Account,
  Campaign,
  CampaignGameState,
  World,
  Map,
  Area,
  POI,
  POIItem,
  POINPC,
  POIMonsterInstance,
  ClassModel as Class,
  ClassResource,
  Race,
  Spell,
  ClassSpell,
  Item,
  Character,
  CharacterFeatTrait,
  CharacterResource,
  CharacterSpellcasting,
  CharacterSpell,
  CharacterStatModifier,
  CharacterEffectModifier,
  Inventory,
  NPC,
  NPCCombatProfile,
  Monster,
  MonsterInstance,
  Quest,
  Lore,
  Faction,
  Conversation,
  Chapter,
  RefreshToken,
  OtpAuth,
};
