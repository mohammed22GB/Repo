//  save canvas to db
import React, { useEffect } from "react";

const MyWindowDimensions = ({ setWinDim }) => {

    useEffect(() => {
        setWinDim(getWindowDimensions());
        function handleResize() {
            setWinDim(getWindowDimensions());
        }
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }
    
    return (
        <div></div>
    )
}

export default MyWindowDimensions;
