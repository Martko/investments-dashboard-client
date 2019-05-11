import React, { Component } from "react";
import PieChart from "./components/PieChart";
import CombinedChart from "./components/CombinedChart";
import "./App.css";
import * as _ from "lodash";
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
      monthlyInterestData: [],
      passiveIncome: [],
      historicalPortfolioValues: [],
      passiveIncomeBreakdown: [],
      availableCash: 0,
      rentalIncome: 0
    };
  }

  groupByMonth(data, valueField) {
    let res = {};
    data.forEach(entry => {
      const key = entry.month - 1;

      if (!res.hasOwnProperty(key)) {
        res[key] = {};
        res[key].total = 0;
        res[key].month = moment(new Date(2012, key, 4)).format("MMMM");
      }
      res[key][entry.source] = entry[valueField];
      res[key].total += entry[valueField];
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
    if (!this.state.rentalIncome) {
      return <Loader />;
    }

    return (
      <ScoreCard
        title={"Monthly rental income"}
        value={formatCurrency(this.state.rentalIncome)}
      />
    );
  }

  displayTotalMonthlyPassiveIncomeScorecard() {
    if (!this.state.passiveIncome || !this.state.rentalIncome) {
      return <Loader />;
    }

    return (
      <ScoreCard
        title={"Total monthly passive income"}
        value={formatCurrency(
          this.state.rentalIncome + _.sumBy(this.state.passiveIncome, "net")
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

  displayPassiveIncomeBreakdown() {
    if (!this.state.passiveIncome.length || !this.state.rentalIncome) {
      return <Loader />;
    }

    const data = [
      {
        name: "interests",
        value: _.sumBy(this.state.passiveIncome, "net")
      },
      {
        name: "rent",
        value: this.state.rentalIncome
      }
    ];

    return <PieChart data={data} />;
  }

  displayPieChart(dataKey, showLegend) {
    if (!this.state[dataKey].length) {
      return <Loader />;
    }

    return <PieChart showLegend={showLegend} data={this.state[dataKey]} />;
  }

  displayInterests(type, dataKey, lineKeys) {
    if (!this.state[type].length) {
      return <Loader />;
    }

    return (
      <CombinedChart
        dataKey={dataKey}
        barDataKey="total"
        lineKeys={lineKeys}
        data={this.state[type]}
      />
    );
  }

  displayHistoricalPortfolioValues() {
    if (!this.state.historicalPortfolioValues.length) {
      return <Loader />;
    }

    return (
      <CombinedChart
        dataKey="month"
        barDataKey="total"
        lineKeys={["mintos", "bondora", "funderbeam", "omaraha", "fundwise"]}
        data={this.state.historicalPortfolioValues}
      />
    );
  }

  displayLoanAndPortfolioValues() {
    if (!this.state.historicalPortfolioValues.length) {
      return <Loader />;
    }

    return (
      <CombinedChart
        dataKey="month"
        barDataKey="total"
        lineKeys={["total"]}
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
    this.fetch("/api/rent?limit=3", "rentalIncome", data => {
      return _.sumBy(data, "net") / 3;
    });
    this.fetch("/api/passive-income", "passiveIncome");
    this.fetch(
      "/api/interests?type=monthly_interests&year=2019",
      "monthlyInterestData",
      data => {
        return this.groupByMonth(data, "net");
      }
    );
    this.fetch(
      "/api/interests?type=daily_interests&year=2019",
      "dailyInterestData"
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
    this.fetch("/api/loans", "loans", data => {
      return this.groupByMonth(data, "sum");
    });
  }

  render() {
    return (
      <div className="App">
        <Grid container spacing={16}>
          <Grid item sm={4} md={2} xs={6}>
            {this.displayPortfolioValueScorecard()}
          </Grid>
          <Grid item sm={4} md={2} xs={6}>
            {this.displayMonthlyPassiveIncomeScorecard()}
          </Grid>
          <Grid item sm={4} md={2} xs={6}>
            {this.displayMonthlyRentalIncomeScorecard()}
          </Grid>
          <Grid item sm={4} md={2} xs={6}>
            {this.displayTotalMonthlyPassiveIncomeScorecard()}
          </Grid>
          <Grid item sm={4} md={2} xs={6}>
            {this.displayTotalMonthlyLossScorecard()}
          </Grid>
          <Grid item sm={4} md={2} xs={6}>
            {!this.state.availableCash ? (
              <Loader />
            ) : (
              <ScoreCard
                title={"Available Cash"}
                value={formatCurrency(this.state.availableCash)}
              />
            )}
          </Grid>
          <Grid item md={2} sm={6} xs={12}>
            <ChartCard
              title={"Portfolio breakdown"}
              content={this.displayPieChart("portfolioValues")}
            />
          </Grid>
          <Grid item md={2} sm={6} xs={12}>
            <ChartCard
              title={"Passive income breakdown"}
              content={this.displayPassiveIncomeBreakdown()}
            />
          </Grid>
          <Grid item md={8} xs={12}>
            <ChartCard
              title="Daily interests"
              content={this.displayInterests("dailyInterestData", "day", [
                "loss",
                "net"
              ])}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <ChartCard
              title="Monthly Interests (2019)"
              content={this.displayInterests("monthlyInterestData", "month", [
                "mintos",
                "omaraha"
              ])}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <ChartCard
              title="Portfolio value change (2019)"
              content={this.displayHistoricalPortfolioValues()}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <ChartCard
              title="Total portfolio value vs. loan"
              content={this.displayLoanAndPortfolioValues()}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
