import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

function Routines() {
    const { t } = useTranslation();
    const [exercises, setExercises] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [newRoutine, setNewRoutine] = useState({ Nombre: '', Descripción: '' });
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [exRes, rtRes] = await Promise.all([
                    api.get('/exercises'),
                    api.get('/routines'),
                ]);
                setExercises(exRes.data);
                setRoutines(rtRes.data.map(r => ({ ...r, exercises: [] })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleRoutineChange = (event) => {
        const { name, value } = event.target;
        setNewRoutine(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectExercise = (exerciseId) => {
        const alreadySelected = selectedExercises.includes(exerciseId);
        if (!alreadySelected) {
            setSelectedExercises([...selectedExercises, exerciseId]);
        } else {
            setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
        }
    };

    const addRoutine = async (event) => {
        event.preventDefault();
        try {
            const { data: rt } = await api.post('/routines', {
                name: newRoutine.Nombre,
                description: newRoutine.Descripción,
            });

            for (const exId of selectedExercises) {
                await api.post(`/routines/${rt.id}/exercises`, { exercise_id: exId });
            }

            const addedRoutine = {
                id: rt.id,
                Nombre: newRoutine.Nombre,
                Descripción: newRoutine.Descripción,
                exercises: exercises.filter(ex => selectedExercises.includes(ex.id)),
            };
            setRoutines([...routines, addedRoutine]);
            resetForm();
        } catch (error) {
            console.error('Error adding routine:', error);
        }
    };

    const updateRoutine = async (event) => {
        event.preventDefault();
        try {
            const rtId = newRoutine.RutinaID || newRoutine.id;
            await api.patch(`/routines/${rtId}`, {
                name: newRoutine.Nombre,
                description: newRoutine.Descripción,
            });
            // Note: updating exercise links could be added here as needed
            const updatedRoutines = routines.map(routine =>
                (routine.RutinaID || routine.id) === rtId ? { ...routine, Nombre: newRoutine.Nombre, Descripción: newRoutine.Descripción } : routine
            );
            setRoutines(updatedRoutines);
            resetForm();
        } catch (error) {
            console.error('Error updating routine:', error);
        }
    };

    const deleteRoutine = async (routineId) => {
        try {
            await api.delete(`/routines/${routineId}`);
            setRoutines(routines.filter(routine => (routine.RutinaID || routine.id) !== routineId));
        } catch (error) {
            console.error('Error deleting routine:', error);
        }
    };

    const editRoutine = (routine) => {
        setNewRoutine(routine);
        setSelectedExercises(routine.exercises.map(ex => ex.EjercicioID));
        setIsEditing(true);
    };

    const resetForm = () => {
        setNewRoutine({ Nombre: '', Descripción: '' });
        setSelectedExercises([]);
        setIsEditing(false);
    };

    return (
        <div>
            <h1>{t('routinesP.g_routines')}</h1>
            <form onSubmit={isEditing ? updateRoutine : addRoutine}>
                <label>
                    {t('routinesP.n_routines')}:
                    <input type="text" name="Nombre" value={newRoutine.Nombre} onChange={handleRoutineChange} required />
                </label>
                <textarea
                    name="Descripción"
                    value={newRoutine.Descripción}
                    onChange={handleRoutineChange}
                    placeholder={t('routinesP.description')}
                />
                <fieldset>
                    <legend>{t('routinesP.sel_exercises')}:</legend>
                    {exercises.map(exercise => (
                        <div key={exercise.id || exercise.EjercicioID}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedExercises.includes(exercise.id || exercise.EjercicioID)}
                                    onChange={() => handleSelectExercise(exercise.id || exercise.EjercicioID)}
                                />
                                {exercise.name || exercise.Nombre}
                            </label>
                        </div>
                    ))}
                </fieldset>
                <button type="submit">{isEditing ? t('routinesP.update_routine') : t('routinesP.c_routine')}</button>
                {isEditing && <button type="button" onClick={resetForm}>{t('glob.cancel')}</button>}
            </form>
            <h2>{t('routinesP.list_routines')}</h2>
            <ul>
                {routines.map((routine) => (
                    <li key={routine.RutinaID || routine.id}>
                        <h3>{routine.Nombre || routine.name}</h3>
                        <p>{t('nav.exercises')}: {(routine.exercises || []).map(ex => ex.name || ex.Nombre).join(', ')}</p>
                        <p>{routine.Descripción || routine.description}</p>
                        <button onClick={() => editRoutine(routine)}>Edit</button>
                        <button onClick={() => deleteRoutine(routine.RutinaID || routine.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Routines;
