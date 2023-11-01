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
import {
  reduceGlobalBoostedTicks,
  resetGlobalState,
} from "./Slices/gameStateSlice";
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
import MushroomStoreDesktopDisplay from "./MushroomStoreDesktopDisplay";
import UpgradeStoreDesktopDisplay from "./UpgradeStoreDesktopDisplay";
import BushDisplay from "./PlantDisplays/BushDisplay";
import BushDNADisplay from "./DNADisplays/BushDNADisplay";
import MapModal from "./Modals/MapModal";
import { resetCell } from "./Slices/cellCompletionSlice";

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

  const isMobile = window.innerWidth <= 768;

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
  const lastLeafLossReason = useSelector(
    (state: RootState) => state.plant.lastLeafLossReason
  );

  const handleDeleteConfirm = () => {
    clearState(); // Clear the state from localStorage

    // Reset state for each slice
    dispatch(resetApp());
    dispatch(resetGlobalState());
    dispatch(resetPlant());
    dispatch(resetPlantTime());
    dispatch(resetUpgrades());
    dispatch(resetCell());

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
    console.log("useEffect running");
    // Only proceed if a plant is selected
    if (!isPlantSelected) {
      return;
    }
    console.log("isPlantSelected is true");

    // Check if the number of leaves has decreased
    if (previousLeaves.current > totalLeaves) {
      console.log("Leaf loss detected!");
      console.log("Last leaf loss reason:", lastLeafLossReason);
      if (lastLeafLossReason === "noWater") {
        setShowLeafLossWarning(true);
        // Reset the reason after showing the warning
        dispatch({ type: "plant/resetLastLeafLossReason" });
      }
      // Update previous leaves to current total leaves after checking
      previousLeaves.current = totalLeaves;
    }

    // Call the update function to start the game loop
    update();

    // Cleanup code: stop the loop when the component unmounts
    return () => {};
  }, [dispatch, totalLeaves, isPlantSelected, lastLeafLossReason]);

  const lastUpdateTimeRef = useRef(Date.now());
  const saveCounterRef = useRef(0);
  const previousLeaves = useRef(totalLeaves);

  function update() {
    if (!isPlantSelected) {
      return; // Exit early if the plant hasn't been selected yet
    }

    const currentTime = Date.now();
    const timeElapsed = currentTime - lastUpdateTimeRef.current;
    const gameState = store.getState().globalState; // Get the globalState
    const tickDuration = gameState.globalBoostedTicks > 0 ? 50 : 1000; // Set tick duration based on globalBoostedTicks

    if (timeElapsed >= tickDuration) {
      const numTicksMissed = Math.floor(timeElapsed / tickDuration);
      let shouldSave = false;

      for (let i = 0; i < numTicksMissed; i++) {
        dispatch(updateGame());
        dispatch(reduceGlobalBoostedTicks()); // Reduce globalBoostedTicks by 1

        // Increment the save counter
        saveCounterRef.current += 1;

        // Check if the save counter reaches 30
        if (saveCounterRef.current === 30) {
          shouldSave = true;
          saveCounterRef.current = 0; // Reset the counter
        }
      }

      // Only save to localStorage once after processing all the missed ticks
      if (shouldSave) {
        saveState(store.getState());
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
      case "Bush":
        return (
          <BushDisplay
            handleOpenModal={handleOpenModal}
            modalName="ladybugModalOpen"
            isMobile={isMobile}
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
      case "Bush":
        return <BushDNADisplay />;
      default:
        return null; // or return a default component if desired
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        justifyContent="center"
      >
        {/* Sidebar */}
        {isMobile ? null : (
          <Box
            flex={1}
            paddingRight={2}
            bgcolor="background.default"
            overflow="auto"
            height="100vh"
          >
            <MushroomStoreDesktopDisplay />
          </Box>
        )}
        {/* Main Content */}
        <Box
          flex={2}
          paddingRight={0}
          bgcolor="background.default"
          overflow="auto"
          height="100vh"
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            height="100vh"
            bgcolor="background.default"
            color="text.primary"
            overflow="auto"
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
              handleCloseHistoryModal={() =>
                handleCloseModal("historyModalOpen")
              }
              helpModalOpen={modals.helpModalOpen}
              handleOpenHelpModal={() => handleOpenModal("helpModalOpen")}
              handleCloseHelpModal={() => handleCloseModal("helpModalOpen")}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              onOpenMushroomStore={() =>
                handleOpenModal("mushroomStoreModalOpen")
              }
              handleOpenReportModal={() => handleOpenModal("reportModalOpen")}
              handleOpenTextboxModal={() => handleOpenModal("textboxModalOpen")}
              handleCloseReportModal={() => handleCloseModal("reportModalOpen")}
              handleOpenMapModal={() => handleOpenModal("mapModalOpen")}
              manualSave={() => saveState(store.getState())}
              isMobile={isMobile}
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
            <MapModal
              open={modals.mapModalOpen}
              onClose={() => handleCloseModal("mapModalOpen")}
              isMobile={isMobile}
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
                    sx={{
                      width: !isMobile ? "100%" : "45%",
                      mt: 0,
                      mb: 0,
                      ml: !isMobile ? 0 : 1,
                      mr: !isMobile ? 0 : 1,
                    }}
                  >
                    Open Menu
                  </Button>

                  {isMobile && (
                    <Button
                      variant="contained"
                      onClick={() => handleOpenModal("mushroomStoreModalOpen")}
                      sx={{ width: "45%", mt: 0, mb: 0, ml: 1, mr: 1 }}
                    >
                      Mushroom
                    </Button>
                  )}
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
        </Box>
        {/* Sidebar */}
        {isMobile ? null : (
          <Box
            flex={1}
            paddingRight={2}
            bgcolor="background.default"
            overflow="auto"
            height="100vh"
          >
            <UpgradeStoreDesktopDisplay
              onPlantSeed={() => setEvolveDialogOpen(true)}
            />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
