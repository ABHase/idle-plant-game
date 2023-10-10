// biomesConfig.ts
export type BiomeName = "Beginner's Garden" | "Desert" | "Tropical Forest" | "Mountain" | "Swamp";

// biomesConfig.ts

export type BiomeConfig = {
    capacity: number;
    resource_modifiers: { sunlight: number; water: number };
    current_weather: string;
    ground_water_level: number;
    snowpack: number;
    pests: Record<string, number>;
    weather_conditions: Record<string, Record<string, number>>;
    rain_intensity: number;
    snow_intensity: number;
  };
  
  export const BIOMES: Record<BiomeName, BiomeConfig> = {
    "Beginner's Garden": {
        'capacity': 3,
        'resource_modifiers': {'sunlight': 1, 'water': 1},
        'current_weather': 'Sunny',
        'ground_water_level': 1000,
        'snowpack': 0,
        'pests': {'Aphids': 0.1, 'Deer': 0.05, 'None': 0.85},
        'weather_conditions': {
            'Spring': {'Sunny': 0.6, 'Rainy': 0.3, 'Cloudy': 0.1},
            'Summer': {'Sunny': 0.7, 'Rainy': 0.2, 'Cloudy': 0.1},
            'Autumn': {'Sunny': 0.5, 'Rainy': 0.3, 'Cloudy': 0.2},
            'Winter': {'Sunny': 0.4, 'Snowy': 0.4, 'Cloudy': 0.2},
        },
        'rain_intensity': 50,
        'snow_intensity': 4  
    },
    'Desert': {
        'capacity': 5,
        'resource_modifiers': {'sunlight': 1.5, 'water': 0.5},
        'current_weather': 'Sunny',
        'ground_water_level': 200,
        'snowpack': 0,
        'pests': {'Boar': 0.2, 'None': 0.8},
        'weather_conditions': {
            'Spring': {'Sunny': 0.9, 'Rainy': 0.05, 'Cloudy': 0.05},
            'Summer': {'Sunny': 0.95, 'Rainy': 0.03, 'Cloudy': 0.02},
            'Autumn': {'Sunny': 0.9, 'Rainy': 0.05, 'Cloudy': 0.05},
            'Winter': {'Sunny': 0.9, 'Snowy': 0.05, 'Cloudy': 0.05},
        },
        'rain_intensity': 200,
        'snow_intensity': 15  
    },
    'Tropical Forest': {
        'capacity': 4,
        'resource_modifiers': {'sunlight': 1.2, 'water': 1.3},
        'current_weather': 'Rainy',
        'ground_water_level': 1500,
        'snowpack': 0,
        'pests': {'Aphids': 0.1, 'Deer': 0.05, 'None': 0.85},
        'weather_conditions': {
            'Spring': {'Sunny': 0.4, 'Rainy': 0.5, 'Cloudy': 0.1},
            'Summer': {'Sunny': 0.3, 'Rainy': 0.6, 'Cloudy': 0.1},
            'Autumn': {'Sunny': 0.4, 'Rainy': 0.5, 'Cloudy': 0.1},
            'Winter': {'Sunny': 0.5, 'Rainy': 0.4, 'Cloudy': 0.1},
        },
        'rain_intensity': 100,
        'snow_intensity': 0  
    },
    'Mountain': {
        'capacity': 2,
        'resource_modifiers': {'sunlight': 1.1, 'water': 0.9},
        'current_weather': 'Cloudy',
        'ground_water_level': 800,
        'snowpack': 800,
        'pests': {'Boar': 0.2, 'None': 0.8},
        'weather_conditions': {
            'Spring': {'Sunny': 0.5, 'Rainy': 0.2, 'Cloudy': 0.3},
            'Summer': {'Sunny': 0.6, 'Rainy': 0.1, 'Cloudy': 0.3},
            'Autumn': {'Sunny': 0.4, 'Rainy': 0.2, 'Cloudy': 0.4},
            'Winter': {'Sunny': 0.3, 'Snowy': 0.5, 'Cloudy': 0.2},
        },
        'rain_intensity': 80,
        'snow_intensity': 12  
    },
    'Swamp': {
        'capacity': 6,
        'resource_modifiers': {'sunlight': 0.8, 'water': 1.4},
        'current_weather': 'Rainy',
        'ground_water_level': 1800,
        'snowpack': 0,
        'pests': {'Aphids': 0.1, 'Deer': 0.05, 'None': 0.85},
        'weather_conditions': {
            'Spring': {'Sunny': 0.3, 'Rainy': 0.6, 'Cloudy': 0.1},
            'Summer': {'Sunny': 0.2, 'Rainy': 0.7, 'Cloudy': 0.1},
            'Autumn': {'Sunny': 0.3, 'Rainy': 0.6, 'Cloudy': 0.1},
            'Winter': {'Sunny': 0.4, 'Snowy': 0.3, 'Cloudy': 0.3},
        },
        'rain_intensity': 120,
        'snow_intensity': 8  
    }
}


