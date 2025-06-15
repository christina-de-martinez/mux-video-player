import React, { useEffect } from "react";

function Countdown({ countdownBegin = 3 }) {
    const [number, setNumber] = React.useState(countdownBegin);

    useEffect(() => {
        const interval = setInterval(() => {
            setNumber((prev) => {
                if (prev === 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <p className="countdown">
            Make a sound inversely loud to how you want the volume to be.
            <br />
            The louder the sound, the quieter the volume will be.
            <span className="number">
                {number > 0 ? number.toString() : "Listening..."}
            </span>
        </p>
    );
}

export default Countdown;
