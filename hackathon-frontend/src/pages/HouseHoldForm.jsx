import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HouseholdForm.css';

function HouseholdForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    groceryFrequency: 'weekly',
    itemsBought: '',
    quantities: '',
    chores: '',
    budgetSharing: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save to localStorage or API
    localStorage.setItem('householdData', JSON.stringify(formData));

    alert('Preferences saved!');
    navigate('/dashboard');
  };

  return (
    <div className="household-container">
      <div className="household-card">
        <h2 className="household-title">Household Preferences</h2>

        <form onSubmit={handleSubmit} className="household-form">
          <div className="input-group">
            <label className="input-label">How often do you buy groceries?</label>
            <select
              name="groceryFrequency"
              value={formData.groceryFrequency}
              onChange={handleChange}
              className="input-field"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">What items do you usually buy?</label>
            <textarea
              name="itemsBought"
              value={formData.itemsBought}
              onChange={handleChange}
              placeholder="e.g., milk, eggs, cleaning supplies..."
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">How much of each item (on average)?</label>
            <textarea
              name="quantities"
              value={formData.quantities}
              onChange={handleChange}
              placeholder="e.g., 2L milk, 1 dozen eggs, 1 bottle detergent..."
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">How do you prefer to split chores?</label>
            <input
              type="text"
              name="chores"
              value={formData.chores}
              onChange={handleChange}
              placeholder="e.g., rotate weekly, fixed roles..."
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">How do you prefer to split expenses?</label>
            <input
              type="text"
              name="budgetSharing"
              value={formData.budgetSharing}
              onChange={handleChange}
              placeholder="e.g., equally, based on usage..."
              className="input-field"
            />
          </div>

          <button type="submit" className="household-button">Save Preferences</button>
        </form>
      </div>
    </div>
  );
}

export default HouseholdForm;