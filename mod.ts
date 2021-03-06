import { join } from 'https://deno.land/std/path/mod.ts';
import { BufReader } from 'https://deno.land/std/io/mod.ts';
import { parse } from 'https://deno.land/std/encoding/csv.ts';

import * as _ from 'https://raw.githubusercontent.com/lodash/lodash/es/lodash.js';

interface Planet {
  [key: string]: string;
}

async function loadPlanetsData() {
  const path = join('.', 'NASA exoplanet archive.csv');
  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    skipFirstRow: true,
    comment: '#',
  });

  Deno.close(file.rid);

  const planets = (result as Array<Planet>).filter((planet) => {
    const planetaryRadius = +planet['koi_prad'];
    const stellarMass = +planet['koi_smass'];
    const stellarRadius = +planet['koi_srad'];
    return (
      planet['koi_disposition'] === 'CONFIRMED' &&
      planetaryRadius > 0.5 &&
      planetaryRadius < 1.5 &&
      stellarMass > 0.78 &&
      stellarMass < 1.04 &&
      stellarRadius > 0.99 &&
      stellarRadius < 1.01
    );
  });

  return planets.map((planet) => {
    return _.pick(planet, [
      "koi_prad", "koi_smass", "koi_srad", "kepler_name", "koi_count"
    ])
  })
}

const newEarths = await loadPlanetsData();
for (const planet of newEarths) {
  console.log(planet);
}
console.log(`${newEarths.length} habitable planets found`);
