import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
        const programsResponse = await axios.get('http://localhost/react_php_app/api.php?table=programa');
        const routinesResponse = await axios.get('http://localhost/react_php_app/api.php?table=rutina');
        const relationsResponse = await axios.get('http://localhost/react_php_app/api.php?table=programacontienerutina');

        const combinedPrograms = programsResponse.data.map(program => ({
          ...program,
          routines: relationsResponse.data.filter(rel => rel.ProgramaID === program.ProgramaID)
            .map(rel => routinesResponse.data.find(rt => rt.RutinaID === rel.RutinaID))
            .filter(rt => rt) // Filter out any undefined or null routines
        }));

        setPrograms(combinedPrograms);
        setRoutines(routinesResponse.data);
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
    const programData = {
      Nombre: newProgram.Nombre,
      Descripción: newProgram.Descripción,
      FechaInicio: newProgram.FechaInicio,
      FechaFin: newProgram.FechaFin
    };

    try {
      const response = await axios.post('http://localhost/react_php_app/api.php?table=programa', programData);
      const newProgramId = response.data.id;

      // Prepare relationships data
      const relations = selectedRoutines.map(routineId => ({
        ProgramaID: newProgramId,
        RutinaID: routineId
      }));

      console.log('Sending relationship data:', relations);

      // Assuming your backend can handle batch processing of relations
      const relResponse = await axios.post('http://localhost/react_php_app/api.php?table=programacontienerutina', { relations });
      console.log('Relationships response:', relResponse.data);

      // Update local state to reflect the new program
      const addedProgram = {
        ...programData,
        ProgramaID: newProgramId,
        routines: routines.filter(rt => selectedRoutines.includes(rt.RutinaID))
      };
      setPrograms([...programs, addedProgram]);
      resetForm();
    } catch (error) {
      console.error('Error adding program:', error);
    }
  };

  const updateProgram = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost/react_php_app/api.php?table=programa&id=${currentProgram.ProgramaID}`, {
        ...newProgram,
        routines: selectedRoutines
      });
      const updatedPrograms = programs.map(program =>
        program.ProgramaID === currentProgram.ProgramaID ? { ...newProgram, ProgramaID: currentProgram.ProgramaID, routines: routines.filter(rt => selectedRoutines.includes(rt.RutinaID)) } : program
      );
      setPrograms(updatedPrograms);
      resetForm();
    } catch (error) {
      console.error('Error updating program:', error);
    }
  };

  const deleteProgram = async (programId) => {
    try {
      await axios.delete(`http://localhost/react_php_app/api.php?table=programa&id=${programId}`);
      setPrograms(programs.filter(program => program.ProgramaID !== programId));
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const editProgram = (program) => {
    setNewProgram({
      Nombre: program.Nombre,
      Descripción: program.Descripción,
      FechaInicio: program.FechaInicio.split('T')[0], // Formatear la fecha para el input
      FechaFin: program.FechaFin ? program.FechaFin.split('T')[0] : '' // Manejar posibles valores null
    });
    setCurrentProgram(program);
    setSelectedRoutines(program.routines.map(rt => rt.RutinaID));
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
            <div key={routine.RutinaID}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedRoutines.includes(routine.RutinaID)}
                  onChange={() => handleSelectRoutine(routine.RutinaID)}
                />
                {routine.Nombre}
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
          <li key={program.ProgramaID}>
            <h3>{program.Nombre}</h3>
            <p>{program.Descripción}</p>
            <p>{t('programsP.start_date')}: {program.FechaInicio}</p>
            <p>{t('programsP.end_date')}: {program.FechaFin || t('programsP.no_end_date')}</p>
            <p>{t('nav.routines')}: {program.routines.map(rt => rt.Nombre).join(', ')}</p>
            <button onClick={() => editProgram(program)}>{t('glob.edit')}</button>
            <button onClick={() => deleteProgram(program.ProgramaID)}>{t('glob.delete')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Programs;
