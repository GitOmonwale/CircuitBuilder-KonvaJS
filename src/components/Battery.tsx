import Konva from 'konva';

const Battery = (layer: Konva.Layer, x: number, y: number) => {
  // Créer un groupe pour la batterie
  const batteryGroup = new Konva.Group({
    x: x,
    y: y,
    draggable: true, // Rendre le groupe déplaçable
  });

  // Corps de la batterie
  const batteryBody = new Konva.Rect({
    width: 40,
    height: 20,
    fill: 'yellow', // Couleur du corps de la batterie
    stroke: 'black',
    strokeWidth: 2,
  });

  // Borne positive
  const batteryCap = new Konva.Rect({
    x: 40, // Relatif au groupe
    y: 6,
    width: 5,
    height: 5,
    fill: 'black', // Couleur de la borne
  });

  // Ajouter des symboles '+' et '-' sur les bornes
  const plusSign = new Konva.Text({
    x: 32,
    y: 1,
    text: '+',
    fontSize: 10,
    fill: 'black', // Couleur du symbole
  });

  const minusSign = new Konva.Text({
    x: 32,
    y: 9,
    text: '-',
    fontSize: 10,
    fill: 'black', // Couleur du symbole
  });

  // Ajouter les éléments au groupe
  batteryGroup.add(batteryBody);
  batteryGroup.add(batteryCap);
  batteryGroup.add(plusSign);
  batteryGroup.add(minusSign);

  // Ajouter le groupe au layer
  layer.add(batteryGroup);

  // Redessiner la couche après ajout
  layer.draw();

  return batteryGroup;
};

export default Battery;
