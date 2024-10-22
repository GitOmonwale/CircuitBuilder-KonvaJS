import Konva from 'konva';

interface Lamp {
  group: Konva.Group; // Groupe contenant l'ampoule et le socle
  bulb: Konva.Circle; // Partie ampoule de la lampe
  base: Konva.Rect;   // Socle de la lampe
}

/**
 * Crée une lampe et l'ajoute au layer spécifié.
 * @param layer Le layer sur lequel ajouter la lampe.
 * @param x La position x de la lampe.
 * @param y La position y de la lampe.
 * @returns Un objet contenant le groupe de la lampe, l'ampoule et le socle créés.
 */
const Lamp = (
  layer: Konva.Layer,
  x: number,
  y: number
): Lamp => {
  // Création de la partie ampoule (cercle)
  const bulb = new Konva.Circle({
    x: 0, // Position x relative au groupe
    y: 0, // Position y relative au groupe
    radius: 15, // Rayon de l'ampoule
    fill: 'yellow', // Couleur de l'ampoule
    stroke: 'black',
    strokeWidth: 1,
    name: 'bulb', // Nom pour identifier l'ampoule
  });

  // Création du socle (rectangle)
  const base = new Konva.Rect({
    x: -10, // Centrer le socle sous l'ampoule
    y: 15, // Positionner le socle sous l'ampoule
    width: 20, // Largeur du socle
    height: 10, // Hauteur du socle
    fill: 'brown', // Couleur du socle
    name: 'base', // Nom pour identifier le socle
  });

  // Création du groupe pour la lampe
  const group = new Konva.Group({
    x: x, // Position x du groupe
    y: y, // Position y du groupe
    draggable: true, // Le groupe peut être déplacé
  });

  // Ajouter l'ampoule et le socle au groupe
  group.add(bulb);
  group.add(base);

  // Ajouter le groupe au layer
  layer.add(group);
  
  layer.batchDraw(); // Redessiner le layer

  return { group, bulb, base }; // Retourner le groupe, l'ampoule et le socle créés
};

export default Lamp;
