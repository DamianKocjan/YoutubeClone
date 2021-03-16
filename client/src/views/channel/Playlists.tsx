import React from 'react';
import { useParams } from 'react-router-dom';

const Playlists: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return <div>playlists {id}</div>;
};

export default Playlists;
