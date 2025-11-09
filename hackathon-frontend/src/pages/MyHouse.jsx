import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./MyHouse.css";

function MyHouse() {
	const [house, setHouse] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}

		// Fetch household/my from API
		api
			.get(
				"household/my?email=" + JSON.parse(localStorage.getItem("user")).email
			)
			.then((res) => {
				if (res.data.in_household) {
					setHouse(res.data.household);
				} else {
					setHouse(null);
				}
				setLoading(false);
			})
			.catch(() => {
				setHouse(null);
				setLoading(false);
			});
	}, [navigate]);

	const goBack = () => navigate("/dashboard");

	const copyInvite = async () => {
		if (!house?.invite_code) return;
		try {
			await navigator.clipboard.writeText(house.invite_code);
			const confirmation = document.createElement("div");
			confirmation.className = "copy-confirmation";
			confirmation.innerText = "Invite code copied to clipboard!";
			document.body.appendChild(confirmation);
			setTimeout(() => {
				document.body.removeChild(confirmation);
			}, 2000);
		} catch (e) {
			console.error(e);
			window.prompt("Copy invite code:", house.invite_code);
		}
	};

	// Regenerate invite code would require an API call in a real app

	// Leave house would require an API call in a real app
	const leaveHouse = () => {
		alert("Leave house feature not implemented.");
	};

	// Remove member would require an API call in a real app
	// const removeMember = (memberId) => {
	//     alert("Remove member feature not implemented.");
	// };

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
								Invite code: <strong>{house.invite_code}</strong>
							</div>
						</div>
						<div className="house-actions">
							<button className="add-item-btn" onClick={copyInvite}>
								Copy
							</button>
							<button className="logout-btn" onClick={leaveHouse}>
								Leave
							</button>
						</div>
					</div>

					<section className="members-section">
						<h3>Members</h3>
						{!house.users || house.users.length === 0 ? (
							<p className="empty-message">No members yet.</p>
						) : (
							<div className="members-list">
								{house.users.map((userEmail) => (
									<div className="member-item" key={userEmail}>
										<div>
											<div className="member-name">{userEmail}</div>
										</div>
									</div>
								))}
							</div>
						)}
					</section>

					<section className="items-section">
						<h3>Common Items</h3>
						{!house.common_items || house.common_items.length === 0 ? (
							<p className="empty-message">No common items yet.</p>
						) : (
							<ul className="items-list">
								{house.common_items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						)}
					</section>
				</div>
			)}
		</div>
	);
}

export default MyHouse;
