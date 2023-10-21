import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./rootReducer";
import { createSelector } from "reselect";
import { evolveAndRecordPlant, updateGame } from "./gameActions";
import store, { AppDispatch } from "./store";
import GlobalStateDisplay from "./DNADisplays/GlobalStateDisplay";
import { ThemeProvider } from "@mui/material/styles";
import { Alert, Box, Snackbar } from "@mui/material";
import PlantTimeDisplay from "./PlantTimeDisplay";
import PlantList from "./PlantDisplays/PlantList";
import { clearState, saveState } from "./localStorage";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ConfirmEvolveDialog from "./ConfirmEvolveDialog";
import { Button } from "@mui/material";
import { resetApp } from "./Slices/appSlice";
import { resetGlobalState } from "./Slices/gameStateSlice";
import { initializeNewPlant, resetPlant } from "./Slices/plantSlice";
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
import PlantSelectionModal from "./Modals/PlantSelectionModal";
import { theme } from "./themeConfig";
import { useModalState } from "./useModalState";

const useIsNewUser = () => {
  const isNewUser = localStorage.getItem("isNewUser");
  return isNewUser === "true";
};

const selectPlants = createSelector(
  (state: RootState) => state.plant,
  (plant) => Object.values(plant)
);

const selectSeason = createSelector(
  (state: RootState) => state.plantTime.season,
  (season) => season
);

function App() {
  //New user setup

  const { modals, handleOpenModal, handleCloseModal } = useModalState();

  const [modalOpen, setModalOpen] = useState(false);
  const isNewUser = useIsNewUser();
  const [isPlantSelected, setIsPlantSelected] = useState(!isNewUser);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (isNewUser && !isPlantSelected) {
      setModalOpen(true);
    }
  }, [isPlantSelected, isNewUser]);

  const handlePlantSelect = (plantType: string) => {
    dispatch(initializeNewPlant({ plantType }));
    setIsPlantSelected(true);
    // Update localStorage to indicate that the user is no longer new.
    localStorage.setItem("isNewUser", "false");
    saveState(store.getState());
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const plantTime = useSelector((state: RootState) => state.plantTime);
  const plantDisplayType = useSelector((state: RootState) => state.plant.type);
  const rabbitAttack = useSelector(
    (state: RootState) => state.plant.rabbitAttack
  );
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

  // Update the lastUpdateTimeRef whenever the plant is selected
  useEffect(() => {
    if (isPlantSelected) {
      lastUpdateTimeRef.current = Date.now();
    }
  }, [isPlantSelected]);

  useEffect(() => {
    // Only proceed if a plant is selected
    if (!isPlantSelected) {
      return;
    }
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
  }, [dispatch, totalLeaves, isPlantSelected]);

  const lastUpdateTimeRef = useRef(Date.now());
  const saveCounterRef = useRef(0);
  const previousLeaves = useRef(totalLeaves);

  function update() {
    if (!isPlantSelected) {
      return; // Exit early if the plant hasn't been selected yet
    }
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

  const [showLeafLossWarning, setShowLeafLossWarning] = useState(false);
  const [plantType] = React.useState<string>("Fern");

  const renderPlantComponent = () => {
    switch (plantDisplayType) {
      case "Fern":
        return (
          <PlantList
            handleOpenModal={handleOpenModal}
            modalName="ladybugModalOpen"
          />
        );
      case "Moss":
        return (
          <MossDisplay
            handleOpenModal={handleOpenModal}
            modalName="ladybugModalOpen"
          />
        );
      case "Succulent":
        return (
          <SucculentDisplay
            handleOpenModal={handleOpenModal}
            modalName="ladybugModalOpen"
          />
        );
      case "Grass":
        return (
          <GrassDisplay
            handleOpenModal={handleOpenModal}
            modalName="ladybugModalOpen"
          />
        );
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
          open={modals.historyModalOpen}
          onClose={() => handleCloseModal("historyModalOpen")}
        />
        <HelpModal
          open={modals.helpModalOpen}
          onClose={() => handleCloseModal("helpModalOpen")}
        />

        <ConfirmEvolveDialog
          open={evolveDialogOpen}
          onClose={() => setEvolveDialogOpen(false)}
          onConfirm={handleEvolve}
        />
        <MenuModal
          open={modals.menuModalOpen}
          onClose={() => handleCloseModal("menuModalOpen")}
          onOpenUpgrade={() => handleOpenModal("upgradeModalOpen")}
          onPlantSeed={() => setEvolveDialogOpen(true)}
          historyModalOpen={modals.historyModalOpen}
          handleOpenHistoryModal={() => handleOpenModal("historyModalOpen")}
          handleCloseHistoryModal={() => handleCloseModal("historyModalOpen")}
          helpModalOpen={modals.helpModalOpen}
          handleOpenHelpModal={() => handleOpenModal("helpModalOpen")}
          handleCloseHelpModal={() => handleCloseModal("helpModalOpen")}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onOpenMushroomStore={() => handleOpenModal("mushroomStoreModalOpen")}
          handleOpenReportModal={() => handleOpenModal("reportModalOpen")}
          handleOpenTextboxModal={() => handleOpenModal("textboxModalOpen")}
          handleCloseReportModal={() => handleCloseModal("reportModalOpen")}
        />
        <MushroomStoreModal
          open={modals.mushroomStoreModalOpen}
          onClose={() => handleCloseModal("mushroomStoreModalOpen")}
        />
        <ReportModal
          open={modals.reportModalOpen}
          onClose={() => handleCloseModal("reportModalOpen")}
        />
        <TextboxModal
          open={modals.textboxModalOpen}
          onClose={() => handleCloseModal("textboxModalOpen")}
        />

        {modals.ladybugModalOpen ? (
          <LadyBugModal
            open={modals.ladybugModalOpen}
            onClose={() => handleCloseModal("ladybugModalOpen")}
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
            You lost a leaf!
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
                onClick={() => handleOpenModal("menuModalOpen")}
                sx={{ width: "45%", mt: 0, mb: 0, ml: 1, mr: 1 }}
              >
                Open Menu
              </Button>
              <Button
                variant="contained"
                onClick={() => handleOpenModal("mushroomStoreModalOpen")}
                sx={{ width: "45%", mt: 0, mb: 0, ml: 1, mr: 1 }}
              >
                Mushroom
              </Button>
            </Box>

            <PlantTimeDisplay plantTime={plantTime} />
            {renderDNAComponent()}
            {renderPlantComponent()}

            <UpgradeModal
              open={modals.upgradeModalOpen}
              onClose={() => handleCloseModal("upgradeModalOpen")}
            />
            {isNewUser && (
              <PlantSelectionModal
                open={modalOpen}
                onClose={handleClose}
                onPlantSelect={handlePlantSelect}
              />
            )}
          </header>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
