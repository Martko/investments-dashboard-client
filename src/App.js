import React, { Component } from "react";
import PortfolioValuesPieChart from "./components/PieChart";
import SimpleLineChart from "./components/SimpleLineChart";
import "./App.css";
import * as _ from "lodash";
import { ResponsiveContainer } from "recharts";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ScoreCard from "./components/ScoreCard";
import { formatCurrency } from "./utils";
import Loader from "./components/Loader";
import ChartCard from "./components/ChartCard";
const moment = require("moment");

const API_URL = process.env.REACT_APP_API_URL;

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      portfolioValues: [],
      dailyInterestData: [],
      passiveIncome: []
    };
  }

  test(data) {
    let res = {};
    data.map(entry => {
      if (!res.hasOwnProperty(entry.month)) {
        res[entry.month] = {};
        res[entry.month].month = moment(new Date(2012, entry.month, 4)).format(
          "MMMM"
        );
      }
      res[entry.month][entry.source] = entry.total;
    });

    return Object.values(res);
  }

  displayPortfolioValueScorecard() {
    if (!this.state.portfolioValues.length) {
      return <Loader />;
    }

    return (
      <ScoreCard
        title={"Total portfolio size"}
        value={formatCurrency(_.sumBy(this.state.portfolioValues, "value"))}
      />
    );
  }

  displayMonthlyPassiveIncomeScorecard() {
    if (!this.state.passiveIncome) {
      return <Loader />;
    }

    return (
      <ScoreCard
        title={"Monthly passive income"}
        value={formatCurrency(_.sumBy(this.state.passiveIncome, "net"))}
      />
    );
  }

  displayMonthlyRentalIncomeScorecard() {
    return (
      <ScoreCard
        title={"Monthly rental income"}
        value={formatCurrency(398.85)}
      />
    );
  }

  displayTotalMonthlyPassiveIncomeScorecard() {
    if (!this.state.passiveIncome) {
      return <Loader />;
    }

    return (
      <ScoreCard
        title={"Total monthly passive income"}
        value={formatCurrency(
          398.85 + _.sumBy(this.state.passiveIncome, "net")
        )}
      />
    );
  }

  displayTotalMonthlyLossScorecard() {
    if (!this.state.passiveIncome) {
      return <Loader />;
    }

    return (
      <ScoreCard
        title={"Loss"}
        value={formatCurrency(_.sumBy(this.state.passiveIncome, "loss"))}
      />
    );
  }

  displayPortfolioBreakdown() {
    if (!this.state.portfolioValues.length) {
      return <Loader />;
    }

    return (
      <ResponsiveContainer>
        <PortfolioValuesPieChart data={this.state.portfolioValues} />
      </ResponsiveContainer>
    );
  }

  displayMonthlyInterests() {
    if (!this.state.dailyInterestData.length) {
      return <Loader />;
    }

    return <SimpleLineChart data={this.state.dailyInterestData} />;
  }

  async fetchPortfolioValueData() {
    fetch(`${API_URL}/api/portfolio-value`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          portfolioValues: data
        });
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  async fetchMonthlyInterestsData() {
    fetch(`${API_URL}/api/interests?type=monthly_interests&year=2019`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          ...this.state,
          dailyInterestData: this.test(data)
        });
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  async fetchPassiveIncomeData() {
    fetch(`${API_URL}/api/passive-income`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          ...this.state,
          passiveIncome: data
        });
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  componentDidMount() {
    this.fetchPortfolioValueData();
    this.fetchPassiveIncomeData();
    this.fetchMonthlyInterestsData();
  }

  render() {
    return (
      <div className="App">
        <Grid container spacing={24}>
          <Grid item md={2}>
            {this.displayPortfolioValueScorecard()}
          </Grid>
          <Grid item md={2}>
            {this.displayMonthlyPassiveIncomeScorecard()}
          </Grid>
          <Grid item md={2}>
            {this.displayMonthlyRentalIncomeScorecard()}
          </Grid>
          <Grid item md={2}>
            {this.displayTotalMonthlyPassiveIncomeScorecard()}
          </Grid>
          <Grid item md={2}>
            {this.displayTotalMonthlyLossScorecard()}
          </Grid>
          <Grid item md={2}>
            test
          </Grid>
          <Grid item md={4}>
            <ChartCard
              title={"Portfolio breakdown"}
              content={this.displayPortfolioBreakdown()}
            />
          </Grid>
          <Grid item md={8}>
            <ChartCard
              title="Monthly Interests (2019)"
              content={this.displayMonthlyInterests()}
            />
          </Grid>
          <Grid item md={12}>
            <ChartCard
              title="Portfolio value change (2019)"
              content={this.displayMonthlyInterests()}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
