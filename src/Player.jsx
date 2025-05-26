import { MediaController } from "media-chrome/react";
import { useRef, useEffect, useState } from "react";
import MuxVideo from "@mux/mux-video-react";

const Player = ({ isPlaying: initialIsPlaying }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (typeof window === "undefined") {
            console.log("window is undefined, skipping WebSocket connection");
            return;
        }
        // Connect to the WebSocket server
        const ws = new WebSocket("ws://localhost:8080"); // Replace with your WebSocket server URL
        setSocket(ws);
        console.log("useEffect: WebSocket connection established");

        ws.onopen = () => {
            console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
            console.log("Raw WebSocket message received:", event);
            try {
                const data = JSON.parse(event.data);
                console.log("Parsed data:", data);
                if (data.type === "playback") {
                    setIsPlaying(data.isPlaying);
                    if (videoRef.current) {
                        data.isPlaying
                            ? videoRef.current.play()
                            : videoRef.current.pause();
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

        // Cleanup on component unmount
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

    return (
        <>
            <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
            <MediaController id="player">
                <MuxVideo
                    ref={videoRef}
                    playbackId="PLtkNjmv028bYRJr8BkDlGw7SHOGkCl4d"
                    slot="media"
                    crossOrigin
                    muted
                />
            </MediaController>
        </>
    );
};

export default Player;
