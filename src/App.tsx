import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./rootReducer";
import { createSelector } from "reselect";
import { evolveAndRecordPlant, updateGame } from "./gameActions";
import store, { AppDispatch } from "./store";
import GlobalStateDisplay from "./DNADisplays/GlobalStateDisplay";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Alert, Box, Snackbar } from "@mui/material";
import PlantTimeDisplay from "./PlantTimeDisplay";
import PlantList from "./PlantDisplays/PlantList";
import { clearState, saveState } from "./localStorage";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ConfirmEvolveDialog from "./ConfirmEvolveDialog";
import { Button } from "@mui/material";
import { resetApp } from "./Slices/appSlice";
import { resetGlobalState } from "./Slices/gameStateSlice";
import { resetPlant } from "./Slices/plantSlice";
import { resetPlantTime } from "./Slices/plantTimeSlice";
import UpgradeModal from "./Modals/UpgradeModal";
import { resetUpgrades } from "./Slices/upgradesSlice";
import HistoryModal from "./Modals/HistoryModal";
import HelpModal from "./Modals/HelpModal";
import MenuModal from "./Modals/MenuModal";
import MushroomStoreModal from "./Modals/MushroomStoreModal";
import LadyBugModal from "./Modals/LadyBugModal";
import ReportModal from "./Modals/ReportModal";
import MossDisplay from "./PlantDisplays/MossDisplay";
import MossDNADisplay from "./DNADisplays/MossDNADisplay";
import SucculentDisplay from "./PlantDisplays/SucculentDisplay";
import SucculentDNADisplay from "./DNADisplays/SucculentDNADisplay";
import GrassDisplay from "./PlantDisplays/GrassDisplay";
import GrassDNADisplay from "./DNADisplays/GrassDNADisplay";
import TextboxModal from "./Modals/TextboxModal";

const theme = createTheme({
  palette: {
    primary: {
      main: "#81b85c", // A more vibrant forest green for buttons and highlights
    },
    secondary: {
      main: "#607D8B", // Bluish-grey, reminiscent of a night sky or moonlit water
    },
    background: {
      default: "#1f1107", // A very dark brown, almost black, like deep woods at night
      paper: "#162e13", // A slightly lighter green, like forest undergrowth in moonlight
    },
    text: {
      primary: "#FFFFFF", // Pure white for text to ensure good contrast against the dark background
      secondary: "#B0BEC5", // A lighter grey, used for secondary text elements
    },
  },
  typography: {
    fontFamily: "'YOUR_FONT_NAME', lato", // Remember to replace 'YOUR_FONT_NAME'
  },
  // Add any other theme customizations here
});

const selectPlants = createSelector(
  (state: RootState) => state.plant,
  (plant) => Object.values(plant)
);

const selectSeason = createSelector(
  (state: RootState) => state.plantTime.season,
  (season) => season
);

function App() {
  const dispatch: AppDispatch = useDispatch();
  const totalTime = useSelector((state: RootState) => state.app.totalTime);
  const plantTime = useSelector((state: RootState) => state.plantTime);
  const plantDisplayType = useSelector((state: RootState) => state.plant.type);
  const rabbitAttack = useSelector(
    (state: RootState) => state.plant.rabbitAttack
  );
  const plants = useSelector(selectPlants);
  const season = useSelector(selectSeason);
  const totalLeaves = useSelector((state: RootState) => state.plant.leaves);
  const [openDialog, setOpenDialog] = React.useState(false);
  const purchasedUpgrades = useSelector(
    (state: RootState) => state.upgrades.purchased
  );
  const isTimeBoostActive = useSelector((state: RootState) => state.timeBoost);

  const handleDeleteConfirm = () => {
    clearState(); // Clear the state from localStorage

    // Reset state for each slice
    dispatch(resetApp());
    dispatch(resetGlobalState());
    dispatch(resetPlant());
    dispatch(resetPlantTime());
    dispatch(resetUpgrades());

    window.location.reload();
  };

  const [evolveDialogOpen, setEvolveDialogOpen] = useState(false);

  const handleEvolve = (selectedPlantType: string) => {
    dispatch(evolveAndRecordPlant(selectedPlantType, purchasedUpgrades));
  };

  useEffect(() => {
    // Check if the number of leaves has decreased

    if (previousLeaves.current > totalLeaves) {
      setShowLeafLossWarning(true);
      previousLeaves.current = totalLeaves;
    }
    // Update previous leaves to current total leaves after checking
    previousLeaves.current = totalLeaves;

    // Call the update function to start the game loop
    update();
    // Cleanup code: stop the loop when the component unmounts
    return () => {};
  }, [dispatch, totalLeaves]);

  const lastUpdateTimeRef = useRef(Date.now());
  const saveCounterRef = useRef(0);
  const previousLeaves = useRef(totalLeaves);

  function update() {
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastUpdateTimeRef.current;

    if (!isTimeBoostActive && timeElapsed >= 1000) {
      const numTicksMissed = Math.floor(timeElapsed / 1000);

      for (let i = 0; i < numTicksMissed; i++) {
        dispatch(updateGame());

        // Increment the save counter
        saveCounterRef.current += 1;

        // Check if the save counter reaches 30
        if (saveCounterRef.current === 30) {
          // Save the state to localStorage
          saveState(store.getState());

          // Reset the counter
          saveCounterRef.current = 0;
        }
      }

      lastUpdateTimeRef.current = currentTime;
    }

    requestAnimationFrame(update);
  }

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(true);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [mushroomStoreModalOpen, setMushroomStoreModalOpen] = useState(false);
  const [ladybugModalOpen, setLadybugModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const [showLeafLossWarning, setShowLeafLossWarning] = useState(false);
  const [plantType] = React.useState<string>("Fern");
  const [textboxModalOpen, setTextboxModalOpen] = useState(false);

  const handleOpenTextboxModal = () => {
    setTextboxModalOpen(true);
  };
  const handleCloseTextboxModal = () => {
    setTextboxModalOpen(false);
  };

  const handleOpenReportModal = () => {
    setReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setReportModalOpen(false);
  };

  const handleOpenMushroomStoreModal = () => {
    setMushroomStoreModalOpen(true);
  };

  const handleCloseMushroomStoreModal = () => {
    setMushroomStoreModalOpen(false);
  };

  const handleOpenUpgradeModal = () => {
    setUpgradeModalOpen(true);
  };

  const handleCloseUpgradeModal = () => {
    setUpgradeModalOpen(false);
  };

  const handleOpenHistoryModal = () => {
    setHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
  };

  const handleOpenHelpModal = () => {
    setHelpModalOpen(true);
  };

  const handleCloseHelpModal = () => {
    setHelpModalOpen(false);
  };

  const renderPlantComponent = () => {
    switch (plantDisplayType) {
      case "Fern":
        return <PlantList setLadybugModalOpen={setLadybugModalOpen} />;
      case "Moss":
        return <MossDisplay setLadybugModalOpen={setLadybugModalOpen} />;
      case "Succulent":
        return <SucculentDisplay setLadybugModalOpen={setLadybugModalOpen} />;
      case "Grass":
        return <GrassDisplay setLadybugModalOpen={setLadybugModalOpen} />;
      default:
        return null; // or return a default component if desired
    }
  };

  const renderDNAComponent = () => {
    switch (plantDisplayType) {
      case "Fern":
        return <GlobalStateDisplay />;
      case "Moss":
        return <MossDNADisplay />;
      case "Succulent":
        return <SucculentDNADisplay />;
      case "Grass":
        return <GrassDNADisplay />;
      default:
        return null; // or return a default component if desired
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        height="100vh"
        bgcolor="background.default"
        color="text.primary"
      >
        <ConfirmDeleteDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleDeleteConfirm}
        />

        <HistoryModal
          open={historyModalOpen}
          onClose={handleCloseHistoryModal}
        />
        <HelpModal open={helpModalOpen} onClose={handleCloseHelpModal} />
        <ConfirmEvolveDialog
          open={evolveDialogOpen}
          onClose={() => setEvolveDialogOpen(false)}
          onConfirm={handleEvolve}
        />
        <MenuModal
          open={menuModalOpen}
          onClose={() => setMenuModalOpen(false)}
          onOpenUpgrade={handleOpenUpgradeModal}
          onPlantSeed={() => setEvolveDialogOpen(true)}
          historyModalOpen={historyModalOpen}
          handleOpenHistoryModal={handleOpenHistoryModal}
          handleCloseHistoryModal={handleCloseHistoryModal}
          helpModalOpen={helpModalOpen}
          handleOpenHelpModal={handleOpenHelpModal}
          handleCloseHelpModal={handleCloseHelpModal}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onOpenMushroomStore={handleOpenMushroomStoreModal}
          handleOpenReportModal={handleOpenReportModal}
          handleOpenTextboxModal={handleOpenTextboxModal}
          handleCloseReportModal={handleCloseReportModal}
        />
        <MushroomStoreModal
          open={mushroomStoreModalOpen}
          onClose={handleCloseMushroomStoreModal}
        />
        <ReportModal open={reportModalOpen} onClose={handleCloseReportModal} />
        <TextboxModal
          open={textboxModalOpen}
          onClose={handleCloseTextboxModal}
        />

        {ladybugModalOpen ? (
          <LadyBugModal
            open={ladybugModalOpen}
            onClose={() => setLadybugModalOpen(false)}
            // ... any other props you might need
          />
        ) : null}
        <Snackbar
          open={showLeafLossWarning}
          autoHideDuration={3000}
          onClose={() => setShowLeafLossWarning(false)}
        >
          <Alert
            onClose={() => setShowLeafLossWarning(false)}
            severity="warning"
            sx={{ width: "100%" }}
          >
            You lost a leaf due to lack of water!
          </Alert>
        </Snackbar>
        <Snackbar
          open={rabbitAttack}
          autoHideDuration={3000}
          onClose={() => {
            dispatch({ type: "plant/resetRabbitAttack" });
          }}
        >
          <Alert severity="warning">
            Rabbits have drank your water! You lost a leaf!
          </Alert>
        </Snackbar>

        <Box sx={{ display: { xs: "block", sm: "block" } }}>
          <header className="App-header">
            <Box
              border={1}
              borderColor="grey.300"
              borderRadius={2}
              width="320px"
              padding={1}
              margin="0 auto"
            >
              <Button
                variant="contained"
                onClick={() => setMenuModalOpen(true)}
                sx={{ width: "100%", mt: 0, mb: 0 }} // This will set the width to 90% of the parent and add some margin at the top and bottom
              >
                Open Menu
              </Button>
            </Box>

            <PlantTimeDisplay plantTime={plantTime} />
            {renderDNAComponent()}
            {renderPlantComponent()}

            <UpgradeModal
              open={upgradeModalOpen}
              onClose={handleCloseUpgradeModal}
            />
          </header>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
