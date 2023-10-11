import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
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

    const { geneticMarkerProgress, geneticMarkerThreshold } = useSelector(
        (state: RootState) => state.globalState
    );

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
        dispatch(buyRoots({ cost: ROOT_COST }));
    };

    const handleBuyLeaves = () => {
        dispatch(buyLeaves({ cost: LEAF_COST }));
    };

    const handleToggleGeneticMarkerProduction = () => {
        dispatch(toggleGeneticMarkerProduction());
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
                    <Box border={1} borderColor="grey.300" borderRadius={2} padding={.1}>
                        <Typography>Sugar: {formatNumber(plant.sugar)}</Typography>
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
            Convert 100 Sugar → DNA: {plant.is_genetic_marker_production_on ? "Stop" : "Start"}
        </Button>
    </Tooltip>
</Grid>




<Grid item xs={12}>
    <Divider sx={{ backgroundColor: 'white' }} />
</Grid> 

                    <Grid item xs={12}>
        <Typography>Grow Using Sugar:</Typography>
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
            Buy Leaves: 1 Leaf for {LEAF_COST} Sugar
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
                    backgroundColor: '#C7B08B',  // Or any other style reset
                },
            }}
            onClick={() => handleBuyRoots()}>
            Buy Roots: 1 Root for {ROOT_COST} Sugar
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




export default PlantList;