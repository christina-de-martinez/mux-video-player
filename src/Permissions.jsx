const Permissions = () => {
    const openNewWindow = () => {
        window.open("/player", "", "width=800,height=600,left=500,top=100");
    };

    return (
        <div className="permissions">
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
                    CodeTV + Mux
                </a>{" "}
                challenge.
            </p>
            <p>
                It requires audio and location access for the full experience. I
                don't view or store any of it.*
            </p>
            <p>
                The site is better with friends. Try it out on a few devices at
                once.
            </p>
            <button onClick={openNewWindow}>
                Enter the site (opens a popup)
            </button>
            <div className="inspiration">
                <h2>Inspiration</h2>
                <p className="h3">
                    🤝 Group Project: because sharing is caring 🤝
                </p>
                <p>
                    Some of my fondest memories from school were group projects,
                    where famously, everyone shared the load equally and I was{" "}
                    <em>not</em> stuck doing someone else’s slides at 2am the
                    night before the presentation.
                </p>
                <p>
                    With this project, I wanted to encapsulate that group
                    project energy. I used websockets to make every setting
                    global, because sharing is caring. If you pause the video,
                    we all pause. If you watch the video at full volume in a
                    public space, we’re all watching it at full volume right
                    there with ya.
                </p>
                <p>There are a few additional niceties here. </p>
                <p>
                    First is <strong>playback rate</strong>. We had a dilemma
                    here. A point on the earth spins faster at the equator, and
                    slower the farther North or South you get. To solve this
                    problem, I adjusted the playback rate to be a global average
                    value based on the latitude of all connected users. To
                    influence this value, move to a different latitude.
                </p>
                <p>
                    To set the <strong>volume</strong>, you need to make a noise
                    inversely proportional to the volume you want. So, a loud
                    sound produces a quiet volume setting. For example, if
                    you're in a library and you'd like a quiet volume to match
                    the environment, you must scream. This value is also shared
                    between all users.
                </p>
                <p>
                    With this video player, the efforts of one affect the
                    experience of all. I hope this allows you to revisit the
                    feeling of resting in confidence that 33% of your final
                    grade is in the hands of Brad from the lacrosse team.
                </p>
            </div>
            <p className="footnote">
                * Your latitude (but not longitude) is merged into an average
                value, and that new average is sent to a websocket server. Any
                audio you record stays with your browser—I just use the volume
                level of the clip.
            </p>
        </div>
    );
};

export default Permissions;
