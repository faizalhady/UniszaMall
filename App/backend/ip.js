// const os = require('os');

// function findWifiIPv4Address() {
//     const interfaces = os.networkInterfaces();
//     let ipAddress = null;

//     Object.keys(interfaces).forEach((ifName) => {
//         interfaces[ifName].forEach((iface) => {
//             if ('IPv4' === iface.family && !iface.internal && /wi-fi|wlan|wireless/i.test(ifName)) {
//                 ipAddress = iface.address;
//             }
//         });
//     });

//     return ipAddress;
// }

// module.exports = findWifiIPv4Address;
