import { useEffect, useRef } from 'preact/hooks';
import Konva from 'konva';
import { h } from 'preact';

// Typage du composant
const KonvaShape = (): h.JSX.Element => {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Assurez-vous que la référence à l'élément DOM est définie avant de créer le stage
    if (stageRef.current) {
      const stage = new Konva.Stage({
        container: stageRef.current, // div référencée pour attacher Konva
        width: 500,
        height: 500,
      });

      const layer = new Konva.Layer();
      stage.add(layer);

      const triangle = new Konva.Shape({
        sceneFunc: function (context) {
          context.beginPath();
          context.moveTo(20, 50);
          context.lineTo(220, 80);
          context.quadraticCurveTo(150, 100, 260, 170);
          context.closePath();

          // Méthode Konva.js spéciale
          
        },
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 4,
      });

      layer.add(triangle);
      layer.draw();
    }
  }, []);

  // Utilisation de `h` au lieu de JSX pour rendre l'élément
  return h('div', { ref: stageRef, style: { border: '1px solid black', width: '500px', height: '500px' } });
};

export default KonvaShape;
