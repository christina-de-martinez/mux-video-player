import {
    MediaControlBar,
    MediaController,
    MediaTimeRange,
    MediaVolumeRange,
} from "media-chrome/react";
import { useRef, useEffect, useState } from "react";
import MuxVideo from "@mux/mux-video-react";
import { debounce, getAudioVolumeLevel } from "./utils";

const Player = ({ isPlaying: initialIsPlaying }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
    const [volume, setVolume] = useState(1); // Default volume level
    const [socket, setSocket] = useState(null);

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
            console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
            console.log("Raw WebSocket message received:", event);
            try {
                const data = JSON.parse(event.data);
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
        const volume = await getAudioVolumeLevel();
        const newVolume = Math.min(volume / 90, 1.0);
        setVolume(newVolume);

        if (socket && socket.readyState === 1) {
            socket.send(
                JSON.stringify({
                    type: "audioVolume",
                    currentVolume: newVolume,
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

    return (
        <>
            <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
            <button onClick={getVolume}>Get Volume</button>
            <MediaController id="player">
                <MuxVideo
                    ref={videoRef}
                    playbackId="PLtkNjmv028bYRJr8BkDlGw7SHOGkCl4d"
                    slot="media"
                    crossOrigin={true}
                    currenttime={0}
                />
                <MediaControlBar>
                    <MediaVolumeRange />
                    <MediaTimeRange onMouseDown={handleSeeking} />
                </MediaControlBar>
            </MediaController>
        </>
    );
};

export default Player;
