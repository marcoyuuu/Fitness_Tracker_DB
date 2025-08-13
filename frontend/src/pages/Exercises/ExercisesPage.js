import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

function Exercises() {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState(null);

  const categories = [
    { label: 'Cardio y Circuitos', value: 'is_cardio', attributes: ['duration', 'distance'] },
    { label: 'Entrenamiento de Fuerza', value: 'is_strength', attributes: ['weight', 'equipment'] },
    { label: 'Flexibilidad y Movilidad', value: 'is_flexibility', attributes: ['duration', 'stretch_type'] },
    { label: 'Core y Estabilidad', value: 'is_core', attributes: ['equipment'] },
    { label: 'Pliométricos', value: 'is_plyo', attributes: ['equipment', 'weight'] }
  ];

  const emptyForm = {
    name: '',
    description: '',
    sets: '',
    reps: '',
    weight: '',
    equipment: '',
    duration: '',
    distance: '',
    stretch_type: '',
    is_strength: false,
    is_cardio: false,
    is_core: false,
    is_plyo: false,
    is_flexibility: false,
    category: ''
  };
  const [form, setForm] = useState(emptyForm);

  // Helpers
  const pickCategoryValue = (ex) => {
    const order = ['is_cardio', 'is_strength', 'is_flexibility', 'is_core', 'is_plyo'];
    return order.find(key => !!ex[key]) || '';
  };

  const hhmmToTime = (val) => {
    if (!val) return null;
    // Accept HH:MM or HH:MM:SS; normalize to HH:MM:SS for backend
    if (/^\d{2}:\d{2}$/.test(val)) return `${val}:00`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(val)) return val;
    return null;
  };

  const timeToHHMM = (val) => {
    if (!val) return '';
    const m = String(val).match(/^(\d{2}:\d{2})(?::\d{2})?$/);
    return m ? m[1] : '';
  };

  const toNumberOrNull = (v) => {
    if (v === '' || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  // Load
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/exercises');
        const mapped = (data || []).map(ex => ({
          ...ex,
          category: pickCategoryValue(ex),
        }));
        setExercises(mapped);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      }
    };
    load();
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target; // one of is_cardio|is_strength|...
    setForm(prev => ({
      ...prev,
      is_cardio: false,
      is_strength: false,
      is_flexibility: false,
      is_core: false,
      is_plyo: false,
      [value]: true,
      category: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(false);
    setCurrentExerciseId(null);
  };

  const addExercise = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        sets: toNumberOrNull(form.sets),
        reps: toNumberOrNull(form.reps),
        weight: form.weight === '' ? null : Number(form.weight),
        equipment: form.equipment || null,
        duration: hhmmToTime(form.duration),
        distance: form.distance === '' ? null : Number(form.distance),
        stretch_type: form.stretch_type || null,
        is_strength: !!form.is_strength,
        is_cardio: !!form.is_cardio,
        is_core: !!form.is_core,
        is_plyo: !!form.is_plyo,
        is_flexibility: !!form.is_flexibility,
      };
      const { data } = await api.post('/exercises', payload);
      const added = { ...data, category: pickCategoryValue(data) };
      setExercises(prev => [...prev, added]);
      resetForm();
    } catch (err) {
      console.error('Error adding exercise:', err);
    }
  };

  const deleteExercise = async (id) => {
    const confirmDelete = window.confirm(t('glob.delete?'));
    if (!confirmDelete) return;
    try {
      await api.delete(`/exercises/${id}`);
      setExercises(prev => prev.filter(ex => (ex.id || ex.EjercicioID) !== id));
    } catch (err) {
      console.error('Error deleting exercise:', err);
    }
  };

  const editExercise = (exercise) => {
    setEditing(true);
    setCurrentExerciseId(exercise.id || exercise.EjercicioID);
    setForm({
      name: exercise.name || exercise.Nombre || '',
      description: exercise.description || exercise.Descripción || '',
      sets: exercise.sets || exercise.Sets || '',
      reps: exercise.reps || exercise.Repeticiones || '',
      weight: exercise.weight || exercise.Peso || '',
      equipment: exercise.equipment || exercise.Equipamiento || '',
      duration: timeToHHMM(exercise.duration || exercise.Duración || ''),
      distance: exercise.distance || exercise.Distancia || '',
      stretch_type: exercise.stretch_type || exercise.TipoEstiramiento || '',
      is_strength: !!(exercise.is_strength || exercise.isEntrenamientoDeFuerza),
      is_cardio: !!(exercise.is_cardio || exercise.isCardio_Circuitos),
      is_core: !!(exercise.is_core || exercise.isCore_Estabilidad),
      is_plyo: !!(exercise.is_plyo || exercise.isPliométricos),
      is_flexibility: !!(exercise.is_flexibility || exercise.isFlexibilidad_Movilidad),
      category: pickCategoryValue(exercise),
    });
  };

  const updateExercise = async (e) => {
    e.preventDefault();
    if (!currentExerciseId) return;
    try {
      const payload = {
        name: form.name,
        description: form.description,
        sets: toNumberOrNull(form.sets),
        reps: toNumberOrNull(form.reps),
        weight: form.weight === '' ? null : Number(form.weight),
        equipment: form.equipment || null,
        duration: hhmmToTime(form.duration),
        distance: form.distance === '' ? null : Number(form.distance),
        stretch_type: form.stretch_type || null,
        is_strength: !!form.is_strength,
        is_cardio: !!form.is_cardio,
        is_core: !!form.is_core,
        is_plyo: !!form.is_plyo,
        is_flexibility: !!form.is_flexibility,
      };
      const { data } = await api.patch(`/exercises/${currentExerciseId}`, payload);
      const updated = { ...data, category: pickCategoryValue(data) };
      setExercises(prev => prev.map(ex => (ex.id === currentExerciseId || ex.EjercicioID === currentExerciseId ? updated : ex)));
      resetForm();
    } catch (err) {
      console.error('Error updating exercise:', err);
    }
  };

  const getCategoryAttributes = (category) => {
    const selectedCategory = categories.find(cat => cat.value === category);
    return selectedCategory ? selectedCategory.attributes : [];
  };

  const selectedCategory = form.category;

  return (
    <div>
      <h1>{t('exercisesP.g_exercises')}</h1>
      <h2>{editing ? t('exercisesP.update_exercise') : t('exercisesP.add_new_exercise')}</h2>
      <form onSubmit={editing ? updateExercise : addExercise}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t('exercisesP.n_exercises')}
        />
        <select name="category" value={form.category || ''} onChange={handleCategoryChange}>
          <option value="">{t('exercisesP.select_category')}</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
        />
        <input
          type="number"
          name="sets"
          value={form.sets}
          onChange={handleChange}
          placeholder="Sets"
        />
        <input
          type="number"
          name="reps"
          value={form.reps}
          onChange={handleChange}
          placeholder="Repeticiones"
        />
        {getCategoryAttributes(selectedCategory).includes('weight') && (
          <input
            type="number"
            step="0.01"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Peso (lbs)"
          />
        )}
        {getCategoryAttributes(selectedCategory).includes('equipment') && (
          <input
            type="text"
            name="equipment"
            value={form.equipment}
            onChange={handleChange}
            placeholder="Equipamiento"
          />
        )}
        {getCategoryAttributes(selectedCategory).includes('duration') && (
          <input
            type="time"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="Duración"
          />
        )}
        {getCategoryAttributes(selectedCategory).includes('distance') && (
          <input
            type="number"
            step="0.01"
            name="distance"
            value={form.distance}
            onChange={handleChange}
            placeholder="Distancia (miles)"
          />
        )}
        {getCategoryAttributes(selectedCategory).includes('stretch_type') && (
          <select name="stretch_type" value={form.stretch_type} onChange={handleChange}>
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
            <li key={exercise.id || exercise.EjercicioID}>
              <strong>{exercise.name || exercise.Nombre}</strong> - {categoryLabel}
              <p>{exercise.description || exercise.Descripción}</p>
              {(exercise.sets && String(exercise.sets) !== '0') && <p>{exercise.sets} sets</p>}
              {(exercise.reps && String(exercise.reps) !== '0') && <p>{exercise.reps} reps</p>}
              {exercise.weight && <p>Peso: {exercise.weight} lbs</p>}
              {exercise.equipment && <p>Equipamiento: {exercise.equipment}</p>}
              {(exercise.duration || exercise.Duración) && <p>Duración: {timeToHHMM(exercise.duration || exercise.Duración)}</p>}
              {exercise.distance && <p>Distancia: {exercise.distance} miles</p>}
              {(exercise.stretch_type || exercise.TipoEstiramiento) && <p>TipoEstiramiento: {exercise.stretch_type || exercise.TipoEstiramiento}</p>}
              <button onClick={() => deleteExercise(exercise.id || exercise.EjercicioID)}>{t('glob.delete')}</button>
              <button onClick={() => editExercise(exercise)}>{t('glob.edit')}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Exercises;
