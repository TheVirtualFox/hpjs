import React, { useEffect, useRef, useState } from "react";

export default function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("🔌 отключено");

    const ws = useRef(null);
    const reconnectInterval = useRef(null);

    const connect = () => {
        if (ws.current) ws.current.close(); // На всякий случай

        ws.current = new WebSocket("ws://localhost:8080");

        ws.current.onopen = () => {
            setStatus("🟢 подключено");
            if (reconnectInterval.current) {
                clearInterval(reconnectInterval.current);
                reconnectInterval.current = null;
            }
        };

        ws.current.onmessage = (event) => {
            setMessages((prev) => [...prev, "Сервер: " + event.data]);
        };

        ws.current.onclose = () => {
            setStatus("🔌 отключено — повторная попытка...");
            if (!reconnectInterval.current) {
                reconnectInterval.current = setInterval(() => {
                    console.log("Попытка переподключения...");
                    connect();
                }, 3000);
            }
        };

        ws.current.onerror = (err) => {
            console.error("WebSocket error:", err);
            ws.current.close(); // Закрываем, чтобы сработал onclose
        };
    };

    useEffect(() => {
        connect();

        return () => {
            if (ws.current) ws.current.close();
            if (reconnectInterval.current) clearInterval(reconnectInterval.current);
        };
    }, []);

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(input);
            setMessages((prev) => [...prev, "Вы: " + input]);
            setInput("");
        } else {
            alert("Соединение не установлено");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto font-mono">
            <h1 className="text-xl font-bold mb-2">WebSocket клиент</h1>
            <div className="mb-2 text-sm text-gray-600">Статус: {status}</div>

            <div className="border rounded p-2 h-60 overflow-y-auto bg-gray-100 mb-2">
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    className="border p-1 flex-1"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-3" onClick={sendMessage}>
                    Отправить
                </button>
            </div>
        </div>
    );
}
