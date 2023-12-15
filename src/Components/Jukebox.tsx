import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  Slider,
  Typography,
  Switch,
} from "@mui/material";
import { Howl, Howler } from "howler";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import { SelectChangeEvent } from "@mui/material/Select";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import NotInterestedSharpIcon from "@mui/icons-material/NotInterestedSharp";

import springBerrySong from "../assets/music/Spring_-_Berry_Bush.mp3";
import summerBerrySong from "../assets/music/Summer_-_Berry_Bush.mp3";
import autumnBerrySong from "../assets/music/Autumn_-_Berry_Bush.mp3";
import winterBerrySong from "../assets/music/Winter_-_Berry_Bush.mp3";
import springGrassSong from "../assets/music/Spring_-_Grass.mp3";
import summerGrassSong from "../assets/music/Summer_-_Grass.mp3";
import autumnGrassSong from "../assets/music/Autumn_-_Grass.mp3";
import winterGrassSong from "../assets/music/Winter_-_Grass.mp3";
import springMossSong from "../assets/music/Spring_-_Moss.mp3";
import summerMossSong from "../assets/music/Summer_-_Moss.mp3";
import autumnMossSong from "../assets/music/Autumn_-_Moss.mp3";
import winterMossSong from "../assets/music/Winter_-_Moss.mp3";
import springFernSong from "../assets/music/Spring_-_Fern.mp3";
import summerFernSong from "../assets/music/Summer_-_Fern.mp3";
import autumnFernSong from "../assets/music/Autumn_-_Fern.mp3";
import winterFernSong from "../assets/music/Winter_-_Fern.mp3";
import springSucculentSong from "../assets/music/Spring_-_Succulent.mp3";
import summerSucculentSong from "../assets/music/Summer_-_Succulent.mp3";
import autumnSucculentSong from "../assets/music/Autumn_-_Succulent.mp3";
import winterSucculentSong from "../assets/music/Winter_-_Succulent.mp3";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer";

export const songs: { [key: string]: Song } = {
  springBushSong: { name: "Spring Berry", url: springBerrySong },
  summerBushSong: { name: "Summer Berry", url: summerBerrySong },
  autumnBushSong: { name: "Autumn Berry", url: autumnBerrySong },
  winterBushSong: { name: "Winter Berry", url: winterBerrySong },
  springGrassSong: { name: "Spring Grass", url: springGrassSong },
  summerGrassSong: { name: "Summer Grass", url: summerGrassSong },
  autumnGrassSong: { name: "Autumn Grass", url: autumnGrassSong },
  winterGrassSong: { name: "Winter Grass", url: winterGrassSong },
  springMossSong: { name: "Spring Moss", url: springMossSong },
  summerMossSong: { name: "Summer Moss", url: summerMossSong },
  autumnMossSong: { name: "Autumn Moss", url: autumnMossSong },
  winterMossSong: { name: "Winter Moss", url: winterMossSong },
  springFernSong: { name: "Spring Fern", url: springFernSong },
  summerFernSong: { name: "Summer Fern", url: summerFernSong },
  autumnFernSong: { name: "Autumn Fern", url: autumnFernSong },
  winterFernSong: { name: "Winter Fern", url: winterFernSong },
  springSucculentSong: { name: "Spring Succulent", url: springSucculentSong },
  summerSucculentSong: { name: "Summer Succulent", url: summerSucculentSong },
  autumnSucculentSong: { name: "Autumn Succulent", url: autumnSucculentSong },
  winterSucculentSong: { name: "Winter Succulent", url: winterSucculentSong },
};

interface Song {
  name: string;
  url: string;
}

interface JukeboxProps {
  songs: Record<string, Song>;
}

const Jukebox: React.FC = () => {
  const [currentSongUrl, setCurrentSongUrl] = useState<string>("");
  const [volume, setVolume] = useState<number>(
    parseFloat(localStorage.getItem("volume") || "0.3")
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(
    localStorage.getItem("isPlaying") === "true"
  );
  const [howl, setHowl] = useState<Howl | null>(null);

  const [shuffle, setShuffle] = useState<boolean>(false);

  // 1. Get the necessary states from the Redux store
  const unlockedSongs = useSelector(
    (state: RootState) => state.app.unlockedSongs
  );
  const season = useSelector((state: RootState) => state.plantTime.season);
  const plant = useSelector((state: RootState) => state.plant);
  const plantType = useSelector((state: RootState) => state.plant.type);

  // 2. Determine the default song based on the season and plantType
  const defaultSongKey = `${season.toLowerCase()}${plantType}Song`;
  const defaultSongUrl = songs[defaultSongKey]?.url;

  // 3. Filter the list of songs to only show unlocked songs and the default song
  const availableSongs = Object.keys(songs).filter(
    (key) => unlockedSongs[key] || key === defaultSongKey
  );

  // Create a ref for the Howl instance
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Stop and unload the current Howl instance if it exists
    const currentHowl = howlRef.current;
    if (currentHowl) {
      currentHowl.stop();
      currentHowl.unload();
    }
    // Determine the default song URL
    const defaultSongKey = `${season.toLowerCase()}${plantType}Song`;
    const defaultSongUrl = songs[defaultSongKey]?.url;

    // Decide which song URL to use (either the current song or the default one)
    const songUrlToUse = currentSongUrl || defaultSongUrl;

    if (songUrlToUse) {
      // Create a new Howl instance
      const newHowl = new Howl({
        src: [songUrlToUse],
        autoplay: isPlaying,
        onend: () => {
          if (!shuffle) {
            playNextSong();
          } else {
            playRandomSong();
          }
        },
      });

      // Update state
      setCurrentSongUrl(songUrlToUse);
      setHowl(newHowl);
      howlRef.current = newHowl;
    }

    // Cleanup function
    return () => {
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
      }
    };
  }, [currentSongUrl, isPlaying, shuffle, season, plantType]);

  useEffect(() => {
    if (howl) {
      howl.volume(volume);
    }
  }, [volume, howl]);

  const playNextSong = () => {
    const availableSongKeys = Object.keys(songs).filter(
      (key) => unlockedSongs[key] || key === defaultSongKey
    );
    const currentSongIndex = availableSongKeys.findIndex(
      (key) => songs[key].url === currentSongUrl
    );
    const nextSongKey =
      availableSongKeys[(currentSongIndex + 1) % availableSongKeys.length];
    setCurrentSongUrl(songs[nextSongKey].url);
  };

  const playRandomSong = () => {
    const availableSongKeys = Object.keys(songs).filter(
      (key) => unlockedSongs[key] || key === defaultSongKey
    );
    const randomIndex = Math.floor(Math.random() * availableSongKeys.length);
    const randomKey = availableSongKeys[randomIndex];
    setCurrentSongUrl(songs[randomKey].url);
  };

  const handleSongChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (typeof value === "string" && availableSongs.includes(value)) {
      setCurrentSongUrl(songs[value as keyof typeof songs].url);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setVolume(newValue);
      localStorage.setItem("volume", newValue.toString());
      if (howl) howl.volume(newValue);
    }
  };

  const togglePlayPause = () => {
    if (howl) {
      if (!isPlaying) howl.play();
      else howl.pause();
      setIsPlaying(!isPlaying);
      localStorage.setItem("isPlaying", (!isPlaying).toString());
    }
  };

  const stopMusic = () => {
    if (howl) {
      howl.stop();
      setIsPlaying(false);
    }
  };

  // Styles
  const buttonColor = "white";
  const fontSize = 22;

  const capitalize = (word: String) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const currentSongName = Object.keys(songs)
    .find((key) => songs[key as keyof typeof songs].url === currentSongUrl)
    ?.split(/(?=[A-Z])/)
    .map(capitalize) // Capitalize each word
    .join(" ");

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center" // Center the items vertically
      bgcolor={"#474643"}
      borderRadius={2}
      border={1}
      p={0} // Reduced overall padding
    >
      <Typography color="white" sx={{ margin: "8px" }}>
        Now Playing: {currentSongName || "None"}
      </Typography>

      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        bgcolor={"#474643"}
        borderRadius={2}
        p={0}
      >
        <Select
          value={currentSongUrl}
          onChange={handleSongChange}
          sx={{ marginRight: "8px", border: "1px solid #ffffff" }}
        >
          {availableSongs.map((songKey) => {
            const song = songs[songKey];
            return (
              <MenuItem key={songKey} value={songKey}>
                {song.name}
              </MenuItem>
            );
          })}
        </Select>
        <IconButton onClick={togglePlayPause} sx={{ marginRight: "8px" }}>
          {isPlaying ? (
            <PauseIcon sx={{ fontSize, color: buttonColor }} />
          ) : (
            <PlayArrowIcon sx={{ fontSize, color: buttonColor }} />
          )}
        </IconButton>
        <IconButton onClick={stopMusic} sx={{ marginRight: "8px" }}>
          <StopIcon sx={{ fontSize, color: buttonColor }} />
        </IconButton>
        <IconButton onClick={toggleShuffle} sx={{ marginRight: "8px" }}>
          {shuffle ? (
            <ShuffleIcon sx={{ fontSize, color: buttonColor }} /> // Change color when shuffle is active
          ) : (
            <ShuffleIcon sx={{ fontSize, color: "#222324" }} /> // Default color when shuffle is not active
          )}
        </IconButton>

        <Slider
          aria-label="Volume"
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.01}
          sx={{
            mx: 2,
            width: "150px", // Adjusted width to make it tighter
            "& .MuiSlider-thumb": { width: 16, height: 16 },
            "& .MuiSlider-track": { height: 4 },
            "& .MuiSlider-rail": { height: 4 },
          }}
        />
      </Box>
    </Box>
  );
};

export default Jukebox;
