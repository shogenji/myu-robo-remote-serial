let port;

async function connect() {
    console.log(event.type);

    const filters = [
        {
        //   usbVendorId: 0x04D8, // 
        //   usbProductId: 0xFA8B // 
            usbProductId: 8963,
            usbVendorId: 1659
        }
    ];

    // Prompt user to select a MYU robo device.
    try {
        port = await navigator.serial.requestPort();
        // port = await navigator.serial.requestPort({filters});
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

    const waitFor = duration => new Promise(r => setTimeout(r, duration));

    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([2]));
    await waitFor(100);

    writer.releaseLock();
}

async function remoteBackward() {
    if (!port) return;

    const waitFor = duration => new Promise(r => setTimeout(r, duration));

    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([8]));
    await waitFor(100);

    writer.releaseLock();
}

async function remoteTurnLeft() {
    if (!port) return;

    const waitFor = duration => new Promise(r => setTimeout(r, duration));

    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([11]));
    await waitFor(100);

    writer.releaseLock();
}

async function remoteTurnRight() {
    if (!port) return;

    const waitFor = duration => new Promise(r => setTimeout(r, duration));

    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([10]));
    await waitFor(100);

    writer.releaseLock();
}

async function remoteMouseup() {
    if (!port) return;

    const waitFor = duration => new Promise(r => setTimeout(r, duration));

    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([0]));
    await waitFor(100);

    writer.releaseLock();
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

function handleConnectedDevice(e) {
    console.log("Device connected: " + e.device.productName);
}

function handleDisconnectedDevice(e) {
    console.log("Device disconnected: " + e.device.productName);

    device = undefined;
    document.getElementById("deviceStatus").innerText = "接続されていません。";
}

function handleInputReport(e) {
    console.log(e.device.productName + ": got input report " + e.reportId);
    console.log(new Uint8Array(e.data.buffer));
}
  
navigator.hid.addEventListener("connect", handleConnectedDevice);
navigator.hid.addEventListener("disconnect", handleDisconnectedDevice);
navigator.hid.addEventListener("inputreport", handleInputReport);
    

window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};
