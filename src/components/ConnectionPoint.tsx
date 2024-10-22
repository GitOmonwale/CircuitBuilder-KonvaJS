import Konva from 'konva';

interface Connection {
  circle: Konva.Circle;
}

/**
 * Crée un petit point noir et l'ajoute au layer spécifié.
 * @param layer Le layer sur lequel ajouter le cercle.
 * @param x La position x du cercle.
 * @param y La position y du cercle.
 * @returns Un objet contenant le cercle créé.
 */
const ConnectionPoint = (
  layer: Konva.Layer,
  x: number,
  y: number
): Connection => {
  const circle = new Konva.Circle({
    x: x,
    y: y,
    radius: 5, // Rayon très petit pour créer un point
    fill: 'black', // Couleur du point
    stroke: 'black',
    strokeWidth: 1,
    draggable: true, // Le point peut être déplacé
    name: 'draggable-circle', // Nom pour identifier le cercle
  });

  // Ajouter le cercle au layer
  layer.add(circle);
  
  layer.batchDraw(); // Redessiner le layer

  return { circle }; // Retourner le cercle créé
};

export default ConnectionPoint;
