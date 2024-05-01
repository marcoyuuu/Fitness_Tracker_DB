import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Routines() {
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
            <h1>Gestión de Rutinas</h1>
            <form onSubmit={addRoutine}>
                <label>
                    Nombre de la Rutina:
                    <input type="text" name="name" value={newRoutine.name} onChange={handleRoutineChange} required />
                </label>
                <fieldset>
                    <legend>Seleccionar Ejercicios:</legend>
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
                    <button type="button" onClick={navigateToExercises}>Crear Nuevo Ejercicio</button>                    
                </fieldset>
                <button type="submit">Crear Rutina</button>
            </form>
            <ul>
                {routines.map((routine, index) => (
                    <li key={index}>
                        <h3>{routine.name}</h3>
                        <p>Ejercicios: {routine.exercises.map(e => e.name).join(', ')}</p>
                    </li>
                ))}
            </ul>
        </div>
    );    
}

export default Routines;
