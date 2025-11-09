import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function JoinCreateTeam(props) {
	// Try to get user from props, fallback to localStorage
	const [user, setUser] = useState(
		() => props.user || JSON.parse(localStorage.getItem("user"))
	);
	const setHouse = props.setHouse;
	const fetchData = props.fetchData;
	const [newHouseName, setNewHouseName] = useState("");
	const [numTenants, setNumTenants] = useState("");
	const [selectedItems, setSelectedItems] = useState([]);
	const [pantryAmounts, setPantryAmounts] = useState({}); // {item: amount}
	const [creatingHouse, setCreatingHouse] = useState(false);
	const [houseMode, setHouseMode] = useState("create"); // 'create' or 'join'
	const [joinCode, setJoinCode] = useState("");
	const [joiningHouse, setJoiningHouse] = useState(false);
	const [joinError, setJoinError] = useState("");
	const navigate = useNavigate();

	// If user is still null, redirect to login
	if (!user) {
		navigate("/login");
		return null;
	}

	// Create a house using the backend API
	const createHouse = async (e) => {
		e.preventDefault();
		if (!newHouseName.trim() || !numTenants) return;
		setCreatingHouse(true);
		try {
			alert(user);
			const response = await api.post("/household/preferences", {
				name: newHouseName,
				members: Number(numTenants),
				common_items: selectedItems,
				pantry_amounts: selectedItems.reduce((acc, item) => {
					acc[item] = pantryAmounts[item] || "";
					return acc;
				}, {}),
				users: [user?.email],
			});
			const newHouse = response.data;
			setHouse(newHouse);
			const updatedUser = { ...user, house: newHouse };
			localStorage.setItem("user", JSON.stringify(updatedUser));
			setUser(updatedUser);
			setNewHouseName("");
			setNumTenants("");
			setSelectedItems([]);
			setPantryAmounts({});
			setCreatingHouse(false);
			fetchData();
			navigate("/dashboard");
		} catch (error) {
			console.error("Error creating house:", error);
			setCreatingHouse(false);
		}
	};

	const joinHouse = async (e) => {
		e.preventDefault();
		setJoinError("");
		if (!joinCode.trim()) {
			setJoinError("Please enter an invite code.");
			return;
		}
		setJoiningHouse(true);
		try {

			const response = await api.post(
				`/household/join?code=${encodeURIComponent(
					joinCode.trim()
				)}&email=${encodeURIComponent(user?.email)}`,
				{}
			);
			const joinedHouse = response.data;
			setHouse(joinedHouse);
			const updatedUser = { ...user, house: joinedHouse };
			localStorage.setItem("user", JSON.stringify(updatedUser));
			setUser(updatedUser);
			setJoinCode("");
			setJoiningHouse(false);
			fetchData();
			navigate("/dashboard");
		} catch {
			setJoinError("Invalid invite code or failed to join house.");
			setJoiningHouse(false);
		}
	};

	return (
		<div className="dashboard-container">
			<header className="dashboard-header">
				<div className="header-content">
					<h1 className="dashboard-logo">CoHive</h1>
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
									You're not in a house yet. Create one to start sharing chores
									and groceries with your roommates.
								</p>
								<form onSubmit={createHouse} className="create-house-form">
									<input
										type="text"
										value={newHouseName}
										onChange={(e) => setNewHouseName(e.target.value)}
										placeholder="House name"
										className="add-item-input"
									/>
									<input
										type="number"
										min="1"
										max="10"
										placeholder="Number of tenants"
										className="add-item-input"
										value={numTenants}
										onChange={(e) => setNumTenants(e.target.value)}
										required
									/>
									<div className="household-items-checklist">
										<h3>Common Household Items</h3>
										{[
											"Toilet paper",
											"Dish soap",
											"Laundry detergent",
											"Trash bags",
											"Cooking oil",
											"Paper towels",
											"Hand wash",
											"Toothpaste",
										].map((item) => (
											<div
												key={item}
												style={{
													display: "flex",
													alignItems: "center",
													marginBottom: 6,
												}}
											>
												<label
													className="checkbox-label"
													style={{ marginRight: 8, marginBottom: 0 }}
												>
													<input
														type="checkbox"
														name="householdItems"
														value={item}
														checked={selectedItems.includes(item)}
														onChange={(e) => {
															if (e.target.checked) {
																setSelectedItems([...selectedItems, item]);
															} else {
																setSelectedItems(
																	selectedItems.filter((i) => i !== item)
																);
															}
														}}
													/>
													{item}
												</label>
												{selectedItems.includes(item) && (
													<input
														type="number"
														min="0"
														step="1"
														placeholder="Pantry amount"
														style={{ width: 110, marginLeft: 4 }}
														value={pantryAmounts[item] || ""}
														onChange={(e) =>
															setPantryAmounts({
																...pantryAmounts,
																[item]: e.target.value,
															})
														}
													/>
												)}
											</div>
										))}
									</div>
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

export default JoinCreateTeam;
