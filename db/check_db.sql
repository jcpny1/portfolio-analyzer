/* When already in psql, execute a file. */
/*   \i fname                             */
/*   Table schema. */
/*   \d+ tblname   */
/* Database config */
/*   heroku config */
/* Database Id                  */
/*   select current_database(); */
/* Current DB config.                                              */
/*   select name, short_desc, setting from pg_settings order by 1; */
/* Enable Heroku's postgres extras           */
/*   heroku plugins:install heroku-pg-extras */
/*   then                                    */
/*     heroku pg:bloat                       */
/*     heroku pg:cache-hit                   */
/*     heroku pg:index-usage                 */
/*     heroku pg:vacuum_stats                */
/* Get better table stats from analyzer.                    */
/*   ALTER DATABASE d6bn9u0aop02jc SET default_statistics_target TO 10000; */
/* Update statistics (VERBOSE is optional). */
/*   analyze verbose;                       */
/* Reindex a table.          */
/*   REINDEX TABLE my_table; */
/* Check DB health.     */
/*   heroku pg:info     */
/*   heroku pg:diagnose */
/*   heroku pg:ps       */
/* Some watch commands.      */
/*   watch -n 3 -d free -m   */
/*   watch -d heroku pg:info */
/* Copy remote to local. (reverse direction is push)                */
/*   heroku pg:pull HEROKU_POSTGRESQL_MAGENTA mylocaldb --app sushi */

\pset footer off
\pset pager off

\echo Check number of instruments.
select count(*) from instruments;

\echo Check number of trades instruments.
select count(distinct instrument_id) from trades;

\echo Check number of trades (1 per instrument).
select count(*) from trades;

\echo Check number of series instruments.
select count(distinct instrument_id) from series;

\echo Check number of series data points.
select count(*) from series;

\echo Count dashed symbols in instruments, trades, series.
select count(*) as instrs from instruments where symbol like '%-%';
select count(*) as trades from trades, instruments where instruments.symbol like '%-%' and trades.instrument_id = instruments.id;
select count(distinct instrument_id) as series from series, instruments where instruments.symbol like '%-%' and series.instrument_id = instruments.id;

\echo Check for series records without an instrument.
\prompt 'continue' xxx
select distinct instrument_id from series where instrument_id not in (select id from instruments);

\echo Check for trade records without an instrument.
\prompt 'continue' xxx
select distinct instrument_id from trades where instrument_id not in (select id from instruments);

\echo Check for position records without an instrument.
\prompt 'continue' xxx
select distinct instrument_id from positions where instrument_id not in (select id from instruments);

\echo Check for $0 trades records.
\prompt 'continue' xxx
select symbol, trades.* from trades, instruments where trade_price = '0.0' and trades.instrument_id = instruments.id order by 1;

\echo Check for series records where low_price > high_price.
\prompt 'continue' xxx
select * from series where low_price > high_price;

\echo Check for multiple series data points in the current month.
\prompt 'continue' xxx
select instrument_id, symbol, count(*) from series, instruments where series_date >= date_trunc('month', current_timestamp) and series.instrument_id = instruments.id group by instrument_id, symbol having count(*) > 1 order by 3 desc, 2 asc;

\echo Check for multiple series data points in any month.
\prompt 'continue' xxx
select instrument_id, symbol, date_trunc('month', series_date), count(*) from series, instruments where series.instrument_id = instruments.id group by instrument_id, symbol, date_trunc('month', series_date)  having count(*) > 1 order by 4 desc, 2 asc, 3 asc;

\echo Count instruments without a current month series data point.
\prompt 'continue' xxx
select count(distinct instrument_id) from series where instrument_id not in (select instrument_id from series where series.series_date >= date_trunc('month', current_timestamp));

\echo Show instruments without a current month series data point.
\prompt 'continue' xxx
select distinct instrument_id, symbol, max(series_date) from series, instruments where series.instrument_id = instruments.id group by instrument_id, symbol having max(series_date) < date_trunc('month', current_timestamp) order by 3 asc, 2 asc;

\echo Show series start/end dates.
\prompt 'continue' xxx
select symbol, min(series_date), max(series_date), count(*) from series,instruments where series.instrument_id = instruments.id group by symbol order by count(*) desc, symbol;

\echo Check index funds series start/end dates.
\prompt 'continue' xxx
select symbol, min(series_date), max(series_date), count(*) from series,instruments where symbol in ('DIA','IWM','QQQ','SPY','URTH') and series.instrument_id = instruments.id group by symbol order by count(*),symbol;

