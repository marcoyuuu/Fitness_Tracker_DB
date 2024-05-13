// Progress.js
import React from 'react';
import { useTranslation } from 'react-i18next';

function Programs() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('nav.programs')}</h1>
      {/* Componentes de visualización de programas, etc. */}
    </div>
  );
}

export default Programs;
