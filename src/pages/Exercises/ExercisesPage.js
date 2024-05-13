import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Exercises() {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: '', category: '', description: '' });

  const handleExerciseChange = (event) => {
    const { name, value } = event.target;
    setNewExercise(prev => ({ ...prev, [name]: value }));
  };

  const addExercise = (event) => {
    event.preventDefault();
    setExercises([...exercises, newExercise]);
    setNewExercise({ name: '', category: '', description: '' });
  };

  const deleteExercise = (index) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  return (
    <div>
      <h1>{t('exercisesP.g_exercises')}</h1>
      <h2>{t('exercisesP.add_new_exercise')}</h2>
      <form onSubmit={addExercise}>
        <input type="text" name="name" value={newExercise.name} onChange={handleExerciseChange} placeholder="Nombre del Ejercicio" />
        <textarea name="description" value={newExercise.description} onChange={handleExerciseChange} placeholder="Descripción"></textarea>
        <button type="submit">{t('exercisesP.add_exercise')}</button>
      </form>
      <h2>{t('exercisesP.list_exercises')}</h2>
      <ul>
        {exercises.map((exercise, index) => (
          <li key={index}>
            <strong>{exercise.name}</strong> - {exercise.category}
            <p>{exercise.description}</p>
            <button onClick={() => deleteExercise(index)}>{t('glob.delete')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Exercises;
