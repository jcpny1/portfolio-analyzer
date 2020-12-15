\t on
select * from pa_values;
select i.symbol, s.series_date, s.updated_at from series s, instruments i where s.updated_at > '2020-12-05 00:00:00' and i.id = s.instrument_id order by s.updated_at desc limit 1;
select count(*) series from series;
select i.symbol, s.trade_date, s.updated_at from trades s, instruments i where s.updated_at > '2020-12-05 00:00:00' and i.id = s.instrument_id order by s.updated_at desc limit 1;
select count(*) trades from trades;
\t off
