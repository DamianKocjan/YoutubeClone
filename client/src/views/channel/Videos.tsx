import React from 'react';
import { useParams } from 'react-router-dom';

const Videos: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return <div>videos {id}</div>;
};

export default Videos;
