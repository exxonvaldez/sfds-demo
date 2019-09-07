/**
 * A table of affordable housing projects.  Presentation, connection, and logic
 * are all in this class together.  Adapted from the example in:
 * 
 * https://material-ui.com/components/tables/#sorting-amp-selecting
 *
 **/

import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { setSelectedProjectIDs } from '../actions';
import { handleProjectClick } from '../helpers/selectProjects';

/**
 * Descending comparator that does lexical and numeric sorting.
 * 
 * @param {Object} a A row of data to compare.
 * @param {Object} b The other row of data to compare.
 * @param {any} orderBy The column to compare.
 * @param {boolean} numeric Whether to sort numerically. 
 */
function desc(a, b, orderBy, numeric) {
  
  if (numeric) {
    return (Number.parseInt(b[orderBy]) - Number.parseInt(a[orderBy]));
  }
  
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 * Sorts the given array using the cmp comparator, using array index order to break ties
 * and thus always sort in a consistent order.
 *  
 * @param {Array} array Rows to sort.
 * @param {Function} cmp Comparator to use.
 */
function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

/**
 * Comparator that does ascending and descending.  
 * 
 * @param {string} order 'asc' or 'desc' for ascending or descending.
 * @param {any} orderBy Column to sort by.
 * @param {any} numeric Whether to do a numeric sort.
 */
function getSorting(order, orderBy, numeric) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy, numeric)
    : (a, b) => -desc(a, b, orderBy, numeric);
}

const headRows = [
  { id: 'project_name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'neighborhood', numeric: false, disablePadding: false, label: 'Neighborhood' },
  { id: 'total_units', numeric: true, disablePadding: false, label: 'Total Units' },
  { id: 'affordable_units', numeric: true, disablePadding: false, label: 'Affordable Units' },
  { id: 'affordable_beds', numeric: true, disablePadding: false, label: 'Affordable Beds' },
  { id: 'year_affordability_began', numeric: true, disablePadding: false, label: 'Year Affordability Began' },
];

/**
 * Table header that supports sorting.
 * 
 * @param {Object} props
 */
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" className="zindex1"> {/* fix for z-index issue with sticky header vs checkbox column */}
        </TableCell>      
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

/**
 * Includes some quickly added Buttons for filtering the table by selected rows.
 * 
 * @param {Object} props
 */
const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: false,
      })}
    >
      <div className={classes.title}>
        {
          <Typography color="inherit" variant="subtitle1">
            { `${props.projects.length} rows` || '' }
            { props.selectedProjectIDs && props.selectedProjectIDs.length > 0
              ? (<span> ({props.selectedProjectIDs.length} selected)&nbsp;
                  <Button size="small" color="primary" onClick={e => props.setShowOnlySelected(true)}>List Only Selected</Button>
                  <Button size="small" color="primary" onClick={e => props.setShowOnlySelected(false)}>List All</Button></span>)
              : '' }
          </Typography>
        }
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}> {/* where a filtering button can go in the future */}
      </div>
    </Toolbar>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  tableWrapper: {
    height: 400,
    overflowX: 'auto',
  },
}));

function ProjectTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('project_name');
  const [showOnlySelected, setShowOnlySelected] = React.useState(false);
  const dense = true;
  
  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  // If the data failed to load, only show an error message instead of
  // an empty table.
  
  if (props.projectsErr) {
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          Unable to display projects: {props.projectsErr.message}
        </Paper>
      </div>
    )
  }

  let projects = props.projects || [];
  let selectedProjectIDs = props.selectedProjectIDs || [];
  
  // If there are no more selected rows and we are filtering by selected rows,
  // unset the filter.
  
  if (selectedProjectIDs.length === 0 && showOnlySelected) {
    setShowOnlySelected(false);
  }
  
  // Filter the rows.
  
  if (showOnlySelected) {
    projects = projects.filter(project => selectedProjectIDs.includes(project.project_id));
  }
  
  const isSelected = (name, selectedProjectIDs) => selectedProjectIDs.indexOf(name) !== -1;
  
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar projects={projects} selectedProjectIDs={selectedProjectIDs} setShowOnlySelected={setShowOnlySelected} />
        <div className={classes.tableWrapper}>
          <Table aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'} stickyHeader>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={projects.length}
            />
            <TableBody>
              {stableSort(projects, getSorting(order, orderBy, headRows.find(row => row.id === orderBy).numeric)).map(
                (row, index) => {
                  
                  const isItemSelected = isSelected(row.project_id, selectedProjectIDs);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleProjectClick(event, row.project_id, selectedProjectIDs, props.setSelectedProjectIDs)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.project_id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color={"primary" /* using primary blue for now, should be sfgov blue */}
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>                      
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                          {row.project_name}
                      </TableCell>
                      <TableCell>
                          {row.neighborhood}
                      </TableCell>
                      <TableCell align="right">
                          {row.total_units}
                      </TableCell>
                      <TableCell align="right">
                          {row.affordable_units}
                      </TableCell>
                          <TableCell align="right">
                          {row.affordable_beds}
                      </TableCell>
                      <TableCell align="right">
                          {row.year_affordability_began}

                      </TableCell>
                    </TableRow>
                  );
              
                },
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </div>
  );
}

const mapStateToProps = state => ({
  projects: state.projects,
  projectsErr: state.projectsErr,
  selectedProjectIDs: state.selectedProjectIDs,
});

const mapDispatchToProps = dispatch => {
  return ({  
    setSelectedProjectIDs: (selectedProjectIDs) => dispatch(setSelectedProjectIDs(selectedProjectIDs)),
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTable);
