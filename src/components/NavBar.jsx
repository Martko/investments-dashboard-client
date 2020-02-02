import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
});

class NavBar extends Component {
    render() {
        const { classes } = this.props;

        return (
            <AppBar position="static">
                <Toolbar>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">
                            Year
                        </InputLabel>
                        <Select
                            labelId="year-selection-label"
                            id="year-selection"
                            value={this.props.year}
                            onChange={this.props.yearChangeHandler}
                        >
                            <MenuItem value={2019}>2019</MenuItem>
                            <MenuItem value={2020}>2020</MenuItem>
                        </Select>
                    </FormControl>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles)(NavBar);
