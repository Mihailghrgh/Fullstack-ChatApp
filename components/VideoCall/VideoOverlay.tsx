"use client";

import { useEffect } from "react";

function VideoOverlay() {
  const fetchUserVideoData = async () => {
    // try {
    //   await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    //   const devices = await navigator.mediaDevices.enumerateDevices();

    //   console.log(devices.filter((device) => device.label));
    // } catch (error: any) {
    //   console.log(error);
    //   throw new Error("Error occurred: ", error);
    // }

    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    const devices = await navigator.mediaDevices.enumerateDevices();

    console.log(devices);

  };

  useEffect(() => {

    const allowToUseDevices = async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    };

    const checkDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      devices.forEach((device) => {
        console.log(
          `${device.kind}: ${device.label || "No label"} ID = ${
            device.deviceId
          }`
        );
      });
    };

    allowToUseDevices();
    checkDevices();
  }, []);

  return <div>VideoOverlay</div>;
}
export default VideoOverlay;
