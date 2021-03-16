import React from 'react';
import { useParams } from 'react-router-dom';

const About: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return <div>about {id}</div>;
};

export default About;
