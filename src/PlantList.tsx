import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './rootReducer';
import {
    absorbSunlight,
    absorbWater,
    toggleSugarProduction,
    buyLeaves,
    buyRoots,
    toggleGeneticMarkerProduction,
} from './plantSlice';
import {
    Grid,
    Typography,
    Button,
    Divider,
    IconButton,
    Tooltip,
    Box,
    LinearProgress,
} from '@mui/material';
import { Add, ArrowForwardIos, Clear } from '@mui/icons-material';
import { LEAF_COST, ROOT_COST } from './constants';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import GrainIcon from '@mui/icons-material/Grain';
import GrassIcon from '@mui/icons-material/Grass';
import SpaIcon from '@mui/icons-material/Spa';
import ParkIcon from '@mui/icons-material/Park';
import {
    MATURITY_SUGAR_PRODUCTION_MODIFIER,
    MATURITY_WATER_CONSUMPTION_MODIFIER,
    MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER,
    BASE_WATER_CONSUMPTION,
    BASE_SUNLIGHT_CONSUMPTION,
} from './constants';

function PlantList() {
    const dispatch = useDispatch();
    const plant = useSelector((state: RootState) => state.plant);
    const [multiplier, setMultiplier] = useState<number>(1);  // default is 1

    const { geneticMarkerProgress, geneticMarkerThreshold } = useSelector(
        (state: RootState) => state.globalState
    );
    const plantState = useSelector((state: RootState) => state.plant);

    // Extract season from state (Assuming you have access to the state here)
    const { season } = useSelector(
        (state: RootState) => state.plantTime
    );
    

    // Sugar Modifier
    let sugarModifier = 1; // default
    if (season === 'Autumn') {
        sugarModifier = plantState.autumnModifier;
    } else if (season === 'Winter') {
        sugarModifier = plantState.winterModifier;
    }

    // Water Modifier
    let waterModifier = 1; // default
    if (season === 'Spring') {
        waterModifier = plantState.springModifier;
    } else if (season === 'Winter') {
        waterModifier = plantState.winterModifier;
    }

    // Sunlight Modifier
    let sunlightModifier = 1; // default
    if (season === 'Summer') {
        sunlightModifier = plantState.summerModifier;
    } else if (season === 'Winter') {
        sunlightModifier = plantState.winterModifier;
    }

    const baseRate = plantState.sugar_production_rate;
    const modifiedRate = baseRate * (1 + MATURITY_SUGAR_PRODUCTION_MODIFIER * plantState.maturity_level) * sugarModifier;
    const waterConsumption = BASE_WATER_CONSUMPTION * (1 + MATURITY_WATER_CONSUMPTION_MODIFIER * plantState.maturity_level);
    const sunlightConsumption = BASE_SUNLIGHT_CONSUMPTION * (1 + MATURITY_SUNLIGHT_CONSUMPTION_MODIFIER * plantState.maturity_level);  

    const isSugarProductionPossible = plantState.is_sugar_production_on && 
                                    plantState.water > waterConsumption && 
                                    plantState.sunlight > sunlightConsumption;

    const netSunlightRate = isSugarProductionPossible
        ? (plantState.leaves - sunlightConsumption) * plantState.sunlight_absorption_multiplier * sunlightModifier
        : plantState.leaves * plantState.sunlight_absorption_multiplier * sunlightModifier;

    const netWaterRate = isSugarProductionPossible
        ? (plantState.roots - plantState.leaves - waterConsumption) * plantState.water_absorption_multiplier * waterModifier
        : (plantState.roots - plantState.leaves) * plantState.water_absorption_multiplier * waterModifier;





    const handleSunlightAbsorption = () => {
        dispatch(absorbSunlight());
    };
    
    const handleWaterAbsorption = () => {
        dispatch(absorbWater());
    };
    
    const handleToggleSugarProduction = () => {
        dispatch(toggleSugarProduction());
    };

    const handleBuyRoots = () => {
        for (let i = 0; i < multiplier; i++){
        dispatch(buyRoots({ cost: ROOT_COST }));
        }
    };

    const handleBuyLeaves = () => {
        for (let i = 0; i < multiplier; i++){
        dispatch(buyLeaves({ cost: LEAF_COST }));
        }
    };

    const handleToggleGeneticMarkerProduction = () => {
        dispatch(toggleGeneticMarkerProduction());
    };

    const toggleMultiplier = (value: number) => {
        if (multiplier === value) {
            setMultiplier(1);  // If the clicked multiplier is the same as the current multiplier, reset to 1
        } else {
            setMultiplier(value);  // Otherwise, set to the clicked value
        }
    };
    

    return (
            <div key={plant.id} className="plant-container">
                <Box 
                    border={1} 
                    borderColor="grey.300" 
                    borderRadius={2}
                    width="320px"
                    padding={1}
                    margin= "0 auto"
                >
                <Grid container spacing={1} alignItems="center">
                <Grid item xs={4}>
                
                <Tooltip title={`${formatNumberWithDecimals(netWaterRate)}/Second`}>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={0.2}>
                        <Typography><OpacityIcon sx={{ fontSize: 22, color: 'blue' }} /> {formatNumberWithDecimals(plant.water)}</Typography>
                    </Box>
                    </Tooltip>

                    <Tooltip title='Roots'>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={0.2}>
                        <Typography><GrassIcon sx={{ fontSize: 22, color: 'grey', transform: 'rotate(180deg)' }}/> {formatNumberWithDecimals(plant.roots)}</Typography>
                    </Box>
               </Tooltip>

                </Grid>

                <Grid item xs={4}>
                <Tooltip title={`${formatNumberWithDecimals(netSunlightRate)}/second`}>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={.1}>
                        <Typography><WbSunnyIcon sx={{ fontSize: 22, color: 'orange' }} /> {formatNumberWithDecimals(plant.sunlight)}</Typography>
                    </Box>
                </Tooltip>  
                
                <Tooltip title='Leaves'>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={.1}>
                        <Typography><SpaIcon sx={{ fontSize: 22, color: 'green' }} /> {formatNumberWithDecimals(plant.leaves)}</Typography>
                    </Box>
                </Tooltip>
                
                </Grid>

                <Grid item xs={4}>
                <Tooltip title={`Converts ${formatNumberWithDecimals(waterConsumption)} water and ${formatNumberWithDecimals(sunlightConsumption)} sunlight into ${formatNumberWithDecimals(modifiedRate)} sugar per cycle.`}>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={.1}>
                        <Typography><GrainIcon sx={{ fontSize: 22, color: 'white' }} /> {formatNumberWithDecimals(plant.sugar)}</Typography>
                    </Box>
                </Tooltip>
                <Tooltip title='Size'>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={.1}>
                        <Typography><ParkIcon sx={{ fontSize: 22, color: 'green' }} /> {formatNumber(plant.maturity_level)}</Typography>
                    </Box>
                </Tooltip>
                </Grid>

<Grid item xs={12}>
    <Tooltip title={plant.is_sugar_production_on ? "Turn off Sugar Production" : "Turn on Sugar Production"}>
        <Button 
            fullWidth
            sx={{ 
                border: "1px solid #aaa", 
                borderRadius: "4px",
                backgroundColor: '#424532',
                color: '#B5D404',
                '&:active, &:focus': {
                    backgroundColor: '#424532',  // Or any other style reset
                },
            }}
            onClick={() => handleToggleSugarProduction()}>
            Photosynthesize: {plant.is_sugar_production_on ? "Stop" : "Start"}
        </Button>
    </Tooltip>
</Grid>


<Grid item xs={12}>
    <Tooltip title={plant.is_genetic_marker_production_on ? "Turn off Genetic Marker Production" : "Turn on Genetic Marker Production"}>
        <Button 
            fullWidth
            sx={{ 
                border: "1px solid #aaa", 
                borderRadius: "4px",
                backgroundColor: '#332932',
                color: '#DEA4FC',
                '&:active, &:focus': {
                    backgroundColor: '#332932',  // Or any other style reset
                }, 
            }}
            onClick={() => handleToggleGeneticMarkerProduction()}>
            Convert Sugar → DNA: {plant.is_genetic_marker_production_on ? "Stop" : "Start"}
        </Button>
    </Tooltip>
</Grid>




            <Grid item xs={12}>
                <Divider sx={{ backgroundColor: 'white' }} />
            </Grid> 
            <Grid item xs={3}>
            <Button 
                onClick={() => toggleMultiplier(1)} 
                variant={multiplier === 1 ? "contained" : "outlined"}
                sx={{ 
                    padding: '4px 8px' }}  
            >
                x1
            </Button>
            </Grid>
            <Grid item xs={3}>
            <Button 
                onClick={() => toggleMultiplier(10)} 
                variant={multiplier === 10 ? "contained" : "outlined"}
                sx={{ 
                    padding: '4px 8px' }}  
            >
                x10
            </Button>
            </Grid>
            <Grid item xs={3}>
            <Button 
                onClick={() => toggleMultiplier(100)} 
                variant={multiplier === 100 ? "contained" : "outlined"}
                sx={{ padding: '4px 8px' }}  
            >
                x100
            </Button>
            </Grid>
            <Grid item xs={3}>
            <Button 
                onClick={() => toggleMultiplier(1000)} 
                variant={multiplier === 1000 ? "contained" : "outlined"}
                sx={{ padding: '4px 8px' }}  
            >
                x1000
            </Button>
            </Grid>

{/* Leaves Section */}
<Grid item xs={12}>
    <Tooltip title="Grow Leaves">
        <Button 
            fullWidth
            sx={{ 
                border: "1px solid #aaa", 
                borderRadius: "4px",
                backgroundColor: '#424532',
                color: '#B5D404',
                '&:active, &:focus': {
                    backgroundColor: '#424532',  // Or any other style reset
                }, 
            }}
            onClick={() => handleBuyLeaves()}>
            Grow Leaves: {multiplier} Leaf for {LEAF_COST * multiplier} Sugar
        </Button>
    </Tooltip>
</Grid>

{/* Roots Section */}
<Grid item xs={12}>
    <Tooltip title="Grow Roots">
        <Button 
            fullWidth
            sx={{ 
                border: "1px solid #aaa", 
                borderRadius: "4px",
                backgroundColor: '#363534',
                color: '#C7B08B',
                '&:active, &:focus': {
                    backgroundColor: '#363534',  // Or any other style reset
                },
            }}
            onClick={() => handleBuyRoots()}>
            Grow Roots: {multiplier} Root for {ROOT_COST * multiplier} Sugar
        </Button>
    </Tooltip>
</Grid>

            <Grid item xs={12}>
            <Divider sx={{ backgroundColor: 'white' }} />
        </Grid>

        <Grid item xs={6}>
            <Tooltip title="Absorb Water">
                <Button 
                sx={{ 
                    border: "1px solid #aaa", 
                    borderRadius: "4px",
                    backgroundColor: '#0F4A52',
                    color: '#34F7E1',
                    '&:active, &:focus': {
                        backgroundColor: '#0F4A52',  // Or any other style reset
                    }, 
                    }}
                onClick={() => handleWaterAbsorption()}>
                    Absorb Water 
                </Button>
            </Tooltip>
        </Grid>
        <Grid item xs={6}>
            <Tooltip title="Absorb Sunlight">
                <Button 
                sx={{ 
                    border: "1px solid #aaa", 
                    borderRadius: "4px",
                    backgroundColor: '#633912',
                    color: '#FFC64D',
                    '&:active, &:focus': {
                        backgroundColor: '#633912',  // Or any other style reset
                    }, 
                    }}
                onClick={() => handleSunlightAbsorption()}>
                    Absorb Sunlight
                </Button>
            </Tooltip>
        </Grid>
        <Grid item xs={12}>
            <Divider sx={{ backgroundColor: 'white' }} />
        </Grid>
        <Grid item xs={12}>
        <Box position="relative" display="inline-flex" width="100%">
            <LinearProgress 
                variant="determinate" 
                value={(plant.rootRot / plant.rootRotThreshold) * 100} 
                sx={{ 
                    width: '100%', 
                    height: '22px', 
                    marginTop: '4px',
                    backgroundColor: '#f0a6a2', // This is a lighter red for the unfilled portion
                    '& .MuiLinearProgress-barColorPrimary': {
                        backgroundColor: '#942e25',
                    }
                }}
            />


            <Box 
                sx={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    color: "white",
                }}
            >
                <Typography color="black">
                    Root Rot from Fungus
                </Typography>
            </Box>
        </Box>
        </Grid>
    </Grid>
    </Box>
    {/* ... [Rest of the code for displaying other plant info] */}
    </div>
    );
}

        

function formatNumber(value: number): string {
    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1) + 'M';
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(1) + 'K';
    } else {
        return Math.round(value).toString();
    }
}


function formatNumberWithDecimals(value: number): string {
    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(2) + 'M';
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(2) + 'K';
    } else {
        return value.toFixed(2);
    }
}



export default PlantList;