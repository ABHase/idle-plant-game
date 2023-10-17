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
import { Button } from "@mui/material";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    <Box sx={{ color: "text.primary" }}>
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
        <GrainIcon color="primary" />
        <Typography variant="body2">
          {" "}
          - Sugar is used to buy roots and leaves, and to convert to DNA in
          batches of 100.
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={1}>
        <ParkIcon sx={{ fontSize: 22, color: "green" }} />
        <Typography variant="body2">
          {" "}
          - The size of your plant represents its health. A bigger plant
          produces more sugar, but growth requires more resources.
        </Typography>
      </Box>
    </Box>,
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h6" mb={2}>
        Mushroom Store:
      </Typography>
      <Typography variant="body2" mb={2}>
        Trade with The Mushroom to gain advantages. However, trading excessively
        will cause fungus to rot your roots. The rot will strangle all of your
        roots.
      </Typography>
      <Typography variant="body2">
        To heal your plant, let your roots dry out completely, by reducing water
        level to zero. Or let the plant rot right before planting a new seed.
      </Typography>
    </Box>,
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h6" mb={2}>
        Strategy:
      </Typography>
      <Typography variant="body2">
        Use water and sunlight wisely. Balance growth with resource consumption.
        Remember, each new seed inherits past traits, but starts its growth
        journey anew. Your old plants are recorded in the history tab.
      </Typography>
    </Box>,
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h6" mb={2}>
        Seasons:
      </Typography>
      <Typography variant="body2">
        In the spring water will be absorbed faster, and in the summer sunlight
        will be absorbed faster. In the harvest time of autumn, sugar is
        produced faster. In the winter everything is much slower.
      </Typography>
    </Box>,
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h6" mb={2}>
        Fern:
      </Typography>
      <Typography variant="body2">
        The fern is a fast growing plant that can absorb water and sunlight, it
        is the basic starter plant, but it has no traits that carry over to
        other species.
      </Typography>
    </Box>,
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h6" mb={2}>
        Moss:
      </Typography>
      <Typography variant="body2">
        Moss grows slowly, and simply. You cannot manually absorb resources. You
        also buy roots and leaves all at once. There is no mushroom to trade
        with. Moss unlocks absorbent leaves for all species.
      </Typography>
    </Box>,
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h6" mb={2}>
        Moss:
      </Typography>
      <Typography variant="body2">
        Moss grows slowly, and simply. You cannot manually absorb resources. You
        also buy roots and leaves all at once. There is no mushroom to trade
        with. Moss unlocks absorbent leaves for all species.
      </Typography>
    </Box>,
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h6" mb={2}>
        Succulent:
      </Typography>
      <Typography variant="body2">
        The Desert Succulent can trade sugar for water at the mushroom store
        with no risk of Root Rot. It also produces sugar faster than other
        plants, and unlocks agave sugar production for all species. However, in
        the desert there is very little water and what little there is needs to
        be defended from rabbits with needles. If you have more water than
        needles the needles can defend rabbits will eat one leaf and 10% of your
        water.
      </Typography>
    </Box>,
    <Box sx={{ color: "text.primary" }}>
      <Typography variant="h6" mb={2}>
        Grass:
      </Typography>
      <Typography variant="body2">
        The Grass Colony wants to grow. It will not stop growing leaves
        passively, and unlocks passive growth for all species. There is no
        inventory at the mushroom store for grass, and it cannot directly
        convert sugar into DNA, rather it converts leaves into DNA.
      </Typography>
    </Box>,
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
      }}
    >
      <Box
        sx={{
          maxWidth: "80%",
          maxHeight: "80%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          borderRadius: 3,
          boxShadow: 24,
          p: 2,
          overflow: "auto",
        }}
      >
        {pages[currentPage]}

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1))
            }
            disabled={currentPage === pages.length - 1}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default HelpModal;
