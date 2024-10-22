import Konva from 'konva';

interface Resistor {
  resistor: any;
  rect: Konva.Rect; // Utiliser un rectangle pour représenter la résistance
}

/**
 * Crée une résistance et l'ajoute au layer spécifié.
 * @param layer Le layer sur lequel ajouter la résistance.
 * @param x La position x de la résistance.
 * @param y La position y de la résistance.
 * @returns Un objet contenant le rectangle créé.
 */
const Resistor = (
  layer: Konva.Layer,
  x: number,
  y: number
): Resistor => {
  const rect = new Konva.Rect({
    x: x,
    y: y,
    width: 20,  // Largeur de la résistance
    height: 10, // Hauteur de la résistance
    fill: 'brown', // Couleur de la résistance
    stroke: 'black',
    strokeWidth: 1,
    draggable: true, // La résistance peut être déplacée
    name: 'draggable-resistor', // Nom pour identifier la résistance
  });

  // Ajouter la résistance au layer
  layer.add(rect);
  
  layer.batchDraw(); // Redessiner le layer

  return { rect }; // Retourner la résistance créée
};

export default Resistor;
