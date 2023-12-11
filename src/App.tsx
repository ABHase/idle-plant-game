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
import { resetUpgrades, setActiveUpgrades } from "./Slices/upgradesSlice";
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
import VineDisplay from "./PlantDisplays/VineDisplay";
import VineDNADisplay from "./DNADisplays/VineDNADisplay";
import Splash from "./Components/Splash";
import OptionsModal from "./Modals/OptionsModal";
import mainImage from "./assets/background.png";

const useIsNewUser = () => {
  const isNewUser = localStorage.getItem("isNewUser");
  return isNewUser === "true";
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500); // Hide splash screen after 1 second
    return () => clearTimeout(timer);
  }, []);

  //New user setup

  const paused = useSelector((state: RootState) => state.app.paused);

  const handleTogglePause = () => {
    dispatch({ type: "app/togglePause" });
    const currentTime = Date.now();

    saveState(store.getState());
    localStorage.setItem("lastUpdateTime", currentTime.toString());
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
    localStorage.setItem("isNewUser", "false");
    saveState(store.getState());

    // Check if running in Electron and then call Electron-specific code
    if (window.electron) {
      console.log("Running in Electron!");
      const achievementName = "TEST_ACHIEVEMENT_1"; // Replace with the actual achievement name

      // Use the exposed electron object in the preload script to send a message to the main process
      window.electron.sendAchievement(achievementName);
    }
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

  const nightMode = useSelector(
    (state: RootState) => state.plantTime.nightMode
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

    // Calculate the time scale factor: 2 to the power of the number of upgrades
    const timeScaleFactor = store.getState().plant.timeScaleBoost;

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
    const plantType = store.getState().plant.type;
    const baseTimeScale = gameState.globalBoostedTicks > 0 ? 60 : 1;
    const modifiedTimeScale =
      gameState.globalBoostedTicks > 0
        ? baseTimeScale * timeScaleFactor
        : baseTimeScale;

    const timeElapsed = currentTime - lastSavedTime;
    const timeElapsedInSeconds = Math.floor(timeElapsed / 1000);

    const tickDuration = 1000;

    if (timeElapsed >= tickDuration) {
      let shouldSave = false;
      const timeScaleForThisUpdate = Math.floor(
        modifiedTimeScale * timeElapsedInSeconds
      );
      dispatch(updateGame(timeScaleForThisUpdate));
      dispatch(
        reduceGlobalBoostedTicks({
          plantType: plantType,
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
      case "Vine":
        return (
          <VineDisplay
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
      case "Bush":
        return <BushDNADisplay />;
      case "Vine":
        return <VineDNADisplay />;
      default:
        return null; // or return a default component if desired
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {showSplash ? (
        <Splash />
      ) : (
        <Box
          display="flex"
          flexDirection="row"
          width="100%"
          justifyContent="center"
          style={{
            backgroundImage: nightMode ? "none" : `url(${mainImage})`,
            backgroundSize: "cover", // Ensures the background covers the entire Box
            backgroundPosition: "center", // Centers the background image
            backgroundRepeat: "no-repeat", // Prevents repeating the image
            height: "100vh", // Adjust the height as needed
          }}
          bgcolor="black"
        >
          {/* Sidebar */}
          {isMobile ? null : (
            <Box
              flex={1}
              paddingRight={2}
              bgcolor="transparent"
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
            bgcolor="transparent"
            overflow="auto"
            height="100vh"
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              height="100vh"
              bgcolor="transparent"
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
                  dispatch(setActiveUpgrades(selectedTraits));
                }}
              />

              <MenuModal
                open={modals.menuModalOpen}
                onClose={() => handleCloseModal("menuModalOpen")}
                onOpenUpgrade={() => handleOpenModal("upgradeModalOpen")}
                onPlantSeed={() => setEvolveDialogOpen(true)}
                historyModalOpen={modals.historyModalOpen}
                handleOpenHistoryModal={() =>
                  handleOpenModal("historyModalOpen")
                }
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
                handleOpenTextboxModal={() =>
                  handleOpenModal("textboxModalOpen")
                }
                handleCloseReportModal={() =>
                  handleCloseModal("reportModalOpen")
                }
                handleOpenMapModal={() => handleOpenModal("mapModalOpen")}
                manualSave={() => saveState(store.getState())}
                handleTogglePause={handleTogglePause}
                isMobile={isMobile}
                paused={paused}
                handleOpenOptionsModal={() =>
                  handleOpenModal("optionsModalOpen")
                }
              />
              <MushroomStoreModal
                open={modals.mushroomStoreModalOpen}
                onClose={() => handleCloseModal("mushroomStoreModalOpen")}
              />
              <ReportModal
                open={modals.reportModalOpen}
                onClose={() => handleCloseModal("reportModalOpen")}
                isMobile={isMobile}
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
              <OptionsModal
                open={modals.optionsModalOpen}
                onClose={() => handleCloseModal("optionsModalOpen")}
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
                    bgcolor="rgba(0, 0, 0, 0.75)"
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
                        border: "4px solid #32518f", // Border color white if paused
                        "&:hover": {
                          backgroundColor: "#1C1C3A", // Darker shade for hover
                          color: "#E0E0E0", // Lighter shade for the text during hover
                        },
                        "&:disabled": {
                          backgroundColor: "#3C3C4D", // or any other suitable shade you prefer
                          color: "#black", // or any other suitable shade for text
                          cursor: "not-allowed",
                        },
                      }}
                    >
                      {paused ? "GAME PAUSED!" : "Open Menu"}
                    </Button>

                    {isMobile && (
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleOpenModal("mushroomStoreModalOpen")
                        }
                        sx={{
                          width: "45%",
                          mt: 0,
                          mb: 0,
                          ml: 1,
                          mr: 1,
                          color: "white",
                          bgcolor: "#69291a",
                          border: "4px solid #857471",
                        }}
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
              bgcolor="transparent"
              overflow="auto"
              height="100vh"
            >
              <UpgradeStoreDesktopDisplay
                onPlantSeed={() => setEvolveDialogOpen(true)}
              />
            </Box>
          )}
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
