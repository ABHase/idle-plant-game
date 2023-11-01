import React, { useState } from "react";
import { Box, Icon, IconButton, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./rootReducer";
import {
  getSeasonModifier,
  getNextSeason,
  getTimeToNextSeason,
} from "./formulas";
import { Sugar } from "./Components/Sugar";
import { Sunlight } from "./Components/Sunlight";
import { WaterModifier } from "./Components/WaterModifier";
import { SugarModifier } from "./Components/SugarModifier";
import { SunlightModifier } from "./Components/SunlightModifier";
import { AllModifier } from "./Components/AllModifier";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import { formatNumberWithDecimals } from "./PlantDisplays/PlantList";

interface PlantTimeProps {
  plantTime: {
    year: number;
    season: string;
    day: number;
    hour: number;
    update_counter: number;
  };
}

const PlantTimeDisplay: React.FC<PlantTimeProps> = ({ plantTime }) => {
  const plant = useSelector((state: RootState) => state.plant);
  const boost = useSelector((state: RootState) => state.timeBoost);
  const { value: seasonModifier, resource } = getSeasonModifier(
    plantTime.season,
    plant
  );
  const globalBoostedTicks = useSelector(
    (state: RootState) => state.globalState.globalBoostedTicks
  );

  const timeScale = globalBoostedTicks > 0 ? 40 : 1;

  const noDecimals = (number: number) => number.toFixed(0);

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible((prevState) => !prevState);
  };

  const renderResourceComponent = () => {
    if (resource === "water")
      return <WaterModifier modifier={seasonModifier} />;
    if (resource === "sugar")
      return <SugarModifier modifier={seasonModifier} />;
    if (resource === "sunlight")
      return <SunlightModifier modifier={seasonModifier} />;
    if (resource === "all") return <AllModifier modifier={seasonModifier} />;

    return null;
  };

  const nextSeason = getNextSeason(plantTime.season);
  const { value: nextSeasonModifier, resource: nextResource } =
    getSeasonModifier(nextSeason, plant);

  const renderNextResourceComponent = () => {
    if (nextResource === "water")
      return <WaterModifier modifier={nextSeasonModifier} />;
    if (nextResource === "sugar")
      return <SugarModifier modifier={nextSeasonModifier} />;
    if (nextResource === "sunlight")
      return <SunlightModifier modifier={nextSeasonModifier} />;
    if (nextResource === "all")
      return <AllModifier modifier={nextSeasonModifier} />;

    return null;
  };

  const { hours, minutes, seconds } = getTimeToNextSeason(plantTime);

  return (
    <div className="plant-time-display">
      <Tooltip
        title={
          <>
            <Typography color="inherit">
              {hours.toString().padStart(2, "0")}:
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")} To Next Sseason
            </Typography>
            <Typography color="inherit">Next Season: {nextSeason}</Typography>
            {renderNextResourceComponent()}
          </>
        }
        placement="right"
      >
        <Box
          border={1}
          borderColor="grey.300"
          borderRadius={2}
          width="320px"
          padding={1}
          margin="0 auto"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography style={{ display: "flex", alignItems: "center" }}>
            {globalBoostedTicks > 0
              ? `Boost: ${formatNumberWithDecimals(
                  globalBoostedTicks
                )} ${timeScale} X`
              : `${plantTime.season}:${plantTime.day}/30`}
          </Typography>

          <Typography style={{ display: "flex", alignItems: "center" }}>
            {boost ? "Time Boost" : renderResourceComponent()}
          </Typography>

          <IconButton onClick={togglePopup}>
            <InfoIcon sx={{ fontSize: "small", color: "white" }} />
          </IconButton>
        </Box>
      </Tooltip>
      <Dialog open={isPopupVisible} onClose={togglePopup}>
        <DialogTitle>
          {hours.toString().padStart(2, "0")}:
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")} To Next Season
        </DialogTitle>

        <DialogContent>
          Next Season: {nextSeason} {renderNextResourceComponent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantTimeDisplay;
