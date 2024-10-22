import type { FunctionComponent } from 'preact';

interface ToolbarProps {
  onAddComponent: (type: string) => void;
}

const Toolbar: FunctionComponent<ToolbarProps> = ({ onAddComponent }) => {
  return (
    <>
      <div class="border rounded-lg">
        <h1 class="text-3xl text-center mb-5">Composants</h1>
        <div class="flex p-4">
          <button onClick={() => onAddComponent('circle')} class="m-2 p-2 bg-gray-500 text-white rounded">
            Ajouter un point de jonction
          </button>
          <button onClick={() => onAddComponent('resistor')} class="m-2 p-2 bg-gray-500 text-white rounded">
            Ajouter une résistance
          </button>
          <button onClick={() => onAddComponent('lamp')} class="m-2 p-2 bg-gray-500 text-white rounded">
            Ajouter une lampe
          </button>
          <button onClick={() => onAddComponent('battery')} class="m-2 p-2 bg-gray-500 text-white rounded">
            Ajouter une battery
          </button>
        </div>
      </div>
    </>
  );
};

export default Toolbar;
