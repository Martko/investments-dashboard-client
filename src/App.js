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
      passiveIncome: [],
      historicalPortfolioValues: [],
      availableCash: 0
    };
  }

  groupByMonth(data, valueField) {
    let res = {};
    data.map(entry => {
      if (!res.hasOwnProperty(entry.month)) {
        res[entry.month] = {};
        res[entry.month].month = moment(new Date(2012, entry.month, 4)).format(
          "MMMM"
        );
      }
      res[entry.month][entry.source] = entry[valueField];
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

    return (
      <SimpleLineChart
        dataKey="month"
        lineKeys={["mintos", "omaraha"]}
        data={this.state.dailyInterestData}
      />
    );
  }

  displayHistoricalPortfolioValues() {
    if (!this.state.historicalPortfolioValues.length) {
      return <Loader />;
    }

    return (
      <SimpleLineChart
        dataKey="month"
        lineKeys={["mintos", "bondora", "funderbeam", "omaraha", "fundwise"]}
        data={this.state.historicalPortfolioValues}
      />
    );
  }

  async fetch(url, stateProperty, transformerFunction) {
    fetch(API_URL + url)
      .then(response => response.json())
      .then(data => {
        const state = {
          ...this.state
        };
        data =
          transformerFunction !== undefined ? transformerFunction(data) : data;

        state[stateProperty] = data;
        this.setState(state);
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  componentDidMount() {
    this.fetch("/api/portfolio-value", "portfolioValues");
    this.fetch("/api/passive-income", "passiveIncome");
    this.fetch(
      "/api/interests?type=monthly_interests&year=2019",
      "dailyInterestData",
      data => {
        return this.groupByMonth(data, "total");
      }
    );
    this.fetch(
      "/api/portfolio-value?type=by_month",
      "historicalPortfolioValues",
      data => {
        return this.groupByMonth(data, "value");
      }
    );
    this.fetch("/api/cash", "availableCash", data => {
      return _.sumBy(data, "cash");
    });
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
            {!this.state.availableCash ? (
              <Loader />
            ) : (
              <ScoreCard
                title={"Available Cash"}
                value={formatCurrency(this.state.availableCash)}
              />
            )}
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
              content={this.displayHistoricalPortfolioValues()}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
