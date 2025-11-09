import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";
import AgenticSidebar from "../components/AgenticSidebar";

function Dashboard() {
	const [user, setUser] = useState(null);
	const [activeTab, setActiveTab] = useState("chores"); // 'chores' or 'groceries'
	const [chores, setChores] = useState([]);
	const [groceryList, setGroceryList] = useState([]);
	const [newChore, setNewChore] = useState("");
	const [newGroceryItem, setNewGroceryItem] = useState("");
	const [loading, setLoading] = useState(true);
	const [house, setHouse] = useState(null);
	// ...existing code...
	const navigate = useNavigate();

	useEffect(() => {
		const checkUserAndHouse = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				navigate("/login");
				return;
			}
			const userData = JSON.parse(localStorage.getItem("user"));
			setUser(userData);
			// Check with API if user is in a house
			try {
				const res = await api.get(`/household/my?email=${userData.email}`);
				if (res.data.house) {
					setHouse(res.data.house);
				} else {
					setHouse(null);
				}
			} catch {
				setHouse(null);
			}
			fetchData();
		};
		checkUserAndHouse();
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
			{/* Agentic Sidebar */}
			<AgenticSidebar />
		</div>
	);
}

export default Dashboard;
