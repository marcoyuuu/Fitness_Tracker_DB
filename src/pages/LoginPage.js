// LoginPage.js
import React, { useState } from 'react';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <h1>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h1>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Contraseña" required />
        {isLogin ? (
          <button type="submit">Iniciar Sesión</button>
        ) : (
          <>
            <input type="password" placeholder="Confirmar Contraseña" required />
            <button type="submit">Registrarse</button>
          </>
        )}
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Crear una cuenta" : "Ya tengo cuenta"}
      </button>
    </div>
  );
}

export default LoginPage;
