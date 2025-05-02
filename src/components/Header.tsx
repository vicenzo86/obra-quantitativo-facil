
import React from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="laticrete-header">
      <div className="flex items-center">
        <h1 
          className="text-xl font-bold cursor-pointer" 
          onClick={() => navigate('/')}
        >
          Obra Quantitativo
        </h1>
      </div>
      <Menu className="h-6 w-6" />
    </header>
  );
};

export default Header;
