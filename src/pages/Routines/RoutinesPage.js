import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function Routines() {
    const { t } = useTranslation();
    const navigate  = useNavigate();
    const exercises = [
        { id: 1, name: 'Correr 5km', type: 'Cardio' },
        { id: 2, name: 'Sentadillas', type: 'Fuerza' },
        { id: 3, name: 'Pesas', type: 'Fuerza' }
    ];  // Usar directamente si no pasas como prop

    const [routines, setRoutines] = useState([]);
    const [newRoutine, setNewRoutine] = useState({ name: '', exercises: [], comments: [] });
    const [selectedExercises, setSelectedExercises] = useState([]);

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

    const addRoutine = (event) => {
        event.preventDefault();
        const routineExercises = exercises.filter(exercise => selectedExercises.includes(exercise.id));
        setRoutines([...routines, { ...newRoutine, exercises: routineExercises, comments: [] }]);
        setNewRoutine({ name: '', exercises: [], comments: [] });
        setSelectedExercises([]);
    };

    const navigateToExercises = () => {
        navigate('/exercises');
    };

    return (
        <div>
            <h1>{t('routinesP.g_routines')}</h1>
            <form onSubmit={addRoutine}>
                <label>
                {t('routinesP.n_routines')}:
                    <input type="text" name="name" value={newRoutine.name} onChange={handleRoutineChange} required />
                </label>
                <fieldset>
                    <legend>{t('routinesP.sel_exercises')}:</legend>
                    {exercises.map(exercise => (
                        <div key={exercise.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedExercises.includes(exercise.id)}
                                    onChange={() => handleSelectExercise(exercise.id)}
                                />
                                {exercise.name}
                            </label>
                        </div>
                    ))}
                    <button type="button" onClick={navigateToExercises}>{t('routinesP.c_exercises')}</button>                    
                </fieldset>
                <button type="submit">{t('routinesP.c_routine')}</button>
            </form>
            <ul>
                {routines.map((routine, index) => (
                    <li key={index}>
                        <h3>{routine.name}</h3>
                        <p>{t('nav.exercises')}: {routine.exercises.map(e => e.name).join(', ')}</p>
                    </li>
                ))}
            </ul>
        </div>
    );    
}

export default Routines;
