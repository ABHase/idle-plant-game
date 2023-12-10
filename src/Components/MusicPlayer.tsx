import React, { useState, useEffect } from "react";
import { Slider, IconButton, Box, Typography } from "@mui/material";
import { Howl, Howler } from "howler";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import PauseIcon from "@mui/icons-material/Pause"; // Import PauseIcon
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const MusicPlayer: React.FC<{ song: string }> = ({ song }) => {
  const [volume, setVolume] = useState(
    parseFloat(localStorage.getItem("volume") || "0.3")
  );
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem("isMuted") === "true"
  );
  const [isPlaying, setIsPlaying] = useState(
    localStorage.getItem("isPlaying") === "true"
  );
  const [howl, setHowl] = useState<Howl | null>(null);

  useEffect(() => {
    if (howl) {
      howl.unload();
    }
    const sound = new Howl({
      src: [song],
      volume: volume,
      mute: isMuted,
      autoplay: isPlaying,
      onend: function () {
        console.log("Song ended.");
      },
    });

    setHowl(sound);

    // Cleanup
    return () => {
      sound.stop();
      sound.unload();
    };
  }, [song]); // Only re-run this effect if the song changes

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
    localStorage.setItem("isMuted", isMuted.toString());
    localStorage.setItem("isPlaying", isPlaying.toString());

    // Directly update the volume and mute state of the Howler sound engine
    Howler.volume(volume);
    if (howl) {
      howl.volume(volume);
      howl.mute(isMuted);
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setVolume(newValue);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlayPause = () => {
    if (howl) {
      if (!isPlaying) {
        howl.play();
      } else {
        howl.pause();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopMusic = () => {
    if (howl) {
      howl.stop();
      setIsPlaying(false);
    }
  };

  const buttonColor = "white";
  const fontSize = 22;

  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      bgcolor={"#474643"}
      borderRadius={2}
      p={0}
    >
      <Typography
        color="white"
        sx={{ flexGrow: 1, textAlign: "right", marginRight: "8px" }}
      >
        Music By: Theargh
      </Typography>
      {/* Toggle play/pause */}
      <IconButton onClick={togglePlayPause} sx={{ marginRight: "8px" }}>
        {isPlaying ? (
          <PauseIcon sx={{ fontSize: fontSize, color: buttonColor }} />
        ) : (
          <PlayArrowIcon sx={{ fontSize: fontSize, color: buttonColor }} />
        )}
      </IconButton>
      {/* Stop button */}
      <IconButton onClick={stopMusic} sx={{ marginRight: "8px" }}>
        <StopIcon sx={{ fontSize: fontSize, color: buttonColor }} />
      </IconButton>

      <Slider
        aria-label="Volume"
        value={volume}
        onChange={handleVolumeChange}
        min={0}
        max={1}
        step={0.01}
        sx={{
          mx: 1,
          width: "20%",
          "& .MuiSlider-thumb": {
            width: 16,
            height: 16,
          },
          "& .MuiSlider-track": {
            height: 4,
          },
          "& .MuiSlider-rail": {
            height: 4,
          },
        }}
      />
    </Box>
  );
};

export default MusicPlayer;
