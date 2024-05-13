// Progress.js
import React from 'react';
import { useTranslation } from 'react-i18next';

function Progress() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('nav.progress')}</h1>
      {/* Componentes de visualización de progreso, etc. */}
    </div>
  );
}

export default Progress;
