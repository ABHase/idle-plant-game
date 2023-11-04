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
import { resetPlantHistory } from "./Slices/plantHistorySlice";

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

  const paused = useSelector((state: RootState) => state.app.paused);

  const handleTogglePause = () => {
    dispatch({ type: "app/togglePause" });
  };

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
  const lastLeafLossReason = useSelector(
    (state: RootState) => state.plant.lastLeafLossReason
  );

  const handleDeleteConfirm = () => {
    clearState(); // Clear the state from localStorage
    localStorage.removeItem("lastUpdateTime");

    // Reset state for each slice
    dispatch(resetApp());
    dispatch(resetGlobalState());
    dispatch(resetPlant());
    dispatch(resetPlantTime());
    dispatch(resetUpgrades());
    dispatch(resetCell());
    dispatch(resetPlantHistory());

    window.location.reload();
  };

  const [evolveDialogOpen, setEvolveDialogOpen] = useState(false);

  const handleEvolve = (
    selectedPlantType: string,
    selectedTraits: string[]
  ) => {
    dispatch(evolveAndRecordPlant(selectedPlantType, selectedTraits));
  };

  useEffect(() => {
    // Only proceed if a plant is selected
    if (!isPlantSelected) {
      return;
    }
    console.log("isPlantSelected is true");

    // Check if the number of leaves has decreased
    if (previousLeaves.current > totalLeaves) {
      if (lastLeafLossReason === "noWater") {
        setShowLeafLossWarning(true);
        // Reset the reason after showing the warning
        dispatch({ type: "plant/resetLastLeafLossReason" });
      }
      // Update previous leaves to current total leaves after checking
      previousLeaves.current = totalLeaves;
    }

    const intervalId = setInterval(update, 50); // Update every second

    // Cleanup: clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, totalLeaves, isPlantSelected, lastLeafLossReason]);

  const lastUpdateTimeRef = useRef(Date.now());
  const previousLeaves = useRef(totalLeaves);

  function update() {
    if (!isPlantSelected) {
      return;
    }

    const paused = store.getState().app.paused;

    const currentTime = Date.now();

    if (paused) {
      localStorage.setItem("lastUpdateTime", currentTime.toString());
      lastUpdateTimeRef.current = currentTime;
      return;
    }

    const lastSavedTimeStr = localStorage.getItem("lastUpdateTime");
    const lastSavedTime =
      lastSavedTimeStr !== null
        ? parseInt(lastSavedTimeStr, 10)
        : lastUpdateTimeRef.current;

    const gameState = store.getState().globalState;
    const baseTimeScale = gameState.globalBoostedTicks > 0 ? 60 : 1;

    const timeElapsed = currentTime - lastSavedTime;
    const timeElapsedInSeconds = timeElapsed / 1000;

    const tickDuration = 1000;

    if (timeElapsed >= tickDuration) {
      let shouldSave = false;
      const timeScaleForThisUpdate = baseTimeScale * timeElapsedInSeconds;
      dispatch(updateGame(timeScaleForThisUpdate));
      dispatch(
        reduceGlobalBoostedTicks({
          plantType: plantDisplayType,
          ticks: timeScaleForThisUpdate,
        })
      );

      saveState(store.getState());
      localStorage.setItem("lastUpdateTime", currentTime.toString());
      lastUpdateTimeRef.current = currentTime;
    }
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
              isMobile={isMobile}
            />

            <ConfirmEvolveDialog
              open={evolveDialogOpen}
              onClose={() => setEvolveDialogOpen(false)}
              onConfirm={(selectedPlantType, selectedTraits) => {
                dispatch(
                  evolveAndRecordPlant(selectedPlantType, selectedTraits)
                );
              }}
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
              handleTogglePause={handleTogglePause}
              isMobile={isMobile}
              paused={paused}
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
                      color: paused ? "white" : "inherit", // Text color white if paused
                      bgcolor: paused ? "#240000" : "#090924", // Background color dark red if paused
                    }}
                  >
                    {paused ? "GAME PAUSED!" : "Open Menu"}
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
