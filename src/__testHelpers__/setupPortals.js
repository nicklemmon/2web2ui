/*
 * Our Modal and Alert components render into portals. To allow use of these components
 * in a jsdom-driven test environment, we must manually create portals for them ahead of
 * time.
 */

export function mkPortal(id) {
  const node = global.document.createElement('div');
  node.setAttribute('id', id);
  global.document.body.appendChild(node);
}

// Note: this must run before any attempt to `mount()` a React component
// which uses a Modal or an Alert.
function setupPortals() {
  mkPortal('popover-portal');
  mkPortal('modal-portal');
  mkPortal('alert-portal');
}

export default setupPortals;
