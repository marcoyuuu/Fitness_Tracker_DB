import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Exercises() {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({
    Nombre: '',
    Descripción: '',
    Sets: '',
    Repeticiones: '',
    Peso: '',
    Equipamiento: '',
    Duración: '',
    Distancia: '',
    TipoEstiramiento: '',
    isEntrenamientoDeFuerza: 0,
    isCardio_Circuitos: 0,
    isCore_Estabilidad: 0,
    isPliométricos: 0,
    isFlexibilidad_Movilidad: 0
  });
  const [editing, setEditing] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);

  const categories = [
    { label: 'Cardio y Circuitos', value: 'isCardio_Circuitos', attributes: ['Duración', 'Distancia'] },
    { label: 'Entrenamiento de Fuerza', value: 'isEntrenamientoDeFuerza', attributes: ['Peso', 'Equipamiento'] },
    { label: 'Flexibilidad y Movilidad', value: 'isFlexibilidad_Movilidad', attributes: ['Duración', 'TipoEstiramiento'] },
    { label: 'Core y Estabilidad', value: 'isCore_Estabilidad', attributes: ['Equipamiento'] },
    { label: 'Pliométricos', value: 'isPliométricos', attributes: ['Equipamiento', 'Peso'] }
  ];

  useEffect(() => {
    axios.get('http://localhost/react_php_app/api.php?table=ejercicio')
      .then(response => {
        const exercisesWithCategory = response.data.map(exercise => {
          // Adjust the condition to check for the string '1' instead of numerical 1
          const categoryKey = Object.keys(exercise).find(key => exercise[key] === "1" && key.startsWith('is'));
          return { ...exercise, category: categoryKey || '' }; // Default to empty string if no category matches
        });
        setExercises(exercisesWithCategory);
      })
      .catch(error => {
        console.error('Error fetching exercises:', error);
      });
  }, []);

  const handleExerciseChange = (event) => {
    const { name, value } = event.target;
    setNewExercise(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    const resetExercise = {
      ...newExercise,
      Sets: '',
      Repeticiones: '',
      Peso: '',
      Equipamiento: '',
      Duración: '',
      Distancia: '',
      TipoEstiramiento: '',
      isEntrenamientoDeFuerza: 0,
      isCardio_Circuitos: 0,
      isCore_Estabilidad: 0,
      isPliométricos: 0,
      isFlexibilidad_Movilidad: 0,
      category: value  // Explicitly setting the category
    };

    resetExercise[value] = 1;  // Activate the selected category

    const categoryAttributes = getCategoryAttributes(value);
    categoryAttributes.forEach(attr => {
      resetExercise[attr] = newExercise[attr];
    });

    setNewExercise(resetExercise);
  };



  const addExercise = (event) => {
    event.preventDefault();
    axios.post('http://localhost/react_php_app/api.php?table=ejercicio', newExercise)
      .then(response => {
        const addedExercise = { ...newExercise, EjercicioID: response.data.id };
        console.log('Added exercise:', addedExercise);
        setExercises(prev => [...prev, addedExercise]);
        resetForm();
      })
      .catch(error => {
        console.error('Error adding exercise:', error);
      });
  };

  const deleteExercise = (id) => {
    const confirmDelete = window.confirm(t('glob.delete?'));
    if (confirmDelete) {
      console.log(`Attempting to delete exercise with ID: ${id}`);
      axios.delete(`http://localhost/react_php_app/api.php?table=ejercicio&id=${id}`)
        .then(response => {
          console.log(`Successfully deleted exercise with ID: ${id}`);
          setExercises(prev => prev.filter(exercise => exercise.EjercicioID !== id));
        })
        .catch(error => {
          console.error(`Error deleting exercise with ID: ${id}`, error);
        });
    }
  };

  const editExercise = (exercise) => {
    setEditing(true);
    setCurrentExercise(exercise);
    setNewExercise({
      ...exercise,
      category: Object.keys(exercise).find(key => exercise[key] === 1 && key.startsWith('is')) // Setting the category
    });
  };


  const updateExercise = (event) => {
    event.preventDefault();
    axios.put(`http://localhost/react_php_app/api.php?table=ejercicio&id=${currentExercise.EjercicioID}`, newExercise)
      .then(response => {
        const updatedExercises = exercises.map(ex => (ex.EjercicioID === currentExercise.EjercicioID ? { ...newExercise, EjercicioID: currentExercise.EjercicioID } : ex));
        setExercises(updatedExercises);
        resetForm();
        setEditing(false);
        setCurrentExercise(null);
      })
      .catch(error => {
        console.error('Error updating exercise:', error);
      });
  };

  const resetForm = () => {
    setNewExercise({
      Nombre: '',
      Descripción: '',
      Sets: '',
      Repeticiones: '',
      Peso: '',
      Equipamiento: '',
      Duración: '',
      Distancia: '',
      TipoEstiramiento: '',
      isEntrenamientoDeFuerza: 0,
      isCardio_Circuitos: 0,
      isCore_Estabilidad: 0,
      isPliométricos: 0,
      isFlexibilidad_Movilidad: 0
    });
  };

  const getCategoryAttributes = (category) => {
    const selectedCategory = categories.find(cat => cat.value === category);
    return selectedCategory ? selectedCategory.attributes : [];
  };

  const selectedCategory = Object.keys(newExercise).find(key => newExercise[key] === 1);

  return (
    <div>
      <h1>{t('exercisesP.g_exercises')}</h1>
      <h2>{editing ? t('exercisesP.update_exercise') : t('exercisesP.add_new_exercise')}</h2>
      <form onSubmit={editing ? updateExercise : addExercise}>
        <input
          type="text"
          name="Nombre"
          value={newExercise.Nombre}
          onChange={handleExerciseChange}
          placeholder={t('exercisesP.n_exercises')}
        />
        <select name="category" value={newExercise.category || ''} onChange={handleCategoryChange}>
          <option value="">{t('exercisesP.select_category')}</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <textarea
          name="Descripción"
          value={newExercise.Descripción}
          onChange={handleExerciseChange}
          placeholder="Descripción"
        />
        <input
          type="number"
          name="Sets"
          value={newExercise.Sets}
          onChange={handleExerciseChange}
          placeholder="Sets"
        />
        <input
          type="number"
          name="Repeticiones"
          value={newExercise.Repeticiones}
          onChange={handleExerciseChange}
          placeholder="Repeticiones"
        />
        {getCategoryAttributes(selectedCategory).includes('Peso') && (
          <input
            type="number"
            name="Peso"
            value={newExercise.Peso}
            onChange={handleExerciseChange}
            placeholder="Peso (lbs)"
          />
        )}
        {getCategoryAttributes(selectedCategory).includes('Equipamiento') && (
          <input
            type="text"
            name="Equipamiento"
            value={newExercise.Equipamiento}
            onChange={handleExerciseChange}
            placeholder="Equipamiento"
          />
        )}
        {getCategoryAttributes(selectedCategory).includes('Duración') && (
          <input
            type="time"
            name="Duración"
            value={newExercise.Duración}
            onChange={handleExerciseChange}
            placeholder="Duración"
          />
        )}
        {getCategoryAttributes(selectedCategory).includes('Distancia') && (
          <input
            type="number"
            name="Distancia"
            value={newExercise.Distancia}
            onChange={handleExerciseChange}
            placeholder="Distancia (miles)"
          />
        )}
        {getCategoryAttributes(selectedCategory).includes('TipoEstiramiento') && (
          <select name="TipoEstiramiento" value={newExercise.TipoEstiramiento} onChange={handleExerciseChange}>
            <option value="">{t('exercisesP.select_stretch_type')}</option>
            <option value="static">Static</option>
            <option value="active">Active</option>
            <option value="ballistic">Ballistic</option>
          </select>
        )}
        <button type="submit">{editing ? t('exercisesP.update_exercise') : t('exercisesP.add_exercise')}</button>
        {editing && <button type="button" onClick={resetForm}>{t('glob.cancel')}</button>}
      </form>
      <h2>{t('exercisesP.list_exercises')}</h2>
      <ul>
        {exercises.map((exercise) => {
          const categoryLabel = categories.find(cat => cat.value === exercise.category)?.label || 'Unknown';
          return (
            <li key={exercise.EjercicioID}>
              <strong>{exercise.Nombre}</strong> - {categoryLabel}
              <p>{exercise.Descripción}</p>
              {(exercise.Sets && exercise.Sets !== "0") && <p>{exercise.Sets} sets</p>}
              {(exercise.Repeticiones && exercise.Repeticiones !== "0") && <p>{exercise.Repeticiones} reps</p>}
              {exercise.Peso && <p>Peso: {exercise.Peso} lbs</p>}
              {exercise.Equipamiento && <p>Equipamiento: {exercise.Equipamiento}</p>}
              {exercise.Duración && <p>Duración: {exercise.Duración}</p>}
              {exercise.Distancia && <p>Distancia: {exercise.Distancia} miles</p>}
              {exercise.TipoEstiramiento && <p>TipoEstiramiento: {exercise.TipoEstiramiento}</p>}
              <button onClick={() => deleteExercise(exercise.EjercicioID)}>Eliminar</button>
              <button onClick={() => editExercise(exercise)}>Editar</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Exercises;
