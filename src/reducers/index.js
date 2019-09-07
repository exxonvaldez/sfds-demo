/**
 * The one and only reducer for this app.
 */

const initialState = {
  projects: null, // array of per project objects
  projectsErr: null, // error message to show when the data fails to load
  selectedProjectIDs: [], // array of id strings
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
  case 'RECEIVED_PROJECTS':
    return { ...state, projects: action.payload };
  case 'RECEIVED_PROJECTS_ERROR':
    return { ...state, projectsErr: action.payload };
  case 'SELECTED_PROJECTS':
    return { ...state, selectedProjectIDs: action.payload };
  default:
    return state
  }
}

export default rootReducer
