const { WebSocketServer } = require('ws');

// Khởi tạo cổng Port (Render sẽ tự cấp cổng qua process.env.PORT)
const PORT = process.env.PORT || 3000;

// Tạo WebSocket Server
const wss = new WebSocketServer({ port: PORT });

console.log(`Server đang chạy tại cổng: ${PORT}`);

// Quản lý các máy khách (Client) kết nối vào
wss.on('connection', (ws) => {
    console.log('Có người chơi vừa kết nối vào server!');

    // Lắng nghe tin nhắn từ dự án TurboWarp gửi lên
    ws.on('message', (data) => {
        // Chuyển dữ liệu nhận được sang dạng chuỗi text
        const message = data.toString();
        console.log(`Nhận được dữ liệu: ${message}`);

        // Gửi lại dữ liệu đó cho TẤT CẢ các người chơi KHÁC đang kết nối
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
                client.send(message);
            }
        });
    });

    // Lắng nghe khi có người thoát game hoặc mất kết nối
    ws.on('close', () => {
        console.log('Một người chơi đã ngắt kết nối.');
    });
});
