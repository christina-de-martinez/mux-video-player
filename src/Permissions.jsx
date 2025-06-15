const Permissions = () => {
    const openNewWindow = () => {
        window.open("/player", "", "width=800,height=600,left=500,top=100");
    };

    return (
        <div>
            <h1>
                The most unhinged, Byzantine, devious, unusual video player you
                could imagine.
            </h1>
            <p>
                This is{" "}
                <a
                    href="https://bsky.app/profile/christinacodes.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    my
                </a>{" "}
                entry to the{" "}
                <a
                    href="https://codetv.dev/blog/web-dev-challenge-hackathon-s2e3-devious-video-player-mux"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    CodeTV & Mux
                </a>{" "}
                challenge to create the most devious video player possible.
            </p>
            <p>
                It requires audio and location access for the full experience.
            </p>
            <p>
                Your latitude (but not longitude) is merged into an average
                value and sent to a websocket server. Any audio you record stays
                with your browser—I just use its volume.
            </p>
            <button onClick={openNewWindow}>
                Enter the site (opens a popup)
            </button>
        </div>
    );
};

export default Permissions;
