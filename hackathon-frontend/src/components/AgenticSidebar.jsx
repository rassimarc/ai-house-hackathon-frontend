import React, { useState } from "react";
import "../pages/Dashboard.css";

function AgenticSidebar() {
	const [messages, setMessages] = useState([
		{ sender: "agent", text: "Hi! How can I help you today?" },
	]);
	const [input, setInput] = useState("");

	const handleSend = (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		setMessages([...messages, { sender: "user", text: input }]);
		// Simulate agentic response
		setTimeout(() => {
			setMessages((msgs) => [
				...msgs,
				{ sender: "agent", text: "(Agentic response placeholder)" },
			]);
		}, 600);
		setInput("");
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
