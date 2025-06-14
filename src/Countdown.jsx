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

    return <p>{number > 0 ? number.toString() : "Listening..."}</p>;
}

export default Countdown;
