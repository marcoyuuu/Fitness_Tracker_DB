import React, { useState } from 'react';

function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: '', category: '', description: '' });
  const [newCategory, setNewCategory] = useState('');

  const handleExerciseChange = (event) => {
    const { name, value } = event.target;
    setNewExercise(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (event) => {
    setNewCategory(event.target.value);
  };

  const addExercise = (event) => {
    event.preventDefault();
    setExercises([...exercises, newExercise]);
    setNewExercise({ name: '', category: '', description: '' });
  };

  const addCategory = (event) => {
    event.preventDefault();
    setCategories([...categories, newCategory]);
    setNewCategory('');
  };

  const deleteExercise = (index) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  return (
    <div>
      <h1>Gestión de Ejercicios</h1>
      <h2>Añadir Nueva Categoría</h2>
      <form onSubmit={addCategory}>
        <input type="text" value={newCategory} onChange={handleCategoryChange} placeholder="Nueva Categoría" />
        <button type="submit">Añadir Categoría</button>
      </form>
      <h2>Añadir Nuevo Ejercicio</h2>
      <form onSubmit={addExercise}>
        <input type="text" name="name" value={newExercise.name} onChange={handleExerciseChange} placeholder="Nombre del Ejercicio" />
        <select name="category" value={newExercise.category} onChange={handleExerciseChange}>
          <option value="">Seleccione una Categoría</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <textarea name="description" value={newExercise.description} onChange={handleExerciseChange} placeholder="Descripción"></textarea>
        <button type="submit">Añadir Ejercicio</button>
      </form>
      <h2>Lista de Ejercicios</h2>
      <ul>
        {exercises.map((exercise, index) => (
          <li key={index}>
            <strong>{exercise.name}</strong> - {exercise.category}
            <p>{exercise.description}</p>
            <button onClick={() => deleteExercise(index)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExercisesPage;
