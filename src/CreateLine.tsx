import Konva from 'konva';

/**
 * Crée une ligne entre deux points et l'ajoute au layer spécifié.
 * @param layer Le layer sur lequel ajouter la ligne.
 * @param startX La position x du point de départ.
 * @param startY La position y du point de départ.
 * @param endX La position x du point d'arrivée.
 * @param endY La position y du point d'arrivée.
 */
const createLine = (
  layer: Konva.Layer,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  const line = new Konva.Line({
    points: [startX, startY, endX, endY],
    stroke: 'black',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  });

  layer.add(line);
  layer.batchDraw(); // Redessiner le layer
};

export default createLine;
