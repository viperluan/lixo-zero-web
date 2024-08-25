import React from 'react';
import { Spinner } from 'reactstrap';
import './LoadingOverlay.scss'; // Importe o arquivo de estilos

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <Spinner color="light" />
    </div>
  );
};

export { LoadingOverlay };
