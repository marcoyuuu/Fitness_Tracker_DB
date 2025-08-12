import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

function Programs() {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [newProgram, setNewProgram] = useState({ Nombre: '', Descripción: '', FechaInicio: '', FechaFin: '' });
  const [selectedRoutines, setSelectedRoutines] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pgRes, rtRes] = await Promise.all([
          api.get('/programs'),
          api.get('/routines'),
        ]);
        // For each program, optionally fetch routines lazily when rendering or on demand.
        setPrograms(pgRes.data.map(p => ({ ...p, routines: [] })));
        setRoutines(rtRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProgramChange = (event) => {
    const { name, value } = event.target;
    setNewProgram(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectRoutine = (routineId) => {
    const alreadySelected = selectedRoutines.includes(routineId);
    if (!alreadySelected) {
      setSelectedRoutines([...selectedRoutines, routineId]);
    } else {
      setSelectedRoutines(selectedRoutines.filter(id => id !== routineId));
    }
  };

  const addProgram = async (event) => {
    event.preventDefault();
    try {
      const { data: created } = await api.post('/programs', {
        name: newProgram.Nombre,
        description: newProgram.Descripción,
        start_date: newProgram.FechaInicio,
        end_date: newProgram.FechaFin || null,
      });
      for (const rtId of selectedRoutines) {
        await api.post(`/programs/${created.id}/routines`, { routine_id: rtId });
      }
      const added = {
        id: created.id,
        Nombre: newProgram.Nombre,
        Descripción: newProgram.Descripción,
        FechaInicio: newProgram.FechaInicio,
        FechaFin: newProgram.FechaFin || '',
        routines: routines.filter(rt => selectedRoutines.includes(rt.id)),
      };
      setPrograms([...programs, added]);
      resetForm();
    } catch (error) {
      console.error('Error adding program:', error);
    }
  };

  const updateProgram = async (event) => {
    event.preventDefault();
    try {
      const id = currentProgram?.ProgramaID || currentProgram?.id;
      await api.patch(`/programs/${id}`, {
        name: newProgram.Nombre,
        description: newProgram.Descripción,
        start_date: newProgram.FechaInicio,
        end_date: newProgram.FechaFin || null,
      });
      const updatedPrograms = programs.map(program =>
        (program.ProgramaID || program.id) === id
          ? {
              ...program,
              Nombre: newProgram.Nombre,
              Descripción: newProgram.Descripción,
              FechaInicio: newProgram.FechaInicio,
              FechaFin: newProgram.FechaFin || '',
            }
          : program
      );
      setPrograms(updatedPrograms);
      resetForm();
    } catch (error) {
      console.error('Error updating program:', error);
    }
  };

  const deleteProgram = async (programId) => {
    try {
      await api.delete(`/programs/${programId}`);
      setPrograms(programs.filter(program => (program.ProgramaID || program.id) !== programId));
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const editProgram = (program) => {
    setNewProgram({
      Nombre: program.Nombre || program.name,
      Descripción: program.Descripción || program.description,
      FechaInicio: (program.FechaInicio || program.start_date || '').split('T')[0],
      FechaFin: (program.FechaFin || program.end_date || '') ? (program.FechaFin || program.end_date).split('T')[0] : ''
    });
    setCurrentProgram(program);
    setSelectedRoutines((program.routines || []).map(rt => rt.id || rt.RutinaID));
    setIsEditing(true);
  };

  const resetForm = () => {
    setNewProgram({ Nombre: '', Descripción: '', FechaInicio: '', FechaFin: '' });
    setSelectedRoutines([]);
    setIsEditing(false);
    setCurrentProgram(null);
  };

  return (
    <div>
      <h1>{t('nav.programs')}</h1>
      <form onSubmit={isEditing ? updateProgram : addProgram}>
        <label>
          {t('programsP.n_program')}:
          <input type="text" name="Nombre" value={newProgram.Nombre} onChange={handleProgramChange} required />
        </label>
        <textarea
          name="Descripción"
          value={newProgram.Descripción}
          onChange={handleProgramChange}
          placeholder={t('programsP.description')}
        />
        <label>
          {t('programsP.start_date')}:
          <input type="date" name="FechaInicio" value={newProgram.FechaInicio} onChange={handleProgramChange} required />
        </label>
        <label>
          {t('programsP.end_date')}:
          <input type="date" name="FechaFin" value={newProgram.FechaFin} onChange={handleProgramChange} />
        </label>
        <fieldset>
          <legend>{t('programsP.sel_routines')}:</legend>
          {routines.map(routine => (
            <div key={routine.id || routine.RutinaID}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedRoutines.includes(routine.id || routine.RutinaID)}
                  onChange={() => handleSelectRoutine(routine.id || routine.RutinaID)}
                />
                {routine.name || routine.Nombre}
              </label>
            </div>
          ))}
        </fieldset>
        <button type="submit">{isEditing ? t('programsP.update_program') : t('programsP.add_program')}</button>
        {isEditing && <button type="button" onClick={resetForm}>{t('glob.cancel')}</button>}
      </form>
      <h2>{t('programsP.list_programs')}</h2>
      <ul>
        {programs.map((program) => (
          <li key={program.ProgramaID || program.id}>
            <h3>{program.Nombre || program.name}</h3>
            <p>{program.Descripción || program.description}</p>
            <p>{t('programsP.start_date')}: {program.FechaInicio || program.start_date}</p>
            <p>{t('programsP.end_date')}: {program.FechaFin || program.end_date || t('programsP.no_end_date')}</p>
            <p>{t('nav.routines')}: {(program.routines || []).map(rt => rt.name || rt.Nombre).join(', ')}</p>
            <button onClick={() => editProgram(program)}>{t('glob.edit')}</button>
            <button onClick={() => deleteProgram(program.ProgramaID || program.id)}>{t('glob.delete')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Programs;
