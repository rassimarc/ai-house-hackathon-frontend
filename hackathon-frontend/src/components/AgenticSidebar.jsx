import React, { useState } from "react";
import "../pages/Dashboard.css";

function AgenticSidebar() {
	const [messages, setMessages] = useState([
		{ sender: "agent", text: "Hi! How can I help you today?" },
	]);
	const [input, setInput] = useState("");

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");
        try {
            const response = await fetch("http://localhost:8000/house-agent/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await response.json();
            setMessages((msgs) => [
                ...msgs,
                { sender: "agent", text: data.response || "(No response)" },
            ]);
        } catch (error) {
            setMessages((msgs) => [
                ...msgs,
                { sender: "agent", text: "(Error getting response)" },
            ]);
            console.error(error);
        }
    };

	return (
		<aside className="agentic-sidebar">
			<div className="agentic-header">🐝 Agentic Assistant</div>
			<div className="agentic-messages">
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`agentic-message ${
							msg.sender === "agent" ? "agent" : "user"
						}`}
					>
						{msg.text}
					</div>
				))}
			</div>
			<form className="agentic-input-row" onSubmit={handleSend}>
				<input
					className="agentic-input"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Ask the agent..."
				/>
				<button className="agentic-send-btn" type="submit">
					Send
				</button>
			</form>
		</aside>
	);
}

export default AgenticSidebar;
