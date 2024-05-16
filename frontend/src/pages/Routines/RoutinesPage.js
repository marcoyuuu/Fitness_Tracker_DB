import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
                const exResponse = await axios.get('http://localhost/react_php_app/api.php?table=ejercicio');
                setExercises(exResponse.data);

                const rtResponse = await axios.get('http://localhost/react_php_app/api.php?table=rutina');
                const relResponse = await axios.get('http://localhost/react_php_app/api.php?table=rutinacontieneejercicio');
                const combinedRoutines = rtResponse.data.map(routine => ({
                    ...routine,
                    exercises: relResponse.data.filter(rel => rel.RutinaID === routine.RutinaID)
                        .map(rel => exResponse.data.find(ex => ex.EjercicioID === rel.EjercicioID))
                        .filter(ex => ex) // Filter out any undefined or null exercises
                }));
                setRoutines(combinedRoutines);
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
        const routineData = {
            Nombre: newRoutine.Nombre,
            Descripción: newRoutine.Descripción,
        };

        try {
            const response = await axios.post('http://localhost/react_php_app/api.php?table=rutina', routineData);
            const newRoutineId = response.data.id;

            // Prepare relationships data
            const relations = selectedExercises.map(exerciseId => ({
                RutinaID: newRoutineId,
                EjercicioID: exerciseId
            }));

            console.log('Sending relationship data:', relations);

            // Assuming your backend can handle batch processing of relations
            const relResponse = await axios.post('http://localhost/react_php_app/api.php?table=rutinacontieneejercicio', { relations });
            console.log('Relationships response:', relResponse.data);

            // Update local state to reflect the new routine
            const addedRoutine = {
                ...routineData,
                RutinaID: newRoutineId,
                exercises: exercises.filter(ex => selectedExercises.includes(ex.EjercicioID))
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
            await axios.put(`http://localhost/react_php_app/api.php?table=rutina&id=${newRoutine.RutinaID}`, {
                ...newRoutine,
                exercises: selectedExercises
            });
            const updatedRoutines = routines.map(routine =>
                routine.RutinaID === newRoutine.RutinaID ? { ...newRoutine, exercises: exercises.filter(ex => selectedExercises.includes(ex.EjercicioID)) } : routine
            );
            setRoutines(updatedRoutines);
            resetForm();
        } catch (error) {
            console.error('Error updating routine:', error);
        }
    };

    const deleteRoutine = async (routineId) => {
        try {
            await axios.delete(`http://localhost/react_php_app/api.php?table=rutina&id=${routineId}`);
            setRoutines(routines.filter(routine => routine.RutinaID !== routineId));
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
                        <div key={exercise.EjercicioID}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedExercises.includes(exercise.EjercicioID)}
                                    onChange={() => handleSelectExercise(exercise.EjercicioID)}
                                />
                                {exercise.Nombre}
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
                    <li key={routine.RutinaID}>
                        <h3>{routine.Nombre}</h3>
                        <p>{t('nav.exercises')}: {routine.exercises.map(ex => ex.Nombre).join(', ')}</p>
                        <p>{routine.Descripción}</p>
                        <button onClick={() => editRoutine(routine)}>Edit</button>
                        <button onClick={() => deleteRoutine(routine.RutinaID)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Routines;
