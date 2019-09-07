/**
 * Adapted from https://material-ui.com/components/tables/#sorting-amp-selecting
 *
 * Common code between the table and map to update the selected projects.
 *
 * @param {Object} event The event that caused the selection to change (not used).
 * @param {string} project_id The id of the project to toggle.
 * @param {Array} selectedProjectIDs The current selection.
 * @param {Function} setSelectedProjectIDs The function to call to trigger the state change.
 */
export function handleProjectClick(event, project_id, selectedProjectIDs, setSelectedProjectIDs) {
  const selectedIndex = selectedProjectIDs.indexOf(project_id);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selectedProjectIDs, project_id);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selectedProjectIDs.slice(1));
  } else if (selectedIndex === selectedProjectIDs.length - 1) {
    newSelected = newSelected.concat(selectedProjectIDs.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selectedProjectIDs.slice(0, selectedIndex),
      selectedProjectIDs.slice(selectedIndex + 1),
    );
  }

  setSelectedProjectIDs(newSelected);
}