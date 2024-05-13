// Users.js
import React from 'react';
import { useTranslation } from 'react-i18next';

function Goals() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('nav.goals')}</h1>
      {/* Aquí podrías añadir lógica para listar, añadir, editar y eliminar metas */}
    </div>
  );
}

export default Goals;
