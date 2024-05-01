import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sessions({ routines = [], userId }) { // Default routines to an empty array if not provided
    const [sessions, setSessions] = useState([]);
    const [newSession, setNewSession] = useState({
        sessionId: Date.now(), // A unique provisional identifier using the timestamp
        date: '',
        duration: '',
        routineId: '',
        userId: userId, // Assuming the user ID is passed as a prop
        comments: []
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewSession({ ...newSession, [name]: value });
    };

    const handleSelectRoutine = (routineId) => {
        setNewSession({ ...newSession, routineId });
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
            <h1>Registro de Sesiones de Ejercicio</h1>
            <form onSubmit={addSession}>
                <label>
                    Fecha:
                    <input type="date" name="date" value={newSession.date} onChange={handleChange} required />
                </label>
                <label>
                    Duración (en minutos):
                    <input type="number" name="duration" value={newSession.duration} onChange={handleChange} required />
                </label>
                <label>
                    Seleccionar Rutina:
                    <select name="routineId" value={newSession.routineId} onChange={handleChange}>
                        <option value="">Seleccione una Rutina</option>
                        {routines.map(routine => (
                            <option key={routine.id} value={routine.id}>{routine.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Registrar Sesión</button>
            </form>
            <ul>
                {sessions.map(session => (
                    <li key={session.sessionId}>
                        <h3>{`Sesión del ${session.date} - Duración: ${session.duration} minutos`}</h3>
                        <p>Rutina: {routines.find(r => r.id === session.routineId)?.name || 'No especificada'}</p>
                        <details>
                            <summary>Comentarios</summary>
                            <ul>
                                {session.comments.map((comment, index) => <li key={index}>{comment}</li>)}
                                <li>
                                    <input
                                        type="text"
                                        placeholder="Añadir comentario"
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
