import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Goals() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ UserID: 1, FechaLímite: '', Completado: 0, Descripción: '' });
  const [editing, setEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);

  useEffect(() => {
    // Fetch goals from the backend on component mount
    axios.get('http://localhost/react_php_app/api.php?table=meta')
      .then(response => {
        const fetchedGoals = response.data.map(goal => ({
          ...goal,
          Completado: Number(goal.Completado) // Convert Completado to number
        }));
        console.log('Fetched goals:', fetchedGoals);
        setGoals(fetchedGoals);
      })
      .catch(error => {
        console.error('Error fetching goals:', error);
      });
  }, []);

  const handleGoalChange = (event) => {
    const { name, value } = event.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const addGoal = (event) => {
    event.preventDefault();
    if (!validateFechaLimite(newGoal.FechaLímite)) {
      alert(t('goalsP.invalid_date'));
      return;
    }
    axios.post('http://localhost/react_php_app/api.php?table=meta', newGoal)
      .then(response => {
        const addedGoal = { ...newGoal, MetaID: response.data.id, Completado: Number(newGoal.Completado) };
        console.log('Added goal:', addedGoal);
        setGoals(prev => [...prev, addedGoal]);
        resetForm();
      })
      .catch(error => {
        console.error('Error adding goal:', error);
      });
  };

  const updateGoal = (event) => {
    event.preventDefault();
    if (!validateFechaLimite(newGoal.FechaLímite)) {
      alert(t('goalsP.invalid_date'));
      return;
    }
    axios.put(`http://localhost/react_php_app/api.php?table=meta&id=${currentGoal.MetaID}`, newGoal)
      .then(response => {
        const updatedGoals = goals.map(goal => (goal.MetaID === currentGoal.MetaID ? { ...newGoal, MetaID: currentGoal.MetaID, Completado: Number(newGoal.Completado) } : goal));
        setGoals(updatedGoals);
        resetForm();
        setEditing(false);
        setCurrentGoal(null);
      })
      .catch(error => {
        console.error('Error updating goal:', error);
      });
  };

  const deleteGoal = (id) => {
    const confirmDelete = window.confirm(t('Are you sure you want to delete this goal?'));
    if (confirmDelete) {
      console.log(`Attempting to delete goal with ID: ${id}`);
      axios.delete(`http://localhost/react_php_app/api.php?table=meta&id=${id}`)
        .then(response => {
          console.log(`Successfully deleted goal with ID: ${id}`);
          setGoals(prev => prev.filter(goal => goal.MetaID !== id));
        })
        .catch(error => {
          console.error(`Error deleting goal with ID: ${id}`, error);
        });
    }
  };

  const editGoal = (goal) => {
    setEditing(true);
    setCurrentGoal(goal);
    setNewGoal({
      ...goal,
      FechaLímite: goal.FechaLímite.split('T')[0], // Format date for input
      Completado: Number(goal.Completado) // Ensure Completado is a number
    });
  };

  const resetForm = () => {
    setNewGoal({ UserID: 1, FechaLímite: '', Completado: 0, Descripción: '' });
    setEditing(false);
  };

  const validateFechaLimite = (fecha) => {
    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    return fecha >= today;
  };

  return (
    <div>
      <h1>{t('nav.goals')}</h1>
      <form onSubmit={editing ? updateGoal : addGoal}>
        <label>
          {t('goalsP.deadline')}:
          <input
            type="date"
            name="FechaLímite"
            value={newGoal.FechaLímite}
            onChange={handleGoalChange}
            required
            min={new Date().toISOString().split('T')[0]} // Set minimum date to today
          />
        </label>
        <label>
          {t('goalsP.description')}:
          <textarea name="Descripción" value={newGoal.Descripción} onChange={handleGoalChange} placeholder={t('goalsP.description_placeholder')} />
        </label>
        {editing && (
          <label>
            {t('goalsP.completed')}:
            <input type="checkbox" name="Completado" checked={newGoal.Completado === 1} onChange={(e) => setNewGoal({ ...newGoal, Completado: e.target.checked ? 1 : 0 })} />
          </label>
        )}
        <button type="submit">{editing ? t('goalsP.update_goal') : t('goalsP.add_goal')}</button>
        {editing && <button type="button" onClick={resetForm}>{t('glob.cancel')}</button>}
      </form>
      <h2>{t('goalsP.list_goals')}</h2>
      <ul>
        {goals.map((goal) => (
          <li key={goal.MetaID}>
            <strong>{goal.FechaLímite}</strong>
            <p>{goal.Descripción}</p>
            <p>{goal.Completado === 1 ? t('goalsP.completed') : t('goalsP.not_completed')}</p>
            <button onClick={() => deleteGoal(goal.MetaID)}>{t('glob.delete')}</button>
            <button onClick={() => editGoal(goal)}>{t('glob.edit')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Goals;
