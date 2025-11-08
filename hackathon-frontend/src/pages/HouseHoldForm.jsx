import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HouseholdForm.css';

function HouseholdForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roommates: '',
    commonItems: [],
    otherItems: '',
    frequency: 'weekly',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedItems = [...formData.commonItems];

    if (checked) {
      updatedItems.push(value);
    } else {
      updatedItems = updatedItems.filter((item) => item !== value);
    }

    setFormData({
      ...formData,
      commonItems: updatedItems,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Preferences saved!');
    navigate('/dashboard');
  };

  const commonItemsList = [
    'Toilet Paper',
    'Dish Soap',
    'Laundry Detergent',
    'Trash Bags',
    'Cooking Oil',
    'Paper Towels',
    'Hand Wash',
    'Toothpaste',
  ];

  return (
    <div className="household-container">
      <div className="household-card">
        <h2 className="household-title">Household Preferences</h2>

        <form onSubmit={handleSubmit} className="household-form">
          {/* Number of roommates */}
          <div className="input-group">
            <label className="input-label">How many people live in your household?</label>
            <input
              type="number"
              name="roommates"
              value={formData.roommates}
              onChange={handleChange}
              required
              min="1"
              className="input-field"
              placeholder="Enter number of members"
            />
          </div>

          {/* Common items */}
          <div className="input-group">
            <label className="input-label">Select common household items you usually need:</label>
            <div className="checkbox-group">
              {commonItemsList.map((item) => (
                <label key={item} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.commonItems.includes(item)}
                    onChange={handleCheckboxChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Other items */}
          <div className="input-group">
            <label className="input-label">Any other items you regularly buy?</label>
            <input
              type="text"
              name="otherItems"
              value={formData.otherItems}
              onChange={handleChange}
              placeholder="e.g., snacks, cleaning spray..."
              className="input-field"
            />
          </div>

          {/* Frequency */}
          <div className="input-group">
            <label className="input-label">How often do you buy items/groceries?</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="input-field"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit" className="signup-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default HouseholdForm;