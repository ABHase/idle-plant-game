// upgrades.ts

import { PlantState } from "./Slices/plantSlice";

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
};

export const UPGRADES: Record<string, Upgrade[]> = {
  Column: [
    {
      id: "Column_Fern",
      name: "Fern Column",
      description: "Applied Last, Starting Roots^2 and Starting Leaves^2.",
      cost: 0,
    },
    {
      id: "Column_Succulent",
      name: "Succulent Column",
      description: "Applied Last, Sugar Production^2.",
      cost: 0,
    },
    {
      id: "Column_Grass",
      name: "Grass Column",
      description:
        "Applied Last, Season Bonuses*2, Manual Absorbtion^2, Spread^2.",
      cost: 0,
    },
    {
      id: "Column_Moss",
      name: "Moss Column",
      description: "Applied Last, Passive Water and Sunlight Absorbtion^2.",
      cost: 0,
    },
    {
      id: "Column_Bush",
      name: "Bush Column",
      description:
        "Applied Last, Reduces Flower sugar and water thresholds significantly, Manual Absorbtion^2.",
      cost: 0,
    },
    {
      id: "Column_Vine",
      name: "Vine Column",
      description:
        "Applied Last, Amplifies the time boost effect by squaring it!",
      cost: 0,
    },
  ],
  Adjacency: [
    {
      id: "Adjacent_to_Fern",
      name: "Adjacent to Fern",
      description: "Starting Roots and Leaves +100.",
      cost: 0,
    },
    {
      id: "Adjacent_to_Succulent",
      name: "Adjacent to Succulent",
      description: "Sugar Production Rate *2.",
      cost: 0,
    },
    {
      id: "Adjacent_to_Grass",
      name: "Adjacent to Grass",
      description: "Season Bonuses*2, Manual Absorbtion*5, Spread*3.",
      cost: 0,
    },
    {
      id: "Adjacent_to_Moss",
      name: "Adjacent to Moss",
      description: "Passive Water and Sunlight Absorbtion*20.",
      cost: 0,
    },
    {
      id: "Adjacent_to_Bush",
      name: "Adjacent to Bush",
      description:
        "Flower Sugar and Water Thresholds * 0.4, Manual Absorbtion*5.",
      cost: 0,
    },
    {
      id: "Adjacent_to_Vine",
      name: "Adjacent to Vine",
      description: "Amplifies the time boost effect, 2X more.",
      cost: 0,
    },
  ],
  Meta: [
    {
      id: "Moss_leaf_bonus",
      name: "Absorbent Leaves (All Species)",
      description:
        "Leaves are water neutral and no longer lost due to dehydration.",
      cost: 50,
    },
    {
      id: "Succulent_sugar_bonus",
      name: "Agave Sugar (All Species)",
      description: "Sugar production 10X for non-Succulent plants.",
      cost: 5000,
    },
    {
      id: "Grass_growth_toggle",
      name: "Growth Toggle (All Species)",
      description: "Option to toggle auto growth on/off.",
      cost: 500,
    },
    {
      id: "Fern_clone_upgrade",
      name: "Clone Upgrade (All Species)",
      description: "Start with 1K extra roots and leaves.",
      cost: 2000,
    },
    {
      id: "Bush_map",
      name: "Unlock the Map (All Species)",
      description: "Unlock the map.",
      cost: 15000,
    },
    {
      id: "Vine_scale_1",
      name: "Vine Scale 1 (All Species)",
      description:
        "Amplifies the time boost effect, 1X more.  Kept on Map Moves.",
      cost: 50,
    },
    {
      id: "Vine_scale_2",
      name: "Vine Scale 2 (All Species)",
      description:
        "Amplifies the time boost effect, 1X more.  Kept on Map Moves.",
      cost: 150,
    },
    {
      id: "Vine_scale_3",
      name: "Vine Scale 3 (All Species)",
      description:
        "Amplifies the time boost effect, 1X more.  Kept on Map Moves.",
      cost: 300,
    },
    {
      id: "Vine_scale_4",
      name: "Vine Scale 4 (All Species)",
      description:
        "Amplifies the time boost effect, 2X more.  Kept on Map Moves.",
      cost: 600,
    },
  ],
  Fern: [
    {
      id: "aphid_immunity",
      name: "Aphid Immunity",
      description: "Ferns are immune to aphids",
      cost: 50,
    },
    {
      id: "boost_sugar",
      name: "Cam Pathway",
      description: "Increase base sugar production by 50%",
      cost: 1,
    },
    {
      id: "boost_sugar_tier_2",
      name: "Cam Pathway Tier 2",
      description: "Increase base sugar production by 100%",
      cost: 10,
    },
    {
      id: "boost_sunlight_absorption",
      name: "Trichomes",
      description: "Increase manual sunlight absorption by 50%",
      cost: 1,
    },
    {
      id: "boost_sunlight_absorption_tier_2",
      name: "Trichomes Tier 2",
      description: "Increase manual sunlight absorption by 100%",
      cost: 10,
    },
    {
      id: "boost_water_absorption",
      name: "Aquaporins",
      description: "Increase manual water absorption by 50%",
      cost: 1,
    },
    {
      id: "boost_water_absorption_tier_2",
      name: "Aquaporins Tier 2",
      description: "Increase manual water absorption by 100%",
      cost: 10,
    },
    {
      id: "boost_sunlight_multiplier",
      name: "Heliotropism",
      description: "Increase passive sunlight absorption efficiency by 20%",
      cost: 3,
    },
    {
      id: "boost_sunlight_multiplier_tier_2",
      name: "Heliotropism Tier 2",
      description: "Increase passive sunlight absorption efficiency by 40%",
      cost: 20,
    },
    {
      id: "boost_water_multiplier",
      name: "Root Hairs",
      description: "Increase passive water absorption efficiency by 20%",
      cost: 3,
    },
    {
      id: "boost_water_multiplier_tier_2",
      name: "Root Hairs Tier 2",
      description: "Increase passive water absorption efficiency by 40%",
      cost: 20,
    },
    {
      id: "boost_sunlight_efficiency_multiplier",
      name: "Extra Chlorophyll",
      description: "Reduce the base sunlight to sugar ratio by 10%",
      cost: 7,
    },
    {
      id: "boost_sunlight_efficiency_multiplier_tier_2",
      name: "Extra Chlorophyll Tier 2",
      description: "Reduce the base sunlight to sugar ratio by 20%",
      cost: 50,
    },
    {
      id: "boost_water_efficiency_multiplier",
      name: "Stomatal Regulation",
      description: "Reduce the base water to sugar ratio by 10%",
      cost: 7,
    },
    {
      id: "boost_water_efficiency_multiplier_tier_2",
      name: "Stomatal Regulation Tier 2",
      description: "Reduce the base water to sugar ratio by 20%",
      cost: 50,
    },

    {
      id: "toggle_genetic_marker_upgrade",
      name: "Nutrient Recycling",
      description: "Double the rate of genetic marker production",
      cost: 10,
    },

    {
      id: "increase_root_rot_threshold",
      name: "Symboisis",
      description: "Increase the root rot threshold by 100%",
      cost: 100,
    },
    {
      id: "bloom",
      name: "Spring Bloom",
      description: "Double Spring Bonus",
      cost: 250,
    },
    {
      id: "thermophilic",
      name: "Thermophilic",
      description: "Double Summer Bonus",
      cost: 250,
    },
    {
      id: "bountiful_harvest",
      name: "Bountiful Harvest",
      description: "Double Autumn Bonus",
      cost: 500,
    },
    {
      id: "coniferous",
      name: "Coniferous",
      description: "Reduce Winter penalty by 50%",
      cost: 1000,
    },
  ],
  Moss: [
    {
      id: "bromeliad",
      name: "Bromeliad",
      description: "Doubles the amount of sunlight absorbed by Moss",
      cost: 1,
    },
    {
      id: "lichen_store",
      name: "Lichen Co-Op",
      description: "Unlocks the Lichen Store",
      cost: 30,
    },
    {
      id: "boost_sugar_moss_first",
      name: "Proto Cam Pathway",
      description: "Increase base sugar production by 100%",
      cost: 7,
    },
    {
      id: "boost_sugar_moss",
      name: "Cam Pathway",
      description: "Increase base sugar production by 100%",
      cost: 75,
    },
    {
      id: "boost_sugar_moss_2",
      name: "Cam Pathway 2",
      description: "Increase base sugar production by 200%",
      cost: 100,
    },
    {
      id: "boost_sugar_moss_3",
      name: "Cam Pathway 3",
      description: "Increase base sugar production by 300%",
      cost: 110,
    },
  ],
  Succulent: [
    {
      id: "needle_protection_1",
      name: "Needle Protection",
      description: "Needles protect twice as much water",
      cost: 5,
    },
    {
      id: "needle_protection_2",
      name: "Needle Protection 2",
      description: "Needles protect 50% more water",
      cost: 15,
    },
    {
      id: "needle_protection_3",
      name: "Needle Protection 3",
      description: "Needles protect 50% more water",
      cost: 20,
    },
    {
      id: "needle_protection_4",
      name: "Needle Protection 4",
      description: "Needles protect 100% more water",
      cost: 50,
    },
    {
      id: "rabbit_immunity",
      name: "Rabbit Immunity",
      description: "Succulents are immune to rabbits",
      cost: 450,
    },
    {
      id: "boost_sunlight_multiplier_succulent",
      name: "Heliotropism",
      description: "Increase passive sunlight absorption efficiency by 20%",
      cost: 30,
    },
    {
      id: "boost_sunlight_multiplier_succulent_2",
      name: "Heliotropism 2",
      description: "Increase passive sunlight absorption efficiency by 40%",
      cost: 100,
    },
    {
      id: "boost_water_multiplier_succulent",
      name: "Root Hairs",
      description: "Increase passive water absorption efficiency by 20%",
      cost: 30,
    },

    {
      id: "boost_water_multiplier_succulent_2",
      name: "Root Hairs 2",
      description: "Increase passive water absorption efficiency by 40%",
      cost: 100,
    },
    {
      id: "boost_sunlight_efficiency_multiplier_succulent",
      name: "Extra Chlorophyll",
      description: "Reduce the base sunlight to sugar ratio by 10%",
      cost: 70,
    },
    {
      id: "boost_sunlight_efficiency_multiplier_succulent_2",
      name: "Extra Chlorophyll 2",
      description: "Reduce the base sunlight to sugar ratio by 20%",
      cost: 200,
    },
    {
      id: "boost_water_efficiency_multiplier_succulent",
      name: "Stomatal Regulation",
      description: "Reduce the base water to sugar ratio by 10%",
      cost: 70,
    },

    {
      id: "boost_water_efficiency_multiplier_succulent_2",
      name: "Stomatal Regulation 2",
      description: "Reduce the base water to sugar ratio by 20%",
      cost: 200,
    },
    {
      id: "bloom_succulent",
      name: "Spring Bloom",
      description: "Double Spring Bonus",
      cost: 1000,
    },
    {
      id: "thermophilic_succulent",
      name: "Thermophilic",
      description: "Double Summer Bonus",
      cost: 1000,
    },
    {
      id: "bountiful_harvest_succulent",
      name: "Bountiful Harvest",
      description: "Double Autumn Bonus",
      cost: 1000,
    },
    {
      id: "coniferous_succulent",
      name: "Coniferous",
      description: "Reduce Winter penalty by 50%",
      cost: 2000,
    },
  ],
  Grass: [
    {
      id: "auto_root_growth_multiplier_efficiency",
      name: "Rhizomes",
      description: "Reduce the cost of auto root growth from 5x to 2x",
      cost: 1,
    },
    {
      id: "boost_sunlight_multiplier_grass",
      name: "Heliotropism",
      description: "Increase passive sunlight absorption efficiency by 20%",
      cost: 3,
    },
    {
      id: "boost_sunlight_multiplier_grass_2",
      name: "Heliotropism 2",
      description: "Increase passive sunlight absorption efficiency by 40%",
      cost: 10,
    },
    {
      id: "boost_water_multiplier_grass",
      name: "Root Hairs",
      description: "Increase passive water absorption efficiency by 20%",
      cost: 3,
    },

    {
      id: "boost_water_multiplier_grass_2",
      name: "Root Hairs 2",
      description: "Increase passive water absorption efficiency by 40%",
      cost: 10,
    },
    {
      id: "boost_sunlight_efficiency_multiplier_grass",
      name: "Extra Chlorophyll",
      description: "Reduce the base sunlight to sugar ratio by 10%",
      cost: 7,
    },
    {
      id: "boost_sunlight_efficiency_multiplier_grass_2",
      name: "Extra Chlorophyll 2",
      description: "Reduce the base sunlight to sugar ratio by 20%",
      cost: 20,
    },
    {
      id: "boost_water_efficiency_multiplier_grass",
      name: "Stomatal Regulation",
      description: "Reduce the base water to sugar ratio by 10%",
      cost: 7,
    },

    {
      id: "boost_water_efficiency_multiplier_grass_2",
      name: "Stomatal Regulation 2",
      description: "Reduce the base water to sugar ratio by 20%",
      cost: 20,
    },
    {
      id: "auto_grow_100",
      name: "Spread 100",
      description:
        "Auto grows 100 more roots or leaves per cycle, for the same sugar.",
      cost: 50,
    },
    {
      id: "auto_grow_1000",
      name: "Spread 1000",
      description:
        "Auto grows 1000 more roots or leaves per cycle, for the same sugar.",
      cost: 100,
    },
    {
      id: "auto_grow_10000",
      name: "Spread 10000",
      description:
        "Auto grows 10000 more roots or leaves per cycle, for the same sugar.",
      cost: 250,
    },
    {
      id: "bloom_grass",
      name: "Spring Bloom",
      description: "Double Spring Bonus",
      cost: 50,
    },
    {
      id: "thermophilic_grass",
      name: "Thermophilic",
      description: "Double Summer Bonus",
      cost: 50,
    },
    {
      id: "bountiful_harvest_grass",
      name: "Bountiful Harvest",
      description: "Double Autumn Bonus",
      cost: 100,
    },
    {
      id: "coniferous_grass",
      name: "Coniferous",
      description: "Reduce Winter penalty by 50%",
      cost: 200,
    },
  ],
  Bush: [
    {
      id: "flower_dna_upgrade",
      name: "Flower DNA",
      description: "Flowers now give 2 more DNA when they mature",
      cost: 200,
    },
    {
      id: "flower_dna_upgrade_2",
      name: "Flower DNA 2",
      description: "Flowers now give 5 more DNA when they mature",
      cost: 500,
    },
    {
      id: "flower_dna_upgrade_3",
      name: "Flower DNA 3",
      description: "Flowers now give 10 more DNA when they mature",
      cost: 1000,
    },
    {
      id: "boost_sugar_bush",
      name: "Cam Pathway",
      description: "Increase base sugar production by 50%",
      cost: 10,
    },
    {
      id: "boost_sugar_tier_2_bush",
      name: "Cam Pathway Tier 2",
      description: "Increase base sugar production by 100%",
      cost: 100,
    },
    {
      id: "boost_sunlight_absorption_bush",
      name: "Trichomes",
      description: "Increase manual sunlight absorption by 50%",
      cost: 10,
    },
    {
      id: "boost_sunlight_absorption_tier_2_bush",
      name: "Trichomes Tier 2",
      description: "Increase manual sunlight absorption by 100%",
      cost: 100,
    },
    {
      id: "boost_water_absorption_bush",
      name: "Aquaporins",
      description: "Increase manual water absorption by 50%",
      cost: 10,
    },
    {
      id: "boost_water_absorption_tier_2_bush",
      name: "Aquaporins Tier 2",
      description: "Increase manual water absorption by 100%",
      cost: 100,
    },
    {
      id: "boost_sunlight_multiplier_bush",
      name: "Heliotropism",
      description: "Increase passive sunlight absorption efficiency by 20%",
      cost: 30,
    },
    {
      id: "boost_sunlight_multiplier_tier_2_bush",
      name: "Heliotropism Tier 2",
      description: "Increase passive sunlight absorption efficiency by 40%",
      cost: 200,
    },
    {
      id: "boost_water_multiplier_bush",
      name: "Root Hairs",
      description: "Increase passive water absorption efficiency by 20%",
      cost: 30,
    },
    {
      id: "boost_water_multiplier_tier_2_bush",
      name: "Root Hairs Tier 2",
      description: "Increase passive water absorption efficiency by 40%",
      cost: 200,
    },

    {
      id: "boost_water_efficiency_multiplier_bush",
      name: "Stomatal Regulation",
      description: "Reduce the base water to sugar ratio by 10%",
      cost: 70,
    },
    {
      id: "boost_water_efficiency_multiplier_tier_2_bush",
      name: "Stomatal Regulation Tier 2",
      description: "Reduce the base water to sugar ratio by 20%",
      cost: 500,
    },
    {
      id: "boost_sunlight_efficiency_multiplier_bush",
      name: "Extra Chlorophyll",
      description: "Reduce the base sunlight to sugar ratio by 10%",
      cost: 70,
    },

    {
      id: "boost_sunlight_efficiency_multiplier_tier_2_bush",
      name: "Extra Chlorophyll Tier 2",
      description: "Reduce the base sunlight to sugar ratio by 20%",
      cost: 500,
    },

    {
      id: "flower_turbo_consumption",
      name: "Turbo Flowers",
      description:
        "Flowers consume twice as much sugar and water but mature twice as fast",
      cost: 2000,
    },
    {
      id: "bloom_bush",
      name: "Spring Bloom",
      description: "Double Spring Bonus",
      cost: 2500,
    },
    {
      id: "thermophilic_bush",
      name: "Thermophilic",
      description: "Double Summer Bonus",
      cost: 2500,
    },
    {
      id: "bountiful_harvest_bush",
      name: "Bountiful Harvest",
      description: "Double Autumn Bonus",
      cost: 5000,
    },
    {
      id: "coniferous_bush",
      name: "Coniferous",
      description: "Reduce Winter penalty by 50%",
      cost: 10000,
    },
  ],
  Vine: [
    {
      id: "vine_boost_sugar",
      name: "Cam Pathway",
      description: "Increase base sugar production by 50%",
      cost: 10,
    },
    {
      id: "vine_boost_sugar_2",
      name: "Cam Pathway 2",
      description: "Increase base sugar production by 200%",
      cost: 50,
    },
    {
      id: "vine_boost_sugar_3",
      name: "Cam Pathway 3",
      description: "Increase base sugar production by 500%",
      cost: 150,
    },
    {
      id: "vine_boost_sugar_4",
      name: "Cam Pathway 4",
      description: "Increase base sugar production by 1000%",
      cost: 500,
    },
    {
      id: "vine_boost_sunlight_efficiency_multiplier",
      name: "Extra Chlorophyll",
      description: "Reduce the base sunlight to sugar ratio a further 50%",
      cost: 70,
    },
    {
      id: "vine_boost_water_efficiency_multiplier",
      name: "Stomatal Regulation",
      description: "Reduce the base water to sugar ratio a further 50%",
      cost: 70,
    },
    {
      id: "vine_boost_sunlight_efficiency_multiplier_2",
      name: "Extra Chlorophyll 2",
      description: "Reduce the base sunlight to sugar ratio by a further 75%",
      cost: 300,
    },
    {
      id: "vine_boost_water_efficiency_multiplier_2",
      name: "Stomatal Regulation 2",
      description: "Reduce the base water to sugar ratio by a further 75%",
      cost: 300,
    },
  ],
};

export const UPGRADE_FUNCTIONS: Record<
  string,
  { [key: string]: (plant: PlantState) => void }
> = {
  Row: {
    Column_Fern: (plant) => {
      plant.roots *= plant.roots;
      plant.leaves *= plant.leaves;
    },
    Column_Succulent: (plant) => {
      if (plant.sugar_production_rate > 1) {
        plant.sugar_production_rate *= plant.sugar_production_rate;
      } else {
        plant.sugar_production_rate =
          1 / (plant.sugar_production_rate * plant.sugar_production_rate);
      }
    },
    Column_Grass: (plant) => {
      plant.springModifier *= 2;
      plant.summerModifier *= 2;
      plant.autumnModifier *= 2;
      plant.winterModifier *= 2;
      plant.sunlight_absorption_rate *= plant.sunlight_absorption_rate;
      plant.water_absorption_rate *= plant.water_absorption_rate;
      plant.autoGrowthMultiplier *= plant.autoGrowthMultiplier;
    },
    Column_Moss: (plant) => {
      if (plant.sunlight_absorption_multiplier > 1) {
        plant.sunlight_absorption_multiplier *=
          plant.sunlight_absorption_multiplier;
      } else {
        plant.sunlight_absorption_multiplier =
          1 /
          (plant.sunlight_absorption_multiplier *
            plant.sunlight_absorption_multiplier);
      }

      if (plant.water_absorption_multiplier > 1) {
        plant.water_absorption_multiplier *= plant.water_absorption_multiplier;
      } else {
        plant.water_absorption_multiplier =
          1 /
          (plant.water_absorption_multiplier *
            plant.water_absorption_multiplier);
      }
    },
    Column_Bush: (plant) => {
      plant.flowerSugarThreshold *= 0.4 * 0.4;
      plant.flowerWaterThreshold *= 0.4 * 0.4;
      plant.water_absorption_rate *= plant.water_absorption_rate;
      plant.sunlight_absorption_rate *= plant.sunlight_absorption_rate;
    },
    Column_Vine: (plant) => {
      plant.timeScaleBoost *= plant.timeScaleBoost;
    },
  },
  Adjacency: {
    Adjacent_to_Fern: (plant) => {
      plant.roots += 100;
      plant.leaves += 100;
    },
    Adjacent_to_Succulent: (plant) => {
      plant.sugar_production_rate *= 2;
    },
    Adjacent_to_Grass: (plant) => {
      plant.springModifier *= 2;
      plant.summerModifier *= 2;
      plant.autumnModifier *= 2;
      plant.winterModifier *= 2;
      plant.sunlight_absorption_rate *= 5;
      plant.water_absorption_rate *= 5;
      plant.autoGrowthMultiplier *= 3;
    },
    Adjacent_to_Moss: (plant) => {
      plant.sunlight_absorption_multiplier *= 20;
      plant.water_absorption_multiplier *= 20;
    },
    Adjacent_to_Bush: (plant) => {
      plant.flowerSugarThreshold *= 0.4;
      plant.flowerWaterThreshold *= 0.4;
      plant.water_absorption_rate *= 5;
      plant.sunlight_absorption_rate *= 5;
    },
    Adjacent_to_Vine: (plant) => {
      plant.timeScaleBoost *= 2;
    },
  },
  Meta: {
    Moss_leaf_bonus: (plant) => {
      plant.leafWaterUsage = false;
    },
    Succulent_sugar_bonus: (plant) => {
      plant.agaveSugarBonus = true;
    },
    Grass_growth_toggle: (plant) => {
      plant.grassGrowthToggle = true;
    },
    Fern_clone_upgrade: (plant) => {
      plant.roots += 1000;
      plant.leaves += 1000;
    },
    Vine_scale_1: (plant) => {
      plant.timeScaleBoost += 1;
    },
    Vine_scale_2: (plant) => {
      plant.timeScaleBoost += 1;
    },
    Vine_scale_3: (plant) => {
      plant.timeScaleBoost += 1;
    },
    Vine_scale_4: (plant) => {
      plant.timeScaleBoost += 2;
    },
  },
  Fern: {
    aphid_immunity: (plant) => {
      plant.aphidImmunity = true;
    },
    boost_sugar: (plant) => {
      plant.sugar_production_rate *= 1.5;
    },
    boost_sunlight_absorption: (plant) => {
      plant.sunlight_absorption_rate *= 1.5;
    },
    boost_water_absorption: (plant) => {
      plant.water_absorption_rate *= 1.5;
    },
    boost_sunlight_multiplier: (plant) => {
      plant.sunlight_absorption_multiplier *= 1.2;
    },
    boost_water_multiplier: (plant) => {
      plant.water_absorption_multiplier *= 1.2;
    },
    boost_sunlight_efficiency_multiplier: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.9;
    },
    boost_water_efficiency_multiplier: (plant) => {
      plant.water_efficiency_multiplier *= 0.9;
    },
    boost_sugar_tier_2: (plant) => {
      plant.sugar_production_rate *= 2;
    },
    boost_sunlight_absorption_tier_2: (plant) => {
      plant.sunlight_absorption_rate *= 2;
    },
    boost_water_absorption_tier_2: (plant) => {
      plant.water_absorption_rate *= 2;
    },
    boost_sunlight_multiplier_tier_2: (plant) => {
      plant.sunlight_absorption_multiplier *= 1.4;
    },
    boost_water_multiplier_tier_2: (plant) => {
      plant.water_absorption_multiplier *= 1.4;
    },
    boost_sunlight_efficiency_multiplier_tier_2: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.8;
    },
    boost_water_efficiency_multiplier_tier_2: (plant) => {
      plant.water_efficiency_multiplier *= 0.8;
    },
    toggle_genetic_marker_upgrade: (plant) => {
      plant.geneticMarkerUpgradeActive = !plant.geneticMarkerUpgradeActive;
    },
    increase_root_rot_threshold: (plant) => {
      plant.rootRotThreshold *= 2;
    },
    bloom: (plant) => {
      plant.springModifier *= 2;
    },
    thermophilic: (plant) => {
      plant.summerModifier *= 2;
    },
    bountiful_harvest: (plant) => {
      plant.autumnModifier *= 2;
    },
    coniferous: (plant) => {
      plant.winterModifier *= 2;
    },
  },
  Moss: {
    bromeliad: (plant) => {
      plant.sunlight_absorption_multiplier *= 2;
    },
    lichen_store: (plant) => {
      plant.lichenStoreAvailable = true;
    },
    boost_sugar_moss_first: (plant) => {
      plant.sugar_production_rate *= 2;
    },
    boost_sugar_moss: (plant) => {
      plant.sugar_production_rate *= 2;
    },
    boost_sugar_moss_2: (plant) => {
      plant.sugar_production_rate *= 3;
    },
    boost_sugar_moss_3: (plant) => {
      plant.sugar_production_rate *= 4;
    },
  },
  Succulent: {
    needle_protection_1: (plant) => {
      plant.needleProtection *= 2;
    },
    needle_protection_2: (plant) => {
      plant.needleProtection *= 1.5;
    },
    needle_protection_3: (plant) => {
      plant.needleProtection *= 1.5;
    },
    needle_protection_4: (plant) => {
      plant.needleProtection *= 2;
    },
    boost_sunlight_multiplier_succulent: (plant) => {
      plant.sunlight_absorption_multiplier *= 1.2;
    },
    boost_water_multiplier_succulent: (plant) => {
      plant.water_absorption_multiplier *= 1.2;
    },
    boost_sunlight_multiplier_succulent_2: (plant) => {
      plant.sunlight_absorption_multiplier *= 1.4;
    },
    boost_water_multiplier_succulent_2: (plant) => {
      plant.water_absorption_multiplier *= 1.4;
    },
    boost_sunlight_efficiency_multiplier_succulent: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.9;
    },
    boost_water_efficiency_multiplier_succulent: (plant) => {
      plant.water_efficiency_multiplier *= 0.9;
    },
    boost_sunlight_efficiency_multiplier_succulent_2: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.8;
    },
    boost_water_efficiency_multiplier_succulent_2: (plant) => {
      plant.water_efficiency_multiplier *= 0.8;
    },
    bloom_succulent: (plant) => {
      plant.springModifier *= 2;
    },
    thermophilic_succulent: (plant) => {
      plant.summerModifier *= 2;
    },
    bountiful_harvest_succulent: (plant) => {
      plant.autumnModifier *= 2;
    },
    coniferous_succulent: (plant) => {
      plant.winterModifier *= 2;
    },
    rabbit_immunity: (plant) => {
      plant.rabbitImmunity = true;
    },
  },
  Grass: {
    auto_root_growth_multiplier_efficiency: (plant) => {
      plant.rootAutoGrowthMultiplier = 2;
    },
    boost_sunlight_multiplier_grass: (plant) => {
      plant.sunlight_absorption_multiplier *= 1.2;
    },
    boost_water_multiplier_grass: (plant) => {
      plant.water_absorption_multiplier *= 1.2;
    },
    boost_sunlight_multiplier_grass_2: (plant) => {
      plant.sunlight_absorption_multiplier *= 1.4;
    },
    boost_water_multiplier_grass_2: (plant) => {
      plant.water_absorption_multiplier *= 1.4;
    },
    boost_sunlight_efficiency_multiplier_grass: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.9;
    },
    boost_water_efficiency_multiplier_grass: (plant) => {
      plant.water_efficiency_multiplier *= 0.9;
    },
    boost_sunlight_efficiency_multiplier_grass_2: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.8;
    },
    boost_water_efficiency_multiplier_grass_2: (plant) => {
      plant.water_efficiency_multiplier *= 0.8;
    },
    bloom_grass: (plant) => {
      plant.springModifier *= 2;
    },
    thermophilic_grass: (plant) => {
      plant.summerModifier *= 2;
    },
    bountiful_harvest_grass: (plant) => {
      plant.autumnModifier *= 2;
    },
    coniferous_grass: (plant) => {
      plant.winterModifier *= 2;
    },
    auto_grow_100: (plant) => {
      plant.autoGrowthMultiplier += 100;
    },
    auto_grow_1000: (plant) => {
      plant.autoGrowthMultiplier += 1000;
    },
    auto_grow_10000: (plant) => {
      plant.autoGrowthMultiplier += 10000;
    },
  },
  Bush: {
    boost_sugar_bush: (plant) => {
      plant.sugar_production_rate *= 1.5;
    },
    boost_sunlight_absorption_bush: (plant) => {
      plant.sunlight_absorption_rate *= 1.5;
    },
    boost_water_absorption_bush: (plant) => {
      plant.water_absorption_rate *= 1.5;
    },
    boost_sunlight_multiplier_bush: (plant) => {
      plant.sunlight_absorption_multiplier *= 1.2;
    },
    boost_water_multiplier_bush: (plant) => {
      plant.water_absorption_multiplier *= 1.2;
    },
    boost_sunlight_efficiency_multiplier_bush: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.9;
    },
    boost_water_efficiency_multiplier_bush: (plant) => {
      plant.water_efficiency_multiplier *= 0.9;
    },
    boost_sugar_tier_2_bush: (plant) => {
      plant.sugar_production_rate *= 2;
    },
    boost_sunlight_absorption_tier_2_bush: (plant) => {
      plant.sunlight_absorption_rate *= 2;
    },
    boost_water_absorption_tier_2_bush: (plant) => {
      plant.water_absorption_rate *= 2;
    },
    boost_sunlight_multiplier_tier_2_bush: (plant) => {
      plant.sunlight_absorption_multiplier *= 1.4;
    },
    boost_water_multiplier_tier_2_bush: (plant) => {
      plant.water_absorption_multiplier *= 1.4;
    },
    boost_sunlight_efficiency_multiplier_tier_2_bush: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.8;
    },
    boost_water_efficiency_multiplier_tier_2_bush: (plant) => {
      plant.water_efficiency_multiplier *= 0.8;
    },
    flower_turbo_consumption: (plant) => {
      plant.flowerSugarConsumptionRate *= 2;
      plant.flowerWaterConsumptionRate *= 2;
    },
    bloom_bush: (plant) => {
      plant.springModifier *= 2;
    },
    thermophilic_bush: (plant) => {
      plant.summerModifier *= 2;
    },
    bountiful_harvest_bush: (plant) => {
      plant.autumnModifier *= 2;
    },
    coniferous_bush: (plant) => {
      plant.winterModifier *= 2;
    },
    flower_dna_upgrade: (plant) => {
      plant.flowerDNA += 2;
    },
    flower_dna_upgrade_2: (plant) => {
      plant.flowerDNA += 5;
    },
    flower_dna_upgrade_3: (plant) => {
      plant.flowerDNA += 10;
    },
  },
  Vine: {
    vine_boost_sugar: (plant) => {
      plant.sugar_production_rate *= 1.5;
    },
    vine_boost_sugar_2: (plant) => {
      plant.sugar_production_rate *= 3;
    },
    vine_boost_sugar_3: (plant) => {
      plant.sugar_production_rate *= 6;
    },
    vine_boost_sugar_4: (plant) => {
      plant.sugar_production_rate *= 11;
    },
    vine_boost_sunlight_efficiency_multiplier: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.5;
    },
    vine_boost_water_efficiency_multiplier: (plant) => {
      plant.water_efficiency_multiplier *= 0.5;
    },
    vine_boost_sunlight_efficiency_multiplier_2: (plant) => {
      plant.sunlight_efficiency_multiplier *= 0.25;
    },
    vine_boost_water_efficiency_multiplier_2: (plant) => {
      plant.water_efficiency_multiplier *= 0.25;
    },
  },
  // ... other upgrade functions
};
