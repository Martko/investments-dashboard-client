import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const styles = {
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
};

function ScoreCard(props) {
  const { classes, title, value } = props;

  return (
    <Card>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {title}
        </Typography>
        <Typography variant="h5" component="h2">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

ScoreCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScoreCard);
