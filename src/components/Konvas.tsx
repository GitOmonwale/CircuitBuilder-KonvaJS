import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import Konva from 'konva';
import createCircleWithText from './ConnectionPoint'; // Fonction pour créer un cercle avec du texte
import ToolBar from './ToolsBar'; // Barre d'outils permettant d'ajouter des points
import { KonvaEventObject } from 'konva/lib/Node'; // Type pour gérer les événements Konva

// Composant principal utilisant Konva pour gérer le dessin des points et des lignes
const Konvas = () => {
  const containerRef = useRef<HTMLDivElement>(null); // Référence à l'élément DOM pour contenir le canvas Konva
  const [stage, setStage] = useState<Konva.Stage | null>(null); // État pour stocker la scène Konva
  const [layer, setLayer] = useState<Konva.Layer | null>(null); // État pour stocker le layer sur lequel on dessine

  // Hook pour initialiser la scène et le layer lorsque le composant est monté
  useEffect(() => {
    const stageInstance = new Konva.Stage({
      container: containerRef.current!, // Le container est l'élément référencé par `containerRef`
      width: window.innerWidth, // Largeur de la scène (pleine largeur de la fenêtre)
      height: window.innerHeight, // Hauteur de la scène (pleine hauteur de la fenêtre)
    });

    const layerInstance = new Konva.Layer(); // Crée un nouveau layer sur lequel dessiner
    stageInstance.add(layerInstance); // Ajoute le layer à la scène

    setStage(stageInstance); // Enregistre la scène dans l'état
    setLayer(layerInstance); // Enregistre le layer dans l'état

    // Nettoyage : détruit la scène lorsque le composant est démonté pour libérer les ressources
    return () => {
      stageInstance.destroy();
    };
  }, []);

  // Fonction pour créer un point (cercle avec texte) à une position donnée
  const createPoint = (x: number, y: number) => {
    if (!layer) return; // Si le layer n'est pas prêt, on quitte

    const { circle, text } = createCircleWithText(layer, x, y); // Crée un cercle avec du texte

    // Ajoute un événement pour bouger les lignes connectées lorsque le point est déplacé
    circle.on('dragmove', () => {
      updateLines(circle); // Mets à jour les lignes liées à ce point
    });

    // Gère le clic sur le cercle : sélectionne le point pour tracer une ligne
    circle.on('click', (event: KonvaEventObject<MouseEvent>) => {
      event.cancelBubble = true; // Empêche la propagation de l'événement
      selectedPoints.push(circle); // Ajoute le point sélectionné à la liste

      // Si deux points sont sélectionnés, on trace une ligne entre eux
      if (selectedPoints.length === 2) {
        drawLine(selectedPoints[0], selectedPoints[1]);
        selectedPoints = []; // Réinitialise la sélection après avoir tracé la ligne
      }
    });

    // Gère le double-clic sur le cercle : supprime le point et ses lignes associées
    circle.on('dblclick', () => {
      circle.destroy(); // Détruit le cercle
      text.destroy(); // Détruit le texte associé
      updateLinesOnDelete(circle); // Mets à jour les lignes en supprimant celles qui étaient attachées au point
      layer.draw(); // Redessine le layer
    });

    layer.draw(); // Redessine le layer après ajout du point
  };

  // Fonction pour ajouter un point à l'endroit où l'utilisateur clique dans la scène
  const addPoint = () => {
    if (stage) {
      const pointerPosition = stage.getPointerPosition(); // Récupère la position du curseur
      if (pointerPosition) {
        createPoint(pointerPosition.x, pointerPosition.y); // Crée un point à cette position
      }
    }
  };

  // Tableau pour stocker les lignes et leurs points de départ/arrivée
  let lines: { line: Konva.Line; pointA: Konva.Circle; pointB: Konva.Circle }[] = [];
  // Tableau pour stocker les points sélectionnés pour tracer une ligne
  let selectedPoints: Konva.Circle[] = [];

  // Fonction pour dessiner une ligne entre deux points
  const drawLine = (pointA: Konva.Circle, pointB: Konva.Circle) => {
    if (!layer) return;

    const line = new Konva.Line({
      points: [pointA.x(), pointA.y(), pointB.x(), pointB.y()], // Points de départ et d'arrivée de la ligne
      stroke: 'black', // Couleur de la ligne
      strokeWidth: 2, // Épaisseur de la ligne
    });

    lines.push({ line, pointA, pointB }); // Ajoute la ligne au tableau avec ses points associés
    layer.add(line); // Ajoute la ligne au layer
    layer.draw(); // Redessine le layer
  };

  // Fonction pour mettre à jour les lignes lorsque les points sont déplacés
  const updateLines = (movedPoint: Konva.Circle) => {
    if (!layer) return;

    // Parcours toutes les lignes pour mettre à jour celles qui sont connectées au point déplacé
    lines.forEach(({ line, pointA, pointB }) => {
      if (pointA === movedPoint || pointB === movedPoint) {
        line.points([pointA.x(), pointA.y(), pointB.x(), pointB.y()]); // Mets à jour les coordonnées de la ligne
      }
    });
    layer.draw(); // Redessine le layer
  };

  // Fonction pour mettre à jour les lignes lorsqu'un point est supprimé
  const updateLinesOnDelete = (deletedPoint: Konva.Circle) => {
    // Supprime toutes les lignes connectées au point supprimé
    lines.forEach(({ line, pointA, pointB }) => {
      if (pointA === deletedPoint || pointB === deletedPoint) {
        line.destroy(); // Détruit la ligne
      }
    });

    // Filtre les lignes pour ne garder que celles qui ne sont pas connectées au point supprimé
    lines = lines.filter(({ pointA, pointB }) => pointA !== deletedPoint && pointB !== deletedPoint);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ToolBar onAddPoint={addPoint} /> {/* Barre d'outils pour ajouter des points */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} /> {/* Container pour le canvas Konva */}
    </div>
  );
};

export default Konvas;
