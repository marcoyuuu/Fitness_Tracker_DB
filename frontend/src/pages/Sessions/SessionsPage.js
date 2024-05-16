import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Sessions({ userId }) {
    const { t } = useTranslation();
    const [sessions, setSessions] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [newSession, setNewSession] = useState({
        sessionId: Date.now(),
        date: '',
        duration: '',
        routineId: '',
        userId: userId,
        comments: []
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [sessionsResponse, routinesResponse] = await Promise.all([
                    axios.get('http://localhost/react_php_app/api.php?table=sesión'),
                    axios.get('http://localhost/react_php_app/api.php?table=rutina')
                ]);

                console.log('Sessions:', sessionsResponse.data); // Debugging log
                console.log('Routines:', routinesResponse.data); // Debugging log

                if (Array.isArray(sessionsResponse.data)) {
                    setSessions(sessionsResponse.data);
                } else {
                    console.error('Sessions data is not an array:', sessionsResponse.data);
                }

                if (Array.isArray(routinesResponse.data)) {
                    setRoutines(routinesResponse.data);
                } else {
                    console.error('Routines data is not an array:', routinesResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewSession({ ...newSession, [name]: value });
    };

    const addSession = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost/react_php_app/api.php?table=sesión', newSession);
            if (response.data && response.data.id) {
                setSessions([...sessions, { ...newSession, SesiónID: response.data.id }]);
                setNewSession({ sessionId: Date.now(), date: '', duration: '', routineId: '', comments: [] });
            } else {
                console.error('Failed to add session:', response.data);
            }
        } catch (error) {
            console.error('Error adding session:', error);
        }
    };

    return (
        <div>
            <h1>{t('sessionsP.reg_sessions')}</h1>
            <form onSubmit={addSession}>
                <label>
                    {t('glob.date')}:
                    <input type="date" name="date" value={newSession.date} onChange={handleChange} required />
                </label>
                <label>
                    {t('glob.duration')}:
                    <input type="time" name="duration" value={newSession.duration} onChange={handleChange} required />
                </label>
                <label>
                    {t('sessionsP.sel_rutina')}:
                    <select name="routineId" value={newSession.routineId} onChange={handleChange}>
                        <option value="">Select a routine</option>
                        {routines?.map(routine => (
                            <option key={routine.RutinaID} value={routine.RutinaID}>{routine.Nombre}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Register Session</button>
            </form>
            <ul>
                {sessions?.map(session => (
                    <li key={session.SesiónID}>
                        <h3>{`Session on ${session.date} - Duration: ${session.duration}`}</h3>
                        <p>{`Routine: ${routines.find(r => r.RutinaID === session.RutinaID)?.Nombre || 'Not specified'}`}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sessions;
