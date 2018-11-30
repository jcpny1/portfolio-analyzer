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

select count(*) as instruments from instruments;
select count(distinct instrument_id) as instruments, count(*) as trades from trades;
select count(distinct instrument_id) as instruments, count(*) as series from series;

\echo Count dashed symbols in instruments, trades, series.
select count(*) as instrs from instruments where symbol like '%-%';
SELECT COUNT(*) AS trades FROM trades WHERE instrument_id IN (SELECT id FROM instruments i WHERE symbol LIKE '%-%');
SELECT COUNT(DISTINCT instrument_id) AS series FROM series s INNER JOIN instruments i ON s.instrument_id = i.id WHERE i.symbol like '%-%';

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
SELECT symbol, t.* FROM trades t INNER JOIN instruments i ON t.instrument_id = i.id WHERE trade_price = '0.0';

\echo Check for series records where low_price > high_price.
\prompt 'continue' xxx
select * from series where low_price > high_price;

\echo Check for multiple series data points in the current month.
\prompt 'continue' xxx
SELECT instrument_id, symbol, COUNT(*) FROM series s INNER JOIN instruments i ON s.instrument_id = i.id WHERE series_date >= DATE_TRUNC('month', current_timestamp) GROUP BY instrument_id, symbol HAVING COUNT(*) > 1 ORDER BY 3 DESC, 2 ASC;

\echo Check for multiple series data points in any month.
\prompt 'continue' xxx
select instrument_id, symbol, date_trunc('month', series_date), count(*) from series s, instruments i where s.instrument_id = i.id group by instrument_id, symbol, date_trunc('month', series_date) having count(*) > 1 order by 4 desc, 2 asc, 3 asc;

\echo Count instruments without a current month series data point.
\prompt 'continue' xxx
select count(distinct instrument_id) from series where instrument_id not in (select distinct instrument_id from series where series.series_date >= date_trunc('month', current_timestamp));

\echo Show instruments without a current month series data point.
\prompt 'continue' xxx
select distinct instrument_id, symbol, max(series_date) from series, instruments where series.instrument_id = instruments.id group by instrument_id, symbol having max(series_date) < date_trunc('month', current_timestamp) order by 3 asc, 2 asc;

\echo Show series start/end dates.
\prompt 'continue' xxx
select symbol, min(series_date), max(series_date), count(*) from series,instruments where series.instrument_id = instruments.id group by symbol order by count(*) desc, symbol;

\echo Check index funds series start/end dates.
\prompt 'continue' xxx
select symbol, min(series_date), max(series_date), count(*) from series,instruments where symbol in ('DIA','IWM','QQQ','SPY','URTH') and series.instrument_id = instruments.id group by symbol order by count(*),symbol;

