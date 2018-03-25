/* Use \i to execute this file in psql. */
/* \d+ tblname - for schema. */

\pset footer off
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

\echo Count dashed symbols in instruments vs trades vs series.
select count(*) as instruments from instruments where symbol like '%-%';
select count(*) as trades from trades, instruments where instruments.symbol like '%-%' and trades.instrument_id = instruments.id;
\pset footer on
select distinct instrument_id as series_instr, symbol from series, instruments where instruments.symbol like '%-%' and series.instrument_id = instruments.id;

\echo Check for orphaned series records.
\prompt 'continue' xxx
select distinct instrument_id from series where instrument_id not in (select id from instruments);

\echo Check for orphaned trade records.
\prompt 'continue' xxx
select distinct instrument_id from trades where instrument_id not in (select id from instruments);

\echo Check for orphaned position records.
\prompt 'continue' xxx
select distinct instrument_id from positions where instrument_id not in (select id from instruments);

\echo Check for bad trades records.
\prompt 'continue' xxx
select symbol, trades.* from trades, instruments where trade_price = '0.0' and trades.instrument_id = instruments.id order by 1;

\echo Check for bad series records.
\prompt 'continue' xxx
select * from series where low_price > high_price;

\echo Check for multiple data points in the current month.
\prompt 'continue' xxx
select instrument_id, symbol, count(*) from series, instruments where series_date >= date_trunc('month', current_timestamp) and series.instrument_id = instruments.id group by instrument_id, symbol having count(*) > 1 order by 3 desc, 2 asc;

\echo Check for multiple data points in any month.
\prompt 'continue' xxx
select instrument_id, symbol, date_trunc('month', series_date), count(*) from series, instruments where series.instrument_id = instruments.id group by instrument_id, symbol, date_trunc('month', series_date)  having count(*) > 1 order by 4 desc, 2 asc, 3 asc;

\echo Check for instruments that are not current.
\prompt 'continue' xxx
select count(distinct instrument_id) from series where instrument_id not in (select instrument_id from series where series.series_date >= date_trunc('month', current_timestamp));

\echo Show instruments that are not current.
\prompt 'continue' xxx
select distinct instrument_id, symbol, max(series_date) from series, instruments where series.instrument_id = instruments.id group by instrument_id, symbol having max(series_date) < date_trunc('month', current_timestamp) order by 3 asc, 2 asc;

