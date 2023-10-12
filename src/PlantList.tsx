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

function PlantList() {
    const dispatch = useDispatch();
    const plant = useSelector((state: RootState) => state.plant);
    const [multiplier, setMultiplier] = useState<number>(1);  // default is 1

    const { geneticMarkerProgress, geneticMarkerThreshold } = useSelector(
        (state: RootState) => state.globalState
    );
    const plantState = useSelector((state: RootState) => state.plant);

    const baseRate = plantState.sugar_production_rate;
    const modifiedRate = baseRate * (1 + 0.1 * plantState.maturity_level);
    const waterConsumption = 10 * (1 + 0.6 * plantState.maturity_level);
    const sunlightConsumption = 10 * (1 + 0.9 * plantState.maturity_level);

    const handleSunlightAbsorption = () => {
        const amount = 10;
        dispatch(absorbSunlight({ amount }));
    };

    const handleWaterAbsorption = () => {
        const amount = 10;
        dispatch(absorbWater({ amount }));
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
                
                <Tooltip title={`Absorbing ${plant.roots - plant.leaves}/Second`}>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={0.2}>
                        <Typography>Water: {formatNumber(plant.water)}</Typography>
                    </Box>
                    </Tooltip>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={0.2}>
                        <Typography>Roots: {formatNumber(plant.roots)}</Typography>
                    </Box>
               
                </Grid>
                <Grid item xs={4}>
                <Tooltip title={`Absorbing ${plant.leaves}/second`}>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={.1}>
                        <Typography>Sunlight: {formatNumber(plant.sunlight)}</Typography>
                    </Box>
                </Tooltip>    
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={.1}>
                        <Typography>Leaves: {formatNumber(plant.leaves)}</Typography>
                    </Box>

                
                </Grid>
                <Grid item xs={4}>
                <Tooltip title={`Converts ${formatNumberWithDecimals(waterConsumption)} water and ${formatNumberWithDecimals(sunlightConsumption)} sunlight into ${formatNumberWithDecimals(modifiedRate)} sugar per cycle.`}>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={.1}>
                        <Typography>Sugar: {formatNumber(plant.sugar)}</Typography>
                    </Box>
                </Tooltip>
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={.1}>
                        <Typography>Height: {formatNumber(plant.maturity_level)}</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Typography>Choose Production:</Typography>
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

            <Grid item xs={12}>
                <Typography>Grow Using Sugar:</Typography>
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
    <Tooltip title="Buy Leaves">
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
            Buy Leaves: {multiplier} Leaf for {LEAF_COST * multiplier} Sugar
        </Button>
    </Tooltip>
</Grid>

{/* Roots Section */}
<Grid item xs={12}>
    <Tooltip title="Buy Roots">
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
            Buy Roots: {multiplier} Root for {ROOT_COST * multiplier} Sugar
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
    </Grid>
    </Box>
    {/* ... [Rest of the code for displaying other plant info] */}
    </div>
    );
}

        

function formatNumber(value: number): string {
    if (value >= 1_000_000) {
        return Math.round(value / 1_000_000) + 'M';
    } else if (value >= 1_000) {
        return Math.round(value / 1_000) + 'K';
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