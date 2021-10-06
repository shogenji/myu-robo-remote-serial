let port = undefined;

async function connect() {
    console.log(event.type);

    const filters = [
        {
            usbVendorId: 0x067b, // Prolific Technology, Inc.
            usbProductId: 0x2303 //
        },
        {
            usbVendorId: 0x0403, // Future Technology Devices International Limited
            usbProductId: 0x6001 //
        },
    ];
    
    // Prompt user to select a MYU robo device.
    try {
        // port = await navigator.serial.requestPort();
        port = await navigator.serial.requestPort({filters});
        if (!port) {
          return;
        }
        // Wait for the HID connection to open.
        await port.open({baudRate: 9600});
        const {usbProductId, usbVendorId} = port.getInfo();
        document.getElementById("deviceStatus").innerText = usbProductId + "に接続しました。";
    } catch (error) {
        console.error(error.name, error.message);
    }
  }

  
async function remoteForward() {
    if (!port) return;

    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([2]));
    writer.releaseLock();
}

async function remoteBackward() {
    if (!port) return;

    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([8]));
    writer.releaseLock();
}

async function remoteTurnLeft() {
    if (!port) return;

    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([11]));
    writer.releaseLock();
}

async function remoteTurnRight() {
    if (!port) return;

    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([10]));
    writer.releaseLock();
}

async function remoteMouseup() {
    if (!port) return;

    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([0]));
    writer.releaseLock();
}


// RS-232C 1byte 出力
async function sendrs232c(data) {
    try {
        await writer.write(new Uint8Array([data]));
    } catch (error) {
        console.error(error.name, error.message, "COMポートの設定が不適切です？");
    }
}

function startup() {
    if (!("serial" in navigator)) {
        console.log("The Web Serial API is not supported.");
        document.getElementById("deviceStatus").innerText = "Web Serial APIに未対応です。";
    }

    const btnConnect = document.getElementById('btnConnect');
    btnConnect.addEventListener('mouseup', connect, false);
    btnConnect.addEventListener('touchend', connect, false);

    const btnForward = document.getElementById('btnForward');
    const btnBackward = document.getElementById('btnBackward');
    const btnTurnLeft = document.getElementById('btnTurnLeft');
    const btnTurnRight = document.getElementById('btnTurnRight');
    
    btnForward.addEventListener('touchstart', remoteForward, false);
    btnForward.addEventListener('touchend', remoteMouseup, false);
    btnForward.addEventListener('mousedown', remoteForward, false);
    btnForward.addEventListener('mouseup', remoteMouseup, false);

    btnBackward.addEventListener('touchstart', remoteBackward, false);
    btnBackward.addEventListener('touchend', remoteMouseup, false);
    btnBackward.addEventListener('mousedown', remoteBackward, false);
    btnBackward.addEventListener('mouseup', remoteMouseup, false);

    btnTurnLeft.addEventListener('touchstart', remoteTurnLeft, false);
    btnTurnLeft.addEventListener('touchend', remoteMouseup, false);
    btnTurnLeft.addEventListener('mousedown', remoteTurnLeft, false);
    btnTurnLeft.addEventListener('mouseup', remoteMouseup, false);
    
    btnTurnRight.addEventListener('touchstart', remoteTurnRight, false);
    btnTurnRight.addEventListener('touchend', remoteMouseup, false);
    btnTurnRight.addEventListener('mousedown', remoteTurnRight, false);
    btnTurnRight.addEventListener('mouseup', remoteMouseup, false);
}

document.addEventListener("DOMContentLoaded", startup);

    
navigator.serial.addEventListener('connect', (e) => {
    // Connect to `e.target` or add it to a list of available ports.
    console.log("Serial port connected: " + e.target);
});
  
navigator.serial.addEventListener('disconnect', (e) => {
    // Remove `e.target` from the list of available ports.
    console.log("Serial port disconnected");

    port = undefined;
    document.getElementById("deviceStatus").innerText = "接続されていません。";
});
  
navigator.serial.getPorts().then((ports) => {
    // Initialize the list of available ports with `ports` on page load.
});
  
window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};
