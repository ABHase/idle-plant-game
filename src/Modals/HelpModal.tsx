import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import WbSunnyIcon from "@mui/icons-material/WbSunny";
import OpacityIcon from "@mui/icons-material/Opacity";
import GrainIcon from "@mui/icons-material/Grain";
import GrassIcon from "@mui/icons-material/Grass";
import SpaIcon from "@mui/icons-material/Spa";
import ParkIcon from "@mui/icons-material/Park";
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  const purchasedUpgrades = useSelector(
    (state: RootState) => state.upgrades.purchased
  );
  const [currentPage, setCurrentPage] = useState(0);

  // Table of contents items
  const toc = [
    "Basics",
    "Map",
    "Moss",
    "Fern",
    "Grass",
    "Berry Bush",
    "Succulent",
    "Score",
  ];

  const pages: React.ReactNode[] = [
    <div>
      <Typography variant="h6" mb={2}>
        Game Basics:
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <WbSunnyIcon sx={{ fontSize: 22, color: "orange" }} />
        <Typography variant="body2">
          {" "}
          - Sunlight mixes with water to make sugar during photosynthesis.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <OpacityIcon sx={{ fontSize: 22, color: "blue" }} />
        <Typography variant="body2">
          {" "}
          - Water mixes with sunlight to make sugar, it also is consumed by
          leaves.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <SpaIcon sx={{ fontSize: 22, color: "green" }} />
        <Typography variant="body2">
          {" "}
          - Leaves passively absorb sunlight.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <GrassIcon
          sx={{ fontSize: 22, color: "grey", transform: "rotate(180deg)" }}
        />
        <Typography variant="body2">
          {" "}
          - Roots passively absorb water.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Traits can be sold back for DNA at any time for full value. Traits
          DO NOT take effect until you plant a new plant.
        </Typography>
      </Box>
    </div>,

    <div>
      <Typography variant="h6" mb={2}>
        Map Bonuses:
      </Typography>
      <Typography variant="h6" mb={2}>
        All Adjacency Bonuses Stack!
      </Typography>
      <Typography variant="h6" mb={2}>
        Column Bonuses Can Only Be Applied Once!
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - Starting next to a completed Fern tile: +100 to roots and leaves.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - Starting next to a completed Succulent tile: 2x sugar production.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - Starting next to a Grass tile: All seasonal bonuses are doubled,
          including winter rates, which means they can become bonuses with
          enough. Also 3X Spread on all plants. Also 5X manual absorption on all
          plants.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - Starting next to Moss: 20x water and sunlight passive absorption.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - Starting next to a Bush: Flower maturity threshold is multiplied by
          .4. Also 5X manual absorption on all plants.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - Column bonuses exponentially increase some of the associated values
          for each plant.
        </Typography>
      </Box>
    </div>,

    <div>
      <Typography variant="h6" mb={2}>
        Moss:
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2"> - Moss grows very slowly.</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Moss cannot trade with the Mushroom until you unlock the Lichen
          trait.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Moss can trade sunlight for sugar if you unlock the Lichen.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Moss Meta Upgrade makes leaves water neutral and no longer lost
          to dehydration. There are advantages and disadvantages to this.
        </Typography>
      </Box>
    </div>,
    <div>
      {" "}
      <Typography variant="h6" mb={2}>
        Fern:
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Fern will become infested with aphids at 1000 sugar. There is an
          immunity trait that can be had.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Lady Bug will offer protection from aphids when needed at a
          steep cost.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Fern can trade with the Mushroom for DNA or Time Boosts. This will
          cause Root Rot that can be removed by emptying water.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Fern Meta Upgrade increases the number of Roots and Leaves new
          plants start with.
        </Typography>
      </Box>
    </div>,
    <div>
      {" "}
      <Typography variant="h6" mb={2}>
        Grass:
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Grass grows uncontrollably and has the slowest DNA generation.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Grass can typically just be left idle and will grow on its own.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Grass trades leaves for DNA rather than sugar. This is very slow.
          The number of leaves required can be reset for 250 B sunlight.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Grass Meta Upgrade grants base Auto Growth 100 for all plants.
        </Typography>
      </Box>
    </div>,
    <div>
      {" "}
      <Typography variant="h6" mb={2}>
        Berry Bush:
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Berry Bush DNA comes from maturing flowers. The amount of Sugar and
          Water needed to reach maturity is reset every time the Berry Bush is
          replanted.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Replant often with new traits to reset the time it takes to mature
          the flowers.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Berry Bush cannot trade with the Mushroom at all.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Berry Bush Meta Upgrade unlocks the map, this is the only
          upgrade technically required to win the game though in practice that
          would be insane.
        </Typography>
      </Box>
    </div>,
    <div>
      {" "}
      <Typography variant="h6" mb={2}>
        Succulent:
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Succulent is a desert plant that grows slowly at first but makes
          sugar at the fastest rate and can even trade sugar with the Mushroom
          for water.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Succulent is potentially the most active play style and fastest
          growing Plant. Do not hesitate.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Needles protect you from water but cost more to grow the higher your
          size. Your size is the square root of the sum of your roots and
          leaves.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Succulent Meta Upgrade increases provides all non-Succulent
          plants with 10x Sugar production.
        </Typography>
      </Box>
    </div>,
    <div>
      <Typography variant="h6" mb={2}>
        Score:
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Earn points by creating 1 Billion sugar!
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - You can onnly change the difficulty while planting a new plant.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The number of points you earn is equal to the current difficulty you
          are playing on.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Only the first Billion sugar counts towards your score PER plant.
        </Typography>
      </Box>
    </div>,
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="help-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "60",
      }}
    >
      <Box
        sx={{
          maxWidth: "100%",
          maxHeight: "100%",
          bgcolor: "secondary.main",
          border: "2px solid #000",
          borderRadius: 3,
          boxShadow: 24,
          p: 2,
          overflow: "auto",
          display: "flex",
        }}
      >
        {/* Table of contents */}
        <Box
          sx={{
            width: "30%",
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            Table of Contents
          </Typography>
          <List>
            {toc.map((item, index) => (
              <ListItemButton key={index} onClick={() => setCurrentPage(index)}>
                <ListItemText primary={item} sx={{ color: "text.primary" }} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Content */}
        <Box
          sx={{
            width: "90%",
            maxHeight: "100%",
            maxWidth: "auto",
            overflow: "auto",
            paddingLeft: 2,
            color: "text.primary",
          }}
        >
          {pages[currentPage]}
        </Box>
      </Box>
    </Modal>
  );
};

export default HelpModal;
