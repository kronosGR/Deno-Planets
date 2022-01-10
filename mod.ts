import { join } from 'https://deno.land/std/path/mod.ts';
import { BufReader } from 'https://deno.land/std/io/mod.ts';
import { parse } from 'https://deno.land/std/encoding/csv.ts';

async function loadPlanetsData() {
  const path = join('.', 'NASA exoplanet archive.csv');
  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  const results = await parse(bufReader, {
    skipFirstRow: true,
    comment: '#',
  });

  Deno.close(file.rid);
  console.log(results);
}

loadPlanetsData();
