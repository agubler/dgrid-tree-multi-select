import renderer, { tsx } from "@dojo/framework/core/vdom";
import WidgetBase from "@dojo/framework/core/WidgetBase";
import DgridWrapper, {
  SelectionType,
  SelectionMode
} from "@dojo/interop/dgrid/DgridWrapper";
import { uuid } from "@dojo/framework/core/util";

function generateData(count = 100) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const parentId = uuid();
    data.push({
      id: parentId,
      first: "Anthony",
      last: "Gubler",
      hasChildren: true
    });
    data.push({
      id: uuid(),
      parent: parentId,
      first: "Dylan",
      last: "Schiemann",
      hasChildren: false
    });
  }
  return data;
}

class App extends WidgetBase {
  private _data = generateData(100);
  private _columns = [
    { field: "id", label: "Id", renderExpando: true },
    { field: "first", label: "First" },
    { field: "last", label: "Last" }
  ];
  private _selectedItems = new Map();
  protected render() {
    return (
      <div>
        <div key="title">
          Select rows in the grid, use ctrl/cmd and shift to select multiple
          rows. The selected rows are output below the grid.
        </div>
        <DgridWrapper
          features={{
            tree: true,
            selection: SelectionType.row
          }}
          data={this._data}
          columns={this._columns}
          selectionMode={SelectionMode.extended}
          onSelect={items => {
            items.data.forEach(item => {
              this._selectedItems.set(item.item.id, item.item);
            });
            this.invalidate();
          }}
          onDeselect={items => {
            items.data.forEach(item => {
              this._selectedItems.delete(item.item.id);
            });
            this.invalidate();
          }}
        />
        {[...this._selectedItems.values()].map(item => (
          <pre key={item.id}>{JSON.stringify(item)}</pre>
        ))}
      </div>
    );
  }
}

const r = renderer(() => <App />);
r.mount();
