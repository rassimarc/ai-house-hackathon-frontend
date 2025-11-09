import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";
import AgenticSidebar from "../components/AgenticSidebar";

function Dashboard() {
	const [user, setUser] = useState(null);
	const [activeTab, setActiveTab] = useState("chores"); // 'chores' or 'groceries'
	const [chores, setChores] = useState([]);
	const [cartItems, setCartItems] = useState([]); // {name, quantity}
	const [newChore, setNewChore] = useState("");
	const [loading, setLoading] = useState(true);
	const [house, setHouse] = useState(null);
	// ...existing code...
	const navigate = useNavigate();

	useEffect(() => {
		const load = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				navigate("/login");
				return;
			}

			const userData = JSON.parse(localStorage.getItem("user"));
			setUser(userData);

			try {
				// 1) Find the user's household
				const res = await api.get(`/household/my`, {
					params: { email: userData.email },
				});
				if (res.data.in_household) {
					const h = res.data.in_household;
					setHouse(h);

					// 2) Get the shared grocery cart for this household

					const cartRes = await api.get(
						`/shopping-cart?invite_code=${res.data.household.invite_code}&email=${userData.email}`,
						{}
					);

					// cartRes.data.items is [{name, quantity}]
					let items = cartRes.data?.items || [];
					// Add Toilet Paper if not present
					// if (!items.some(item => item.name && item.name.toLowerCase() === "toilet paper")) {
					// 	items = [...items, { name: "Toilet Paper", quantity: 1 }];
					// }
					setCartItems(items);
				} else {
					setHouse(null);
				}
			} catch (e) {
				console.error(e);
				setHouse(null);
			}

			setChores([
				{ id: 1, title: "Clean the kitchen", completed: false },
				{ id: 2, title: "Take out trash", completed: true },
				{ id: 3, title: "Vacuum living room", completed: false },
			]);

			setLoading(false);
		};

		load();
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	// ...existing code...

	// Chore functions
	const addChore = async (e) => {
		e.preventDefault();
		if (!newChore.trim()) return;

		try {
			const response = await api.post("/chores", {
				title: newChore,
				assignedTo: user.id,
				completed: false,
			});
			setChores([...chores, response.data]);
			setNewChore("");
		} catch (error) {
			console.error("Error adding chore:", error);
		}
	};

	const toggleChore = async (choreId) => {
		try {
			const chore = chores.find((c) => c.id === choreId);
			const response = await api.patch(`/chores/${choreId}`, {
				completed: !chore.completed,
			});
			setChores(chores.map((c) => (c.id === choreId ? response.data : c)));
		} catch (error) {
			console.error("Error updating chore:", error);
		}
	};

	const deleteChore = async (choreId) => {
		try {
			await api.delete(`/chores/${choreId}`);
			setChores(chores.filter((c) => c.id !== choreId));
		} catch (error) {
			console.error("Error deleting chore:", error);
		}
	};

	if (loading) {
		return (
			<div className="dashboard-container">
				<div className="loading">Loading...</div>
			</div>
		);
	}

	// If the user is not in a house yet, redirect to join/create team page
	// if (!user || !house || (!house.id && !house.name)) {
	// 	navigate("/join-create-team");
	// 	return null;
	// }

	return (
		<div className="dashboard-container">
			{/* Header */}
			<header className="dashboard-header">
				<div className="header-content">
					<h1 className="dashboard-logo">CoHive</h1>
					<div className="header-right">
						<span className="user-name">Welcome, {user?.name}!</span>
						<button onClick={() => navigate("/house")} className="my-house-btn">
							My House
						</button>
						<button onClick={handleLogout} className="logout-btn">
							Logout
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="dashboard-main">
				<div className="dashboard-content">
					{/* Tabs */}
					<div className="tabs">
						<button
							className={`tab ${activeTab === "chores" ? "active" : ""}`}
							onClick={() => setActiveTab("chores")}
						>
							📋 Chores
						</button>
						<button
							className={`tab ${activeTab === "groceries" ? "active" : ""}`}
							onClick={() => setActiveTab("groceries")}
						>
							🛒 Shopping Cart
						</button>
					</div>

					{/* Chores Tab */}
					{activeTab === "chores" && (
						<div className="tab-content">
							<div className="section-header">
								<h2>Household Chores</h2>
							</div>

							{/* Add Chore Form */}
							<form onSubmit={addChore} className="add-item-form">
								<input
									type="text"
									value={newChore}
									onChange={(e) => setNewChore(e.target.value)}
									placeholder="Add a new chore..."
									className="add-item-input"
								/>
								<button type="submit" className="add-item-btn">
									Add
								</button>
							</form>

							{/* Chores List */}
							<div className="items-list">
								{chores.length === 0 ? (
									<p className="empty-message">
										No chores yet. Add one to get started!
									</p>
								) : (
									chores.map((chore) => (
										<div key={chore.id} className="item-card">
											<div className="item-left">
												<input
													type="checkbox"
													checked={chore.completed}
													onChange={() => toggleChore(chore.id)}
													className="item-checkbox"
												/>
												<span
													className={`item-text ${
														chore.completed ? "completed" : ""
													}`}
												>
													{chore.title}
												</span>
											</div>
											<button
												onClick={() => deleteChore(chore.id)}
												className="delete-btn"
											>
												✕
											</button>
										</div>
									))
								)}
							</div>
						</div>
					)}

					{/* Groceries Tab */}
					{activeTab === "groceries" && (
						<div className="tab-content">
							<div className="section-header">
								<h2>Shared Grocery Cart</h2>
							</div>

							{/* No add form; data comes from backend */}
							<div className="items-list">
								{cartItems.length === 0 ? (
									<p className="empty-message">
										Your shared grocery cart is empty.
									</p>
								) : (
									cartItems.map((it, idx) => (
										<div key={idx} className="item-card">
											<div className="item-left">
												<span className="item-text">
													{it.name}
													{typeof it.quantity === "number"
														? ` — x${it.quantity}`
														: ""}
												</span>
											</div>
											{/* No delete/toggle buttons for now */}
										</div>
									))
								)}
							</div>
						</div>
					)}
				</div>
			</main>
			{/* Agentic Sidebar */}
			<AgenticSidebar />
		</div>
	);
}

// Simple Assistant-User Chat with Button Responses

// Floating Assistant Chat (bottom right)
function AssistantButtonChat() {
	const chatSteps = [
		{
			assistant: "Toilet paper is running low. What would you like to do?",
			options: [
				{ label: "Add to groceries", next: 1 },
				{ label: "False alarm", next: 2 },
			],
		},
		{
			assistant:
				"Just added toilet paper to the grocery list. would you like to see your groceries?",
			options: [
				{ label: "See groceries", next: 2 },
				{ label: "No, thanks", next: 3 },
			],
		},
		{
			assistant: "Here is your grocery list. Anything else?",
			options: [
				{ label: "See chores", next: 1 },
				{ label: "Nothing, thanks", next: 3 },
			],
		},
		{
			assistant: "Okay! Have a great day!",
			options: [],
		},
	];

	const [step, setStep] = useState(0);
	const [history, setHistory] = useState([]); // {assistant, user}
	const [open, setOpen] = useState(false);

	const handleOption = (option) => {
		setHistory([
			...history,
			{ assistant: chatSteps[step].assistant, user: option.label },
		]);
		setStep(option.next);
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			{/* Floating chat button */}
			{!open && (
				<button
					onClick={handleOpen}
					style={{
						position: "fixed",
						bottom: 32,
						right: 32,
						zIndex: 1000,
						background: "#4f46e5",
						color: "white",
						border: "none",
						borderRadius: "50%",
						width: 56,
						height: 56,
						fontSize: 28,
						boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
						cursor: "pointer",
					}}
					aria-label="Open Assistant Chat"
				>
					💬
				</button>
			)}
			{/* Floating chat window */}
			{open && (
				<div
					style={{
						position: "fixed",
						bottom: 32,
						right: 32,
						zIndex: 1001,
						background: "white",
						border: "1px solid #e5e7eb",
						borderRadius: 12,
						boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
						width: 340,
						maxWidth: "90vw",
						padding: 0,
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							background: "#4f46e5",
							color: "white",
							padding: "12px 16px",
							borderTopLeftRadius: 12,
							borderTopRightRadius: 12,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<span style={{ fontWeight: 600 }}>Assistant</span>
						<button
							onClick={handleClose}
							style={{
								background: "transparent",
								border: "none",
								color: "white",
								fontSize: 20,
								cursor: "pointer",
							}}
							aria-label="Close Chat"
						>
							×
						</button>
					</div>
					<div
						style={{
							padding: "16px",
							flex: 1,
							overflowY: "auto",
							minHeight: 120,
						}}
					>
						{history.map((entry, idx) => (
							<div key={idx} style={{ marginBottom: 12 }}>
								<div
									style={{ color: "#4f46e5", fontWeight: 500, marginBottom: 2 }}
								>
									Assistant:{" "}
									<span style={{ color: "#222" }}>{entry.assistant}</span>
								</div>
								<div style={{ color: "#222", marginLeft: 8 }}>
									<b>You:</b> {entry.user}
								</div>
							</div>
						))}
						<div style={{ color: "#4f46e5", fontWeight: 500, marginBottom: 2 }}>
							Assistant:{" "}
							<span style={{ color: "#222" }}>{chatSteps[step].assistant}</span>
						</div>
					</div>
					<div
						style={{
							padding: "12px 16px",
							borderTop: "1px solid #e5e7eb",
							background: "#f9fafb",
						}}
					>
						{chatSteps[step].options.map((option, i) => (
							<button
								key={i}
								style={{
									marginRight: 8,
									marginBottom: 4,
									background: "#6366f1",
									color: "white",
									border: "none",
									borderRadius: 6,
									padding: "8px 16px",
									fontWeight: 500,
									cursor: "pointer",
									fontSize: 15,
								}}
								onClick={() => handleOption(option)}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>
			)}
		</>
	);
}

// Export dashboard with floating chat
export default function DashboardWithAssistantChat() {
	return (
		<>
			<Dashboard />
			<AssistantButtonChat />
		</>
	);
}
