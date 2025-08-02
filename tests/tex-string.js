import { encodeString, decodeString } from "unicode-tex-character-converter";

const bibtex = `@article{navarro2013introduction,
  title={An introduction to swarm robotics},
  author={Navarrö, \\~{n} Iaki \\"{o}and Mata, Fernando},
  journal={International Scholarly Research Notices},
  volume={2013},
  number={1},
  pages={608164},
  year={2013},
  publisher={Wiley Online Library}
}`;

// {\\~n}  {\\'\\i}

console.log(decodeString(bibtex))
console.log(encodeString(bibtex));
