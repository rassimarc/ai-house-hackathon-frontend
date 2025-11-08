import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyHouse.css";

function MyHouse() {
	const [user, setUser] = useState(null);
	const [house, setHouse] = useState(null);
	// members list is derived from house and optional users store
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}

		const userData = JSON.parse(localStorage.getItem("user"));
		setUser(userData);

		// If user has house attached, load it from stored houses map or from user.house
		const houses = JSON.parse(localStorage.getItem("houses") || "{}");
		let h = null;
		if (userData?.house?.inviteCode) {
			h = houses[userData.house.inviteCode] || userData.house;
		} else if (userData?.houseId) {
			// attempt to find by id
			h =
				Object.values(houses).find((hh) => hh.id === userData.houseId) || null;
		} else if (userData?.house) {
			h = userData.house;
		}

		setHouse(h);

		// members info will be derived at render time from the optional `users` store

		setLoading(false);
	}, [navigate]);

	const goBack = () => navigate("/dashboard");

	const copyInvite = async () => {
		if (!house?.inviteCode) return;
		try {
			await navigator.clipboard.writeText(house.inviteCode);
			// alert(`Invite code copied: ${house.inviteCode}`);
            // Small non-intrusive confirmation on the bottom right
            const confirmation = document.createElement("div");
            confirmation.className = "copy-confirmation";
            confirmation.innerText = "Invite code copied to clipboard!";
            document.body.appendChild(confirmation);
            setTimeout(() => {
                document.body.removeChild(confirmation);
            }, 2000);
		} catch (e) {
			console.error(e);
			window.prompt("Copy invite code:", house.inviteCode);
		}
	};

	const regenerateInvite = () => {
		if (!house) return;
		const houses = JSON.parse(localStorage.getItem("houses") || "{}");
		const oldCode = house.inviteCode;
		const newCode = Math.random().toString(36).slice(2, 8).toUpperCase();

		const newHouse = { ...house, inviteCode: newCode };
		// remove old and add new
		if (oldCode && houses[oldCode]) delete houses[oldCode];
		houses[newCode] = newHouse;
		localStorage.setItem("houses", JSON.stringify(houses));

		// Update user stored house if present
		const storedUser = JSON.parse(localStorage.getItem("user") || "null");
		if (storedUser) {
			storedUser.house = newHouse;
			localStorage.setItem("user", JSON.stringify(storedUser));
			setUser(storedUser);
		}

		setHouse(newHouse);
		// alert(`New invite code: ${newCode}`);
	};

	const leaveHouse = () => {
		if (!house || !user) return;
		if (!window.confirm("Leave house?")) return;

		const houses = JSON.parse(localStorage.getItem("houses") || "{}");
		if (house.inviteCode && houses[house.inviteCode]) {
			const h = houses[house.inviteCode];
			h.members = (h.members || []).filter((id) => id !== user.id);
			houses[house.inviteCode] = h;
			localStorage.setItem("houses", JSON.stringify(houses));
		}

		const storedUser = JSON.parse(localStorage.getItem("user") || "null");
		if (storedUser) {
			delete storedUser.house;
			localStorage.setItem("user", JSON.stringify(storedUser));
			setUser(storedUser);
		}

		setHouse(null);
		// redirect back to dashboard
		navigate("/");
	};

	const removeMember = (memberId) => {
		if (!house) return;
		if (!window.confirm(`Remove member ${memberId}?`)) return;
		const houses = JSON.parse(localStorage.getItem("houses") || "{}");
		if (house.inviteCode && houses[house.inviteCode]) {
			const h = houses[house.inviteCode];
			h.members = (h.members || []).filter((id) => id !== memberId);
			houses[house.inviteCode] = h;
			localStorage.setItem("houses", JSON.stringify(houses));
			setHouse(h);
		}
	};

	if (loading) return <div className="myhouse-container">Loading...</div>;

	return (
		<div className="myhouse-container">
			<header className="myhouse-header">
				<button className="back-btn" onClick={goBack}>
					&larr; Back
				</button>
				<h1>House Settings</h1>
			</header>

			{!house ? (
				<div className="no-house">
					<p>You are not part of a house yet.</p>
					<button className="add-item-btn" onClick={() => navigate("/")}>
						Go to dashboard
					</button>
				</div>
			) : (
				<div className="house-card">
					<div className="house-top">
						<div>
							<h2 className="house-name">{house.name}</h2>
							<div className="house-code">
								Invite code: <strong>{house.inviteCode}</strong>
							</div>
						</div>
						<div className="house-actions">
							<button className="add-item-btn" onClick={copyInvite}>
								Copy
							</button>
							<button className="add-item-btn" onClick={regenerateInvite}>
								Regenerate
							</button>
							<button className="logout-btn" onClick={leaveHouse}>
								Leave
							</button>
						</div>
					</div>

					<section className="members-section">
						<h3>Members</h3>
						{!house.members || house.members.length === 0 ? (
							<p className="empty-message">No members yet.</p>
						) : (
							<div className="members-list">
								{house.members.map((mid) => {
									const users = JSON.parse(
										localStorage.getItem("users") || "{}"
									);
									const info = users[mid] || null;
									return (
										<div className="member-item" key={mid}>
											<div>
												<div className="member-name">
													{info?.name || info?.email || mid}
												</div>
												<div className="member-sub">
													{info ? info.email : "ID: " + mid}
												</div>
											</div>
											<div>
												{mid !== user?.id && (
													<button
														className="delete-btn"
														onClick={() => removeMember(mid)}
													>
														Remove
													</button>
												)}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</section>
				</div>
			)}
		</div>
	);
}

export default MyHouse;
