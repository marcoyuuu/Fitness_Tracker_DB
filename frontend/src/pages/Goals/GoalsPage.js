import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

function Goals() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState([]);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/goals');
        setGoals(data);
      } catch (e) {
        console.error('Error fetching goals:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addGoal = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/goals', {
        description,
        due_date: dueDate,
      });
      setGoals((prev) => [data, ...prev]);
      setDescription('');
      setDueDate('');
    } catch (err) {
      console.error('Error creating goal:', err);
    }
  };

  const toggleComplete = async (goal) => {
    try {
      const { data } = await api.patch(`/goals/${goal.id}`, {
        is_completed: !goal.is_completed,
      });
      setGoals((prev) => prev.map((g) => (g.id === goal.id ? data : g)));
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const deleteGoal = async (goal) => {
    if (!window.confirm(t('glob.confirm_delete') || 'Delete?')) return;
    try {
      await api.delete(`/goals/${goal.id}`);
      setGoals((prev) => prev.filter((g) => g.id !== goal.id));
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  return (
    <div>
      <h1>{t('nav.goals')}</h1>
      <form onSubmit={addGoal}>
        <label>
          {t('goalsP.deadline')}:
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </label>
        <label>
          {t('goalsP.description')}:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('goalsP.description_placeholder')}
          />
        </label>
        <button type="submit" disabled={loading}>{t('goalsP.add_goal')}</button>
      </form>

      <h2>{t('goalsP.list_goals')}</h2>
      {loading ? <p>Loading…</p> : null}
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            <strong>{goal.due_date || '—'}</strong>
            <p>{goal.description}</p>
            <p>{goal.is_completed ? t('goalsP.completed') : t('goalsP.not_completed')}</p>
            <button onClick={() => toggleComplete(goal)}>
              {goal.is_completed ? t('goalsP.mark_incomplete') || 'Mark Incomplete' : t('goalsP.mark_complete') || 'Mark Complete'}
            </button>
            <button onClick={() => deleteGoal(goal)}>{t('glob.delete')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Goals;
