import { useEffect, useRef, useState } from 'preact/hooks'; // Importation des hooks de Preact
import Konva from 'konva'; // Importation de Konva pour dessiner sur un canvas
import ConnectionPoint from './ConnectionPoint'; // Composant qui crée un cercle avec du texte
import Toolbar from './Toolbar'; // Barre d'outils pour ajouter des composants
import Resistor from './Resistor'; // Composant représentant une résistance
import Lamp from './Lamp'; // Composant représentant une lampe
import Battery from './Battery'
// Composant principal pour la construction de circuits
const CircuitBuilder = () => {
  const containerRef = useRef<HTMLDivElement>(null); // Référence pour le conteneur du stage Konva
  const [layer, setLayer] = useState<Konva.Layer | null>(null); // État pour stocker la couche Konva
  const [connections, setConnections] = useState<Konva.Line[]>([]); // Liste des lignes de connexion entre les composants
  const [lines, setLines] = useState<{ line: Konva.Line; componentA: Konva.Node; componentB: Konva.Node }[]>([]); // Lignes traçant les connexions entre deux composants
  const [selectedComponents, setSelectedComponents] = useState<Konva.Node[]>([]); // Composants sélectionnés pour traçage de lignes

  // useEffect pour initialiser le stage (canvas de Konva)
  useEffect(() => {
    const stage = new Konva.Stage({
      container: containerRef.current!, // Lier le stage au div HTML
      width: window.innerWidth, // Largeur de la fenêtre
      height: window.innerHeight, // Hauteur de la fenêtre
    });

    const newLayer = new Konva.Layer(); // Créer une nouvelle couche
    stage.add(newLayer); // Ajouter cette couche au stage
    setLayer(newLayer); // Stocker cette couche dans l'état

    // Nettoyage : détruire le stage lors du démontage du composant
    return () => {
      stage.destroy();
    };
  }, []);

  // Fonction pour ajouter un composant sur le canvas
  const addComponent = (type: string) => {
    if (layer) {
      // Position aléatoire pour placer le composant sur le canvas
      const x = Math.random() * (window.innerWidth - 100);
      const y = Math.random() * (window.innerHeight - 100);

      let component: Konva.Node; // Déclaration du composant à ajouter

      // Sélectionner quel type de composant ajouter (cercle, résistance, lampe)
      switch (type) {
        case 'circle':
          component = ConnectionPoint(layer, x, y).circle; // Crée un cercle avec texte
          break;
        case 'resistor':
          component = Resistor(layer, x, y).rect; // Crée une résistance
          break;
        case 'lamp':
          component = Lamp(layer, x, y).group; // Crée une lampe
          break;
        case 'battery': // Cas pour ajouter la batterie
          component = Battery(layer, x, y); // Crée une batterie
          break;
        default:
          return; // Si le type n'est pas reconnu, on arrête la fonction
      }

      // Si le composant est créé avec succès
      if (component) {
        console.log('Composant ajouté :', component);
        layer.batchDraw(); // Redessiner la couche avec le nouveau composant

        // Lorsqu'un composant est déplacé, mettre à jour les lignes associées
        component.on('dragmove', () => {
          updateLines(component);
        });

        // Lorsqu'un composant est cliqué, l'ajouter à la liste des composants sélectionnés
        component.on('click', (event: Konva.KonvaEventObject<MouseEvent>) => {
          event.cancelBubble = true; // Empêcher la propagation de l'événement

          // Utiliser une fonction de mise à jour basée sur l'état précédent
          setSelectedComponents((prevSelected) => {
            const updatedSelected = prevSelected.includes(component)
              ? prevSelected // Si déjà sélectionné, ne rien changer
              : [...prevSelected, component]; // Sinon, ajouter le composant sélectionné

            // Si deux composants sont sélectionnés, tracer une ligne entre eux
            if (updatedSelected.length === 2) {
              drawLine(updatedSelected[0], updatedSelected[1]);
              return []; // Réinitialiser la sélection après traçage de la ligne
            }

            return updatedSelected; // Mettre à jour l'état des composants sélectionnés
          });
        });


        // Lors d'un double clic sur le composant, le supprimer
        component.on('dblclick', () => {
          component.destroy(); // Détruire le composant
          updateLinesOnDelete(component); // Mettre à jour les lignes associées à ce composant
          layer.draw(); // Redessiner la couche
        });
      }
    }
  };

  // Fonction pour obtenir la position (x, y) d'un composant
  const getPosition = (component: Konva.Node): { x: number; y: number } => {
    return { x: component.x(), y: component.y() };
  };

  // Fonction pour tracer une ligne entre deux composants
  const drawLine = (componentA: Konva.Node, componentB: Konva.Node) => {
    if (!layer) return;

    // Obtenir les positions des deux composants
    const posA = getPosition(componentA);
    const posB = getPosition(componentB);

    // Créer une ligne entre les deux composants
    const line = new Konva.Line({
      points: [posA.x, posA.y, posB.x, posB.y], // Points de départ et d'arrivée
      stroke: 'black', // Couleur de la ligne
      strokeWidth: 2, // Épaisseur de la ligne
    });

    // Ajouter la ligne à l'état des lignes
    setLines((prevLines) => [...prevLines, { line, componentA, componentB }]);
    layer.add(line); // Ajouter la ligne à la couche
    layer.draw(); // Redessiner la couche
  };

  // Fonction pour mettre à jour les lignes lorsqu'un composant est déplacé
  const updateLines = (movedComponent: Konva.Node) => {
    if (!layer) return;

    // Mettre à jour les positions des lignes reliant le composant déplacé
    setLines((prevLines) =>
      prevLines.map(({ line, componentA, componentB }) => {
        const posA = getPosition(componentA);
        const posB = getPosition(componentB);

        // Si l'un des composants connectés a été déplacé, ajuster la ligne
        if (componentA === movedComponent || componentB === movedComponent) {
          line.points([posA.x, posA.y, posB.x, posB.y]); // Mettre à jour les points de la ligne
        }
        return { line, componentA, componentB };
      })
    );
    layer.draw(); // Redessiner la couche
  };

  // Fonction pour supprimer les lignes associées à un composant supprimé
  const updateLinesOnDelete = (deletedComponent: Konva.Node) => {
    setLines((prevLines) => {
      // Supprimer les lignes connectées au composant supprimé
      prevLines.forEach(({ line, componentA, componentB }) => {
        if (componentA === deletedComponent || componentB === deletedComponent) {
          line.destroy(); // Supprimer visuellement la ligne de la couche Konva
        }
      });

      // Mettre à jour l'état pour ne garder que les lignes restantes
      return prevLines.filter(({ componentA, componentB }) =>
        componentA !== deletedComponent && componentB !== deletedComponent
      );
    });
  };


  return (
    <div>
      <Toolbar onAddComponent={addComponent} /> {/* Barre d'outils pour ajouter des composants */}
      <div ref={containerRef} class="w-full h-full" /> {/* Conteneur pour le stage Konva */}
    </div>
  );
};

export default CircuitBuilder; // Exportation du composant
