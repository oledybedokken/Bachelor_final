//
import CssBaseline from './CssBaseline';
import Paper from './Paper';
import Table from './Table';
import Tabs from './Tabs'
import ToggleButton from './ToggleButton';

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return Object.assign(
    Table(theme),
    Tabs(theme),
    Paper(theme),
    CssBaseline(theme),
    ToggleButton(theme)
  );
}
