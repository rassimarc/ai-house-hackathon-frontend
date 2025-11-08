import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
	const [user, setUser] = useState(null);
	const [activeTab, setActiveTab] = useState("chores"); // 'chores' or 'groceries'
	const [chores, setChores] = useState([]);
	const [groceryList, setGroceryList] = useState([]);
	const [newChore, setNewChore] = useState("");
	const [newGroceryItem, setNewGroceryItem] = useState("");
	const [loading, setLoading] = useState(true);
	const [house, setHouse] = useState(null);
	const [newHouseName, setNewHouseName] = useState("");
	const [creatingHouse, setCreatingHouse] = useState(false);
	const [houseMode, setHouseMode] = useState("create"); // 'create' or 'join'
	const [joinCode, setJoinCode] = useState("");
	const [joiningHouse, setJoiningHouse] = useState(false);
	const [joinError, setJoinError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		// Check if user is logged in
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}

		// Get user data
		const userData = JSON.parse(localStorage.getItem("user"));
		setUser(userData);

		// Determine if user is already in a house (support `house` object or `houseId`)
		if (userData) {
			if (userData.house) {
				setHouse(userData.house);
			} else if (userData.houseId) {
				setHouse({ id: userData.houseId, name: `House ${userData.houseId}` });
			} else {
				setHouse(null);
			}
		}

		// Fetch chores and grocery list
		fetchData();
	}, [navigate]);

	const fetchData = async () => {
		try {
			// Mock chores data
			const mockChores = [
				{ id: 1, title: "Clean the kitchen", completed: false },
				{ id: 2, title: "Take out trash", completed: true },
				{ id: 3, title: "Vacuum living room", completed: false },
			];

			// Mock grocery data
			const mockGroceries = [
				{ id: 1, item: "Milk", purchased: false },
				{ id: 2, item: "Bread", purchased: true },
				{ id: 3, item: "Eggs", purchased: false },
			];

			setChores(mockChores);
			setGroceryList(mockGroceries);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	// Create a mock house and associate it with the user (no backend yet)
	const createHouse = (e) => {
		e.preventDefault();
		if (!newHouseName.trim()) return;
		setCreatingHouse(true);

		// create mock house with invite code
		const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();
		const newHouse = {
			id: Date.now(),
			name: newHouseName,
			members: [user?.id],
			inviteCode,
		};

		// persist the house in localStorage under a 'houses' map so others can join by code
		const houses = JSON.parse(localStorage.getItem("houses") || "{}");
		houses[inviteCode] = newHouse;
		localStorage.setItem("houses", JSON.stringify(houses));

		// Update local state and persist to localStorage so refresh keeps the house
		setHouse(newHouse);
		const updatedUser = { ...user, house: newHouse };
		localStorage.setItem("user", JSON.stringify(updatedUser));
		setUser(updatedUser);
		setNewHouseName("");
		setCreatingHouse(false);

		// Load mock data for the house
		fetchData();
	};

	const joinHouse = (e) => {
		e.preventDefault();
		setJoinError("");
		if (!joinCode.trim()) {
			setJoinError("Please enter an invite code.");
			return;
		}
		setJoiningHouse(true);

		const code = joinCode.trim().toUpperCase();
		const houses = JSON.parse(localStorage.getItem("houses") || "{}");
		const found = houses[code];
		if (!found) {
			setJoinError("Invalid invite code.");
			setJoiningHouse(false);
			return;
		}

		// Add user to house members (mock)
		if (!found.members) found.members = [];
		if (user && !found.members.includes(user.id)) found.members.push(user.id);

		// persist updated house
		houses[code] = found;
		localStorage.setItem("houses", JSON.stringify(houses));

		// attach house to user and persist
		const updatedUser = { ...user, house: found };
		localStorage.setItem("user", JSON.stringify(updatedUser));
		setUser(updatedUser);
		setHouse(found);
		setJoinCode("");
		setJoiningHouse(false);

		// load mock data
		fetchData();
	};

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

	// Grocery functions
	const addGroceryItem = async (e) => {
		e.preventDefault();
		if (!newGroceryItem.trim()) return;

		try {
			const response = await api.post("/groceries", {
				item: newGroceryItem,
				purchased: false,
			});
			setGroceryList([...groceryList, response.data]);
			setNewGroceryItem("");
		} catch (error) {
			console.error("Error adding grocery item:", error);
		}
	};

	const toggleGroceryItem = async (itemId) => {
		try {
			const item = groceryList.find((i) => i.id === itemId);
			const response = await api.patch(`/groceries/${itemId}`, {
				purchased: !item.purchased,
			});
			setGroceryList(
				groceryList.map((i) => (i.id === itemId ? response.data : i))
			);
		} catch (error) {
			console.error("Error updating grocery item:", error);
		}
	};

	const deleteGroceryItem = async (itemId) => {
		try {
			await api.delete(`/groceries/${itemId}`);
			setGroceryList(groceryList.filter((i) => i.id !== itemId));
		} catch (error) {
			console.error("Error deleting grocery item:", error);
		}
	};

	if (loading) {
		return (
			<div className="dashboard-container">
				<div className="loading">Loading...</div>
			</div>
		);
	}

	// If the user is not in a house yet, show the create-house option
	if (!house) {
		return (
			<div className="dashboard-container">
				{/* Header */}
				<header className="dashboard-header">
					<div className="header-content">
						<h1 className="dashboard-logo">RoomMate</h1>
						<div className="header-right">
							<span className="user-name">Welcome, {user?.name}!</span>
							<button
								onClick={() => navigate("/house")}
								className="my-house-btn"
							>
								My House
							</button>
							<button onClick={handleLogout} className="logout-btn">
								Logout
							</button>
						</div>
					</div>
				</header>

				<main className="dashboard-main">
					<div className="dashboard-content">
						<div className="create-house-card">
							<div className="mode-switch">
								<button
									className={houseMode === "create" ? "active" : ""}
									onClick={() => setHouseMode("create")}
								>
									Create
								</button>
								<button
									className={houseMode === "join" ? "active" : ""}
									onClick={() => setHouseMode("join")}
								>
									Join
								</button>
							</div>

							{houseMode === "create" ? (
								<>
									<h2>Create a House</h2>
									<p>
										You're not in a house yet. Create one to start sharing
										chores and groceries with your roommates.
									</p>
									<form onSubmit={createHouse} className="create-house-form">
										<input
											type="text"
											value={newHouseName}
											onChange={(e) => setNewHouseName(e.target.value)}
											placeholder="House name"
											className="add-item-input"
										/>
										<button
											type="submit"
											className="add-item-btn"
											disabled={creatingHouse}
										>
											{creatingHouse ? "Creating..." : "Create House"}
										</button>
									</form>
								</>
							) : (
								<>
									<h2>Join a House</h2>
									<p>Have an invite code? Enter it below to join your house.</p>
									<form onSubmit={joinHouse} className="create-house-form">
										<input
											type="text"
											value={joinCode}
											onChange={(e) => setJoinCode(e.target.value)}
											placeholder="Invite code"
											className="add-item-input"
										/>
										{joinError && (
											<div className="error-message">{joinError}</div>
										)}
										<button
											type="submit"
											className="add-item-btn"
											disabled={joiningHouse}
										>
											{joiningHouse ? "Joining..." : "Join House"}
										</button>
									</form>
								</>
							)}
						</div>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="dashboard-container">
			{/* Header */}
			<header className="dashboard-header">
				<div className="header-content">
					<h1 className="dashboard-logo">RoomMate</h1>
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
							🛒 Grocery List
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
								<h2>Shared Grocery List</h2>
							</div>

							{/* Add Grocery Item Form */}
							<form onSubmit={addGroceryItem} className="add-item-form">
								<input
									type="text"
									value={newGroceryItem}
									onChange={(e) => setNewGroceryItem(e.target.value)}
									placeholder="Add a grocery item..."
									className="add-item-input"
								/>
								<button type="submit" className="add-item-btn">
									Add
								</button>
							</form>

							{/* Grocery List */}
							<div className="items-list">
								{groceryList.length === 0 ? (
									<p className="empty-message">
										No items yet. Add groceries you need!
									</p>
								) : (
									groceryList.map((item) => (
										<div key={item.id} className="item-card">
											<div className="item-left">
												<input
													type="checkbox"
													checked={item.purchased}
													onChange={() => toggleGroceryItem(item.id)}
													className="item-checkbox"
												/>
												<span
													className={`item-text ${
														item.purchased ? "completed" : ""
													}`}
												>
													{item.item}
												</span>
											</div>
											<button
												onClick={() => deleteGroceryItem(item.id)}
												className="delete-btn"
											>
												✕
											</button>
										</div>
									))
								)}

								{/* My House managed on a separate page. Use the header button to go there. */}
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

export default Dashboard;
