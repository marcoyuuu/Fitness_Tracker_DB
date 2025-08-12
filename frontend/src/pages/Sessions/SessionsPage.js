import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

function Sessions() {
    const { t } = useTranslation();
    const [sessions, setSessions] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [date, setDate] = useState('');
    const [durationMin, setDurationMin] = useState('');
    const [routineId, setRoutineId] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const [sessionsRes, routinesRes] = await Promise.all([
                    api.get('/sessions'),
                    api.get('/routines'),
                ]);
                setSessions(sessionsRes.data);
                setRoutines(routinesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const addSession = async (event) => {
        event.preventDefault();
        try {
            const { data: created } = await api.post('/sessions', {
                date,
                duration_min: parseInt(durationMin, 10),
            });
            setSessions([created, ...sessions]);
            if (routineId) {
                await api.post(`/sessions/${created.id}/routines`, { routine_id: routineId });
            }
            setDate('');
            setDurationMin('');
            setRoutineId('');
        } catch (error) {
            console.error('Error adding session:', error);
        }
    };

    const fmtRoutine = (id) => routines.find(r => r.id === id)?.name || '—';

    return (
        <div>
            <h1>{t('sessionsP.reg_sessions')}</h1>
            <form onSubmit={addSession}>
                <label>
                    {t('glob.date')}:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </label>
                <label>
                    {t('glob.duration')} (min):
                    <input type="number" min="0" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} required />
                </label>
                <label>
                    {t('sessionsP.sel_rutina')}:
                    <select value={routineId} onChange={(e) => setRoutineId(e.target.value)}>
                        <option value="">Select a routine</option>
                        {routines?.map(routine => (
                            <option key={routine.id} value={routine.id}>{routine.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Register Session</button>
            </form>
            <ul>
                {sessions?.map(session => (
                    <li key={session.id}>
                        <h3>{`Session on ${session.date} - Duration: ${session.duration_min} min`}</h3>
                        <p>
                          Routines: {/* list joined routines if any */}
                          {/* This is a simple placeholder; for full details, fetch /sessions/{id}/routines per item */}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sessions;
