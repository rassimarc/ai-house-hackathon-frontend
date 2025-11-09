import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
        
		try {
			// Check for test user
			if (email === "test@gmail.com" && password === "pass") {
				// Mock successful login
				localStorage.setItem("token", "fake-jwt-token");
				localStorage.setItem(
					"user",
					JSON.stringify({
						id: 1,
						email: "test@gmail.com",
						name: "Marc Rassi",
					})
				);
				navigate("/dashboard");
				return;
			}

			const response = await api.get(`/auth/login?email=${email}&password=${password}`);

			// Store the token
			localStorage.setItem("token", response.data.token);

			// Store user data if needed
			localStorage.setItem("user", JSON.stringify(response.data.user));

			// Redirect to dashboard
			const userHouse = await api.get(`/household/my?email=${response.data.user.email}`);
			if (userHouse.data.in_household) {
				navigate("/dashboard");
			} else {
				navigate("/join-create-team");
			}
		} catch (err) {
			setError(
				err.response?.data?.message || "Login failed. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-container">
			<div className="login-card">
				<h2 className="login-title">Login</h2>

				<form onSubmit={handleSubmit} className="login-form">
					<div className="input-group">
						<label className="input-label">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="input-field"
							placeholder="Enter your email"
						/>
					</div>

					<div className="input-group">
						<label className="input-label">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="input-field"
							placeholder="Enter your password"
						/>
					</div>

					{error && <div className="error-message">{error}</div>}

					<button type="submit" disabled={loading} className="login-button">
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<p className="login-footer">
					Don't have an account?{" "}
					<a href="/signup" className="login-link">
						Sign up
					</a>
				</p>
			</div>
		</div>
	);
}

export default Login;
