const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando compilación estática...');

// Construir la aplicación
try {
  console.log('Ejecutando next build...');
  // Usar npx para ejecutar el comando next local
  execSync('npx next build', { stdio: 'inherit' });
  
  console.log('\nCompilación completada con éxito!');
  console.log('La carpeta "out" contiene la versión estática de la aplicación.');
  console.log('\nPuedes servir la aplicación localmente con:');
  console.log('npx serve out');
} catch (error) {
  console.error('Error durante la compilación:', error);
  process.exit(1);
}
