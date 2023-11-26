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
import { Maturity } from "../Components/Maturity";
import { DNAIcon } from "../icons/dna";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose, isMobile }) => {
  const purchasedUpgrades = useSelector(
    (state: RootState) => state.upgrades.purchased
  );
  const [currentPage, setCurrentPage] = useState(0);

  // Table of contents items
  const toc = [
    "Basics",
    "Strategies",
    "Map",
    "Column Bonuses",
    "Moss",
    "Fern",
    "Grass",
    "Berry Bush",
    "Succulent",
    "Score",
    "Time Vine",
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
        <ParkIcon sx={{ fontSize: 22, color: "green" }} />
        <Typography variant="body2">
          {" "}
          - Maturity is equal to the square root of the sum of roots and leaves.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <GrainIcon sx={{ fontSize: 22, color: "white" }} />
        <Typography variant="body2">
          {" "}
          - Sugar production increases with maturity. Excluding modifiers from
          seasons and traits the formula is:{" "}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <GrainIcon sx={{ fontSize: 22, color: "white" }} />
        <Typography variant="body2">
          {" "}
          - Base sugar production rate * (1 + .1 * size);
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <DNAIcon />
        <Typography variant="body2">
          {" "}
          - Traits can be purchased for DNA.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <DNAIcon />
        <Typography variant="body2">
          {" "}
          - Traits can be sold back for DNA at any time for full value. Traits
          DO NOT take effect until you plant a new plant.
        </Typography>
      </Box>
    </div>,

    <div>
      <Typography variant="h6" mb={1}>
        Strategies:
      </Typography>
      <Typography variant="h6" mb={1}>
        Time Boosting is important, meaning the Fern and Succulent are
        important.
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - That said, they are the most active play style and require the most
          attention.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - Moss requires nearly no attention if you want to do it slow and get
          it out of the way.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - Grass is absurdly slow to get DNA on compared to any of the other
          plants, especially if you haven't moved on the map yet. That said if
          you don't mind waiting for days it will eventually get there,
          especially if you did Moss first. It's not actually required though.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - Building up a massive stockpile of Time Boost is fundamental to
          unlocking the Time Vine, but you might not even want to worry about
          the Time Vine your first map cell.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - The Discord is a great place to get help and advice, and to report
          bugs.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          - The game is much closer to being done than it ever has been, but it
          is still in development.
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
        Column Bonuses:
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          Column must still be filled with the plant, and only one column bonus
          per plant can be active.
        </Typography>
      </Box>
      <Typography variant="h6" mb={2}>
        Moss Column
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          Applied Last, Passive Water and Sunlight Absorption^2.
        </Typography>
      </Box>
      <Typography variant="h6" mb={2}>
        Fern Column
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          Applied Last, Starting Roots^2 and Starting Leaves^2.
        </Typography>
      </Box>
      <Typography variant="h6" mb={2}>
        Succulent Column
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          Applied Last, Sugar Production^2.
        </Typography>
      </Box>
      <Typography variant="h6" mb={2}>
        Grass Column
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          Applied Last, Season Bonuses*2, Manual Absorbtion^2, Spread^2.
        </Typography>
      </Box>
      <Typography variant="h6" mb={2}>
        Bush Column
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          Applied Last, Reduces Flower sugar and water thresholds significantly,
          Manual Absorption^2.
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
    <div>
      <Typography variant="h6" mb={2}>
        The Time Vine:
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Time Vine is a special plant that can be unlocked by time
          boosting.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Time Vine starts with 10k{" "}
          <WbSunnyIcon sx={{ fontSize: 22, color: "orange" }} /> Sunlight, 10k{" "}
          <OpacityIcon sx={{ fontSize: 22, color: "blue" }} /> Water, and 10k{" "}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - The Time Vine CANNOT produce{" "}
          <WbSunnyIcon sx={{ fontSize: 22, color: "orange" }} /> Sunlight or{" "}
          <OpacityIcon sx={{ fontSize: 22, color: "blue" }} /> Water, but it can
          produce <GrainIcon sx={{ fontSize: 22, color: "white" }} /> Sugar.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Progress towards the Time Vine Components is passively generated by
          time boosting four of the plants.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - Once you have 1 of each Fulvic, Tannins, Silica, and Calcium, you
          can create a Time Seed with the Berry Bush.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2">
          {" "}
          - You can only plant one Time Vine per Time Seed, but all upgrades
          unlocked with the Time Vine are PERMANENT.
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
          maxWidth: isMobile ? "90%" : "30%",
          maxHeight: "60%",
          height: "60%",
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
            width: isMobile ? "50%" : "40%",
            maxHeight: "100%",
            overflow: "auto",
          }}
        >
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            Table of Contents
          </Typography>
          <List>
            {toc.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => setCurrentPage(index)}
                sx={{
                  my: 0.5,
                  borderRadius: 1,
                  border: "1px solid white",
                  bgcolor: "#090924",
                  alignContent: "center",
                }}
              >
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{ align: "left" }}
                  sx={{ color: "text.primary" }}
                />
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
