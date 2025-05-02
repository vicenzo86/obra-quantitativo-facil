
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { name: 'Produtos', path: '/' },
    { name: 'Carrinho', path: '/carrinho' },
    { name: 'Pedidos', path: '/pedidos' }
  ];
  
  return (
    <nav className="laticrete-nav">
      {navItems.map(item => (
        <div 
          key={item.path}
          className={`laticrete-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.name}
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
