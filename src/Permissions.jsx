const Permissions = () => {
    const openNewWindow = () => {
        window.open("/player", "", "width=800,height=600,left=500,top=100");
    };

    return (
        <>
            <p>Open a popup to get the full experience</p>
            <button onClick={openNewWindow}>Open popup</button>
        </>
    );
};

export default Permissions;
