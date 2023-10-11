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
                    width="80%" // or a fixed value like "500px"
                    padding={2}
                    margin= "0 auto"
                >
                <Grid container spacing={2} alignItems="center">
                
                    <Grid item xs={3}>
                        <Typography>Water + Sunlight</Typography>
                    </Grid>
                    <Grid item xs={3}>
                    <Tooltip title={plant.is_sugar_production_on ? "Turn off Sugar Production" : "Turn on Sugar Production"}>
                        <Button 
                        sx={{ 
                        border: "1px solid #aaa", 
                        borderRadius: "4px",
                        backgroundColor: '#424532',
                        color: '#B5D404' 
                        }}
                        onClick={() => handleToggleSugarProduction()}>
                            {plant.is_sugar_production_on ? (
                                <ArrowForwardIos />
                            ) : (
                                <Clear />
                            )}
                        </Button>
                    </Tooltip>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>Sugar: </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>{formatNumber(plant.sugar)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                    <Divider sx={{ backgroundColor: 'white' }} />
                            </Grid> 
                    <Grid item xs={3}>
                        <Typography>Sugar - 100</Typography>
                    </Grid>
                    <Grid item xs={3}>
                    <Tooltip title={plant.is_genetic_marker_production_on ? "Turn off Genetic Marker Production" : "Turn on Genetic Marker Production"}>
                        <Button 
                        sx={{ 
                            border: "1px solid #aaa", 
                            borderRadius: "4px",
                            backgroundColor: '#424532',
                            color: '#B5D404' 
                            }}
                        onClick={() => handleToggleGeneticMarkerProduction()}>
                            {plant.is_genetic_marker_production_on ? (
                                <ArrowForwardIos />
                            ) : (
                                <Clear />
                            )}
                        </Button>
                    </Tooltip>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography>Genetic Marker Progress</Typography>
                    </Grid>

                    <Grid item xs={2}><Typography>{geneticMarkerProgress}/{geneticMarkerThreshold}</Typography></Grid>

                    <Grid item xs={12}>
        <Typography variant="h6">Grow Using Sugar:</Typography>
    </Grid>

    {/* Leaves Section */}
    <Grid item xs={6}>
        <Typography>{plant.leaves} Leaves</Typography>
    </Grid>
    <Grid item xs={6}>
        <Tooltip title="Buy Leaves">
            <Button 
            sx={{ 
                border: "1px solid #aaa", 
                borderRadius: "4px",
                backgroundColor: '#424532',
                color: '#B5D404' 
                }}
            onClick={() => handleBuyLeaves()}>
                <Add />
            </Button>
        </Tooltip>
    </Grid>
    <Grid item xs={12}>
        <Typography>{LEAF_COST} Sugar</Typography>
    </Grid>

    {/* Roots Section */}
    <Grid item xs={6}>
        <Typography>{plant.roots} Roots</Typography>
    </Grid>
    <Grid item xs={6}>
        <Tooltip title="Buy Roots">
            <Button 
            sx={{ 
                border: "1px solid #aaa", 
                borderRadius: "4px",
                backgroundColor: '#424532',
                color: '#B5D404' 
                }}
            onClick={() => handleBuyRoots()}>
                <Add />
            </Button>
        </Tooltip>
    </Grid>
    <Grid item xs={12}>
        <Typography>{ROOT_COST} Sugar</Typography>
    </Grid>
            <Grid item xs={12}>
            <Divider sx={{ backgroundColor: 'white' }} />
        </Grid>

        <Grid style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent: 'center'}} item xs={6}>
            <Tooltip title={`Absorbing ${plant.roots - plant.leaves}/Second`}>
                <Typography>{formatNumber(plant.water)} Water</Typography>
            </Tooltip>
            <Tooltip title="Absorb Water">
                <IconButton 
                sx={{ 
                    border: "1px solid #aaa", 
                    borderRadius: "4px",
                    backgroundColor: '#424532',
                    color: '#B5D404' 
                    }}
                onClick={() => handleWaterAbsorption()}>
                    <Add />
                </IconButton>
            </Tooltip>
        </Grid>
        <Grid style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent: 'center'}} item xs={6}>
            <Tooltip title={`Absorbing ${plant.leaves}/second`}>
                <Typography>{formatNumber(plant.sunlight)} Sunlight</Typography>
            </Tooltip>
            <Tooltip title="Absorb Sunlight">
                <IconButton 
                sx={{ 
                    border: "1px solid #aaa", 
                    borderRadius: "4px",
                    backgroundColor: '#424532',
                    color: '#B5D404' 
                    }}
                onClick={() => handleSunlightAbsorption()}>
                    <Add />
                </IconButton>
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