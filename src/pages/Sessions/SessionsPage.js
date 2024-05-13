import React, { useState } from 'react';
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewSession({ ...newSession, [name]: value });
    };

    const addSession = (event) => {
        event.preventDefault();
        setSessions([...sessions, newSession]);
        setNewSession({ sessionId: Date.now(), date: '', duration: '', routineId: '', userId: userId, comments: [] });
    };

    const addComment = (sessionId, comment) => {
        const updatedSessions = sessions.map(session => {
            if (session.sessionId === sessionId) {
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
                    <input type="number" name="duration" value={newSession.duration} onChange={handleChange} required />
                </label>
                <label>
                {t('sessionsP.sel_rutina')}:
                    <select name="routineId" value={newSession.routineId} onChange={handleChange}>
                        <option value="">{t('sessionsP.sel_rutina2')}</option>
                        {routines.map(routine => (
                            <option key={routine.id} value={routine.id}>{routine.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">{t('sessionsP.reg_session')}</button>
            </form>
            <ul>
                {sessions.map(session => (
                    <li key={session.sessionId}>
                        <h3>{`Sesión del ${session.date} - Duración: ${session.duration} minutos`}</h3>
                        <p>{t('sessionsP.routine')}: {routines.find(r => r.id === session.routineId)?.name || 'No especificada'}</p>
                        <details>
                            <summary>{t('glob.comments')}</summary>
                            <ul>
                                {session.comments.map((comment, index) => <li key={index}>{comment}</li>)}
                                <li>
                                    <input
                                        type="text"
                                        placeholder={t('glob.add_comment')}
                                        onKeyDown={event => event.key === 'Enter' && addComment(session.sessionId, event.target.value)}
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
