import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import HouseholdForm from "./pages/HouseHoldForm";
import Dashboard from "./pages/Dashboard";
import MyHouse from "./pages/MyHouse";
import JoinCreateTeam from "./pages/JoinCreateTeam";

import { useState, useEffect, useRef } from "react";
import api from "./services/api";

function App() {
	// Lift user, setUser, setHouse, fetchData to App
	const [user, setUser] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem("user"));
		} catch {
			return null;
		}
	});
	const [house, setHouse] = useState(null); // (Unused, but kept for future use. Remove if not needed.)
	const lastTsRef = useRef(null);
	const stopRef = useRef(false);
	// Chat bubble message state
	const [chatMessage, setChatMessage] = useState(
		"Hi, I'm here to help you manage your household!"
	);

	useEffect(() => {
		stopRef.current = false;

		// one AbortController to cancel in-flight request on unmount
		let controller = new AbortController();

		async function longPollLoop() {
			while (!stopRef.current) {
				try {
					// pass since so backend only returns when there's something newer
					const params = lastTsRef.current ? { since: lastTsRef.current } : {};
					// axios will keep the request open; set a generous timeout (ms)
					const res = await api.get("agent/messages/long-poll", {
						params,
						timeout: 30000, // 30s matches server's ~25s
						signal: controller.signal,
					});

					// If backend returns 200 { message, created_at }
					if (res && res.status === 200 && res.data) {
						const { message, created_at } = res.data || {};
						if (message && created_at && created_at !== lastTsRef.current) {
							lastTsRef.current = created_at;
							setChatMessage(message); // <-- your current_agent_message
						}
					}

					// Loop immediately; server already waited up to ~25s
				} catch (err) {
					// If aborted (unmount), stop loop
					if (controller.signal.aborted) break;

					// Network hiccup / timeout — brief backoff then continue
					await new Promise((r) => setTimeout(r, 1000));
				}
			}
		}

		longPollLoop();

		return () => {
			stopRef.current = true;
			controller.abort(); // cancel any in-flight long-poll
		};
	}, []);

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/household" element={<HouseholdForm />} />
					{/* <Route path="/dashboard" element={<Dashboard />} /> */}
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/house" element={<MyHouse />} />
					<Route
						path="/join-create-team"
						element={
							<JoinCreateTeam
								user={user}
								setUser={setUser}
								setHouse={setHouse}
							/>
						}
					/>
				</Routes>
			</BrowserRouter>
			{/* Floating Robot Chat Icon */}
			<div
				style={{
					position: "fixed",
					bottom: "32px",
					right: "32px",
					zIndex: 1000,
					display: "flex",
					alignItems: "flex-end",
				}}
			>
				{/* Chat bubble */}
				<div
					style={{
						background: "#fff",
						color: "#333",
						borderRadius: "16px",
						boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
						padding: "10px 16px",
						marginRight: "12px",
						fontSize: "15px",
						fontWeight: 500,
						marginBottom: "8px",
						maxWidth: "180px",
					}}
				>
					{chatMessage}
				</div>
				{/* Robot icon SVG */}
				<div
					style={{
						background: "#fff",
						borderRadius: "50%",
						boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
						width: "56px",
						height: "56px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<svg
						width="36"
						height="36"
						viewBox="0 0 36 36"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							cx="18"
							cy="18"
							r="16"
							fill="#F3F4F6"
							stroke="#B3B3B3"
							strokeWidth="2"
						/>
						<rect x="10" y="14" width="16" height="10" rx="5" fill="#B3B3B3" />
						<circle cx="14" cy="19" r="2" fill="#fff" />
						<circle cx="22" cy="19" r="2" fill="#fff" />
						<rect x="16" y="24" width="4" height="2" rx="1" fill="#B3B3B3" />
						<rect x="17" y="8" width="2" height="6" rx="1" fill="#B3B3B3" />
					</svg>
				</div>
			</div>
		</>
	);
}

export default App;
