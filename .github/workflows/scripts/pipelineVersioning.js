module.exports.changeVersionToPackageJSON = (nextVersion) => {
  var fs = require('fs');
  fs.readFile(process.env.CLONE_DIR + '/package.json', (error, data) => {
    if (error) {
      console.log(error);
      process.exit(-1);
    } else {
      var p = JSON.parse(data);
      p.version = nextVersion;
      console.log('"' + p.name + '": "' + p.version + '",');
      fs.writeFile(
        process.env.CLONE_DIR + '/package.json',
        JSON.stringify(p, null, 2),
        'utf8',
        (err, dat) => {
          if (err) {
            console.log(err);
            process.exit(-1);
          }
        }
      );
    }
  });
};

module.exports.getNextVersion = (actualVersion, prevVersion) => {
  const increasePrevious = (aV, pV) => {
    var iV = [];
    var pVA = pV.split('.');
    aV.split('.').forEach((aVe, i) => {
      // increase the version num based on actual version element
      // if string -> increment the number at the index and continue
      iV[i] = aVe.match(/^[0-9]{1,}$/g) ? pVA[i] : parseInt(pVA[i]) + 1;
    });
    return iV.join('.');
  };
  // NVER="$([[ "${AVER}" =~ ^[0-9]X[0-9]X[0-9]$ ]] && echo ${AVER} || echo ${PVER} | sed -e 's/X/\./g' | awk -F. '{$2+=1; OFS="."; print $0}' | sed -e 's/\ /X/g')"
  // if number -> use actual and overwrite previous
  // if string -> increment based on pattern
  var ret = actualVersion.match(/^[0-9]{1,}\.[0-9]{1,}\.[0-9]{1,}$/gm)
    ? actualVersion
    : increasePrevious(actualVersion, prevVersion);
  if (ret.match(/^[0-9]{1,}\.[0-9]{1,}\.[0-9]{1,}$/gm)) {
    console.log(ret);
  } else {
    console.log('Error: ' + ret);
  }
};
