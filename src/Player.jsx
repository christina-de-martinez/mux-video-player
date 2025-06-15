import {
    MediaControlBar,
    MediaController,
    MediaTimeRange,
    MediaVolumeRange,
    MediaTimeDisplay,
    MediaPlaybackRateButton,
    MediaPlayButton,
} from "media-chrome/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faPause,
    faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useEffect, useState } from "react";
import MuxVideo from "@mux/mux-video-react";
import { debounce, getAudioVolumeLevel } from "./utils";
import Countdown from "./Countdown";

const Player = ({ isPlaying: initialIsPlaying }) => {
    const defaultWaitBeforeGettingVolume = 3000; // 3 seconds
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
    const [volume, setVolume] = useState(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [socket, setSocket] = useState(null);
    const [gettingVolume, setGettingVolume] = useState(false);
    const [currentlyConnectedUsers, setCurrentlyConnectedUsers] = useState(0);
    const [averageLatitude, setAverageLatitude] = useState(null);

    useEffect(() => {
        if (typeof window === "undefined") {
            console.log("window is undefined, skipping WebSocket connection");
            return;
        }
        // Connect to the WebSocket server
        const websocketUrl =
            process.env.NODE_ENV === "production"
                ? "https://mux-video-player.onrender.com"
                : "ws://localhost:8080";
        const ws = new WebSocket(websocketUrl);
        setSocket(ws);

        ws.onopen = () => {
            console.log("WebSocket connection opened");
            setTimeout(() => {
                getGlobalPlaybackSpeed(ws);
            }, 1000);
        };

        ws.onmessage = (event) => {
            console.log("Raw WebSocket message received:", event);
            try {
                const data = JSON.parse(event.data);
                console.log("Parsed WebSocket message:", data);
                if (data.connectedClients || data.type === "connectedClients") {
                    setCurrentlyConnectedUsers(data.connectedClients);
                }
                if (data.type === "playback") {
                    setIsPlaying(data.isPlaying);
                    if (videoRef.current) {
                        data.isPlaying
                            ? videoRef.current.play()
                            : videoRef.current.pause();
                    }
                }
                if (data.type === "audioVolume") {
                    const newVolume = data.currentVolume ?? 1;
                    setVolume(newVolume);
                    if (videoRef.current) {
                        videoRef.current.currentVolume = newVolume;
                    }
                }
                if (data.type === "globalAverageLatitude") {
                    const newLatitude = data.averageLatitude ?? 0;
                    setAverageLatitude(newLatitude);
                    if (newLatitude > 0 && videoRef.current) {
                        const playbackSpeed =
                            ((newLatitude + 90) / 180) * 1.5 + 0.5;
                        const roundedPlaybackSpeed =
                            Math.round(playbackSpeed * 100) / 100;
                        videoRef.current.playbackRate = roundedPlaybackSpeed;
                    }
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        if (gettingVolume) {
            const timer = setTimeout(() => {
                setGettingVolume(false);
            }, defaultWaitBeforeGettingVolume + 1000);
            return () => clearTimeout(timer);
        }
    }, [gettingVolume]);

    const togglePlay = () => {
        if (videoRef.current) {
            const newIsPlaying = !isPlaying;
            setIsPlaying(newIsPlaying);
            newIsPlaying ? videoRef.current.play() : videoRef.current.pause();

            if (typeof window === "undefined") {
                console.log("window is undefined, skipping WebSocket message");
                return;
            }

            // Send the updated state to the WebSocket server
            if (socket && socket.readyState === 1) {
                console.log(
                    "Sending WebSocket message",
                    newIsPlaying,
                    socket.readyState
                );
                socket.send(
                    JSON.stringify({
                        type: "playback",
                        isPlaying: newIsPlaying,
                    })
                );
            } else {
                console.error("WebSocket is not open. Cannot send message.");
            }
        }
    };

    const getVolume = async () => {
        if (typeof window === "undefined") {
            console.log("window is undefined, skipping volume check");
            return;
        }
        setGettingVolume(true);
        const volume = await getAudioVolumeLevel({
            delay: defaultWaitBeforeGettingVolume,
        });

        const newVolume = Math.min(volume / 90, 1.0);
        const inverseVolume = 1 - newVolume;
        setVolume(inverseVolume);

        if (socket && socket.readyState === 1) {
            socket.send(
                JSON.stringify({
                    type: "audioVolume",
                    currentVolume: inverseVolume,
                })
            );
        } else {
            console.error("WebSocket is not open. Cannot send seeking event.");
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            console.log("Setting video volume to", volume);
            videoRef.current.volume = volume;
        }
        return () => {
            if (videoRef.current) {
                videoRef.current.volume = 1;
            }
        };
    }, [volume]);

    const moveWindow = (moveByPx) => {
        if (typeof window !== "undefined") {
            window.moveBy(moveByPx, 0);
        }
    };

    const debouncedSeeking = debounce((event, currentTime) => {
        const newTime = parseFloat(
            event.target.getAttribute("mediacurrenttime")
        );
        const moveBy = newTime - currentTime;
        moveWindow(moveBy > 0 ? 100 : -100, 0);
    }, 300);

    const handleSeeking = (event) => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;

            debouncedSeeking(event, currentTime);

            if (socket && socket.readyState === 1) {
                socket.send(
                    JSON.stringify({
                        type: "seeking",
                        currentTime: currentTime,
                    })
                );
            } else {
                console.error(
                    "WebSocket is not open. Cannot send seeking event."
                );
            }
        }
    };

    const getGlobalPlaybackSpeed = (ws) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let newLat = lat;

            if (averageLatitude !== null) {
                newLat = (averageLatitude + lat) / 2;
            } else {
                newLat = lat;
            }
            setAverageLatitude(newLat);
            if (ws && ws.readyState === 1) {
                ws.send(
                    JSON.stringify({
                        type: "globalAverageLatitude",
                        averageLatitude: newLat,
                    })
                );
            } else {
                console.error(
                    "WebSocket is not open. Cannot send playback speed request."
                );
            }

            const playbackSpeed = ((newLat + 90) / 180) * 1.5 + 0.5;
            const roundedPlaybackSpeed = Math.round(playbackSpeed * 100) / 100;
            setPlaybackSpeed(roundedPlaybackSpeed);

            videoRef.current.playbackRate = roundedPlaybackSpeed;
        });
    };

    return (
        <>
            <p className="currentUsers">
                Currently connected: {currentlyConnectedUsers}
            </p>
            <div className="vidContainer">
                <div className="btnPlacer">
                    <button
                        onClick={togglePlay}
                        title="Play or pause"
                        className="playPauseButton"
                    >
                        {isPlaying ? (
                            <FontAwesomeIcon icon={faPause} />
                        ) : (
                            <FontAwesomeIcon icon={faPlay} />
                        )}
                    </button>
                    <button
                        onClick={getVolume}
                        title="Set volume (records a short audio snippet)"
                        className="setAudioButton"
                    >
                        <FontAwesomeIcon icon={faMicrophone} />
                    </button>
                    {gettingVolume && (
                        <Countdown
                            countdownBegin={
                                defaultWaitBeforeGettingVolume / 1000
                            }
                            setGettingVolume={setGettingVolume}
                        />
                    )}
                </div>
                <MediaController id="player">
                    <MuxVideo
                        ref={videoRef}
                        playbackId="PLtkNjmv028bYRJr8BkDlGw7SHOGkCl4d"
                        slot="media"
                        crossOrigin={true}
                    />
                    <MediaControlBar>
                        <MediaPlayButton />
                        <MediaVolumeRange disabled />
                        <MediaTimeRange onMouseDown={handleSeeking} />
                        <MediaTimeDisplay />
                        <MediaPlaybackRateButton disabled />
                    </MediaControlBar>
                </MediaController>
            </div>
        </>
    );
};

export default Player;
