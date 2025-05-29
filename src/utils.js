export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export async function getAudioVolumeLevel() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);

    // Wait for about 1 second, then get the volume
    return new Promise((resolve) => {
        setTimeout(() => {
            analyser.getByteTimeDomainData(dataArray);
            let sum = 0;

            for (let i = 0; i < dataArray.length; i++) {
                const val = dataArray[i] - 128; // center around 0
                sum += val * val;
            }

            const rms = Math.sqrt(sum / dataArray.length); // Root Mean Square
            resolve(rms); // use this value as your volume level
            stream.getTracks().forEach((track) => track.stop()); // Clean up
        }, 1000);
    });
}
