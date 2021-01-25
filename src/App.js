import React, { Component } from 'react';
import PieChart from './components/PieChart';
import CombinedChart from './components/CombinedChart';
import './App.css';
import { sumBy } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ScoreCard from './components/ScoreCard';
import { formatCurrency } from './utils';
import NavBar from './components/NavBar';
import Loader from './components/Loader';
import ChartCard from './components/ChartCard';
const moment = require('moment');
const API_URL = process.env.REACT_APP_API_URL;
const dailyPassiveIncomeStartDate = `${moment().format('YYYY-MM')}-01`;

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
});

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            portfolioValues: [],
            dailyPassiveIncomeData: [],
            monthlyPassiveIncomeData: [],
            passiveIncome: [],
            historicalPortfolioValues: [],
            passiveIncomeBreakdown: [],
            availableCash: null,
            rentalIncome: null,
            settings: null,
            year: new Date().getFullYear(),
        };
    }

    handleYearChange(event) {
        this.setState({
            ...this.state,
            year: event.source.value,
        });

        this.fetchData();
    }

    groupBy(data, groupByField, valueField) {
        let res = {};
        data.forEach(entry => {
            const key = entry[groupByField] - 1;

            if (!res.hasOwnProperty(key)) {
                res[key] = {};
                res[key].total = 0;
                res[key].month = moment(new Date(2012, key, 4)).format('MMMM');
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
                title={'Total portfolio size'}
                value={formatCurrency(
                    sumBy(this.state.portfolioValues, 'value')
                )}
            />
        );
    }

    displayMonthlyPassiveIncomeScorecard() {
        if (!this.state.passiveIncome) {
            return <Loader />;
        }

        return (
            <ScoreCard
                title={'Monthly Passive Income'}
                value={formatCurrency(sumBy(this.state.passiveIncome, 'net'))}
            />
        );
    }

    displayMonthlyRentalIncomeScorecard() {
        if (this.state.rentalIncome === null) {
            return <Loader />;
        }

        return (
            <ScoreCard
                title={'Monthly Rental Income'}
                value={formatCurrency(this.state.rentalIncome)}
            />
        );
    }

    displayTotalMonthlyPassiveIncomeScorecard() {
        if (
            this.state.passiveIncome === null ||
            this.state.rentalIncome === null
        ) {
            return <Loader />;
        }

        return (
            <ScoreCard
                title={'Total monthly passive income'}
                value={formatCurrency(
                    this.state.rentalIncome +
                        sumBy(this.state.passiveIncome, 'net')
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
                title={'Loss'}
                value={formatCurrency(sumBy(this.state.passiveIncome, 'loss'))}
            />
        );
    }

    displayPassiveIncomeBreakdown() {
        if (
            !this.state.passiveIncome.length ||
            this.state.rentalIncome === null
        ) {
            return <Loader />;
        }

        const data = [
            {
                name: 'interests',
                value: sumBy(this.state.passiveIncome, 'net'),
            },
            {
                name: 'rent',
                value: this.state.rentalIncome,
            },
        ];

        return <PieChart data={data} />;
    }

    displayPieChart(dataKey, showLegend) {
        if (!this.state[dataKey].length) {
            return <Loader />;
        }

        return <PieChart showLegend={showLegend} data={this.state[dataKey]} />;
    }

    displayInterests(type, dataKey, lineKeys, showNavigator) {
        if (!this.state[type].length) {
            return <Loader />;
        }

        return (
            <CombinedChart
                dataKey={dataKey}
                barDataKey="total"
                lineKeys={lineKeys}
                showNavigator={showNavigator || false}
                data={this.state[type]}
            />
        );
    }

    displayHistoricalPortfolioValues() {
        if (
            !this.state.historicalPortfolioValues.length ||
            this.state.settings === null
        ) {
            return <Loader />;
        }

        return (
            <CombinedChart
                dataKey="month"
                barDataKey="total"
                lineKeys={this.state.settings.components}
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
                lineKeys={['total']}
                data={this.state.historicalPortfolioValues}
            />
        );
    }

    async fetch(url, stateProperty, transformerFunction) {
        fetch(API_URL + url)
            .then(response => response.json())
            .then(data => {
                const state = {
                    ...this.state,
                };
                data =
                    transformerFunction !== undefined
                        ? transformerFunction(data)
                        : data;

                state[stateProperty] = data;
                this.setState(state);
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    fetchData() {
        this.fetch('/api/settings', 'settings');
        this.fetch(
            '/api/portfolio-value?dateStart=2021-01-01&dateEnd=2021-12-31',
            'portfolioValues'
        );
        this.fetch('/api/rent?limit=3', 'rentalIncome', data => {
            return sumBy(data, 'net') / 3;
        });
        this.fetch('/api/passive-income', 'passiveIncome');
        this.fetch(
            `/api/interests?type=monthly_passive_income&year=${this.state.year}`,
            'monthlyPassiveIncomeData',
            data => {
                return this.groupBy(data, 'month', 'net');
            }
        );
        this.fetch(
            `/api/interests?type=daily_passive_income&start=${dailyPassiveIncomeStartDate}`,
            'dailyPassiveIncomeData'
        );
        this.fetch(
            '/api/portfolio-value?type=by_month&dateStart=2021-01-01&dateEnd=2021-12-31',
            'historicalPortfolioValues',
            data => {
                return this.groupBy(data, 'month', 'value');
            }
        );
        this.fetch('/api/cash', 'availableCash', data => {
            return sumBy(data, 'cash');
        });
        this.fetch('/api/loans', 'loans', data => {
            return this.groupBy(data, 'month', 'sum');
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        return (
            <div className="App">
                <NavBar
                    yearChangeHandler={this.handleYearChange}
                    year={this.state.year}
                ></NavBar>
                <Grid container className={this.props.classes.root} spacing={1}>
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
                        {this.state.availableCash === null ? (
                            <Loader />
                        ) : (
                            <ScoreCard
                                title={'Available Cash'}
                                value={formatCurrency(this.state.availableCash)}
                            />
                        )}
                    </Grid>
                    <Grid item md={2} sm={6} xs={12}>
                        <ChartCard
                            title={'Portfolio breakdown'}
                            content={this.displayPieChart('portfolioValues')}
                        />
                    </Grid>
                    <Grid item md={2} sm={6} xs={12}>
                        <ChartCard
                            title={'Passive Income Breakdown'}
                            content={this.displayPassiveIncomeBreakdown()}
                        />
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <ChartCard
                            title="Daily Passive Income"
                            content={this.displayInterests(
                                'dailyPassiveIncomeData',
                                'day',
                                ['loss', 'net'],
                                true
                            )}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        {this.state.settings !== null ? (
                            <ChartCard
                                title="Monthly Passive Income"
                                content={this.displayInterests(
                                    'monthlyPassiveIncomeData',
                                    'month',
                                    this.state.settings.components
                                )}
                            />
                        ) : null}
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <ChartCard
                            title="Portfolio value change"
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
