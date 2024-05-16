import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Sessions({ routines = [], userId }) { // Default routines to an empty array if not provided
    const { t } = useTranslation();
    const [sessions, setSessions] = useState([]);
    const [newSession, setNewSession] = useState({
        sessionId: Date.now(), // A unique provisional identifier using the timestamp
        date: '',
        duration: '',
        routineId: '',
        userId: userId, // Assuming the user ID is passed as a prop
        comments: []
    });

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('http://localhost/react_php_app/api.php?table=sesión');
                if (Array.isArray(response.data)) {
                    setSessions(response.data);
                } else {
                    console.error('Fetched data is not an array:', response.data);
                    setSessions([]); // Set to empty array if data is not valid
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
                setSessions([]); // Ensure sessions is set to an empty array on error
            }
        };

        fetchSessions();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewSession({ ...newSession, [name]: value });
    };

    const addSession = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost/react_php_app/api.php?table=sesión', newSession);
            if (response.data.id) {  // Make sure that ID is returned and is valid
                const addedSession = { ...newSession, SesiónID: response.data.id };
                setSessions([...sessions, addedSession]);
                setNewSession({ sessionId: Date.now(), date: '', duration: '', routineId: '', userId: userId, comments: [] }); // Reset form
            } else {
                console.error('Error adding session:', response.data);
            }
        } catch (error) {
            console.error('Error adding session:', error);
        }
    };

    const addComment = (sessionId, comment) => {
        const updatedSessions = sessions.map(session => {
            if (session.SesiónID === sessionId) {
                return { ...session, comments: [...session.comments, comment] };
            }
            return session;
        });
        setSessions(updatedSessions);
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
                        <option value="">{t('sessionsP.sel_rutina2')}</option>
                        {routines.map(routine => (
                            <option key={routine.RutinaID} value={routine.RutinaID}>{routine.Nombre}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">{t('sessionsP.reg_session')}</button>
            </form>
            <ul>
                {sessions && sessions.map(session => (
                    <li key={session.SesiónID}>
                        <h3>{`Sesión del ${session.Fecha} - Duración: ${session.Duración}`}</h3>
                        <p>{t('sessionsP.routine')}: {routines.find(r => r.RutinaID === session.RutinaID)?.Nombre || 'No especificada'}</p>
                        <details>
                            <summary>{t('glob.comments')}</summary>
                            <ul>
                                {session.comments && session.comments.map((comment, index) => <li key={index}>{comment}</li>)}
                                <li>
                                    <input
                                        type="text"
                                        placeholder={t('glob.add_comment')}
                                        onKeyDown={event => event.key === 'Enter' && addComment(session.SesiónID, event.target.value)}
                                    />
                                </li>
                            </ul>
                        </details>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sessions;
